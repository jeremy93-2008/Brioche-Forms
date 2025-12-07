'use client'
import { Card } from '@/_components/ui/card'
import { Separator } from '@/_components/ui/separator'
import { SingleFormSelectedContext } from '@/_provider/forms/single-form-selected'
import { IFullForm } from '@/_server/queries/form/get'
import { FormDescriptionEditComponent } from '@/_template/build_form/_components/form-editor/_components/form-description-edit/component'
import { FormPagesEditComponent } from '@/_template/build_form/_components/form-editor/_components/form-pages-edit/component'
import { FormTitleEditComponent } from '@/_template/build_form/_components/form-editor/_components/form-title-edit/component'
import { formatDate } from '@/_utils/formatDate'
import { use } from 'react'

export function FormEditorComponent() {
    const data: IFullForm = use(SingleFormSelectedContext)!

    return (
        <section className="flex items-center w-full font-sans">
            <Card className="flex flex-col flex-1 mx-16 my-1 px-8 gap-2">
                <section className="flex justify-between items-center font-sans">
                    <FormTitleEditComponent />
                    <section className="flex flex-col items-end font-sans">
                        <span className="text-sm">
                            Creado por <strong>{data.author_name}</strong>, el{' '}
                            <strong>{formatDate(data.createdAt)}</strong>
                        </span>
                        <span className="text-sm">
                            Última modificación:{' '}
                            <strong>{formatDate(data.updatedAt)}</strong>
                        </span>
                    </section>
                </section>
                <section className="flex items-center font-sans">
                    <FormDescriptionEditComponent />
                </section>
                <Separator className="my-4" />
                <section className="flex items-center font-sans">
                    <FormPagesEditComponent />
                </section>
            </Card>
        </section>
    )
}
