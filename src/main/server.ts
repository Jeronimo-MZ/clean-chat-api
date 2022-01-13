import "dotenv/config";
import "@/main/config/nodeExceptionHandlers";

import { MongoHelper } from "@/infra/database/mongodb";
import { app, env, exitSignals, ExitStatus, setupRoutes } from "@/main/config";

const PORT = env.port;

setupRoutes(app);

const exitWithError = (error: any) => {
    console.error(`App exited with error: ${error}`);
    process.exit(ExitStatus.Failure);
};
(async () => {
    try {
        await MongoHelper.connect(env.mongoUrl);
        console.info("Connected to MongoDb");

        const currentApp = app.listen(PORT, () =>
            console.info(`server started on port: ${PORT}`),
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
                    console.info("App exited with success");
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
