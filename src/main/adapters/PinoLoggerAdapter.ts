import Pino from "pino";

import { env } from "@/main/config";

export const pinoLogger = Pino({
    enabled: env.logger.enabled,
    level: env.logger.level,
    name: "chat-app-api",
});
