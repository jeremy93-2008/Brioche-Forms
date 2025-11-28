'use client'
import { use } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/_components/ui/dialog'
import { Button } from '@/_components/ui/button'
import { Pen } from 'lucide-react'
import { SingleFormSelectedContext } from '@/_provider/forms/single-form-selected'
import { type IForm } from '../../../../../../../db/schema'
import { Input } from '@/_components/ui/input'

export function FormTitleEditComponent() {
    const data: IForm = use(SingleFormSelectedContext)!

    return (
        <Dialog>
            <DialogTrigger>
                <Button className="text-xl group" variant="link">
                    <span>{data?.title}</span>
                    <Pen className="opacity-0 transition-opacity group-hover:opacity-100" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Renombrar Formulario</DialogTitle>
                    <DialogDescription className="mt-2">
                        <Input
                            className="text-secondary"
                            defaultValue={data.title}
                            autoFocus
                        />
                    </DialogDescription>
                    <DialogFooter className="mt-4">
                        <Button variant="outline">Cancelar</Button>
                        <Button variant="secondary">Guardar</Button>
                    </DialogFooter>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}
