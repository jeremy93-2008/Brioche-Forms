'use client'

import { SortableItem } from '@/_components/dnd/sortableItem'
import { useSortableItems } from '@/_hooks/useSortableItems'
import { nextOrder } from '@/_hooks/useSortableItems/fractional-indexing'
import { ISortableItem } from '@/_hooks/useSortableItems/types'
import { withDndDragEnd } from '@/_lib/dnd'
import { SingleFormSelectedContext } from '@/_provider/forms/single-form-selected'
import ReorderSectionsAction from '@/_server/_handlers/actions/section/reorder'
import { IFullForm } from '@/_server/domains/form/getFullForms'
import { PageCreateSectionCardComponent } from '@/_template/build_form/_components/form-body-editor/_components/form-pages-edit/_components/contents/page-create-section-card/component'
import { FormSectionEditComponent } from '@/_template/build_form/_components/form-body-editor/_components/form-section-edit/component'
import { DndContext } from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { startTransition, use } from 'react'

interface IPageSectionsContentProps {
    page: IFullForm['pages'][0]
    formId: string
}

export function PageSectionsSortableComponent({
    page,
    formId,
}: IPageSectionsContentProps) {
    const { updateOptimisticData } = use(SingleFormSelectedContext)!

    const handleMove = async <T extends ISortableItem>(
        movedSection: T,
        modifiedSections: T[]
    ) => {
        startTransition(() => {
            updateOptimisticData({
                newUpdateValue: movedSection,
                opts: {
                    type: 'update',
                },
            })
        })
        await ReorderSectionsAction({
            form_id: formId,
            updates: modifiedSections,
        })
    }

    const { sortedItems: sortedSections, moveItem } = useSortableItems(
        page.sections,
        {
            onMove: handleMove,
        }
    )

    return (
        <DndContext
            onDragEnd={withDndDragEnd(moveItem)}
            modifiers={[restrictToVerticalAxis]}
        >
            <SortableContext
                id="sections"
                items={sortedSections}
                strategy={verticalListSortingStrategy}
            >
                <section className="flex flex-1 flex-col">
                    {sortedSections.map((section) => (
                        <SortableItem key={section.id} id={section.id}>
                            <FormSectionEditComponent
                                key={section.id}
                                data={section}
                                formId={formId}
                            />
                        </SortableItem>
                    ))}
                    <PageCreateSectionCardComponent
                        page={page}
                        nextOrder={nextOrder(
                            sortedSections.map((s) => s.order)
                        )}
                    />
                </section>
            </SortableContext>
        </DndContext>
    )
}
