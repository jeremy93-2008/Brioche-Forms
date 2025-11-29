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
import { Bell } from 'lucide-react'

export function NotificationsComponent() {
    return (
        <section className="h-5">
            <Popover>
                <PopoverTrigger className="h-5">
                    <Tooltip>
                        <TooltipTrigger>
                            <Bell className="w-5 h-5 cursor-pointer" />
                        </TooltipTrigger>
                        <TooltipContent>Ver notificaciones</TooltipContent>
                    </Tooltip>
                </PopoverTrigger>
                <PopoverContent className="mt-1 max-w-80">
                    Hola desde notificaciones
                </PopoverContent>
            </Popover>
        </section>
    )
}
