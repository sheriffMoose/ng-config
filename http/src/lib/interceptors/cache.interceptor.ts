import { Injectable, Inject } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpInterceptor } from '@angular/common/http';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HTTP_CONFIG, HttpConfig } from '../http.model';

const maxAge = 30000;
interface RequestCacheEntry {
	url: string;
	response: HttpResponse<any>;
	lastRead: number;
}

@Injectable()
export class CacheInterceptor implements HttpInterceptor {

	cache = new Map<string, RequestCacheEntry>();

	constructor(@Inject(HTTP_CONFIG) private httpConfig: HttpConfig) { }

	get(req: HttpRequest<any>): HttpResponse<any> | undefined {
		const url = req.urlWithParams;
		const cached = this.cache.get(url);

		if (!cached) {
			return undefined;
		}

		const isExpired = cached.lastRead < (Date.now() - maxAge);
		const expired = isExpired ? 'expired ' : '';
		console.log(`Found ${expired}cached response for "${url}".`);
		return isExpired ? undefined : cached.response;
	}

	put(req: HttpRequest<any>, response: HttpResponse<any>): void {
		const url = req.urlWithParams;
		console.log(`Caching response from "${url}".`);

		const entry = { url, response, lastRead: Date.now() };
		this.cache.set(url, entry);

		// remove expired cache entries
		const expired = Date.now() - maxAge;
		this.cache.forEach(ent => {
			if (ent.lastRead < expired) {
				this.cache.delete(ent.url);
			}
		});

		console.log(`Request cache size: ${this.cache.size}.`);
	}

	intercept(req: HttpRequest<any>, next: HttpHandler) {
		if (req.headers.has('Cache') && this.httpConfig.enableCaching !== false) {
			const cloneReq = req.clone({
				headers: req.headers.delete('Cache')
			});

			const cachedResponse = this.get(cloneReq);
			return cachedResponse ? of(cachedResponse) : next.handle(cloneReq).pipe(
				tap(
					event => {
						if (event instanceof HttpResponse) {
							this.put(req, event);
						}
					}
				)
			);

		} else {
			return next.handle(req);
		}
	}
}
