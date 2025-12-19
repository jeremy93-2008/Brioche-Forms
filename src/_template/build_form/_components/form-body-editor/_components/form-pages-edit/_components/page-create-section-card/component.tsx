import { Button } from '@/_components/ui/button'
import { Card } from '@/_components/ui/card'
import { Field, FieldGroup, FieldLabel, FieldSet } from '@/_components/ui/field'
import { Input } from '@/_components/ui/input'
import { Textarea } from '@/_components/ui/textarea'
import CreateQuestionAction from '@/_server/_handlers/actions/question/create'
import { CreateNewSectionButtonComponent } from '@/_template/build_form/_components/form-body-editor/_components/form-pages-edit/_components/page-create-section-card/_components/create-new-section-button/component'
import {
    BadgeQuestionMarkIcon,
    CaseSensitiveIcon,
    ClapperboardIcon,
    ImageIcon,
} from 'lucide-react'

export function PageCreateSectionCardComponent() {
    return (
        <Card className="flex flex-col justify-center mt-4 px-4 pt-8 pb-4">
            <h2 className="text-center">Añadir una nueva sección</h2>
            <section className="flex gap-6 justify-center mt-2 mb-4">
                <CreateNewSectionButtonComponent
                    buttonText="Nueva pregunta"
                    buttonIcon={
                        <BadgeQuestionMarkIcon className="w-10! h-10!" />
                    }
                    dialogTitle="Crear nueva pregunta"
                    serverAction={CreateQuestionAction}
                >
                    {(form, opts) => (
                        <FieldSet>
                            <FieldGroup>
                                <Field>
                                    <FieldLabel htmlFor="name">
                                        Titulo de la sección
                                    </FieldLabel>
                                    <Input
                                        id="name"
                                        placeholder="Pregunta sin título..."
                                        {...form.register('name')}
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="content">
                                        Contenido de la pregunta
                                    </FieldLabel>
                                    <Textarea
                                        placeholder="Escriba su pregunta..."
                                        {...form.register('content')}
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="content">
                                        Tipo de pregunta
                                    </FieldLabel>
                                    <Textarea
                                        placeholder="Escriba su pregunta..."
                                        {...form.register('content')}
                                    />
                                </Field>
                            </FieldGroup>
                        </FieldSet>
                    )}
                </CreateNewSectionButtonComponent>
                <Button className="flex flex-col h-32 w-38" variant="link">
                    <CaseSensitiveIcon className="w-10! h-10!" />
                    Nuevo texto
                </Button>
                <Button className="flex flex-col h-32 w-38" variant="link">
                    <ImageIcon className="w-10! h-10!" />
                    Nueva Imagen
                </Button>
                <Button className="flex flex-col h-32 w-38" variant="link">
                    <ClapperboardIcon className="w-10! h-10!" />
                    Nuevo Vídeo
                </Button>
            </section>
        </Card>
    )
}
