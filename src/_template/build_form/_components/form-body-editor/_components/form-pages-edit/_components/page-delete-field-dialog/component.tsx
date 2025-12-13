'use client'
import {
    FormFieldEditDialog,
    FormFieldEditDialogContent,
    FormFieldEditDialogTrigger,
} from '@/_components/shared/form-field-edit-dialog/component.client'
import { Button } from '@/_components/ui/button'
import DeletePageAction from '@/_server/_handlers/actions/page/delete'
import { Trash } from 'lucide-react'
import { IPage } from '../../../../../../../../../db/types'

interface IPageDeleteFieldDialogComponentProps {
    pageId: string
    formId: string
}

export function PageDeleteFieldDialogComponent(
    props: IPageDeleteFieldDialogComponentProps
) {
    const { pageId, formId } = props

    return (
        <FormFieldEditDialog
            title="Eliminar Página"
            serverAction={DeletePageAction}
            saveButtonText="Eliminar"
            saveButtonVariant="destructive"
        >
            <FormFieldEditDialogTrigger>
                <Button
                    className="w-0 !px-0 opacity-0 group-hover:px-2 group-hover:w-6 group-hover:opacity-100"
                    variant="ghost"
                    size="xs"
                >
                    <Trash className="!w-3 !h-3" color="red" />
                </Button>
            </FormFieldEditDialogTrigger>
            <FormFieldEditDialogContent<IPage>>
                {({ register }) => (
                    <>
                        <input
                            type="hidden"
                            value={pageId}
                            {...register('id')}
                        />
                        <input
                            type="hidden"
                            value={formId}
                            {...register('form_id')}
                        />
                        <span>
                            ¿Estás seguro de que deseas eliminar esta página?
                        </span>
                    </>
                )}
            </FormFieldEditDialogContent>
        </FormFieldEditDialog>
    )
}
