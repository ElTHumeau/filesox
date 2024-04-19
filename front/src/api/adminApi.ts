import {z} from "zod";
import {API} from "../config/axios.ts";

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
        username: z.string(),
    })),
})

export const getAdminLogs = async (page: number = 1) => {
    const response = await API.get('/admin/logs?page=' + page)
    return logsSchema.parse(response.data)
}