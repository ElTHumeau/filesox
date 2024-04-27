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

type State = {
    user: undefined | User
}

type Action = {
    setUser: (user: undefined | User) => void;
}

export const useUserStore = create<State & Action>()(
    persist (
        (set) => ({
            user: undefined,
            setUser: (user: any) => {
                return set(() => ({user: user}));
            },
        }),
        {name: 'user-storage'}
    )
)
