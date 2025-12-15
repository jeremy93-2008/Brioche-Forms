import { findFormObjectById } from '@/_provider/forms/helpers/findFormObjectById'
import { findPositionFormObjectById } from '@/_provider/forms/helpers/findPositionFormObjectById'
import { IFullForm } from '@/_server/domains/form/getFullForms'

export function deleteById<T extends { id: string }>(
    currentState: IFullForm,
    optimisticData: T
) {
    if (!findFormObjectById(currentState, optimisticData.id))
        return currentState

    const { parent, idx, childName } = findPositionFormObjectById(
        currentState,
        optimisticData.id
    )

    if (parent !== null && idx !== null && childName !== null) {
        ;(parent as any)[childName] = (parent as any)[childName].filter(
            (item: any, index: number) => index !== idx
        )
        return { ...currentState }
    }

    return currentState
}
