import * as Avatar from '@/_components/ui/avatar'
import * as Badge from '@/_components/ui/badge'
import * as Button from '@/_components/ui/button'
import * as Card from '@/_components/ui/card'
import * as DropdownMenu from '@/_components/ui/dropdown-menu'
import * as Form from '@/_components/ui/form'
import * as Input from '@/_components/ui/input'
import * as Label from '@/_components/ui/label'
import * as Popover from '@/_components/ui/popover'
import * as Select from '@/_components/ui/select'
import * as Skeleton from '@/_components/ui/skeleton'
import * as Tabs from '@/_components/ui/tabs'
import * as Toggle from '@/_components/ui/toggle'
import * as Tooltip from '@/_components/ui/tooltip'
import { ToastMessages } from '@/_constants/toast'
import { useServerActionState } from '@/_hooks/useServerActionState'
import EditTextAction from '@/_server/_handlers/actions/text/update'
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
import { IText } from '@db/types'
import { useEffect, useState } from 'react'

import '@blocknote/core/fonts/inter.css'
import '@blocknote/shadcn/style.css'

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
            order: 'latest',
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
                    DropdownMenu,
                    Tooltip,
                    Form,
                    Label,
                    Avatar,
                    Badge,
                    Toggle,
                    Skeleton,
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
