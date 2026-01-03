'use client'

import { DndProvider } from '@/_components/dnd/dnd-provider'
import { SingleFormSelectedContext } from '@/_provider/forms/single-form-selected'
import reorderSectionsAction from '@/_server/_handlers/actions/section/reorder'
import { IFullForm } from '@/_server/domains/form/getFullForms'
import { PageCreateSectionCardComponent } from '@/_template/build_form/_components/form-body-editor/_components/form-pages-edit/_components/page-create-section-card/component'
import { SortableSectionCard } from '@/_template/build_form/_components/form-body-editor/_components/form-section-edit/_components/sortable-section-card/component'
import {
    calculateNewOrders,
    normalizeOrders,
} from '@/_utils/fractional-indexing'
import { DragEndEvent } from '@dnd-kit/core'
import {
    arrayMove,
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { startTransition, use, useMemo } from 'react'

interface IPageSectionsContentProps {
    page: IFullForm['pages'][0]
    formId: string
}

/**
 * Handles the content of a single page including its sections with DnD support.
 * Each page has its own DndContext for vertical section reordering.
 */
export function PageSectionsContent({
    page,
    formId,
}: IPageSectionsContentProps) {
    const { data, updateOptimisticData } = use(SingleFormSelectedContext)!

    // Normalize and sort sections by order (handles 'latest' values)
    const sortedSections = useMemo(() => {
        const normalized = normalizeOrders(page.sections)
        return normalized.sort((a, b) => a.order.localeCompare(b.order))
    }, [page.sections])

    // Handle drag end - reorder sections using fractional indexing
    const handleSectionsDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event
        if (!over || active.id === over.id) return

        const activeId = active.id as string
        const overId = over.id as string

        const oldIndex = sortedSections.findIndex((s) => s.id === activeId)
        const newIndex = sortedSections.findIndex((s) => s.id === overId)

        if (oldIndex === -1 || newIndex === -1) return

        // Calculate new order using fractional indexing
        const newOrders = calculateNewOrders(sortedSections, activeId, overId)

        // Reorder array and apply new order values
        const reorderedSections = arrayMove(
            [...sortedSections],
            oldIndex,
            newIndex
        ).map((section) => {
            const orderUpdate = newOrders.find((o) => o.id === section.id)
            return orderUpdate
                ? { ...section, order: orderUpdate.order }
                : section
        })

        // Optimistic update - update the specific page's sections
        startTransition(() => {
            const updatedPages = data.pages.map((p) =>
                p.id === page.id ? { ...p, sections: reorderedSections } : p
            )
            updateOptimisticData({
                newUpdateValue: { ...data, pages: updatedPages },
                opts: { type: 'update' },
            })
        })

        // Persist to server
        await reorderSectionsAction({
            form_id: formId,
            updates: newOrders,
        })
    }

    return (
        <DndProvider onDragEnd={handleSectionsDragEnd}>
            <SortableContext
                items={sortedSections.map((s) => s.id)}
                strategy={verticalListSortingStrategy}
            >
                <section className="flex flex-1 flex-col">
                    {sortedSections.map((section) => (
                        <SortableSectionCard
                            key={section.id}
                            data={section}
                            formId={formId}
                        />
                    ))}
                    <PageCreateSectionCardComponent page={page} />
                </section>
            </SortableContext>
        </DndProvider>
    )
}