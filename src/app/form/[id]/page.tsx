import { SingleFormSelectedProvider } from '@/_provider/forms/single-form-selected'
import { ProtectedPage } from '@/_provider/protected-page'
import GetForms from '@/_server/_handlers/queries/form/get'
import { BuildFormTemplate } from '@/_template/build_form/template'
import { TopHeaderTemplate } from '@/_template/top_header/template'

export default async function FormPage(props: {
    params: Promise<{ id: string }>
}) {
    const params = await props.params
    const result = await GetForms({ id: params.id })

    return (
        <ProtectedPage>
            {result.status === 'success' && result.data.length > 0 && (
                <SingleFormSelectedProvider value={result.data[0]}>
                    <main className="flex flex-col justify-center font-sans">
                        <TopHeaderTemplate />
                        <BuildFormTemplate />
                    </main>
                </SingleFormSelectedProvider>
            )}
        </ProtectedPage>
    )
}
