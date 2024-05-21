import {useAxios} from "../../config/axios.ts";
import {CreateUserType, permissionsSchemaType, UpdateUserType, usersSchemaType} from "../../types/api/userType.ts";

export const getAdminUsers = async (page: number = 1) => {
    const API = useAxios()
    const response = await API.get('/admin/users?page=' + page)
    return usersSchemaType.parse(response.data)
}

export const getAdminPermission = async () => {
    const API = useAxios()
    const response = await API.get('/admin/permissions')
    return permissionsSchemaType.parse(response.data)
}

export const createUser = async (data: CreateUserType) => {
    const API = useAxios()
    await API.post('/admin/users/create', data)
}

export const updateUser = async (data: UpdateUserType) => {
    const API = useAxios()
    await API.post('/admin/users/update/' + data.id, data)
}

export const deleteUser = async (id: number) => {
    const API = useAxios()
    await API.delete('/admin/users/delete/' + id)
}