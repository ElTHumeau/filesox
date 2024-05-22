import {ModalBody, ModalFooter, ModalHeader} from "../../components/modules/Modal.tsx";
import {Button} from "../../components/modules/Button.tsx";
import {useAlerts} from "../../context/modules/AlertContext.tsx";
import {useFileStore} from "../../stores/useFileStore.ts";
import {FormFields} from "../../components/modules/Form.tsx";
import {useForm} from "react-hook-form";
import {useMutation, useQueryClient} from "react-query";
import {useModal} from "../../hooks/useModal.ts";
import {useUserStore} from "../../stores/useUserStore.ts";
import {useAxios} from "../../config/axios.ts";

export function ModalDeleteMedia() {
    const {setAlerts} = useAlerts()
    const {user} = useUserStore()
    const {closeModal} = useModal()
    const {activeStorage} = useFileStore()
    const client = useQueryClient()
    const API = useAxios()

    const {
        handleSubmit,
    } = useForm()

    const {mutate} = useMutation(
        async () => {
            await API.post("/folders/delete", {
                path: user!.file_path === "./" ? activeStorage!.name : user!.file_path + activeStorage!.name
            })
        }, {
        onSuccess: () => {
            client.invalidateQueries('storage')
            setAlerts('success', 'Media deleted')
            closeModal()
        }
    })

    const onSubmit = () => {
        mutate()
    }

    return <>
        <ModalHeader>
            <h2 className="text-xl font-medium">Delete media</h2>
        </ModalHeader>
        <FormFields onSubmit={handleSubmit(onSubmit)}>

            <ModalBody>
                <p className="text-center  py-3.5">Are you sure you want to delete this media?</p>
            </ModalBody>
            <ModalFooter>
                <Button
                    color="danger"
                    type="submit"
                >
                    Delete
                </Button>
            </ModalFooter>
        </FormFields>
    </>
}