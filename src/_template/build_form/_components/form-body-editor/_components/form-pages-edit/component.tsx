'use client'

import { SortableItem } from '@/_components/dnd/sortableItem'
import { Tabs, TabsContent, TabsList } from '@/_components/ui/tabs'
import { useAfterSaveOptimisticData } from '@/_hooks/useAfterSaveOptimisticData/useAfterSaveOptimisticData'
import { useSortableItems } from '@/_hooks/useSortableItems'
import { nextOrder } from '@/_hooks/useSortableItems/fractional-indexing'
import { ISortableItem } from '@/_hooks/useSortableItems/types'
import { withDndDragEnd } from '@/_lib/dnd'
import { SingleFormSelectedContext } from '@/_provider/forms/single-form-selected'
import ReorderPagesAction from '@/_server/_handlers/actions/page/reorder'
import { PageCreateFieldDialogComponent } from '@/_template/build_form/_components/form-body-editor/_components/form-pages-edit/_components/_tabs/page-create-field-dialog/component'
import { PageTabSortableComponent } from '@/_template/build_form/_components/form-body-editor/_components/form-pages-edit/_components/_tabs/page-tab-sortable/component'
import { PageSectionsSortableComponent } from '@/_template/build_form/_components/form-body-editor/_components/form-pages-edit/_components/contents/page-sections-sortable/component'
import { useAfterSavePageTabs } from '@/_template/build_form/_components/form-body-editor/_components/form-pages-edit/_hooks/useAfterSavePageTabs'
import { DndContext } from '@dnd-kit/core'
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers'
import {
    horizontalListSortingStrategy,
    SortableContext,
} from '@dnd-kit/sortable'
import { startTransition, use, useState } from 'react'

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

    const handleMove = async <T extends ISortableItem>(
        movedPage: T,
        modifiedPages: T[]
    ) => {
        startTransition(() => {
            updateOptimisticData({
                newUpdateValue: movedPage,
                opts: {
                    type: 'update',
                },
            })
        })
        await ReorderPagesAction({
            form_id: data.id,
            updates: modifiedPages,
        })
    }

    const { sortedItems: sortedPages, moveItem } = useSortableItems(
        data.pages,
        {
            onMove: handleMove,
        }
    )

    return (
        <Tabs
            className="w-full"
            value={currentTabValue}
            onValueChange={setCurrentTabValue}
        >
            <TabsList className="w-full justify-between">
                <section className="flex flex-1 items-center font-sans overflow-x-auto">
                    <DndContext
                        onDragEnd={withDndDragEnd(moveItem)}
                        modifiers={[restrictToHorizontalAxis]}
                    >
                        <SortableContext
                            id="pages"
                            items={sortedPages}
                            strategy={horizontalListSortingStrategy}
                        >
                            {sortedPages.map((page, idx) => (
                                <SortableItem key={page.id} id={page.id}>
                                    <PageTabSortableComponent
                                        key={page.id}
                                        page={page}
                                        formId={data.id}
                                        isActive={currentTabValue === page.id}
                                        canDelete={
                                            idx > 0 && data.pages.length > 1
                                        }
                                        afterSaveUpdate={handleAfterSave({
                                            type: 'update',
                                        })}
                                        afterSaveDelete={handleAfterSaveWhenDeleted(
                                            onAfterOptimisticDataUpdatedWhenDeleted
                                        )}
                                    />
                                </SortableItem>
                            ))}
                        </SortableContext>
                    </DndContext>
                </section>
                <section>
                    <PageCreateFieldDialogComponent
                        formId={data.id}
                        order={nextOrder(sortedPages.map((page) => page.order))}
                        afterSave={handleAfterSaveWhenCreated(
                            data.id,
                            onAfterOptimisticDataUpdatedWhenCreated
                        )}
                    />
                </section>
            </TabsList>
            {sortedPages.map((page) => (
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
