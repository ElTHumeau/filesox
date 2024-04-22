import {API} from "../../config/axios.ts";
import {CreateUserType, permissionsSchemaType, UpdateUserType, usersSchemaType} from "../../types/api/userType.ts";

export const getAdminUsers = async (page: number = 1) => {
    const response = await API.get('/admin/users?page=' + page)
    return usersSchemaType.parse(response.data)
}

export const getAdminPermission = async () => {
    const response = await API.get('/admin/permissions')
    return permissionsSchemaType.parse(response.data)
}

export const createUser = async (data: CreateUserType) => {
    await API.post('/admin/users/create', data)
}

export const updateUser = async (data: UpdateUserType) => {
    await API.post('/admin/users/update/' + data.id, data)
}

export const deleteUser = async (id: number) => {
    await API.delete('/admin/users/delete/' + id)
}