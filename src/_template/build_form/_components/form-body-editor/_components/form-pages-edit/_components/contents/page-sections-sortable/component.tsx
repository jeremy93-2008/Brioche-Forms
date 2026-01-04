'use client'

import { IFullForm } from '@/_server/domains/form/getFullForms'
import { PageCreateSectionCardComponent } from '@/_template/build_form/_components/form-body-editor/_components/form-pages-edit/_components/contents/page-create-section-card/component'
import { FormSectionEditComponent } from '@/_template/build_form/_components/form-body-editor/_components/form-section-edit/component'

interface IPageSectionsContentProps {
    page: IFullForm['pages'][0]
    formId: string
}

export function PageSectionsSortableComponent({
    page,
    formId,
}: IPageSectionsContentProps) {
    return (
        <section className="flex flex-1 flex-col">
            {page.sections.map((section) => (
                <FormSectionEditComponent
                    key={section.id}
                    data={section}
                    formId={formId}
                />
            ))}
            <PageCreateSectionCardComponent page={page} />
        </section>
    )
}
