import { Button } from '@/_components/ui/button'
import { SingleFormSelectedContext } from '@/_provider/forms/single-form-selected'
import { IFullPage, IFullSection } from '@/_server/domains/form/getFullForms'
import { PageComponent } from '@/_template/form/_components/questionnaire/_components/stepper/page/component'
import { SectionComponent } from '@/_template/form/_components/questionnaire/_components/stepper/page/section/component'
import { cn } from '@/_utils/clsx-tw'
import { ArrowLeftIcon, ArrowRightIcon, SaveIcon, SendIcon } from 'lucide-react'
import { use, useState } from 'react'

export type ITypeStepper = 'all' | 'by_component'

export type IComponentStep = {
    steps: (IFullPage | IFullSection)[]
    type: ITypeStepper
}

export function StepperComponent() {
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
                                <PageComponent data={step as IFullPage} />
                            ) : (
                                <SectionComponent data={step as IFullSection} />
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
                    <Button variant="secondary">
                        <SaveIcon />
                        Guardar y continuar más tarde
                    </Button>
                </section>
            </section>
        </section>
    )
}
