import { IFullForm } from '@/_server/domains/form/getFullForms'

export type IFullQuestions = IFullForm['pages'][0]['sections'][0]['questions']

export type IFullQuestion =
    IFullForm['pages'][0]['sections'][0]['questions'][number]
