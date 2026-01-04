import { Card } from '@/_components/ui/card'
import { SingleFormSelectedContext } from '@/_provider/forms/single-form-selected'
import { IFullForm } from '@/_server/domains/form/getFullForms'
import { CreateNewImageButtonComponent } from '@/_template/build_form/_components/form-body-editor/_components/form-pages-edit/_components/contents/page-create-section-card/_components/create-new-image-button/component'
import { CreateNewQuestionButtonComponent } from '@/_template/build_form/_components/form-body-editor/_components/form-pages-edit/_components/contents/page-create-section-card/_components/create-new-question-button/component'
import { CreateNewTextButtonComponent } from '@/_template/build_form/_components/form-body-editor/_components/form-pages-edit/_components/contents/page-create-section-card/_components/create-new-text-button/component'
import { CreateNewVideoButtonComponent } from '@/_template/build_form/_components/form-body-editor/_components/form-pages-edit/_components/contents/page-create-section-card/_components/create-new-video-button/component'
import { use } from 'react'

interface IPageCreateSectionCardComponentProps {
    page: IFullForm['pages'][0]
}

export function PageCreateSectionCardComponent(
    props: IPageCreateSectionCardComponentProps
) {
    const { page } = props
    const { data } = use(SingleFormSelectedContext)!

    return (
        <Card className="flex flex-col justify-center mt-4 px-4 pt-8 pb-4">
            <h2 className="text-center">Añadir una nueva sección</h2>
            <section className="flex gap-6 justify-center mt-2 mb-4">
                <CreateNewQuestionButtonComponent
                    formId={data.id}
                    pageId={page.id}
                />
                <CreateNewTextButtonComponent
                    formId={data.id}
                    pageId={page.id}
                />
                <CreateNewImageButtonComponent
                    formId={data.id}
                    pageId={page.id}
                />
                <CreateNewVideoButtonComponent
                    formId={data.id}
                    pageId={page.id}
                />
            </section>
        </Card>
    )
}
