import { IReturnAction } from '@/_server/_handlers/actions/types'
import { useRef, useState } from 'react'

export type ISaveStatus = 'idle' | 'saving' | 'saved' | 'error'

interface ISaveStatusState {
    activeSaveCount: number
    latestSaveTime: number | null
}

export function useSaveStatus() {
    const [saveStatus, setSaveStatus] = useState<ISaveStatus>('idle')

    const state = useRef<ISaveStatusState>({
        activeSaveCount: 0,
        latestSaveTime: null,
    })

    const beginSave = () => {
        state.current.activeSaveCount++
        setSaveStatus('saving')
    }

    const endSave = (success: boolean) => {
        state.current.activeSaveCount = Math.max(0, state.current.activeSaveCount - 1)
        if (state.current.activeSaveCount > 0) return

        if (success) {
            state.current.latestSaveTime = Date.now()
            setSaveStatus('saved')
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

    const isActive = () => state.current.activeSaveCount > 0
    const latestSaveTime = () => state.current.latestSaveTime

    return {
        saveStatus,
        beginSave,
        endSave,
        trackExternalSave,
        isActive,
        latestSaveTime,
    }
}
