import { useRef } from 'react'

interface IUseDebouncedCallbackReturn {
    schedule: (callback: () => void) => void
    cancel: () => void
    flushSync: (callback: () => void) => void
    cleanup: () => void
}

export function useDebouncedCallback(delayMs: number): IUseDebouncedCallbackReturn {
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

    const cancel = () => {
        if (timer.current) {
            clearTimeout(timer.current)
            timer.current = null
        }
    }

    const schedule = (callback: () => void) => {
        cancel()
        timer.current = setTimeout(() => {
            timer.current = null
            callback()
        }, delayMs)
    }

    const flushSync = (callback: () => void) => {
        cancel()
        callback()
    }

    const cleanup = () => cancel()

    return { schedule, cancel, flushSync, cleanup }
}
