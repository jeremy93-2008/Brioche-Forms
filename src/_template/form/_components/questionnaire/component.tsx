'use client'
import { SingleFormSelectedContext } from '@/_provider/forms/single-form-selected'
import { LazyStepperSectionComponent } from '@/_template/form/_components/questionnaire/_components/stepper/lazyImport'
import { use } from 'react'

export function QuestionnaireComponent() {
    const { data } = use(SingleFormSelectedContext)!

    return (
        <div
            id="stepper-wrapper"
            className={` overflow-y-auto ${data.formStyle === 'standard' ? 'published-form-standard bg-background' : ''} 
            ${data.theme === 'dark' ? 'dark' : ''}`}
        >
            <LazyStepperSectionComponent />
        </div>
    )
}
