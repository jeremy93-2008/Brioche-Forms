import { useAfterSaveOptimisticData } from '@/_hooks/useAfterSaveOptimisticData/useAfterSaveOptimisticData'
import { IReturnAction, IReturnActionOnSuccess, } from '@/_server/_handlers/actions/types'
import { flushSync } from 'react-dom'

export function useAfterSavePageTabs() {
    const { handleAfterSave } = useAfterSaveOptimisticData()

    const handleAfterSaveWhenDeleted =
        (cb: () => void) =>
        (isSuccess: boolean, updatedData: any, result: IReturnAction<any>) => {
            if (!isSuccess) return
            const afterSave = handleAfterSave({ type: 'delete' })

            flushSync(() => {
                afterSave(
                    isSuccess,
                    {
                        ...updatedData,
                        ...(result as IReturnActionOnSuccess<any>).data,
                    },
                    result
                )
            })

            cb()
        }

    const handleAfterSaveWhenCreated =
        (pageId: string, cb: () => void) =>
        (isSuccess: boolean, updatedData: any, result: IReturnAction<any>) => {
            if (!isSuccess) return
            const afterSave = handleAfterSave({
                type: 'create',
                parentId: pageId,
                fieldName: 'pages',
            })

            flushSync(() => {
                afterSave(
                    isSuccess,
                    {
                        ...updatedData,
                        ...(result as IReturnActionOnSuccess<any>).data,
                    },
                    result
                )
            })

            cb()
        }

    return {
        handleAfterSaveWhenDeleted,
        handleAfterSaveWhenCreated,
    }
}
