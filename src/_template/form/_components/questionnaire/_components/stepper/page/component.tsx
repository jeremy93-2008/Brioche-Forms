'use client'
import { IFullForm } from '@/_server/domains/form/getFullForms'
import { SectionComponent } from '@/_template/form/_components/questionnaire/_components/stepper/page/section/component'

interface IPageComponentProps {
    data: IFullForm['pages'][number]
    stepIdx?: number
}

export function PageComponent(props: IPageComponentProps) {
    const { data, stepIdx } = props

    return (
        <section data-step-idx={stepIdx}>
            <h1 className="text-2xl text-primary font-bold mb-6">
                {data.title}
            </h1>
            {data.sections.map((section) => (
                <div key={section.id} className="mb-8">
                    <SectionComponent data={section} isPageChild={true} />
                </div>
            ))}
        </section>
    )
}
