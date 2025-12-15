import { IFullForm } from '@/_server/domains/form/getFullForms'
import {
    IImage,
    IPage,
    IQuestion,
    ISection,
    IText,
    IVideo,
} from '../../../../db/types'

export function findPositionFormObjectById(
    obj: IFullForm,
    id: string
): {
    parent:
        | IFullForm
        | IPage
        | ISection
        | IText
        | IImage
        | IVideo
        | IQuestion
        | null
    childName: string | null
    idx: number | null
} {
    if (obj.id === id) {
        return { parent: null, idx: null, childName: null }
    }
    if (obj.pages) {
        for (let pIdx = 0; pIdx < obj.pages.length; pIdx++) {
            const page = obj.pages[pIdx]
            if (page.id === id) {
                return { parent: obj, idx: pIdx, childName: 'pages' }
            }

            if (page.sections) {
                for (let sIdx = 0; sIdx < page.sections.length; sIdx++) {
                    const section = page.sections[sIdx]
                    if (section.id === id) {
                        return {
                            parent: page,
                            idx: sIdx,
                            childName: 'sections',
                        }
                    }
                    if (section.questions) {
                        for (
                            let qIdx = 0;
                            qIdx < section.questions.length;
                            qIdx++
                        ) {
                            const field = section.questions[qIdx]
                            if (field.id === id) {
                                return {
                                    parent: section,
                                    idx: qIdx,
                                    childName: 'questions',
                                }
                            }
                        }
                    } else if (section.videos) {
                        for (
                            let vIdx = 0;
                            vIdx < section.videos.length;
                            vIdx++
                        ) {
                            const field = section.videos[vIdx]
                            if (field.id === id) {
                                return {
                                    parent: section,
                                    idx: vIdx,
                                    childName: 'videos',
                                }
                            }
                        }
                    } else if (section.images) {
                        for (
                            let iIdx = 0;
                            iIdx < section.images.length;
                            iIdx++
                        ) {
                            const field = section.images[iIdx]
                            if (field.id === id) {
                                return {
                                    parent: section,
                                    idx: iIdx,
                                    childName: 'images',
                                }
                            }
                        }
                    } else if (section.texts) {
                        for (
                            let tIdx = 0;
                            tIdx < section.texts.length;
                            tIdx++
                        ) {
                            const field = section.texts[tIdx]
                            if (field.id === id) {
                                return {
                                    parent: section,
                                    idx: tIdx,
                                    childName: 'texts',
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return { parent: null, idx: null, childName: null }
}
