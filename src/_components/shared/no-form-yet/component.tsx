'use client'
import { useRouter } from 'next/navigation'
import { useActionState, useEffect } from 'react'
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
import { createFormAction } from '@/_actions/form/create'

export function NoFormYetComponent() {
    const router = useRouter()
    const [state, formAction, pending] = useActionState<FormData>(
        createFormAction,
        new FormData()
    )

    useEffect(() => {
        if (state && state.get('id')) router.push(`form/${state.get('id')}`)
    }, [router, state])

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
                    <form action={formAction}>
                        <Button
                            type="submit"
                            variant="secondary"
                            disabled={pending}
                        >
                            {pending && (
                                <LoaderCircle className="animate-spin" />
                            )}
                            Crear Formulario
                        </Button>
                    </form>
                </div>
            </EmptyContent>
        </Empty>
    )
}
