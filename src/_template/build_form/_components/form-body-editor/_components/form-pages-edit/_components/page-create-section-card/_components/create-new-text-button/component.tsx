import { Input } from '@/_components/ui/input'
import CreateTextAction from '@/_server/_handlers/actions/text/create'
import { CreateNewSectionButtonComponent } from '@/_template/build_form/_components/form-body-editor/_components/form-pages-edit/_components/page-create-section-card/_components/shared/create-new-section-button/component'
import { ICreateNewSectionButtonProps } from '@/_template/build_form/_components/form-body-editor/_components/form-pages-edit/_components/page-create-section-card/_components/shared/types'
import { CaseSensitiveIcon } from 'lucide-react'

export function CreateNewTextButtonComponent(
    props: ICreateNewSectionButtonProps
) {
    const { formId, pageId } = props
    return (
        <CreateNewSectionButtonComponent
            buttonText="Nuevo texto"
            buttonIcon={<CaseSensitiveIcon className="w-10! h-10!" />}
            dialogTitle="Crear nuevo texto"
            serverAction={CreateTextAction}
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
