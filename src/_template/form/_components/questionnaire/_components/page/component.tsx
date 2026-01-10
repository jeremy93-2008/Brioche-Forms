'use client'
import { IFullForm } from '@/_server/domains/form/getFullForms'
import { ITypeOfSection } from '@/_template/build_form/_components/form-body-editor/_components/form-section-edit/component'
import { ImageSectionComponent } from '@/_template/form/_components/questionnaire/_components/page/section/image/component'
import { QuestionSectionComponent } from '@/_template/form/_components/questionnaire/_components/page/section/question/component'
import { LazyTextSectionComponent } from '@/_template/form/_components/questionnaire/_components/page/section/text/lazyImport'
import { VideoSectionComponent } from '@/_template/form/_components/questionnaire/_components/page/section/video/component'
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
                    <h2 className="text-xl font-semibold mb-4">
                        {section.title}
                    </h2>
                    {getTypeOfSection(section) === 'question' && (
                        <QuestionSectionComponent data={section.questions[0]} />
                    )}
                    {getTypeOfSection(section) === 'text' && (
                        <LazyTextSectionComponent data={section.texts[0]} />
                    )}
                    {getTypeOfSection(section) === 'image' && (
                        <ImageSectionComponent data={section.images[0]} />
                    )}
                    {getTypeOfSection(section) === 'video' && (
                        <VideoSectionComponent data={section.videos[0]} />
                    )}
                </div>
            ))}
        </section>
    )
}
