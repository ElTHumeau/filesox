import {getSize, useModal} from "../../hooks/useModal.ts";
import {ReactNode} from "react";
import {Button, ButtonIcon} from "./Button.tsx";
import {X} from "lucide-react";
import {useTranslation} from "react-i18next";

export function Modal() {
    const {show, size, content } = useModal();
    const widthModal = getSize(size);

    const renderModalContent = (content: JSX.Element | (() => JSX.Element) | null | undefined) => {
        if (typeof content === 'function') {
            return content();
        }
        return content;
    };

    return <>
        {show && <div id={`modal`} className="fixed inset-0 z-50 overflow-y-auto">
            <div className="fixed inset-0 w-full h-full bg-black opacity-40"></div>
            <div className="flex items-center min-h-screen">
                <div
                    className={`${widthModal} relative w-full p-4 mx-auto bg-white rounded-md shadow-lg transition duration-500 ease-in-out transform`}>
                    {renderModalContent(content)}
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
    const {t} = useTranslation()

    return <div className="pt-5">
        <div className="flex justify-end items-center gap-2">
            <Button
                color="white"
                type="button"
                onClick={() => closeModal()}
            >
                {t('button.cancel')}
            </Button>
            {children}
        </div>
    </div>
}