'use client'
import { AutoSaveProvider } from '@/_provider/auto-save/auto-save-provider'
import { SingleFormSelectedContext } from '@/_provider/forms/single-form-selected'
import bulkUpdateAction from '@/_server/_handlers/actions/section/bulk-update'
import React, { use } from 'react'

export function AutoSaveWrapper(props: React.PropsWithChildren) {
    const { data } = use(SingleFormSelectedContext)!

    return (
        <AutoSaveProvider formId={data.id} saveAction={bulkUpdateAction}>
            {props.children}
        </AutoSaveProvider>
    )
}
