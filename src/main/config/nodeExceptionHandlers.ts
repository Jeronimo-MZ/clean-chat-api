import { pinoLogger } from "@/main/adapters";

import { ExitStatus } from "./constants/ExitStatus";

process.on("unhandledRejection", (reason, promise) => {
    pinoLogger.error(
        `App exiting due to an unhandled promise: ${promise} and reason: ${reason}`,
    );
    throw reason; // will be handled by uncaughtException handler
});

process.on("uncaughtException", error => {
    pinoLogger.error(`App exiting due to an uncaught exception: ${error}`);
    process.exit(ExitStatus.Failure);
});
