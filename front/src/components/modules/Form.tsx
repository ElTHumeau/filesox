import React, {ReactNode} from "react";
import {FormFieldsProps, LabelProps} from "../../types/components/form.ts";

export function FormFields({children, onSubmit}: FormFieldsProps) {
    return <form method='POST' onSubmit={onSubmit}>
        {children}
    </form>
}

export function FormLabel({children, htmlFor}: LabelProps) {
    return <label htmlFor={htmlFor} className="block text-sm font-medium leading-6 text-gray-900">
        {children}
    </label>
}

export function FormError({children}: { children: React.ReactNode }) {
    return <span className="text-red-500">{children}</span>
}

export function FormField({children}: { children: ReactNode }) {
    return <div className="mt-2">
        {children}
    </div>
}

export function FormButton({children}: { children: ReactNode }) {
    return <button type="submit"
                   className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
        {children}
    </button>
}

export function InputIcon({svg: SvgComponent}: { svg: React.ComponentType<any> }) {
    return <div className="relative">
        <div className="text-gray-400 flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
            <SvgComponent size={20} strokeWidth={1.75}/>
        </div>

        <input
            type="search"
            name="search"
            placeholder="Search"
            className="rounded-md border-gray-300 focus:border-indigo-500 text-sm w-full pl-10"
        />
    </div>
}