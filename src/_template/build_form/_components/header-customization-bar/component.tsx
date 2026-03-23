'use client'
import { useFormAlertDialog } from '@/_components/shared/form-alert-dialog/_hooks/useFormAlertDialog'
import { Button } from '@/_components/ui/button'
import { ToastMessages } from '@/_constants/toast'
import { useServerActionState } from '@/_hooks/useServerActionState'
import { SingleFormSelectedContext } from '@/_provider/forms/single-form-selected'
import updateFormAction from '@/_server/_handlers/actions/form/update'
import { FormDescriptionEditComponent } from '@/_template/build_form/_components/header-customization-bar/_components/form/form-description-edit/component'
import { FormInfoRightComponent } from '@/_template/build_form/_components/header-customization-bar/_components/form/form-info-right/component'
import { FormTitleEditComponent } from '@/_template/build_form/_components/header-customization-bar/_components/form/form-title-edit/component'
import { FormPreferencesPopupComponent } from '@/_template/build_form/_components/header-customization-bar/_components/popup/form-preferences-popup/component'
import { FormStylesPopupComponent } from '@/_template/build_form/_components/header-customization-bar/_components/popup/form-styles-popup/component'
import { showToastFromResult } from '@/_utils/showToastFromResult'
import { FileIcon, Play, TableIcon, UploadCloud } from 'lucide-react'
import Link from 'next/link'
import { startTransition, use, useOptimistic } from 'react'

export function HeaderCustomizationBarComponent() {
    const { data } = use(SingleFormSelectedContext)!

    const [isPublished, setIsPublished] = useOptimistic<number, number>(
        data.isPublished,
        (state, newIsPublished) => newIsPublished
    )

    const { runAction, isPending } = useServerActionState(updateFormAction)

    const { confirmDialog } = useFormAlertDialog()

    const onPublishClick = async () => {
        if (
            await confirmDialog(
                '¿Estás seguro de que deseas publicar este formulario?',
                {
                    description:
                        'Una vez publicado, el formulario estará disponible para que los usuarios lo completen. Asegúrate de haber revisado todas las preguntas y configuraciones antes de proceder.',
                    actionText: 'Publicar ahora',
                }
            )
        ) {
            const result = await runAction({
                id: data.id,
                isPublished: 1,
                acceptResponses: 1,
                isDraft: 0,
            })

            startTransition(() => {
                setIsPublished(1)
            })
            showToastFromResult(result, ToastMessages.publishedSuccess)
        } else {
            console.log('Publicación cancelada.')
        }
    }

    return (
        <section className=" mt-3 mb-2">
            <section className="flex items-center justify-between w-full">
                <div className="flex flex-1 items-center w-full gap-3 mx-18">
                    <section className="flex items-center gap-2">
                        <FileIcon />
                        <FormTitleEditComponent />
                    </section>
                    <section className="flex items-center gap-2">
                        <FormInfoRightComponent />
                    </section>
                </div>
                <div className="flex items-center justify-end font-sans gap-2 mx-16">
                    <FormStylesPopupComponent />
                    <FormPreferencesPopupComponent />
                    <Link href={`/form/${data.id}/preview`} target="_blank">
                        <Button variant="ghost">
                            <Play />
                            Previsualizar
                        </Button>
                    </Link>
                    {isPublished === 0 && (
                        <Button
                            onClick={onPublishClick}
                            variant="default"
                            isLoading={isPending}
                        >
                            {!isPending && <UploadCloud />}
                            Publicar
                        </Button>
                    )}
                    {isPublished === 1 && (
                        <Link href={`/form/${data.id}/result`} target="_blank">
                            <Button variant="default">
                                <TableIcon />
                                Respuestas
                            </Button>
                        </Link>
                    )}
                </div>
            </section>
            <section className="flex justify-between items-center font-sans mt-1 mx-16">
                <FormDescriptionEditComponent />
            </section>
        </section>
    )
}
