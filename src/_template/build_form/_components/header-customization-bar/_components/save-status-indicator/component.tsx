'use client'
import { Button } from '@/_components/ui/button'
import {
    AutoSaveContext,
    ISaveStatus,
} from '@/_provider/auto-save/auto-save-provider'
import { AlertCircleIcon, CheckIcon, LoaderIcon } from 'lucide-react'
import { use } from 'react'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/_components/ui/tooltip'
import { renderStringTemplate } from '@/_utils/renderStringTemplate'
import { formatDistanceToNow } from 'date-fns'
import { es as esLocaleDateFns } from 'date-fns/locale/es'

const statusConfig: Record<
    ISaveStatus,
    {
        icon: React.ReactNode
        text: string
        tooltip: (view: Record<string, string>) => string
    } | null
> = {
    idle: null,
    saving: {
        icon: <LoaderIcon className="w-4 h-4 animate-spin" />,
        text: 'Guardando...',
        tooltip: (view: Record<string, string>) =>
            renderStringTemplate(
                'Los cambios se están guardando. Por favor, espera un momento.',
                view
            ),
    },
    saved: {
        icon: <CheckIcon className="w-4 h-4" />,
        text: 'Guardado',
        tooltip: (view: Record<string, string>) =>
            renderStringTemplate(
                'Todos los cambios han sido guardados. Última modificación hace {time}.',
                view
            ),
    },
    error: {
        icon: <AlertCircleIcon className="w-4 h-4 text-destructive" />,
        text: 'Error al guardar',
        tooltip: (view: Record<string, string>) =>
            renderStringTemplate(
                'Hubo un error al guardar los cambios. Por favor, inténtalo de nuevo.',
                view
            ),
    },
}

export function SaveStatusIndicatorComponent() {
    const { saveStatus, latestSaveTime, retrySave } = use(AutoSaveContext)

    const config = statusConfig[saveStatus]
    if (!config) return null

    return (
        <section className="flex items-center text-xs text-muted-foreground">
            <Tooltip>
                <TooltipTrigger className="flex gap-1">
                    {config.icon}
                    <span>{config.text}</span>
                    {saveStatus === 'error' && (
                        <Button
                            variant="link"
                            size="sm"
                            className="text-xs h-auto p-0 ml-1"
                            onClick={retrySave}
                        >
                            Reintentar
                        </Button>
                    )}
                </TooltipTrigger>
                <TooltipContent>
                    {config.tooltip({
                        time: latestSaveTime()
                            ? formatDistanceToNow(
                                  new Date(latestSaveTime() ?? 0),
                                  {
                                      locale: esLocaleDateFns,
                                      includeSeconds: true,
                                  }
                              )
                            : 'desconocido',
                    })}
                </TooltipContent>
            </Tooltip>
        </section>
    )
}
