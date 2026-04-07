import { DirtyEntryType, IDirtyEntry, IBulkUpdatePayload } from '@/_provider/auto-save/types'
import { useRef } from 'react'

export function useDirtyTracker(formId: string) {
    const dirtyMap = useRef(new Map<string, IDirtyEntry>())

    const register = (entry: IDirtyEntry) => {
        dirtyMap.current.set(entry.id, entry)
    }

    const clear = (id: string) => {
        dirtyMap.current.delete(id)
    }

    const clearMany = (ids: string[]) => {
        for (const id of ids) dirtyMap.current.delete(id)
    }

    const hasPendingChanges = () => dirtyMap.current.size > 0

    const snapshot = (): { ids: string[]; payload: IBulkUpdatePayload } | null => {
        const entries = Array.from(dirtyMap.current.values())
        if (entries.length === 0) return null

        const payload: IBulkUpdatePayload = { form_id: formId }
        const grouped = Object.groupBy(entries, (entry) => entry.type)

        const typeToKey = {
            text: 'texts',
            image: 'images',
            video: 'videos',
            question: 'questions',
        } as const satisfies Record<DirtyEntryType, keyof Omit<IBulkUpdatePayload, 'form_id'>>

        for (const entryType of Object.keys(typeToKey) as DirtyEntryType[]) {
            const group = grouped[entryType]
            if (group?.length) {
                payload[typeToKey[entryType]] = group.map((entry) => entry.payload)
            }
        }

        return {
            ids: Array.from(dirtyMap.current.keys()),
            payload,
        }
    }

    return { register, clear, clearMany, hasPendingChanges, snapshot }
}
