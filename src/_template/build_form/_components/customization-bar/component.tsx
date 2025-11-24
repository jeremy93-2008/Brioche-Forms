import { Button } from '@/_components/ui/button'
import { CogIcon, Paintbrush2, Play, UploadCloud } from 'lucide-react'

export function CustomizationBarComponent() {
    // style, settings, preview, publish buttons
    return (
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
    )
}
