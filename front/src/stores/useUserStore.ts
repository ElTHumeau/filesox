import {create} from "zustand";
import {persist} from "zustand/middleware";

interface User {
    id: number;
    name: string;
    email: string;
    layout: boolean;
    file_path: string;
    permissions: string[];
}

interface UserState {
    user: User | null | undefined;
    setUser: (user: User | null | undefined) => void;
}

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            user: undefined,
            setUser: (user: User | null | undefined) => set({ user })
        }),
        {
            name: 'user-store',
            getStorage: () => localStorage
        }
    )
);
