import { FormBodyEditorComponent } from '@/_template/build_form/_components/form-body-editor/component'
import { HeaderCustomizationBarComponent } from '@/_template/build_form/_components/header-customization-bar/component'

export function BuildFormTemplate() {
    return (
        <div className="flex flex-col justify-center font-sans">
            <HeaderCustomizationBarComponent />
            <FormBodyEditorComponent />
        </div>
    )
}
