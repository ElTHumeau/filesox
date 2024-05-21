import {FormError, FormField, FormFields, FormLabel} from "../../components/modules/Form.tsx";
import {SubmitHandler, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../context/modules/AuthContext.tsx";

const schema = z.object({
    email: z.string().email(),
    password: z.string().min(8)
})

type FormFields = z.infer<typeof schema>

export default function Login() {
    const {login} = useAuth()
    const nav = useNavigate()

    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm<FormFields>({
        resolver: zodResolver(schema)
    })

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        await login(data.email, data.password);
        nav("/")
    }

    return <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img src="/logo.png" alt="Logo" height="100" width="175" className="mx-auto"/>
            <h2 className="mt-5 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                Sign in to your account
            </h2>
        </div>

        <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
            <FormFields onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <FormField>
                        <input
                            {...register('email')}
                            type="text"
                            placeholder="email"
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                        {errors.email &&
                            <FormError>{errors.email.message}</FormError>
                        }
                    </FormField>
                </div>
                <div className="mt-3">
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <FormField>
                        <input
                            {...register('password')}
                            type="password"
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                        {errors.password &&
                            <FormError>{errors.password.message}</FormError>
                        }
                    </FormField>
                </div>

                <div className='mt-3'>
                    <button type="submit"
                            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                        Sign up
                    </button>
                </div>
            </FormFields>
        </div>
    </div>
}