import {ModalBody, ModalFooter, ModalHeader} from "../../components/modules/Modal.tsx";
import {Button} from "../../components/modules/Button.tsx";

export function ModalDeleteMedia() {
    return <>
        <ModalHeader>
            <h2 className="text-lg font-semibold">Delete Media</h2>
        </ModalHeader>
        <ModalBody>
            <p className="text-center  py-4">Are you sure you want to delete this media?</p>
        </ModalBody>
        <ModalFooter>
            <Button
                color="danger"
                type="button"
            >
                Delete
            </Button>
        </ModalFooter>
    </>
}