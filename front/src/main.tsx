import React from 'react'
import ReactDOM from 'react-dom/client'
import './assets/style/app.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Login from "./view/auth/Login.tsx";
import Register from "./view/auth/Register.tsx";
import {App} from "./view/layouts/App.tsx";
import {Dashboard} from "./view/Dashboard.tsx";
import {ModalProvider} from "./context/modules/ModalContext.tsx";
import {Profile} from "./view/profile/Profile.tsx";
import {ProfileEdit} from "./view/profile/EditProfile.tsx";
import {ProfileShare} from "./view/profile/ShareProfile.tsx";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ModalProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<App/>}>
                        <Route index element={<Dashboard/>}/>

                        <Route path="/profile" element={<Profile/>}>
                            <Route index element={<ProfileEdit/>}/>
                            <Route path="share" element={<ProfileShare/>}/>
                        </Route>
                    </Route>

                    <Route path="/login" element={<Login/>}/>
                    <Route path="/register" element={<Register/>}/>
                </Routes>
            </BrowserRouter>
        </ModalProvider>
    </React.StrictMode>
)
