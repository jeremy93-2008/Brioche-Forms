import { Card } from '@/_components/ui/card'
import { FormTitleEditComponent } from '@/_template/build_form/_components/form-editor/_components/form-title-edit/component'

export function FormEditorComponent() {
    return (
        <section className="flex items-center w-full font-sans">
            <Card className="flex flex-col flex-1 mx-16 my-1 px-8">
                <section className="flex items-center font-sans">
                    <FormTitleEditComponent />
                </section>
            </Card>
        </section>
    )
}
