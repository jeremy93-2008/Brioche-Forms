import { DragEndEvent } from '@dnd-kit/core'

type IDndDragEndCallback = (
    draggedItem: { id: string } | null,
    droppedItem: { id: string } | null
) => void

export function withDndDragEnd(cb: IDndDragEndCallback) {
    return (event: DragEndEvent) => {
        const { active, over } = event
        const draggedItem = active ? { id: active.id as string } : null
        const droppedItem = over ? { id: over.id as string } : null
        cb(draggedItem, droppedItem)
    }
}
