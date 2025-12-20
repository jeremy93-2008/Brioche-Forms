import { getDbClient } from '@/_server/domains/_context/form/withFormContext'
import { v7 as uuidv7 } from 'uuid'
import { pagesTable } from '@db/tables'
import { IPage } from '@db/types'

export async function createPage(data: Partial<IPage>) {
    const pageId = uuidv7()

    await getDbClient()
        .tx.insert(pagesTable)
        .values({
            id: pageId,
            title: data.title || '',
            order: data.order || 'latest',
            conditions: data.conditions || '',
            form_id: data.form_id!,
        })

    return { id: pageId }
}
