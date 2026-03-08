import { jsonEvent, JSONEventType } from "@kurrent/kurrentdb-client";
import { randomUUID } from "crypto";
import { Router, Request, Response } from "express";
import EventClient from "../clients/eventClient";
import { CartEventTypes, StoreEventTypes } from "../events";

// https://docs.kurrent.io/clients/node/v1.1/getting-started.html#creating-an-event

const events: StoreEventTypes[] = [
  {
    type: "HelloEvent",
    subject: "hello-event",
    message: "Hello Booster",
  },
];

const STREAM_NAME = "hello-event-stream";

export default function exampleRouter(client: EventClient) {
  const router = Router();

  router.get("/", async (req: Request, res: Response) => {
    const events = client.read(STREAM_NAME, { maxCount: 100 });
    const eventsArray = [];
    for await (const event of events) {
      console.log(event);
      eventsArray.push(event);
    }

    res.send(eventsArray);
  });

  router.post("/", async (req: Request, res: Response) => {
    const r = await client.emit(STREAM_NAME, events);

    res.send(
      "Hello event created successfully. Check the kurrentdb dashboard to see the event. http://localhost:2113/web/index.html#/streams"
    );
  });

  return router;
}
