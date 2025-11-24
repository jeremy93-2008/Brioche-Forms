import { TopHeaderTemplate } from '@/_template/top_header/template'
import { NoFormYetComponent } from '@/_components/shared/no-form-yet/component'
import { ProtectedPage } from '@/_provider/protected-page'

export default function DashboardPage() {
    return (
        <ProtectedPage>
            <main className="flex flex-col justify-center font-sans">
                <TopHeaderTemplate />
                <section className="flex mt-34 flex-wrap">
                    <NoFormYetComponent />
                </section>
            </main>
        </ProtectedPage>
    )
}
