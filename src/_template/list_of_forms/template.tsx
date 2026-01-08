'use client'
import initialPoster from '@/_assets/initial-poster.jpg'
import {
    FormFieldEditDialog,
    FormFieldEditDialogContent,
    FormFieldEditDialogTrigger,
} from '@/_components/shared/form-field-edit-dialog/component.client'
import { Card } from '@/_components/ui/card'
import { Field, FieldSet } from '@/_components/ui/field'
import { Input } from '@/_components/ui/input'
import { useServerActionCreateForm } from '@/_hooks/useServerActionCreateForm/useServerActionCreateForm'
import { IFullForm } from '@/_server/domains/form/getFullForms'
import { IForm } from '@db/types'
import { PlusIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import * as React from 'react'

interface IListOfFormsTemplateProps {
    data: IFullForm[]
}

export function ListOfFormsTemplate(props: IListOfFormsTemplateProps) {
    const { data } = props

    const { runAction } = useServerActionCreateForm()

    return (
        <section className="flex justify-center gap-6 flex-1 w-full">
            {data.map((form) => (
                <Link key={form.id} href={`/form/${form.id}`}>
                    <Card
                        className="relative group overflow-hidden py-0 gap-3 cursor-pointer opacity-90 hover:opacity-100"
                        key={form.id}
                    >
                        <section
                            style={{ backgroundColor: form.backgroundColor }}
                        >
                            <Image
                                src={form.headerImage ?? initialPoster.src}
                                width="300"
                                height="200"
                                alt="image of form"
                            />
                            <h2 className="text-secondary text-shadow-xl px-4">
                                {form.title}
                            </h2>
                        </section>
                        <p className="px-4 pb-4 min-h-10">{form.description}</p>
                    </Card>
                </Link>
            ))}
            <FormFieldEditDialog
                title="Agregar nuevo formulario"
                serverAction={runAction}
                saveButtonText="Crear"
                saveButtonVariant="default"
            >
                <FormFieldEditDialogTrigger>
                    <section
                        className=" relative py-0 gap-3 cursor-pointer opacity-90 hover:opacity-100
            flex flex-col items-center justify-center w-82 h-58 border border-dashed border-border rounded-lg
            hover:text-primary"
                    >
                        <PlusIcon />
                        <span>Agregar nuevo formulario</span>
                    </section>
                </FormFieldEditDialogTrigger>
                <FormFieldEditDialogContent<Partial<IForm>>>
                    {({ register }, { handleKeyUp }) => (
                        <FieldSet>
                            <Field>
                                <Input
                                    id="title"
                                    className="text-secondary"
                                    defaultValue={''}
                                    autoFocus
                                    onKeyUp={handleKeyUp}
                                    {...register('title')}
                                />
                            </Field>
                        </FieldSet>
                    )}
                </FormFieldEditDialogContent>
            </FormFieldEditDialog>
        </section>
    )
}
