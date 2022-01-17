import { HttpResponse } from "@/presentation/protocols";

export interface Middleware<Req = any, Res = any> {
    handle(httpRequest: Req): Promise<HttpResponse<Res>>;
}
