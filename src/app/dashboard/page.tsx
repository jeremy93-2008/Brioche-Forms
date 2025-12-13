import { NoFormYetComponent } from '@/_components/shared/no-form-yet/component.client'
import { ProtectedPage } from '@/_provider/protected-page'
import GetForms from '@/_server/_handlers/queries/form/get'
import { ListOfFormsTemplate } from '@/_template/list_of_forms/template'
import { TopHeaderTemplate } from '@/_template/top_header/template'

export default async function DashboardPage() {
    const result = await GetForms({})

    return (
        <ProtectedPage>
            <main className="flex flex-col justify-center font-sans">
                <TopHeaderTemplate />
                <section className="flex mt-34 flex-wrap">
                    {result.status === 'success' && result.data.length > 0 ? (
                        <ListOfFormsTemplate data={result.data} />
                    ) : (
                        <NoFormYetComponent />
                    )}
                </section>
            </main>
        </ProtectedPage>
    )
}
