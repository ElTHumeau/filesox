import {ModalBody, ModalFooter, ModalHeader} from "../../../components/modules/Modal.tsx";
import {FormField, FormFields, FormLabel} from "../../../components/modules/Form.tsx";
import {Button} from "../../../components/modules/Button.tsx";

export function ModalCreateFolder() {
    return <>
        <ModalHeader>
            <h2 className="text-2xl">Create folder</h2>
        </ModalHeader>

        <ModalBody>
            <FormFields onSubmit={() => console.log('coucou')} >
                <FormLabel htmlFor="name">Name</FormLabel>
                <FormField>
                    <input
                        type="text"
                        placeholder="Name"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                </FormField>
            </FormFields>
        </ModalBody>

        <ModalFooter>
            <Button color="primary">Save</Button>
        </ModalFooter>
    </>
}