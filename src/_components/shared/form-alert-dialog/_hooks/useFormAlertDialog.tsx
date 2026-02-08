'use client'

import {
    FormAlertDialogContext,
    IFormAlertDialogOptions,
} from '@/_components/shared/form-alert-dialog/_context/context'
import { use } from 'react'

export function useFormAlertDialog() {
    const { onDataChange } = use(FormAlertDialogContext)

    const alertDialog = (
        message: string,
        options?: IFormAlertDialogOptions
    ) => {
        const { title, ...restOptions } = options ?? {}

        const promiseWithResolvers = Promise.withResolvers<boolean>()

        onDataChange({
            title: title ?? message,
            type: 'alert',
            isOpen: true,
            promiseWithResolvers,
            ...restOptions,
        })

        return promiseWithResolvers?.promise
    }

    const confirmDialog = (
        message: string,
        options?: IFormAlertDialogOptions
    ) => {
        const { title, ...restOptions } = options ?? {}

        const promiseWithResolvers = Promise.withResolvers<boolean>()

        onDataChange({
            title: title ?? message,
            type: 'confirm',
            isOpen: true,
            promiseWithResolvers,
            ...restOptions,
        })

        return promiseWithResolvers?.promise
    }

    return {
        alertDialog,
        confirmDialog,
    }
}
