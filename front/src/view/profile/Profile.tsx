import {Outlet} from "react-router-dom";
import {Tab, TabItem, TabItems} from "../../components/modules/Tab.tsx";
import {Share2, User} from "lucide-react";

export function Profile() {
    return <>
        <Tab>
            <TabItems>
                <TabItem link="/profile">
                    <User size={20}/>
                    Profile
                </TabItem>
                <TabItem link="/profile/share">
                    <Share2 size={20}/>
                    Share
                </TabItem>
            </TabItems>
        </Tab>

        <Outlet/>
    </>;
}