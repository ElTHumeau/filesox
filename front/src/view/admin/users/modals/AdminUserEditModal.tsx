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
import {permissionsSchemaType, UserType} from "../../../../types/api/userType.ts";
import {useRoles} from "../../../../hooks/useRoles.ts";
import {useAxios} from "../../../../config/axios.ts";
import {useTranslation} from "react-i18next";
import {UserPen} from "lucide-react";
import Select from "react-tailwindcss-select";
import {SelectValue} from "react-tailwindcss-select/dist/components/type";

const schema = z.object({
    name: z.string().min(3),
    email: z.string().email(),
    file_path: z.string(),
})

type FormFields = z.infer<typeof schema>

export function AdminEditUserModal({user}: { user: UserType }) {
    const {t} = useTranslation()
    const API = useAxios()
    const queryClient = useQueryClient()
    const {setAlerts} = useAlerts()
    const {closeModal} = useModal()
    const {getPermissionsValue} = useRoles()

    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm<FormFields>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: user.name,
            email: user.email,
            file_path: user.file_path || './',
        }
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

    const [permissions, setPermissions] = useState<SelectValue>(getPermissionsValue(data || [], user.permissions))

    const {mutate} = useMutation(
        async (formData: FormFields) => {
            await API.post('/admin/users/update/' + user.id, {
                ...formData,
                permissions: Array.isArray(permissions) ? permissions.map((p) => parseInt(p.value)) : [],
            })
        }
        , {
        onSuccess: () => {
            queryClient.invalidateQueries('users')
            setAlerts('success', t('alerts.success.user.edit'))
            closeModal()
        }
    })

    const onSubmit: SubmitHandler<FormFields> = (formData: FormFields) => {
        mutate({...formData})
    }

    if (isLoading) return <div>Loading...</div>;

    return <>
        <ModalHeader>
            <h2 className="flex items-center gap-2 text-2xl">
                <span className="text-indigo-500"><UserPen  height={28} width={28}/></span>
                {t('title.admin.user.edit')}
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
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                        {errors.email &&
                            <FormError>{errors.email.message}</FormError>
                        }
                    </FormField>
                </Row>
                <FormField>
                    <FormLabel htmlFor="file_path">{t('input.label.file_path')}</FormLabel>
                    <input
                        {...register('file_path')}
                        type="text"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                    {errors.file_path &&
                        <FormError>{errors.file_path.message}</FormError>
                    }
                </FormField>
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
                    {t('button.edit')}
                </Button>
            </ModalFooter>
        </FormFields>
    </>
}