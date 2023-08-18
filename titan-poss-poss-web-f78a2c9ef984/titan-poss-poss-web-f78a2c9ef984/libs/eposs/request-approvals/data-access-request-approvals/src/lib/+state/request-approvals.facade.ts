import { Injectable } from '@angular/core';
import { RequestApprovalsSelectors } from './request-approvals.selectors';
import { Store } from '@ngrx/store';

import * as RequestApprovalsActions from './request-approvals.actions';
import { of } from 'rxjs';
import { combineAll, map } from 'rxjs/operators';
import { SelectedStockPayload } from './request-approvals.actions';
import { RequestApprovalsState } from './request-approvals.state';
import { ImageReqPayload } from '@poss-web/shared/models';

@Injectable()
export class RequestApprovalsFacade {
  private binRequestApprovalsItemCount$ = this.store.select(
    RequestApprovalsSelectors.selectBinRequestItemsCount
  );
  private ibtRequestApprovalsItemCount$ = this.store.select(
    RequestApprovalsSelectors.selectIbtRequestItemsCount
  );

  private adjRequestApprovalsCount$ = this.store.select(
    RequestApprovalsSelectors.selectadjRequestCount
  );

  private ibtCancelItems$ = this.store.select(
    RequestApprovalsSelectors.selectIbtCancelItems
  );

  private ibtCancelItemsLoading = this.store.select(
    RequestApprovalsSelectors.selectIsIbtCancelItemsLoading
  );

  private ibtCancelItemCount = this.store.select(
    RequestApprovalsSelectors.selectIbtCancelItemCount
  );

  private hasUpadatingCancelApprovalsFailure = this.store.select(
    RequestApprovalsSelectors.selecthasUpadatingCancelApprovalsFailure
  );

  private isCancelUpdatingSuccess = this.store.select(
    RequestApprovalsSelectors.selectisCancelUpdatingSuccess
  );

  private ibtCancelUpdateRequest = this.store.select(
    RequestApprovalsSelectors.selectibtCancelUpdateRequest
  );

  private cancelRequestApprovalsCount$ = this.store.select(
    RequestApprovalsSelectors.selectCancelRequestCount
  );

  private psvRequestApprovalsCount$ = this.store.select(
    RequestApprovalsSelectors.selectpsvRequestCount
  );
  private lossRequestApprovalsCount$ = this.store.select(
    RequestApprovalsSelectors.selectlossRequestItemsCount
  );
  private loanRequestApprovalsCount$ = this.store.select(
    RequestApprovalsSelectors.selectloanRequestCount
  );
  private exhRequestApprovalsCount$ = this.store.select(
    RequestApprovalsSelectors.selectexhRequestCount
  );
  private focRequestApprovalsCount$ = this.store.select(
    RequestApprovalsSelectors.selectfocRequestCount
  );

  private ibtRequestApprovalsItemsCount$ = this.store.select(
    RequestApprovalsSelectors.selectIbtRequestApprovalItemsCount
  );
  private Error$ = this.store.select(RequestApprovalsSelectors.selectError);
  private isLoading$ = this.store.select(
    RequestApprovalsSelectors.selectIsLoading
  );
  private selectIsBinRequestApprovalsItemsReset$ = this.store.select(
    RequestApprovalsSelectors.selectIsBinRequestItemsReset
  );
  private selectIsIbtRequestApprovalsItemsReset$ = this.store.select(
    RequestApprovalsSelectors.selectIsIbtRequestItemsReset
  );

  private selectIsadjRequestApprovalsItemsReset$ = this.store.select(
    RequestApprovalsSelectors.selectIsadjRequestItemsReset
  );

  private selectIsexhRequestApprovalsItemsReset$ = this.store.select(
    RequestApprovalsSelectors.selectIsexhRequestItemsReset
  );

  private selectIslossRequestApprovalsItemsReset$ = this.store.select(
    RequestApprovalsSelectors.selectIslossRequestItemsReset
  );
  private selectIsloanRequestApprovalsItemsReset$ = this.store.select(
    RequestApprovalsSelectors.selectIsloanRequestItemsReset
  );
  private selectIspsvRequestApprovalsItemsReset$ = this.store.select(
    RequestApprovalsSelectors.selectIsPsvRequestItemsReset
  );

  private selectIsFocRequestApprovalsItemsReset$ = this.store.select(
    RequestApprovalsSelectors.selectIsFocRequestItemsReset
  );
  private locationCount$ = this.store.select(
    RequestApprovalsSelectors.selectLocationCount
  );

