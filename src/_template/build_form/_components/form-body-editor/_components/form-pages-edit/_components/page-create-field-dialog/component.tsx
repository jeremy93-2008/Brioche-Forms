'use client'
import {
    FormFieldEditDialog,
    FormFieldEditDialogContent,
    FormFieldEditDialogTrigger,
} from '@/_components/shared/form-field-edit-dialog/component.client'
import { Button } from '@/_components/ui/button'
import { Input } from '@/_components/ui/input'
import CreatePageAction from '@/_server/actions/page/create'
import { Plus } from 'lucide-react'
import { IPage } from '../../../../../../../../../db/types'

interface IPageCreateFieldDialogComponentProps {
    formId: string
    order: string
}

export function PageCreateFieldDialogComponent(
    props: IPageCreateFieldDialogComponentProps
) {
    const { formId, order } = props

    return (
        <FormFieldEditDialog
            title="Crear nueva Página"
            serverAction={CreatePageAction}
            saveButtonText="Crear"
            saveButtonVariant="default"
        >
            <FormFieldEditDialogTrigger>
                <Button className="ml-8" variant="default" size="xs">
                    <Plus />
                    Añadir Página
                </Button>
            </FormFieldEditDialogTrigger>
            <FormFieldEditDialogContent<IPage>>
                {({ register }, { handleKeyUp }) => (
                    <>
                        <input
                            type="hidden"
                            value={formId}
                            {...register('form_id')}
                        />
                        <input
                            type="hidden"
                            value={order}
                            {...register('order')}
                        />
                        <Input
                            className="text-secondary"
                            defaultValue={''}
                            autoFocus
                            onKeyUp={handleKeyUp}
                            {...register('title')}
                        />
                    </>
                )}
            </FormFieldEditDialogContent>
        </FormFieldEditDialog>
    )
}
