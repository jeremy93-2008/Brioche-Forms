import { getDbClient } from '@/_server/domains/_context/form/withFormContext'
import { mediaTable } from '@db/tables'
import { CurrentServerUser } from '@stackframe/stack'
import { eq } from 'drizzle-orm'

export async function getMedia(user: CurrentServerUser) {
    return getDbClient()
        .tx.select()
        .from(mediaTable)
        .where(eq(mediaTable.uploaded_by_user_id, user.id))
}
