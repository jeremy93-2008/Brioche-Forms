import {
    answersTable,
    choicesTable,
    foldersTable,
    formsTable,
    imagesTable,
    multipleChoicesTable,
    notificationsTable,
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

export type IForm = typeof formsTable.$inferSelect
export type ITagsForms = typeof tagsFormsTable.$inferSelect
export type ITags = typeof tagsTable.$inferSelect
export type IFolders = typeof foldersTable.$inferSelect
export type ISections = typeof sectionsTable.$inferSelect
export type ITexts = typeof textsTable.$inferSelect
export type IImages = typeof imagesTable.$inferSelect
export type IVideos = typeof videosTable.$inferSelect
export type IQuestions = typeof questionsTable.$inferSelect
export type IChoices = typeof choicesTable.$inferSelect
export type IResponses = typeof responsesTable.$inferSelect
export type IMultipleChoices = typeof multipleChoicesTable.$inferSelect
export type IAnswers = typeof answersTable.$inferSelect
export type ISharedForms = typeof sharedFormsTable.$inferSelect
export type ISharedFolders = typeof sharedFoldersTable.$inferSelect
export type INotifications = typeof notificationsTable.$inferSelect
export type ISharedNotifications = typeof sharedNotificationsTable.$inferSelect
