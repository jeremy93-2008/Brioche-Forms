'use client'
import { use } from 'react'
import { Button } from '@/_components/ui/button'
import { Pen } from 'lucide-react'
import { SingleFormSelectedContext } from '@/_provider/forms/single-form-selected'
import { type IForm } from '../../../../../../../db/schema'

export function FormTitleEditComponent() {
    const data: IForm = use(SingleFormSelectedContext)!

    return (
        <Button className="text-xl group" variant="link">
            <span>{data?.title}</span>
            <Pen className="opacity-0 transition-opacity group-hover:opacity-100" />
        </Button>
    )
}
