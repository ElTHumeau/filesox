import {ModalBody, ModalFooter, ModalHeader} from "../../components/modules/Modal.tsx";
import {Button} from "../../components/modules/Button.tsx";

export function ModalShareMedia() {
    return <>
        <ModalHeader>
            <h2 className="text-2xl">Share media</h2>
        </ModalHeader>
        <ModalBody>
            <p>Are you sure you want to delete this media?</p>
        </ModalBody>
        <ModalFooter>
            <Button
                color="primary"
                type="button"
            >
                Delete
            </Button>
        </ModalFooter>
    </>
}