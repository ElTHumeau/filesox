import {ModalBody, ModalFooter, ModalHeader} from "../../components/modules/Modal.tsx";
import {FormField, FormFields, FormLabel} from "../../components/modules/Form.tsx";
import {Button} from "../../components/modules/Button.tsx";

export function ModalMoveMedia() {
    return <>
        <ModalHeader>
            <h2 className="text-2xl">Move media</h2>
        </ModalHeader>

        <ModalBody>
            <FormFields onSubmit={() => console.log('coucou')} >
                <FormLabel htmlFor="name">Path</FormLabel>
                <FormField>
                    <input
                        type="text"
                        placeholder="/path/to/media"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                </FormField>
            </FormFields>
        </ModalBody>

        <ModalFooter>
            <Button
                color="primary"
                type="button"
            >
                Move
            </Button>
        </ModalFooter>
    </>
}