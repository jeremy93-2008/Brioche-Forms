import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const formsTable = sqliteTable('forms', {
    id: text('id').primaryKey(),
    title: text('title').notNull(),
    createdAt: int('created_at').notNull(),
    updatedAt: int('updated_at').notNull(),
    author_id: text('author_id').notNull(),
    author_name: text('author_name').notNull().default(''),
    backgroundColor: text('background_color').notNull(),
    folder_id: text('folder_id').references(() => foldersTable.id, {
        onDelete: 'cascade',
    }),
    description: text('description'),
    backgroundImage: text('background_image'),
    headerImage: text('header_image'),
    formStyle: text('form_style').notNull().default('brioche'), // e.g., 'standard', 'brioche'
    theme: text('theme').notNull().default('dark'), // e.g., 'light', 'dark', 'system'
    isPublished: int('is_published').notNull(),
    isDraft: int('is_draft').notNull(),
    canModifyResponses: int('can_modify_responses').notNull(),
    mustLoginToRespond: int('must_login_to_respond').notNull().default(0),
    responseLimit: int('response_limit'),
    responseLimitDate: int('response_limit_date'),
    acceptResponses: int('accept_responses').notNull().default(1),
    messageIfNotAcceptResponses: text('message_if_not_accept_responses'),
    messageAfterSubmit: text('message_after_submit'),
    messageIfLimitReached: text('message_if_limit_reached'),
    shuffleQuestions: int('shuffle_questions').notNull().default(0),
    savePartialResponses: int('save_partial_responses').notNull().default(0),
    questionnaireDisplayMode: text('questionnaire_display_mode')
        .notNull()
        .default('all_pages'), // e.g., 'all_pages', 'page_by_page', 'single_section'
})

export const tagsFormsTable = sqliteTable('tags_forms', {
    id: text('id').primaryKey(),
    tag_id: text('tag_id')
        .notNull()
        .references(() => tagsTable.id),
    form_id: text('form_id')
        .notNull()
        .references(() => formsTable.id),
})

export const tagsTable = sqliteTable('tags', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    color: text('color').notNull(),
})

export const pagesTable = sqliteTable('pages', {
    id: text('id').primaryKey(),
    form_id: text('form_id')
        .notNull()
        .references(() => formsTable.id, {
            onDelete: 'cascade',
        }),
    title: text('title').notNull(),
    order: text('order').notNull(),
    conditions: text('conditions'),
})

export const foldersTable = sqliteTable('folders', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    createdAt: int('created_at').notNull(),
    updatedAt: int('updated_at').notNull(),
    author_id: text('author_id').notNull(),
    author_name: text('author_name').notNull().default(''),
})

export const sectionsTable = sqliteTable('sections', {
    id: text('id').primaryKey(),
    title: text('title').notNull(),
    description: text('description'),
    order: text('order').notNull(),
    conditions: text('conditions'),
    page_id: text('page_id').references(() => pagesTable.id, {
        onDelete: 'cascade',
    }),
    form_id: text('form_id')
        .notNull()
        .references(() => formsTable.id, {
            onDelete: 'cascade',
        }),
})

export const textsTable = sqliteTable('texts', {
    id: text('id').primaryKey(),
    section_id: text('section_id')
        .notNull()
        .references(() => sectionsTable.id, {
            onDelete: 'cascade',
        }),
    form_id: text('form_id')
        .notNull()
        .references(() => formsTable.id, {
            onDelete: 'cascade',
        }),
    content: text('content').notNull(),
    order: text('order').notNull(),
})

export const imagesTable = sqliteTable('images', {
    id: text('id').primaryKey(),
    section_id: text('section_id')
        .notNull()
        .references(() => sectionsTable.id, {
            onDelete: 'cascade',
        }),
    form_id: text('form_id')
        .notNull()
        .references(() => formsTable.id, {
            onDelete: 'cascade',
        }),
    url: text('url').notNull(),
    caption: text('caption'),
    order: text('order').notNull(),
})

export const videosTable = sqliteTable('videos', {
    id: text('id').primaryKey(),
    section_id: text('section_id')
        .notNull()
        .references(() => sectionsTable.id, {
            onDelete: 'cascade',
        }),
    form_id: text('form_id')
        .notNull()
        .references(() => formsTable.id, {
            onDelete: 'cascade',
        }),
    url: text('url').notNull(),
    caption: text('caption'),
    order: text('order').notNull(),
})

/* Question types:
- single_choice
- multiple_choice
- short_answer
- long_answer
- short_answer:date
- short_answer:phone
- short_answer:email
- short_answer:rating
- short_answer:opinion_scale
*/

