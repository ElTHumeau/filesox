import {Alert, AlertIcon, Alerts} from "../../components/modules/Alerts/Alert.tsx";
import {useAlerts} from "../../context/modules/AlertContext.tsx";
import {useEffect} from "react";

export function AlertsFlash() {
    const {alerts, deleteAlert} = useAlerts()

    useEffect(() => {
        const timers: number[] = [];

        alerts.forEach((_, index) => {
            const timer = setTimeout(() => {
                deleteAlert(index);
            }, 5000 * (index + 1));

            timers.push(timer);
        });

        return () => {
            timers.forEach((timer) => {
                clearTimeout(timer);
            });
        };
    }, [alerts, deleteAlert]);

    return <Alerts>
        {alerts.map((alert, index) => {
            return <Alert key={index} type={alert.type}>
                <AlertIcon type={alert.type}/>
                {alert.message}
            </Alert>
        })}
    </Alerts>;
}