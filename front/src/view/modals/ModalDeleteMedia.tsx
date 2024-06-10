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
import {useTranslation} from "react-i18next";

export function ModalDeleteMedia() {
    const {setAlerts} = useAlerts()
    const {user} = useUserStore()
    const {closeModal} = useModal()
    const {activeStorage} = useFileStore()
    const client = useQueryClient()
    const API = useAxios()
    const {t} = useTranslation()

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
            setAlerts('success', t('alerts.success.folder.delete'))
            closeModal()
        }
    })

    const onSubmit = () => {
        mutate()
    }

    return <>
        <ModalHeader>
            <h2 className="text-xl font-medium">
                {t('title.modal.delete_media')}
            </h2>
        </ModalHeader>
        <FormFields onSubmit={handleSubmit(onSubmit)}>

            <ModalBody>
                <p className="text-center  py-3.5">
                    {t('title.modal.delete_media_message')}
                </p>
            </ModalBody>
            <ModalFooter>
                <Button
                    color="danger"
                    type="submit"
                >
                    {t('button.delete')}
                </Button>
            </ModalFooter>
        </FormFields>
    </>
}