import { Input } from '@/_components/ui/input'
import CreateVideoAction from '@/_server/_handlers/actions/video/create'
import { CreateNewSectionButtonComponent } from '@/_template/build_form/_components/form-body-editor/_components/form-pages-edit/_components/page-create-section-card/_components/shared/create-new-section-button/component'
import { ICreateNewSectionButtonProps } from '@/_template/build_form/_components/form-body-editor/_components/form-pages-edit/_components/page-create-section-card/_components/shared/types'
import { useAfterSaveNewSectionOptimistic } from '@/_template/build_form/_components/form-body-editor/_components/form-pages-edit/_components/page-create-section-card/hooks/useAfterSaveNewSectionOptimistic'
import { ImageIcon } from 'lucide-react'

export function CreateNewVideoButtonComponent(
    props: ICreateNewSectionButtonProps
) {
    const { formId, pageId } = props

    const { afterSave } = useAfterSaveNewSectionOptimistic({
        contentType: 'videos',
    })

    return (
        <CreateNewSectionButtonComponent
            buttonText="Nuevo Video"
            buttonIcon={<ImageIcon className="w-10! h-10!" />}
            dialogTitle="Crear nuevo video"
            serverAction={CreateVideoAction}
            afterSave={afterSave}
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
