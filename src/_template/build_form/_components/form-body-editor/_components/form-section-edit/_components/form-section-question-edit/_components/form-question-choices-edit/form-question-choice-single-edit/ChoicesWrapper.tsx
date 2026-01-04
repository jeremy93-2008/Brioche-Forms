import { Field } from '@/_components/ui/field'
import { PropsWithChildren } from 'react'

interface IChoiceWrapperProps extends PropsWithChildren {
    id: string
    isDraggable: boolean
}

export function ChoiceWrapper(props: IChoiceWrapperProps) {
    const { id, isDraggable, children } = props

    if (isDraggable) {
        return (
            <Field className="group flex flex-row items-center mb-2">
                {children}
            </Field>
        )
    }

    return <Field className="flex flex-row items-center mb-2">{children}</Field>
}
