import {z} from "zod";
import {API} from "../../config/axios.ts";

const userSchema = z.object({
    total: z.number(),
    total_pages: z.number(),
    current_page: z.number(),
    per_page: z.number(),
    from: z.number(),
    to: z.number(),
    data: z.array(z.object({
        id: z.number(),
        name: z.string(),
        email: z.string(),
        file_path: z.string(),
        created_at: z.string(),
        permissions: z.array(z.string()),
    })),
})

export const getAdminUsers = async (page: number = 1) => {
    const response = await API.get('/admin/users?page=' + page)
    return userSchema.parse(response.data)
}

const permissionSchema = z.array(z.object({
    id: z.number(),
    name: z.string(),
}))

export const getAdminPermission = async () => {
    const response = await API.get('/admin/permissions')
    return permissionSchema.parse(response.data)

}

interface CreateUser {
    name: string,
    email: string,
    password: string,
    confirm_password: string,
    file_path: string,
    permissions: number[]
}

export const createUser = async (data: CreateUser) => {
    await API.post('/admin/users/create', data)
}

interface UpdateUser {
    id: number,
    name: string,
    email: string,
    file_path: string,
    permissions: number[]
}

export const updateUser = async (data: UpdateUser) => {
    await API.post('/admin/users/update/' + data.id, data)
}

export const deleteUser = async (id: number) => {
    await API.delete('/admin/users/delete/' + id)
}