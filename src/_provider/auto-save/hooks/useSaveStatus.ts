import { IReturnAction } from '@/_server/_handlers/actions/types'
import { useRef, useState } from 'react'

export type ISaveStatus = 'idle' | 'saving' | 'saved' | 'error'

const SAVED_DISPLAY_MS = 3000

export function useSaveStatus() {
    const [saveStatus, setSaveStatus] = useState<ISaveStatus>('idle')

    const activeSaveCount = useRef(0)
    const latestSaveTime = useRef<number | null>(null)
    const savedTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

    const clearSavedTimer = () => {
        if (savedTimer.current) {
            clearTimeout(savedTimer.current)
            savedTimer.current = null
        }
    }

    const beginSave = () => {
        activeSaveCount.current++
        clearSavedTimer()
        setSaveStatus('saving')
    }

    const endSave = (success: boolean) => {
        activeSaveCount.current = Math.max(0, activeSaveCount.current - 1)
        if (activeSaveCount.current > 0) return

        if (success) {
            setSaveStatus('saved')
            latestSaveTime.current = Date.now()
        } else {
            setSaveStatus('error')
        }
    }

    const trackExternalSave = async <T>(
        promise: Promise<IReturnAction<T>>
    ): Promise<IReturnAction<T>> => {
        beginSave()
        try {
            const result = await promise
            endSave(result.status === 'success')
            return result
        } catch (error) {
            endSave(false)
            throw error
        }
    }

    const cleanup = () => clearSavedTimer()

    return {
        saveStatus,
        beginSave,
        endSave,
        trackExternalSave,
        isActive: () => activeSaveCount.current > 0,
        latestSaveTime: () => latestSaveTime.current,
        cleanup,
    }
}
