import "dotenv/config";
import "@/main/config/nodeExceptionHandlers";

import { MongoHelper } from "@/infra/database/mongodb";
import {
    env,
    exitSignals,
    ExitStatus,
    setupLogger,
    setupRoutes,
} from "@/main/config";

import { pinoLogger } from "./adapters";
import { expressApp, httpApp } from "./config/socket";

const PORT = env.port;

setupLogger(expressApp);
setupRoutes(expressApp);

const exitWithError = (error: any) => {
    pinoLogger.error(`App exited with error: ${error}`);
    process.exit(ExitStatus.Failure);
};
(async () => {
    try {
        await MongoHelper.connect(env.mongoUrl);
        pinoLogger.info("Connected to MongoDb");

        const currentApp = httpApp.listen(PORT, () =>
            pinoLogger.info(`server started on port: ${PORT}`),
        );

        for (const exitSignal of exitSignals) {
            process.on(exitSignal, async () => {
                try {
                    await MongoHelper.disconnect();
                    await new Promise((resolve, reject) => {
                        currentApp.close(error =>
                            error ? reject(error) : resolve(true),
                        );
                    });
                    pinoLogger.info("App exited with success");
                    process.exit(ExitStatus.Success);
                } catch (error) {
                    exitWithError(error);
                }
            });
        }
    } catch (error) {
        exitWithError(error);
    }
})();
