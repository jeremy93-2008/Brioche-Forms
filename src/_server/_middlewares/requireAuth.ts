import { stackServerApp } from '@/_stack/server'
import { CurrentServerUser } from '@stackframe/stack'
import { IMapCtx } from '@/_server/__internals/types'

export function requireAuth<TCtx extends IAuthCtx>() {
    return async <TData>(_data: TData, ctx: IMapCtx<TCtx>) => {
        const user = await stackServerApp.getUser()
        if (!user) throw new Error('User not authenticated')
        ctx.set('user', user)
    }
}

export type IAuthCtx = {
    user: CurrentServerUser
}
