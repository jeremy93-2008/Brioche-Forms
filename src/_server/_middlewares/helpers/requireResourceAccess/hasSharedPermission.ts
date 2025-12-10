import { IRoles } from '@/_server/_middlewares/requireResourceAccess'
import { CurrentServerUser } from '@stackframe/stack'
import { and, eq } from 'drizzle-orm'
import { db } from '../../../../../db'
import { sharedFoldersTable, sharedFormsTable } from '../../../../../db/tables'

interface IHasSharedPermissionParams {
    folder_id: string
    form_id: string
    user: CurrentServerUser
    roleList: IRoles[]
}

export async function hasSharedPermission(params: IHasSharedPermissionParams) {
    const { folder_id, form_id, user, roleList } = params

    const shared_permissions_folder = await db
        .select()
        .from(sharedFoldersTable)
        .where(
            and(
                eq(sharedFoldersTable.folder_id, folder_id ?? ''),
                eq(sharedFoldersTable.shared_with_user_id, user?.id)
            )
        )
        .limit(1)

    const shared_permissions_form = await db
        .select()
        .from(sharedFormsTable)
        .where(
            and(
                eq(sharedFormsTable.form_id, form_id ?? ''),
                eq(sharedFormsTable.shared_with_user_id, user?.id)
            )
        )
        .limit(1)

    if (
        shared_permissions_folder.length === 0 &&
        shared_permissions_form.length === 0
    ) {
        return false
    }

    const permissions =
        shared_permissions_form.length > 0
            ? shared_permissions_form[0]
            : shared_permissions_folder[0]

    const hasPermission = roleList.every((role) => {
        switch (role) {
            case 'read':
                return permissions.is_read_allowed
            case 'write':
                return permissions.is_write_allowed
            case 'delete':
                return permissions.is_delete_allowed
            case 'share':
                return permissions.is_share_allowed
            case 'admin':
                return permissions.is_admin_allowed
            case 'owner':
                return false
            default:
                return false
        }
    })

    return hasPermission
}
