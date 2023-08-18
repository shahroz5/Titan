import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { BillCancellationRequestsSelector } from './bill-cancellation-requests.selectors';
import * as actions from './bill-cancellation-requests.actions';
import { BillCancellationRequestsState } from './bill-cancellation-requests.state';
import {
  CashMemoDetailsRequestPayload,
  CashMemoItemDetailsRequestPayload
} from '@poss-web/shared/models';

@Injectable()
export class BillCancellationRequestsFacade {
  constructor(private store: Store<BillCancellationRequestsState>) {}
  private billCancellationRequest$ = this.store.select(
    BillCancellationRequestsSelector.selectbillRequests
  );

  private isLoading$ = this.store.select(
    BillCancellationRequestsSelector.selectLoading
  );

  private hasError$ = this.store.select(
    BillCancellationRequestsSelector.selecthasError
  );

  private billCancellationDetail$ = this.store.select(
    BillCancellationRequestsSelector.selectApprovedDetail
  );
  private billCancelCount$ = this.store.select(
    BillCancellationRequestsSelector.selectbillRequestCount
  );
  private location$ = this.store.select(
    BillCancellationRequestsSelector.selectLocation
  );

  private billCancelRequest$ = this.store.select(
    BillCancellationRequestsSelector.selectbillStatus
  );

  private CancelRequest$ = this.store.select(
    BillCancellationRequestsSelector.cancelResponse
  );

  private confirmRequest$ = this.store.select(
    BillCancellationRequestsSelector.confirmResponse
  );

  private DeleteRequest$ = this.store.select(
    BillCancellationRequestsSelector.deleteResponse
  );
  private BillRequestCount$ = this.store.select(
    BillCancellationRequestsSelector.countResponse
  );

  private CancelType$ = this.store.select(
    BillCancellationRequestsSelector.CancelType
  );

  private historyFilterData$ = this.store.select(
    BillCancellationRequestsSelector.selectHistoryFilterData
  );

  private viewCashMemoResponse$ = this.store.select(
    BillCancellationRequestsSelector.selectViewCashMemoResponse
  );
  private itemDetails$ = this.store.select(
    BillCancellationRequestsSelector.selectItemDetails
  );
  private selectedData$ = this.store.select(
    BillCancellationRequestsSelector.selectedData
  );

  private errorWhileCancellingBill$ = this.store.select(
    BillCancellationRequestsSelector.selectErrorWhileCancellingBill
  );

  getLocations() {
    return this.location$;
  }
  getCancelType() {
    return this.CancelType$;
  }
  getBillsCount() {
    return this.BillRequestCount$;
  }
  getbillCancellationRequest() {
    return this.billCancellationRequest$;
  }

  getisLoading() {
    return this.isLoading$;
  }

  hasError() {
    return this.hasError$;
  }

  getbillCancellationDetail() {
    return this.billCancellationDetail$;
  }

  getbillCancelCount() {
    return this.billCancelCount$;
  }
  reset() {
    this.store.dispatch(new actions.Reset());
  }
  loadBillCancellationRequests(
    data: actions.BillCancellationRequestsListPayload
  ) {
    this.store.dispatch(new actions.LoadBillCancellationRequests(data));
  }
  loadCount(data: any) {
    this.store.dispatch(new actions.LoadCountBillCancellation(data));
  }
  approveBillCancellationRequests(data: actions.ApprovePayload) {
    this.store.dispatch(new actions.ApproveBillCancellationRequests(data));
  }

  loadLocations() {
    this.store.dispatch(new actions.LoadLocation());
  }

  getbillCancellationRequestStatus() {
    return this.billCancelRequest$;
  }

  getConfirmRequest() {
    return this.confirmRequest$;
  }

  getCancelRequest() {
    return this.CancelRequest$;
  }

  getDeleteRequest() {
    return this.DeleteRequest$;
  }
  getItemDetails() {
    return this.itemDetails$;
  }

  getViewCashMemoResponse() {
    return this.viewCashMemoResponse$;
  }

  getErrorWhileCancellingBill() {
    return this.errorWhileCancellingBill$;
  }

  viewCashMemo(viewCashMemoPayload: CashMemoDetailsRequestPayload) {
    this.store.dispatch(new actions.ViewCashMemo(viewCashMemoPayload));
  }

  getItemFromCashMemo(data: CashMemoItemDetailsRequestPayload) {
    this.store.dispatch(new actions.GetItemfromCashMemo(data));
  }

  resetList() {
    this.store.dispatch(new actions.ResetBc());
  }

  getHistoryFilterData() {
    return this.historyFilterData$;
  }
  getSelectedData() {
    return this.selectedData$;
  }

  resetFilter() {
    this.store.dispatch(new actions.RESETFILTER());
  }
  resetDetail() {
    this.store.dispatch(new actions.RESETDETAIL());
  }
  loadSelectedData(data) {
    this.store.dispatch(new actions.LoadSelectedData(data));
  }
  loadHistoryFilterData(data) {
    this.store.dispatch(new actions.LoadHistoryFilterData(data));
  }
  loadConfirmData(data) {
    this.store.dispatch(new actions.CONFIRMRequest(data));
  }

  loadCancelType(data) {
    this.store.dispatch(new actions.CancelType(data));
  }

  Delete(data) {
    this.store.dispatch(new actions.DeleteRequest(data));
  }

  Cancel(data) {
    this.store.dispatch(new actions.CANCELRequest(data));
  }
  loadSelected(data) {
    this.store.dispatch(new actions.LoadSeltedData(data));
  }

  loadBillCancellationStatus(data: actions.BillCancelListPayload) {
    this.store.dispatch(new actions.LoadBillCancellationRequestsStatus(data));
  }
}
