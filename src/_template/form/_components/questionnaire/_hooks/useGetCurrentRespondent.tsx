import { SingleFormSelectedContext } from '@/_provider/forms/single-form-selected'
import { useUser } from '@stackframe/stack'
import { use } from 'react'
import { v7 as uuidv7 } from 'uuid'

export const BRIOCHE_GUEST_FORM_RESPONSE_KEY = 'brioche_guest_form_response'

export interface ICurrentRespondent {
    id: string
    name: string
}

export function useGetCurrentRespondent(): ICurrentRespondent | null {
    const { data } = use(SingleFormSelectedContext)
    const user = useUser()

    // If the user is logged in, we return the user info independent of the form settings
    if (user) return { id: user.id, name: user?.displayName || 'Guest User' }

    // For forms that require login to respond, we return null if not logged in
    if (data.mustLoginToRespond === 1) return null

    // For forms that do not require login, we create a guest user identifier
    const guestUser = localStorage.getItem(BRIOCHE_GUEST_FORM_RESPONSE_KEY)

    if (!guestUser) {
        const guestId = uuidv7()
        localStorage.setItem(
            BRIOCHE_GUEST_FORM_RESPONSE_KEY,
            JSON.stringify({
                id: guestId,
                name: `Guest_${guestId.substring(-8)}`,
            })
        )
    }

    return JSON.parse(
        localStorage.getItem(BRIOCHE_GUEST_FORM_RESPONSE_KEY) as string
    ) as ICurrentRespondent
}
