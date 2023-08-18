import { Injectable } from '@angular/core';
import { RoRequestApprovalState } from './ro-request-approvals.state';
import { Store } from '@ngrx/store';
import { roRequestApprovalsSelectors } from './ro-request-approvals.selectors';
import {
  RoRequestApprovalListRequest,
  SaveRoRequestApproval
} from '@poss-web/shared/models';
import * as RoRequestApprovalAction from './ro-request-approvals.actions';
@Injectable()
export class RoRequestApprovalFacade {
  constructor(public store: Store<RoRequestApprovalState>) {}

  private isLoading$ = this.store.select(
    roRequestApprovalsSelectors.selectIsloading
  );
  private error$ = this.store.select(roRequestApprovalsSelectors.selectError);

  private hasUpdated$ = this.store.select(
    roRequestApprovalsSelectors.selectHasupdated
  );

  private totalElements$ = this.store.select(
    roRequestApprovalsSelectors.selectTotalElements
  );

  private pendingRoRequestList$ = this.store.select(
    roRequestApprovalsSelectors.selectPendingRoRequestList
  );
  private rejectedRoRequestList$ = this.store.select(
    roRequestApprovalsSelectors.selectRejectedRoRequestList
  );

  private closedRoRequestList$ = this.store.select(
    roRequestApprovalsSelectors.selectClosedRoRequestList
  );
  private approvedRoRequestList$ = this.store.select(
    roRequestApprovalsSelectors.selectApprovedRoRequestList
  );

  private boutiqueRoRequestList$ = this.store.select(
    roRequestApprovalsSelectors.selectBoutiqueRoRequestList
  );

  getBoutiqueRequestList() {
    return this.boutiqueRoRequestList$;
  }

  getHasUpdated() {
    return this.hasUpdated$;
  }
  getTotalElements() {
    return this.totalElements$;
  }
  getError() {
    return this.error$;
  }

  getIsloading() {
    return this.isLoading$;
  }

  getPendingRoRequestList() {
    return this.pendingRoRequestList$;
  }

  getApprovedRoRequestList() {
    return this.approvedRoRequestList$;
  }

  getRejectedRoRequestList() {
    return this.rejectedRoRequestList$;
  }

  getClosedRoRequestList() {
    return this.closedRoRequestList$;
  }

  loadPendingRoRequestList(
    roRequestApprovalListRequest: RoRequestApprovalListRequest
  ) {
    this.store.dispatch(
      new RoRequestApprovalAction.LoadPendingRoRequestApprovalList(
        roRequestApprovalListRequest
      )
    );
  }
  loadApprovedRoRequestList(
    roRequestApprovalListRequest: RoRequestApprovalListRequest
  ) {
    this.store.dispatch(
      new RoRequestApprovalAction.LoadApprovedRoRequestList(
        roRequestApprovalListRequest
      )
    );
  }
  loadRejectedRoRequestList(
    roRequestApprovalListRequest: RoRequestApprovalListRequest
  ) {
    this.store.dispatch(
      new RoRequestApprovalAction.LoadRejectedRoRequestApprovalList(
        roRequestApprovalListRequest
      )
    );
  }

  loadClosedRoRequestList(
    roRequestApprovalListRequest: RoRequestApprovalListRequest
  ) {
    this.store.dispatch(
      new RoRequestApprovalAction.LoadClosedRoRequestApprovalList(
        roRequestApprovalListRequest
      )
    );
  }

  saveRoRequestStatus(saveRoRequestApproval: SaveRoRequestApproval) {
    this.store.dispatch(
      new RoRequestApprovalAction.SaveRoRequestApprovalStatus(
        saveRoRequestApproval
      )
    );
  }
  loadBoutiqueRequestList(boutiqueRoRequestApprovalListRequest: any) {
    this.store.dispatch(
      new RoRequestApprovalAction.LoadRoRequestApprovalList(
        boutiqueRoRequestApprovalListRequest
      )
    );
  }
  loadReset() {
    this.store.dispatch(new RoRequestApprovalAction.LoadReset());
  }
}
