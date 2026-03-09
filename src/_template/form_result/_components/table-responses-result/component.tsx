'use client'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableHeadRow,
    TableRow,
} from '@/_components/ui/table'
import { SingleFormSelectedContext } from '@/_provider/forms/single-form-selected'
import { useColumnsResultResponse } from '@/_template/form_result/_components/table-responses-result/_hooks/useColumnsResultResponse'
import { useTransformResultResponseFormData } from '@/_template/form_result/_components/table-responses-result/_hooks/useTransformResultResponseFormData'
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table'
import { use } from 'react'

export function FormResultTableResponsesComponent() {
    const { data } = use(SingleFormSelectedContext)

    const responses = useTransformResultResponseFormData(data)

    const columns = useColumnsResultResponse(data)

    const table = useReactTable({
        columns,
        data: responses,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <div className="flex items-center justify-center font-sans gap-2 w-full my-2">
            <div className="flex overflow-x-auto overflow-y-auto w-full max-h-screen rounded-md border mx-28">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableHeadRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext()
                                                  )}
                                        </TableHead>
                                    )
                                })}
                            </TableHeadRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && 'selected'
                                    }
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
