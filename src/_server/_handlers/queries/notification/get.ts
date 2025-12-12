'use server'

import {
    defineServerRequest,
    IMiddlewaresCtx,
} from '@/_server/__internals/defineServerRequest'
import { requireAuth } from '@/_server/_middlewares/requireAuth'
import { requireValidation } from '@/_server/_middlewares/requireValidation'
import type { IReturnAction } from '@/_server/_handlers/actions/types'
import { and, eq } from 'drizzle-orm'
import { createSelectSchema } from 'drizzle-zod'
import { db } from '../../../../../db'
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

async function get(
    _data: Partial<INotification>,
    ctx: IMiddlewaresCtx<INotification>
): Promise<IReturnAction<Partial<INotification[]>>> {
    const user = ctx.user
    const validatedFields = ctx.validatedFields

    if (validatedFields?.data?.id) {
        const result = await db
            .select()
            .from(notificationsTable)
            .where(
                and(
                    eq(notificationsTable.id, validatedFields.data.id),
                    eq(notificationsTable.user_id, user.id)
                )
            )

        return { status: 'success', data: result }
    }

    const ownNotifications = await db.query.notificationsTable.findMany({
        where: (notifications, { eq }) => eq(notifications.user_id, user.id),
        orderBy: (notifications, { desc }) => [desc(notifications.created_at)],
    })

    const sharedNotifications =
        await db.query.sharedNotificationsTable.findMany({
            where: (shared, { eq }) => eq(shared.shared_with_user_id, user.id),
            with: {
                notification: true,
            },
            orderBy: (shared, { desc }) => [desc(shared.notification_id)],
        })

    const mappedSharedNotifications = sharedNotifications.map(
        (shared) => shared.notification
    )

    const result = [...ownNotifications, ...mappedSharedNotifications]
        .sort((a, b) => a.created_at - b.created_at)
        .filter((notification) => {
            for (const [key, value] of Object.entries(validatedFields)) {
                if (
                    notification[key as keyof INotification]
                        ?.toString()
                        .includes(value.toString())
                ) {
                    return false
                }
            }
            return true
        })

    return { status: 'success', data: result }
}

export default defineServerRequest<
    Partial<INotification>,
    INotification[],
    IMiddlewaresCtx<INotification>
>(get, [requireAuth(), requireValidation(schema)])
