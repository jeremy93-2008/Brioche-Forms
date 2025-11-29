import { ExternalToast, toast as toastSonner } from 'sonner'

export function useToast() {
    const showToast = (
        type: 'success' | 'error' | 'info' | 'warning' | 'loading',
        message: string,
        data: ExternalToast
    ) => {
        toastSonner[type](message, data)
    }

    return {
        success: (message: string, data: ExternalToast = {}) =>
            showToast('success', message, data),
        error: (message: string, data: ExternalToast = {}) =>
            showToast('error', message, data),
        info: (message: string, data: ExternalToast = {}) =>
            showToast('info', message, data),
        warning: (message: string, data: ExternalToast = {}) =>
            showToast('warning', message, data),
        loading: (message: string, data: ExternalToast = {}) =>
            showToast('loading', message, data),
    }
}
