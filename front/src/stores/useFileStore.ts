import {persist} from "zustand/middleware";
import {create} from "zustand";

type State = {
    files: undefined | File[]
}

type Action = {
    setFiles: (file: undefined | File[]) => void;
}

export const useFileStore = create<State & Action>()(
    persist(
        (set) => ({
            files: undefined,
            setFiles: (file: any) => {
                return set(() => ({files: file}));
            },
        }),
        {name: 'file-storage'}
    )
)