import {
    FormFieldEditDialog,
    FormFieldEditDialogContent,
    FormFieldEditDialogTrigger,
    IFormFieldEditDialogContentChildrenOpts,
} from '@/_components/shared/form-field-edit-dialog/component.client'
import { Button } from '@/_components/ui/button'
import { IReturnAction } from '@/_server/_handlers/actions/types'
import React from 'react'
import { useForm } from 'react-hook-form'

interface ICreateNewSectionButtonComponentProps<T> {
    buttonText: string
    buttonIcon: React.ReactNode
    dialogTitle: string
    serverAction: (arg: any) => Promise<IReturnAction<any>>
    afterSave: (
        isSuccess: boolean,
        fields: T,
        result: IReturnAction<any>
    ) => void
    children: (
        form: ReturnType<typeof useForm<Partial<any>>>,
        opts: IFormFieldEditDialogContentChildrenOpts
    ) => React.ReactNode
}

export function CreateNewSectionButtonComponent<T extends { id: string }>(
    props: ICreateNewSectionButtonComponentProps<T>
) {
    const {
        buttonText,
        buttonIcon,
        dialogTitle,
        serverAction,
        afterSave,
        children,
    } = props

    return (
        <FormFieldEditDialog
            title={dialogTitle}
            serverAction={serverAction}
            afterSave={afterSave}
            saveButtonText="Crear"
            saveButtonVariant="default"
        >
            <FormFieldEditDialogTrigger>
                <Button className="flex flex-col h-32 w-38" variant="link">
                    {buttonIcon}
                    {buttonText}
                </Button>
            </FormFieldEditDialogTrigger>
            <FormFieldEditDialogContent<T>>
                {(form, opts) => children(form, opts)}
            </FormFieldEditDialogContent>
        </FormFieldEditDialog>
    )
}
