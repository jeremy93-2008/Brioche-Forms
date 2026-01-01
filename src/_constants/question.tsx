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
] as const

export type IQuestionTypeValues = (typeof QuestionTypes)[number]['value']
