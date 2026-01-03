/**
 * TODO - Need to rewrote it in base-16 to take in account the "latest" string as a first-class citizen
 * Fractional Indexing for Lexicographic Ordering
 *
 * Generates strings that sort lexicographically between two positions.
 * Uses base-62 (a-z, A-Z, 0-9) for compact representation.
 *
 * Examples:
 * - generateOrderBetween(null, null) -> 'N' (midpoint, first item)
 * - generateOrderBetween('N', null) -> 'NN' (after 'N')
 * - generateOrderBetween('a', 'b') -> 'aN' (between 'a' and 'b')
 * - generateOrderBetween(null, 'N') -> 'G' (before 'N')
 */

const BASE_CHARS =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
const BASE = BASE_CHARS.length // 62
const SMALLEST = BASE_CHARS[0] // 'a'
const MIDPOINT = BASE_CHARS[Math.floor(BASE / 2)] // 'N'

/**
 * Generates an order string between two existing order strings.
 *
 * @param before - The order string of the item before (or null/undefined if first)
 * @param after - The order string of the item after (or null/undefined if last)
 * @returns A new order string that sorts between before and after
 */
export function generateOrderBetween(
    before: string | null | undefined,
    after: string | null | undefined
): string {
    // Handle edge cases
    if (!before && !after) {
        return MIDPOINT // Start in middle for flexibility
    }

    if (!before) {
        // Insert before first item
        return decrementOrder(after!)
    }

    if (!after) {
        // Insert after last item
        return incrementOrder(before)
    }

    // Insert between two items
    return midpointOrder(before, after)
}

/**
 * Generates an order string after the given order.
 * Simply appends the midpoint character.
 */
function incrementOrder(order: string): string {
    return order + MIDPOINT
}

/**
 * Generates an order string before the given order.
 * Uses a character before the first character if possible.
 */
function decrementOrder(order: string): string {
    const firstChar = order[0]
    const charIndex = BASE_CHARS.indexOf(firstChar)

    if (charIndex > 0) {
        // Use character at half the distance from start
        const newIndex = Math.floor(charIndex / 2)
        return BASE_CHARS[newIndex] + order.slice(1)
    }

    // Already at smallest, prepend smallest to make it sort before
    return SMALLEST + order
}

/**
 * Generates an order string between two existing orders.
 */
function midpointOrder(before: string, after: string): string {
    // Find first differing position
    let i = 0
    while (i < before.length && i < after.length && before[i] === after[i]) {
        i++
    }

    if (i < before.length && i < after.length) {
        const beforeChar = before[i]
        const afterChar = after[i]
        const beforeIndex = BASE_CHARS.indexOf(beforeChar)
        const afterIndex = BASE_CHARS.indexOf(afterChar)

        if (afterIndex - beforeIndex > 1) {
            // Room between characters - use midpoint
            const midIndex = Math.floor((beforeIndex + afterIndex) / 2)
            return before.slice(0, i) + BASE_CHARS[midIndex]
        }
    }

    // No room between, append midpoint to before string
    return before + MIDPOINT
}

/**
 * Normalizes order values in an array, replacing 'latest' with actual positions.
 * This ensures all items have proper fractional index values.
 *
 * @param items - Array of items with id and order
 * @returns Array with normalized order values
 */
export function normalizeOrders<T extends { id: string; order: string }>(
    items: T[]
): T[] {
    if (items.length === 0) return items

    // Sort by current order (latest goes to end)
    const sorted = [...items].sort((a, b) => {
        if (a.order === 'latest' && b.order !== 'latest') return 1
        if (b.order === 'latest' && a.order !== 'latest') return -1
        if (a.order === 'latest' && b.order === 'latest') return 0
        return a.order.localeCompare(b.order)
    })

    // Track the last assigned order as we iterate
    const result: T[] = []
    let lastOrder: string | null = null

    for (let idx = 0; idx < sorted.length; idx++) {
        const item = sorted[idx]

        if (item.order !== 'latest') {
            result.push(item)
            lastOrder = item.order
        } else {
            // Generate a new order after the last one
            const newOrder = generateOrderBetween(lastOrder, null)
            result.push({ ...item, order: newOrder })
            lastOrder = newOrder
        }
    }

    return result
}

/**
 * Calculates new order values after a drag-and-drop reorder operation.
 *
 * @param items - Array of items with id and order (should be sorted by order)
 * @param activeId - ID of the item being moved
 * @param overId - ID of the item being dropped over
 * @returns Array of {id, order} for items that need updating (usually just 1)
 */
export function calculateNewOrders<T extends { id: string; order: string }>(
    items: T[],
    activeId: string,
    overId: string
): Array<{ id: string; order: string }> {
    const oldIndex = items.findIndex((item) => item.id === activeId)
    const newIndex = items.findIndex((item) => item.id === overId)

    if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) {
        return []
    }

    // Determine the items that will be neighbors after the move
    let beforeItem: T | null = null
    let afterItem: T | null = null

    if (newIndex < oldIndex) {
        // Moving up: new position is before overId
        beforeItem = newIndex > 0 ? items[newIndex - 1] : null
        afterItem = items[newIndex]
    } else {
        // Moving down: new position is after overId
        beforeItem = items[newIndex]
        afterItem = newIndex < items.length - 1 ? items[newIndex + 1] : null
    }

    const newOrder = generateOrderBetween(beforeItem?.order, afterItem?.order)

    return [{ id: activeId, order: newOrder }]
}
