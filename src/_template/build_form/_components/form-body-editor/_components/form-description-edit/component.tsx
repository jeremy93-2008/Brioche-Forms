'use client'
import {
    FormFieldEditDialog,
    FormFieldEditDialogContent,
    FormFieldEditDialogTrigger,
} from '@/_components/shared/form-field-edit-dialog/component.client'
import { Button } from '@/_components/ui/button'
import { Textarea } from '@/_components/ui/textarea'
import { useAfterSaveOptimisticData } from '@/_hooks/useAfterSaveOptimisticData/useAfterSaveOptimisticData'
import { SingleFormSelectedContext } from '@/_provider/forms/single-form-selected'
import EditFormAction from '@/_server/_handlers/actions/form/update'
import { type IForm } from '@db/types'
import { Pen } from 'lucide-react'
import { use } from 'react'

export function FormDescriptionEditComponent() {
    const { data } = use(SingleFormSelectedContext)!
    const { afterSave } = useAfterSaveOptimisticData({ type: 'update' })

    return (
        <FormFieldEditDialog
            title="Editar Descripción del Formulario"
            serverAction={EditFormAction}
            afterSave={afterSave}
        >
            <FormFieldEditDialogTrigger>
                <Button className="text-sm group" variant="ghost" size="sm">
                    <section>
                        {data?.description || (
                            <span className="opacity-50">
                                Agregar descripción
                            </span>
                        )}
                    </section>
                    <Pen className="w-2! h-2!" />
                </Button>
            </FormFieldEditDialogTrigger>
            <FormFieldEditDialogContent<IForm>>
                {({ register }) => (
                    <>
                        <input
                            type="hidden"
                            value={data.id}
                            {...register('id')}
                        />
                        <Textarea
                            className="text-secondary"
                            defaultValue={data.description ?? ''}
                            autoFocus
                            {...register('description')}
                        />
                    </>
                )}
            </FormFieldEditDialogContent>
        </FormFieldEditDialog>
    )
}
