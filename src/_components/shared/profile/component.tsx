import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/_components/ui/tooltip'
import { stackServerApp } from '@/_stack/server'
import { UserButton } from '@stackframe/stack'

interface IProfileComponentProps {
    noWelcome?: boolean
}

export async function ProfileComponent(props: IProfileComponentProps) {
    const { noWelcome } = props
    const user = await stackServerApp.getUser()

    return (
        <div className="flex flex-row flex-wrap items-center gap-6">
            {!noWelcome && <span>Hi, {user?.displayName?.split(' ')[0]}</span>}
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className="h-[34px]">
                        <UserButton />
                    </div>
                </TooltipTrigger>
                <TooltipContent>{`Sesión iniciada como ${user?.displayName}`}</TooltipContent>
            </Tooltip>
        </div>
    )
}
