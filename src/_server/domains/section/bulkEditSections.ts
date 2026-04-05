import { editMedia } from '@/_server/domains/media/editMedia'
import { editImageSection } from '@/_server/domains/section/image/editImageSection'
import { upsertChoicesSection } from '@/_server/domains/section/question/choices/upsertChoicesSection'
import { editQuestionSection } from '@/_server/domains/section/question/editQuestionSection'
import { editTextSection } from '@/_server/domains/section/text/editTextSection'
import { editVideoSection } from '@/_server/domains/section/video/editVideoSection'
import { IChoice, IImage, IQuestion, IText, IVideo } from '@db/types'

export interface IBulkEditInput {
    form_id: string
    texts?: Array<Partial<IText>>
    images?: Array<Partial<IImage> & { media_id?: string }>
    videos?: Array<Partial<IVideo>>
    questions?: Array<{
        question: Partial<IQuestion>
        choices?: IChoice[]
    }>
}

export async function bulkEditSections(data: IBulkEditInput) {
    const results: { texts: number; images: number; videos: number; questions: number } = {
        texts: 0,
        images: 0,
        videos: 0,
        questions: 0,
    }

    if (data.texts) {
        for (const text of data.texts) {
            await editTextSection({ ...text, form_id: data.form_id })
            results.texts++
        }
    }

    if (data.images) {
        for (const image of data.images) {
            await editImageSection({ ...image, form_id: data.form_id })
            if (image.url) {
                await editMedia({
                    url: image.url,
                    used_in_form_id: data.form_id,
                })
            }
            results.images++
        }
    }

    if (data.videos) {
        for (const video of data.videos) {
            await editVideoSection({ ...video, form_id: data.form_id })
            results.videos++
        }
    }

    if (data.questions) {
        for (const entry of data.questions) {
            await editQuestionSection({
                ...entry.question,
                form_id: data.form_id,
            })
            if (entry.choices && entry.choices.length > 0) {
                await upsertChoicesSection(entry.choices)
            }
            results.questions++
        }
    }

    return results
}
