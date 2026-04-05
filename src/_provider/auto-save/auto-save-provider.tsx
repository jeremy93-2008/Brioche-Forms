'use client'
import { IReturnAction } from '@/_server/_handlers/actions/types'
import React, {
    createContext,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react'

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

export type DirtyEntryType = 'text' | 'image' | 'video' | 'question'

export interface DirtyEntry {
    type: DirtyEntryType
    id: string
    formId: string
    sectionId: string
    payload: Record<string, unknown>
}

export interface IBulkUpdatePayload {
    form_id: string
    texts?: Array<Record<string, unknown>>
    images?: Array<Record<string, unknown>>
    videos?: Array<Record<string, unknown>>
    questions?: Array<Record<string, unknown>>
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SaveActionFn = (payload: any) => Promise<IReturnAction<any>>

interface IAutoSaveContext {
    markDirty: (entry: DirtyEntry) => void
    flushNow: () => void
    clearDirty: (id: string) => void
    retrySave: () => void
    saveStatus: SaveStatus
}

export const AutoSaveContext = createContext<IAutoSaveContext>({
    markDirty: () => {},
    flushNow: () => {},
    clearDirty: () => {},
    retrySave: () => {},
    saveStatus: 'idle',
})

const DEBOUNCE_MS = 1500
const SAVED_DISPLAY_MS = 3000
const MAX_RETRIES = 3
const RETRY_DELAYS = [5000, 10000, 20000]

interface IAutoSaveProviderProps extends React.PropsWithChildren {
    formId: string
    saveAction: SaveActionFn
}

export function AutoSaveProvider(props: IAutoSaveProviderProps) {
    const { formId, saveAction, children } = props
    const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')

    const dirtyMapRef = useRef<Map<string, DirtyEntry>>(new Map())
    const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const isSavingRef = useRef(false)
    const pendingFlushRef = useRef(false)
    const retryCountRef = useRef(0)
    const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const savedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    const buildPayload = useCallback((): IBulkUpdatePayload | null => {
        const entries = Array.from(dirtyMapRef.current.values())
        if (entries.length === 0) return null

        const payload: IBulkUpdatePayload = { form_id: formId }

        const texts = entries.filter((e) => e.type === 'text')
        const images = entries.filter((e) => e.type === 'image')
        const videos = entries.filter((e) => e.type === 'video')
        const questions = entries.filter((e) => e.type === 'question')

        if (texts.length > 0) payload.texts = texts.map((e) => e.payload)
        if (images.length > 0) payload.images = images.map((e) => e.payload)
        if (videos.length > 0) payload.videos = videos.map((e) => e.payload)
        if (questions.length > 0)
            payload.questions = questions.map((e) => e.payload)

        return payload
    }, [formId])

    const flush = useCallback(async () => {
        if (isSavingRef.current) {
            pendingFlushRef.current = true
            return
        }

        const payload = buildPayload()
        if (!payload) return

        const savingIds = Array.from(dirtyMapRef.current.keys())

        isSavingRef.current = true
        setSaveStatus('saving')

        if (savedTimerRef.current) {
            clearTimeout(savedTimerRef.current)
            savedTimerRef.current = null
        }

        try {
            const result = await saveAction(payload)

            if (result.status === 'success') {
                for (const id of savingIds) {
                    dirtyMapRef.current.delete(id)
                }
                retryCountRef.current = 0
                setSaveStatus('saved')
                savedTimerRef.current = setTimeout(() => {
                    setSaveStatus((prev) =>
                        prev === 'saved' ? 'idle' : prev
                    )
                }, SAVED_DISPLAY_MS)
            } else {
                setSaveStatus('error')
                scheduleRetry()
            }
        } catch {
            setSaveStatus('error')
            scheduleRetry()
        } finally {
            isSavingRef.current = false
            if (pendingFlushRef.current) {
                pendingFlushRef.current = false
                flush()
            }
        }
    }, [buildPayload, saveAction])

    const scheduleRetry = useCallback(() => {
        if (retryCountRef.current >= MAX_RETRIES) return
        const delay = RETRY_DELAYS[retryCountRef.current] ?? 20000
        retryCountRef.current++
        retryTimerRef.current = setTimeout(() => {
            flush()
        }, delay)
    }, [flush])

    const cancelDebounce = useCallback(() => {
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current)
            debounceTimerRef.current = null
        }
    }, [])

    const startDebounce = useCallback(() => {
        cancelDebounce()
        debounceTimerRef.current = setTimeout(() => {
            flush()
        }, DEBOUNCE_MS)
    }, [cancelDebounce, flush])

    const markDirty = useCallback(
        (entry: DirtyEntry) => {
            dirtyMapRef.current.set(entry.id, entry)
            retryCountRef.current = 0
            if (retryTimerRef.current) {
                clearTimeout(retryTimerRef.current)
                retryTimerRef.current = null
            }
            startDebounce()
        },
        [startDebounce]
    )

    const flushNow = useCallback(() => {
        cancelDebounce()
        flush()
    }, [cancelDebounce, flush])

    const clearDirty = useCallback((id: string) => {
        dirtyMapRef.current.delete(id)
    }, [])

    const retrySave = useCallback(() => {
        retryCountRef.current = 0
        if (retryTimerRef.current) {
            clearTimeout(retryTimerRef.current)
            retryTimerRef.current = null
        }
        flush()
    }, [flush])

    useEffect(() => {
        return () => {
            if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)
            if (retryTimerRef.current) clearTimeout(retryTimerRef.current)
            if (savedTimerRef.current) clearTimeout(savedTimerRef.current)
        }
    }, [])

    useEffect(() => {
        const handler = (e: BeforeUnloadEvent) => {
            if (dirtyMapRef.current.size > 0 || isSavingRef.current) {
                e.preventDefault()
            }
        }
        window.addEventListener('beforeunload', handler)
        return () => window.removeEventListener('beforeunload', handler)
    }, [])

    return (
        <AutoSaveContext
            value={{
                markDirty,
                flushNow,
                clearDirty,
                retrySave,
                saveStatus,
            }}
        >
            {children}
        </AutoSaveContext>
    )
}
