import { IFullForm } from '@/_server/domains/form/getFullForms'

export function findFormObjectById(obj: IFullForm, id: string) {
    if (obj.id === id) {
        return obj
    }

    if (obj.pages) {
        for (const page of obj.pages) {
            if (page.id === id) {
                return page
            }

            if (page.sections) {
                for (const section of page.sections) {
                    if (section.id === id) {
                        return section
                    }
                    if (section.questions) {
                        for (const fields of section.questions) {
                            if (fields.id === id) {
                                return fields
                            }
                        }
                    } else if (section.videos) {
                        for (const fields of section.videos) {
                            if (fields.id === id) {
                                return fields
                            }
                        }
                    } else if (section.images) {
                        for (const fields of section.images) {
                            if (fields.id === id) {
                                return fields
                            }
                        }
                    } else if (section.texts) {
                        for (const fields of section.texts) {
                            if (fields.id === id) {
                                return fields
                            }
                        }
                    }
                }
            }
        }
    }

    return null
}
