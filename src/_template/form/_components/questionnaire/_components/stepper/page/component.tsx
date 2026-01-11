'use client'
import { IFullForm } from '@/_server/domains/form/getFullForms'
import { ITypeOfSection } from '@/_template/build_form/_components/form-body-editor/_components/form-section-edit/component'
import { SectionComponent } from '@/_template/form/_components/questionnaire/_components/stepper/page/section/component'
import { useCallback } from 'react'

interface IPageComponentProps {
    data: IFullForm['pages'][number]
}

export function PageComponent(props: IPageComponentProps) {
    const { data } = props

    const getTypeOfSection: (
        section: IFullForm['pages'][number]['sections'][number]
    ) => ITypeOfSection = useCallback((section) => {
        if (section.questions.length > 0) return 'question'
        if (section.texts.length > 0) return 'text'
        if (section.images.length > 0) return 'image'
        if (section.videos.length > 0) return 'video'
        return null
    }, [])

    return (
        <section>
            <h1 className="text-2xl font-bold mb-6">{data.title}</h1>
            {data.sections.map((section) => (
                <div key={section.id} className="mb-8">
                    <SectionComponent data={section} />
                </div>
            ))}
        </section>
    )
}
