import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/_components/ui/empty'
import { Table } from 'lucide-react'
import { Button } from '@/_components/ui/button'

export function NoFormYetComponent() {
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
                                Para crear uno, dale clic al botón que hay
                                debajo.
                            </span>
                </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
                <div className="flex gap-2">
                    <Button variant="secondary">
                        Crear Formulario
                    </Button>
                </div>
            </EmptyContent>
        </Empty>
    )
}