import { Injectable, Injector, Inject } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpResponse } from '@angular/common/http';
import { finalize, tap } from 'rxjs/operators';
import { HTTP_CONFIG, HttpConfig } from '../http.model';

@Injectable()
export class LoggerInterceptor implements HttpInterceptor {
    constructor(private injector: Injector, @Inject(HTTP_CONFIG) private httpConfig: HttpConfig) { }

    get loggerService() {
        return this.httpConfig.loggerService ? this.injector.get(this.httpConfig.loggerService) : { log: () => { } };
    }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        const started = Date.now();
        let ok: string;

        return next.handle(req)
            .pipe(
                tap(
                    event => ok = event instanceof HttpResponse ? 'succeeded' : '',
                    error => ok = 'failed'
                ),
                finalize(() => {
                    const elapsed = Date.now() - started;
                    const msg = `${req.method} "${req.urlWithParams}" ${ok} in ${elapsed} ms.`;
                    this.loggerService.log(msg);
                })
            );
    }
}