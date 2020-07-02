import { NgModule, ModuleWithProviders, Optional, Inject } from '@angular/core';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { StoreManager, STORE_CONFIG, STORE_OPTIONS } from './store.manager';
import { StoreEffects } from './store.effects';
import { StoreConfig } from './store.model';

@NgModule({
  imports: [
    StoreModule.forRoot({}),
    EffectsModule.forRoot([StoreEffects])
  ]
})
export class StoreConfigRootModule {
  constructor(storeManager: StoreManager, @Optional() @Inject(STORE_CONFIG) configs: StoreConfig[][] = []) {
    configs.forEach(c => {
      c.forEach(s => {
        storeManager.addState(s.state, s.initialState || {}, s.useLocalStorage);
        s.actions.forEach(a => {
          storeManager.addAction(s.state, a.name, a.service, a.method);
        });
      });
    });
  }
}

@NgModule({
  imports: [
    StoreModule,
    EffectsModule
  ]
})
export class StoreConfigModule {

  static forRoot(config: StoreConfig[], options = { useLocalStorage: false }): ModuleWithProviders {
    return {
      ngModule: StoreConfigRootModule,
      providers: [
        { provide: STORE_CONFIG, useValue: config, multi: true },
        { provide: STORE_OPTIONS, useValue: options }
      ]
    };
  }

  static forChild(config: StoreConfig[]): ModuleWithProviders {
    return {
      ngModule: StoreConfigModule,
      providers: [{ provide: STORE_CONFIG, useValue: config, multi: true }]
    };
  }

  constructor(storeManager: StoreManager, @Optional() @Inject(STORE_CONFIG) configs: StoreConfig[][] = []) {
    configs.forEach(c => {
      c.forEach(s => {
        storeManager.addState(s.state, s.initialState || {}, s.useLocalStorage);
        s.actions.forEach(a => {
          storeManager.addAction(s.state, a.name, a.service, a.method);
        });
      });
    });
  }
}
