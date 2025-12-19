import { Input } from '@/_components/ui/input'
import CreateImageAction from '@/_server/_handlers/actions/image/create'
import { CreateNewSectionButtonComponent } from '@/_template/build_form/_components/form-body-editor/_components/form-pages-edit/_components/page-create-section-card/_components/shared/create-new-section-button/component'
import { ICreateNewSectionButtonProps } from '@/_template/build_form/_components/form-body-editor/_components/form-pages-edit/_components/page-create-section-card/_components/shared/types'
import { ImageIcon } from 'lucide-react'

export function CreateNewImageButtonComponent(
    props: ICreateNewSectionButtonProps
) {
    const { formId, pageId } = props
    return (
        <CreateNewSectionButtonComponent
            buttonText="Nueva Imagen"
            buttonIcon={<ImageIcon className="w-10! h-10!" />}
            dialogTitle="Crear nueva imagen"
            serverAction={CreateImageAction}
        >
            {(form, { handleKeyUp }) => (
                <>
                    <input
                        type="hidden"
                        id="form_id"
                        value={formId}
                        {...form.register('form_id')}
                    />
                    <input
                        type="hidden"
                        id="page_id"
                        value={pageId}
                        {...form.register('page_id')}
                    />
                    <Input
                        id="title"
                        placeholder="Título de la sección..."
                        onKeyUp={handleKeyUp}
                        {...form.register('title')}
                    />
                </>
            )}
        </CreateNewSectionButtonComponent>
    )
}
