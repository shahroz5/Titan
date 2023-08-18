import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { GrnSate } from './grn.state';
import * as GrnActions from './grn.actions';

import {
  GrnReqStatusListPayload,
  ConfirmGrnPayload,
  GrnInitPayload,
  SendForApprovalPayload,
  ConfirmGrnWithOutApprovalPayload,
  GrnApproversPayload,
  GrnHistoryPayload,
  GrnPriceDetailsPayload,
  ItemDetailsPayload
} from '@poss-web/shared/models';
import { grnSelectors } from './grn.selector';
import { Observable } from 'rxjs';

@Injectable()
export class GrnFacade {
  constructor(public store: Store<GrnSate>) {}
  private grnReqStatus$ = this.store.select(grnSelectors.selectGrnReqStatus);
  private error$ = this.store.select(grnSelectors.selectError);
  private hasSaved$ = this.store.select(grnSelectors.selectHassaved);
  private hasUpdated$ = this.store.select(grnSelectors.selectHasUpdated);

  private isLoading$ = this.store.select(grnSelectors.selectIsLoading);
  private totalElements$ = this.store.select(grnSelectors.selectTotalElement);

  private status$ = this.store.select(grnSelectors.selectstatus);
  private totalReturnGrn$ = this.store.select(
    grnSelectors.selectTotalReturnGrn
  );
  private totalReturnProducts$ = this.store.select(
    grnSelectors.selectTotalReturnProduct
  );

  private grnDetails$ = this.store.select(grnSelectors.selectGrnDetails);

  private tcsCollectedAmount$ = this.store.select(
    grnSelectors.selectTcsCollectedAmount
  );
  private focDeductionAmount$ = this.store.select(
    grnSelectors.selectFocDeductionValue
  );
  private customerId$ = this.store.select(grnSelectors.selectCustomerId);
  private grnConfirmResponse$ = this.store.select(
    grnSelectors.selectGrnConfirmResponse
  );

  private reqId$ = this.store.select(grnSelectors.selectReqId);
  private grnInitiateResponse$ = this.store.select(
    grnSelectors.selectGrnInitResponse
  );
  private itemDetails$ = this.store.select(
    grnSelectors.selectItemDetails
  );

  private locationCodes$ = this.store.select(grnSelectors.selectLocationCodes);
  private approvers$ = this.store.select(grnSelectors.selectApprovers);

  private grnHistory$ = this.store.select(grnSelectors.selectGrnHistoryDetails);
  private totalGrnHistoryReq$ = this.store.select(
    grnSelectors.selectTotalGrnHistoryReq
  );
  private grnReasons$ = this.store.select(grnSelectors.selectGrnReasons);
  private grnFinalPriceDetails$ = this.store.select(
    grnSelectors.selectGrnFinalPriceDetails
  );

  private historySearchParamDetails$ = this.store.select(
    grnSelectors.selectHistorySearchParamDetails
  );

  getGrnReasons() {
    return this.grnReasons$;
  }
  getTotalGrnHistoryReq() {
    return this.totalGrnHistoryReq$;
  }
  getGrnHistory() {
    return this.grnHistory$;
  }
  getGrnReqId() {
    return this.reqId$;
  }
  getGrnConfirmResponse() {
    return this.grnConfirmResponse$;
  }
  getCustomerId() {
    return this.customerId$;
  }
  getGrnDetails() {
    return this.grnDetails$;
  }
  getTotalReturnProducts() {
    return this.totalReturnProducts$;
  }
  getTotalReturnGrn() {
    return this.totalReturnGrn$;
  }
  getStatus() {
    return this.status$;
  }
  getError() {
    return this.error$;
  }
  getIsloading() {
    return this.isLoading$;
  }
  getHasSaved() {
    return this.hasSaved$;
  }
  getHasUpdated() {
    return this.hasUpdated$;
  }
  getTotalElement() {
    return this.totalElements$;
  }

  getGrnReqStatus() {
    return this.grnReqStatus$;
  }
  getInitiateGrnResponse() {
    return this.grnInitiateResponse$;
  }
  getItemDetails() {
    return this.itemDetails$;
  }
  getLocationCodes() {
    return this.locationCodes$;
  }
  getApprovers() {
    return this.approvers$;
  }
  getGrnFinalPriceDetails() {
    return this.grnFinalPriceDetails$;
  }

