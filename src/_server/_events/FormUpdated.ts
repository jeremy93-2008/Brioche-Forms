import { eq } from 'drizzle-orm'
import { db } from '../../../db'
import { formsTable } from '../../../db/tables'

export async function FormUpdated(form_id: string) {
    const result = await db
        .update(formsTable)
        .set({
            updatedAt: new Date().getTime(),
        })
        .where(eq(formsTable.id, form_id))

    if (result.rowsAffected === 0) {
        throw new Error('Form not found')
    }

    return { id: form_id }
}
