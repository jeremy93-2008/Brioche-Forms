export type DirtyEntryType = 'text' | 'image' | 'video' | 'question'

export interface IDirtyEntry {
    type: DirtyEntryType
    id: string
    formId: string
    sectionId: string
    payload: Record<string, unknown>
}

export interface IBulkUpdatePayload {
    form_id: string
    texts?: Array<Record<string, unknown>>
    images?: Array<Record<string, unknown>>
    videos?: Array<Record<string, unknown>>
    questions?: Array<Record<string, unknown>>
}
