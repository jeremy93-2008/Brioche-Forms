import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/_components/ui/popover'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/_components/ui/tooltip'
import GetNotifications from '@/_server/queries/notification/get'
import { Bell } from 'lucide-react'

export async function NotificationsComponent() {
    const result = await GetNotifications({})

    return (
        <section className="h-5">
            <Tooltip>
                <Popover>
                    <PopoverTrigger asChild>
                        <div className="flex flex-row items-center gap-6">
                            <TooltipTrigger asChild>
                                <button className="h-5">
                                    <Bell className="w-5 h-5 cursor-pointer" />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent>Ver notificaciones</TooltipContent>
                        </div>
                    </PopoverTrigger>
                    <PopoverContent className="mt-1 max-w-80">
                        {result.status === 'success' &&
                        result.data.length > 0 ? (
                            <ul className="max-h-96 overflow-y-auto">
                                {result.data.map((notification) => (
                                    <li
                                        key={notification?.id}
                                        className="border-b last:border-0 p-2"
                                    >
                                        <p className="text-sm">
                                            {notification?.content}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {new Date(
                                                notification?.created_at as number
                                            ).toLocaleString()}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="p-2">No hay notificaciones.</p>
                        )}
                    </PopoverContent>
                </Popover>
            </Tooltip>
        </section>
    )
}
