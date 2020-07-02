import { Injectable, InjectionToken, Inject } from '@angular/core';
import { ReducerManager } from '@ngrx/store';
import { StoreConfig, StoreActions } from './store.model';

export const STORE_CONFIG = new InjectionToken<StoreConfig[]>('STORE_CONFIG');
export const STORE_OPTIONS = new InjectionToken<StoreConfig[]>('STORE_OPTIONS');

@Injectable({ providedIn: 'root' })
export class StoreManager {
  reducers = [];
  initialStates = [];
  actions = {};

  constructor(private reducerManager: ReducerManager, @Inject(STORE_OPTIONS) private options) { }

  addState(storeName, initialState?, useLocalStorage?) {
    if (this.reducers.includes(storeName)) {
      return;
    }
    this.reducers.push(storeName);
    this.initialStates.push({ storeName, initialState });
    this.reducerManager.addReducer(storeName, (state = initialState, action) => {
      let newState = this.getLocalItem(storeName, initialState, useLocalStorage);
      if (action.store === storeName) {
        if (action.type.endsWith(StoreActions.SUCCESS)) {
          newState = {
            ...state,
            ...action.payload,
            timestamp: action.timestamp,
            isSuccessful: true
          };
        } else if (action.type.endsWith(StoreActions.UNSET)) {
          newState = {
            ...initialState,
            isSuccessful: true
          };
        } else {
          newState = {
            ...state,
            isSuccessful: false
          };
        }
      }
      if (this.options && this.options.useLocalStorage && useLocalStorage !== false) {
        localStorage.setItem(storeName, JSON.stringify(newState));
      }
      return newState;
    });
  }

  addAction(storeName, actionType, service, method) {
    if (this.reducers.indexOf(storeName) === -1) {
      this.addState(storeName);
    }
    this.actions[storeName] = this.actions[storeName] || {};
    this.actions[storeName][actionType] = this.actions[storeName][actionType] || {};
    this.actions[storeName][actionType].service = service;
    this.actions[storeName][actionType].method = method;
  }

  getAction(store, type, payload?, status = StoreActions.ACTION, timestamp = Date.now()) {
    return {
      store,
      _type: type,
      type: `[${store}] ${type}_DATA_${status}`,
      service: ((this.actions[store] || {})[type] || {}).service,
      method: ((this.actions[store] || {})[type] || {}).method,
      payload,
      timestamp
    };
  }

  getLocalItem(storeName, payload, useLocalStorage?) {
    if (this.options.useLocalStorage && useLocalStorage !== false) {
      const item = localStorage.getItem(storeName);
      return item === 'undefined' ? {} : JSON.parse(item) || payload || {};
    } else {
      return payload || {};
    }
  }
}
