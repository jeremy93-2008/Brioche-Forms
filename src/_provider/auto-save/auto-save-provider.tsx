'use client'
import { IReturnAction } from '@/_server/_handlers/actions/types'
import { useAutoSaveEngine } from '@/_provider/auto-save/hooks/useAutoSaveEngine'
import { ISaveStatus, useSaveStatus } from '@/_provider/auto-save/hooks/useSaveStatus'
import { IDirtyEntry } from '@/_provider/auto-save/types'
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

    const {
        saveStatus,
        beginSave,
        endSave,
        trackExternalSave,
        isActive,
        latestSaveTime,
    } = useSaveStatus()

    const {
        markDirty,
        markDirtyAndFlush,
        flushNow,
        clearDirty,
        retrySave,
        hasPendingChanges,
        cleanup: engineCleanup,
    } = useAutoSaveEngine({
        formId,
        saveAction,
        beginSave,
        endSave,
        isActive,
    })

    useEffect(() => {
        return () => engineCleanup()
    }, [engineCleanup])

    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            if (hasPendingChanges() || isActive()) {
                event.preventDefault()
            }
        }
        window.addEventListener('beforeunload', handleBeforeUnload)
        return () => window.removeEventListener('beforeunload', handleBeforeUnload)
    }, [hasPendingChanges, isActive])

    return (
        <AutoSaveContext
            value={{
                markDirty,
                markDirtyAndFlush,
                flushNow,
                clearDirty,
                retrySave,
                trackExternalSave,
                saveStatus,
                latestSaveTime,
            }}
        >
            {children}
        </AutoSaveContext>
    )
}
