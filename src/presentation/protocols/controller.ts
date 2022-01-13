import { HttpResponse } from "./http";

export interface Controller<Req = any, Res = any> {
    handle(request: Req): Promise<HttpResponse<Res>>;
}
