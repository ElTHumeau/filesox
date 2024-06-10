import {ModalBody, ModalFooter, ModalHeader} from "../../../../components/modules/Modal.tsx";
import {Button} from "../../../../components/modules/Button.tsx";
import {useMutation, useQueryClient} from "react-query";
import {useModal} from "../../../../hooks/useModal.ts";
import {useAlerts} from "../../../../context/modules/AlertContext.tsx";
import {useAxios} from "../../../../config/axios.ts";
import {useTranslation} from "react-i18next";

export function AdminDeleteUserModal({userId}: {userId: number}) {
    const {closeModal} = useModal()
    const {setAlerts} = useAlerts()
    const API = useAxios()
    const queryClient = useQueryClient()
    const {t}  = useTranslation()

    const { mutate } = useMutation(async (id: number) => {
        await API.delete('/admin/users/delete/' + id)
    }, {
        onSuccess: () => {
            queryClient.invalidateQueries('users');
            setAlerts('success', t('alerts.success.user.delete'));
            closeModal();
        }
    });

    return <>
        <ModalHeader>
            <h2 className="text-lg text-indigo-950 font-semibold">
                {t('title.admin.user.delete.title')}
            </h2>
        </ModalHeader>
        <ModalBody>
            <p className="text-center  py-4">
                {t('title.admin.user.delete.message')}
            </p>
        </ModalBody>
        <ModalFooter>
            <Button
                color="danger"
                type="button"
                onClick={() => mutate(userId)}
            >
                {t('button.delete')}
            </Button>
        </ModalFooter>
    </>
}