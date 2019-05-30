import { Injectable, Injector, Inject } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpResponse } from '@angular/common/http';
import { finalize, tap } from 'rxjs/operators';
import { HTTP_CONFIG, HttpConfig } from '../http.model';

@Injectable()
export class SpinnerInterceptor implements HttpInterceptor {
    constructor(private injector: Injector, @Inject(HTTP_CONFIG) private httpConfig: HttpConfig) { }

    get spinnerService() {
        return this.httpConfig.spinnerService ? this.injector.get(this.httpConfig.spinnerService) : { show: () => { }, hide: () => { } };
    }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        const started = Date.now();
        let ok: string;

        return next.handle(req)
            .pipe(
                tap(event => this.spinnerService.show()),
                finalize(() => this.spinnerService.hide())
            );
    }
}