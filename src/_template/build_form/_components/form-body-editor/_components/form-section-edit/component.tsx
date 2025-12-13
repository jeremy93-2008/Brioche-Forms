import { Card } from '@/_components/ui/card'
import { IFullForm } from '@/_server/domains/form/getFullForms'
import { FormSectionHeaderComponent } from '@/_template/build_form/_components/form-body-editor/_components/form-section-edit/_components/form-section-header/component'
import { FormSectionImageEditComponent } from '@/_template/build_form/_components/form-body-editor/_components/form-section-edit/_components/form-section-image-edit/component'
import { FormSectionQuestionEditComponent } from '@/_template/build_form/_components/form-body-editor/_components/form-section-edit/_components/form-section-question-edit/component'
import { FormSectionTextEditComponent } from '@/_template/build_form/_components/form-body-editor/_components/form-section-edit/_components/form-section-text-edit/component'
import { FormSectionVideoEditComponent } from '@/_template/build_form/_components/form-body-editor/_components/form-section-edit/_components/form-section-video-edit/component'
import { useMemo } from 'react'

export type ITypeOfSection = 'question' | 'text' | 'image' | 'video'

interface IFormSectionEditComponentProps {
    data: IFullForm['pages'][0]['sections'][0]
    formId: string
}

export function FormSectionEditComponent(
    props: IFormSectionEditComponentProps
) {
    const { data, formId } = props

    const typeOfSection = useMemo(() => {
        if (data.questions.length > 0) return 'question'
        if (data.texts.length > 0) return 'text'
        if (data.images.length > 0) return 'image'
        if (data.videos.length > 0) return 'video'
        return null
    }, [data])

    return (
        <Card className="py-0 mb-2">
            <div className="mx-4 my-4 py-2 px-2">
                <FormSectionHeaderComponent data={data} formId={formId} />
                {typeOfSection === 'question' && (
                    <FormSectionQuestionEditComponent />
                )}
                {typeOfSection === 'text' && (
                    <FormSectionTextEditComponent
                        data={data.texts[0]}
                        sectionId={data.id}
                        formId={formId}
                    />
                )}
                {typeOfSection === 'image' && <FormSectionImageEditComponent />}
                {typeOfSection === 'video' && <FormSectionVideoEditComponent />}
            </div>
        </Card>
    )
}
