import React, {ReactNode} from "react";
import './alerts.css'
import {CircleAlert, CircleCheck, CircleX} from "lucide-react";

export function Alerts({children}: {children: ReactNode}) {
  return (
    <div className={`alerts`} role="alert">
        {children}
    </div>
  );
}

export function Alert({children, type}: {children: ReactNode, type: AlertType}) {
    const className = `alert after:bg-${getAlertClass(type)}-500`;
  return (
    <div className={className}>
        {children}
    </div>
  );
}

export function AlertIcon({type}: {type: AlertType}) {
    const icon  = getAlertIcon(type);
    return <>
        {icon}
    </>;
}

// function for flashing alerts
type AlertType = 'success' | 'danger' | 'warning';

function getAlertClass(type: AlertType): string {
    const alertClasses: { [key in AlertType]: string } = {
        success: 'after:bg-green-500',
        danger: 'after:bg-red-500',
        warning: 'after:bg-orange-500',
    };

    return alertClasses[type];
}

function getAlertIcon(type: AlertType): React.ReactNode {
    const alertIcons: { [key in AlertType]: React.ReactNode } = {
        success: <CircleCheck className="text-green-500"/>,
        danger: <CircleX className="text-red-500"/>,
        warning: <CircleAlert className="text-orange-500"/>,
    };

    if (alertIcons.hasOwnProperty(type)) {
        return alertIcons[type];
    }

    return null;
}