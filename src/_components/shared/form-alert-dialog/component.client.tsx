'use client'

import { FormAlertDialogContext } from '@/_components/shared/form-alert-dialog/_context/context'
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogMedia,
    AlertDialogTitle,
} from '@/_components/ui/alert-dialog'
import { Button } from '@/_components/ui/button'
import { cn } from '@/_utils/clsx-tw'
import { use } from 'react'

export function FormAlertDialogComponent() {
    const {
        isOpen,
        onOpenChange,
        type,
        title,
        description,
        icon,
        actionText,
        cancelText,
        actionButtonVariant,
        cancelButtonVariant,
        promiseWithResolvers,
    } = use(FormAlertDialogContext)

    const handleAction = () => () => {
        promiseWithResolvers?.resolve(true)
        onOpenChange(false)
    }

    const handleCancel = () => () => {
        promiseWithResolvers?.resolve(type === 'alert')
        onOpenChange(false)
    }

    return (
        <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    {icon && <AlertDialogMedia>{icon}</AlertDialogMedia>}
                    {title && <AlertDialogTitle>{title}</AlertDialogTitle>}
                    {(description || title) && (
                        <AlertDialogDescription
                            className={cn(!description && 'hidden')}
                        >
                            {description || title}
                        </AlertDialogDescription>
                    )}
                </AlertDialogHeader>
                <AlertDialogFooter>
                    {type === 'confirm' && (
                        <Button
                            variant={actionButtonVariant ?? 'default'}
                            onClick={handleAction()}
                        >
                            {actionText || 'Aceptar'}
                        </Button>
                    )}
                    <Button
                        variant={cancelButtonVariant ?? 'outline'}
                        onClick={handleCancel()}
                    >
                        {cancelText || 'Cancelar'}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
