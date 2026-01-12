import { getDbClient } from '@/_server/domains/_context/db.client'
import { formsTable } from '@db/tables'
import { eq } from 'drizzle-orm'

export async function FormUpdated(form_id: string) {
    const result = await getDbClient()
        .tx.update(formsTable)
        .set({
            updatedAt: new Date().getTime(),
        })
        .where(eq(formsTable.id, form_id))

    if (result.rowsAffected === 0) {
        throw new Error('Form not found')
    }

    return { id: form_id }
}
