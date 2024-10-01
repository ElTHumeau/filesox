import {Card, CardBody} from "@components/modules/Card.tsx";
import {FormError, FormField, FormFields, FormLabel} from "@components/modules/Form.tsx";
import {Button} from "@components/modules/Button.tsx";
import {useProfileEditPasswordApi} from "@/api/profileApi.ts";

export function EditProfilePassword() {
    const {form, onSubmit} = useProfileEditPasswordApi()
    return <>
        <Card>
            <CardBody>
                <h2 className="text-xl font-semibold mb-4">Edit Password</h2>

                <FormFields onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField>
                        <FormLabel htmlFor="password">Password</FormLabel>
                        <input
                            {...form.register('password')}
                            type="password"
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                        <FormError>{form.formState.errors.password?.message}</FormError>
                    </FormField>
                    <FormField>
                        <FormLabel htmlFor="confirm_password">Confirm Password</FormLabel>
                        <input
                            {...form.register('confirm_password')}
                            type="password"
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                        <FormError>{form.formState.errors.confirm_password?.message}</FormError>
                    </FormField>

                    <div className="flex justify-end mt-4">
                        <Button color={'primary'} type={'submit'}>Edit password</Button>
                    </div>
                </FormFields>
            </CardBody>
        </Card>
    </>
}