export interface FileType {
    id: string;
    name: string;
    type: string;
    parent_id?: string;
    size: number;
    icon: string;
}

export interface FolderType {
    id: string;
    path: string;
    parent_id?: string;
}

export type ActiveStorageType<T> = T |null;