import { SingleFormSelectedProvider } from '@/_provider/forms/single-form-selected'
import GetForms from '@/_server/_handlers/queries/form/get'
import { FormTemplate } from '@/_template/form/template'
import { redirect } from 'next/navigation'

export default async function FormPreviewPage(props: {
    params: Promise<{ id: string }>
}) {
    const params = await props.params
    const result = await GetForms({ id: params.id })

    const previewTitlePage =
        result.status === 'success'
            ? result.data[0].title + ' - Brioche Form'
            : 'Brioche Form'

    if (result.status !== 'success' || result.data.length === 0) {
        redirect('/')
    }

    return (
        <div>
            <title>{previewTitlePage}</title>
            {result.status === 'success' && result.data.length > 0 && (
                <SingleFormSelectedProvider value={result.data[0]}>
                    <main className="flex flex-col justify-center font-sans">
                        <FormTemplate
                            isPreviewMode={true}
                            formData={result.data[0]}
                        />
                    </main>
                </SingleFormSelectedProvider>
            )}
        </div>
    )
}
