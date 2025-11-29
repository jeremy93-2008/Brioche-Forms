'use server'

import {
    defineServerFunction,
    IMiddlewaresCtx,
} from '@/_server/_internals/defineServerFunction'
import { requireAuth } from '@/_server/_middlewares/requireAuth'
import { requireValidation } from '@/_server/_middlewares/requireValidation'
import type { IReturnAction } from '@/_server/actions/types'
import { createInsertSchema } from 'drizzle-zod'
import { v7 as uuidv7 } from 'uuid'
import { db } from '../../../../db'
import {
    INotification,
    notificationsTable,
    sharedNotificationsTable,
} from '../../../../db/schema'

const schema = createInsertSchema(notificationsTable, {
    id: (schema) => schema.nullable(),
    folder_id: (schema) => schema.nullable(),
    content: (schema) => schema.nullable(),
    form_id: (schema) => schema.nullable(),
    is_read: (schema) => schema.nullable(),
    created_at: (schema) => schema.nullable(),
    action_type: (schema) => schema.nullable(),
    user_id: (schema) => schema.nullable(),
}).partial()

schema.extend({
    users: schema.array().optional(),
})

interface INotificationsWithUsers extends INotification {
    users?: string[]
}

async function create(
    _data: Partial<INotificationsWithUsers>,
    ctx: IMiddlewaresCtx<INotificationsWithUsers>
): Promise<IReturnAction<Partial<INotificationsWithUsers>>> {
    const user = ctx.user
    const validatedFields = ctx.validatedFields

    const notificationId = uuidv7()

    try {
        await db.transaction(async (tx) => {
            await tx.insert(notificationsTable).values({
                id: notificationId,
                user_id: user.id,
                content: validatedFields.data?.content || '',
                action_type: validatedFields.data?.action_type || '',
                is_read: validatedFields.data?.is_read || 0,
                created_at: validatedFields.data?.created_at || Date.now(),
                form_id: validatedFields.data?.form_id || null,
                folder_id: validatedFields.data?.folder_id || null,
            })

            if (validatedFields.data?.users) {
                for (const userId of validatedFields.data.users) {
                    await tx.insert(sharedNotificationsTable).values({
                        id: uuidv7(),
                        notification_id: notificationId,
                        shared_with_user_id: userId,
                    })
                }
            }
        })
    } catch (error) {
        return {
            status: 'error',
            error: {
                message: `Failed to create notification${error instanceof Error ? `: ${error.message}` : ''}`,
            },
        }
    }

    return {
        status: 'success',
        data: { id: notificationId },
    }
}

export default defineServerFunction<
    Partial<INotificationsWithUsers>,
    IMiddlewaresCtx<INotificationsWithUsers>
>(create, [requireAuth(), requireValidation(schema)])
