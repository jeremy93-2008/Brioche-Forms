'use client'
import { SingleFormSelectedContext } from '@/_provider/forms/single-form-selected'
import { formatDate } from '@/_utils/formatDate'
import { use } from 'react'

export function FormInfoRightComponent() {
    const { data } = use(SingleFormSelectedContext)!

    return (
        <section className="flex flex-col items-end font-sans">
            <span className="text-sm">
                Creado por <strong>{data.author_name}</strong>, el{' '}
                <strong>{formatDate(data.createdAt)}</strong>
            </span>
            <span className="text-sm">
                Última modificación:{' '}
                <strong>{formatDate(data.updatedAt)}</strong>
            </span>
        </section>
    )
}
