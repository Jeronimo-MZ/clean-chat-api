const env = {
    port: Number(process.env.PORT) || 3333,
    mongoUrl: process.env.MONGO_URL || "mongodb://localhost:27017/chat-app-api",
    logger: {
        enabled: Boolean(process.env.LOGGER_ENABLED) || true,
        level: process.env.LOGGER_LEVEL || "info",
    },
};

Object.freeze(env);

export { env };
