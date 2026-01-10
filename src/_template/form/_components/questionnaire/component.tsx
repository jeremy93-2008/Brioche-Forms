'use client'
import { SingleFormSelectedContext } from '@/_provider/forms/single-form-selected'
import { PageComponent } from '@/_template/form/_components/questionnaire/_components/page/component'
import { use } from 'react'

export function QuestionnaireComponent() {
    const { data } = use(SingleFormSelectedContext)!

    return (
        <div
            className={`h-screen overflow-y-auto ${data.formStyle === 'standard' ? 'published-form-standard bg-background' : ''} 
            ${data.theme === 'dark' ? 'dark' : ''}`}
        >
            {data.pages.map((page) => (
                <div key={page.id} className="p-8">
                    <PageComponent data={page} />
                </div>
            ))}
        </div>
    )
}
