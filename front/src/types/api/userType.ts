import {z} from "zod";
import {paginationSchemaType} from "../components/paginationType.ts";

export interface UserType {
    id: number;
    name: string;
    email: string;
    file_path: string;
    created_at: string;
    permissions: string[];
}

export interface UpdatePasswordProfileType {
    password: string;
    confirm_password: string;
}

export interface UpdateProfileType {
    email: string;
    name: string;
}

export interface CreateUserType {
    id: number,
    name: string,
    email: string,
    file_path: string,
    permissions: number[]
}

export interface UpdateUserType {
    id: number,
    name: string,
    email: string,
    file_path: string,
    permissions: number[]
}

// schema zod
export const usersSchemaType = paginationSchemaType(
    z.array(z.object({
        id: z.number(),
        name: z.string(),
        email: z.string(),
        file_path: z.string(),
        created_at: z.string(),
        permissions: z.array(z.string()),
    })),
)
export const logsProfileSchemaType = paginationSchemaType(
    z.array(z.object({
        id: z.number(),
        action: z.string(),
        subject: z.string(),
        created_at: z.string(),
        username: z.string().nullable(),
    })),
)

export const profileSchemaType = z.object({
    id: z.number(),
    name: z.string(),
    email: z.string(),
    file_path: z.string(),
    permissions: z.array(z.string()),
})

export const permissionsSchemaType  = z.array(z.object({
    id: z.number(),
    name: z.string(),
}))
