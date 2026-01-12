import { getDbClient } from '@/_server/domains/_context/db.client'
import { formsTable } from '@db/tables'
import { IForm } from '@db/types'
import { and, like } from 'drizzle-orm'

export type IFullForm = Awaited<ReturnType<typeof getFullForms>>[number]
export type IFullPage = IFullForm['pages'][number]
export type IFullSection = IFullPage['sections'][number]
export type IFullQuestion = IFullSection['questions'][number]
export type IFullChoice = IFullQuestion['choices'][number]

/**
 * Retrieves full form data including related entities based on provided criteria.
 * @param data Partial form data to filter the forms.
 * @returns Array of full form data with related entities.
 */
export async function getFullForms(data: Partial<IForm>) {
    return await getDbClient().tx.query.formsTable.findMany({
        where: and(
            ...Object.entries(data)
                .filter(([key, value]) => key && value)
                .map(([key, value]) =>
                    like(formsTable[key as keyof IForm], value as string)
                )
        ),
        with: {
            folder: true,
            tagsForms: {
                with: {
                    tag: true,
                },
            },
            sharedForms: true,
            pages: {
                with: {
                    sections: {
                        with: {
                            texts: true,
                            images: true,
                            videos: true,
                            questions: {
                                with: {
                                    choices: {
                                        with: {
                                            multipleChoices: true,
                                        },
                                    },
                                    answers: {
                                        with: {
                                            choice: {
                                                with: {
                                                    multipleChoices: true,
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            responses: true,
        },
    })
}
