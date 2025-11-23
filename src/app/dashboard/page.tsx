'use client'
import { useUser } from '@stackframe/stack'
import { redirect } from 'next/navigation'
import { TopHeaderTemplate } from '@/_template/top_header/template'
import { NoFormYetComponent } from '@/_components/shared/no-form-yet/component'

export default function DashboardPage() {
    const user = useUser()

    if (!user) {
        redirect('/')
    }

    return (
        <main className="flex flex-col justify-center font-sans">
            <TopHeaderTemplate />
            <section className="flex mt-34 flex-wrap">
                <NoFormYetComponent />
            </section>
        </main>
    )
}
