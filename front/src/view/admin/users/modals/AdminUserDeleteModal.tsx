import {
    ModalBody,
    ModalFooterButton,
    ModalHeaderLogo
} from "../../../../components/modules/Modal.tsx";
import {ButtonBig} from "../../../../components/modules/Button.tsx";
import {useMutation, useQueryClient} from "react-query";
import {useModal} from "../../../../hooks/useModal.ts";
import {useAlerts} from "../../../../context/modules/AlertContext.tsx";
import {useAxios} from "../../../../config/axios.ts";
import {useTranslation} from "react-i18next";
import {Trash2} from "lucide-react";

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
        <ModalHeaderLogo color="danger">
            <Trash2 height="42" width="42"/>
        </ModalHeaderLogo>
        <ModalBody>
            <p className="text-center  py-4">
                {t('title.admin.user.delete.message')}
            </p>
        </ModalBody>
        <ModalFooterButton>
            <ButtonBig
                color="white"
                onClick={() => closeModal()}
            >
                {t('button.cancel')}
            </ButtonBig>
            <ButtonBig
                color="danger"
                type="button"
                onClick={() => mutate(userId)}
            >
                {t('button.delete')}
            </ButtonBig>
        </ModalFooterButton>
    </>
}