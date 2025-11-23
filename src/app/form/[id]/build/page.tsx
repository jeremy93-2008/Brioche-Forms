import { stackServerApp } from '@/stack/server'

export default async function FormPage(props: {
    params: Promise<{ id: string }>
}) {
    const params = await props.params
    const user = await stackServerApp.getUser({ or: 'redirect' })
    return (
        <div className="flex items-center justify-center font-sans">
            Welcome to the Form Detail Page!
        </div>
    )
}
