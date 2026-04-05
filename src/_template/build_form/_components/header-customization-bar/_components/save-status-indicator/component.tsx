'use client'
import { Button } from '@/_components/ui/button'
import { AutoSaveContext, SaveStatus } from '@/_provider/auto-save/auto-save-provider'
import { AlertCircleIcon, CheckIcon, LoaderIcon } from 'lucide-react'
import { use } from 'react'

const statusConfig: Record<
    SaveStatus,
    { icon: React.ReactNode; text: string } | null
> = {
    idle: null,
    saving: {
        icon: <LoaderIcon className="w-4 h-4 animate-spin" />,
        text: 'Guardando...',
    },
    saved: {
        icon: <CheckIcon className="w-4 h-4" />,
        text: 'Guardado',
    },
    error: {
        icon: <AlertCircleIcon className="w-4 h-4 text-destructive" />,
        text: 'Error al guardar',
    },
}

export function SaveStatusIndicatorComponent() {
    const { saveStatus, retrySave } = use(AutoSaveContext)

    const config = statusConfig[saveStatus]
    if (!config) return null

    return (
        <section className="flex items-center gap-1 text-xs text-muted-foreground">
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
        </section>
    )
}