  private selectIsBinRequestApprovalsItemsCountReset$ = this.store.select(
    RequestApprovalsSelectors.selectIsBinRequestItemsCountReset
  );

  private selectIsIbtRequestApprovalsItemsCountReset$ = this.store.select(
    RequestApprovalsSelectors.selectIsIbtRequestItemsCountReset
  );

  private selectIsFoctRequestApprovalsItemsCountReset$ = this.store.select(
    RequestApprovalsSelectors.selectIsFocRequestItemsCountReset
  );

  private selectIsPsvRequestApprovalsItemsCountReset$ = this.store.select(
    RequestApprovalsSelectors.selectIsPsvRequestItemsCountReset
  );

  private selectIslossRequestApprovalsItemsCountReset$ = this.store.select(
    RequestApprovalsSelectors.selectIslossRequestItemsCountReset
  );

  private selectIsloanRequestApprovalsItemsCountReset$ = this.store.select(
    RequestApprovalsSelectors.selectIsloanRequestItemsCountReset
  );

  private selectIsexhRequestApprovalsItemsCountReset$ = this.store.select(
    RequestApprovalsSelectors.selectIsexhRequestItemsCountReset
  );

  private selectIsadjRequestApprovalsItemsCountReset$ = this.store.select(
    RequestApprovalsSelectors.selectIsadjRequestItemsCountReset
  );
  private binRequestApprovalsItems$ = this.store.select(
    RequestApprovalsSelectors.selectBinItems
  );

  private location$ = this.store.select(
    RequestApprovalsSelectors.selectLocation
  );
  private isbinRequestItemsLoading$ = this.store.select(
    RequestApprovalsSelectors.selectIsbinRequestItemsLoading
  );

  private isIbtRequestItemsLoading$ = this.store.select(
    RequestApprovalsSelectors.selectIsIbtRequestItemsLoading
  );
  private isLocationLoading$ = this.store.select(
    RequestApprovalsSelectors.selectIsLocationLoading
  );

  private isadjLoading$ = this.store.select(
    RequestApprovalsSelectors.selectIsadjLoading
  );

  private ispsvLoading$ = this.store.select(
    RequestApprovalsSelectors.selectIspsvLoading
  );

  private islossLoading$ = this.store.select(
    RequestApprovalsSelectors.selectIslossLoading
  );

  private isloanLoading$ = this.store.select(
    RequestApprovalsSelectors.selectIsloanLoading
  );

  private isexhLoading$ = this.store.select(
    RequestApprovalsSelectors.selectIsExhLoading
  );

  private isFocLoading$ = this.store.select(
    RequestApprovalsSelectors.selectIsfocLoading
  );
  private updateItem$ = this.store.select(
    RequestApprovalsSelectors.updateItemSuccess
  );

  private hasUpdatingFailure = this.store.select(
    RequestApprovalsSelectors.selectHasUpdatingFailure
  );

  private isUpdatingItem$ = this.store.select(
    RequestApprovalsSelectors.selectIsUpdatingItem
  );

  private updateIbt$ = this.store.select(
    RequestApprovalsSelectors.updateIbtSuccess
  );

  private hasUpdatingIbtFailure = this.store.select(
    RequestApprovalsSelectors.selectHasUpdatingIbtFailure
  );

  private isUpdatingIbt$ = this.store.select(
    RequestApprovalsSelectors.selectIsUpdatingIbt
  );

  private IbtApproval$ = this.store.select(
    RequestApprovalsSelectors.IbtApprovalsSuccess
  );

  private hasUpdatingApprovalsFailure = this.store.select(
    RequestApprovalsSelectors.selectHasUpdatingApprovalsFailure
  );

  private isUpdatingSuccess$ = this.store.select(
    RequestApprovalsSelectors.selectIsUpdatingSuccess
  );

  private ibtRequest$ = this.store.select(
    RequestApprovalsSelectors.selectIbtRequest
  );

  private ibtCancellationRequest$ = this.store.select(
    RequestApprovalsSelectors.selectIbtCancellationRequest
  );

  private focRequest$ = this.store.select(
    RequestApprovalsSelectors.selectfocRequest
  );

  private psvRequest$ = this.store.select(
    RequestApprovalsSelectors.selectpsvRequest
  );

  private lossRequest$ = this.store.select(
    RequestApprovalsSelectors.selectlossRequest
  );

  private loanRequest$ = this.store.select(
    RequestApprovalsSelectors.selectloanRequest
  );

