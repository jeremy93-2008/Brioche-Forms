'use client'

import { Button } from '@/_components/ui/button'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/_components/ui/dialog'
import { ToastMessages } from '@/_constants/toast'
import { useServerActionState } from '@/_hooks/useServerActionState'
import { IReturnAction } from '@/_server/_handlers/actions/types'
import { showToastFromResult } from '@/_utils/showToastFromResult'
import React, { createContext, use, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

const FormFieldEditDialogCtx = createContext({
    isOpen: false,
    setIsOpen: () => {},
    title: '',
    serverAction: () =>
        new Promise((res) => res({ status: 'success', data: [] })),
    saveButtonText: 'Guardar',
    cancelButtonText: 'Cancelar',
} as {
    isOpen: boolean
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
    title: string
    serverAction: (arg: any) => Promise<IReturnAction<any>>
    afterSave?: (
        isSuccess: boolean,
        fields: any,
        result: IReturnAction<any>
    ) => void
    saveButtonText?: string
    cancelButtonText?: string
    saveButtonVariant?:
        | 'secondary'
        | 'link'
        | 'default'
        | 'destructive'
        | 'outline'
        | 'ghost'
        | null
    cancelButtonVariant?:
        | 'secondary'
        | 'link'
        | 'default'
        | 'destructive'
        | 'outline'
        | 'ghost'
        | null
    successMessage?: string
    errorMessage?: string
})

interface IFormFieldEditDialogProps<T extends Record<string, any>>
    extends React.PropsWithChildren {
    title: string
    serverAction: (arg: any) => Promise<IReturnAction<any>>
    afterSave?: (
        isSuccess: boolean,
        fields: T,
        result: IReturnAction<any>
    ) => void
    saveButtonText?: string
    cancelButtonText?: string
    saveButtonVariant?:
        | 'secondary'
        | 'link'
        | 'default'
        | 'destructive'
        | 'outline'
        | 'ghost'
        | null
    cancelButtonVariant?:
        | 'secondary'
        | 'link'
        | 'default'
        | 'destructive'
        | 'outline'
        | 'ghost'
        | null
    successMessage?: string
    errorMessage?: string
}

export type IFormFieldEditDialogContentChildrenOpts = {
    handleKeyUp: (event: React.KeyboardEvent<HTMLInputElement>) => void
}

interface IFormFieldEditDialogContentProps<T> {
    className?: string
    // children is a function that receives the form methods
    children: (
        form: ReturnType<typeof useForm<Partial<T>>>,
        opts: IFormFieldEditDialogContentChildrenOpts
    ) => React.ReactNode
}

export function FormFieldEditDialog<T extends Record<string, any>>(
    props: IFormFieldEditDialogProps<T>
) {
    const {
        title,
        serverAction,
        afterSave,
        saveButtonText,
        cancelButtonText,
        saveButtonVariant,
        cancelButtonVariant,
        successMessage,
        errorMessage,
    } = props

    const [isDialogOpen, setIsDialogOpen] = useState(false)

    return (
        <FormFieldEditDialogCtx
            value={{
                isOpen: isDialogOpen,
                setIsOpen: setIsDialogOpen,
                title,
                serverAction,
                afterSave,
                saveButtonText,
                cancelButtonText,
                saveButtonVariant,
                cancelButtonVariant,
                successMessage,
                errorMessage,
            }}
        >
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <section
                    className="dialog-stop-propagation"
                    onClick={(evt) => evt.stopPropagation()}
                >
                    {props.children}
                </section>
            </Dialog>
        </FormFieldEditDialogCtx>
    )
}

export function FormFieldEditDialogTrigger(props: React.PropsWithChildren) {
    const { children } = props
    return (
        <DialogTrigger onClick={(evt) => evt.stopPropagation()} asChild>
            {children}
        </DialogTrigger>
    )
}

export function FormFieldEditDialogContent<T>(
    props: IFormFieldEditDialogContentProps<T>
) {
    const {
        isOpen,
        setIsOpen: setIsDialogOpen,
        title,
        serverAction,
        afterSave,
        saveButtonText,
        cancelButtonText,
        saveButtonVariant,
        cancelButtonVariant,
        successMessage,
        errorMessage,
    } = use(FormFieldEditDialogCtx)

    const { isPending, runAction: runEditFormAction } =
        useServerActionState(serverAction)

    const form = useForm<Partial<T>>()

    const onEditTitle = async (data: Partial<T>) => {
        if (isPending) return
        const result = (await runEditFormAction(
            data
        )) as unknown as IReturnAction<T>

        showToastFromResult(
            result,
            successMessage ?? ToastMessages.genericSuccess,
            errorMessage ??
                (result.status === 'error'
                    ? result.error.message
                    : ToastMessages.genericError)
        )

        if (afterSave) {
            afterSave(result.status === 'success', data, result)
        }

        setIsDialogOpen(false)
    }

    const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            form.handleSubmit(onEditTitle)()
        }
    }

    useEffect(() => {
        form.reset()
    }, [form, isOpen])

    return (
        <DialogContent className={props.className}>
            <DialogHeader>
                <DialogTitle>{title}</DialogTitle>
            </DialogHeader>
            <section className="mt-2">
                {props.children(form, { handleKeyUp })}
            </section>
            <DialogFooter className="mt-4">
                <DialogClose asChild>
                    <Button variant={cancelButtonVariant ?? 'outline'}>
                        {cancelButtonText ?? 'Cancelar'}
                    </Button>
                </DialogClose>
                <Button
                    onClick={form.handleSubmit(onEditTitle)}
                    variant={saveButtonVariant ?? 'secondary'}
                    isLoading={isPending}
                >
                    {saveButtonText ?? 'Guardar'}
                </Button>
            </DialogFooter>
        </DialogContent>
    )
}
