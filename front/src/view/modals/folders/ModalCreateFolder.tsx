import {ModalBody, ModalFooter, ModalHeader} from "../../../components/modules/Modal.tsx";
import {FormError, FormField, FormFields, FormLabel} from "../../../components/modules/Form.tsx";
import {Button} from "../../../components/modules/Button.tsx";
import {SubmitHandler, useForm} from "react-hook-form";
import {useMutation, useQueryClient} from "react-query";
import {useAlerts} from "../../../context/modules/AlertContext.tsx";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {postCreateFolder} from "../../../api/storageApi.ts";
import {useModal} from "../../../hooks/useModal.ts";
import {useAuth} from "../../../hooks/useAuth.ts";

const schema = z.object({
    path: z.string().min(2)
})

type FormFields = z.infer<typeof schema>

export function ModalCreateFolder() {
    const {setAlerts} = useAlerts()
    const {closeModal} = useModal()
    const {user} = useAuth()
    const client = useQueryClient()

    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<FormFields>({
        resolver: zodResolver(schema),
    })

    const {mutate} = useMutation(postCreateFolder, {
        onSuccess: () => {
            client.invalidateQueries('storage')
            setAlerts('success', 'Folder created')
            closeModal()
        }
    })

    const onSubmit: SubmitHandler<FormFields> = (data: FormFields) => {
        mutate({path: user?.file_path === "./" ? data.path :  user?.file_path + data.path})
    }

    return <>
        <ModalHeader>
            <h2 className="text-xl font-medium">Create folder</h2>
        </ModalHeader>

        <FormFields onSubmit={handleSubmit(onSubmit)}>
            <ModalBody>
                <FormLabel htmlFor="name">Name</FormLabel>
                <FormField>
                    <input
                        {...register('path')}
                        type="text"
                        placeholder="Name"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                    {errors.path &&
                        <FormError>{errors.path.message}</FormError>
                    }
                </FormField>
            </ModalBody>

            <ModalFooter>
                <Button color="primary" type={'submit'}>Save</Button>
            </ModalFooter>
        </FormFields>
    </>
}