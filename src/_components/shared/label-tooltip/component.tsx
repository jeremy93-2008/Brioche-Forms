import { Label } from '@/_components/ui/label'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/_components/ui/tooltip'
import { InfoCircledIcon } from '@radix-ui/react-icons'
import { type ReactNode } from 'react'

interface ILabelTooltipProps {
    labelText: string
    tooltipContent: ReactNode
    className?: string
}

/**
 * Label with an info tooltip icon.
 * @param props - ILabelTooltipProps
 */
export function LabelTooltipComponent(props: ILabelTooltipProps) {
    const { labelText, className, tooltipContent } = props
    return (
        <Label className={`flex flex-16 items-center ${className || ''}`}>
            {labelText}
            <Tooltip>
                <TooltipTrigger asChild>
                    <InfoCircledIcon className="ml-2" />
                </TooltipTrigger>
                <TooltipContent>{tooltipContent}</TooltipContent>
            </Tooltip>
        </Label>
    )
}
