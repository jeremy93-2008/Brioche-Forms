import { IReturnAction } from '@/_server/_handlers/actions/types'

/**
 * Custom hook that provides utility functions for handling return actions.
 */
export function useReturnActionUtils() {
    /**
     * Merges multiple `IReturnAction` results into a single result.
     *
     * - If any of the results have a status of 'error', the merged result will have a status of 'error',
     *   combining all error messages and traces.
     * - If no errors are present but some results have a status of 'idle', the merged result will have a status of 'idle'.
     * - If all results are successful, the merged result will have a status of 'success' and combine the data from all results.
     *
     * @param {...IReturnAction<any>[]} results - An array of `IReturnAction` objects to merge.
     * @returns {IReturnAction<any> | null} - The merged `IReturnAction` object, or `null` if no results are provided.
     */
    const merge = <T extends any[]>(
        ...results: { [K in keyof T]: IReturnAction<T[K]> }
    ): IReturnAction<T> | null => {
        if (results.length === 0) return null
        const erroredResults = results.filter((res) => res.status === 'error')
        const idledResults = results.filter((res) => res.status === 'idle')

        const hasSomeErrors = erroredResults.length > 0
        const hasSomeIdle = idledResults.length > 0

        if (hasSomeErrors) {
            return {
                status: 'error',
                error: {
                    message: erroredResults
                        .map((res) => res.error.message)
                        .join('\n'),
                    trace: erroredResults
                        .map((res) => res.error.trace)
                        .join('\n'),
                },
            }
        } else if (hasSomeIdle) {
            return {
                status: 'idle',
            }
        }

        return {
            status: 'success',
            data: results.map((res) =>
                res.status === 'success' ? res.data : null
            ) as T,
        }
    }

    return { merge }
}
