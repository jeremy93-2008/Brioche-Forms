import {
    FormFieldEditDialog,
    FormFieldEditDialogContent,
    FormFieldEditDialogTrigger,
} from '@/_components/shared/form-field-edit-dialog/component.client'
import { Button } from '@/_components/ui/button'
import { Input } from '@/_components/ui/input'
import { useAfterSaveOptimisticData } from '@/_hooks/useAfterSaveOptimisticData/useAfterSaveOptimisticData'
import DeleteSectionAction from '@/_server/_handlers/actions/section/delete'
import EditSectionAction from '@/_server/_handlers/actions/section/update'
import { IFullForm } from '@/_server/domains/form/getFullForms'
import { ISection } from '@db/types'
import { Pen, Trash } from 'lucide-react'

interface IFormSectionEditNameComponentProps {
    data: IFullForm['pages'][0]['sections'][0]
    formId: string
}

export function FormSectionHeaderComponent(
    props: IFormSectionEditNameComponentProps
) {
    const { data, formId } = props
    const { afterSave } = useAfterSaveOptimisticData({ type: 'update' })

    return (
        <section className="flex items-center">
            <FormFieldEditDialog
                title="Renombrar Sección"
                serverAction={EditSectionAction}
                afterSave={afterSave}
            >
                <FormFieldEditDialogTrigger>
                    <Button className="text-sm" variant="link">
                        <h3>{data.title || 'Sección sin título'}</h3>
                        <Pen className="opacity-0 transition-opacity group-hover/section:opacity-100 " />
                    </Button>
                </FormFieldEditDialogTrigger>
                <FormFieldEditDialogContent<ISection>>
                    {({ register }, { handleKeyUp }) => (
                        <>
                            <input
                                type="hidden"
                                value={data.id}
                                {...register('id')}
                            />
                            <input
                                type="hidden"
                                value={formId}
                                {...register('form_id')}
                            />
                            <Input
                                className="text-secondary"
                                defaultValue={data.title ?? ''}
                                autoFocus
                                onKeyUp={handleKeyUp}
                                {...register('title')}
                            />
                        </>
                    )}
                </FormFieldEditDialogContent>
            </FormFieldEditDialog>
            <FormFieldEditDialog
                title="Eliminar Sección"
                serverAction={DeleteSectionAction}
                saveButtonText="Eliminar"
                saveButtonVariant="destructive"
            >
                <FormFieldEditDialogTrigger>
                    <Button
                        className="text-sm opacity-0 transition-opacity group-hover/section:opacity-100 delay-75"
                        variant="ghost"
                        size="xs"
                    >
                        <Trash color="red" />
                    </Button>
                </FormFieldEditDialogTrigger>
                <FormFieldEditDialogContent<ISection>>
                    {({ register }) => (
                        <>
                            <input
                                type="hidden"
                                value={data.id}
                                {...register('id')}
                            />
                            <input
                                type="hidden"
                                value={formId}
                                {...register('form_id')}
                            />
                            <span>
                                ¿Estás seguro de que deseas eliminar esta
                                sección?
                            </span>
                        </>
                    )}
                </FormFieldEditDialogContent>
            </FormFieldEditDialog>
        </section>
    )
}
