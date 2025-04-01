import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import express from "express";
import server from "./server.js";

const logger = console;
const app = express();

let transport: SSEServerTransport;

app.get("/sse", async (req, res) => {
  logger.info("Received SSE connection request");
  transport = new SSEServerTransport("/messages", res);
  await server.connect(transport);
  logger.info("SSE transport connected");
});

app.post("/messages", async (req, res) => {
  logger.debug("Received message", req);
  await transport.handlePostMessage(req, res);
});

app.listen(3002, () =>
  logger.info("Australia FHIR Tools server listening on port 3002"),
);
