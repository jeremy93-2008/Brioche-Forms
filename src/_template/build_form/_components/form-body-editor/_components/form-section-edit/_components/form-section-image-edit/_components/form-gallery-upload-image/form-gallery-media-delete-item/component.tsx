import {
    FormFieldEditDialog,
    FormFieldEditDialogContent,
    FormFieldEditDialogTrigger,
} from '@/_components/shared/form-field-edit-dialog/component.client'
import DeleteMediaAction, {
    IDeleteMedia,
} from '@/_server/_handlers/actions/media/delete'
import { IMedia } from '@db/types'
import { Trash } from 'lucide-react'

interface IFormGalleryMediaDeleteItemProps {
    item: IMedia
    afterDelete?: () => void
}

export function FormGalleryMediaDeleteItem(
    props: IFormGalleryMediaDeleteItemProps
) {
    const { item, afterDelete } = props

    const afterSave = (isSuccess: boolean) => {
        if (isSuccess && afterDelete) {
            afterDelete()
        }
    }

    return (
        <FormFieldEditDialog
            title="Eliminar Medio"
            serverAction={DeleteMediaAction}
            saveButtonText="Eliminar"
            saveButtonVariant="destructive"
            afterSave={afterSave}
        >
            <FormFieldEditDialogTrigger>
                <Trash className="w-5! h-5! text-red-400 hover:text-red-500" />
            </FormFieldEditDialogTrigger>
            <FormFieldEditDialogContent<IDeleteMedia>>
                {({ register }) => (
                    <>
                        <input
                            type="hidden"
                            value={item.id}
                            {...register('id')}
                        />
                        <span>
                            ¿Estás seguro de que deseas eliminar este medio?
                        </span>
                    </>
                )}
            </FormFieldEditDialogContent>
        </FormFieldEditDialog>
    )
}
