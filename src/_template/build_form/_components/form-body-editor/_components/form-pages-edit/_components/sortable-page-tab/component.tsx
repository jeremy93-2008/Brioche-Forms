'use client'

import { DragHandle } from '@/_components/dnd/drag-handle'
import { SortableItem } from '@/_components/dnd/sortable-item'
import { TabsTrigger } from '@/_components/ui/tabs'
import { IFullForm } from '@/_server/domains/form/getFullForms'
import { IReturnAction } from '@/_server/_handlers/actions/types'
import { PageDeleteFieldDialogComponent } from '@/_template/build_form/_components/form-body-editor/_components/form-pages-edit/_components/page-delete-field-dialog/component'
import { PageEditFieldDialogComponent } from '@/_template/build_form/_components/form-body-editor/_components/form-pages-edit/_components/page-edit-field-dialog/component'

interface ISortablePageTabProps {
    page: IFullForm['pages'][number]
    formId: string
    isActive: boolean
    canDelete: boolean
    afterSaveUpdate: (
        isSuccess: boolean,
        updatedData: any,
        result: IReturnAction<any>
    ) => void
    afterSaveDelete: (
        isSuccess: boolean,
        updatedData: any,
        result: IReturnAction<any>
    ) => void
}

/**
 * Sortable wrapper for a page tab (horizontal drag and drop).
 * Shows drag handle on hover to indicate reorderability.
 */
export function SortablePageTab({
    page,
    formId,
    isActive,
    canDelete,
    afterSaveUpdate,
    afterSaveDelete,
}: ISortablePageTabProps) {
    return (
        <SortableItem id={page.id} useHandle className="flex-none">
            <TabsTrigger
                asChild
                className="w-fit flex-none flex items-center group"
                value={page.id}
            >
                <section className="w-fit flex-none flex items-center group">
                    {/* Drag Handle - visible on hover */}
                    <DragHandle
                        id={page.id}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        iconSize={12}
                    />
                    {page.title || 'Página sin título'}
                    {isActive && (
                        <>
                            <PageEditFieldDialogComponent
                                page={page}
                                formId={formId}
                                afterSave={afterSaveUpdate}
                            />
                            {canDelete && (
                                <PageDeleteFieldDialogComponent
                                    pageId={page.id}
                                    formId={formId}
                                    afterSave={afterSaveDelete}
                                />
                            )}
                        </>
                    )}
                </section>
            </TabsTrigger>
        </SortableItem>
    )
}