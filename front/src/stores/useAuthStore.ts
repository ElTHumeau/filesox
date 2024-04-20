import {create} from "zustand";
import {persist} from "zustand/middleware";

type Action = {
    setUser: (user: string) => void;
}

type State = {
    user: null | any,
}

export const useAuthStore = create<State & Action>((
    persist(
        {
            user: null as null | any,
        },
        (set) => ({
            setUser: (user) => {
                return set(() => ({user: user}));
            },
        })
    )
))