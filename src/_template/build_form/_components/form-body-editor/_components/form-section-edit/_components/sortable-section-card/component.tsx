'use client'

import { DragHandle } from '@/_components/dnd/drag-handle'
import { SortableItem } from '@/_components/dnd/sortable-item'
import { Card } from '@/_components/ui/card'
import { IFullForm } from '@/_server/domains/form/getFullForms'
import { FormSectionHeaderComponent } from '@/_template/build_form/_components/form-body-editor/_components/form-section-edit/_components/form-section-header/component'
import { FormSectionImageEditComponent } from '@/_template/build_form/_components/form-body-editor/_components/form-section-edit/_components/form-section-image-edit/component'
import { FormSectionQuestionEditComponent } from '@/_template/build_form/_components/form-body-editor/_components/form-section-edit/_components/form-section-question-edit/component'
import { FormSectionTextEditComponent } from '@/_template/build_form/_components/form-body-editor/_components/form-section-edit/_components/form-section-text-edit/component'
import { FormSectionVideoEditComponent } from '@/_template/build_form/_components/form-body-editor/_components/form-section-edit/_components/form-section-video-edit/component'
import { ITypeOfSection } from '@/_template/build_form/_components/form-body-editor/_components/form-section-edit/component'
import { useMemo } from 'react'

interface ISortableSectionCardProps {
    data: IFullForm['pages'][0]['sections'][0]
    formId: string
}

/**
 * Sortable wrapper for a section card (vertical drag and drop).
 * Includes a drag handle in the top-left corner visible on hover.
 */
export function SortableSectionCard({
    data,
    formId,
}: ISortableSectionCardProps) {
    const typeOfSection: ITypeOfSection = useMemo(() => {
        if (data.questions.length > 0) return 'question'
        if (data.texts.length > 0) return 'text'
        if (data.images.length > 0) return 'image'
        if (data.videos.length > 0) return 'video'
        return null
    }, [data])

    return (
        <SortableItem id={data.id} useHandle>
            <Card className="py-0 mb-2 group/section">
                <div className="mx-4 my-4 py-2 px-2 relative">
                    {/* Drag Handle - positioned at top-left, visible on hover */}
                    <div className="absolute -left-2 top-0 opacity-0 group-hover/section:opacity-100 transition-opacity">
                        <DragHandle id={data.id} iconSize={16} />
                    </div>

                    <FormSectionHeaderComponent data={data} formId={formId} />
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
                        <FormSectionImageEditComponent data={data.images[0]} />
                    )}
                    {typeOfSection === 'video' && (
                        <FormSectionVideoEditComponent data={data.videos[0]} />
                    )}
                </div>
            </Card>
        </SortableItem>
    )
}