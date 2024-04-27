import {API} from "../config/axios.ts";
import {
    logsProfileSchemaType, profileSchemaType,
    UpdatePasswordProfileType,
    UpdateProfileType
} from "../types/api/userType.ts";


export const getLogsProfile = async (page: number = 1) => {
    const response = await API.get('/profile/logs?page=' + page)
    return logsProfileSchemaType.parse(response.data)
}

export const getProfileInformation = async (setUser: any) => {
    const response = await API.get('/profile')
    const data  = profileSchemaType.parse(response.data)
    setUser(data)
}

export const getSharedProfile = async () => {
    const response = await API.get('/profile/shared')
    return response.data
}

// Methode POST
export const postProfileInformation = async (data: UpdateProfileType) => {
    const {data: response} = await API.post('/profile/update', data)
    return response.data
}


export const postProfilePassword = async (data: UpdatePasswordProfileType) => {
    const {data: response} = await API.post('/profile/update/password', data)
    return response.data
}

export const postUpdateLayout = async ({name, email, layout}: {name: string, email: string, layout: boolean}) => {
    return await API.post('/profile/update', {name, email, layout})
}