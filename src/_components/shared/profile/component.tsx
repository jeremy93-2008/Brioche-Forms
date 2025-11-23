'use client'
import { UserButton, useUser } from '@stackframe/stack'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/_components/ui/tooltip'

interface IProfileComponentProps {
    noWelcome?: boolean
}

export function ProfileComponent(props: IProfileComponentProps) {
    const { noWelcome } = props
    const user = useUser()

    return (
        <div className="flex flex-row flex-wrap items-center gap-6">
            {!noWelcome && <span>Hi, {user?.displayName?.split(' ')[0]}</span>}
            <Tooltip>
                <TooltipTrigger className="h-[34px]">
                    <UserButton />
                </TooltipTrigger>
                <TooltipContent>{`Logged in as ${user?.displayName}`}</TooltipContent>
            </Tooltip>
        </div>
    )
}
