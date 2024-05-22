import {ModalBody, ModalFooter, ModalHeader} from "../../../../components/modules/Modal.tsx";
import {Button} from "../../../../components/modules/Button.tsx";
import {useMutation, useQueryClient} from "react-query";
import {useModal} from "../../../../hooks/useModal.ts";
import {useAlerts} from "../../../../context/modules/AlertContext.tsx";
import {useAxios} from "../../../../config/axios.ts";

export function AdminDeleteUserModal({userId}: {userId: number}) {
    const {closeModal} = useModal()
    const {setAlerts} = useAlerts()
    const API = useAxios()
    const queryClient = useQueryClient()

    const { mutate } = useMutation(async (id: number) => {
        await API.delete('/admin/users/delete/' + id)
    }, {
        onSuccess: () => {
            queryClient.invalidateQueries('users');
            setAlerts('success', 'User deleted successfully');
            closeModal();
        }
    });

    return <>
        <ModalHeader>
            <h2 className="text-lg text-indigo-950 font-semibold">Delete User</h2>
        </ModalHeader>
        <ModalBody>
            <p className="text-center  py-4">Are you sure you want to delete this user ?</p>
        </ModalBody>
        <ModalFooter>
            <Button
                color="danger"
                type="button"
                onClick={() => mutate(userId)}
            >
                Delete
            </Button>
        </ModalFooter>
    </>
}