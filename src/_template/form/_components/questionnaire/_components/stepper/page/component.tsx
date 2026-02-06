'use client'
import { Card } from '@/_components/ui/card'
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
            <Card className="text-lg text-primary px-4 py-2 mb-6">
                {data.title}
            </Card>
            {data.sections.map((section) => (
                <div key={section.id} className="mb-8">
                    <SectionComponent data={section} isPageChild={true} />
                </div>
            ))}
        </section>
    )
}
