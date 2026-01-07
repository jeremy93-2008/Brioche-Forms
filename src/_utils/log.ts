export const log = {
    debug: (...args: any[]) => {
        if (process.env.NODE_ENV !== 'production') {
            console.debug(...args)
        }
    },
    info: (...args: any[]) => {
        console.info(...args)
    },
    warn: (...args: any[]) => {
        console.warn(...args)
    },
    error: (...args: any[]) => {
        console.error(...args)
    },
}
