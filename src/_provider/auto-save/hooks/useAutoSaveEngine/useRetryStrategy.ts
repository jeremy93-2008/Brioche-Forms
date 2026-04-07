import { useRef } from 'react'

interface IRetryStrategyConfig {
    maxRetries: number
    delays: number[]
}

interface IUseRetryStrategyReturn {
    scheduleRetry: (callback: () => void) => void
    cancelRetry: () => void
    resetRetryCount: () => void
    cleanup: () => void
}

export function useRetryStrategy(config: IRetryStrategyConfig): IUseRetryStrategyReturn {
    const retryCount = useRef(0)
    const retryTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

    const cancelRetry = () => {
        if (retryTimer.current) {
            clearTimeout(retryTimer.current)
            retryTimer.current = null
        }
    }

    const resetRetryCount = () => {
        retryCount.current = 0
        cancelRetry()
    }

    const scheduleRetry = (callback: () => void) => {
        if (retryCount.current >= config.maxRetries) return

        const delay = config.delays[retryCount.current] ?? config.delays.at(-1) ?? 20000
        retryCount.current++

        retryTimer.current = setTimeout(() => {
            retryTimer.current = null
            callback()
        }, delay)
    }

    const cleanup = () => cancelRetry()

    return { scheduleRetry, cancelRetry, resetRetryCount, cleanup }
}
