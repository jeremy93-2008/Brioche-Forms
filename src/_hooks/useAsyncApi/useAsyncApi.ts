import { ISingleApiRequest } from '@/_lib/http_api'
import { IReturnAction } from '@/_server/_handlers/actions/types'
import useSWR from 'swr'

export function useAsyncApi<TData, TInput>(
    request: ISingleApiRequest<TData, TInput>,
    data?: TInput
) {
    const swrResponse = useSWR([request._key, data], async (args) =>
        request.fn(args[1])
    )

    return {
        ...swrResponse,
        data:
            swrResponse.data?.status === 'success'
                ? (swrResponse.data.data as TData)
                : null,
        result: swrResponse.data as IReturnAction<TData> | undefined,
    }
}
