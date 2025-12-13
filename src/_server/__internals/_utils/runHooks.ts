export async function runHooks(hooks: Array<() => void | Promise<void>>) {
    for (const fn of hooks) await fn()
}
