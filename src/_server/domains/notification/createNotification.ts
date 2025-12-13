import { CurrentServerUser } from '@stackframe/stack'
import { v7 as uuidv7 } from 'uuid'
import { db } from '../../../../db'
import {
    notificationsTable,
    sharedNotificationsTable,
} from '../../../../db/tables'
import { INotification } from '../../../../db/types'

export interface INotificationsWithUsers extends INotification {
    users?: string[]
}

export async function createNotification(
    user: CurrentServerUser,
    data: Partial<INotificationsWithUsers>
) {
    const notificationId = uuidv7()

    await db.transaction(async (tx) => {
        await tx.insert(notificationsTable).values({
            id: notificationId,
            user_id: user.id,
            content: data.content || '',
            action_type: data.action_type || '',
            is_read: data.is_read || 0,
            created_at: data.created_at || Date.now(),
            form_id: data.form_id || null,
            folder_id: data.folder_id || null,
        })

        if (data.users) {
            for (const userId of data.users) {
                await tx.insert(sharedNotificationsTable).values({
                    id: uuidv7(),
                    notification_id: notificationId,
                    shared_with_user_id: userId,
                })
            }
        }
    })

    return { id: notificationId }
}
