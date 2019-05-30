import { Injectable, Inject } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpHeaders } from '@angular/common/http';
import { HTTP_CONFIG, HttpConfig } from '../http.model';

@Injectable()
export class HeadersInterceptor implements HttpInterceptor {

    constructor(@Inject(HTTP_CONFIG) private httpConfig: HttpConfig) { }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        let headers = req.headers;
        Object.keys(this.httpConfig.defaultHeaders || {}).forEach(key => {
            headers = headers.set(key, this.httpConfig.defaultHeaders[key]);
        });

        const newReq = req.clone({ headers });
        return next.handle(newReq);
    }

}
