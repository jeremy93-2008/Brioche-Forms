import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import React from 'react'

interface ISortableItemProps extends React.PropsWithChildren {
    id: string
}

export const SortableItemContext = React.createContext<Omit<
    ReturnType<typeof useSortable>,
    'attributes' | 'setNodeRef' | 'transform' | 'transition'
> | null>(null)

export function SortableItem(props: ISortableItemProps) {
    const { id, children } = props

    const { attributes, setNodeRef, transform, transition, ...rest } =
        useSortable({ id })

    const style = {
        transform: CSS.Transform.toString({
            x: transform?.x ?? 0,
            y: transform?.y ?? 0,
            scaleX: 1,
            scaleY: 1,
        }),
        transition,
    }

    return (
        <SortableItemContext value={rest}>
            <section
                ref={setNodeRef}
                className={rest.isDragging ? 'z-50' : 'z-0'}
                style={style}
                {...attributes}
            >
                {children}
            </section>
        </SortableItemContext>
    )
}
