import { getDbClient } from '@/_server/domains/_context/db.client'
import { sectionsTable } from '@db/tables'
import { ISection } from '@db/types'
import { v7 as uuidv7 } from 'uuid'

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
