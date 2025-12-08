import { Card } from '@/_components/ui/card'
import { Separator } from '@/_components/ui/separator'
import { FormDescriptionEditComponent } from '@/_template/build_form/_components/form-body-editor/_components/form-description-edit/component'
import { FormInfoRightComponent } from '@/_template/build_form/_components/form-body-editor/_components/form-info-right/component'
import { FormPagesEditComponent } from '@/_template/build_form/_components/form-body-editor/_components/form-pages-edit/component'
import { FormTitleEditComponent } from '@/_template/build_form/_components/form-body-editor/_components/form-title-edit/component'

export function FormBodyEditorComponent() {
    return (
        <section className="flex items-center w-full font-sans">
            <Card className="flex flex-col flex-1 mx-16 my-1 px-8 gap-2">
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
            </Card>
        </section>
    )
}
