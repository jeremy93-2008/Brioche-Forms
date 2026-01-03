'use client'

import {
    closestCenter,
    DndContext,
    DragEndEvent,
    DragOverEvent,
    DragOverlay,
    DragStartEvent,
    KeyboardSensor,
    Modifier,
    PointerSensor,
    UniqueIdentifier,
    useSensor,
    useSensors,
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { ReactNode, useMemo, useState } from 'react'

interface DndProviderProps {
    children: ReactNode
    onDragStart?: (event: DragStartEvent) => void
    onDragOver?: (event: DragOverEvent) => void
    onDragEnd: (event: DragEndEvent) => void
    onDragCancel?: () => void
    renderOverlay?: (activeId: UniqueIdentifier | null) => ReactNode
    /**
     * Restrict drag movement to a specific axis.
     * 'x' for horizontal only (tabs), 'y' for vertical only (sections).
     */
    axis?: 'x' | 'y'
}

/**
 * Wrapper component for @dnd-kit DndContext with pre-configured sensors.
 *
 * Features:
 * - PointerSensor with 8px activation distance (prevents accidental drags)
 * - KeyboardSensor for accessibility (Space/Enter to pick up, arrows to move)
 * - DragOverlay for visual feedback during drag
 *
 * @example
 * <DndProvider
 *   onDragEnd={handleDragEnd}
 *   renderOverlay={(activeId) => activeId && <MyItemClone id={activeId} />}
 * >
 *   <SortableContext items={items}>
 *     {items.map(item => <SortableItem key={item.id} id={item.id} />)}
 *   </SortableContext>
 * </DndProvider>
 */
// Modifier to restrict movement to horizontal axis
const restrictToHorizontalAxis: Modifier = ({ transform }) => {
    return {
        ...transform,
        y: 0,
    }
}

// Modifier to restrict movement to vertical axis
const restrictToVerticalAxis: Modifier = ({ transform }) => {
    return {
        ...transform,
        x: 0,
    }
}

export function DndProvider({
    children,
    onDragStart,
    onDragOver,
    onDragEnd,
    onDragCancel,
    renderOverlay,
    axis,
}: DndProviderProps) {
    const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null)

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // Prevents accidental drags on click
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    // Determine modifiers based on axis prop
    const modifiers = useMemo(() => {
        if (axis === 'x') return [restrictToHorizontalAxis]
        if (axis === 'y') return [restrictToVerticalAxis]
        return undefined
    }, [axis])

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id)
        onDragStart?.(event)
    }

    const handleDragEnd = (event: DragEndEvent) => {
        setActiveId(null)
        onDragEnd(event)
    }

    const handleDragCancel = () => {
        setActiveId(null)
        onDragCancel?.()
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            modifiers={modifiers}
            onDragStart={handleDragStart}
            onDragOver={onDragOver}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
        >
            {children}
            {renderOverlay && <DragOverlay>{renderOverlay(activeId)}</DragOverlay>}
        </DndContext>
    )
}