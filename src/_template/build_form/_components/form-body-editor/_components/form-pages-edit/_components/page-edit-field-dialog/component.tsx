'use client'
import {
    FormFieldEditDialog,
    FormFieldEditDialogContent,
    FormFieldEditDialogTrigger,
} from '@/_components/shared/form-field-edit-dialog/component.client'
import { Button } from '@/_components/ui/button'
import { Input } from '@/_components/ui/input'
import { type useAfterSaveOptimisticData } from '@/_hooks/useAfterSaveOptimisticData/useAfterSaveOptimisticData'
import EditPageAction from '@/_server/_handlers/actions/page/update'
import { Pen } from 'lucide-react'
import { IPage } from '../../../../../../../../../db/types'

interface IPageEditFieldDialogComponentProps {
    page: IPage
    formId: string
    afterSave?: ReturnType<typeof useAfterSaveOptimisticData>['afterSave']
}

export function PageEditFieldDialogComponent(
    props: IPageEditFieldDialogComponentProps
) {
    const { page, formId, afterSave } = props

    return (
        <FormFieldEditDialog
            title="Renombrar página"
            serverAction={EditPageAction}
            afterSave={afterSave}
        >
            <FormFieldEditDialogTrigger>
                <Button
                    className="w-0 !px-0 opacity-0 group-hover:px-2 group-hover:w-6 group-hover:opacity-100"
                    variant="ghost"
                    size="xs"
                >
                    <Pen className="!w-3 !h-3" />
                </Button>
            </FormFieldEditDialogTrigger>
            <FormFieldEditDialogContent<IPage>>
                {({ register }, { handleKeyUp }) => (
                    <>
                        <input
                            type="hidden"
                            value={page.id}
                            {...register('id')}
                        />
                        <input
                            type="hidden"
                            value={formId}
                            {...register('form_id')}
                        />
                        <Input
                            className="text-secondary"
                            defaultValue={page.title}
                            autoFocus
                            onKeyUp={handleKeyUp}
                            {...register('title')}
                        />
                    </>
                )}
            </FormFieldEditDialogContent>
        </FormFieldEditDialog>
    )
}