  private adjRequest$ = this.store.select(
    RequestApprovalsSelectors.selectadjRequest
  );

  private exhRequest$ = this.store.select(
    RequestApprovalsSelectors.selectexhRequest
  );

  private ibtRequestItems$ = this.store.select(
    RequestApprovalsSelectors.selectIbtRequestItems
  );

  private isLoadingIbtRequest$ = this.store.select(
    RequestApprovalsSelectors.selectIsIbtLoading
  );

  private isLoadingIbtCancellationRequest$ = this.store.select(
    RequestApprovalsSelectors.selectIsIbtCancellationLoading
  );

  private selectedRequest$ = this.store.select(
    RequestApprovalsSelectors.selectSelectedRequest
  );

  private selectedCancelRequest$ = this.store.select(
    RequestApprovalsSelectors.selectSelectedCancelRequest
  );

  // Image
  private isLoadingImage$ = this.store.select(
    RequestApprovalsSelectors.selectIsLoadingImage
  );

  constructor(private store: Store<RequestApprovalsState>) {}

  getIbtRequest() {
    return this.ibtRequest$;
  }

  getibtCancelItems() {
    return this.ibtCancelItems$;
  }

  getibtCancelItemsLoading() {
    return this.ibtCancelItemsLoading;
  }

  getibtCancelItemCount() {
    return this.ibtCancelItemCount;
  }

  gethasUpadatingCancelApprovalsFailure() {
    return this.hasUpadatingCancelApprovalsFailure;
  }

  getisCancelUpdatingSuccess() {
    return this.isCancelUpdatingSuccess;
  }

  getibtCancelUpdateRequest() {
    return this.ibtCancelUpdateRequest;
  }

  getIbtCancellationRequest() {
    return this.ibtCancellationRequest$;
  }

  getfocRequest() {
    return this.focRequest$;
  }

  getpsvRequest() {
    return this.psvRequest$;
  }

  getadjRequest() {
    return this.adjRequest$;
  }

  getlossRequest() {
    return this.lossRequest$;
  }

  getloanRequest() {
    return this.loanRequest$;
  }

  getexhRequest() {
    return this.exhRequest$;
  }

  getIbtRequestItems() {
    return this.ibtRequestItems$;
  }

  getIsLoadingIbt() {
    return this.isLoadingIbtRequest$;
  }

  getIsLoadingIbtCancellation() {
    return this.isLoadingIbtCancellationRequest$;
  }

  getIsLoadingexh() {
    return this.isexhLoading$;
  }

  getIsLoadingadj() {
    return this.isadjLoading$;
  }

  getIsLoadingloss() {
    return this.islossLoading$;
  }

  getIsLoadingloan() {
    return this.isloanLoading$;
  }

  getIsLoadingpsv() {
    return this.ispsvLoading$;
  }

  getIsLoadingfoc() {
    return this.isFocLoading$;
  }

  getError() {
    return this.Error$;
  }

  getIsBinRequestApprovalsItemsReset() {
    return this.selectIsBinRequestApprovalsItemsReset$;
  }

  getIsBinRequestApprovalsItemsCountReset() {
    return this.selectIsBinRequestApprovalsItemsCountReset$;
  }

  getIsIbtRequestApprovalsItemsReset() {
    return this.selectIsIbtRequestApprovalsItemsReset$;
  }

  getIsIbtRequestApprovalsItemsCountReset() {
    return this.selectIsIbtRequestApprovalsItemsCountReset$;
  }

  getIsFocRequestApprovalsItemsReset() {
    return this.selectIsFocRequestApprovalsItemsReset$;
  }

  getIsFocRequestApprovalsItemsCountReset() {
    return this.selectIsFoctRequestApprovalsItemsCountReset$;
  }

  getIsadjtRequestApprovalsItemsReset() {
    return this.selectIsadjRequestApprovalsItemsReset$;
  }

  getIsadjRequestApprovalsItemsCountReset() {
    return this.selectIsadjRequestApprovalsItemsCountReset$;
  }

  getIspsvRequestApprovalsItemsReset() {
    return this.selectIspsvRequestApprovalsItemsReset$;
  }

  getIspsvRequestApprovalsItemsCountReset() {
    return this.selectIsPsvRequestApprovalsItemsCountReset$;
  }

  getIslossRequestApprovalsItemsReset() {
    return this.selectIslossRequestApprovalsItemsReset$;
  }

  getIslossRequestApprovalsItemsCountReset() {
    return this.selectIslossRequestApprovalsItemsCountReset$;
  }

