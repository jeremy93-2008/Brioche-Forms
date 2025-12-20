import { getDbClient } from '@/_server/domains/_context/form/withFormContext'
import { v7 as uuidv7 } from 'uuid'
import { sectionsTable } from '../../../../db/tables'
import { ISection } from '../../../../db/types'

export async function createSection(data: Partial<ISection>) {
    const sectionId = uuidv7()

    await getDbClient()
        .tx.insert(sectionsTable)
        .values({
            id: sectionId,
            title: data.title || '',
            order: data.order || 'latest',
            conditions: data.conditions || '',
            page_id: data.page_id!,
            form_id: data.form_id!,
        })

    return { id: sectionId }
}
