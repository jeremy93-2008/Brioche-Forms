import { IVideoWithPageId } from '@/_server/_handlers/actions/video/create'
import { v7 as uuidv7 } from 'uuid'
import { db } from '../../../../../db'
import { videosTable } from '../../../../../db/tables'

export async function createVideoSection(data: IVideoWithPageId) {
    const videoId = uuidv7()

    const sectionId = data.section_id

    const result = await db.insert(videosTable).values({
        id: videoId,
        order: data?.order ?? '0',
        caption: data?.caption ?? '',
        url: data.url ?? '',
        section_id: sectionId!,
        form_id: data?.form_id,
    })

    if (result.rowsAffected === 0) {
        throw new Error(
            `Video section ${data.id} not created. Due to unknown error.`
        )
    }

    return { id: videoId }
}
