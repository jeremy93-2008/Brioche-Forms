import {
    FormFieldEditDialog,
    FormFieldEditDialogContent,
    FormFieldEditDialogTrigger,
} from '@/_components/shared/form-field-edit-dialog/component.client'
import { Button } from '@/_components/ui/button'
import { FieldSet } from '@/_components/ui/field'
import { Separator } from '@/_components/ui/separator'
import { SingleFormSelectedContext } from '@/_provider/forms/single-form-selected'
import updateFormAction from '@/_server/_handlers/actions/form/update'
import { DraftModeFieldComponent } from '@/_template/build_form/_components/header-customization-bar/_components/form-preferences-popup/_components/1.draft-mode-field/component'
import { PublishStatusFieldComponent } from '@/_template/build_form/_components/header-customization-bar/_components/form-preferences-popup/_components/2.publish-status-field/component'
import { ResponseSettingsFieldsComponent } from '@/_template/build_form/_components/header-customization-bar/_components/form-preferences-popup/_components/3.response-settings-fields/component'
import { ResponseLimitsFieldsComponent } from '@/_template/build_form/_components/header-customization-bar/_components/form-preferences-popup/_components/4.response-limits-fields/component'
import { PartialResponseFieldComponent } from '@/_template/build_form/_components/header-customization-bar/_components/form-preferences-popup/_components/5.partial-response-field/component'
import { ShuffleQuestionsFieldComponent } from '@/_template/build_form/_components/header-customization-bar/_components/form-preferences-popup/_components/6.shuffle-questions-field/component'
import { QuestionnaireDisplayModeFieldComponent } from '@/_template/build_form/_components/header-customization-bar/_components/form-preferences-popup/_components/7.questionnaire-display-mode-field/component'
import { CustomMessagesFieldsComponent } from '@/_template/build_form/_components/header-customization-bar/_components/form-preferences-popup/_components/8.custom-messages-fields/component'
import { IForm } from '@db/types'
import { CogIcon } from 'lucide-react'
import { use } from 'react'

export function FormPreferencesPopupComponent() {
    const { data } = use(SingleFormSelectedContext)!

    return (
        <FormFieldEditDialog
            title="Ajustes del formulario"
            serverAction={updateFormAction}
        >
            <FormFieldEditDialogTrigger>
                <Button variant="link">
                    <CogIcon />
                    Ajustes
                </Button>
            </FormFieldEditDialogTrigger>
            <FormFieldEditDialogContent<IForm> className="min-w-[620px]!">
                {({ register, control }) => (
                    <>
                        <div className="pointer-events-none absolute bg-linear-to-b from-card to-card/0 h-2 w-full -mt-1 left-0" />
                        <FieldSet className="max-h-[45vh] min-h-[300px] pl-2 pr-5 py-6 overflow-y-auto">
                            <input
                                type="hidden"
                                value={data.id}
                                {...register('id')}
                            />
                            <DraftModeFieldComponent
                                control={control}
                                defaultValue={data.isDraft || 0}
                            />
                            <Separator />
                            <PublishStatusFieldComponent
                                control={control}
                                defaultValue={data.isPublished || 0}
                            />
                            <Separator />
                            <ResponseSettingsFieldsComponent
                                control={control}
                                data={data}
                            />
                            <Separator className="mb-2" />
                            <ResponseLimitsFieldsComponent
                                control={control}
                                data={data}
                            />
                            <Separator className="mb-2" />
                            <PartialResponseFieldComponent
                                control={control}
                                defaultValue={data.savePartialResponses || 0}
                            />
                            <Separator className="mb-2" />
                            <ShuffleQuestionsFieldComponent
                                control={control}
                                defaultValue={data.shuffleQuestions || 0}
                            />
                            <Separator className="mb-2" />
                            <QuestionnaireDisplayModeFieldComponent
                                control={control}
                                defaultValue={data.questionnaireDisplayMode}
                            />
                            <Separator className="mb-2" />
                            <CustomMessagesFieldsComponent
                                control={control}
                                data={data}
                            />
                        </FieldSet>
                        <div className="pointer-events-none absolute bg-linear-to-t from-card to-card/0 h-2 w-full -mt-1 left-0" />
                    </>
                )}
            </FormFieldEditDialogContent>
        </FormFieldEditDialog>
    )
}
