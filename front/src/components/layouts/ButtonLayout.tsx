import {LayoutList, LayoutTemplate} from "lucide-react";
import {ButtonIcon} from "../modules/Button.tsx";
import {useUserStore} from "../../stores/useUserStore.ts";
import {useMutation} from "react-query";
import {postUpdateLayout} from "../../api/profileApi.ts";

export function ButtonLayout() {
    const  {user, setUser} = useUserStore();

    const {mutate} = useMutation(postUpdateLayout, {
        onSuccess: () => {
            setUser({...user!, layout: !user!.layout})
        }
    })

    const handleClickLayout = (e: MouseEvent) => {
        e.preventDefault();

        mutate({
            name: user!.name,
            email: user!.email,
            layout: !user!.layout
        });
    };

    return <>
        <ButtonIcon
            svg={user!.layout ? LayoutTemplate : LayoutList }
            title="Switch template"
            onClick={handleClickLayout}
        />
    </>
}