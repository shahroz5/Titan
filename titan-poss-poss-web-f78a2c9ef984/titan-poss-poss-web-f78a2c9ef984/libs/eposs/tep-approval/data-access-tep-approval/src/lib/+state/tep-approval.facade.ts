import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { TepApprovalState } from './tep-approval.state';
import * as TepApprovalActions from './tep-approval.actions';
import { tepApprovalSelectors } from './tep-approval.selectors';
import {
  CnApprovalListRequest,
  EditRefundItemPayload,
  FvtAcceptOrRejectRequestPayload,
  RefundListingPayload,
  SaveCnApproval,
  tepApprovalListResponse,
  workflowPayload
} from '@poss-web/shared/models';

/**
 * Data upload Facade for accesing Data-upload-State
 * */
@Injectable()
export class TepApprovalFacade {
  constructor(private store: Store<TepApprovalState>) {}

  private approvalList$ = this.store.select(
    tepApprovalSelectors.selectApprovalList
  );

  private totalElements$ = this.store.select(
    tepApprovalSelectors.selectTotalElements
  );
  private updatedApprovalList$ = this.store.select(
    tepApprovalSelectors.updatedApprovalList
  );

  private refundList$ = this.store.select(
    tepApprovalSelectors.selectRefundList
  );

  private editedRefundListItemResponse$ = this.store.select(
    tepApprovalSelectors.selectEditedRefundListItemResponse
  );

  private fullValueTepRequestsListResponse$ = this.store.select(
    tepApprovalSelectors.selectFullValueTepRequestsListResponse
  );

  private fvtApprovedDetailsResponse$ = this.store.select(
    tepApprovalSelectors.selectFvtApprovedDetails
  );

  private hasError$ = this.store.select(tepApprovalSelectors.selectHasError);

  private isLoading$ = this.store.select(tepApprovalSelectors.selectIsLoading);

  getfullValueTepRequestsListResponse() {
    return this.fullValueTepRequestsListResponse$;
  }

  getTotalElements() {
    return this.totalElements$;
  }

  GetApprovalListList() {
    return this.approvalList$;
  }

  getUpdatedWorkflowDetails() {
    return this.updatedApprovalList$;
  }

  getTepRefundList() {
    return this.refundList$;
  }

  getEditedRefundListItemResponse() {
    return this.editedRefundListItemResponse$;
  }

  getError() {
    return this.hasError$;
  }

  getIsLoading() {
    return this.isLoading$;
  }

  getFvtApprovedDetailsResponse() {
    return this.fvtApprovedDetailsResponse$;
  }

  clearResponse() {
    this.store.dispatch(new TepApprovalActions.ResetResponse());
  }
  loadworkflowProcessDetails(data: workflowPayload) {
    this.store.dispatch(new TepApprovalActions.LoadWorkflowDeatils(data));
  }

  loadFullValueApprovalRequestsList(payload: CnApprovalListRequest) {
    this.store.dispatch(
      new TepApprovalActions.GetFullValueTepApprovalList(payload)
    );
  }

  loadApprovalList(payload: CnApprovalListRequest) {
    this.store.dispatch(new TepApprovalActions.GetTepApprovalList(payload));
  }

  updateApprovalList(payload: tepApprovalListResponse) {
    this.store.dispatch(new TepApprovalActions.UpdateResponse(payload));
  }

  saveTepStatus(saveTepApproval: SaveCnApproval) {
    this.store.dispatch(
      new TepApprovalActions.SaveTepApprovalStatus(saveTepApproval)
    );
  }

  loadTepRefundList(
    requestPayload: RefundListingPayload,
    page: number,
    size: number
  ) {
    this.store.dispatch(
      new TepApprovalActions.LoadTepRefundList(requestPayload, page, size)
    );
  }

  editTepRefundListItem(
    requestPayload: EditRefundItemPayload,
    status: string,
    id: string
  ) {
    this.store.dispatch(
      new TepApprovalActions.EditTepRefundItem(requestPayload, status, id)
    );
  }

  sendApprovalForFvtRequest(
    isApprove: boolean,
    requestPayload: FvtAcceptOrRejectRequestPayload,
    processId: string,
    taskId: string,
    taskName: string
  ) {
    this.store.dispatch(
      new TepApprovalActions.SendApprovalForRequest(
        isApprove,
        requestPayload,
        processId,
        taskId,
        taskName
      )
    );
  }

  clearApprovalForFvtRequestResponse() {
    this.store.dispatch(
      new TepApprovalActions.SendApprovalForRequestSuccess(null)
    );
  }
}
