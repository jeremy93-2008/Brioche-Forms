import { IMediaWhere } from '@/_server/_handlers/queries/media/get'
import { getDbClient } from '@/_server/domains/_context/form/withFormContext'
import { IFieldsWhere } from '@/_server/domains/types'
import { mediaTable } from '@db/tables'
import { CurrentServerUser } from '@stackframe/stack'
import { and, eq } from 'drizzle-orm'

export async function getMedias(
    user: CurrentServerUser,
    fields?: IFieldsWhere<IMediaWhere>
) {
    const whereStatement = [eq(mediaTable.uploaded_by_user_id, user.id)]

    Object.entries(fields ?? {}).forEach(([key, val]) => {
        if (!val.value) return
        whereStatement.push(
            val.comparison(
                mediaTable[key as keyof typeof mediaTable],
                val.value
            )
        )
    })

    return getDbClient()
        .tx.select()
        .from(mediaTable)
        .where(and(...whereStatement))
}
