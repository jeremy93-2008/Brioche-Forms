import { CurrentServerUser } from '@stackframe/stack'
import { and, eq, like } from 'drizzle-orm'
import { db } from '../../../../db'
import { formsTable } from '../../../../db/tables'
import { IForm } from '../../../../db/types'

export type IFullForm = Awaited<ReturnType<typeof getFullForms>>[number]

export async function getFullForms(
    user: CurrentServerUser,
    data: Partial<IForm>
) {
    return await db.query.formsTable.findMany({
        where: and(
            ...Object.entries(data)
                .filter(([key, value]) => key && value)
                .map(([key, value]) =>
                    like(formsTable[key as keyof IForm], value as string)
                ),
            eq(formsTable.author_id, user.id)
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
