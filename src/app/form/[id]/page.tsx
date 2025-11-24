import { ProtectedPage } from '@/_provider/protected-page'
import { stackServerApp } from '@/_stack/server'
import { db } from '../../../../db'
import { formsTable, type IForm } from '../../../../db/schema'
import { and, eq } from 'drizzle-orm'
import { TopHeaderTemplate } from '@/_template/top_header/template'
import { BuildFormTemplate } from '@/_template/build_form/template'
import { SingleFormSelectedProvider } from '@/_provider/forms/single-form-selected'

export default async function FormPage(props: {
    params: Promise<{ id: string }>
}) {
    const params = await props.params
    const user = await stackServerApp.getUser({ or: 'redirect' })

    const data: IForm[] = await db
        .select()
        .from(formsTable)
        .where(
            and(eq(formsTable.id, params.id), eq(formsTable.author_id, user.id))
        )

    return (
        <ProtectedPage>
            <SingleFormSelectedProvider value={data[0]}>
                <main className="flex flex-col justify-center font-sans">
                    <TopHeaderTemplate />
                    <BuildFormTemplate />
                </main>
            </SingleFormSelectedProvider>
        </ProtectedPage>
    )
}
