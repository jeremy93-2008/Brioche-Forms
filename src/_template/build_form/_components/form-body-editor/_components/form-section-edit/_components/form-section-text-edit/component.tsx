import * as Button from '@/_components/ui/button'
import * as Card from '@/_components/ui/card'
import * as Input from '@/_components/ui/input'
import * as Popover from '@/_components/ui/popover'
import * as Select from '@/_components/ui/select'
import * as Tabs from '@/_components/ui/tabs'
import '@blocknote/shadcn/style.css'
import { ToastMessages } from '@/_constants/toast'
import { useServerActionState } from '@/_hooks/useServerActionState'
import EditTextAction from '@/_server/actions/text/update'
import { showToastFromResult } from '@/_utils/showToastFromResult'
import { BlockNoteEditor } from '@blocknote/core'
import { filterSuggestionItems } from '@blocknote/core/extensions'
import { es } from '@blocknote/core/locales'
import {
    DefaultReactSuggestionItem,
    getDefaultReactSlashMenuItems,
    SuggestionMenuController,
    useCreateBlockNote,
} from '@blocknote/react'
import { BlockNoteView } from '@blocknote/shadcn'
import { useEffect, useState } from 'react'
import { IText } from '../../../../../../../../../db/types'

interface IFormSectionTextEditComponentProps {
    data: IText
    sectionId: string
    formId: string
}

const excludeBlocks = ['Imagen', 'Vídeo', 'Audio', 'Archivo', 'Emoji']

const getCustomSlashMenuItems = (
    editor: BlockNoteEditor
): DefaultReactSuggestionItem[] => [
    ...getDefaultReactSlashMenuItems(editor).filter((block) => {
        return excludeBlocks.every((blockItem) => blockItem !== block.title)
    }),
]

export function FormSectionTextEditComponent(
    props: IFormSectionTextEditComponentProps
) {
    const { data, sectionId, formId } = props
    const [isContentModified, setIsContentModified] = useState(false)

    const { isPending, runAction } = useServerActionState(EditTextAction)

    const editor = useCreateBlockNote({
        dictionary: es,
        initialContent: JSON.parse(data.content) ?? {},
    })

    const onSaveContent = async () => {
        const result = await runAction({
            id: data.id,
            content: JSON.stringify(editor.document),
            section_id: sectionId,
            order: '1',
            form_id: formId,
        })

        showToastFromResult(result, ToastMessages.genericSuccess)

        setIsContentModified(false)
    }

    useEffect(() => {
        editor.onChange(() => {
            setIsContentModified(true)
        })
    }, [editor])

    return (
        <section className="relative flex flex-col ">
            <section className="absolute flex justify-end top-[-2rem] right-0">
                <Button.Button
                    onClick={onSaveContent}
                    className="mb-4"
                    size="sm"
                    isLoading={isPending}
                    disabled={!isContentModified}
                >
                    Guardar
                </Button.Button>
            </section>
            <BlockNoteView
                editor={editor}
                slashMenu={false}
                shadCNComponents={{
                    Button,
                    Tabs,
                    Card,
                    Input,
                    Popover,
                    Select,
                }}
            >
                <SuggestionMenuController
                    triggerCharacter="/"
                    getItems={async (query) =>
                        filterSuggestionItems(
                            getCustomSlashMenuItems(editor),
                            query
                        )
                    }
                />
            </BlockNoteView>
        </section>
    )
}
