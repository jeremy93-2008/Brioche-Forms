import { redirect } from 'next/navigation'
import { stackServerApp } from '@/stack/server'
import { GettingStartedTemplate } from '@/_template/getting_started/template'
import Pattern from '@/assets/pattern.svg'

export default async function Home() {
    const user = await stackServerApp.getUser()

    if (user) {
        redirect('dashboard')
    }

    return (
        <div
            className="flex h-screen items-center justify-center font-sans"
            style={{
                backgroundImage: `url(${Pattern.src})`,
                backgroundSize: '13.5%',
                backgroundPosition: 'center',
            }}
        >
            {!user && <GettingStartedTemplate />}
        </div>
    )
}
