import {ModalBody, ModalFooter, ModalHeader} from "../../components/modules/Modal.tsx";
import {Button} from "../../components/modules/Button.tsx";
import {FormField, FormFields, FormLabel} from "../../components/modules/Form.tsx";
import {Row} from "../../components/modules/Grid.tsx";
import {Share2} from "lucide-react";

export function ModalShareMedia() {
    return <>
        <ModalHeader>
            <h2 className="flex items-center gap-2 text-2xl">
                <span className="text-indigo-500"><Share2 height={28} width={28} /></span>
                Share media
            </h2>
        </ModalHeader>
        <ModalBody>
            <FormFields onSubmit={() => console.log('coucou')}>
                <FormField>
                    <FormLabel htmlFor="name">Share duration</FormLabel>
                    <Row cols={2}>
                        <input
                            type="text"
                            placeholder="Name"
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                        <select
                            name="share_information_duration"
                            id=""
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        >
                            <option value="1">hours</option>
                            <option value="2">Days</option>
                            <option value="3">Weeks</option>
                            <option value="4">Months</option>
                            <option value="5">Years</option>
                        </select>
                    </Row>
                </FormField>


                <FormField>
                    <FormLabel htmlFor="name">Optional password</FormLabel>
                    <input
                        type="password"
                        placeholder="********"
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
                Share
            </Button>
        </ModalFooter>
    </>
}