  getIsloanRequestApprovalsItemsReset() {
    return this.selectIsloanRequestApprovalsItemsReset$;
  }

  getIsloanRequestApprovalsItemsCountReset() {
    return this.selectIsloanRequestApprovalsItemsCountReset$;
  }

  getIsexhRequestApprovalsItemsReset() {
    return this.selectIsexhRequestApprovalsItemsReset$;
  }

  getIsexhRequestApprovalsItemsCountReset() {
    return this.selectIsexhRequestApprovalsItemsCountReset$;
  }

  getIsLoading() {
    return this.isLoading$;
  }

  getIsLocationLoading() {
    return this.isLocationLoading$;
  }

  getItemCount() {
    return this.binRequestApprovalsItemCount$;
  }

  getIbtCount() {
    return this.ibtRequestApprovalsItemCount$;
  }

  getIbtCancelCount() {
    return this.cancelRequestApprovalsCount$;
  }

  getOtherIssueCount() {
    const source = of(
      this.adjRequestApprovalsCount$,
      this.exhRequestApprovalsCount$,
      this.lossRequestApprovalsCount$,
      this.loanRequestApprovalsCount$,
      this.focRequestApprovalsCount$,
      this.psvRequestApprovalsCount$
    );
    return source.pipe(
      combineAll(),
      map(numbers => numbers.reduce((sum, n) => sum + n, 0))
    );
  }

  getIbtCardCount() {
    const source = of(
      this.ibtRequestApprovalsItemsCount$,
      this.cancelRequestApprovalsCount$
    );
    return source.pipe(
      combineAll(),
      map(numbers => numbers.reduce((sum, n) => sum + n, 0))
    );
  }

  getadjCount() {
    return this.adjRequestApprovalsCount$;
  }

  getpsvCount() {
    return this.psvRequestApprovalsCount$;
  }

  getlossCount() {
    return this.lossRequestApprovalsCount$;
  }

  getloanCount() {
    return this.loanRequestApprovalsCount$;
  }

  getexhCount() {
    return this.exhRequestApprovalsCount$;
  }

  getfocCount() {
    return this.focRequestApprovalsCount$;
  }

  getIbtItemsCount() {
    return this.ibtRequestApprovalsItemsCount$;
  }
  getLocationCount() {
    return this.locationCount$;
  }

  getbinItems() {
    return this.binRequestApprovalsItems$;
  }

  getLocations() {
    return this.location$;
  }

  getIsBinRequestApprovalsItemsLoading() {
    return this.isbinRequestItemsLoading$;
  }

  getIsIbtRequestApprovalsItemsLoading() {
    return this.isIbtRequestItemsLoading$;
  }

  getHasUpdatingFailure() {
    return this.hasUpdatingFailure;
  }

  getupdateItem() {
    return this.updateItem$;
  }

  getIsUpdatingItem() {
    return this.isUpdatingItem$;
  }

  getHasUpdatingIbtFailure() {
    return this.hasUpdatingIbtFailure;
  }

  getupdateIbt() {
    return this.updateIbt$;
  }

  getIsUpdatingIbt() {
    return this.isUpdatingIbt$;
  }

  getHasUpdatingApprovalsFailure() {
    return this.hasUpdatingApprovalsFailure;
  }

  getIbt() {
    return this.IbtApproval$;
  }

  getIsUpdatingSuccess() {
    return this.isUpdatingSuccess$;
  }

  getSelectedRequest() {
    return this.selectedRequest$;
  }

  getSelectedCancelRequest() {
    return this.selectedCancelRequest$;
  }

  // Image
  getIsLoadingImage() {
    return this.isLoadingImage$;
  }

  loadbinRequestApprovalsItemCount() {
    this.store.dispatch(
      new RequestApprovalsActions.LoadBinRequestApprovalsCount()
    );
  }

  loadibtRequestApprovalsItemCount() {
    this.store.dispatch(
      new RequestApprovalsActions.LoadIBTRequestApprovalsCount()
    );
  }

  loadibtCancelCount() {
    this.store.dispatch(
      new RequestApprovalsActions.LoadIBTCancelRequestApprovalsCount()
    );
  }

  loadIbtRequestApprovalsItemsCount(
    payload: RequestApprovalsActions.CountPayload
  ) {
    this.store.dispatch(
      new RequestApprovalsActions.LoadIBTRequestApprovalsItemsCount(payload)
    );
  }

  loadStuddedProductGroups() {
    this.store.dispatch(new RequestApprovalsActions.LoadStuddedProductGroups());
  }

