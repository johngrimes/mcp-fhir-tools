import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import server from "./server.js";

const logger = console;

async function runServer() {
  try {
    const transport = new StdioServerTransport(process.stdin, process.stdout);
    await server.connect(transport);
  } catch (error) {
    logger.error(
      `Failed to start server:\n${JSON.stringify(getErrorDetails(error), null, 2)}`,
    );
    throw error;
  }
}

function getErrorDetails(error: unknown) {
  return {
    message: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : "No stack trace available",
    errorObject:
      error instanceof Error
        ? Object.getOwnPropertyNames(error).reduce(
            (obj: any, prop) => {
              obj[prop] = (error as any)[prop];
              return obj;
            },
            {} as Record<string, unknown>,
          )
        : error,
  };
}

// Add signal handlers for graceful shutdown
["SIGINT", "SIGTERM", "SIGQUIT"].forEach((signal) => {
  process.on(signal, () => {
    logger.info(
      `Received ${signal} signal - shutting down Australia FHIR Tools MCP Server`,
    );
    process.stdin.destroy();
    process.exit(0);
  });
});

process.stdin.on("error", (err) => {
  logger.error(`stdin error: ${err}`);
});

process.stdout.on("error", (err) => {
  logger.error(`stdout error: ${err}`);
});

runServer().catch((error) => {
  logger.error(
    `Fatal error running server:\n${JSON.stringify(getErrorDetails(error), null, 2)}`,
  );
  process.exit(1);
});
