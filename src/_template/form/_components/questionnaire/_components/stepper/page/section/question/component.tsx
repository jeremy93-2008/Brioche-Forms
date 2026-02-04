import { Input } from '@/_components/ui/input'
import { Label } from '@/_components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/_components/ui/radio-group'
import { Textarea } from '@/_components/ui/textarea'
import { IQuestionTypeValues } from '@/_constants/question'
import { IFullQuestion } from '@/_template/build_form/_components/form-body-editor/_components/form-section-edit/_components/form-section-question-edit/types'
import { useAnswerQuestion } from '@/_template/form/_components/questionnaire/_components/stepper/page/section/question/_hooks/useAnswerQuestion'
import { useHandleAnswerChange } from '@/_template/form/_components/questionnaire/_components/stepper/page/section/question/_hooks/useHandleAnswerChange'
import { useQuestionAnswerError } from '@/_template/form/_components/questionnaire/_components/stepper/page/section/question/_hooks/useQuestionAnswerError'
import { cn } from '@/_utils/clsx-tw'
import { Checkbox } from '@stackframe/stack-ui'
import { StarIcon } from 'lucide-react'

interface IQuestionSectionComponentProps {
    data: IFullQuestion
}

export function QuestionSectionComponent(
    props: IQuestionSectionComponentProps
) {
    const { data } = props

    const {
        answers,
        currentQuestionAnswer,
        currentSingleChoiceAnswer,
        currentMultipleChoiceAnswers,
    } = useAnswerQuestion({ questionId: data.id })

    const {
        handleAnswerValueChange,
        handleOpinionScaleChange,
        handleRatingChange,
        handleSingleChoiceChange,
        handleMultipleChoiceChange,
        handleFreeTextChoiceChange,
    } = useHandleAnswerChange({
        questionId: data.id,
        questionType: data.type,
        answers,
        currentQuestionAnswer,
    })

    const { invalidAnswers } = useQuestionAnswerError()

    return (
        <div className="w-full flex flex-col gap-2 items-start justify-center p-4">
            <div className="content">
                {data.content}{' '}
                {data.is_required ? <sup className="text-red-500">*</sup> : ''}
            </div>
            <div className="answer w-4/6">
                {(data.type as IQuestionTypeValues) === 'short_answer' && (
                    <Input
                        className={cn(
                            invalidAnswers[data.id]
                                ? 'border-red-500 bg-red-500/20!'
                                : ''
                        )}
                        id={`question:${data.id}`}
                        type="text"
                        value={currentQuestionAnswer?.value ?? ''}
                        onChange={handleAnswerValueChange}
                    />
                )}
                {(data.type as IQuestionTypeValues) === 'long_answer' && (
                    <Textarea
                        className={cn(
                            invalidAnswers[data.id]
                                ? 'border-red-500 bg-red-500/20!'
                                : ''
                        )}
                        id={`question:${data.id}`}
                        value={currentQuestionAnswer?.value ?? ''}
                        onChange={handleAnswerValueChange}
                    />
                )}
                {(data.type as IQuestionTypeValues) === 'short_answer:date' && (
                    <Input
                        className={cn(
                            invalidAnswers[data.id]
                                ? 'border-red-500 bg-red-500/20!'
                                : ''
                        )}
                        id={`question:${data.id}`}
                        type="date"
                        value={currentQuestionAnswer?.value ?? ''}
                        onChange={handleAnswerValueChange}
                    />
                )}
                {(data.type as IQuestionTypeValues) ===
                    'short_answer:email' && (
                    <Input
                        className={cn(
                            invalidAnswers[data.id]
                                ? 'border-red-500 bg-red-500/20!'
                                : ''
                        )}
                        id={`question:${data.id}`}
                        type="email"
                        value={currentQuestionAnswer?.value ?? ''}
                        onChange={handleAnswerValueChange}
                    />
                )}
                {(data.type as IQuestionTypeValues) ===
                    'short_answer:phone' && (
                    <Input
                        className={cn(
                            invalidAnswers[data.id]
                                ? 'border-red-500 bg-red-500/20!'
                                : ''
                        )}
                        id={`question:${data.id}`}
                        type="tel"
                        value={currentQuestionAnswer?.value ?? ''}
                        onChange={handleAnswerValueChange}
                    />
                )}
                {(data.type as IQuestionTypeValues) ===
                    'short_answer:opinion_scale' && (
                    <section
                        className={cn(
                            invalidAnswers[data.id]
                                ? 'border-red-500 bg-red-500/20!'
                                : ''
                        )}
                        id={`question:${data.id}`}
                    >
                        <input type="hidden" />
                        {[...Array(10)].map((_, idx) => (
                            <button
                                key={idx}
                                className={`w-8 h-8 m-1 rounded-full border border-gray-300 flex items-center justify-center ${
                                    Number(currentQuestionAnswer?.value) ===
                                    idx + 1
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-white text-black'
                                }`}
                                onClick={handleOpinionScaleChange(idx + 1)}
                                type="button"
                            >
                                {idx + 1}
                            </button>
                        ))}
                    </section>
                )}
                {(data.type as IQuestionTypeValues) ===
                    'short_answer:rating' && (
                    <section
                        className={cn(
                            invalidAnswers[data.id]
                                ? 'border-red-500 bg-red-500/20!'
                                : ''
                        )}
                        id={`question:${data.id}`}
                    >
                        <input type="hidden" />
                        {[...Array(5)].map((_, idx) => (
                            <button
                                key={idx}
                                className={`w-8 h-8 m-1 rounded-full border border-gray-300 flex items-center justify-center`}
                                onClick={handleRatingChange(idx + 1)}
                                type="button"
                            >
                                <StarIcon
                                    className={cn(
                                        Number(currentQuestionAnswer?.value) ===
                                            idx + 1
                                            ? 'bg-yellow-400 text-white'
                                            : 'bg-white text-black'
                                    )}
                                />
                            </button>
                        ))}
                    </section>
                )}
                {(data.type as IQuestionTypeValues) === 'single_choice' && (
                    <div className="flex flex-col gap-2">
                        <RadioGroup
                            value={currentSingleChoiceAnswer}
                            onValueChange={handleSingleChoiceChange}
                            className={cn(
                                invalidAnswers[data.id]
                                    ? 'border-red-500 bg-red-500/20!'
                                    : ''
                            )}
                            id={`question:${data.id}`}
                        >
                            {data.choices
                                .sort((a, b) => a.order.localeCompare(b.order))
                                .map((choice) => (
                                    <label
                                        key={choice.id}
                                        className="flex w-full items-center gap-2"
                                    >
                                        <RadioGroupItem
                                            id={`question-${choice.id}`}
                                            value={choice.id}
                                        />
                                        {choice.is_free_text ? (
                                            <>
                                                <span>Otro: </span>
                                                <Label
                                                    htmlFor={`question-${choice.id}`}
                                                >
                                                    <Input
                                                        value={
                                                            currentQuestionAnswer?.choice_free_text ??
                                                            ''
                                                        }
                                                        onChange={handleFreeTextChoiceChange()}
                                                        className="w-full"
                                                        type="text"
                                                    />
                                                </Label>
                                            </>
                                        ) : (
                                            <span>{choice.content}</span>
                                        )}
                                    </label>
                                ))}
                        </RadioGroup>
                    </div>
                )}
                {(data.type as IQuestionTypeValues) === 'multiple_choice' && (
                    <section
                        className={cn(
                            invalidAnswers[data.id]
                                ? 'border-red-500 bg-red-500/20!'
                                : ''
                        )}
                        id={`question:${data.id}`}
                    >
                        <div className="flex flex-col gap-2">
                            {data.choices
                                .sort((a, b) => a.order.localeCompare(b.order))
                                .map((choice) => (
                                    <label
                                        key={choice.id}
                                        className="flex items-center gap-2"
                                    >
                                        <Checkbox
                                            name={`question-${data.id}`}
                                            checked={currentMultipleChoiceAnswers.includes(
                                                choice.id
                                            )}
                                            onCheckedChange={handleMultipleChoiceChange(
                                                choice.id
                                            )}
                                        />
                                        {choice.is_free_text ? (
                                            <>
                                                <span>Otro: </span>
                                                <Input
                                                    value={
                                                        currentQuestionAnswer?.choice_free_text ??
                                                        ''
                                                    }
                                                    onChange={handleFreeTextChoiceChange()}
                                                    className="w-full"
                                                    type="text"
                                                />
                                            </>
                                        ) : (
                                            <span>{choice.content}</span>
                                        )}
                                    </label>
                                ))}
                        </div>
                    </section>
                )}
            </div>
            <div className="flex flex-col gap-2">
                {invalidAnswers[data.id] && (
                    <span className="text-red-600 text-sm">
                        {invalidAnswers[data.id].message}
                    </span>
                )}
            </div>
        </div>
    )
}
