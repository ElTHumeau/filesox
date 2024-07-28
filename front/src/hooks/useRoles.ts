import {RoleEnum} from "../types/enum/RoleEnum.ts";

export function useRoles() {
    const  getPermissions = (userPermissions: string[], formPermissions: number[], permissions : any) => {
        const userPermissionIds = permissions.map((permission: any) => {
            if (userPermissions.includes(permission.name)) {
                return permission.id
            }
        })

        if (typeof formPermissions !== 'undefined' && formPermissions.length === 0) {
            return userPermissionIds.filter((permissionId: number | undefined) => permissionId !== undefined)
        }

        return formPermissions
    }

    const role = (permissions: string[], userPermissions : string[]) => {
        if (userPermissions.includes(RoleEnum.ADMIN)) {
            return true
        }

        for (let i = 0; i < permissions.length; i++) {
            if (userPermissions.includes(permissions[i])) {
                return true
            }
        }

        return false
    }

    return {getPermissions, role}
}