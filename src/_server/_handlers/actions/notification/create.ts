'use server'

import {
    defineServerRequest,
    IMiddlewaresCtx,
} from '@/_server/__internals/defineServerRequest'
import type { IReturnAction } from '@/_server/_handlers/actions/types'
import { requireAuth } from '@/_server/_middlewares/requireAuth'
import { requireValidation } from '@/_server/_middlewares/requireValidation'
import {
    createNotification,
    INotificationsWithUsers,
} from '@/_server/domains/notification/createNotification'
import { createInsertSchema } from 'drizzle-zod'
import { notificationsTable } from '@db/tables'

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

async function createNotificationHandler(
    _data: Partial<INotificationsWithUsers>,
    ctx: IMiddlewaresCtx<INotificationsWithUsers>
): Promise<IReturnAction<Partial<INotificationsWithUsers>>> {
    const user = ctx.user
    const validatedFields = ctx.validatedFields

    const result = await createNotification(user, validatedFields.data!)

    return {
        status: 'success',
        data: result,
    }
}

export default defineServerRequest<
    Partial<INotificationsWithUsers>,
    IMiddlewaresCtx<INotificationsWithUsers>
>(createNotificationHandler, [requireAuth(), requireValidation(schema)])
