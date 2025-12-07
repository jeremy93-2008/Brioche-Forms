'use client'
import { Button } from '@/_components/ui/button'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/_components/ui/dialog'
import { Textarea } from '@/_components/ui/textarea'
import { useServerActionState } from '@/_hooks/useServerActionState'
import { SingleFormSelectedContext } from '@/_provider/forms/single-form-selected'
import EditFormAction from '@/_server/actions/form/update'
import { Pen } from 'lucide-react'
import { use, useState } from 'react'
import { useForm } from 'react-hook-form'
import { type IForm } from '../../../../../../../db/types'

export function FormDescriptionEditComponent() {
    const data: IForm = use(SingleFormSelectedContext)!

    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const { register, handleSubmit } = useForm<Partial<IForm>>()

    const { isPending, runAction: runEditFormAction } =
        useServerActionState(EditFormAction)

    const onEditTitle = async (data: Partial<IForm>) => {
        if (isPending) return
        await runEditFormAction(data)
        setIsDialogOpen(false)
    }

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button className="text-sm group" variant="link">
                    <section>
                        {data?.description || (
                            <span className="opacity-50">
                                Agregar descripción
                            </span>
                        )}
                    </section>
                    <Pen className="opacity-0 transition-opacity group-hover:opacity-100" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Editar Descripción del Formulario</DialogTitle>
                    <DialogDescription className="mt-2">
                        <input
                            type="hidden"
                            value={data.id}
                            {...register('id')}
                        />
                        <Textarea
                            className="text-secondary"
                            defaultValue={data.description ?? ''}
                            autoFocus
                            {...register('description')}
                        />
                    </DialogDescription>
                    <DialogFooter className="mt-4">
                        <DialogClose asChild>
                            <Button variant="outline">Cancelar</Button>
                        </DialogClose>
                        <Button
                            onClick={handleSubmit(onEditTitle)}
                            variant="secondary"
                            isLoading={isPending}
                        >
                            Guardar
                        </Button>
                    </DialogFooter>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}
