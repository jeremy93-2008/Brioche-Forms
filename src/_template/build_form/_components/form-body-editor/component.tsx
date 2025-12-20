import { Separator } from '@/_components/ui/separator'
import { FormDescriptionEditComponent } from '@/_template/build_form/_components/form-body-editor/_components/form-description-edit/component'
import { FormInfoRightComponent } from '@/_template/build_form/_components/form-body-editor/_components/form-info-right/component'
import { FormPagesEditComponent } from '@/_template/build_form/_components/form-body-editor/_components/form-pages-edit/component'
import { FormTitleEditComponent } from '@/_template/build_form/_components/form-body-editor/_components/form-title-edit/component'

export function FormBodyEditorComponent() {
    return (
        <section className="flex items-center w-full font-sans">
            <section className="flex flex-col flex-1 mx-16 mt-1 mb-16 px-8 py-4 gap-2 bg-card border rounded-xl">
                <section className="flex justify-between items-center font-sans">
                    <FormTitleEditComponent />
                    <FormInfoRightComponent />
                </section>
                <section className="flex items-center font-sans">
                    <FormDescriptionEditComponent />
                </section>
                <Separator className="my-4" />
                <section className="flex items-center font-sans">
                    <FormPagesEditComponent />
                </section>
            </section>
        </section>
    )
}
