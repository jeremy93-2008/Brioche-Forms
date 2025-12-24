import { Button } from '@/_components/ui/button'
import { Field } from '@/_components/ui/field'
import { Input } from '@/_components/ui/input'
import { ToastMessages } from '@/_constants/toast'
import { useServerActionState } from '@/_hooks/useServerActionState'
import UploadImageAction, {
    IImageUploadResult,
} from '@/_server/_handlers/actions/image/upload'
import { IReturnAction } from '@/_server/_handlers/actions/types'
import { IFullForm } from '@/_server/domains/form/getFullForms'
import { showToastFromResult } from '@/_utils/showToastFromResult'
import { FormEvent, useState } from 'react'

interface IFormGalleryUploadImageComponentProps {
    data: IFullForm['pages'][0]['sections'][0]['images'][0]
    afterUpload: (result: IReturnAction<IImageUploadResult>) => void
}

export function FormGalleryUploadImageComponent(
    props: IFormGalleryUploadImageComponentProps
) {
    const { data, afterUpload } = props
    const { isPending, runAction } = useServerActionState<
        FormData,
        IImageUploadResult
    >(UploadImageAction)

    const [isUploadEnabled, setIsUploadEnabled] = useState<boolean>(false)

    const onChangeFile = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const files = evt.currentTarget.files
        setIsUploadEnabled(!!files && files.length > 0)
    }

    const onSaveUpload = async (evt: FormEvent<HTMLFormElement>) => {
        evt.preventDefault()
        const fd = new FormData(evt.currentTarget)
        const result = await runAction(fd)

        afterUpload(result)

        showToastFromResult(result, ToastMessages.genericSuccess)
    }

    return (
        <section className="flex flex-col">
            <form onSubmit={onSaveUpload}>
                <input type="hidden" id="id" name="id" value={data.id} />
                <input
                    type="hidden"
                    id="form_id"
                    name="form_id"
                    value={data.form_id}
                />
                <section className="flex flex-wrap overflow-y-auto"></section>
                <section className="flex items-end gap-2">
                    <Field>
                        <Input
                            id="upload_image"
                            name="upload_image"
                            className="text-primary"
                            type="file"
                            accept=".jpg, .jpeg, .png, .svg, .webp, .gif"
                            onChange={onChangeFile}
                        />
                    </Field>
                    <Button
                        isLoading={isPending}
                        type="submit"
                        disabled={!isUploadEnabled}
                    >
                        Subir
                    </Button>
                </section>
            </form>
        </section>
    )
}
