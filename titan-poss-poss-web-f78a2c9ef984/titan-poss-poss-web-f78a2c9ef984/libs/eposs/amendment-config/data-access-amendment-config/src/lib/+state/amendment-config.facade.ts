import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { UpdateFieldValuePayload } from '@poss-web/shared/models';
import * as AmendmentConfigurationActions from './amendment-config.actions';
import { AmendmentConfigurationSelectors } from './amendment-config.selectors';
import { AmendmentConfigState } from './amendment-config.state';

@Injectable()
export class AmendmentConfigFacade {
  constructor(private store: Store<AmendmentConfigState>) {}
  private globalConfiguration$ = this.store.select(
    AmendmentConfigurationSelectors.selectAmendmentConfiguration
  );
  private error$ = this.store.select(
    AmendmentConfigurationSelectors.selectError
  );
  private hasUpdated$ = this.store.select(
    AmendmentConfigurationSelectors.selectHasUpdated
  );

  private isLoading$ = this.store.select(
    AmendmentConfigurationSelectors.selectIsLoading
  );

  getAmendmentConfigValue() {
    return this.globalConfiguration$;
  }

  getError() {
    return this.error$;
  }
  getHasUpdated() {
    return this.hasUpdated$;
  }

  getIsloading() {
    return this.isLoading$;
  }

  saveGlobalConfiguration(updateFieldValuePayload: UpdateFieldValuePayload) {
    this.store.dispatch(
      new AmendmentConfigurationActions.SaveAmendmentConfiguration(
        updateFieldValuePayload
      )
    );
  }

  loadAmendmentConfigFieldValue() {
    this.store.dispatch(
      new AmendmentConfigurationActions.LoadAmendmentConfigurationFiledValue()
    );
  }

  loadReset() {
    this.store.dispatch(new AmendmentConfigurationActions.LoadReset());
  }
}
