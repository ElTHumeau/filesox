import {Card, CardBody} from "../../../components/modules/Card.tsx";
import {Row} from "../../../components/modules/Grid.tsx";
import {FormError, FormField, FormFields, FormLabel} from "../../../components/modules/Form.tsx";
import {Button} from "../../../components/modules/Button.tsx";
import {SubmitHandler, useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useUserStore} from "../../../stores/useStore.ts";
import {postProfileInformation} from "../../../api/profileApi.ts";
import {useMutation} from "react-query";

const schema = z.object({
    email: z.string().email(),
    name: z.string().min(3)
})

export type FormFields = z.infer<typeof schema>

export function EditProfileInformation() {
    const {user, setUser} = useUserStore()
    const {
        register,
        handleSubmit: handleSubmit,
        formState: {errors},
    } = useForm<FormFields>({
            resolver: zodResolver(schema),
            defaultValues: {
                email: user?.email,
                name: user?.name
            }
        }
    )

    const {mutate} = useMutation(postProfileInformation, {
        onSuccess: () => {
            alert('Profile updated')
        }
    })

    const onSubmit: SubmitHandler<FormFields> = (data) => {
        mutate(data)
        setUser({ ...user!, name: data.name,  email: data.email})
    }

    return (
        <div className="px-7 py-4">
            <Card>
                <CardBody>
                    <h2 className="text-xl font-semibold mb-4">Edit Profile Information</h2>

                    <FormFields onSubmit={handleSubmit(onSubmit)}>
                        <Row cols={2}>
                            <FormField>
                                <FormLabel htmlFor="name">Name</FormLabel>
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
                                <FormLabel htmlFor="name">Email</FormLabel>
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

                        <div className="flex justify-end mt-4">
                            <Button color={'primary'} type={'submit'}>Edit profile</Button>
                        </div>
                    </FormFields>
                </CardBody>
            </Card>
        </div>
    );
}