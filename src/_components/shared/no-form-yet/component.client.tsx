'use client'
import { Button } from '@/_components/ui/button'
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/_components/ui/empty'
import { useServerActionCreateForm } from '@/_hooks/useServerActionCreateForm/useServerActionCreateForm'
import { Table } from 'lucide-react'

export function NoFormYetComponent() {
    const { isPending, handleAction } = useServerActionCreateForm()

    return (
        <Empty>
            <EmptyHeader>
                <EmptyMedia>
                    <Table className="text-secondary w-8 h-8" />
                </EmptyMedia>
                <EmptyTitle className="flex gap-2 items-center text-secondary">
                    Aún no hay formularios creados
                </EmptyTitle>
                <EmptyDescription className="flex flex-col text-white">
                    <span>
                        Para crear uno, dale clic al botón que hay debajo.
                    </span>
                </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
                <div className="flex gap-2">
                    <Button
                        onClick={handleAction({})}
                        type="submit"
                        variant="secondary"
                        isLoading={isPending}
                    >
                        Crear Formulario
                    </Button>
                </div>
            </EmptyContent>
        </Empty>
    )
}
