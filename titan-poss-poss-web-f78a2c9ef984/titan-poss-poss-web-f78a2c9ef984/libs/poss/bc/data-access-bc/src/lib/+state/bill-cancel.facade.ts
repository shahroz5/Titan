import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { BillCancelSelector } from './bill-cancel.selector';
import * as actions from './bill-cancel.actions';
import { BillCancelState } from './bill-cancel.state';
import {
  CashMemoItemDetailsRequestPayload,
  CashMemoDetailsRequestPayload,
  CmBillListPayload,
  bcHistoryRequestPayload,
  bcHistoryRequestParams
} from '@poss-web/shared/models';
import { Observable } from 'rxjs';
@Injectable()
export class BillCancelFacade {
  constructor(private store: Store<BillCancelState>) {}

  private cancelRequest$ = this.store.select(BillCancelSelector.cancelResponse);

  private confirmRequest$ = this.store.select(
    BillCancelSelector.confirmResponse
  );

  private viewCashMemoResponse$ = this.store.select(
    BillCancelSelector.selectViewCashMemoResponse
  );

  private itemDetails$ = this.store.select(
    BillCancelSelector.selectItemDetails
  );

  private historySearchParamDetails$ = this.store.select(
    BillCancelSelector.selectHistorySearchParamDetails
  );

  private isLoading$ = this.store.select(BillCancelSelector.selectLoading);

  private hasError$ = this.store.select(BillCancelSelector.selecthasError);

  private cmBillList$ = this.store.select(BillCancelSelector.selectCmBillList);

  private rsoDetails$ = this.store.select(BillCancelSelector.selectRsoDetails);

  private reasons$ = this.store.select(BillCancelSelector.selectReason);

  private CancelType$ = this.store.select(BillCancelSelector.CancelType);

  private bcHistoryList$ = this.store.select(BillCancelSelector.selectBcList);

  private errorWhileCancellingBill$ = this.store.select(
    BillCancelSelector.selectErrorWhileCancellingBill
  );

  getBcList() {
    return this.bcHistoryList$;
  }

  getConfirmRequest() {
    return this.confirmRequest$;
  }

  getCancelRequest() {
    return this.cancelRequest$;
  }

  getItemDetails() {
    return this.itemDetails$;
  }

  getViewCashMemoResponse() {
    return this.viewCashMemoResponse$;
  }

  getCmBillList() {
    return this.cmBillList$;
  }

  getRsoDetails() {
    return this.rsoDetails$;
  }

  getReasons() {
    return this.reasons$;
  }

  getisLoading() {
    return this.isLoading$;
  }

  hasError() {
    return this.hasError$;
  }

  getCancelType() {
    return this.CancelType$;
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

  loadConfirmData(data) {
    this.store.dispatch(new actions.ConfirmRequest(data));
  }

  cancel(data) {
    this.store.dispatch(new actions.CancelRequest(data));
  }

  loadCmBillList(data: CmBillListPayload) {
    this.store.dispatch(new actions.LoadCmBillList(data));
  }

  loadRsoDetails(data: string) {
    this.store.dispatch(new actions.LoadRSODetails(data));
  }

  loadReasons(data: string) {
    this.store.dispatch(new actions.LoadReasonForCancel(data));
  }

  resetList() {
    this.store.dispatch(new actions.ResetList());
  }
  resethistory() {
    this.store.dispatch(new actions.ResetHistory());
  }

  resetDetail() {
    this.store.dispatch(new actions.ResetDetail());
  }

  loadCancelType(data) {
    this.store.dispatch(new actions.CancelType(data));
  }
  clearHistorySearchParamDetails() {
    this.store.dispatch(new actions.SetHistorySearchParamDetails(null));
  }
  getHistorySearchParamDetails(): Observable<bcHistoryRequestParams> {
    return this.historySearchParamDetails$;
  }
  setHistorySearchParamDetails(payload: bcHistoryRequestParams) {
    this.store.dispatch(new actions.SetHistorySearchParamDetails(payload));
  }

  loadBCHistory(
    requestPayload: bcHistoryRequestPayload,
    searchField?: string,
    searchType?: string,
    page?: number,
    size?: number,
    txnType?: string,
    subTxnType?: string
  ) {
    this.store.dispatch(
      new actions.LoadBCHistory(
        requestPayload,
        searchField,
        searchType,
        page,
        size,
        txnType,
        subTxnType
      )
    );
  }
}
