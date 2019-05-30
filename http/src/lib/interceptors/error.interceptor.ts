import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

	constructor() { }

	private handleError(error: HttpErrorResponse) {
		let message = `HTTP Error Status : ${error.status}, ${error.message}`;
		if (!!error.error && error.error instanceof ErrorEvent) {
			message = 'An error occurred: ' + error.error.message;
		}
		return throwError({ message: message });
	}

	intercept(req: HttpRequest<any>, next: HttpHandler) {
		return next.handle(req).pipe(
			catchError(this.handleError)
		);
	}
}
