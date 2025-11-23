import { TopHeaderTemplate } from '@/_template/top_header/template'
import { NoFormYetComponent } from '@/_components/shared/no-form-yet/component'
import { stackServerApp } from '@/stack/server'

export default async function DashboardPage() {
    const _user = await stackServerApp.getUser({ or: 'redirect' })

    return (
        <main className="flex flex-col justify-center font-sans">
            <TopHeaderTemplate />
            <section className="flex mt-34 flex-wrap">
                <NoFormYetComponent />
            </section>
        </main>
    )
}
