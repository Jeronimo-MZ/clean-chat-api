export type HttpResponse<T> = {
    statusCode: number;
    body: T | Error;
};
