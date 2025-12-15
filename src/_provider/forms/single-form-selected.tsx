'use client'
import { createById } from '@/_provider/forms/services/createById'
import { deleteById } from '@/_provider/forms/services/deleteById'
import { updateById } from '@/_provider/forms/services/updateById'
import { IFullForm } from '@/_server/domains/form/getFullForms'
import React, { createContext, useOptimistic } from 'react'

export type IUpdateOptimisticDataOpts =
    | {
          type: 'update' | 'delete'
      }
    | {
          type: 'create'
          parentId: string
          fieldName: string
      }

export type IUpdateOptimisticData<T extends { id: string }> = {
    newUpdateValue: T
    opts: IUpdateOptimisticDataOpts
}

interface ISingleFormSelectedContext {
    data: IFullForm
    updateOptimisticData: (action: IUpdateOptimisticData<any>) => void
}

export const SingleFormSelectedContext =
    createContext<ISingleFormSelectedContext>({
        data: {} as unknown as IFullForm,
        updateOptimisticData: () => {},
    })

interface IFormSelectedProviderProps extends React.PropsWithChildren {
    value: IFullForm
}

export function SingleFormSelectedProvider(props: IFormSelectedProviderProps) {
    const { value } = props

    const [optimisticValue, setOptimisticValue] = useOptimistic<
        IFullForm,
        IUpdateOptimisticData<IFullForm>
    >(value, (state, payloadOptimisticValue) => {
        const { newUpdateValue, opts } = payloadOptimisticValue

        switch (opts.type) {
            case 'update':
                const newState = updateById(state, newUpdateValue)
                return structuredClone(newState)
            case 'delete':
                const stateAfterDelete = deleteById(state, newUpdateValue)
                return structuredClone(stateAfterDelete)
            case 'create':
                const stateAfterCreate = createById(
                    state,
                    payloadOptimisticValue
                )
                return structuredClone(stateAfterCreate)
            default:
                break
        }

        return state
    })

    return (
        <SingleFormSelectedContext
            value={{
                data: optimisticValue,
                updateOptimisticData: setOptimisticValue,
            }}
        >
            {props.children}
        </SingleFormSelectedContext>
    )
}
