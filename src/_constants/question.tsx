import {
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

export const QuestionTypes = [
    {
        icon: <CircleDotIcon className="stroke-primary" />,
        value: 'single_choice',
        label: 'Opción múltiple (única respuesta)',
    },
    {
        icon: <ShapesIcon className="stroke-primary" />,
        value: 'multiple_choice',
        label: 'Opción múltiple (varias respuestas)',
    },
    {
        icon: <CaseLowerIcon className="stroke-primary" />,
        value: 'short_answer',
        label: 'Respuesta corta',
    },
    {
        icon: <BookOpenIcon className="stroke-primary" />,
        value: 'long_answer',
        label: 'Respuesta larga',
    },
    {
        icon: <Calendar1Icon className="stroke-primary" />,
        value: 'short_answer:date',
        label: 'Fecha',
    },
    {
        icon: <PhoneIcon className="stroke-primary" />,
        value: 'short_answer:phone',
        label: 'Teléfono',
    },
    {
        icon: <MailIcon className="stroke-primary" />,
        value: 'short_answer:email',
        label: 'Correo electrónico',
    },
    {
        icon: <StarIcon className="stroke-primary" />,
        value: 'short_answer:rating',
        label: 'Valoración',
    },
    {
        icon: <TrendingUpIcon className="stroke-primary" />,
        value: 'short_answer:opinion_scale',
        label: 'Escala de opinión',
    },
] as const

export type IQuestionTypeValues = (typeof QuestionTypes)[number]['value']
