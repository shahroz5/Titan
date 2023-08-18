import { Injectable } from '@angular/core';
import { InvGlobalConfigurationState } from './inventory-global-config.state';
import { invglobalConfigurationSelectors } from './inventory-global-config.selectors';
import * as InvGlobalConfigurationActions from './inventory-global-config.actions';
import { UpdateFieldValuePayload } from '@poss-web/shared/models';

import { Store } from '@ngrx/store';

@Injectable()
export class InventoryGlobalConfigFacade {
  constructor(private store: Store<InvGlobalConfigurationState>) {}
  private globalConfiguration$ = this.store.select(
    invglobalConfigurationSelectors.selectGlobalConfiguration
  );
  private error$ = this.store.select(
    invglobalConfigurationSelectors.selectError
  );
  private hasUpdated$ = this.store.select(
    invglobalConfigurationSelectors.selectHasUpdated
  );
  private isLoading$ = this.store.select(
    invglobalConfigurationSelectors.selectIsLoading
  );
  private globalConfigurationList$ = this.store.select(
    invglobalConfigurationSelectors.selectGlobalConfigurationList
  );

  getInvGlobalConfigurationList() {
    return this.globalConfigurationList$;
  }

  getInvGlobalConfigurationFieldValue() {
    return this.globalConfiguration$;
  }

  getError() {
    return this.error$;
  }

  getIsloading() {
    return this.isLoading$;
  }

  getHasUpdated() {
    return this.hasUpdated$;
  }

  saveGlobalConfiguration() {
    this.store.dispatch(
      new InvGlobalConfigurationActions.SaveInvGlobalConfiguration()
    );
  }
  loadInvGlobalConfigurationList() {
    this.store.dispatch(
      new InvGlobalConfigurationActions.LoadInvGlobalConfigurationList()
    );
  }
  loadInvGlobalConfigurationFieldValue(configId: string) {
    this.store.dispatch(
      new InvGlobalConfigurationActions.LoadInvGlobalConfigurationFiledValue(
        configId
      )
    );
  }

  updateInvGlobalConfigurationFiledValue(
    updateFieldValuePayload: UpdateFieldValuePayload
  ) {
    this.store.dispatch(
      new InvGlobalConfigurationActions.UpdateInvGlobalConfigurationFieldValue(
        updateFieldValuePayload
      )
    );
  }
  loadReset() {
    this.store.dispatch(new InvGlobalConfigurationActions.LoadReset());
  }
}
