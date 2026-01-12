import { getDbClient } from '@/_server/domains/_context/db.client'
import { mediaTable } from '@db/tables'
import { CurrentServerUser } from '@stackframe/stack'
import { and, eq } from 'drizzle-orm'

export async function deleteMedia(user: CurrentServerUser, mediaId: string) {
    const result = await getDbClient()
        .tx.delete(mediaTable)
        .where(
            and(
                eq(mediaTable.id, mediaId),
                eq(mediaTable.uploaded_by_user_id, user.id)
            )
        )

    return {
        id: mediaId,
        deleted: result.rowsAffected > 0,
    }
}
