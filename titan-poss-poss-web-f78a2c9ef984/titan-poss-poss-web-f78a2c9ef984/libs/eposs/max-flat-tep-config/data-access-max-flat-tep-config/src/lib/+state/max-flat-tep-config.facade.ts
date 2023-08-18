import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as MaxFlatTepConfigActions from './max-flat-tep-config.actions';
import { MaxFlatTepConfigSelectors } from './max-flat-tep-config.selectors';
import { MaxFlatTepConfigState } from './max-flat-tep-config.state';
import {
  CustomErrors,
  MaxFlatTepConfigDetails,
  MaxFlatValuePatchPayload
} from '@poss-web/shared/models';
import { Observable } from 'rxjs';

@Injectable()
export class MaxFlatTepConfigFacade {
  constructor(private store: Store<MaxFlatTepConfigState>) {}

  private error$ = this.store.select(MaxFlatTepConfigSelectors.selectError);

  private isLoading$ = this.store.select(
    MaxFlatTepConfigSelectors.selectIsLoading
  );

  private maxFlatTepConfigDetails$ = this.store.select(
    MaxFlatTepConfigSelectors.selectMaxFlatTepConfigDetails
  );

  private updateMaxFlatTepConfigResponse$ = this.store.select(
    MaxFlatTepConfigSelectors.selectUpdateMaxFlatTepConfigResponse
  );

  loadMaxFlatTepConfig() {
    this.store.dispatch(new MaxFlatTepConfigActions.LoadMaxFlatTepConfig());
  }

  updateMaxFlatTepConfig(configId: string, payload: MaxFlatValuePatchPayload) {
    this.store.dispatch(
      new MaxFlatTepConfigActions.UpdateMaxFlatTepConfig(configId, payload)
    );
  }

  resetData() {
    this.store.dispatch(new MaxFlatTepConfigActions.ResetData());
  }

  getLoadMaxFlatTepConfig(): Observable<MaxFlatTepConfigDetails> {
    return this.maxFlatTepConfigDetails$;
  }

  getUpdateMaxFlatTepConfigResponse(): Observable<MaxFlatTepConfigDetails> {
    return this.updateMaxFlatTepConfigResponse$;
  }

  getError(): Observable<CustomErrors> {
    return this.error$;
  }

  getIsLoading(): Observable<boolean> {
    return this.isLoading$;
  }
}
