import { Button } from '@/_components/ui/button'
import { ToastMessages } from '@/_constants/toast'
import { useServerActionState } from '@/_hooks/useServerActionState'
import { SingleFormSelectedContext } from '@/_provider/forms/single-form-selected'
import {
    IResponseWithAnswers,
    IResponseWithAnswersReturn,
} from '@/_server/_handlers/actions/response/scheme'
import UpsertResponseAction from '@/_server/_handlers/actions/response/upsert'
import { IReturnAction } from '@/_server/_handlers/actions/types'
import { IInvalidAnswers } from '@/_server/domains/_validator/validateAnswersFromQuestions'
import { IFullPage, IFullSection } from '@/_server/domains/form/getFullForms'
import { PageComponent } from '@/_template/form/_components/questionnaire/_components/stepper/page/component'
import { SectionComponent } from '@/_template/form/_components/questionnaire/_components/stepper/page/section/component'
import { cn } from '@/_utils/clsx-tw'
import { showToastFromResult } from '@/_utils/showToastFromResult'
import { ArrowLeftIcon, ArrowRightIcon, SaveIcon, SendIcon } from 'lucide-react'
import { use, useState } from 'react'
import {
    ResolverError,
    SubmitErrorHandler,
    useFormContext,
    useWatch,
} from 'react-hook-form'
import { toast } from 'sonner'

export type ITypeStepper = 'all' | 'by_component'

export type IComponentStep = {
    steps: (IFullPage | IFullSection)[]
    type: ITypeStepper
}

export interface IStepperComponentProps {
    isPreviewMode?: boolean
}

export function StepperComponent(props: IStepperComponentProps) {
    const { isPreviewMode = false } = props
    const { data } = use(SingleFormSelectedContext)!

    const [stepperIndex, setStepperIndex] = useState(0)

    const componentsSteps = ((): IComponentStep => {
        switch (data.questionnaireDisplayMode) {
            case 'all_pages':
                return { steps: data.pages, type: 'all' }
            case 'page_by_page':
                return { steps: data.pages, type: 'by_component' }
            case 'section_by_page':
                return {
                    steps: data.pages.flatMap((page) => page.sections),
                    type: 'by_component',
                }
            default:
                return { steps: data.pages, type: 'all' }
        }
    })()

    const handleStepChange = (newIndex: number) => {
        return () => {
            setStepperIndex(newIndex)
            window.requestIdleCallback(
                () => {
                    document
                        .querySelector('#stepper-wrapper')
                        ?.scrollTo({ top: 0, behavior: 'smooth' })
                },
                { timeout: 250 }
            )
        }
    }

    const focusOnFirstError = (
        errors: ResolverError<IResponseWithAnswers>['errors']
    ) => {
        const invalidAnswersArray: IInvalidAnswers[] = JSON.parse(
            errors.answers?.root?.message ?? '[]'
        )
        if (invalidAnswersArray.length === 0) return
        const firstErrorQuestionId = invalidAnswersArray[0].question_id

        const errorElement = document.querySelector(
            `[id="question:${firstErrorQuestionId}"]`
        )
        if (!errorElement) return

        const singleStepIdx = errorElement
            .closest('[data-step-idx]')
            ?.getAttribute('data-step-idx')

        if (singleStepIdx) setStepperIndex(Number(singleStepIdx))

        window.requestIdleCallback(
            () => {
                errorElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                })
            },
            { timeout: 250 }
        )
    }

    const currentResponse = useWatch<IResponseWithAnswers>()

    const { isPending, runAction: runUpsertResponseAction } =
        useServerActionState<IResponseWithAnswers, IResponseWithAnswersReturn>(
            UpsertResponseAction
        )

    const handlePartialSave = () => {
        if (isPreviewMode) {
            return () => {
                toast.info(ToastMessages.previewModeAction)
            }
        }
        return async () => {
            const responseData: IReturnAction<IResponseWithAnswersReturn> =
                await runUpsertResponseAction({
                    ...currentResponse,
                    is_partial_response: 1,
                } as IResponseWithAnswers)

            showToastFromResult(responseData, ToastMessages.genericSuccess)
        }
    }

    const { handleSubmit } = useFormContext()

    const handleFullSave = () => {
        if (isPreviewMode) {
            return () => {
                toast.info(ToastMessages.previewModeAction)
            }
        }

        return async () => {
            const responseData: IReturnAction<IResponseWithAnswersReturn> =
                await runUpsertResponseAction({
                    ...currentResponse,
                    is_partial_response: 0,
                } as IResponseWithAnswers)

            showToastFromResult(responseData, ToastMessages.genericSuccess)
        }
    }

    const handleError: () => SubmitErrorHandler<IResponseWithAnswers> =
        () => (errors) => {
            if (process.env.NODE_ENV === 'development')
                console.error('Form submission errors:', errors)

            focusOnFirstError(errors)
            toast.error(ToastMessages.formValidationError)
        }

    return (
        <section className="flex flex-col gap-0 mt-2 mb-6 overflow-x-hidden">
            <section
                className={cn(
                    'flex justify-center w-full px-32',
                    componentsSteps.type === 'by_component'
                        ? 'flex-row'
                        : 'flex-col'
                )}
            >
                {componentsSteps.type === 'all' &&
                    componentsSteps.steps.map((page) => (
                        <div key={page.id} className="p-8 pb-3">
                            <PageComponent data={page as IFullPage} />
                        </div>
                    ))}
                {componentsSteps.type === 'by_component' &&
                    componentsSteps.steps.map((step, idx) => (
                        <div
                            key={step.id}
                            className={cn(
                                'p-8 pb-0 transition duration-500 ease-in-out overflow-x-hidden',
                                stepperIndex === idx
                                    ? 'w-full opacity-100'
                                    : 'w-0 opacity-0 p-0 h-0'
                            )}
                        >
                            {'sections' in step ? (
                                <PageComponent
                                    data={step as IFullPage}
                                    stepIdx={idx}
                                />
                            ) : (
                                <SectionComponent
                                    data={step as IFullSection}
                                    stepIdx={idx}
                                />
                            )}
                        </div>
                    ))}
            </section>

            <section
                className={cn(
                    'flex gap-4 justify-between w-full px-40 mb-8',
                    componentsSteps.type === 'all' && 'justify-center'
                )}
            >
                <section className="flex gap-4">
                    {componentsSteps.type === 'by_component' && (
                        <>
                            <Button
                                variant="secondary"
                                onClick={handleStepChange(stepperIndex - 1)}
                                disabled={stepperIndex === 0}
                            >
                                <ArrowLeftIcon />
                                Anterior
                            </Button>
                            <Button
                                variant="secondary"
                                onClick={handleStepChange(stepperIndex + 1)}
                                className={cn(
                                    stepperIndex ===
                                        componentsSteps.steps.length - 1 &&
                                        'hidden'
                                )}
                            >
                                <ArrowRightIcon />
                                Siguiente
                            </Button>
                        </>
                    )}
                    <Button
                        onClick={handleSubmit(handleFullSave(), handleError())}
                        className={cn(
                            stepperIndex !== componentsSteps.steps.length - 1 &&
                                componentsSteps.type === 'by_component' &&
                                'hidden'
                        )}
                    >
                        <SendIcon />
                        Enviar formulario
                    </Button>
                </section>
                <section className="flex gap-4">
                    {data.savePartialResponses && (
                        <Button
                            onClick={handlePartialSave()}
                            variant="secondary"
                            isLoading={isPending}
                        >
                            {!isPending && <SaveIcon />}
                            Guardar y continuar más tarde
                        </Button>
                    )}
                </section>
            </section>
        </section>
    )
}
