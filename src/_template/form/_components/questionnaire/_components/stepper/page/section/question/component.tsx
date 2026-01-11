import { Input } from '@/_components/ui/input'
import { Label } from '@/_components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/_components/ui/radio-group'
import { Textarea } from '@/_components/ui/textarea'
import { IQuestionTypeValues } from '@/_constants/question'
import { IFullQuestion } from '@/_template/build_form/_components/form-body-editor/_components/form-section-edit/_components/form-section-question-edit/types'
import { cn } from '@/_utils/clsx-tw'
import { Checkbox } from '@stackframe/stack-ui'
import { StarIcon } from 'lucide-react'
import { useState } from 'react'

interface IQuestionSectionComponentProps {
    data: IFullQuestion
}

export function QuestionSectionComponent(
    props: IQuestionSectionComponentProps
) {
    const { data } = props

    const [opinionScale, setOpinionScale] = useState<number>(0)
    const [rating, setRating] = useState<number>(0)

    const handleOpinionScaleChange = (newVal: number) => () => {
        if (newVal > 10) {
            setOpinionScale(10)
            return
        } else if (newVal < 0) {
            setOpinionScale(0)
            return
        }
        setOpinionScale(newVal)
    }

    const handleRatingChange = (newVal: number) => () => {
        if (newVal > 5) {
            setRating(5)
            return
        } else if (newVal < 0) {
            setRating(0)
            return
        }
        setRating(newVal)
    }

    return (
        <div className="w-full flex flex-col gap-2 items-start justify-center p-4">
            <div className="content">
                {data.content}{' '}
                {data.is_required ? <sup className="text-red-500">*</sup> : ''}
            </div>
            <div className="answer w-4/6">
                {(data.type as IQuestionTypeValues) === 'short_answer' && (
                    <Input type="text" />
                )}
                {(data.type as IQuestionTypeValues) === 'long_answer' && (
                    <Textarea />
                )}
                {(data.type as IQuestionTypeValues) === 'short_answer:date' && (
                    <Input type="date" />
                )}
                {(data.type as IQuestionTypeValues) ===
                    'short_answer:email' && <Input type="email" />}
                {(data.type as IQuestionTypeValues) ===
                    'short_answer:phone' && <Input type="tel" />}
                {(data.type as IQuestionTypeValues) ===
                    'short_answer:opinion_scale' && (
                    <>
                        <input type="hidden" />
                        {[...Array(10)].map((_, idx) => (
                            <button
                                key={idx}
                                className={`w-8 h-8 m-1 rounded-full border border-gray-300 flex items-center justify-center ${
                                    opinionScale === idx + 1
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-white text-black'
                                }`}
                                onClick={handleOpinionScaleChange(idx + 1)}
                                type="button"
                            >
                                {idx + 1}
                            </button>
                        ))}
                    </>
                )}
                {(data.type as IQuestionTypeValues) ===
                    'short_answer:rating' && (
                    <>
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
                                        rating === idx + 1
                                            ? 'bg-yellow-400 text-white'
                                            : 'bg-white text-black'
                                    )}
                                />
                            </button>
                        ))}
                    </>
                )}
                {(data.type as IQuestionTypeValues) === 'single_choice' && (
                    <div className="flex flex-col gap-2">
                        <RadioGroup>
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
                                        value={choice.id}
                                    />
                                    {choice.is_free_text ? (
                                        <>
                                            <span>Otro: </span>
                                            <Input type="text" />
                                        </>
                                    ) : (
                                        <span>{choice.content}</span>
                                    )}
                                </label>
                            ))}
                    </div>
                )}
            </div>
        </div>
    )
}
