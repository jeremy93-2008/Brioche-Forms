import { CustomizationBarComponent } from '@/_template/build_form/_components/customization-bar/component'
import { FormEditorComponent } from '@/_template/build_form/_components/form-editor/component'

export function BuildFormTemplate() {
    return (
        <div className="flex flex-col justify-center font-sans">
            <CustomizationBarComponent />
            <FormEditorComponent />
        </div>
    )
}
