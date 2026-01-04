import { type ISortableItem } from '@/_hooks/useSortableItems/types'

const BASE_62_DIGITS =
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
const BASE_62_LENGTH = BASE_62_DIGITS.length

export function materializeOrders<T extends ISortableItem>(items: T[]): T[] {
    const sortedItems = [...items].sort(
        (a, b) => a.order.localeCompare(b.order) || a.id.localeCompare(b.id)
    )

    const digitsNeeded =
        Math.ceil(Math.log(items.length) / Math.log(BASE_62_DIGITS.length)) || 1

    return sortedItems.map((item, index) => {
        const newOrder = encodeOrder(index, digitsNeeded)
        return {
            ...item,
            order: newOrder,
        }
    })
}

function encodeOrder(index: number, length: number): string {
    let newOrder = ''

    while (index > 0) {
        const currentNumber = index % BASE_62_LENGTH
        newOrder = `${BASE_62_DIGITS[currentNumber]}${newOrder}`
        index = Math.floor(index / BASE_62_LENGTH)
    }

    return newOrder.padStart(length, '0')
}
