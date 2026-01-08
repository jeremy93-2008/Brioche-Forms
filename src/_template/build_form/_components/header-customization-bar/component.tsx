'use client'
import { Button } from '@/_components/ui/button'
import { FormPreferencesPopupComponent } from '@/_template/build_form/_components/header-customization-bar/_components/form-preferences-popup/component'
import { FormStylesPopupComponent } from '@/_template/build_form/_components/header-customization-bar/_components/form-styles-popup/component'
import { Play, UploadCloud } from 'lucide-react'

export function HeaderCustomizationBarComponent() {
    // style, settings, preview, publish buttons
    return (
        <section className="flex items-center justify-between w-full">
            <div className="flex items-center w-full gap-2 mx-20">
                <h1 className="text-xl font-montserrat">
                    Constructor de formulario
                </h1>
            </div>
            <div className="flex items-center justify-end font-sans gap-2 mx-16 my-2">
                <FormStylesPopupComponent />
                <FormPreferencesPopupComponent />
                <Button variant="link">
                    <Play />
                    Previsualizar
                </Button>
                <Button variant="link">
                    <UploadCloud />
                    Publicar
                </Button>
            </div>
        </section>
    )
}
