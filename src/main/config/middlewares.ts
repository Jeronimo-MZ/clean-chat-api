import cors from "cors";
import { Express, json } from "express";

export const setupMiddlewares = (app: Express): void => {
    app.use(json());
    app.use(cors());
};
