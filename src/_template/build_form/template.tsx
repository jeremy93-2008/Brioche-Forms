import { Separator } from '@/_components/ui/separator'
import { AutoSaveWrapper } from '@/_template/build_form/_components/auto-save-wrapper'
import { FormBodyEditorComponent } from '@/_template/build_form/_components/form-body-editor/component'
import { HeaderCustomizationBarComponent } from '@/_template/build_form/_components/header-customization-bar/component'

export function BuildFormTemplate() {
    return (
        <AutoSaveWrapper>
            <div className="flex flex-col justify-center font-sans">
                <section className="sticky top-0 bg-background z-50 flex flex-col">
                    <HeaderCustomizationBarComponent />
                    <Separator />
                </section>

                <FormBodyEditorComponent />
            </div>
        </AutoSaveWrapper>
    )
}
