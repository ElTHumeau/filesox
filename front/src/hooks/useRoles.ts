export function useRoles() {
    const  getPermissions = (userPermissions: string[], formPermissions: number[], permissions : any) => {
        const userPermissionIds = permissions.map((permission: any) => {
            if (userPermissions.includes(permission.name)) {
                return permission.id
            }
        })

        console.log(formPermissions)
        if (typeof formPermissions !== 'undefined' && formPermissions.length === 0) {
            return userPermissionIds.filter((permissionId: number | undefined) => permissionId !== undefined)
        }

        return formPermissions
    }

    return {getPermissions}
}