import {
    answersTable,
    choicesTable,
    foldersTable,
    formsTable,
    imagesTable,
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

export type IForm = typeof formsTable.$inferSelect
export type ITagsForm = typeof tagsFormsTable.$inferSelect
export type IFolder = typeof foldersTable.$inferSelect
export type ISection = typeof sectionsTable.$inferSelect
export type IPage = typeof pagesTable.$inferSelect
export type IQuestion = typeof questionsTable.$inferSelect
export type IChoice = typeof choicesTable.$inferSelect
export type IMultipleChoice = typeof multipleChoicesTable.$inferSelect
export type IText = typeof textsTable.$inferSelect
export type IVideo = typeof videosTable.$inferSelect
export type IImage = typeof imagesTable.$inferSelect
export type IResponse = typeof responsesTable.$inferSelect
export type IAnswer = typeof answersTable.$inferSelect
export type ITag = typeof tagsTable.$inferSelect
export type INotification = typeof notificationsTable.$inferSelect
export type ISharedNotification = typeof sharedNotificationsTable.$inferSelect
export type ISharedForms = typeof sharedFormsTable.$inferSelect
export type ISharedFolders = typeof sharedFoldersTable.$inferSelect