  getTcsCollectedAmount() {
    return this.tcsCollectedAmount$;
  }
  getFocDeductionAmount() {
    return this.focDeductionAmount$;
  }
  setFocDeduction(focDeductionValue) {
    this.store.dispatch(new GrnActions.SetFocDeductionValue(focDeductionValue));
  }
  loadGrnReqStatusList(grnReqStatusListPayload: GrnReqStatusListPayload) {
    this.store.dispatch(
      new GrnActions.LoadGrnReqStatusList(grnReqStatusListPayload)
    );
  }

  filterGrnReqStatusList(grnReqStatusListPayload: GrnReqStatusListPayload) {
    this.store.dispatch(
      new GrnActions.FilterGrnReqStatusList(grnReqStatusListPayload)
    );
  }

  searchGrn(grnReqStatusListPayload: GrnReqStatusListPayload) {
    this.store.dispatch(new GrnActions.SearchGrn(grnReqStatusListPayload));
  }
  loadGrnDetails(grnId: string, creditNoteType?: string) {
    this.store.dispatch(new GrnActions.LoadGrnDetailsById({grnId, creditNoteType}));
  }
  confirmGrn(confirmGrnPayload: ConfirmGrnPayload) {
    this.store.dispatch(new GrnActions.ConfirmGrn(confirmGrnPayload));
  }
  loadInitiateGrn(initiateGrnPayload: GrnInitPayload) {
    this.store.dispatch(new GrnActions.InitiateGrn(initiateGrnPayload));
  }
  loadItemDetails(itemDetailsPayload: ItemDetailsPayload) {
    this.store.dispatch(new GrnActions.LoadItem(itemDetailsPayload));
  }
  sendForApproval(sendForApprovalPayload: SendForApprovalPayload) {
    this.store.dispatch(new GrnActions.SendForApproval(sendForApprovalPayload));
  }

  confirmGrnWithOutApproval(
    confirmGrnWithOutApprovalPayload: ConfirmGrnWithOutApprovalPayload
  ) {
    this.store.dispatch(
      new GrnActions.ConfirmGrnWithOutApproval(confirmGrnWithOutApprovalPayload)
    );
  }
  loadLocations() {
    this.store.dispatch(new GrnActions.GetLocationCodes());
  }
  loadApprovers(payload: GrnApproversPayload) {
    this.store.dispatch(new GrnActions.GetApprovers(payload));
  }
  loadSummaryData(count, value) {
    this.store.dispatch(new GrnActions.LoadSummaryDetails(count, value));
  }

  loadGrnHistory(grnHistoryPayload: GrnHistoryPayload) {
    this.store.dispatch(
      new GrnActions.LoadGrnHistoryDetails(grnHistoryPayload)
    );
  }

  clearGrnHistoryItems() {
    this.store.dispatch(new GrnActions.LoadGrnHistoryDetailsSuccess(null));
  }

  clearHistorySearchParamDetails() {
    this.store.dispatch(new GrnActions.SetHistorySearchParamDetails(null));
  }

  getHistorySearchParamDetails(): Observable<GrnHistoryPayload> {
    return this.historySearchParamDetails$;
  }

  setHistorySearchParamDetails(payload: GrnHistoryPayload) {
    this.store.dispatch(
      new GrnActions.SetHistorySearchParamDetails(payload)
    );
  }

  loadReset() {
    this.store.dispatch(new GrnActions.LoadReset());
  }
  loadGrnReasons(lov: string) {
    this.store.dispatch(new GrnActions.LoadGrnReasons(lov));
  }
  loadGrnFinalPriceDetails(grnPriceDetailsPayload: GrnPriceDetailsPayload) {
    this.store.dispatch(
      new GrnActions.LoadGrnItemPriceDetails(grnPriceDetailsPayload)
    );
  }

  loadTcsCollectedAmount(id: string) {
    this.store.dispatch(new GrnActions.LoadCollectedTcsAmount(id));
  }
}
