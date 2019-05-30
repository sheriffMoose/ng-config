import { NgModule, ModuleWithProviders } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { HeadersInterceptor } from './interceptors/headers.interceptor';
import { SpinnerInterceptor } from './interceptors/spinner.interceptor';
import { CacheInterceptor } from './interceptors/cache.interceptor';
import { RetryInterceptor } from './interceptors/retry.interceptor';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { LoggerInterceptor } from './interceptors/logger.interceptor';
import { HTTP_CONFIG, HttpConfig } from './http.model';

@NgModule({
	imports: [
		HttpClientModule
	]
})
export class HttpConfigModule {
	static forRoot(config: HttpConfig): ModuleWithProviders {
		return {
			ngModule: HttpConfigModule,
			providers: [
				{ provide: HTTP_CONFIG, useValue: config },
				{ provide: HTTP_INTERCEPTORS, useClass: HeadersInterceptor, multi: true },
				{ provide: HTTP_INTERCEPTORS, useClass: SpinnerInterceptor, multi: true },
				{ provide: HTTP_INTERCEPTORS, useClass: CacheInterceptor, multi: true },
				{ provide: HTTP_INTERCEPTORS, useClass: RetryInterceptor, multi: true },
				{ provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
				{ provide: HTTP_INTERCEPTORS, useClass: LoggerInterceptor, multi: true },
			]
		};
	}
}
