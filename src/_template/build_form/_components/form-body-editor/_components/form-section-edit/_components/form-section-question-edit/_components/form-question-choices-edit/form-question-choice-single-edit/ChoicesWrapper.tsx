import { Field } from '@/_components/ui/field'
import { cn } from '@/_utils/clsx-tw'
import { PropsWithChildren } from 'react'

interface IChoiceWrapperProps extends PropsWithChildren {
    id: string
    className?: string
    isDraggable: boolean
}

export function ChoiceWrapper(props: IChoiceWrapperProps) {
    const { id, className, isDraggable, children } = props

    if (isDraggable) {
        return (
            <Field
                className={cn(
                    'group flex flex-row items-center mb-2',
                    className
                )}
            >
                {children}
            </Field>
        )
    }

    return (
        <Field className={cn('flex flex-row items-center mb-2', className)}>
            {children}
        </Field>
    )
}
