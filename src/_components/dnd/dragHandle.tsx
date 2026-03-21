import { SortableItemContext } from '@/_components/dnd/sortableItem'
import { GripHorizontalIcon, GripVerticalIcon } from 'lucide-react'
import { use } from 'react'

interface IDragHandlerProps {
    type?: 'vertical' | 'horizontal'
    className?: string
    iconClassName?: string
}

export function DragHandler(props: IDragHandlerProps) {
    const { type = 'horizontal', className, iconClassName } = props
    const sortItemContext = use(SortableItemContext)

    return (
        <section
            ref={sortItemContext?.setActivatorNodeRef}
            {...sortItemContext?.listeners}
            className={`cursor-grab active:cursor-grabbing ${className || ''}`}
        >
            {type === 'horizontal' && (
                <GripHorizontalIcon className={iconClassName} />
            )}
            {type === 'vertical' && (
                <GripVerticalIcon className={iconClassName} />
            )}
        </section>
    )
}
