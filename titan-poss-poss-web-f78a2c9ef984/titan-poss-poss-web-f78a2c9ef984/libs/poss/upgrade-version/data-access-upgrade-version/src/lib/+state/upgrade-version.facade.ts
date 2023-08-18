import { Injectable } from '@angular/core';
import { UpgradeversionState } from './upgrade-version.state';
import { Store } from '@ngrx/store';
import { UpgradeVersionSelectors } from './upgrade-version.selectors';
import * as UpgradeVersionActions from './upgrade-version.actions';
import { Observable } from 'rxjs';
import { CustomErrors } from '@poss-web/shared/models';
@Injectable()
export class UpgradeVersionFacade {
  constructor(private store: Store<UpgradeversionState>) {}

  private error$ = this.store.select(UpgradeVersionSelectors.selectError);

  private isLoading$ = this.store.select(
    UpgradeVersionSelectors.selectIsLoading
  );

  private upgradeVersion$ = this.store.select(
    UpgradeVersionSelectors.selectIsUpgradeAvailable
  );

  private upgradeVersionResponse$ = this.store.select(
    UpgradeVersionSelectors.selectSendRequestForUpgrade
  );

  loadIsUpgradeAvailable() {
    this.store.dispatch(new UpgradeVersionActions.GetIsUpdateAvailable());
  }

  sendRequestForUpgrade() {
    this.store.dispatch(new UpgradeVersionActions.SendRequestForUpgrade());
  }

  getIsUpgradeAvailable() {
    return this.upgradeVersion$;
  }

  getUpgradeVersionResponse() {
    return this.upgradeVersionResponse$;
  }

  getIsLoading(): Observable<boolean> {
    return this.isLoading$;
  }

  getError(): Observable<CustomErrors> {
    return this.error$;
  }
}
