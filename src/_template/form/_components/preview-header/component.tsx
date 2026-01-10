'use client'
import { Button } from '@/_components/ui/button'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/_components/ui/tooltip'
import { SingleFormSelectedContext } from '@/_provider/forms/single-form-selected'
import { Cross1Icon } from '@radix-ui/react-icons'
import { EyeIcon, EyeOffIcon, LinkIcon } from 'lucide-react'
import Link from 'next/link'
import { use } from 'react'
import { toast } from 'sonner'

export function PreviewHeaderComponent() {
    const { data } = use(SingleFormSelectedContext)

    const copyLinkToClipboard = () => {
        const url = `${window.location.origin}/form/${data.id}`
        navigator.clipboard.writeText(url).then()
        toast.success('Enlace copiado al portapapeles')
    }

    return (
        <header className="flex justify-between items-center w-full p-4 border-b bg-card">
            <section className="flex items-center gap-3">
                <h1 className="text-xl font-semibold text-center">
                    {data.title} - Vista Previa
                </h1>
                <Link href={`/form/${data.id}/edit`}>
                    <Button className="ml-6" size="xs">
                        Editar formulario
                    </Button>
                </Link>
            </section>

            <section className="flex gap-4">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            onClick={copyLinkToClipboard}
                            variant="link"
                            className={`mr-2 cursor-pointer`}
                            size="xs"
                            disabled={!data.isPublished}
                        >
                            <LinkIcon />
                            Copiar enlace para encuestados
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        {data.isPublished
                            ? 'Copiar enlace al portapapeles'
                            : 'Publica el formulario para obtener el enlace'}
                    </TooltipContent>
                </Tooltip>

                {data.isPublished ? (
                    <>
                        <span className="flex gap-2 bg-green-500 text-green-950 px-3 py-1 rounded-lg items-center mr-16 text-sm">
                            <EyeIcon />
                            Formulario publicado
                        </span>
                    </>
                ) : (
                    <span className="flex gap-2 bg-amber-400 text-amber-950 px-2 py-0.5 rounded-lg items-center mr-16 text-xs">
                        <EyeOffIcon />
                        Formulario no publicado
                    </span>
                )}
                <Tooltip>
                    <TooltipTrigger>
                        <Cross1Icon
                            className="cursor-pointer"
                            onClick={() => window.close()}
                        />
                    </TooltipTrigger>
                    <TooltipContent>Cerrar vista previa</TooltipContent>
                </Tooltip>
            </section>
        </header>
    )
}