  loadLocationCount() {
    this.store.dispatch(new RequestApprovalsActions.LoadLocationCount());
  }

  resetBinRequestApprovals() {
    this.store.dispatch(new RequestApprovalsActions.ResetBinRequestApprovals());
  }

  resetBinRequestApprovalsCount() {
    this.store.dispatch(
      new RequestApprovalsActions.ResetBinRequestApprovalsCount()
    );
  }

  resetIbtRequestApprovals() {
    this.store.dispatch(new RequestApprovalsActions.ResetIBTRequestApprovals());
  }

  resetIbtRequestApprovalsCount() {
    this.store.dispatch(
      new RequestApprovalsActions.ResetIBTRequestApprovalsCount()
    );
  }

  resetFocRequestApprovals() {
    this.store.dispatch(new RequestApprovalsActions.ResetFOCRequestApprovals());
  }

  resetFocRequestApprovalsCount() {
    this.store.dispatch(
      new RequestApprovalsActions.ResetFOCRequestApprovalsCount()
    );
  }

  resetadjRequestApprovals() {
    this.store.dispatch(new RequestApprovalsActions.ResetADJRequestApprovals());
  }

  resetadjRequestApprovalsCount() {
    this.store.dispatch(
      new RequestApprovalsActions.ResetADJRequestApprovalsCount()
    );
  }

  resetLossRequestApprovals() {
    this.store.dispatch(
      new RequestApprovalsActions.ResetLOSSRequestApprovals()
    );
  }

  resetLossRequestApprovalsCount() {
    this.store.dispatch(
      new RequestApprovalsActions.ResetLOSSRequestApprovalsCount()
    );
  }

  resetLoanRequestApprovals() {
    this.store.dispatch(
      new RequestApprovalsActions.ResetLOANRequestApprovals()
    );
  }

  resetLoanRequestApprovalsCount() {
    this.store.dispatch(
      new RequestApprovalsActions.ResetLOANRequestApprovalsCount()
    );
  }

  resetExhtRequestApprovals() {
    this.store.dispatch(new RequestApprovalsActions.ResetEXHRequestApprovals());
  }

  resetExhRequestApprovalsCount() {
    this.store.dispatch(
      new RequestApprovalsActions.ResetEXHRequestApprovalsCount()
    );
  }

  resetPsvRequestApprovals() {
    this.store.dispatch(new RequestApprovalsActions.ResetPSVRequestApprovals());
  }

  resetPsvRequestApprovalsCount() {
    this.store.dispatch(
      new RequestApprovalsActions.ResetPSVRequestApprovalsCount()
    );
  }

  resetRequestApprovalsItem() {
    this.store.dispatch(
      new RequestApprovalsActions.ResetRequestApprovalsItems()
    );
  }

  resetError() {
    this.store.dispatch(new RequestApprovalsActions.ResetError());
  }

  resetUpdate() {
    this.store.dispatch(new RequestApprovalsActions.ResetStatus());
  }

  resetRequestApprovalsItemCount() {
    this.store.dispatch(
      new RequestApprovalsActions.ResetRequestApprovalsItemsCount()
    );
  }
  loadBinRequestApprovalsItems(
    loadItemsPayload: RequestApprovalsActions.GetBinRequestPayload
  ) {
    this.store.dispatch(
      new RequestApprovalsActions.LoadBinRequestApprovals(loadItemsPayload)
    );
  }

  loadLocations() {
    this.store.dispatch(new RequestApprovalsActions.LoadLocation());
  }

  updateItem(binApprovals: RequestApprovalsActions.BinApprovalspayload) {
    this.store.dispatch(
      new RequestApprovalsActions.UpdateBinRequestApprovals(binApprovals)
    );
  }

  updateIbt(ibtApprovals: RequestApprovalsActions.IbtApprovalspayload) {
    this.store.dispatch(
      new RequestApprovalsActions.UpdateIBTRequestApprovals(ibtApprovals)
    );
  }

  updateIbtSucess(ibtApprovals: RequestApprovalsActions.Ibtpayload) {
    this.store.dispatch(new RequestApprovalsActions.IBTRequest(ibtApprovals));
  }

  updateIbtCancel(ibtApprovals: RequestApprovalsActions.IbtCancelPayload) {
    this.store.dispatch(
      new RequestApprovalsActions.IBTCancelRequest(ibtApprovals)
    );
  }

  searchClear() {
    this.store.dispatch(new RequestApprovalsActions.SearchClear());
  }

