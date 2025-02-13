import {FormError, FormField, FormFields, FormLabel} from "@components/modules/Form.tsx";
import {useLoginApi} from "@/api/authApi.ts";
import {useTranslation} from "react-i18next";

export default function Login() {
    const {t} = useTranslation()
    const {form, onSubmit} = useLoginApi()

    return <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img src="/logo.png" alt="Logo" height="100" width="175" className="mx-auto"/>
            <h2 className="mt-5 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                {t('title.auth.sign_in_to_tour_account')}
            </h2>
        </div>

        <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
            <FormFields onSubmit={form.handleSubmit(onSubmit)}>
                <div>
                    <FormLabel htmlFor="email">
                        {t('input.label.email')}
                    </FormLabel>
                    <FormField>
                        <input
                            {...form.register('email')}
                            type="text"
                            placeholder={t('input.placeholder.email')}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                            <FormError>{form.formState.errors.email?.message}</FormError>
                    </FormField>
                </div>
                <div className="mt-3">
                    <FormLabel htmlFor="password"> {t('input.label.password')}</FormLabel>
                    <FormField>
                        <input
                            {...form.register('password')}
                            type="password"
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                            <FormError>{form.formState.errors.password?.message}</FormError>
                    </FormField>
                </div>

                <div className='mt-3'>
                    <button type="submit"
                            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                        {t('button.login')}
                    </button>
                </div>
            </FormFields>
        </div>
    </div>
}