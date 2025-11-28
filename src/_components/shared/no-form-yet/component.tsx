'use client'
import { useRouter } from 'next/navigation'
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/_components/ui/empty'
import { LoaderCircle, Table } from 'lucide-react'
import { Button } from '@/_components/ui/button'
import createFormAction from '@/_server/_actions/form/create'
import { initialServerState, useServerAction } from '@/_hooks/useServerAction'
import { IForm } from '../../../../db/schema'
import { IReturnState } from '@/_hooks/useServerAction/types'

export function NoFormYetComponent() {
    const router = useRouter()

    const afterCallback = (state: IReturnState<Partial<IForm>>) => {
        if (state.status === 'success') {
            router.push('/form/' + state.data.id)
        } else if (state.status === 'error') {
            alert('Error al crear el formulario: ' + state.error.message)
        }
    }

    const { isPending, handleAction } = useServerAction<
        Partial<IForm>,
        Partial<IForm>
    >(createFormAction, initialServerState, afterCallback)

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
                        disabled={isPending}
                    >
                        {isPending && <LoaderCircle className="animate-spin" />}
                        Crear Formulario
                    </Button>
                </div>
            </EmptyContent>
        </Empty>
    )
}
