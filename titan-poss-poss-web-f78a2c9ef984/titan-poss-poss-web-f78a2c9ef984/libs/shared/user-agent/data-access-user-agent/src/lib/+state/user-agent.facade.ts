import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import * as UAActions from './user-agent.actions';
import { UASelectors } from './user.agent.selectors';

@Injectable()
export class UAFacade {
  constructor(private store: Store<any>) {}

  private error$ = this.store.select(UASelectors.selectError);

  private isLoading$ = this.store.select(UASelectors.selectIsLoading);

  private encryptedHostname$ = this.store.select(
    UASelectors.selectEncryptedHostname
  );

  getError() {
    return this.error$;
  }

  getIsLoading() {
    return this.isLoading$;
  }

  getEncryptedHostname() {
    return this.encryptedHostname$;
  }

  loadEncryptedHostName() {
    this.store.dispatch(new UAActions.GetEncryptedHostName());
  }
}
