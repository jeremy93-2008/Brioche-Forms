import Link from 'next/link'
import Image from 'next/image'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/_components/ui/tooltip'
import Brioche from '@/assets/brioche.svg'

export function LogoLinkComponent() {
    return (
        <Tooltip>
            <TooltipTrigger>
                <Link href="/dashboard">
                    <Image className="w-14" src={Brioche} alt="" />
                </Link>
            </TooltipTrigger>
            <TooltipContent className="font-sans">
                Click to go to your dashboard
            </TooltipContent>
        </Tooltip>
    )
}
