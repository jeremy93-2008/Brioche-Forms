import { findFormObjectById } from '@/_provider/forms/helpers/findFormObjectById'
import { IUpdateOptimisticData } from '@/_provider/forms/single-form-selected'
import { IFullForm } from '@/_server/domains/form/getFullForms'

export function createById(
    currentState: IFullForm,
    optimisticData: IUpdateOptimisticData<any>
) {
    const { newUpdateValue, opts } = optimisticData

    if (opts.type !== 'create') {
        return currentState
    }

    if (findFormObjectById(currentState, newUpdateValue.id)) return currentState

    const { parentId, fieldName } = opts

    const obj = findFormObjectById(currentState, parentId)

    if (
        obj &&
        (obj as any)[fieldName] &&
        Array.isArray((obj as any)[fieldName])
    ) {
        if (fieldName === 'pages') {
            ;(obj as any)[fieldName].push({ ...newUpdateValue, sections: [] })
            return { ...currentState }
        }
        if (fieldName === 'sections') {
            ;(obj as any)[fieldName].push({
                ...newUpdateValue,
                texts: [],
                images: [],
                videos: [],
                questions: [],
            })
            return { ...currentState }
        }
        ;(obj as any)[fieldName].push(newUpdateValue)
        return { ...currentState }
    }

    return currentState
}
