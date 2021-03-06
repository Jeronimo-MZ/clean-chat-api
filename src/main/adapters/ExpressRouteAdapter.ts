import { Request, Response } from "express";

import { Controller } from "@/presentation/protocols";

export const adaptRoute = (controller: Controller) => {
    return async (request: Request, response: Response): Promise<Response> => {
        const req = {
            ...(request.body || {}),
            ...(request.params || {}),
            ...(request.query || {}),
            accessToken: request.headers["x-access-token"],
            file: request.file,
        };
        const { statusCode, body } = await controller.handle(req);
        if (statusCode >= 400) {
            return response.status(statusCode).json({ error: body.message });
        }
        return response.status(statusCode).json(body);
    };
};
