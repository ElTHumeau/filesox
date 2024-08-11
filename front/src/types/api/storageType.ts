export interface FileType {
    id: string;
    name: string;
    path: string;
    parent?: string;
    size: number;
    icon: string;
}

export interface FolderType {
    id: string;
    path: string;
    parent?: string;
}