import {ModalBody, ModalFooter, ModalHeader} from "../../components/modules/Modal.tsx";
import {Button} from "../../components/modules/Button.tsx";
import {useAlerts} from "../../context/modules/AlertContext.tsx";
import {useAuth} from "../../hooks/useAuth.ts";
import {useFileStore} from "../../stores/useFileStore.ts";
import {FormFields} from "../../components/modules/Form.tsx";
import {useForm} from "react-hook-form";
import {useMutation, useQueryClient} from "react-query";
import {postDeleteFolder} from "../../api/storageApi.ts";
import {useModal} from "../../hooks/useModal.ts";

export function ModalDeleteMedia() {
    const {setAlerts} = useAlerts()
    const {user} = useAuth()
    const {closeModal} = useModal()
    const {activeStorage} = useFileStore()
    const client = useQueryClient()

    const {
        handleSubmit,
    } = useForm()

    const {mutate} = useMutation(postDeleteFolder, {
        onSuccess: () => {
            client.invalidateQueries('storage')
            setAlerts('success', 'Media deleted')
            closeModal()
        }
    })

    const onSubmit = () => {
        mutate({path: user!.file_path + activeStorage!.name})
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