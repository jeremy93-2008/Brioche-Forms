import { Button } from '@/_components/ui/button'
import { Card } from '@/_components/ui/card'
import Image from 'next/image'
import Link from 'next/link'

import Brioche from '@/_assets/brioche.svg'

export function GettingStartedTemplate() {
    return (
        <Card className="flex flex-col gap-2 items-center justify-center font-sans px-12 py-6">
            <Image className="w-32" src={Brioche} alt="" />
            <h1 className="font-montserrat text-4xl font-bold mb-4">
                Bienvenido a Brioche!
            </h1>
            <p className="font-montserrat text-lg w-2/3 text-center">
                Crea y comparte formularios sin esfuerzo con Brioche, el
                intuitivo creador de formularios diseñado para la simplicidad y
                la eficiencia.
            </p>
            <p className="font-montserrat text-lg mb-8">
                Lo primero que debes hacer es crearte una cuenta
            </p>
            <Link href="/handler/sign-up">
                <Button>¡Empezamos!</Button>
            </Link>
        </Card>
    )
}
