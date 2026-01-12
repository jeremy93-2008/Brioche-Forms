import { getDbClient } from '@/_server/domains/_context/db.client'
import { pagesTable } from '@db/tables'
import { and, eq } from 'drizzle-orm'

interface IPageOrderUpdate {
    id: string
    order: string
}

/**
 * Updates the order of multiple pages in a single transaction.
 * Uses fractional indexing - only the moved items need updating.
 *
 * @param formId - The form ID to scope the updates
 * @param updates - Array of {id, order} for pages to update
 * @returns Number of pages updated
 */
export async function editPageOrders(
    formId: string,
    updates: IPageOrderUpdate[]
): Promise<{ updated: number }> {
    let updatedCount = 0

    for (const update of updates) {
        const result = await getDbClient()
            .tx.update(pagesTable)
            .set({ order: update.order })
            .where(
                and(
                    eq(pagesTable.id, update.id),
                    eq(pagesTable.form_id, formId)
                )
            )

        if (result.rowsAffected > 0) {
            updatedCount++
        }
    }

    return { updated: updatedCount }
}
