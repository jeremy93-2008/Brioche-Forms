'use client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/_components/ui/tabs'
import { SingleFormSelectedContext } from '@/_provider/forms/single-form-selected'
import { IFullForm } from '@/_server/domains/form/getFullForms'
import { PageCreateFieldDialogComponent } from '@/_template/build_form/_components/form-body-editor/_components/form-pages-edit/_components/page-create-field-dialog/component'
import { PageCreateSectionCardComponent } from '@/_template/build_form/_components/form-body-editor/_components/form-pages-edit/_components/page-create-section-card/component'
import { PageDeleteFieldDialogComponent } from '@/_template/build_form/_components/form-body-editor/_components/form-pages-edit/_components/page-delete-field-dialog/component'
import { PageEditFieldDialogComponent } from '@/_template/build_form/_components/form-body-editor/_components/form-pages-edit/_components/page-edit-field-dialog/component'
import { FormSectionEditComponent } from '@/_template/build_form/_components/form-body-editor/_components/form-section-edit/component'
import { use, useState } from 'react'

export function FormPagesEditComponent() {
    const data: IFullForm = use(SingleFormSelectedContext)!
    const [currentTabValue, setCurrentTabValue] = useState<string>(
        data.pages[0]?.id || ''
    )
    return (
        <Tabs
            className="w-full"
            value={currentTabValue}
            onValueChange={setCurrentTabValue}
        >
            <TabsList className="w-full justify-between">
                <section className="flex flex-1 items-center font-sans overflow-x-auto">
                    {data.pages.map((page, idx) => (
                        <TabsTrigger
                            asChild
                            className="w-fit flex-none flex items-center group"
                            value={page.id}
                            key={page.id}
                        >
                            <section className="w-fit flex-none flex items-center group">
                                {page.title || 'Página sin título'}
                                {currentTabValue === page.id && (
                                    <>
                                        <PageEditFieldDialogComponent
                                            page={page}
                                            formId={data.id}
                                        />
                                        {idx > 0 && data.pages.length > 1 && (
                                            <PageDeleteFieldDialogComponent
                                                pageId={page.id}
                                                formId={data.id}
                                            />
                                        )}
                                    </>
                                )}
                            </section>
                        </TabsTrigger>
                    ))}
                </section>
                <section>
                    <PageCreateFieldDialogComponent
                        formId={data.id}
                        order={data.pages.length.toString()}
                    />
                </section>
            </TabsList>
            {data.pages.map((page) => (
                <TabsContent key={page.id} value={page.id}>
                    <section className="flex flex-1 flex-col">
                        {page.sections.map((section) => (
                            <FormSectionEditComponent
                                key={section.id}
                                data={section}
                                formId={data.id}
                            />
                        ))}
                        <PageCreateSectionCardComponent />
                    </section>
                </TabsContent>
            ))}
        </Tabs>
    )
}
