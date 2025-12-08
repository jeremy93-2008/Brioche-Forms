'use client'
import {
    FormFieldEditDialog,
    FormFieldEditDialogContent,
    FormFieldEditDialogTrigger,
} from '@/_components/shared/form-field-edit-dialog/component.client'
import { Button } from '@/_components/ui/button'
import { Input } from '@/_components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/_components/ui/tabs'
import { SingleFormSelectedContext } from '@/_provider/forms/single-form-selected'
import EditPageAction from '@/_server/actions/page/update'
import { IFullForm } from '@/_server/queries/form/get'
import { FormSectionEditComponent } from '@/_template/build_form/_components/form-body-editor/_components/form-section-edit/component'
import { Pen, Plus } from 'lucide-react'
import { use } from 'react'
import { IPage } from '../../../../../../../db/types'

export function FormPagesEditComponent() {
    const data: IFullForm = use(SingleFormSelectedContext)!
    return (
        <Tabs className="w-full" defaultValue={data.pages[0]?.id || ''}>
            <TabsList className="w-full justify-between">
                <section className="flex flex-1 items-center font-sans overflow-x-auto">
                    {data.pages.map((page) => (
                        <TabsTrigger
                            className="w-fit flex-none flex items-center group"
                            value={page.id}
                            key={page.id}
                        >
                            <>
                                {page.title || 'Página sin título'}
                                <FormFieldEditDialog
                                    title="Renombrar página"
                                    serverAction={EditPageAction}
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
                                                    value={data.id}
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
                            </>
                        </TabsTrigger>
                    ))}
                </section>
                <section>
                    <Button className="ml-8" variant="default" size="xs">
                        <Plus />
                        Añadir Página
                    </Button>
                </section>
            </TabsList>
            {data.pages.map((page) => (
                <TabsContent key={page.id} value={page.id}>
                    <section className="flex flex-1 flex-col border rounded-lg">
                        {page.sections.map((section) => (
                            <FormSectionEditComponent
                                key={section.id}
                                data={section}
                            />
                        ))}
                    </section>
                </TabsContent>
            ))}
        </Tabs>
    )
}
