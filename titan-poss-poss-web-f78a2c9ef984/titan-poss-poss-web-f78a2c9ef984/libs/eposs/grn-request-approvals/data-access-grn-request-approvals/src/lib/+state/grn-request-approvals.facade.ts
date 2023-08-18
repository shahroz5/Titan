import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { grnRequestApprovalSelector } from './grn-request-approvals.selectors';

import * as GrnRequestApprovalActions from './grn-request-approvals.action';
import {
  GrnRequestApprovalListRequest,
  SaveGrnRequestApproval
} from '@poss-web/shared/models';
import { GrnRequestApprovalState } from './grn-request-approvals.state';

@Injectable()
export class GrnRequestApprovalFacade {
  constructor(public store: Store<GrnRequestApprovalState>) {}

  private isLoading$ = this.store.select(
    grnRequestApprovalSelector.selectIsLoading
  );
  private error$ = this.store.select(grnRequestApprovalSelector.selectError);
  private hasSaved$ = this.store.select(
    grnRequestApprovalSelector.selectHasSaved
  );
  private hasUpdated$ = this.store.select(
    grnRequestApprovalSelector.selectHasUpdated
  );

  private selectGrnRequestList$ = this.store.select(
    grnRequestApprovalSelector.selectGrnRequestApprovalList
  );

  getHasSaved() {
    return this.hasSaved$;
  }
  getHasUpdated() {
    return this.hasUpdated$;
  }

  getError() {
    return this.error$;
  }
  getGrnRequestList() {
    return this.selectGrnRequestList$;
  }
  getIsloading() {
    return this.isLoading$;
  }

  loadGrnRequestList(
    grnRequestApprovalListRequest: GrnRequestApprovalListRequest
  ) {
    this.store.dispatch(
      new GrnRequestApprovalActions.LoadGrnRequestList(
        grnRequestApprovalListRequest
      )
    );
  }

  saveGrnRequestStatus(saveGrnRequestApproval: SaveGrnRequestApproval) {
    this.store.dispatch(
      new GrnRequestApprovalActions.SaveGrnRequestApprovalStatus(
        saveGrnRequestApproval
      )
    );
  }

  loadReset() {
    this.store.dispatch(new GrnRequestApprovalActions.LoadReset());
  }
}
