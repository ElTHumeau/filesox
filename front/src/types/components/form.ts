import {FormEvent, ReactNode} from "react";

export interface LabelProps {
    children: any,
    htmlFor: string
}

export interface FormFieldsProps {
    children: ReactNode,
    onSubmit: (event: FormEvent<HTMLElement>) => void
}