import { CurrentServerUser } from '@stackframe/stack'
import { and, eq } from 'drizzle-orm'
import { db } from '@db/index'
import { formsTable } from '@db/tables'
import { IForm } from '@db/types'

export async function editForm(user: CurrentServerUser, data: Partial<IForm>) {
    const result = await db
        .update(formsTable)
        .set({ ...data, updatedAt: new Date().getTime() })
        .where(
            and(eq(formsTable.id, data.id!), eq(formsTable.author_id, user.id))
        )

    if (result.rowsAffected === 0) {
        throw Error('Failed to create form')
    }

    return result.rows[0]
}
