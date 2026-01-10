import { Input } from '@/_components/ui/input'
import { IQuestionTypeValues } from '@/_constants/question'
import { IFullQuestion } from '@/_template/build_form/_components/form-body-editor/_components/form-section-edit/_components/form-section-question-edit/types'

interface IQuestionSectionComponentProps {
    data: IFullQuestion
}

export function QuestionSectionComponent(
    props: IQuestionSectionComponentProps
) {
    const { data } = props

    return (
        <div className="w-full flex flex-col items-center justify-center p-4">
            <div className="content">{data.content}</div>
            {(data.type as IQuestionTypeValues) === 'short_answer' && (
                <Input type="text" />
            )}
        </div>
    )
}
