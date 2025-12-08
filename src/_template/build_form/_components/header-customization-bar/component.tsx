import { Button } from '@/_components/ui/button'
import { CogIcon, Paintbrush2, Play, UploadCloud } from 'lucide-react'

export function HeaderCustomizationBarComponent() {
    // style, settings, preview, publish buttons
    return (
        <section className="flex items-center justify-between w-full">
            <div className="flex items-center w-full gap-2 mx-20">
                <h1 className="text-xl font-montserrat">
                    Constructor de formulario
                </h1>
            </div>
            <div className="flex items-center justify-end font-sans gap-2 mx-16 my-2">
                <Button variant="link">
                    <Paintbrush2 />
                    Styles
                </Button>
                <Button variant="link">
                    <CogIcon />
                    Settings
                </Button>
                <Button variant="link">
                    <Play />
                    Preview
                </Button>
                <Button variant="link">
                    <UploadCloud />
                    Publish
                </Button>
            </div>
        </section>
    )
}
