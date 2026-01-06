import { type ISortableItem } from '@/_hooks/useSortableItems/types'

export const BASE_62_DIGITS =
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
export const BASE_62_LENGTH = BASE_62_DIGITS.length

/**
 * Reassigns order values to items to ensure they are evenly spaced.
 * @param items - Array of sortable items with 'id' and 'order' properties.
 * @returns New array of items with updated 'order' values.
 */
export function materializeOrders<T extends ISortableItem>(items: T[]): T[] {
    const sortedItems = [...items].sort(
        (a, b) => a.order.localeCompare(b.order) || a.id.localeCompare(b.id)
    )

    const digitsNeeded = Math.max(
        Math.ceil(Math.log(items.length) / Math.log(BASE_62_DIGITS.length)) ||
            1,
        3
    )
    const offset = Math.floor(Math.pow(BASE_62_LENGTH, digitsNeeded) / 2)

    return sortedItems.map((item, index) => {
        const newOrder = encodeOrder(index + offset, digitsNeeded)
        return {
            ...item,
            order: newOrder,
        }
    })
}

/**
 * Moves an item by updating its order value based on the position of the dropped item.
 * @param items - Array of sortable items with 'id' and 'order' properties.
 * @param draggedItem - The item being dragged.
 * @param droppedItem - The item where the dragged item is dropped.
 * @returns New array of items with updated 'order' values.
 */
export function moveItemOrders<T extends ISortableItem>(
    items: T[],
    draggedItem?: ISortableItem,
    droppedItem?: ISortableItem
): T[] {
    if (!draggedItem || !droppedItem) return items

    let direction: 'toBackward' | 'toForward' = 'toBackward'
    if (draggedItem.order < droppedItem.order) direction = 'toForward'

    const droppedIndex = items.findIndex((i) => i.id === droppedItem.id)
    let newOrder = ''

    if (direction === 'toBackward') {
        const beforeItem = items[droppedIndex - 1]
        const afterItem = droppedItem

        if (!beforeItem) {
            newOrder = decrementOrder(afterItem.order)
        } else {
            newOrder = calculateMidpoint(beforeItem.order, afterItem.order)
        }
    } else if (direction === 'toForward') {
        const beforeItem = droppedItem
        const afterItem = items[droppedIndex + 1]

        if (!afterItem) {
            newOrder = incrementOrder(beforeItem.order)
        } else {
            newOrder = calculateMidpoint(beforeItem.order, afterItem.order)
        }
    }

    draggedItem.order = newOrder

    return items
}

/**
 * Encodes a given index into a base-62 string of specified length.
 * @param index - The index to encode.
 * @param length - The desired length of the resulting string.
 * @returns The base-62 encoded string.
 */
export function encodeOrder(index: number, length: number): string {
    let newOrder = ''

    while (index > 0) {
        const currentNumber = index % BASE_62_LENGTH
        newOrder = `${BASE_62_DIGITS[currentNumber]}${newOrder}`
        index = Math.floor(index / BASE_62_LENGTH)
    }

    return newOrder.padStart(length, '0')
}

/**
 * Calculates the midpoint order string between two given order strings.
 * @param beforeOrder - The order string before the desired midpoint.
 * @param afterOrder - The order string after the desired midpoint.
 * @returns The calculated midpoint order string.
 */
export function calculateMidpoint(
    beforeOrder: string,
    afterOrder: string
): string {
    const normalizedLength = Math.max(beforeOrder.length, afterOrder.length)
    beforeOrder = beforeOrder.padEnd(normalizedLength, '0')
    afterOrder = afterOrder.padEnd(normalizedLength, '0')

    const length = beforeOrder.length
    let result = ''
    let needsExtraDigit = true

    for (let i = 0; i < length; i++) {
        const beforeIndex = BASE_62_DIGITS.indexOf(beforeOrder[i])
        const afterIndex = BASE_62_DIGITS.indexOf(afterOrder[i])

        if (beforeIndex === afterIndex) {
            result += beforeOrder[i]
            continue
        }

        const diff = afterIndex - beforeIndex

        if (diff > 1) {
            const midIndex = beforeIndex + Math.floor(diff / 2)
            result += BASE_62_DIGITS[midIndex]
            needsExtraDigit = false
            break
        } else {
            result += beforeOrder[i]
            needsExtraDigit = true
        }
    }

    if (needsExtraDigit) {
        result += BASE_62_DIGITS[Math.floor(BASE_62_LENGTH / 2)]
    }

    return result
}

/**
 * Increments the given order string by one in base-62.
 * @param order - The order string to increment.
 * @returns The incremented order string.
 */
export function incrementOrder(order: string): string {
    const digits = order.split('').map((char) => BASE_62_DIGITS.indexOf(char))

    let carry = 1
    for (let i = digits.length - 1; i >= 0 && carry > 0; i--) {
        digits[i] += carry

        if (digits[i] >= BASE_62_LENGTH) {
            digits[i] = 0
            carry = 1
        } else {
            carry = 0
        }
    }

    if (carry > 0) {
        return order + '0'
    }

    return digits.map((d) => BASE_62_DIGITS[d]).join('')
}

/**
 * Decrements the given order string by one in base-62.
 * @param order - The order string to decrement.
 * @returns The decremented order string.
 */
export function decrementOrder(order: string): string {
    const digits = order.split('').map((char) => BASE_62_DIGITS.indexOf(char))

    let borrow = 1
    for (let i = digits.length - 1; i >= 0 && borrow > 0; i--) {
        digits[i] -= borrow

        if (digits[i] < 0) {
            digits[i] = BASE_62_LENGTH - 1
            borrow = 1
        } else {
            borrow = 0
        }
    }

    if (borrow > 0) {
        return '0' + order
    }

    return digits.map((d) => BASE_62_DIGITS[d]).join('')
}

export function nextOrder(currentOrders: string[]): string {
    if (currentOrders.length === 0) {
        console.warn(
            'No items available to determine next order. Using default value.'
        )
        return encodeOrder(115000, 3)
    }
    if (currentOrders.some((order) => order === 'latest')) {
        return 'latest'
    }

    const lastOrder = currentOrders.reduce((max, order) =>
        order > max ? order : max
    )
    return incrementOrder(lastOrder)
}
