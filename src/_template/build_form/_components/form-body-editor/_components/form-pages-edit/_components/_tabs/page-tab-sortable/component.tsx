'use client'

import { TabsTrigger } from '@/_components/ui/tabs'
import { IReturnAction } from '@/_server/_handlers/actions/types'
import { IFullForm } from '@/_server/domains/form/getFullForms'
import { PageDeleteFieldDialogComponent } from '@/_template/build_form/_components/form-body-editor/_components/form-pages-edit/_components/_tabs/page-delete-field-dialog/component'
import { PageEditFieldDialogComponent } from '@/_template/build_form/_components/form-body-editor/_components/form-pages-edit/_components/_tabs/page-edit-field-dialog/component'

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

export function PageTabSortableComponent({
    page,
    formId,
    isActive,
    canDelete,
    afterSaveUpdate,
    afterSaveDelete,
}: ISortablePageTabProps) {
    return (
        <TabsTrigger
            asChild
            className="w-fit flex-none flex items-center group"
            value={page.id}
        >
            <section className="w-fit flex-none flex items-center group">
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
    )
}
