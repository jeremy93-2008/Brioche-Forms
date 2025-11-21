'use client'
import { useUser } from '@stackframe/stack'
import { redirect } from 'next/navigation'

export default function FormsPage() {
    const user = useUser()

    if (!user) {
        redirect('/')
    }

    return (
        <div className="flex items-center justify-center font-sans">
            Welcome to the Forms Builder Page!
        </div>
    )
}
