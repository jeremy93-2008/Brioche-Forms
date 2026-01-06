import { SortableItemContext } from '@/_components/dnd/sortableItem'
import { GripVerticalIcon } from 'lucide-react'
import { use } from 'react'

interface IDragHandlerProps {
    className?: string
    iconClassName?: string
}

export function DragHandler(props: IDragHandlerProps) {
    const { className, iconClassName } = props
    const sortItemContext = use(SortableItemContext)

    return (
        <section
            ref={sortItemContext?.setActivatorNodeRef}
            {...sortItemContext?.listeners}
            className={`cursor-grab active:cursor-grabbing ${className || ''}`}
        >
            <GripVerticalIcon className={iconClassName} />
        </section>
    )
}
