import { HttpResponse } from "../protocols";

export const badRequest = (error: Error): HttpResponse<any> => ({
    statusCode: 400,
    body: error,
});
