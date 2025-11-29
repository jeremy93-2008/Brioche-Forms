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
import {
    type IReturnState,
    useServerActionState,
} from '@/_hooks/useServerActionState'
import createFormAction from '@/_server/actions/form/create'
import { LoaderCircle, Table } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { IForm } from '../../../../db/schema'

export function NoFormYetComponent() {
    const router = useRouter()

    const afterCallback = (state: IReturnState<Partial<IForm>>) => {
        if (state.status === 'success') {
            router.push('/form/' + state.data.id)
        } else if (state.status === 'error') {
            toast.error(
                'Error al crear el formulario: ' + state.error?.message,
                {
                    position: 'top-right',
                }
            )
        }
    }

    const { isPending, handleAction } = useServerActionState<
        Partial<IForm>,
        Partial<IForm>
    >(createFormAction, afterCallback)

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
