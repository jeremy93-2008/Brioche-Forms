type AnyEvents = Record<string, AnyEventsValue>

type AnyEventsValue =
    | AnyEventsHandler
    | {
          handler: AnyEventsHandler
      }

type AnyEventsHandler = (payload: any) => void | Promise<void>

export function EventsPlugin(events: AnyEvents) {
    const staticByName = new Map<string, Array<(payload: any) => any>>()
    for (const ev of Object.entries(events)) {
        const [key, value] = ev
        const arr = staticByName.get(key) ?? []
        arr.push(value[key as keyof typeof value])
        staticByName.set(key, arr)
    }

    return () => ({
        name: 'events',
        cb: () => {
            const dynamicByName = new Map<string, Set<(payload: any) => any>>()

            const subscribe = (name: string, fn: (payload: any) => any) => {
                const set = dynamicByName.get(name) ?? new Set()
                set.add(fn)
                dynamicByName.set(name, set)
                return () => set.delete(fn) // convenience
            }

            const unsubscribe = (name: string, fn: (payload: any) => any) => {
                dynamicByName.get(name)?.delete(fn)
            }

            const publish = async (name: string, payload: any) => {
                const staticHandlers = staticByName.get(name) ?? []
                const dynamicHandlers = [
                    ...(dynamicByName.get(name) ?? new Set()),
                ]
                for (const h of [...staticHandlers, ...dynamicHandlers]) {
                    await h(payload)
                }
            }

            const listOfEvents = () => [...staticByName.keys()]

            return { publish, subscribe, unsubscribe, listOfEvents }
        },
    })
}
