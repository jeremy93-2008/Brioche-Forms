import Brioche from '@/_assets/brioche.svg'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/_components/ui/tooltip'
import Image from 'next/image'
import Link from 'next/link'

export function LogoLinkComponent() {
    return (
        <Tooltip>
            <TooltipTrigger>
                <Link href="/dashboard">
                    <Image className="w-14" src={Brioche} alt="" />
                </Link>
            </TooltipTrigger>
            <TooltipContent className="font-sans">
                Haz clic aquí para ir al inicio
            </TooltipContent>
        </Tooltip>
    )
}
