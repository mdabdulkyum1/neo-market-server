import { Server } from "http";
import app from "./app";
import { startKeepAlive } from "./services/keepAlive";

const port = process.env.PORT || 5000;

async function main() {
  const server: Server = app.listen(port, () => {
    console.log("🚀 Neo Server is running on port", port);
    startKeepAlive();
  });

  // Graceful shutdown
  const exitHandler = () => {
    if (server) {
      server.close(() => {
        console.log("🛑 Server closed");
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  };

  const unexpectedErrorHandler = (error: unknown) => {
    console.error("💥 Unexpected error:", error);
    exitHandler();
  };

  process.on("uncaughtException", unexpectedErrorHandler);
  process.on("unhandledRejection", unexpectedErrorHandler);
  process.on("SIGTERM", () => {
    console.log("🔄 SIGTERM received");
    if (server) {
      server.close();
    }
  });
}

main();
