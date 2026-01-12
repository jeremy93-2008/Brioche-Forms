import { getDbClient } from '@/_server/domains/_context/db.client'
import { mediaTable } from '@db/tables'
import { IMedia } from '@db/types'
import { CurrentServerUser } from '@stackframe/stack'
import { v7 as uuidv7 } from 'uuid'

export async function createMedia(
    user: CurrentServerUser,
    media: Partial<IMedia>
) {
    const media_id = uuidv7()
    const result = await getDbClient()
        .tx.insert(mediaTable)
        .values({
            id: media_id,
            url: media.url ?? '',
            type: media.type ?? 'image',
            used_in_form_id: media.used_in_form_id ?? null,
            uploaded_at: new Date().getTime(),
            uploaded_by_user_id: user.id,
        })

    if (result.rowsAffected === 0)
        throw new Error(`Media ${media_id} not created. Due to unknown error.`)

    return {
        id: media_id,
    }
}
