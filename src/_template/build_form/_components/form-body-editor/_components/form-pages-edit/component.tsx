'use client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/_components/ui/tabs'
import { useAfterSaveOptimisticData } from '@/_hooks/useAfterSaveOptimisticData/useAfterSaveOptimisticData'
import { SingleFormSelectedContext } from '@/_provider/forms/single-form-selected'
import { PageCreateFieldDialogComponent } from '@/_template/build_form/_components/form-body-editor/_components/form-pages-edit/_components/page-create-field-dialog/component'
import { PageCreateSectionCardComponent } from '@/_template/build_form/_components/form-body-editor/_components/form-pages-edit/_components/page-create-section-card/component'
import { PageDeleteFieldDialogComponent } from '@/_template/build_form/_components/form-body-editor/_components/form-pages-edit/_components/page-delete-field-dialog/component'
import { PageEditFieldDialogComponent } from '@/_template/build_form/_components/form-body-editor/_components/form-pages-edit/_components/page-edit-field-dialog/component'
import { useAfterSavePageTabs } from '@/_template/build_form/_components/form-body-editor/_components/form-pages-edit/_hooks/useAfterSavePageTabs'
import { FormSectionEditComponent } from '@/_template/build_form/_components/form-body-editor/_components/form-section-edit/component'
import { use, useState } from 'react'

export function FormPagesEditComponent() {
    const { data } = use(SingleFormSelectedContext)!
    const [currentTabValue, setCurrentTabValue] = useState<string>(
        data.pages[0]?.id || ''
    )
    const { handleAfterSave } = useAfterSaveOptimisticData()
    const { handleAfterSaveWhenCreated, handleAfterSaveWhenDeleted } =
        useAfterSavePageTabs()

    const onAfterOptimisticDataUpdatedWhenDeleted = () => {
        // Ensure the current tab is valid
        if (data.pages.find((page) => page.id === currentTabValue)) return
        // If not, set it to the first page's id
        setCurrentTabValue(data.pages[0]?.id)
    }

    const onAfterOptimisticDataUpdatedWhenCreated = () => {
        // Set the current tab to the newly created page
        setCurrentTabValue(data.pages[data.pages.length - 1]?.id)
    }

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
                                            afterSave={handleAfterSave({
                                                type: 'update',
                                            })}
                                        />
                                        {idx > 0 && data.pages.length > 1 && (
                                            <PageDeleteFieldDialogComponent
                                                pageId={page.id}
                                                formId={data.id}
                                                afterSave={handleAfterSaveWhenDeleted(
                                                    onAfterOptimisticDataUpdatedWhenDeleted
                                                )}
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
                        afterSave={handleAfterSaveWhenCreated(
                            data.id,
                            onAfterOptimisticDataUpdatedWhenCreated
                        )}
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
