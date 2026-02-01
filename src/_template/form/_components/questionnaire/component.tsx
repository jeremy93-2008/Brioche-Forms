'use client'
import { SingleFormSelectedContext } from '@/_provider/forms/single-form-selected'
import {
    IResponseWithAnswers,
    responseWithAnswersScheme,
} from '@/_server/_handlers/actions/response/scheme'
import { LazyStepperSectionComponent } from '@/_template/form/_components/questionnaire/_components/stepper/lazyImport'
import { useFormResponseValueByUser } from '@/_template/form/_components/questionnaire/_hooks/useFormResponseValueByUser'
import { useGetCurrentRespondent } from '@/_template/form/_components/questionnaire/_hooks/useGetCurrentRespondent'
import { zodResolver } from '@hookform/resolvers/zod'
import { use } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

interface IQuestionnaireComponentProps {
    isPreviewMode?: boolean
}

export function QuestionnaireComponent(props: IQuestionnaireComponentProps) {
    const { isPreviewMode = false } = props
    const { data } = use(SingleFormSelectedContext)!

    const currentRespondent = useGetCurrentRespondent()
    const defaultValues = useFormResponseValueByUser(currentRespondent)

    const form = useForm<IResponseWithAnswers>({
        defaultValues: defaultValues ?? {},
        resolver: zodResolver(responseWithAnswersScheme),
    })

    return (
        <div
            id="stepper-wrapper"
            className={`min-h-[calc(100vh-61px)] overflow-y-auto ${data.formStyle === 'standard' ? 'published-form-standard bg-background' : ''} 
            ${data.theme}`}
        >
            <FormProvider {...form}>
                <LazyStepperSectionComponent isPreviewMode={isPreviewMode} />
            </FormProvider>
        </div>
    )
}
