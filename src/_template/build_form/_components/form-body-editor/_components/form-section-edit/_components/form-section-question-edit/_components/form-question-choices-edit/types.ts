import { IFullForm } from '@/_server/domains/form/getFullForms'

export type IFullChoices =
    IFullForm['pages'][0]['sections'][0]['questions'][0]['choices']
