import { Field, FieldGroup, FieldLabel, FieldSet } from '@/_components/ui/field'
import { Input } from '@/_components/ui/input'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/_components/ui/select'
import { Textarea } from '@/_components/ui/textarea'
import CreateQuestionAction from '@/_server/_handlers/actions/question/create'
import { CreateNewSectionButtonComponent } from '@/_template/build_form/_components/form-body-editor/_components/form-pages-edit/_components/page-create-section-card/_components/shared/create-new-section-button/component'
import { ICreateNewSectionButtonProps } from '@/_template/build_form/_components/form-body-editor/_components/form-pages-edit/_components/page-create-section-card/_components/shared/types'
import {
    BadgeQuestionMarkIcon,
    BookOpenIcon,
    Calendar1Icon,
    CaseLowerIcon,
    CircleDotIcon,
    MailIcon,
    PhoneIcon,
    ShapesIcon,
    StarIcon,
    TrendingUpIcon,
} from 'lucide-react'

export function CreateNewQuestionButtonComponent(
    props: ICreateNewSectionButtonProps
) {
    const { formId, pageId } = props
    return (
        <CreateNewSectionButtonComponent
            buttonText="Nueva pregunta"
            buttonIcon={<BadgeQuestionMarkIcon className="w-10! h-10!" />}
            dialogTitle="Crear nueva pregunta"
            serverAction={CreateQuestionAction}
        >
            {(form) => (
                <FieldSet>
                    <input
                        type="hidden"
                        id="form_id"
                        value={formId}
                        {...form.register('form_id')}
                    />
                    <input
                        type="hidden"
                        id="page_id"
                        value={pageId}
                        {...form.register('page_id')}
                    />
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="name">
                                Titulo de la sección
                            </FieldLabel>
                            <Input
                                id="name"
                                placeholder="Sección sin título..."
                                {...form.register('name')}
                            />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="content">
                                Contenido de la pregunta
                            </FieldLabel>
                            <Textarea
                                className="resize-none"
                                id="content"
                                placeholder="Escriba su pregunta..."
                                {...form.register('content')}
                            />
                        </Field>
                        <Field>
                            <FieldLabel>Tipo de pregunta</FieldLabel>
                            <Select defaultValue={QuestionTypes[0].value}>
                                <SelectTrigger className="w-72">
                                    <SelectValue placeholder="Selecciona un espacio de trabajo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {QuestionTypes.map((questionType) => (
                                            <SelectItem
                                                key={questionType.value}
                                                value={questionType.value}
                                            >
                                                {questionType.icon}
                                                {questionType.label}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </Field>
                    </FieldGroup>
                </FieldSet>
            )}
        </CreateNewSectionButtonComponent>
    )
}

const QuestionTypes = [
    {
        icon: <CircleDotIcon />,
        value: 'single_choice',
        label: 'Opción múltiple (única respuesta)',
    },
    {
        icon: <ShapesIcon />,
        value: 'multiple_choice',
        label: 'Opción múltiple (varias respuestas)',
    },
    {
        icon: <CaseLowerIcon />,
        value: 'short_answer',
        label: 'Respuesta corta',
    },
    {
        icon: <BookOpenIcon />,
        value: 'long_answer',
        label: 'Respuesta larga',
    },
    {
        icon: <Calendar1Icon />,
        value: 'short_answer:date',
        label: 'Fecha',
    },
    {
        icon: <PhoneIcon />,
        value: 'short_answer:phone',
        label: 'Teléfono',
    },
    {
        icon: <MailIcon />,
        value: 'short_answer:email',
        label: 'Correo electrónico',
    },
    {
        icon: <StarIcon />,
        value: 'short_answer:rating',
        label: 'Valoración',
    },
    {
        icon: <TrendingUpIcon />,
        value: 'short_answer:opinion_scale',
        label: 'Escala de opinión',
    },
]
