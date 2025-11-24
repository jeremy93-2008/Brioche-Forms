'use server'
import { z } from 'zod'
import { v7 as uuidv7 } from 'uuid'
import { db } from '../../../db'
import { formsTable } from '../../../db/schema'
import { stackServerApp } from '@/_stack/server'

const schema = z.object({
    title: z.string().min(3).max(255).optional().nullable(),
    description: z.string().max(1000).optional().nullable(),
})

export async function createFormAction(formData: FormData) {
    const validatedFields = schema.safeParse({
        title: formData.get('title'),
        description: formData.get('description'),
    })

    if (!validatedFields.success) {
        const errorFormData = new FormData()
        errorFormData.set(
            'errors',
            JSON.stringify(validatedFields.error.message)
        )
        return errorFormData
    }

    const user = await stackServerApp.getUser()

    if (!user) throw new Error('User not authenticated')

    const form_id = uuidv7()

    const result = await db.insert(formsTable).values({
        id: form_id,
        title: validatedFields.data.title || 'Untitled Form',
        description: validatedFields.data.description || '',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        backgroundColor: '#FFFFFF',
        isDraft: 1,
        isPublished: 0,
        canModifyResponses: 0,
        author_id: user.id,
    })

    const resultFormData = new FormData()
    resultFormData.set('id', form_id)
    resultFormData.set('rows', JSON.stringify(result.rows))

    return resultFormData
}
