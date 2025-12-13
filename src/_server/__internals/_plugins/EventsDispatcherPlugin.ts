import { IServerPluginBuilder } from '@/_server/__internals/_plugins/types/type'

type MaybePromise<T> = T | Promise<T>

type AnyEventsHandler<P = unknown> = (payload: P) => MaybePromise<void>
type AnyEventsObject<P = unknown> = { handler: AnyEventsHandler<P> }
type AnyEventsValue<P = unknown> = AnyEventsHandler<P> | AnyEventsObject<P>

type EventsMap = Record<string, AnyEventsValue<any>>

type PayloadOfValue<V> =
    V extends AnyEventsHandler<infer P>
        ? P
        : V extends AnyEventsObject<infer P>
          ? P
          : never

type Subscriber<P> = (payload: P) => MaybePromise<void>

interface IEventsPluginReturnCb<E> {
    dispatch: <K extends keyof E>(
        name: K,
        payload: PayloadOfValue<E[K]>
    ) => Promise<void>
    events: Array<{
        name: keyof E
        handler: any
    }>
}

export function EventsDispatcherPlugin<const E extends EventsMap>(
    events: E
): IServerPluginBuilder<'events', IEventsPluginReturnCb<E>> {
    const eventsList = (
        Object.entries(events) as Array<[keyof E, E[keyof E]]>
    ).map(([name, value]) => {
        return {
            name,
            handler: typeof value === 'function' ? value : value.handler,
        }
    })

    return () => ({
        name: 'events',
        cb: () => {
            const dispatch = async <K extends keyof E>(
                name: K,
                payload: PayloadOfValue<E[K]>
            ) => {
                // First, call the main event handler
                const event = events[name]
                if (event) {
                    if (typeof event === 'function') {
                        await event(payload)
                    } else {
                        await (event as AnyEventsObject).handler(payload)
                    }
                }
            }

            const listOfEvents = () => eventsList

            return { dispatch, events: listOfEvents() }
        },
    })
}
