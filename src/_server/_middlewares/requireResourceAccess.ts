import { IMapCtx } from '@/_server/_internals/types'
import { hasSharedPermission } from '@/_server/_middlewares/helpers/requireResourceAccess/hasSharedPermission'
import { isFormOwner } from '@/_server/_middlewares/helpers/requireResourceAccess/isFormOwner'
import { isRoleListEmpty } from '@/_server/_middlewares/helpers/requireResourceAccess/isRoleListEmpty'
import { stackServerApp } from '@/_stack/server'

export function requireResourceAccess<TCtx extends IPermissionCtx>(
    roles: IRoles | IRoles[],
    opts?: IOpts
) {
    return async <TData extends Record<string, any>>(
        data: TData,
        ctx: IMapCtx<TCtx>
    ) => {
        const user = await stackServerApp.getUser()

        const folder_id = (data[opts?.folder_id_field || 'folder_id'] ??
            '') as string
        const form_id = (data[opts?.form_id_field || 'form_id'] ?? '') as string

        if (!form_id && !folder_id) {
            return {
                status: 'error',
                error: {
                    message:
                        'Form ID or Folder ID must be provided to check permissions',
                },
            } as const
        }

        if (!user) throw new Error('User not authenticated')

        const roleList = Array.isArray(roles) ? roles : [roles]

        if (isRoleListEmpty({ roles: roleList, ctx })) {
            return {
                status: 'idle',
            } as const
        }

        if (await isFormOwner({ form_id, user, roleList, ctx })) {
            return {
                status: 'idle',
            } as const
        }

        if (
            !(await hasSharedPermission({ folder_id, form_id, user, roleList }))
        ) {
            return {
                status: 'error',
                error: {
                    message: 'Insufficient permissions to access this form',
                },
            } as const
        }
    }
}

export type IPermissionCtx = {
    permissions: IPermissions
}

export type IPermissions = {
    canRead: boolean
    canWrite: boolean
    canDelete: boolean
    canShare: boolean
    canAdmin: boolean
    isOwner: boolean
    roles: IRoles[]
}

export type IRoles = 'read' | 'write' | 'delete' | 'share' | 'admin' | 'owner'

type IOpts = {
    form_id_field?: string
    folder_id_field?: string
}
