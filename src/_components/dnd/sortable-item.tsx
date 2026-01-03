'use client'

import { cn } from '@/_utils/clsx-tw'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { CSSProperties, ReactNode } from 'react'

interface SortableItemProps {
    id: string
    children: ReactNode
    className?: string
    disabled?: boolean
    /**
     * If true, only the DragHandle component triggers drag.
     * If false (default), the entire item is draggable.
     */
    useHandle?: boolean
}

/**
 * Generic sortable item wrapper using @dnd-kit.
 *
 * Provides transform/transition styles and drag state feedback.
 * Can be used with or without a separate drag handle.
 *
 * @example
 * // Entire item is draggable
 * <SortableItem id={item.id}>
 *   <MyCard />
 * </SortableItem>
 *
 * @example
 * // Only handle is draggable
 * <SortableItem id={item.id} useHandle>
 *   <DragHandle id={item.id} />
 *   <MyCard />
 * </SortableItem>
 */
export function SortableItem({
    id,
    children,
    className,
    disabled = false,
    useHandle = false,
}: SortableItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id,
        disabled,
    })

    const style: CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    // Only attach listeners if not using handle
    const dragProps = useHandle ? {} : { ...attributes, ...listeners }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                className,
                isDragging && 'opacity-50 z-50',
                !useHandle && !disabled && 'cursor-grab active:cursor-grabbing'
            )}
            {...dragProps}
        >
            {children}
        </div>
    )
}

/**
 * Context for passing sortable state to children.
 * Useful for custom drag handle styling.
 */
export { useSortable }