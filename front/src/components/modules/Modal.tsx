import {getSize, useModal} from "../../hooks/useModal.ts";
import {ReactNode} from "react";
import {Button, ButtonIcon} from "./Button.tsx";
import {X} from "lucide-react";

export function Modal() {
    const {showModal, modalSize, modalContent} = useModal();
    const widthModal = getSize(modalSize);
    return <>
        {showModal && <div id={`modal`} className="fixed inset-0 z-50 overflow-y-auto">
            <div className="fixed inset-0 w-full h-full bg-black opacity-40"></div>
            <div className="flex items-center min-h-screen">
                <div
                    className={`${widthModal} relative w-full p-4 mx-auto bg-white rounded-md shadow-lg transition duration-500 ease-in-out transform`}>
                    {modalContent}
                </div>
            </div>
        </div>
        }
    </>
}

export function ModalHeader({children}: { children: ReactNode }) {
    const {closeModal} = useModal()

    return <div className="flex justify-between items-center pb-5">
        {children}

        <ButtonIcon svg={X} title="Close modal" onClick={() => closeModal()}
        >
            <X size={20} strokeWidth={1.75}/>
        </ButtonIcon>
    </div>
}

export function ModalBody({children}: { children: ReactNode }) {
    return <div>
        {children}
    </div>
}

export function ModalFooter({children}: { children: ReactNode}) {
    const {closeModal} = useModal()

    return <div className="pt-5">
        <div className="flex justify-end items-center gap-2">
            <Button
                color="white"
                type="button"
                onClick={() => closeModal()}
            >
                Close
            </Button>
            {children}
        </div>
    </div>
}