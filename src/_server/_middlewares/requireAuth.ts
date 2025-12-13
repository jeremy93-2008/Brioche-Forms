import { IMapCtx } from '@/_server/__internals/types'
import { stackServerApp } from '@/_stack/server'
import { CurrentServerUser } from '@stackframe/stack'

export function requireAuth<TCtx extends IAuthCtx>() {
    return async function executeAuth<TData>(_data: TData, ctx: IMapCtx<TCtx>) {
        const user = await stackServerApp.getUser()
        if (!user) throw new Error('User not authenticated')
        ctx.set('user', user)
    }
}

export type IAuthCtx = {
    user: CurrentServerUser
}
