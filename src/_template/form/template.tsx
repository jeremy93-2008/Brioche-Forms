import { IFullForm } from '@/_server/domains/form/getFullForms'
import { PreviewHeaderComponent } from '@/_template/form/_components/preview-header/component'
import { QuestionnaireComponent } from '@/_template/form/_components/questionnaire/component'

interface IFormTemplateProps {
    isPreviewMode: boolean
    formData: IFullForm
}

export function FormTemplate(props: IFormTemplateProps) {
    const { isPreviewMode } = props

    return (
        <section className="flex flex-col font-sans h-screen">
            {isPreviewMode && <PreviewHeaderComponent />}
            <QuestionnaireComponent isPreviewMode={isPreviewMode} />
        </section>
    )
}
