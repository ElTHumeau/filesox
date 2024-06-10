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

const schema = z.object({
    name: z.string().min(3),
    email: z.string().email(),
    file_path: z.string(),
})

type FormFields = z.infer<typeof schema>

export function AdminEditUserModal({user}: { user: UserType }) {
    const [isAdmin, setAdmin] = useState(
        user.permissions.includes('Administrator')
    )
    const [permissions, setPermissions] = useState<number[]>([])

    const {t} = useTranslation()
    const API = useAxios()
    const queryClient = useQueryClient()
    const {setAlerts} = useAlerts()
    const {closeModal} = useModal()
    const {getPermissions} = useRoles()

    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm<FormFields>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: user.name,
            email: user.email,
            file_path: user.file_path
        }
    })

    const {isLoading, data} = useQuery(
        'permissions',
        async () => {
            let response = await API.get('/admin/permissions')
            return permissionsSchemaType.parse(response.data)
        },
        {
        refetchOnWindowFocus: false
    })


    const {mutate} = useMutation(
        async (data: FormFields) => {
            await API.post('/admin/users/update/' + user.id, {...data, permissions})
        }
        , {
        onSuccess: () => {
            queryClient.invalidateQueries('users')
            setAlerts('success', t('alerts.success.user.edit'))
            closeModal()
        }
    })

    const onSubmit: SubmitHandler<FormFields> = (dataForm: any) => {
        const p = getPermissions(user.permissions, permissions, data)
        console.log(p)
        mutate({...dataForm, permissions: p, id: user.id})
    }

    if (isLoading) return <div>Loading...</div>;

    return <>
        <ModalHeader>
            <h2 className="text-lg font-semibold">
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
                    <div className="flex items-center gap-2 my-3">
                        <input
                            type="checkbox"
                            value={data && data[0].id}
                            className={"rounded border-gray-400 cursor-pointer"}
                            defaultChecked={user.permissions.includes(data![0].name)}
                            onChange={(e) => {
                                if (e.target.checked) {
                                    setAdmin(true)
                                    setPermissions([...permissions, data![0].id])
                                } else {
                                    setAdmin(false)
                                    setPermissions(permissions.filter((id) => id !== data![0].id))
                                }
                            }}
                        />
                        <label>{data && data[0].name}</label>
                    </div>

                    <Row cols={2}>
                        {data && data.slice(1).map((permission: any) => (
                            <div key={permission.id} className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id={permission.id}
                                    value={permission.id}
                                    className={`rounded border-gray-400 ${isAdmin ? "cursor-not-allowed" : "cursor-pointer"}`}
                                    defaultChecked={user.permissions.includes(permission.name)}
                                    disabled={isAdmin}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setPermissions([...permissions, permission.id])
                                        } else {
                                            setPermissions(permissions.filter((id) => id !== permission.id))
                                        }
                                    }}
                                />
                                <label htmlFor={permission.id}>{permission.name}</label>
                            </div>
                        ))}
                    </Row>
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