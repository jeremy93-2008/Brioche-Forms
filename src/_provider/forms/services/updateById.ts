import { findFormObjectById } from '@/_provider/forms/helpers/findFormObjectById'
import { IFullForm } from '@/_server/domains/form/getFullForms'

export function updateById<T extends { id: string }>(
    currentState: IFullForm,
    optimisticData: T
) {
    const obj = findFormObjectById(currentState, optimisticData.id)
    if (obj) {
        Object.assign(obj, optimisticData)
        return { ...currentState }
    }
    return currentState
}
