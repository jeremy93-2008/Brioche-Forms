import { IMapCtx } from '@/_server/__internals/types'
import { IPermissionCtx } from '@/_server/_middlewares/requireResourceAccess'

interface IsRoleListEmptyParams<TCtx extends IPermissionCtx> {
    roles: string[]
    ctx: IMapCtx<TCtx>
}

export function isRoleListEmpty<TCtx extends IPermissionCtx>({
    roles,
    ctx,
}: IsRoleListEmptyParams<TCtx>) {
    if (roles.length === 0) {
        ctx.set('permissions', {
            canRead: true,
            canWrite: true,
            canDelete: true,
            canShare: true,
            canAdmin: true,
            isOwner: true,
            roles: [],
        })
        return true
    }
    return false
}
