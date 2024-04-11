import {createContext, FC, ReactNode, useState} from "react";
import {ModalContextProps, ModalProviderProps} from "../../types/components/modal.ts";
import {Modal} from "../../components/modules/Modal.tsx";

export const ModalContext = createContext<ModalContextProps | null>(null);

export const ModalProvider: FC<ModalProviderProps> = ({children}) => {

    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState<ReactNode | null>(null);
    const [modalSize, setModalSize] = useState("2xl");

    const openModal = (content: ReactNode, size: string = "2xl") => {
        setModalContent(content);
        setModalSize(size);
        setShowModal(true);
    }

    const closeModal = () => {
        setShowModal(false);
        setModalContent(null);
    }

    return <ModalContext.Provider value={{showModal, modalContent, modalSize, openModal, closeModal}}>
        {children}
        <Modal/>
    </ModalContext.Provider>
}