import { Button } from '@/_components/ui/button'
import { IFullForm, IFullQuestion } from '@/_server/domains/form/getFullForms'
import { IResultResponse } from '@/_template/form_result/types'
import { createColumnHelper } from '@tanstack/table-core'
import { useMemo } from 'react'

export function useColumnsResultResponse(data: IFullForm) {
    const questions: IFullQuestion[] = data.pages
        .map((page) => page.sections.map((section) => section.questions[0]))
        .flat()
        .filter((question) => question != null)

    const questionColumns = useMemo(
        () =>
            questions.map((question, idx) =>
                columnHelper.accessor((result) => result.questions[idx], {
                    id: question.id,
                    header: () => {
                        return (
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-500">
                                    ({question.name})
                                </span>
                                <span>{question.content}</span>
                            </div>
                        )
                    },
                    cell: (info) => {
                        return (
                            info.row.original.questions[idx].answer ??
                            info.row.original.questions[idx].choices
                                .map((choice) =>
                                    choice.is_free_text
                                        ? choice.free_text_answer
                                        : choice.content
                                )
                                .join(',') ??
                            'No answer'
                        )
                    },
                })
            ),
        [questions]
    )

    const actionColumns = useMemo(
        () => [
            columnHelper.display({
                id: 'edit-action',
                header: 'Acciones',
                cell: (info) => {
                    return (
                        <Button
                            size="sm"
                            variant="default"
                            onClick={() => {
                                // Implement edit action here
                                console.log(
                                    'Edit action for:',
                                    info.row.original
                                )
                            }}
                        >
                            Editar
                        </Button>
                    )
                },
            }),
        ],
        []
    )

    return useMemo(
        () => [...defaultColumns, ...questionColumns, ...actionColumns],
        [actionColumns, questionColumns]
    )
}

const columnHelper = createColumnHelper<IResultResponse>()

const defaultColumns = [
    columnHelper.accessor('respondent_name', {
        header: 'Nombre del Encuestado',
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('is_partial_response', {
        header: 'Es una respuesta parcial?',
        cell: (info) => (info.getValue() ? 'Yes' : 'No'),
    }),
    columnHelper.accessor('submitted_at', {
        header: 'Enviado el',
        cell: (info) => new Date(info.getValue()).toLocaleString(),
    }),
]
