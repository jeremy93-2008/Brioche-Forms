'use client'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/_components/ui/select'
import { useUser } from '@stackframe/stack'
import { Layers } from 'lucide-react'

export function WorkspaceSelectorComponent() {
    const user = useUser()

    return (
        <Select defaultValue="(root)">
            <SelectTrigger className="w-72">
                <SelectValue placeholder="Selecciona un espacio de trabajo" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Espacios de trabajo</SelectLabel>
                    <SelectItem value="(root)">
                        <Layers />
                        Espacio de {user?.displayName}
                    </SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}
