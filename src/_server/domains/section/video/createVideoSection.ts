import { IVideoWithPageId } from '@/_server/_handlers/actions/video/create'
import { getDbClient } from '@/_server/domains/_context/form/withFormContext'
import { v7 as uuidv7 } from 'uuid'
import { videosTable } from '@db/tables'

export async function createVideoSection(data: IVideoWithPageId) {
    const videoId = uuidv7()

    const sectionId = data.section_id

    const result = await getDbClient()
        .tx.insert(videosTable)
        .values({
            id: videoId,
            order: data?.order ?? 'latest',
            caption: data?.caption ?? '',
            url: data.url ?? '',
            section_id: sectionId!,
            form_id: data.form_id!,
        })

    if (result.rowsAffected === 0) {
        throw new Error(
            `Video section ${data.id} not created. Due to unknown error.`
        )
    }

    return { id: videoId }
}
