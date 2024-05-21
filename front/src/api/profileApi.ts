import {useAxios} from "../config/axios.ts";
import {
    logsProfileSchemaType, profileSchemaType,
    UpdatePasswordProfileType,
    UpdateProfileType
} from "../types/api/userType.ts";

export const getLogsProfile = async (page: number = 1) => {
    const API = useAxios()
    const response = await API.get('/profile/logs?page=' + page)
    return logsProfileSchemaType.parse(response.data)
}

export const getProfileInformation = async (setUser: any) => {
    const API = useAxios()
    const response = await API.get('/profile')
    const data  = profileSchemaType.parse(response.data)
    setUser(data)
}

export const getSharedProfile = async () => {
    const API = useAxios()
    const response = await API.get('/profile/shared')
    return response.data
}

// Methode POST
export const postProfileInformation = async (data: UpdateProfileType) => {
    const API = useAxios()
    const {data: response} = await API.post('/profile/update', data)
    return response.data
}


export const postProfilePassword = async (data: UpdatePasswordProfileType) => {
    const API = useAxios()
    const {data: response} = await API.post('/profile/update/password', data)
    return response.data
}

export const postUpdateLayout = async ({name, email, layout}: {name: string, email: string, layout: boolean}) => {
    const API = useAxios()
    return await API.post('/profile/update', {name, email, layout})
}