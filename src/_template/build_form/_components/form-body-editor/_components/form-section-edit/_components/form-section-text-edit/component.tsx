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
import {
    AutoSaveContext,
    DirtyEntry,
} from '@/_provider/auto-save/auto-save-provider'
import { codeBlockOptions } from '@blocknote/code-block'
import {
    BlockNoteEditor,
    BlockNoteSchema,
    createCodeBlockSpec,
} from '@blocknote/core'
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
import { use, useEffect, useRef } from 'react'

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

interface TextEditorLatestValues {
    markDirty: (entry: DirtyEntry) => void
    lastContent: string
    id: string
    order: string
    formId: string
    sectionId: string
}

export function FormSectionTextEditComponent(
    props: IFormSectionTextEditComponentProps
) {
    const { data, sectionId, formId } = props
    const { markDirty } = use(AutoSaveContext)

    const latestValues = useRef<TextEditorLatestValues>({
        markDirty,
        lastContent: data.content,
        id: data.id,
        order: data.order,
        formId,
        sectionId,
    })
    latestValues.current = {
        ...latestValues.current,
        markDirty,
        id: data.id,
        order: data.order,
        formId,
        sectionId,
    }

    const editor = useCreateBlockNote({
        dictionary: es,
        initialContent: JSON.parse(data.content) ?? {},
        schema: BlockNoteSchema.create().extend({
            blockSpecs: {
                codeBlock: createCodeBlockSpec(codeBlockOptions),
            },
        }),
    })

    useEffect(() => {
        editor.onChange(() => {
            const newContent = JSON.stringify(editor.document)
            if (newContent === latestValues.current.lastContent) return
            latestValues.current.lastContent = newContent

            const { id, formId, sectionId, order } = latestValues.current
            latestValues.current.markDirty({
                type: 'text',
                id,
                formId,
                sectionId,
                payload: {
                    id,
                    content: newContent,
                    section_id: sectionId,
                    form_id: formId,
                    order,
                },
            })
        })
    }, [editor])

    return (
        <section className="relative flex flex-col mt-2">
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
