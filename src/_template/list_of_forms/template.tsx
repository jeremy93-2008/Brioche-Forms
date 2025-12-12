import initialPoster from '@/_assets/initial-poster.jpg'
import { Button } from '@/_components/ui/button'
import { Card } from '@/_components/ui/card'
import { IFullForm } from '@/_server/_handlers/queries/form/get'
import { Pencil } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface IListOfFormsTemplateProps {
    data: IFullForm[]
}

export function ListOfFormsTemplate(props: IListOfFormsTemplateProps) {
    const { data } = props
    return (
        <section className="flex justify-center flex-1 w-full">
            {data.map((form) => (
                <Link key={form.id} href={`/form/${form.id}`}>
                    <Card
                        className="relative group overflow-hidden py-0 gap-3 cursor-pointer opacity-90 hover:opacity-100"
                        key={form.id}
                    >
                        <section
                            style={{ backgroundColor: form.backgroundColor }}
                        >
                            <Image
                                src={form.headerImage ?? initialPoster.src}
                                width="300"
                                height="200"
                                alt="image of form"
                            />
                            <h2 className="text-secondary text-shadow-xl px-4">
                                {form.title}
                            </h2>
                            <Button
                                className="absolute w-10 h-10 top-0 right-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                variant="default"
                            >
                                <Pencil />
                            </Button>
                        </section>
                        <p className="px-4 pb-4">{form.description}</p>
                    </Card>
                </Link>
            ))}
        </section>
    )
}
