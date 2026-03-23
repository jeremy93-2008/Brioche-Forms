import { stackServerApp } from '@/_stack/server'

export async function getUserById(userId?: string) {
    if (!userId) throw new Error('No user id provided')
    const userFound = await stackServerApp.getUser(userId)
    if (!userFound) throw new Error('User not found')
    return userFound
}
