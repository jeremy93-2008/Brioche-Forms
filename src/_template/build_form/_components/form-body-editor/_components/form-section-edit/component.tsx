import { DragHandler } from '@/_components/dnd/dragHandle'
import { SortableItemContext } from '@/_components/dnd/sortableItem'
import { Card } from '@/_components/ui/card'
import { IFullForm } from '@/_server/domains/form/getFullForms'
import { FormSectionHeaderComponent } from '@/_template/build_form/_components/form-body-editor/_components/form-section-edit/_components/form-section-header/component'
import { FormSectionImageEditComponent } from '@/_template/build_form/_components/form-body-editor/_components/form-section-edit/_components/form-section-image-edit/component'
import { FormSectionQuestionEditComponent } from '@/_template/build_form/_components/form-body-editor/_components/form-section-edit/_components/form-section-question-edit/component'
import { FormSectionTextEditComponent } from '@/_template/build_form/_components/form-body-editor/_components/form-section-edit/_components/form-section-text-edit/component'
import { FormSectionVideoEditComponent } from '@/_template/build_form/_components/form-body-editor/_components/form-section-edit/_components/form-section-video-edit/component'
import { EllipsisIcon } from 'lucide-react'
import { use, useMemo } from 'react'

export type ITypeOfSection = 'question' | 'text' | 'image' | 'video' | null

interface IFormSectionEditComponentProps {
    data: IFullForm['pages'][0]['sections'][0]
    formId: string
}

export function FormSectionEditComponent(
    props: IFormSectionEditComponentProps
) {
    const { data, formId } = props

    const sortableItem = use(SortableItemContext)

    const typeOfSection: ITypeOfSection = useMemo(() => {
        if (data.questions.length > 0) return 'question'
        if (data.texts.length > 0) return 'text'
        if (data.images.length > 0) return 'image'
        if (data.videos.length > 0) return 'video'
        return null
    }, [data])

    return (
        <Card className="group/section py-0 mb-2 group/section">
            <div className="mx-4 my-4 py-2 px-2 relative">
                <DragHandler
                    className="opacity-0 group-hover/section:opacity-100 absolute top-0 -left-2 transition-opacity"
                    iconClassName="w-5 h-5 stroke-secondary"
                />
                <section className="ml-2">
                    <FormSectionHeaderComponent data={data} formId={formId} />
                </section>
                {sortableItem?.data.sortable.containerId === 'sections' &&
                    !sortableItem?.isDragging && (
                        <>
                            {typeOfSection === 'question' && (
                                <FormSectionQuestionEditComponent
                                    data={data.questions[0]}
                                />
                            )}
                            {typeOfSection === 'text' && (
                                <FormSectionTextEditComponent
                                    data={data.texts[0]}
                                    sectionId={data.id}
                                    formId={formId}
                                />
                            )}
                            {typeOfSection === 'image' && (
                                <FormSectionImageEditComponent
                                    data={data.images[0]}
                                />
                            )}
                            {typeOfSection === 'video' && (
                                <FormSectionVideoEditComponent
                                    data={data.videos[0]}
                                />
                            )}
                        </>
                    )}
                {sortableItem?.data.sortable.containerId === 'sections' &&
                    sortableItem?.isDragging && (
                        <div>
                            <EllipsisIcon className="w-8 h-8 mx-auto mt-4 mb-6 stroke-secondary" />
                        </div>
                    )}
            </div>
        </Card>
    )
}
