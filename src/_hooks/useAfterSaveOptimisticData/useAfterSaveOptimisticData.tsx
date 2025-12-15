import {
    IUpdateOptimisticDataOpts,
    SingleFormSelectedContext,
} from '@/_provider/forms/single-form-selected'
import { IReturnAction } from '@/_server/_handlers/actions/types'
import { startTransition, use } from 'react'

export function useAfterSaveOptimisticData(
    defaultOpts?: IUpdateOptimisticDataOpts
) {
    const { updateOptimisticData } = use(SingleFormSelectedContext)!

    const afterSave = (
        isSuccess: boolean,
        updatedData: any,
        result: IReturnAction<any>,
        opts?: IUpdateOptimisticDataOpts
    ) => {
        if (!isSuccess) return
        startTransition(() => {
            updateOptimisticData({
                newUpdateValue: updatedData,
                opts: opts ??
                    defaultOpts ?? {
                        type: 'update',
                    },
            })
        })
    }

    const handleAfterSave =
        (opts: IUpdateOptimisticDataOpts) =>
        (isSuccess: boolean, updatedData: any, result: IReturnAction<any>) =>
            afterSave(isSuccess, updatedData, result, opts)

    return { afterSave, handleAfterSave }
}
