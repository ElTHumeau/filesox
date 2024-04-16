import {FormError, FormField, FormFields, FormLabel} from "../../components/modules/Form.tsx";
import {SubmitHandler, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {loginUserfn} from "../../api/authApi.ts";
import {useAuth} from "../../context/AuthContext.tsx";
import {useNavigate} from "react-router-dom";
import {getProfileInformation} from "../../api/profileApi.ts";
import {useUserStore} from "../../stores/useStore.ts";

const schema = z.object({
    email: z.string().email(),
    password: z.string().min(8)
})

type FormFields = z.infer<typeof schema>

export default function Login() {
    const {setUser} = useUserStore()
    const {setRefreshToken, setToken} = useAuth()
    const nav = useNavigate()

    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm<FormFields>({
        resolver: zodResolver(schema)
    })

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        let response = await loginUserfn(data)

        if (response.status === 200) {
            setToken(response.data.token);
            setRefreshToken(response.data.refreshToken);

            await getProfileInformation(setUser);

            nav('/');
        }
    }

    return <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img className="mx-auto h-10 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                 alt="Your Company"/>
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                Sign in to your account
            </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
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
                <div>
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