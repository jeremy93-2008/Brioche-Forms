'use client'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/_components/ui/tooltip'
import { useAsyncApi } from '@/_hooks/useAsyncApi/useAsyncApi'
import { http_api } from '@/_lib/http_api'
import { SingleFormSelectedContext } from '@/_provider/forms/single-form-selected'
import { formatDate } from '@/_utils/formatDate'
import { use } from 'react'

export function FormInfoRightComponent() {
    const { data } = use(SingleFormSelectedContext)!

    const { result: userResult } = useAsyncApi(http_api.user.getById, {
        id: data.author_id!,
    })

    return (
        <section className="flex flex-col items-end font-sans">
            <Tooltip>
                <TooltipTrigger>
                    <div className="flex items-center gap-2">
                        <span className="text-xs">
                            {userResult?.status === 'success' ? (
                                <img
                                    className="w-7 h-7 rounded-xl"
                                    src={userResult.data.profileImageUrl}
                                />
                            ) : null}
                        </span>
                    </div>
                </TooltipTrigger>
                <TooltipContent>
                    <span className="text-xs">
                        Creado por <strong>{data.author_name}</strong>, el{' '}
                        <strong>{formatDate(data.createdAt)}</strong>
                    </span>
                    <br />
                    <span className="text-xs">
                        Última modificación:{' '}
                        <strong>{formatDate(data.updatedAt)}</strong>
                    </span>
                </TooltipContent>
            </Tooltip>
        </section>
    )
}
