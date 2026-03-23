import { FormPagesEditComponent } from '@/_template/build_form/_components/form-body-editor/_components/form-pages-edit/component'

export function FormBodyEditorComponent() {
    return (
        <section className="flex items-center w-full font-sans">
            <section className="flex flex-col flex-1 mx-8 px-8 pb-4 gap-2 rounded-xl">
                <section className="flex items-center font-sans mt-3">
                    <FormPagesEditComponent />
                </section>
            </section>
        </section>
    )
}
