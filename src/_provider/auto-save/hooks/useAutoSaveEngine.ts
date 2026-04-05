import { IReturnAction } from '@/_server/_handlers/actions/types'
import { IDirtyEntry, IBulkUpdatePayload } from '@/_provider/auto-save/types'
import { useRef } from 'react'

const DEBOUNCE_MS = 1500
const MAX_RETRIES = 3
const RETRY_DELAYS = [5000, 10000, 20000]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SaveActionFn = (payload: any) => Promise<IReturnAction<any>>

export interface IAutoSaveEngineState {
    dirtyMap: Map<string, IDirtyEntry>
    debounceTimer: ReturnType<typeof setTimeout> | null
    retryTimer: ReturnType<typeof setTimeout> | null
    pendingFlush: boolean
    retryCount: number
}

interface IAutoSaveEngineDeps {
    formId: string
    saveAction: SaveActionFn
    beginSave: () => void
    endSave: (success: boolean) => void
    isActive: () => boolean
}

export function useAutoSaveEngine(deps: IAutoSaveEngineDeps) {
    const depsRef = useRef(deps)
    depsRef.current = deps

    const state = useRef<IAutoSaveEngineState>({
        dirtyMap: new Map(),
        debounceTimer: null,
        retryTimer: null,
        pendingFlush: false,
        retryCount: 0,
    })

    const buildPayload = (): IBulkUpdatePayload | null => {
        const entries = Array.from(state.current.dirtyMap.values())
        if (entries.length === 0) return null

        const payload: IBulkUpdatePayload = {
            form_id: depsRef.current.formId,
        }

        const grouped = Object.groupBy(entries, (entry) => entry.type)

        if (grouped.text?.length)
            payload.texts = grouped.text.map((entry) => entry.payload)
        if (grouped.image?.length)
            payload.images = grouped.image.map((entry) => entry.payload)
        if (grouped.video?.length)
            payload.videos = grouped.video.map((entry) => entry.payload)
        if (grouped.question?.length)
            payload.questions = grouped.question.map((entry) => entry.payload)

        return payload
    }

    const flush = async () => {
        if (depsRef.current.isActive()) {
            state.current.pendingFlush = true
            return
        }

        const payload = buildPayload()
        if (!payload) return

        const savingIds = Array.from(state.current.dirtyMap.keys())
        depsRef.current.beginSave()

        try {
            const result = await depsRef.current.saveAction(payload)
            const success = result.status === 'success'

            if (success) {
                for (const id of savingIds) state.current.dirtyMap.delete(id)
                state.current.retryCount = 0
            } else {
                scheduleRetry()
            }

            depsRef.current.endSave(success)
        } catch {
            scheduleRetry()
            depsRef.current.endSave(false)
        } finally {
            if (state.current.pendingFlush) {
                state.current.pendingFlush = false
                flush()
            }
        }
    }

    const scheduleRetry = () => {
        if (state.current.retryCount >= MAX_RETRIES) return
        const delay = RETRY_DELAYS[state.current.retryCount] ?? 20000
        state.current.retryCount++
        state.current.retryTimer = setTimeout(flush, delay)
    }

    const cancelDebounce = () => {
        if (state.current.debounceTimer) {
            clearTimeout(state.current.debounceTimer)
            state.current.debounceTimer = null
        }
    }

    const cancelRetryTimer = () => {
        if (state.current.retryTimer) {
            clearTimeout(state.current.retryTimer)
            state.current.retryTimer = null
        }
    }

    const registerDirtyEntry = (entry: IDirtyEntry) => {
        state.current.dirtyMap.set(entry.id, entry)
        state.current.retryCount = 0
        cancelRetryTimer()
    }

    const actions = useRef({
        markDirty(entry: IDirtyEntry) {
            registerDirtyEntry(entry)
            cancelDebounce()
            state.current.debounceTimer = setTimeout(flush, DEBOUNCE_MS)
        },
        markDirtyAndFlush(entry: IDirtyEntry) {
            registerDirtyEntry(entry)
            cancelDebounce()
            flush()
        },
        flushNow() {
            cancelDebounce()
            flush()
        },
        clearDirty(id: string) {
            state.current.dirtyMap.delete(id)
        },
        retrySave() {
            state.current.retryCount = 0
            cancelRetryTimer()
            flush()
        },
    })

    const hasPendingChanges = () =>
        state.current.dirtyMap.size > 0

    const cleanup = () => {
        cancelDebounce()
        cancelRetryTimer()
    }

    return { actions: actions.current, hasPendingChanges, cleanup }
}
