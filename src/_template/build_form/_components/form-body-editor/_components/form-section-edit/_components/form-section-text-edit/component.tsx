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
import { AutoSaveContext } from '@/_provider/auto-save/auto-save-provider'
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

export function FormSectionTextEditComponent(
    props: IFormSectionTextEditComponentProps
) {
    const { data, sectionId, formId } = props
    const { markDirty } = use(AutoSaveContext)
    const lastContentRef = useRef(data.content)
    const markDirtyRef = useRef(markDirty)
    markDirtyRef.current = markDirty

    const dataRef = useRef({ id: data.id, order: data.order, formId, sectionId })
    dataRef.current = { id: data.id, order: data.order, formId, sectionId }

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
            if (newContent === lastContentRef.current) return
            lastContentRef.current = newContent
            const d = dataRef.current
            markDirtyRef.current({
                type: 'text',
                id: d.id,
                formId: d.formId,
                sectionId: d.sectionId,
                payload: {
                    id: d.id,
                    content: newContent,
                    section_id: d.sectionId,
                    form_id: d.formId,
                    order: d.order,
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
