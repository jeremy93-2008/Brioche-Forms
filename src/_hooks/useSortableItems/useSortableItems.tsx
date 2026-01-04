import { materializeOrders } from '@/_hooks/useSortableItems/fractional-indexing'
import { type ISortableItem } from '@/_hooks/useSortableItems/types'
import { useState } from 'react'

/**
 * Hook to manage sortable items with lexicographical fractional indexing with move and discard functionality.
 * @param items - Array of items to be sorted, each having an 'id' and 'order' property.
 * @param opts - Optional callbacks for move and discard actions.
 * @returns An object containing sorted items, move function, change status, pending moves, and discard function.
 */
export function useSortableItems<T extends ISortableItem>(
    items: T[],
    opts?: {
        onMove?: (updatedItems: T[]) => void
        onDiscard?: () => void
    }
) {
    const [sortedItems, setSortedItems] = useState<T[]>(() => {
        return [...items].sort(
            (a, b) => a.order.localeCompare(b.order) || a.id.localeCompare(b.id)
        )
    })
    const [hasChanges, setHasChanges] = useState(false)

    const moveItem = (draggedItem: T | null, droppedItem: T | null) => {
        let tempSortedItems = [...sortedItems]

        if (tempSortedItems.some((e) => e.order === 'latest')) {
            tempSortedItems = materializeOrders(tempSortedItems)
        }
        setHasChanges(true)
    }

    return {
        sortedItems,
        moveItem,
        hasChanges,
        getPendingMoves: () => {},
        discardChanges: () => {},
        commitChanges: () => {},
    }
}
