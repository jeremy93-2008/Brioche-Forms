'use client'
import { IReturnAction } from '@/_server/_handlers/actions/types'
import { IAutoSaveEngineState, useAutoSaveEngine } from '@/_provider/auto-save/hooks/useAutoSaveEngine'
import { ISaveStatus, useSaveStatus } from '@/_provider/auto-save/hooks/useSaveStatus'
import React, { createContext, useEffect } from 'react'

export type { ISaveStatus } from '@/_provider/auto-save/hooks/useSaveStatus'
export type { IDirtyEntry, DirtyEntryType } from '@/_provider/auto-save/types'
export type { IBulkUpdatePayload } from '@/_provider/auto-save/types'

const passThroughTrack = <T,>(promise: Promise<IReturnAction<T>>) => promise

interface IAutoSaveContext {
    markDirty: (entry: IDirtyEntry) => void
    markDirtyAndFlush: (entry: IDirtyEntry) => void
    flushNow: () => void
    clearDirty: (id: string) => void
    retrySave: () => void
    trackExternalSave: <T>(
        promise: Promise<IReturnAction<T>>
    ) => Promise<IReturnAction<T>>
    saveStatus: ISaveStatus
    latestSaveTime: () => number | null
}

import { IDirtyEntry } from '@/_provider/auto-save/types'

export const AutoSaveContext = createContext<IAutoSaveContext>({
    markDirty: () => {},
    markDirtyAndFlush: () => {},
    flushNow: () => {},
    clearDirty: () => {},
    retrySave: () => {},
    trackExternalSave: passThroughTrack,
    saveStatus: 'idle',
    latestSaveTime: () => null,
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ISaveActionFn = (payload: any) => Promise<IReturnAction<any>>

interface IAutoSaveProviderProps extends React.PropsWithChildren {
    formId: string
    saveAction: ISaveActionFn
}

export function AutoSaveProvider(props: IAutoSaveProviderProps) {
    const { formId, saveAction, children } = props

    const saveStatus = useSaveStatus()
    const engine = useAutoSaveEngine({
        formId,
        saveAction,
        beginSave: saveStatus.beginSave,
        endSave: saveStatus.endSave,
        isActive: saveStatus.isActive,
    })

    useEffect(() => {
        return () => {
            engine.cleanup()
            saveStatus.cleanup()
        }
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        const handler = (event: BeforeUnloadEvent) => {
            if (engine.hasPendingChanges() || saveStatus.isActive()) {
                event.preventDefault()
            }
        }
        window.addEventListener('beforeunload', handler)
        return () => window.removeEventListener('beforeunload', handler)
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <AutoSaveContext
            value={{
                ...engine.actions,
                trackExternalSave: saveStatus.trackExternalSave,
                saveStatus: saveStatus.saveStatus,
                latestSaveTime: saveStatus.latestSaveTime,
            }}
        >
            {children}
        </AutoSaveContext>
    )
}
