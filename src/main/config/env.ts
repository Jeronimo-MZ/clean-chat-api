const env = {
    port: Number(process.env.PORT) || 3333,
    mongoUrl: process.env.MONGO_URL || "mongodb://localhost:27017/chat-app-api",
};

Object.freeze(env);

export { env };
