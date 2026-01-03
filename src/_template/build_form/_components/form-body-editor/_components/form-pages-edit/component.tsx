'use client'

import { DndProvider } from '@/_components/dnd/dnd-provider'
import { Tabs, TabsContent, TabsList } from '@/_components/ui/tabs'
import { useAfterSaveOptimisticData } from '@/_hooks/useAfterSaveOptimisticData/useAfterSaveOptimisticData'
import { SingleFormSelectedContext } from '@/_provider/forms/single-form-selected'
import reorderPagesAction from '@/_server/_handlers/actions/page/reorder'
import { PageCreateFieldDialogComponent } from '@/_template/build_form/_components/form-body-editor/_components/form-pages-edit/_components/page-create-field-dialog/component'
import { PageSectionsContent } from '@/_template/build_form/_components/form-body-editor/_components/form-pages-edit/_components/page-sections-content/component'
import { SortablePageTab } from '@/_template/build_form/_components/form-body-editor/_components/form-pages-edit/_components/sortable-page-tab/component'
import { useAfterSavePageTabs } from '@/_template/build_form/_components/form-body-editor/_components/form-pages-edit/_hooks/useAfterSavePageTabs'
import {
    calculateNewOrders,
    normalizeOrders,
} from '@/_utils/fractional-indexing'
import { DragEndEvent } from '@dnd-kit/core'
import {
    arrayMove,
    horizontalListSortingStrategy,
    SortableContext,
} from '@dnd-kit/sortable'
import { startTransition, use, useMemo, useState } from 'react'

export function FormPagesEditComponent() {
    const { data, updateOptimisticData } = use(SingleFormSelectedContext)!
    const [currentTabValue, setCurrentTabValue] = useState<string>(
        data.pages[0]?.id || ''
    )
    const { handleAfterSave } = useAfterSaveOptimisticData()
    const { handleAfterSaveWhenCreated, handleAfterSaveWhenDeleted } =
        useAfterSavePageTabs()

    // Normalize and sort pages by order (handles 'latest' values)
    const sortedPages = useMemo(() => {
        const normalized = normalizeOrders(data.pages)
        return normalized.sort((a, b) => a.order.localeCompare(b.order))
    }, [data.pages])

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

    // Handle drag end - reorder pages using fractional indexing
    const handlePagesDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event
        if (!over || active.id === over.id) return

        const activeId = active.id as string
        const overId = over.id as string

        const oldIndex = sortedPages.findIndex((p) => p.id === activeId)
        const newIndex = sortedPages.findIndex((p) => p.id === overId)

        if (oldIndex === -1 || newIndex === -1) return

        // Calculate new order using fractional indexing
        const newOrders = calculateNewOrders(sortedPages, activeId, overId)

        // Reorder array and apply new order values
        const reorderedPages = arrayMove([...sortedPages], oldIndex, newIndex).map(
            (page) => {
                const orderUpdate = newOrders.find((o) => o.id === page.id)
                return orderUpdate ? { ...page, order: orderUpdate.order } : page
            }
        )

        // Optimistic update
        startTransition(() => {
            updateOptimisticData({
                newUpdateValue: { ...data, pages: reorderedPages },
                opts: { type: 'update' },
            })
        })

        // Persist to server
        await reorderPagesAction({
            form_id: data.id,
            updates: newOrders,
        })
    }

    return (
        <DndProvider onDragEnd={handlePagesDragEnd} axis="x">
            <Tabs
                className="w-full"
                value={currentTabValue}
                onValueChange={setCurrentTabValue}
            >
                <TabsList className="w-full justify-between">
                    <SortableContext
                        items={sortedPages.map((p) => p.id)}
                        strategy={horizontalListSortingStrategy}
                    >
                        <section className="flex flex-1 items-center font-sans overflow-x-auto">
                            {sortedPages.map((page, idx) => (
                                <SortablePageTab
                                    key={page.id}
                                    page={page}
                                    formId={data.id}
                                    isActive={currentTabValue === page.id}
                                    canDelete={idx > 0 && sortedPages.length > 1}
                                    afterSaveUpdate={handleAfterSave({
                                        type: 'update',
                                    })}
                                    afterSaveDelete={handleAfterSaveWhenDeleted(
                                        onAfterOptimisticDataUpdatedWhenDeleted
                                    )}
                                />
                            ))}
                        </section>
                    </SortableContext>
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
                {sortedPages.map((page) => (
                    <TabsContent key={page.id} value={page.id}>
                        <PageSectionsContent page={page} formId={data.id} />
                    </TabsContent>
                ))}
            </Tabs>
        </DndProvider>
    )
}
