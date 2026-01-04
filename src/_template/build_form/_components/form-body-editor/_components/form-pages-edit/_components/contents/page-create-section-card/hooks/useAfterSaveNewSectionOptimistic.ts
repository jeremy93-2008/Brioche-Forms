import { SingleFormSelectedContext } from '@/_provider/forms/single-form-selected'
import { SectionConstants } from '@/_server/_constants/section'
import { IReturnAction } from '@/_server/_handlers/actions/types'
import { IImage, IQuestion, IText, IVideo } from '@db/types'
import { startTransition, use } from 'react'

type ISectionContentType = {
    contentType: 'texts' | 'images' | 'videos' | 'questions'
}

interface ICreateSectionResult {
    section_id: string
    text_id?: string
    image_id?: string
    video_id?: string
    question_id?: string
}

export function useAfterSaveNewSectionOptimistic(params: ISectionContentType) {
    const { updateOptimisticData } = use(SingleFormSelectedContext)!

    const afterSave = (
        isSuccess: boolean,
        updatedData: {
            id: string
            form_id: string
            page_id: string
            title: string
            type?: string
            name?: string
            content?: string
        },
        result: IReturnAction<ICreateSectionResult>
    ) => {
        if (!isSuccess) return
        if (result.status === 'success') {
            const newOptimisticSectionData = {
                id: result.data.section_id,
                title: updatedData.title ?? updatedData.name,
                description: '',
                order: 'latest',
                conditions: '',
                page_id: updatedData.page_id,
                form_id: updatedData.form_id,
            }

            const newOptimisticBaseContentData = {
                order: 'latest',
                section_id: result.data.section_id,
                form_id: updatedData.form_id,
            }

            const newOptimisticContentDataByType = {
                texts: {
                    ...newOptimisticBaseContentData,
                    id: result.data.text_id,
                    content: SectionConstants.defaultContent,
                } as IText,
                images: {
                    ...newOptimisticBaseContentData,
                    id: result.data.image_id,
                    url: '',
                    caption: '',
                } as IImage,
                videos: {
                    ...newOptimisticBaseContentData,
                    id: result.data.video_id,
                    url: '',
                    caption: '',
                } as IVideo,
                questions: {
                    ...newOptimisticBaseContentData,
                    id: result.data.question_id,
                    name: updatedData.name,
                    type: updatedData.type,
                    is_required: 0,
                    content: updatedData.content ?? '',
                    choices: [],
                } as IQuestion,
            }

            startTransition(() => {
                updateOptimisticData({
                    newUpdateValue: newOptimisticSectionData,
                    opts: {
                        type: 'create',
                        parentId: updatedData.page_id,
                        fieldName: 'sections',
                    },
                })
                updateOptimisticData({
                    newUpdateValue:
                        newOptimisticContentDataByType[params.contentType],
                    opts: {
                        type: 'create',
                        parentId: result.data.section_id,
                        fieldName: params.contentType,
                    },
                })
            })
        }
    }

    return { afterSave }
}
