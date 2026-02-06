import { FormGalleryUploadImageComponent } from '@/_components/shared/form-gallery-upload-image/component.client'
import { Button } from '@/_components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/_components/ui/dialog'
import { cn } from '@/_utils/clsx-tw'
import { CameraIcon } from 'lucide-react'

interface IImagePickerProps {
    image: string
    setImage: (background: string) => void
    className?: string
}

function ImagePicker(props: IImagePickerProps) {
    const { image, setImage, className } = props
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant={'outline'}
                    className={cn(
                        'flex justify-start text-left font-normal',
                        !image && 'text-muted-foreground',
                        className
                    )}
                >
                    <div className="relative flex items-center gap-2">
                        {image ? (
                            <div className="relative flex gap-2 min-w-0 w-[232px] h-4 rounded bg-center! bg-cover! transition-all">
                                <img className="h-4" src={image} />
                                <span className="text-xs h-5 text-primary text-ellipsis text-nowrap overflow-x-auto">
                                    {image}
                                </span>
                            </div>
                        ) : (
                            <CameraIcon className="h-4 w-4" />
                        )}
                        {!image && (
                            <div className="truncate w-[174px] flex-1">
                                Selecciona una imagen
                            </div>
                        )}
                    </div>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Selecciona una imagen de fondo</DialogTitle>
                </DialogHeader>
                <section className="flex flex-7 flex-col">
                    <section className="flex flex-col justify-center items-center h-[250px]">
                        {image ? (
                            <img className="h-[224px]" src={image} alt="" />
                        ) : (
                            <section className="w-[75%] h-[200px] flex flex-col items-center justify-center bg-gray-200 text-gray-500 rounded-lg">
                                <CameraIcon className="w-16 h-16" />
                                Sin vista previa
                            </section>
                        )}
                    </section>
                    <FormGalleryUploadImageComponent
                        selectedImageUrl={image ?? ''}
                        defaultOpen={true}
                        afterUpload={(result) => {
                            if (result.status === 'success')
                                setImage(result.data.url)
                        }}
                    />
                </section>
            </DialogContent>
        </Dialog>
    )
}

export { ImagePicker }
