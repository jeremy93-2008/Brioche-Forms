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
    nextOrder: string
}

export function PageCreateSectionCardComponent(
    props: IPageCreateSectionCardComponentProps
) {
    const { page, nextOrder } = props
    const { data } = use(SingleFormSelectedContext)!

    return (
        <section className="flex justify-center mt-3">
            <Card className="flex w-full bg-transparent flex-col justify-center px-12">
                <h2 className="text-sm text-center">
                    Añadir una nueva sección
                </h2>
                <section className="flex gap-6 justify-center">
                    <CreateNewQuestionButtonComponent
                        formId={data.id}
                        pageId={page.id}
                        nextOrder={nextOrder}
                    />
                    <CreateNewTextButtonComponent
                        formId={data.id}
                        pageId={page.id}
                        nextOrder={nextOrder}
                    />

                    <CreateNewImageButtonComponent
                        formId={data.id}
                        pageId={page.id}
                        nextOrder={nextOrder}
                    />
                    <CreateNewVideoButtonComponent
                        formId={data.id}
                        pageId={page.id}
                        nextOrder={nextOrder}
                    />
                </section>
            </Card>
        </section>
    )
}
