import {createContext, FC, useContext, useState} from "react";
import {AlertsContextProps, AlertsProviderProps} from "../../types/components/alert.ts";

interface AlertType {
    type: string;
    message: string;
}

export const AlertContext = createContext<AlertsContextProps | null >(null)

export const AlertsProvider: FC<AlertsProviderProps> = ({children}) => {
    const [alerts, setAlerts_ ] = useState<AlertType[]>([])

    const setAlerts = (type: string, message: string) => {
        setAlerts_((alerts) => {
            return [...alerts, {type, message}];
        });
    }

    const deleteAlert = (index: number) => {
        let newAlerts = [...alerts]
        newAlerts.splice(index, 1)
        setAlerts_(newAlerts)
    }

    return <AlertContext.Provider value={{alerts, setAlerts, deleteAlert}}>
        {children}
    </AlertContext.Provider>
}

export const useAlerts = () => {
    const context = useContext(AlertContext)

    if (!context) {
        throw new Error('useAlerts must be used within an AlertsProvider')
    }

    return context
}