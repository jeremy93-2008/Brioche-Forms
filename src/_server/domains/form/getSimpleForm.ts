import { getDbClient } from '@/_server/domains/_context/db.client'
import { formsTable } from '@db/tables'
import { IForm } from '@db/types'
import { and, like } from 'drizzle-orm'

/**
 * Retrieves simple form data based on the provided criteria.
 * @param data Partial form data to filter the forms.
 * @returns Array of forms matching the provided criteria.
 */
export async function getSimpleForms(data: Partial<IForm>) {
    return getDbClient().tx.query.formsTable.findMany({
        where: and(
            ...Object.entries(data)
                .filter(([key, value]) => key && value)
                .map(([key, value]) =>
                    like(formsTable[key as keyof IForm], value as string)
                )
        ),
    })
}
