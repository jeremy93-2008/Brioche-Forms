'use server'

import {
    defineServerRequest,
    IMiddlewaresCtx,
} from '@/_server/__internals/defineServerRequest'
import type { IReturnAction } from '@/_server/_handlers/actions/types'
import { requireAuth } from '@/_server/_middlewares/requireAuth'
import { requireValidation } from '@/_server/_middlewares/requireValidation'
import { getNotifications } from '@/_server/domains/notification/getNotifications'
import { createSelectSchema } from 'drizzle-zod'
import { INotification, notificationsTable } from '../../../../../db/schema'

const schema = createSelectSchema(notificationsTable, {
    id: (schema) => schema.nullable(),
    folder_id: (schema) => schema.nullable(),
    content: (schema) => schema.nullable(),
    form_id: (schema) => schema.nullable(),
    is_read: (schema) => schema.nullable(),
    created_at: (schema) => schema.nullable(),
    action_type: (schema) => schema.nullable(),
    user_id: (schema) => schema.nullable(),
}).partial()

async function getNotificationsHandler(
    _data: Partial<INotification>,
    ctx: IMiddlewaresCtx<INotification>
): Promise<IReturnAction<Partial<INotification[]>>> {
    const user = ctx.user
    const data = ctx.validatedFields.data as Partial<INotification>

    const result = await getNotifications(user, data)

    return { status: 'success', data: result }
}

export default defineServerRequest<
    Partial<INotification>,
    INotification[],
    IMiddlewaresCtx<INotification>
>(getNotificationsHandler, [requireAuth(), requireValidation(schema)])
