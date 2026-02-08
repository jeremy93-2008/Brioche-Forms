'use client'
import { useFormAlertDialog } from '@/_components/shared/form-alert-dialog/_hooks/useFormAlertDialog'
import { Button } from '@/_components/ui/button'
import { SingleFormSelectedContext } from '@/_provider/forms/single-form-selected'
import { FormPreferencesPopupComponent } from '@/_template/build_form/_components/header-customization-bar/_components/form-preferences-popup/component'
import { FormStylesPopupComponent } from '@/_template/build_form/_components/header-customization-bar/_components/form-styles-popup/component'
import { Play, UploadCloud } from 'lucide-react'
import Link from 'next/link'
import { use } from 'react'

export function HeaderCustomizationBarComponent() {
    const { data } = use(SingleFormSelectedContext)!

    const { confirmDialog } = useFormAlertDialog()

    const onPublishClick = async () => {
        if (
            await confirmDialog(
                '¿Estás seguro de que deseas publicar este formulario?'
            )
        ) {
            console.log('Publicando formulario...')
        } else {
            console.log('Publicación cancelada.')
        }
        /**const result = await updateFormAction({
            id: data.id,
            isPublished: 1,
            acceptResponses: 1,
            isDraft: 0,
        })*/
    }

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
                <Link href={`/form/${data.id}/preview`} target="_blank">
                    <Button variant="link">
                        <Play />
                        Previsualizar
                    </Button>
                </Link>
                <Button onClick={onPublishClick} variant="link">
                    <UploadCloud />
                    Publicar
                </Button>
            </div>
        </section>
    )
}
