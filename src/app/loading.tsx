import { LoaderCircle } from 'lucide-react'

export default function Loading() {
    // Stack uses React Suspense, which will render this page while user data is being fetched.
    // See: https://nextjs.org/docs/app/api-reference/file-conventions/loading
    return (
        <main className="w-screen h-screen flex items-center justify-center px-2 py-2">
            <LoaderCircle className="text-primary w-14 h-14 animate-spin" />
        </main>
    )
}
