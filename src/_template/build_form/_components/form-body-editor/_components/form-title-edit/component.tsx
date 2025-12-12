'use client'
import {
    FormFieldEditDialog,
    FormFieldEditDialogContent,
    FormFieldEditDialogTrigger,
} from '@/_components/shared/form-field-edit-dialog/component.client'
import { Button } from '@/_components/ui/button'
import { Input } from '@/_components/ui/input'
import { SingleFormSelectedContext } from '@/_provider/forms/single-form-selected'
import EditFormAction from '@/_server/_handlers/actions/form/update'
import { type IFullForm } from '@/_server/_handlers/queries/form/get'
import { Pen } from 'lucide-react'
import { use } from 'react'
import { IForm } from '../../../../../../../db/types'

export function FormTitleEditComponent() {
    const data: IFullForm = use(SingleFormSelectedContext)!

    return (
        <FormFieldEditDialog
            title="Renombrar Formulario"
            serverAction={EditFormAction}
        >
            <FormFieldEditDialogTrigger>
                <Button className="text-xl group" variant="link">
                    <span>{data?.title}</span>
                    <Pen className="opacity-0 transition-opacity group-hover:opacity-100" />
                </Button>
            </FormFieldEditDialogTrigger>
            <FormFieldEditDialogContent<IForm>>
                {({ register }, { handleKeyUp }) => (
                    <>
                        <input
                            type="hidden"
                            value={data.id}
                            {...register('id')}
                        />
                        <Input
                            className="text-secondary"
                            defaultValue={data.title}
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
