'use client'

import { Button } from '@/_components/ui/button'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/_components/ui/dialog'
import { useServerActionState } from '@/_hooks/useServerActionState'
import { IReturnAction } from '@/_server/actions/types'
import React, { createContext, use, useState } from 'react'
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
    saveButtonText?: string
    cancelButtonText?: string
})

interface IFormFieldEditDialogProps extends React.PropsWithChildren {
    title: string
    serverAction: (arg: any) => Promise<IReturnAction<any>>
    saveButtonText?: string
    cancelButtonText?: string
}

type IFormFieldEditDialogContentChildrenOpts = {
    handleKeyUp: (event: React.KeyboardEvent<HTMLInputElement>) => void
}

interface IFormFieldEditDialogContentProps<T> {
    // children is a function that receives the form methods
    children: (
        form: ReturnType<typeof useForm<Partial<T>>>,
        opts: IFormFieldEditDialogContentChildrenOpts
    ) => React.ReactNode
}

export function FormFieldEditDialog(props: IFormFieldEditDialogProps) {
    const { title, serverAction, saveButtonText, cancelButtonText } = props

    const [isDialogOpen, setIsDialogOpen] = useState(false)

    return (
        <FormFieldEditDialogCtx
            value={{
                isOpen: isDialogOpen,
                setIsOpen: setIsDialogOpen,
                title,
                serverAction,
                saveButtonText,
                cancelButtonText,
            }}
        >
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                {props.children}
            </Dialog>
        </FormFieldEditDialogCtx>
    )
}

export function FormFieldEditDialogTrigger(props: React.PropsWithChildren) {
    const { children } = props
    return <DialogTrigger asChild>{children}</DialogTrigger>
}

export function FormFieldEditDialogContent<T>(
    props: IFormFieldEditDialogContentProps<T>
) {
    const {
        setIsOpen: setIsDialogOpen,
        title,
        serverAction,
        saveButtonText,
        cancelButtonText,
    } = use(FormFieldEditDialogCtx)

    const { isPending, runAction: runEditFormAction } =
        useServerActionState(serverAction)

    const form = useForm<Partial<T>>()

    const onEditTitle = async (data: Partial<T>) => {
        if (isPending) return
        await runEditFormAction(data)
        setIsDialogOpen(false)
    }

    const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            form.handleSubmit(onEditTitle)()
        }
    }

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{title}</DialogTitle>
                <DialogDescription className="mt-2">
                    {props.children(form, { handleKeyUp })}
                </DialogDescription>
                <DialogFooter className="mt-4">
                    <DialogClose asChild>
                        <Button variant="outline">
                            {cancelButtonText ?? 'Cancelar'}
                        </Button>
                    </DialogClose>
                    <Button
                        onClick={form.handleSubmit(onEditTitle)}
                        variant="secondary"
                        isLoading={isPending}
                    >
                        {saveButtonText ?? 'Guardar'}
                    </Button>
                </DialogFooter>
            </DialogHeader>
        </DialogContent>
    )
}
