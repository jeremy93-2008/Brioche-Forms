import { IReturnAction } from '@/_server/_handlers/actions/types'
import { IDirtyEntry } from '@/_provider/auto-save/types'
import { useDebouncedCallback } from '@/_provider/auto-save/hooks/useDebouncedCallback'
import { useDirtyTracker } from '@/_provider/auto-save/hooks/useDirtyTracker'
import { useRetryStrategy } from '@/_provider/auto-save/hooks/useRetryStrategy'
import { useRef } from 'react'

const DEBOUNCE_MS = 1500
const RETRY_CONFIG = { maxRetries: 3, delays: [5000, 10000, 20000] }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ISaveActionFn = (payload: any) => Promise<IReturnAction<any>>

interface IAutoSaveEngineDeps {
    formId: string
    saveAction: ISaveActionFn
    beginSave: () => void
    endSave: (success: boolean) => void
    isActive: () => boolean
}

export function useAutoSaveEngine(deps: IAutoSaveEngineDeps) {
    const { formId, saveAction, beginSave, endSave, isActive } = deps

    const dirtyTracker = useDirtyTracker(formId)
    const debounce = useDebouncedCallback(DEBOUNCE_MS)
    const retry = useRetryStrategy(RETRY_CONFIG)
    const pendingFlush = useRef(false)

    const flush = async () => {
        if (isActive()) {
            pendingFlush.current = true
            return
        }

        const snapshot = dirtyTracker.snapshot()
        if (!snapshot) return

        beginSave()

        try {
            const result = await saveAction(snapshot.payload)
            const success = result.status === 'success'

            if (success) {
                dirtyTracker.clearMany(snapshot.ids)
                retry.resetRetryCount()
            } else {
                retry.scheduleRetry(flush)
            }

            endSave(success)
        } catch {
            retry.scheduleRetry(flush)
            endSave(false)
        } finally {
            if (pendingFlush.current) {
                pendingFlush.current = false
                flush()
            }
        }
    }

    const markDirty = (entry: IDirtyEntry) => {
        dirtyTracker.register(entry)
        retry.resetRetryCount()
        debounce.schedule(flush)
    }

    const markDirtyAndFlush = (entry: IDirtyEntry) => {
        dirtyTracker.register(entry)
        retry.resetRetryCount()
        debounce.flushSync(flush)
    }

    const flushNow = () => {
        debounce.flushSync(flush)
    }

    const retrySave = () => {
        retry.resetRetryCount()
        flush()
    }

    const cleanup = () => {
        debounce.cleanup()
        retry.cleanup()
    }

    return {
        markDirty,
        markDirtyAndFlush,
        flushNow,
        clearDirty: dirtyTracker.clear,
        retrySave,
        hasPendingChanges: dirtyTracker.hasPendingChanges,
        cleanup,
    }
}
