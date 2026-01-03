'use client'

import { cn } from '@/_utils/clsx-tw'
import { useSortable } from '@dnd-kit/sortable'
import { GripVertical } from 'lucide-react'
import { ComponentProps } from 'react'

interface DragHandleProps extends ComponentProps<'button'> {
    /**
     * The ID of the sortable item this handle controls.
     * Must match the id passed to SortableItem.
     */
    id: string
    /**
     * Icon size in pixels. Defaults to 16.
     */
    iconSize?: number
}

/**
 * Drag handle component for sortable items.
 *
 * Use this when you want only a specific part of the item to be draggable,
 * rather than the entire item. Pair with SortableItem's `useHandle` prop.
 *
 * @example
 * <SortableItem id={item.id} useHandle>
 *   <div className="flex items-center">
 *     <DragHandle id={item.id} />
 *     <span>{item.name}</span>
 *   </div>
 * </SortableItem>
 */
export function DragHandle({
    id,
    iconSize = 16,
    className,
    ...props
}: DragHandleProps) {
    const { attributes, listeners, isDragging } = useSortable({ id })

    return (
        <button
            type="button"
            className={cn(
                'touch-none cursor-grab active:cursor-grabbing',
                'text-muted-foreground hover:text-foreground',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                'rounded-sm p-0.5 -ml-1',
                'transition-colors',
                isDragging && 'cursor-grabbing',
                className
            )}
            {...attributes}
            {...listeners}
            {...props}
        >
            <GripVertical
                size={iconSize}
                className="shrink-0"
                aria-hidden="true"
            />
            <span className="sr-only">Drag to reorder</span>
        </button>
    )
}