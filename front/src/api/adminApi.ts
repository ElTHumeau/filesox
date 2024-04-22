import {API} from "../config/axios.ts";
import {adminLogsSchemaType} from "../types/api/adminType.ts";

export const getAdminLogs = async (page: number = 1) => {
    const response = await API.get('/admin/logs?page=' + page)
    return adminLogsSchemaType.parse(response.data)
}