import { NotificationsClientComponent } from '@/_components/shared/notifications/component.client'
import GetNotifications from '@/_server/queries/notification/get'

export async function NotificationsComponent() {
    const result = await GetNotifications({})

    return <NotificationsClientComponent result={result} />
}
