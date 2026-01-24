'use client'
import { Toaster } from '@/_components/ui/sonner'
import { SingleFormSelectedContext } from '@/_provider/forms/single-form-selected'
import { IResponseWithAnswers } from '@/_server/_handlers/actions/response/upsert'
import { LazyStepperSectionComponent } from '@/_template/form/_components/questionnaire/_components/stepper/lazyImport'
import { useFormResponseValueByUser } from '@/_template/form/_components/questionnaire/_hooks/useFormResponseValueByUser'
import { useGetCurrentRespondent } from '@/_template/form/_components/questionnaire/_hooks/useGetCurrentRespondent'
import React, { use } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

interface IQuestionnaireComponentProps {
    isPreviewMode?: boolean
}

export function QuestionnaireComponent(props: IQuestionnaireComponentProps) {
    const { isPreviewMode = false } = props
    const { data } = use(SingleFormSelectedContext)!

    const currentRespondent = useGetCurrentRespondent()
    const defaultValues = useFormResponseValueByUser(currentRespondent)

    const form = useForm<IResponseWithAnswers | object>({
        defaultValues: defaultValues ?? {},
    })

    return (
        <div
            id="stepper-wrapper"
            className={`min-h-[calc(100vh-61px)] overflow-y-auto ${data.formStyle === 'standard' ? 'published-form-standard bg-background' : ''} 
            ${data.theme}`}
        >
            <FormProvider {...form}>
                <Toaster position="top-center" />
                <LazyStepperSectionComponent isPreviewMode={isPreviewMode} />
            </FormProvider>
        </div>
    )
}
