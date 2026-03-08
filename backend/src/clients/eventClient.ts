import {
  EventData,
  jsonEvent,
  JSONEventType,
  KurrentDBClient,
  ReadStreamOptions,
  SubscribeToStreamOptions,
} from "@kurrent/kurrentdb-client";
import { CloudEvent, CloudEventV1 } from "cloudevents";
import { StoreEventTypes } from "../events";

export type StreamState =
  | "any" // No check - allows both creates and updates
  | "no_stream" // Stream must not exist (create only)
  | "stream_exists" // Stream must exist (update only)
  | bigint; // Exact revision number

export type EmitOptions = {
  streamState?: StreamState;
};
/**
 * EventClient is a client for posting and querying events from an event store
 */
class EventClient {
  constructor(connectionString: string | undefined, source: string) {
    if (!connectionString) {
      throw new Error("EVENT_STORE_CONNECTION_STRING is not set");
    }
    this.kurrentClient = KurrentDBClient.connectionString(connectionString);
    this.source = source;
  }
  async emit(
    streamName: string,
    events: StoreEventTypes[],
    options?: EmitOptions
  ): Promise<boolean> {
    const mappedEvents: EventData<JSONEventType>[] = events
      .map(
        ({ type, subject, ...data }) =>
          new CloudEvent({ type, data, source: this.source, subject })
      )
      .map((event) =>
        jsonEvent({
          type: event.type,
          data: event.toJSON(),
        })
      );

    const appendOptions = options?.streamState
      ? {
          streamState: options.streamState,
        }
      : undefined;

    const result = await this.kurrentClient.appendToStream(
      streamName,
      mappedEvents,
      appendOptions
    );
    return result.success;
  }

  // Private helper to convert a resolvedEvent to a StoreEventTypes
  private _toStoreEvent(resolvedEvent: any): StoreEventTypes | null {
    const { event } = resolvedEvent;
    if (!event) return null;
    const cloudEvent = new CloudEvent(event.data as CloudEventV1<undefined>);
    return {
      type: cloudEvent.type,
      subject: cloudEvent.subject ?? "",
      ...((cloudEvent.data || {}) as Record<string, unknown>),
    } as StoreEventTypes;
  }

  async *read(
    streamName: string,
    options?: ReadStreamOptions
  ): AsyncGenerator<
    StoreEventTypes & {
      revision: bigint;
      id: string;
      createdAt: Date | undefined;
    }
  > {
    const events = this.kurrentClient.readStream(streamName, {
      resolveLinkTos: true,
      ...options,
    });

    for await (const resolvedEvent of events) {
      const storeEvent = this._toStoreEvent(resolvedEvent);
      if (!storeEvent) continue;
      yield {
        ...storeEvent,
        revision: resolvedEvent.event?.revision ?? BigInt(0),
        id: resolvedEvent.event?.id ?? "",
        createdAt: resolvedEvent.event?.created,
      };
    }
  }

  async subscribe(
    streamName: string,
    callback: (
      id: string,
      revision: bigint,
      event: StoreEventTypes,
      streamId: string
    ) => Promise<void>,
    options?: SubscribeToStreamOptions
  ): Promise<void> {
    const events = this.kurrentClient.subscribeToStream(streamName, {
      resolveLinkTos: true,
      ...options,
    });
    for await (const resolvedEvent of events) {
      // console.log("Received event:", resolvedEvent);
      const { event, link } = resolvedEvent;

      const revision = link?.revision ?? event?.revision;

      if (!event) continue;
      const storeEvent = this._toStoreEvent(resolvedEvent);
      if (!storeEvent) continue;
      await callback(
        event.id,
        revision ?? BigInt(0),
        storeEvent,
        event.streamId
      );
    }
  }

  kurrentClient: KurrentDBClient;
  source: string;
}

export default EventClient;
