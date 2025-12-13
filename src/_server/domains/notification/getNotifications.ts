import { CurrentServerUser } from '@stackframe/stack'
import { and, eq } from 'drizzle-orm'
import { db } from '../../../../db'
import { notificationsTable } from '../../../../db/tables'
import { INotification } from '../../../../db/types'

export async function getNotifications(
    user: CurrentServerUser,
    data: Partial<INotification>
) {
    if (data?.id) {
        return db
            .select()
            .from(notificationsTable)
            .where(
                and(
                    eq(notificationsTable.id, data.id),
                    eq(notificationsTable.user_id, user.id)
                )
            )
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

    return [...ownNotifications, ...mappedSharedNotifications]
        .sort((a, b) => a.created_at - b.created_at)
        .filter((notification) => {
            for (const [key, value] of Object.entries(data)) {
                if (
                    notification[key as keyof INotification]
                        ?.toString()
                        .includes(value!.toString())
                ) {
                    return false
                }
            }
            return true
        })
}
