import { InjectionToken } from '@angular/core';

export const TRANSLATE_CONFIG = new InjectionToken<TranslateConfig>('TRANSLATE_CONFIG');

export interface TranslateConfig {
    rootModule?: boolean;
    enableHttpLoad?: boolean;
    filePrefix?: string;
    fileSuffix?: string;
    languages: string[];
    defaultLang: string;
    translations?: { [lang: string]: any };
}
