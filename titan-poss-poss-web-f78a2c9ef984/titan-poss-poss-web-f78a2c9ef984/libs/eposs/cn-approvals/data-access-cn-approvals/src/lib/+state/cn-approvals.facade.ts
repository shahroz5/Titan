import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { cnApprovalSelector } from './cn-approvals.selectors';

import * as CnApprovalActions from './cn-approvals.action';
import { CnApprovalListRequest, SaveCnApproval } from '@poss-web/shared/models';
import { CnApprovalState } from './cn-approvals.state';

@Injectable()
export class CnApprovalFacade {
  constructor(public store: Store<CnApprovalState>) {}

  private isLoading$ = this.store.select(cnApprovalSelector.selectIsLoading);
  private error$ = this.store.select(cnApprovalSelector.selectError);

  private hasUpdated$ = this.store.select(cnApprovalSelector.selectHasUpdated);

  private selectCnApprovalsList$ = this.store.select(
    cnApprovalSelector.selectCnRequestApprovalList
  );

  getHasUpdated() {
    return this.hasUpdated$;
  }

  getError() {
    return this.error$;
  }
  getCnApprovalsList() {
    return this.selectCnApprovalsList$;
  }
  getIsloading() {
    return this.isLoading$;
  }

  loadCnApprovalsList(cnApprovalListRequest: CnApprovalListRequest) {
    this.store.dispatch(
      new CnApprovalActions.LoadCnApprovalsList(cnApprovalListRequest)
    );
  }

  saveCnStatus(saveCnApproval: SaveCnApproval) {
    this.store.dispatch(
      new CnApprovalActions.SaveCnApprovalStatus(saveCnApproval)
    );
  }

  loadReset() {
    this.store.dispatch(new CnApprovalActions.LoadReset());
  }
}
