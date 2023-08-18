import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  ConversionApprovalRequestsListingPayload,
  ImageReqPayload,
  SelectedRequestPayload,
  UpdateApprovalRequestStatusPayload
} from '@poss-web/shared/models';

import * as ConversionApprovalsActions from './conversion-approvals.actions';
import { conversionApprovalsSelectors } from './conversion-approvals.selectors';
import { ConversionApprovalsState } from './conversion-approvals.state';

@Injectable()
export class ConversionApprovalsFacade {
  constructor(private store: Store<ConversionApprovalsState>) {}
  /*Select from store*/
  private isLoading$ = this.store.select(
    conversionApprovalsSelectors.selectIsLoading
  );
  private error$ = this.store.select(conversionApprovalsSelectors.selectError);
  private selectApprovalRequestsList$ = this.store.select(
    conversionApprovalsSelectors.selectApprovalRequestsList
  );
  private selectApprovalRequestsLength$ = this.store.select(
    conversionApprovalsSelectors.selectApprovalRequestsLength
  );
  private selectedRequest$ = this.store.select(
    conversionApprovalsSelectors.selectSelectedRequest
  );
  private selectedRequestData$ = this.store.select(
    conversionApprovalsSelectors.selectSelectedRequestData
  );
  private selectedItemIds$ = this.store.select(
    conversionApprovalsSelectors.selectSelectedItemIds
  );
  private selectUpdateStatusResponse$ = this.store.select(
    conversionApprovalsSelectors.selectUpdateStatusResponse
  );
  // Image
  private isLoadingImage$ = this.store.select(
    conversionApprovalsSelectors.selectIsLoadingImage
  );

  /*Dispatching Actions*/
  resetState() {
    this.store.dispatch(new ConversionApprovalsActions.ResetState());
  }
  loadApprovalRequestsList(
    requestsPayload: ConversionApprovalRequestsListingPayload
  ) {
    this.store.dispatch(
      new ConversionApprovalsActions.LoadApprovalRequestsList(requestsPayload)
    );
  }
  loadMoreApprovalRequestsList(
    requestsPayload: ConversionApprovalRequestsListingPayload
  ) {
    this.store.dispatch(
      new ConversionApprovalsActions.LoadMoreApprovalRequestsList(
        requestsPayload
      )
    );
  }
  loadSelectedRequest(payload: SelectedRequestPayload) {
    this.store.dispatch(
      new ConversionApprovalsActions.LoadSelectedRequest(payload)
    );
  }
  loadSelectedRequestData(payload: SelectedRequestPayload) {
    this.store.dispatch(
      new ConversionApprovalsActions.LoadSelectedRequestData(payload)
    );
  }
  updateApprovalRequestStatus(payload: UpdateApprovalRequestStatusPayload) {
    this.store.dispatch(
      new ConversionApprovalsActions.UpdateApprovalRequestStatus(payload)
    );
  }
  // Image For Request Sent
  loadThumbnailImageUrl(payload: ImageReqPayload) {
    this.store.dispatch(
      new  ConversionApprovalsActions.LoadThumbnailImageUrl(payload)
    );
  }
  loadImageUrl(payload: ImageReqPayload) {
    this.store.dispatch(new  ConversionApprovalsActions.LoadImageUrl(payload));
  }

  /*Selector Methods */
  getIsLoading() {
    return this.isLoading$;
  }
  getError() {
    return this.error$;
  }
  getConversionRequestsList() {
    return this.selectApprovalRequestsList$;
  }
  getConversionRequestsLength() {
    return this.selectApprovalRequestsLength$;
  }
  getSelectedRequest() {
    return this.selectedRequest$;
  }
  getSelectedRequestData() {
    return this.selectedRequestData$;
  }
  getSelectedItemIds() {
    return this.selectedItemIds$;
  }
  getUpdateStatusResponse() {
    return this.selectUpdateStatusResponse$;
  }
  // Image
  getIsLoadingImage() {
    return this.isLoadingImage$;
  }
}