export const questionsTable = sqliteTable('questions', {
    id: text('id').primaryKey(),
    section_id: text('section_id')
        .notNull()
        .references(() => sectionsTable.id, {
            onDelete: 'cascade',
        }),
    form_id: text('form_id')
        .notNull()
        .references(() => formsTable.id, {
            onDelete: 'cascade',
        }),
    name: text('name').notNull(),
    content: text('content').notNull(),
    type: text('type').notNull(),
    is_required: int('is_required').notNull(),
    order: text('order').notNull(),
})

export const choicesTable = sqliteTable('choices', {
    id: text('id').primaryKey(),
    question_id: text('question_id')
        .notNull()
        .references(() => questionsTable.id, {
            onDelete: 'cascade',
        }),
    form_id: text('form_id')
        .notNull()
        .references(() => formsTable.id, {
            onDelete: 'cascade',
        }),
    content: text('content').notNull(),
    is_free_text: int('is_free_text').notNull().default(0),
    order: text('order').notNull(),
})

export const responsesTable = sqliteTable('responses', {
    id: text('id').primaryKey(),
    form_id: text('form_id')
        .notNull()
        .references(() => formsTable.id, {
            onDelete: 'cascade',
        }),
    respondent_id: text('respondent_id').notNull(),
    respondent_name: text('respondent_name').notNull().default(''),
    submitted_at: int('submitted_at').notNull(),
})

export const multipleChoicesTable = sqliteTable('multiple_choices', {
    id: text('id').primaryKey(),
    answer_id: text('answer_id')
        .notNull()
        .references(() => answersTable.id, {
            onDelete: 'cascade',
        }),
    choice_id: text('choice_id')
        .notNull()
        .references(() => choicesTable.id, {
            onDelete: 'cascade',
        }),
    form_id: text('form_id')
        .notNull()
        .references(() => formsTable.id, {
            onDelete: 'cascade',
        }),
})

export const answersTable = sqliteTable('answers', {
    id: text('id').primaryKey(),
    response_id: text('response_id')
        .notNull()
        .references(() => responsesTable.id, {
            onDelete: 'cascade',
        }),
    question_id: text('question_id')
        .notNull()
        .references(() => questionsTable.id, {
            onDelete: 'cascade',
        }),
    choice_id: text('choice_id').references(() => choicesTable.id),
    choice_free_text: text('choice_free_text'),
    short_answer: text('short_answer'),
    long_answer: text('long_answer'),
    date_answer: int('date_answer'),
    form_id: text('form_id')
        .notNull()
        .references(() => formsTable.id, {
            onDelete: 'cascade',
        }),
})

export const sharedFormsTable = sqliteTable('shared_forms', {
    id: text('id').primaryKey(),
    form_id: text('form_id')
        .notNull()
        .references(() => formsTable.id),
    shared_with_user_id: text('shared_with_user_id').notNull(),
    is_read_allowed: int('is_read_allowed').notNull(),
    is_write_allowed: int('is_write_allowed').notNull(),
    is_delete_allowed: int('is_delete_allowed').notNull(),
    is_share_allowed: int('is_share_allowed').notNull(),
    is_admin_allowed: int('is_admin_allowed').notNull(),
})

export const sharedFoldersTable = sqliteTable('shared_folders', {
    id: text('id').primaryKey(),
    folder_id: text('folder_id')
        .notNull()
        .references(() => foldersTable.id),
    shared_with_user_id: text('shared_with_user_id').notNull(),
    is_read_allowed: int('is_read_allowed').notNull(),
    is_write_allowed: int('is_write_allowed').notNull(),
    is_delete_allowed: int('is_delete_allowed').notNull(),
    is_share_allowed: int('is_share_allowed').notNull(),
    is_admin_allowed: int('is_admin_allowed').notNull(),
})

export const notificationsTable = sqliteTable('notifications', {
    id: text('id').primaryKey(),
    user_id: text('user_id').notNull(),
    content: text('content').notNull(),
    action_type: text('action_type').notNull(),
    is_read: int('is_read').notNull(),
    created_at: int('created_at').notNull(),
    form_id: text('form_id').references(() => formsTable.id),
    folder_id: text('folder_id').references(() => foldersTable.id),
})

export const sharedNotificationsTable = sqliteTable('shared_notifications', {
    id: text('id').primaryKey(),
    notification_id: text('notification_id')
        .notNull()
        .references(() => notificationsTable.id),
    shared_with_user_id: text('shared_with_user_id').notNull(),
})

export const mediaTable = sqliteTable('media', {
    id: text('id').primaryKey(),
    url: text('url').notNull(),
    type: text('type').notNull(), // e.g., 'image', 'video'
    used_in_form_id: text('used_in_form_id').references(() => formsTable.id),
    uploaded_at: int('uploaded_at').notNull(),
    uploaded_by_user_id: text('uploaded_by_user_id').notNull(),
})
