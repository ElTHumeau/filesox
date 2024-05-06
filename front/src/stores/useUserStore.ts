import {create} from "zustand";
import {combine} from "zustand/middleware";

interface User {
    id: number;
    name: string;
    email: string;
    layout: boolean;
    file_path: string;
    permissions: string[];
}

export const useUserStore = create(
    combine({
            user: undefined as undefined | null | User
        },
        (set) => ({
            setUser: (user: User | null | undefined) => set({user})
        })
    )
)

