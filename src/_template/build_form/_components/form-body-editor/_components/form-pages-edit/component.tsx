'use client'

import { Tabs, TabsContent, TabsList } from '@/_components/ui/tabs'
import { useAfterSaveOptimisticData } from '@/_hooks/useAfterSaveOptimisticData/useAfterSaveOptimisticData'
import { SingleFormSelectedContext } from '@/_provider/forms/single-form-selected'
import { PageCreateFieldDialogComponent } from '@/_template/build_form/_components/form-body-editor/_components/form-pages-edit/_components/_tabs/page-create-field-dialog/component'
import { PageTabSortableComponent } from '@/_template/build_form/_components/form-body-editor/_components/form-pages-edit/_components/_tabs/page-tab-sortable/component'
import { PageSectionsSortableComponent } from '@/_template/build_form/_components/form-body-editor/_components/form-pages-edit/_components/contents/page-sections-sortable/component'
import { useAfterSavePageTabs } from '@/_template/build_form/_components/form-body-editor/_components/form-pages-edit/_hooks/useAfterSavePageTabs'
import { use, useState } from 'react'

export function FormPagesEditComponent() {
    const { data, updateOptimisticData } = use(SingleFormSelectedContext)!
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
                        <PageTabSortableComponent
                            key={page.id}
                            page={page}
                            formId={data.id}
                            isActive={currentTabValue === page.id}
                            canDelete={idx > 0 && data.pages.length > 1}
                            afterSaveUpdate={handleAfterSave({
                                type: 'update',
                            })}
                            afterSaveDelete={handleAfterSaveWhenDeleted(
                                onAfterOptimisticDataUpdatedWhenDeleted
                            )}
                        />
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
                    <PageSectionsSortableComponent
                        page={page}
                        formId={data.id}
                    />
                </TabsContent>
            ))}
        </Tabs>
    )
}
