'use client'
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
import { es } from '@blocknote/core/locales'
import { useCreateBlockNote } from '@blocknote/react'
import { BlockNoteView } from '@blocknote/shadcn'
import { IText } from '@db/types'

interface ITextSectionComponentProps {
    data: IText
}

export function TextSectionComponent(props: ITextSectionComponentProps) {
    const { data } = props

    const editor = useCreateBlockNote({
        dictionary: es,
        initialContent: JSON.parse(data.content) ?? {},
    })

    return (
        <div className="w-full flex flex-col items-center justify-center p-4">
            <BlockNoteView
                editor={editor}
                slashMenu={false}
                editable={false}
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
            />
        </div>
    )
}
