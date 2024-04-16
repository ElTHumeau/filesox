import {API} from "../config/axios.ts";
import {z} from "zod";
import {FormFields} from "../view/profile/partials/EditProfileInformation.tsx";

const logsSchema = z.object({
    total: z.number(),
    total_pages: z.number(),
    current_page: z.number(),
    per_page: z.number(),
    from: z.number(),
    to: z.number(),
    data: z.array(z.object({
        id: z.number(),
        action: z.string(),
        subject: z.string(),
        created_at: z.string(),
        username: z.string().nullable(),
    })),
})

export const getLogsProfile = async (page: number = 1) => {
    const response = await API.get('/profile/logs?page=' + page)
    return logsSchema.parse(response.data)
}

const profileSchema = z.object({
    id: z.number(),
    name: z.string(),
    email: z.string(),
    file_path: z.string(),
    permissions: z.array(z.string()),
})

export const getProfileInformation = async (setUser: any) => {
    const response = await API.get('/profile')
    console.log(response.data)
    let data  = profileSchema.parse(response.data)
    setUser(data)
}

export const getSharedProfile = async () => {
    const response = await API.get('/profile/shared')
    return response.data
}

// Methode POST
export const postProfileInformation = async (data: FormFields) => {
    const {data: response} = await API.post('/profile/update', data)
    return response.data
}