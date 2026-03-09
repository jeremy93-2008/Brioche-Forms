import { IAnswerType } from '@db/types'

export type IResultResponse = {
    respondent_name: string
    is_partial_response: number
    submitted_at: number
    questions: IResultResponseQuestion[]
}

export type IResultResponseQuestion = {
    name: string
    content: string
    type: IAnswerType
    answer: string | number | boolean | null
    choices: IResultResponseQuestionChoice[]
}

export type IResultResponseQuestionChoice = {
    content: string
    is_free_text: number
    free_text_answer: string | null
}