  loadRequestCount() {
    this.store.dispatch(new RequestApprovalsActions.LoadItemsTotalCount());
  }

  loadIbtRequest(
    loadPendingPayload: RequestApprovalsActions.LoadIbtRequestPayload
  ) {
    this.store.dispatch(
      new RequestApprovalsActions.LoadIBtRequest(loadPendingPayload)
    );
  }

  loadIbtCancellationRequest(
    loadPendingPayload: RequestApprovalsActions.LoadIbtCancellationRequestPayload
  ) {
    this.store.dispatch(
      new RequestApprovalsActions.LoadIBtCancellationRequest(loadPendingPayload)
    );
  }

  loadFocRequest(
    loadPendingPayload: RequestApprovalsActions.LoadIbtRequestPayload
  ) {
    this.store.dispatch(
      new RequestApprovalsActions.LoadFOCRequest(loadPendingPayload)
    );
  }

  loadPSVRequest(
    loadPendingPayload: RequestApprovalsActions.LoadIbtRequestPayload
  ) {
    this.store.dispatch(
      new RequestApprovalsActions.LoadPSVRequest(loadPendingPayload)
    );
  }

  loadEXHRequest(
    loadPendingPayload: RequestApprovalsActions.LoadIbtRequestPayload
  ) {
    this.store.dispatch(
      new RequestApprovalsActions.LoadEXHRequest(loadPendingPayload)
    );
  }

  ClearPSVRequest() {
    this.store.dispatch(new RequestApprovalsActions.ClearPSVRequest());
  }

  ClearFOCRequest() {
    this.store.dispatch(new RequestApprovalsActions.ClearFOCRequest());
  }

  ClearLOSSRequest() {
    this.store.dispatch(new RequestApprovalsActions.ClearLOSSRequest());
  }

  ClearLOANRequest() {
    this.store.dispatch(new RequestApprovalsActions.ClearLOANRequest());
  }

  ClearADJRequest() {
    this.store.dispatch(new RequestApprovalsActions.ClearADJRequest());
  }

  ClearExhRequest() {
    this.store.dispatch(new RequestApprovalsActions.ClearExhRequest());
  }

  ClearIbtRequest() {
    this.store.dispatch(new RequestApprovalsActions.ClearIbtSearchItems());
  }

  ClearBinRequest() {
    this.store.dispatch(new RequestApprovalsActions.SearchClear());
  }

  loadLOSSRequest(
    loadPendingPayload: RequestApprovalsActions.LoadIbtRequestPayload
  ) {
    this.store.dispatch(
      new RequestApprovalsActions.LoadLOSSRequest(loadPendingPayload)
    );
  }

  loadLOANRequest(
    loadPendingPayload: RequestApprovalsActions.LoadIbtRequestPayload
  ) {
    this.store.dispatch(
      new RequestApprovalsActions.LoadLOANRequest(loadPendingPayload)
    );
  }

  loadADJRequest(
    loadPendingPayload: RequestApprovalsActions.LoadIbtRequestPayload
  ) {
    this.store.dispatch(
      new RequestApprovalsActions.LoadADJRequest(loadPendingPayload)
    );
  }

  loadIbtRequestItems(
    loadPendingPayload: RequestApprovalsActions.GetIbtRequestPayload
  ) {
    this.store.dispatch(
      new RequestApprovalsActions.LoadIbtRequestApprovals(loadPendingPayload)
    );
  }

  loadIbtCancelRequestItems(
    loadPendingPayload: RequestApprovalsActions.GetIbtRequestPayload
  ) {
    this.store.dispatch(
      new RequestApprovalsActions.LoadIbtCancelRequestItemsApprovals(
        loadPendingPayload
      )
    );
  }

  loadSelectedRequest(payload: SelectedStockPayload) {
    this.store.dispatch(
      new RequestApprovalsActions.LoadSelectedRequest(payload)
    );
  }

  loadSelectedCancelRequest(payload: SelectedStockPayload) {
    this.store.dispatch(
      new RequestApprovalsActions.LoadSelectedCancelRequest(payload)
    );
  }

  clearItemList() {
    this.store.dispatch(new RequestApprovalsActions.ClearItemList());
  }

  // Image
  loadThumbnailImageUrl(payload: ImageReqPayload) {
    this.store.dispatch(
      new  RequestApprovalsActions.LoadThumbnailImageUrl(payload)
    );
  }
  loadImageUrl(payload: ImageReqPayload) {
    this.store.dispatch(new  RequestApprovalsActions.LoadImageUrl(payload));
  }
}
