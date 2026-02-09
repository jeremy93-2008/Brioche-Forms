'use client'
import { useFormAlertDialog } from '@/_components/shared/form-alert-dialog/_hooks/useFormAlertDialog'
import { Button } from '@/_components/ui/button'
import { ToastMessages } from '@/_constants/toast'
import { useServerActionState } from '@/_hooks/useServerActionState'
import { SingleFormSelectedContext } from '@/_provider/forms/single-form-selected'
import updateFormAction from '@/_server/_handlers/actions/form/update'
import { FormPreferencesPopupComponent } from '@/_template/build_form/_components/header-customization-bar/_components/form-preferences-popup/component'
import { FormStylesPopupComponent } from '@/_template/build_form/_components/header-customization-bar/_components/form-styles-popup/component'
import { showToastFromResult } from '@/_utils/showToastFromResult'
import { Play, TableIcon, UploadCloud } from 'lucide-react'
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
                {isPublished === 0 && (
                    <Button
                        onClick={onPublishClick}
                        variant="link"
                        isLoading={isPending}
                    >
                        {!isPending && <UploadCloud />}
                        Publicar
                    </Button>
                )}
                {isPublished === 1 && (
                    <Button variant="default">
                        <TableIcon />
                        Resultados
                    </Button>
                )}
            </div>
        </section>
    )
}
