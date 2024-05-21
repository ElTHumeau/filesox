import {adminLogsSchemaType} from "../types/api/adminType.ts";
import axios from "axios";

export const getAdminLogs = async (page: number = 1) => {
    const response = await axios.get('/admin/logs?page=' + page)
    return adminLogsSchemaType.parse(response.data)
}