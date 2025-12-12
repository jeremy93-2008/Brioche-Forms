import { IMapCtx } from '@/_server/__internals/types'
import {
    IPermissionCtx,
    IRoles,
} from '@/_server/_middlewares/requireResourceAccess'
import { CurrentServerUser } from '@stackframe/stack'
import { and, eq } from 'drizzle-orm'
import { db } from '../../../../../db'
import { formsTable } from '../../../../../db/tables'

interface IFormOwnerProps<TCtx extends IPermissionCtx> {
    form_id: string
    user: CurrentServerUser
    roleList: IRoles[]
    ctx: IMapCtx<TCtx>
}

export async function isFormOwner<TCtx extends IPermissionCtx>(
    params: IFormOwnerProps<TCtx>
) {
    const { form_id, user, roleList, ctx } = params

    const own_form = await db
        .select()
        .from(formsTable)
        .where(
            and(eq(formsTable.id, form_id), eq(formsTable.author_id, user?.id))
        )

    if (own_form.length > 0) {
        ctx.set('permissions', {
            canRead: true,
            canWrite: true,
            canDelete: true,
            canShare: true,
            canAdmin: true,
            isOwner: true,
            roles: roleList,
        })
        return true
    }

    return false
}
