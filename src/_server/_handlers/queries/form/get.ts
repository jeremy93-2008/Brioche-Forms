'use server'

import {
    defineServerRequest,
    IMiddlewaresCtx,
} from '@/_server/__internals/defineServerRequest'
import type { IReturnAction } from '@/_server/_handlers/actions/types'
import { requireAuth } from '@/_server/_middlewares/requireAuth'
import { requireValidation } from '@/_server/_middlewares/requireValidation'
import { and, eq, like } from 'drizzle-orm'
import { createSelectSchema } from 'drizzle-zod'
import { db } from '../../../../../db'
import { formsTable, IForm } from '../../../../../db/schema'

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

async function getFullForms(
    _data: Partial<IForm>,
    ctx: IMiddlewaresCtx<IForm>
): Promise<IReturnAction<IFullForm[]>> {
    const user = ctx.user
    const validatedFields = ctx.validatedFields

    const result = await getFullFormsCore({ user, validatedFields })

    return { status: 'success', data: result }
}

async function getFullFormsCore(props: IMiddlewaresCtx<IForm>) {
    const { user, validatedFields } = props

    return await db.query.formsTable.findMany({
        where: and(
            ...Object.entries(validatedFields.data ?? {})
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

export type IFullForm = Awaited<ReturnType<typeof getFullFormsCore>>[number]

export default defineServerRequest<
    Partial<IForm>,
    IFullForm[],
    IMiddlewaresCtx<IForm>
>(getFullForms, [requireAuth(), requireValidation(schema)])
