import { Card } from '@/_components/ui/card'
import { IFullForm, IFullSection } from '@/_server/domains/form/getFullForms'
import { ITypeOfSection } from '@/_template/build_form/_components/form-body-editor/_components/form-section-edit/component'
import { ImageSectionComponent } from '@/_template/form/_components/questionnaire/_components/stepper/page/section/image/component'
import { QuestionSectionComponent } from '@/_template/form/_components/questionnaire/_components/stepper/page/section/question/component'
import { LazyTextSectionComponent } from '@/_template/form/_components/questionnaire/_components/stepper/page/section/text/lazyImport'
import { VideoSectionComponent } from '@/_template/form/_components/questionnaire/_components/stepper/page/section/video/component'
import { useCallback } from 'react'

interface ISectionComponentProps {
    data: IFullSection
}

export function SectionComponent(props: ISectionComponentProps) {
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
        <Card className="w-full flex flex-col items-center justify-center p-4">
            <h2 className="text-xl font-semibold mb-4">{data.title}</h2>
            {getTypeOfSection(data) === 'question' && (
                <QuestionSectionComponent data={data.questions[0]} />
            )}
            {getTypeOfSection(data) === 'text' && (
                <LazyTextSectionComponent data={data.texts[0]} />
            )}
            {getTypeOfSection(data) === 'image' && (
                <ImageSectionComponent data={data.images[0]} />
            )}
            {getTypeOfSection(data) === 'video' && (
                <VideoSectionComponent data={data.videos[0]} />
            )}
        </Card>
    )
}
