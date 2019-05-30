import { NgModule, ModuleWithProviders, Optional, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateConfig, TRANSLATE_CONFIG } from './translate.model';


export function HttpLoaderFactory(http: HttpClient, translateConfig: TranslateConfig) {
  return new TranslateHttpLoader(http, translateConfig.filePrefix, translateConfig.fileSuffix);
}

@NgModule({
  imports: [TranslateModule.forRoot()],
  exports: [TranslateModule]
})
export class TranslateConfigModule {
  static forRoot(config: TranslateConfig): ModuleWithProviders {
    return {
      ngModule: TranslateConfigModule,
      providers: [
        { provide: TRANSLATE_CONFIG, useValue: { ...config, rootModule: true }, multi: true },
        { provide: TranslateLoader, useFactory: HttpLoaderFactory, deps: [HttpClient, TRANSLATE_CONFIG] }
      ]
    };
  }

  static forChild(config: TranslateConfig): ModuleWithProviders {
    return {
      ngModule: TranslateConfigModule,
      providers: [{ provide: TRANSLATE_CONFIG, useValue: { ...config, rootModule: false }, multi: true }]
    };
  }
  constructor(translate: TranslateService, @Optional() @Inject(TRANSLATE_CONFIG) configs: TranslateConfig[] = []) {
    configs.forEach(config => {
      if (config.rootModule === true) {
        translate.currentLang = config.defaultLang;
        translate.setDefaultLang(config.defaultLang);
        translate.use(config.defaultLang);
      }

      if (config.translations) {
        Object.keys(config.translations).forEach(lang => {
          translate.setTranslation(lang, config.translations[lang], true);
        });
      }
    });
  }
}
