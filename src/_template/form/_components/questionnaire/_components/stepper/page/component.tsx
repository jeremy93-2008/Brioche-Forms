'use client'
import { IFullForm } from '@/_server/domains/form/getFullForms'
import { SectionComponent } from '@/_template/form/_components/questionnaire/_components/stepper/page/section/component'

interface IPageComponentProps {
    data: IFullForm['pages'][number]
}

export function PageComponent(props: IPageComponentProps) {
    const { data } = props

    return (
        <section>
            <h1 className="text-2xl text-primary font-bold mb-6">
                {data.title}
            </h1>
            {data.sections.map((section) => (
                <div key={section.id} className="mb-8">
                    <SectionComponent data={section} />
                </div>
            ))}
        </section>
    )
}
