import {useTranslation} from "react-i18next";
import {useAxios} from "../../../../config/axios.ts";
import {useFileStore} from "../../../../stores/useFileStore.ts";
import {useQuery} from "react-query";
import {ListModalShareSchemaType} from "../../../../types/api/storageType.ts";
import {ButtonIcon} from "../../../../components/modules/Button.tsx";
import {ClipboardCopy, Trash2} from "lucide-react";
import {ModalDeleteShares} from "../ModalDeleteShare.tsx";
import {useModal} from "../../../../hooks/useModal.ts";
import {Loader} from "../../../../components/modules/Loader/Loader.tsx";

export function ModalShareListMedia() {
    const API = useAxios()
    const {activeStorage} = useFileStore()
    const {t} = useTranslation()
    const {openModal} = useModal()

    const {data, isLoading} = useQuery(
        ['shares', activeStorage!.id],
        async () => {
            const response = await API.get('/storages/share/' + activeStorage!.id)
            return ListModalShareSchemaType.parse(response.data)
        },
    );

    if (isLoading) {
        return <Loader/>;
    }

    return <>
        {data && data.length > 0 && (
            <div>
                <ul className="grid-3 gap-3 mb-2 text-gray-600 text-sm border py-2 px-3 border-gray-200 bg-gray-50 rounded-t-md">
                    <li className="col-span-2">{t('table.expired_at')}</li>
                    <li>{t('table.actions')}</li>
                </ul>
                <div className="divide-y">
                    {data.map((share) => (
                        <ul key={share.id} className="grid-3 items-center text-sm gap-3 px-2 mb-2 text-gray-600 ">
                            <li className="col-span-2">{share.expired_at}</li>
                            <li>
                                <div className="flex items-center gap-2">
                                    <ButtonIcon title="copy" onClick={() => console.log("copy copy")}
                                                svg={ClipboardCopy}/>
                                    <ButtonIcon title="delete" onClick={() => openModal(() => <ModalDeleteShares
                                        url={`/profile/shares/delete`} shareId={share.id}/>, 'md')} svg={Trash2}/>
                                </div>
                            </li>
                        </ul>
                    ))}
                </div>

                <hr className="mb-4"/>
            </div>
        )}
    </>
}