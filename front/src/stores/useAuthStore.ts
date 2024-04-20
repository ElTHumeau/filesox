import {create} from "zustand";
import {combine} from "zustand/middleware";

type Action = {
    setUser: (user: string) => void;
}

type State = {
    user: undefined | null | any,
}

export const useAuthStore = create<State & Action>((
    combine(
        {
            user: undefined  as undefined | null | any,
        },
        (set) => ({
            setUser: (user) => {
                return set(() => ({user: user}));
            },
        })
    )
))