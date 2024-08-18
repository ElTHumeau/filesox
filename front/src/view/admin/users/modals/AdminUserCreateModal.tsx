import {SubmitHandler, useForm} from "react-hook-form";
import {ModalBody, ModalFooter, ModalHeader} from "../../../../components/modules/Modal.tsx";
import {FormError, FormField, FormFields, FormLabel} from "../../../../components/modules/Form.tsx";
import {Button} from "../../../../components/modules/Button.tsx";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Row} from "../../../../components/modules/Grid.tsx";
import {useMutation, useQuery, useQueryClient} from "react-query";
import {useState} from "react";
import {useAlerts} from "../../../../context/modules/AlertContext.tsx";
import {useModal} from "../../../../hooks/useModal.ts";
import {useAxios} from "../../../../config/axios.ts";
import {permissionsSchemaType} from "../../../../types/api/userType.ts";
import {useTranslation} from "react-i18next";
import {UserPlus} from "lucide-react";
import Select from "react-tailwindcss-select";
import {SelectValue} from "react-tailwindcss-select/dist/components/type";

const schema = z.object({
    name: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(8),
    file_path: z.string().nullable(),
})

type FormFields = z.infer<typeof schema>

export function AdminCreateUserModal() {
    const [permissions, setPermissions] = useState<SelectValue>([])
    const queryClient = useQueryClient()
    const {setAlerts} = useAlerts()
    const {closeModal} = useModal()
    const API = useAxios()
    const {t} = useTranslation()

    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm<FormFields>({
        resolver: zodResolver(schema)
    })

    const {isLoading, data} = useQuery(
        'permissions',
        async () => {
            const response = await API.get('/admin/permissions')
            return permissionsSchemaType.parse(response.data)
        },
        {
        refetchOnWindowFocus: false
    })

    const {mutate} = useMutation(
        async (data: FormFields) => {
            await API.post('/admin/users/create',
                {...data,
                    permissions: Array.isArray(permissions) ? permissions.map((p) => parseInt(p.value)) : []
                }
            )
        },
        {
        onSuccess: () => {
            queryClient.invalidateQueries('users')
            setAlerts('success', t('alerts.success.user.create'))
            closeModal()
        }
    })

    const onSubmit: SubmitHandler<FormFields> = (data: FormFields) => {
        mutate({...data})
    }

    if (isLoading) return <div>Loading...</div>;

    return <>
        <ModalHeader>
            <h2 className="flex items-center gap-2 text-2xl">
                <span className="text-indigo-500"><UserPlus  height={28} width={28}/></span>
                {t('title.admin.user.create')}
            </h2>
        </ModalHeader>
        <FormFields onSubmit={handleSubmit(onSubmit)}>
            <ModalBody>
                <Row cols={2}>
                    <FormField>
                        <FormLabel htmlFor="name">{t('input.label.name')}</FormLabel>
                        <input
                            {...register('name')}
                            type="text"
                            placeholder={t('input.placeholder.name')}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                        {errors.name &&
                            <FormError>{errors.name.message}</FormError>
                        }
                    </FormField>
                    <FormField>
                        <FormLabel htmlFor="email">{t('input.label.email')}</FormLabel>
                        <input
                            {...register('email')}
                            type="email"
                            placeholder={t('input.placeholder.email')}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                        {errors.email &&
                            <FormError>{errors.email.message}</FormError>
                        }
                    </FormField>
                </Row>
                <Row cols={2}>
                    <FormField>
                        <FormLabel htmlFor="password">{t('input.label.password')}</FormLabel>
                        <input
                            {...register('password')}
                            type="password"
                            placeholder={t('input.placeholder.password')}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                        {errors.password &&
                            <FormError>{errors.password.message}</FormError>
                        }
                    </FormField>
                    <FormField>
                        <FormLabel htmlFor="file_path">{t('input.label.file_path')}</FormLabel>
                        <input
                            {...register('file_path')}
                            type="text"
                            placeholder={t('input.placeholder.file_path')}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                        {errors.file_path &&
                            <FormError>{errors.file_path.message}</FormError>
                        }
                    </FormField>
                </Row>

                <FormField>
                    <FormLabel htmlFor="permission">{t('input.label.permissions')}</FormLabel>
                    <Select
                        isMultiple={true}
                        isSearchable={false}
                        isClearable={false}
                        value={permissions}
                        primaryColor={"indigo"}
                        options={data?.map((p) => ({ label: p.name, value: p.id.toString() })) || []}
                        onChange={(v) => setPermissions(v)}
                    />
                </FormField>
            </ModalBody>
            <ModalFooter>
                <Button
                    color="primary"
                    type="submit"
                >
                    {t('button.create')}
                </Button>
            </ModalFooter>
        </FormFields>
    </>
}