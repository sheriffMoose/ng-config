import { InjectionToken } from '@angular/core';

export const HTTP_CONFIG = new InjectionToken<HttpConfig>('HTTP_CONFIG');

export interface HttpConfig {
    retryCount?: number;
    enableCaching?: boolean;
    defaultHeaders?: { [property: string]: string; };
    spinnerService?: any;
    loggerService?: any;
}
