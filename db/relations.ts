import { relations } from 'drizzle-orm'
import {
    answersTable,
    choicesTable,
    foldersTable,
    formsTable,
    imagesTable,
    mediaTable,
    multipleChoicesTable,
    notificationsTable,
    pagesTable,
    questionsTable,
    responsesTable,
    sectionsTable,
    sharedFoldersTable,
    sharedFormsTable,
    sharedNotificationsTable,
    tagsFormsTable,
    tagsTable,
    textsTable,
    videosTable,
} from './tables'

// FORMS ↔ FOLDERS / TAGS / PAGES / RESPONSES / SHARED / NOTIFICATIONS

export const formsRelations = relations(formsTable, ({ one, many }) => ({
    folder: one(foldersTable, {
        fields: [formsTable.folder_id],
        references: [foldersTable.id],
    }),
    tagsForms: many(tagsFormsTable),
    pages: many(pagesTable),
    responses: many(responsesTable),
    sharedForms: many(sharedFormsTable),
    notifications: many(notificationsTable),
}))

export const foldersRelations = relations(foldersTable, ({ many }) => ({
    forms: many(formsTable),
    sharedFolders: many(sharedFoldersTable),
    notifications: many(notificationsTable),
}))

// TAGS ↔ TAGS_FORMS ↔ FORMS

export const tagsRelations = relations(tagsTable, ({ many }) => ({
    tagsForms: many(tagsFormsTable),
}))

export const tagsFormsRelations = relations(tagsFormsTable, ({ one }) => ({
    tag: one(tagsTable, {
        fields: [tagsFormsTable.tag_id],
        references: [tagsTable.id],
    }),
    form: one(formsTable, {
        fields: [tagsFormsTable.form_id],
        references: [formsTable.id],
    }),
}))

// SECTIONS ↔ FORMS / PAGES / TEXTS / IMAGES / VIDEOS / QUESTIONS

export const sectionsRelations = relations(sectionsTable, ({ one, many }) => ({
    page: one(pagesTable, {
        fields: [sectionsTable.page_id],
        references: [pagesTable.id],
    }),
    texts: many(textsTable),
    images: many(imagesTable),
    videos: many(videosTable),
    questions: many(questionsTable),
}))

export const pagesRelations = relations(pagesTable, ({ one, many }) => ({
    form: one(formsTable, {
        fields: [pagesTable.form_id],
        references: [formsTable.id],
    }),
    sections: many(sectionsTable),
}))

export const textsRelations = relations(textsTable, ({ one }) => ({
    section: one(sectionsTable, {
        fields: [textsTable.section_id],
        references: [sectionsTable.id],
    }),
}))

export const imagesRelations = relations(imagesTable, ({ one }) => ({
    section: one(sectionsTable, {
        fields: [imagesTable.section_id],
        references: [sectionsTable.id],
    }),
}))

export const videosRelations = relations(videosTable, ({ one }) => ({
    section: one(sectionsTable, {
        fields: [videosTable.section_id],
        references: [sectionsTable.id],
    }),
}))

// QUESTIONS ↔ SECTIONS / CHOICES / ANSWERS

export const questionsRelations = relations(
    questionsTable,
    ({ one, many }) => ({
        section: one(sectionsTable, {
            fields: [questionsTable.section_id],
            references: [sectionsTable.id],
        }),
        choices: many(choicesTable),
        answers: many(answersTable),
    })
)

export const choicesRelations = relations(choicesTable, ({ one, many }) => ({
    question: one(questionsTable, {
        fields: [choicesTable.question_id],
        references: [questionsTable.id],
    }),
    multipleChoices: many(multipleChoicesTable),
    answers: many(answersTable),
}))

// RESPONSES ↔ FORMS / ANSWERS / MULTIPLE_CHOICES

export const responsesRelations = relations(
    responsesTable,
    ({ one, many }) => ({
        form: one(formsTable, {
            fields: [responsesTable.form_id],
            references: [formsTable.id],
        }),
        answers: many(answersTable),
    })
)

export const answersRelations = relations(answersTable, ({ one, many }) => ({
    response: one(responsesTable, {
        fields: [answersTable.response_id],
        references: [responsesTable.id],
    }),
    question: one(questionsTable, {
        fields: [answersTable.question_id],
        references: [questionsTable.id],
    }),
    choice: one(choicesTable, {
        fields: [answersTable.choice_id],
        references: [choicesTable.id],
    }),
    multipleChoices: many(multipleChoicesTable),
}))

export const multipleChoicesRelations = relations(
    multipleChoicesTable,
    ({ one }) => ({
        answer: one(answersTable, {
            fields: [multipleChoicesTable.answer_id],
            references: [answersTable.id],
        }),
        choice: one(choicesTable, {
            fields: [multipleChoicesTable.choice_id],
            references: [choicesTable.id],
        }),
    })
)

// SHARED FORMS / FOLDERS

export const sharedFormsRelations = relations(sharedFormsTable, ({ one }) => ({
    form: one(formsTable, {
        fields: [sharedFormsTable.form_id],
        references: [formsTable.id],
    }),
}))

export const sharedFoldersRelations = relations(
    sharedFoldersTable,
    ({ one }) => ({
        folder: one(foldersTable, {
            fields: [sharedFoldersTable.folder_id],
            references: [foldersTable.id],
        }),
    })
)

// NOTIFICATIONS ↔ FORMS / FOLDERS / SHARED_NOTIFICATIONS

export const notificationsRelations = relations(
    notificationsTable,
    ({ one, many }) => ({
        form: one(formsTable, {
            fields: [notificationsTable.form_id],
            references: [formsTable.id],
        }),
        folder: one(foldersTable, {
            fields: [notificationsTable.folder_id],
            references: [foldersTable.id],
        }),
        sharedNotifications: many(sharedNotificationsTable),
    })
)

export const sharedNotificationsRelations = relations(
    sharedNotificationsTable,
    ({ one }) => ({
        notification: one(notificationsTable, {
            fields: [sharedNotificationsTable.notification_id],
            references: [notificationsTable.id],
        }),
    })
)

// MEDIA TABLES ↔ FORMS

export const mediaRelations = relations(mediaTable, ({ one }) => ({
    form: one(formsTable, {
        fields: [mediaTable.used_in_form_id],
        references: [formsTable.id],
    }),
}))
