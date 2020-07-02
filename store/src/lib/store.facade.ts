import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { of } from 'rxjs';
import { filter, take, map } from 'rxjs/operators';
import { StoreManager } from './store.manager';
import { StoreActions } from './store.model';

@Injectable({ providedIn: 'root' })
export class StoreFacade {
  constructor(private store: Store<any>, private storeManager: StoreManager) { }

  isObject(obj) {
    return obj instanceof Object && !Array.isArray(obj);
  }

  getInitialState(storeName: string) {
    return (this.storeManager.initialStates.find(s => s.storeName === storeName) || {}).initialState || {};
  }

  selectByInitialState(state, initialState) {
    const newState = {};
    for (const key in state) {
      if (initialState.hasOwnProperty(key)) {
        if (this.isObject(state[key]) && this.isObject(initialState[key])) {
          newState[key] = {};
          newState[key] = this.selectByInitialState(state[key], initialState[key]);
        } else {
          newState[key] = state[key];
        }

      }
    }
    return newState;
  }

  select(storeName: string, initialStore?: string | boolean, sync = true) {
    let state;
    const observable = this.store.pipe(
      select(storeName),
      map((data = {}) => {
        const { isSuccessful, timestamp, ...rest } = data;
        if (initialStore) {
          const initialState = this.getInitialState(initialStore === true ? storeName : initialStore);
          if (initialState && Object.keys(initialState).length > 0) {
            return this.selectByInitialState(rest, initialState);
          }
        }
        return rest;
      }));
    if (sync) {
      observable.pipe(take(1)).subscribe(s => state = s);
      return state;
    } else {
      return observable;
    }
  }
  isEmpty(storeName: string) {
    return Object.keys(this.select(storeName)).length === 0;
  }

  dispatch(storeName: string, actionName: string, payload?) {
    const action = this.storeManager.getAction(storeName, actionName, payload);
    this.store.dispatch(action);
    return this.store.pipe(select(storeName)).pipe(filter(p => !!p && !!p.isSuccessful && p.timestamp === action.timestamp), take(1));
  }

  getData(storeName: string, action: StoreActions | string = StoreActions.GET) {
    return this.dispatch(storeName, action);
  }

  setData(storeName: string, payload, action: StoreActions | string = StoreActions.SET) {
    return this.dispatch(storeName, action, payload);
  }

  unsetData(storeName: string, action: StoreActions | string = StoreActions.UNSET) {
    return this.dispatch(storeName, action).toPromise();
  }

  clear(exclusions = []) {
    this.storeManager.reducers.forEach(r => {
      if (!exclusions.includes(r)) {
        this.unsetData(r);
      }
    });
  }

  init(storeName: string, getter: any, format = fdata => fdata) {
    if (this.isEmpty(storeName)) {
      return getter.toPromise().then(data => {
        this.setData(storeName, format(data), StoreActions.SET);
      });
    } else {
      return of(this.select(storeName)).toPromise().then(format);
    }
  }
}
