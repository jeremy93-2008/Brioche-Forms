'use server'

import {
    defineServerFunction,
    IMiddlewaresCtx,
} from '@/_server/_internals/defineServerFunction'
import { requireAuth } from '@/_server/_middlewares/requireAuth'
import { requireValidation } from '@/_server/_middlewares/requireValidation'
import type { IReturnAction } from '@/_server/actions/types'
import { and, eq, ilike } from 'drizzle-orm'
import { createSelectSchema } from 'drizzle-zod'
import { db } from '../../../../db'
import { formsTable, IForm } from '../../../../db/schema'

const schema = createSelectSchema(formsTable, {
    id: (schema) => schema.nullable(),
    author_id: (schema) => schema.nullable(),
    backgroundColor: (schema) => schema.nullable(),
    backgroundImage: (schema) => schema.nullable(),
    canModifyResponses: (schema) => schema.nullable(),
    createdAt: (schema) => schema.nullable(),
    updatedAt: (schema) => schema.nullable(),
    description: (schema) => schema.nullable(),
    folder_id: (schema) => schema.nullable(),
    headerImage: (schema) => schema.nullable(),
    isDraft: (schema) => schema.nullable(),
    isPublished: (schema) => schema.nullable(),
    responseLimit: (schema) => schema.nullable(),
    responseLimitDate: (schema) => schema.nullable(),
    title: (schema) => schema.nullable(),
}).partial()

async function get(
    _data: Partial<IForm>,
    ctx: IMiddlewaresCtx<IForm>
): Promise<IReturnAction<Awaited<ReturnType<typeof getFullForms>>>> {
    const user = ctx.user
    const validatedFields = ctx.validatedFields

    const result = await getFullForms({ user, validatedFields })

    return { status: 'success', data: result }
}

async function getFullForms(props: IMiddlewaresCtx<IForm>) {
    const { user, validatedFields } = props

    return await db.query.formsTable.findMany({
        where: and(
            ...Object.entries(validatedFields.data ?? {})
                .filter(([key, value]) => key && value)
                .map(([key, value]) =>
                    ilike(formsTable[key as keyof IForm], value as string)
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
            responses: true,
        },
    })
}

export default defineServerFunction<
    Partial<IForm>,
    Awaited<ReturnType<typeof getFullForms>>,
    IMiddlewaresCtx<IForm>
>(get, [requireAuth(), requireValidation(schema)])
