import { IImageWithPageId } from '@/_server/_handlers/actions/image/create'
import { getDbClient } from '@/_server/domains/_context/form/withFormContext'
import { v7 as uuidv7 } from 'uuid'
import { imagesTable } from '@db/tables'

export async function createImageSection(data: IImageWithPageId) {
    const imageId = uuidv7()

    const sectionId = data.section_id

    const result = await getDbClient()
        .tx.insert(imagesTable)
        .values({
            id: imageId,
            order: data?.order ?? 'latest',
            caption: data?.caption ?? '',
            url: data.url ?? '',
            section_id: sectionId!,
            form_id: data.form_id!,
        })

    if (result.rowsAffected === 0) {
        throw new Error(
            `Image section ${data.id} not created. Due to unknown error.`
        )
    }

    return { id: imageId }
}
