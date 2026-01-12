import { getDbClient } from '@/_server/domains/_context/db.client'
import { sectionsTable } from '@db/tables'
import { and, eq } from 'drizzle-orm'

interface ISectionOrderUpdate {
    id: string
    order: string
    page_id?: string // Optional: for cross-page moves
}

/**
 * Updates the order (and optionally page_id) of multiple sections in a single transaction.
 * Uses fractional indexing - only the moved items need updating.
 *
 * @param formId - The form ID to scope the updates
 * @param updates - Array of {id, order, page_id?} for sections to update
 * @returns Number of sections updated
 */
export async function editSectionOrders(
    formId: string,
    updates: ISectionOrderUpdate[]
): Promise<{ updated: number }> {
    let updatedCount = 0

    for (const update of updates) {
        const setData: { order: string; page_id?: string } = {
            order: update.order,
        }

        // Include page_id if this is a cross-page move
        if (update.page_id) {
            setData.page_id = update.page_id
        }

        const result = await getDbClient()
            .tx.update(sectionsTable)
            .set(setData)
            .where(
                and(
                    eq(sectionsTable.id, update.id),
                    eq(sectionsTable.form_id, formId)
                )
            )

        if (result.rowsAffected > 0) {
            updatedCount++
        }
    }

    return { updated: updatedCount }
}
