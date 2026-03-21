'use client'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/_components/ui/tooltip'
import { SingleFormSelectedContext } from '@/_provider/forms/single-form-selected'
import { formatDate } from '@/_utils/formatDate'
import { BadgeInfo } from 'lucide-react'
import { use } from 'react'

export function FormInfoRightComponent() {
    const { data } = use(SingleFormSelectedContext)!

    return (
        <section className="flex flex-col items-end font-sans">
            <Tooltip>
                <TooltipTrigger>
                    <div className="flex items-center gap-2">
                        <BadgeInfo className="w-5! h-5!" />
                        <span className="text-sm">{data.author_name}</span>
                    </div>
                </TooltipTrigger>
                <TooltipContent>
                    <span className="text-sm">
                        Creado por <strong>{data.author_name}</strong>, el{' '}
                        <strong>{formatDate(data.createdAt)}</strong>
                    </span>
                    <br />
                    <span className="text-sm">
                        Última modificación:{' '}
                        <strong>{formatDate(data.updatedAt)}</strong>
                    </span>
                </TooltipContent>
            </Tooltip>
        </section>
    )
}
