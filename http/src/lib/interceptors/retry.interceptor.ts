import { Injectable, Inject } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { retry } from 'rxjs/operators';
import { HTTP_CONFIG, HttpConfig } from '../http.model';

@Injectable()
export class RetryInterceptor implements HttpInterceptor {

    constructor(@Inject(HTTP_CONFIG) private httpConfig: HttpConfig) { }
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        return next.handle(req).pipe(retry(this.httpConfig.retryCount || 0));
    }

}
