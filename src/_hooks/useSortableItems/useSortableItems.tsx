import {
    materializeOrders,
    moveItemOrders,
} from '@/_hooks/useSortableItems/fractional-indexing'
import { type ISortableItem } from '@/_hooks/useSortableItems/types'
import { log } from '@/_utils/log'
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
        onMove?: (
            currentItemMoved: T,
            updatedItems: T[],
            modifiedItems: T[]
        ) => void
        onDiscard?: () => void
    }
) {
    const getSortedItems = (items: T[]) =>
        [...items].sort(
            (a, b) => a.order.localeCompare(b.order) || a.id.localeCompare(b.id)
        )

    const [sortedItems, setSortedItems] = useState<T[]>(() => {
        return structuredClone(getSortedItems(items))
    })
    const [hasChanges, setHasChanges] = useState(false)

    /**
     * Moves an item by updating the sorted items list. The strategy uses fractional indexing to maintain order.
     * When an item is moved, he pushes the rest of the items accordingly.
     * @param draggedItem - The item being dragged.
     * @param droppedItem - The item where the dragged item is dropped.
     */
    const moveItem = (
        draggedItem: { id: string } | null,
        droppedItem: { id: string } | null
    ) => {
        let tempSortedItems = [...sortedItems]

        if (tempSortedItems.some((e) => e.order === 'latest')) {
            tempSortedItems = materializeOrders(tempSortedItems)
        }

        tempSortedItems = moveItemOrders(
            tempSortedItems,
            tempSortedItems.find((item) => item.id === draggedItem?.id),
            tempSortedItems.find((item) => item.id === droppedItem?.id)
        )

        setSortedItems([...getSortedItems(tempSortedItems)])
        setHasChanges(true)

        opts?.onMove?.(
            tempSortedItems.find((item) => item.id === draggedItem?.id)!,
            getModifiedItems(tempSortedItems),
            getSortedItems(tempSortedItems)
        )
    }

    /**
     * Gets the list of items that have been modified (i.e., their order has changed) compared to the initial items.
     * @param anotherSortedItems - Optional array of sorted items to compare against the initial items.
     * @returns An array of modified items.
     */
    const getModifiedItems = (anotherSortedItems?: T[]) => {
        const initialItems = [...items]

        const currentSortedItems = anotherSortedItems || sortedItems

        return currentSortedItems.filter((sortedItem) => {
            const initialItem = initialItems.find(
                (item) => item.id === sortedItem.id
            )
            return !initialItem || initialItem.order !== sortedItem.order
        })
    }

    /**
     * Discards any changes made to the sorted items and reverts to the initial items.
     */
    const discardChanges = () => {
        setSortedItems(getSortedItems(items))
        setHasChanges(false)
        opts?.onDiscard?.()
        log.debug('Discarded changes, reverted to initial items.')
    }

    return {
        sortedItems,
        moveItem,
        hasChanges,
        getModifiedItems,
        discardChanges,
    }
}
