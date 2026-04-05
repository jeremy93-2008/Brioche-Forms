'use client'
import { IReturnAction } from '@/_server/_handlers/actions/types'
import React, { createContext, useEffect, useRef, useState } from 'react'

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
    markDirtyAndFlush: (entry: DirtyEntry) => void
    flushNow: () => void
    clearDirty: (id: string) => void
    retrySave: () => void
    saveStatus: SaveStatus
}

export const AutoSaveContext = createContext<IAutoSaveContext>({
    markDirty: () => {},
    markDirtyAndFlush: () => {},
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

interface AutoSaveInternalState {
    dirtyMap: Map<string, DirtyEntry>
    debounceTimer: ReturnType<typeof setTimeout> | null
    savedTimer: ReturnType<typeof setTimeout> | null
    retryTimer: ReturnType<typeof setTimeout> | null
    isSaving: boolean
    pendingFlush: boolean
    retryCount: number
}

export function AutoSaveProvider(props: IAutoSaveProviderProps) {
    const { formId, saveAction, children } = props
    const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')

    const internalState = useRef<AutoSaveInternalState>({
        dirtyMap: new Map(),
        debounceTimer: null,
        savedTimer: null,
        retryTimer: null,
        isSaving: false,
        pendingFlush: false,
        retryCount: 0,
    })

    const propsRef = useRef({ formId, saveAction })
    propsRef.current = { formId, saveAction }

    const buildPayload = (): IBulkUpdatePayload | null => {
        const entries = Array.from(internalState.current.dirtyMap.values())
        if (entries.length === 0) return null

        const payload: IBulkUpdatePayload = {
            form_id: propsRef.current.formId,
        }

        const texts = entries.filter((entry) => entry.type === 'text')
        const images = entries.filter((entry) => entry.type === 'image')
        const videos = entries.filter((entry) => entry.type === 'video')
        const questions = entries.filter((entry) => entry.type === 'question')

        if (texts.length > 0) payload.texts = texts.map((entry) => entry.payload)
        if (images.length > 0) payload.images = images.map((entry) => entry.payload)
        if (videos.length > 0) payload.videos = videos.map((entry) => entry.payload)
        if (questions.length > 0)
            payload.questions = questions.map((entry) => entry.payload)

        return payload
    }

    const flush = async () => {
        const current = internalState.current

        if (current.isSaving) {
            current.pendingFlush = true
            return
        }

        const payload = buildPayload()
        if (!payload) return

        const savingIds = Array.from(current.dirtyMap.keys())
        current.isSaving = true
        setSaveStatus('saving')

        if (current.savedTimer) {
            clearTimeout(current.savedTimer)
            current.savedTimer = null
        }

        try {
            const result = await propsRef.current.saveAction(payload)

            if (result.status === 'success') {
                for (const id of savingIds) current.dirtyMap.delete(id)
                current.retryCount = 0
                setSaveStatus('saved')
                current.savedTimer = setTimeout(() => {
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
            current.isSaving = false
            if (current.pendingFlush) {
                current.pendingFlush = false
                flush()
            }
        }
    }

    const scheduleRetry = () => {
        const current = internalState.current
        if (current.retryCount >= MAX_RETRIES) return
        const delay = RETRY_DELAYS[current.retryCount] ?? 20000
        current.retryCount++
        current.retryTimer = setTimeout(flush, delay)
    }

    const cancelDebounce = () => {
        const current = internalState.current
        if (current.debounceTimer) {
            clearTimeout(current.debounceTimer)
            current.debounceTimer = null
        }
    }

    const startDebounce = () => {
        cancelDebounce()
        internalState.current.debounceTimer = setTimeout(flush, DEBOUNCE_MS)
    }

    const cancelRetryTimer = () => {
        const current = internalState.current
        if (current.retryTimer) {
            clearTimeout(current.retryTimer)
            current.retryTimer = null
        }
    }

    const registerDirtyEntry = (entry: DirtyEntry) => {
        internalState.current.dirtyMap.set(entry.id, entry)
        internalState.current.retryCount = 0
        cancelRetryTimer()
    }

    const contextValue = useRef<IAutoSaveContext>({
        markDirty(entry: DirtyEntry) {
            registerDirtyEntry(entry)
            startDebounce()
        },
        markDirtyAndFlush(entry: DirtyEntry) {
            registerDirtyEntry(entry)
            cancelDebounce()
            flush()
        },
        flushNow() {
            cancelDebounce()
            flush()
        },
        clearDirty(id: string) {
            internalState.current.dirtyMap.delete(id)
        },
        retrySave() {
            internalState.current.retryCount = 0
            cancelRetryTimer()
            flush()
        },
        saveStatus: 'idle',
    })

    contextValue.current.saveStatus = saveStatus

    useEffect(() => {
        return () => {
            const current = internalState.current
            if (current.debounceTimer) clearTimeout(current.debounceTimer)
            if (current.retryTimer) clearTimeout(current.retryTimer)
            if (current.savedTimer) clearTimeout(current.savedTimer)
        }
    }, [])

    useEffect(() => {
        const handler = (event: BeforeUnloadEvent) => {
            const current = internalState.current
            if (current.dirtyMap.size > 0 || current.isSaving) {
                event.preventDefault()
            }
        }
        window.addEventListener('beforeunload', handler)
        return () => window.removeEventListener('beforeunload', handler)
    }, [])

    return (
        <AutoSaveContext
            value={{
                ...contextValue.current,
                saveStatus,
            }}
        >
            {children}
        </AutoSaveContext>
    )
}
