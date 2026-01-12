import { getDbClient } from '@/_server/domains/_context/db.client'
import { mediaTable } from '@db/tables'
import { IMedia } from '@db/types'
import { eq, or } from 'drizzle-orm'

export async function editMedia(
    media: Partial<IMedia> &
        ({ id: string; url?: string } | { id?: string; url: string })
): Promise<{ id?: string; url?: string }> {
    const whereStatement = []

    if (media.id) {
        whereStatement.push(eq(mediaTable.id, media.id!))
    }

    if (media.url) {
        whereStatement.push(eq(mediaTable.url, media.url!))
    }

    if (whereStatement.length === 0) {
        throw new Error('Either id or url must be provided to edit media.')
    }

    const result = await getDbClient()
        .tx.update(mediaTable)
        .set({
            ...media,
        })
        .where(or(...whereStatement))

    if (result.rowsAffected === 0)
        throw new Error(`Media ${media.id} not created. Due to unknown error.`)

    return {
        id: media.id,
        url: media.url,
    }
}
