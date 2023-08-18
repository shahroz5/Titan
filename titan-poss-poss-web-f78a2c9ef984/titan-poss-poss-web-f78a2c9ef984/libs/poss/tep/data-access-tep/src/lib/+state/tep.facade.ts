import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { TEPRequestState } from './tep.state';
import { TEPRequestSelectors } from './tep.selectors';
import {
  ABSearchValues,
  AdvanceBookingSearchPayload,
  AdvanceHistoryItemsRequestPayload,
  GetTepItemConfiguratonResponse,
  HistorySearchParamDetails,
  RefundRequestPayload,
  RequestPayload,
  SortItem,
  TEPDownValues,
  workflowPayload
} from '@poss-web/shared/models';
import * as TEPRequestActions from './tep.actions';
import { Observable } from 'rxjs';

@Injectable()
export class TEPRequestFacade {
  constructor(private store: Store<TEPRequestState>) {}

  private hasError$ = this.store.select(TEPRequestSelectors.selectHasError);

  private isLoading$ = this.store.select(TEPRequestSelectors.selectIsLoading);

  private requestCout$ = this.store.select(
    TEPRequestSelectors.selectRequestCount
  );

  private refundCout$ = this.store.select(
    TEPRequestSelectors.selectRefundCount
  );
  private workflowDeatils$ = this.store.select(
    TEPRequestSelectors.selectWorkflowDetails
  );
  private selectedData$ = this.store.select(TEPRequestSelectors.selectedData);

  private selectRequests$ = this.store.select(
    TEPRequestSelectors.selectRequests
  );

  private selectRefundRequests$ = this.store.select(
    TEPRequestSelectors.selectRefunds
  );

  private tepItemConfiguratonResponse$ = this.store.select(
    TEPRequestSelectors.selectTepItemConfiguratonResponse
  );

  private selectApprovedRefundDetails$ = this.store.select(
    TEPRequestSelectors.selectedApprovedData
  );

  private dropDownValue$ = this.store.select(
    TEPRequestSelectors.dropDownValues
  );
  private refundDropDownValue$ = this.store.select(
    TEPRequestSelectors.refundDropDownValues
  );
  private searchValues$ = this.store.select(
    TEPRequestSelectors.selectSearchValues
  );

  private searchTEPResponse$ = this.store.select(
    TEPRequestSelectors.SearchTEPResponse
  );

  private searchTEPcount$ = this.store.select(
    TEPRequestSelectors.selectTEPCount
  );
  private historySearchParamDetails$ = this.store.select(
    TEPRequestSelectors.selectHistorySearchParamDetails
  );

  private historyItems$ = this.store.select(
    TEPRequestSelectors.selectTEPHistoryResponse
  );

  setDropDownValue(payload: TEPDownValues) {
    this.store.dispatch(new TEPRequestActions.SetDropownValues(payload));
  }

  clearHistorySearchParamDetails() {
    this.store.dispatch(
      new TEPRequestActions.SetHistoryTEPSearchParamDetails(null)
    );
  }

  getTEPHistoryItems() {
    return this.historyItems$;
  }
  getSearchTEPCount() {
    return this.searchTEPcount$;
  }
  getTEPSearchResposne() {
    return this.searchTEPResponse$;
  }
  getSearchValues() {
    return this.searchValues$;
  }
  setRefundDropDownValue(payload: TEPDownValues) {
    this.store.dispatch(new TEPRequestActions.SetRefundDropownValues(payload));
  }

  getTepItemConfiguratonResponse(): Observable<GetTepItemConfiguratonResponse> {
    return this.tepItemConfiguratonResponse$;
  }

  clearSearchList() {
    this.store.dispatch(new TEPRequestActions.ClearSearchList());
  }
  resetValue() {
    this.store.dispatch(new TEPRequestActions.ResetValues());
  }
  getOrderSendToRO() {
    return this.selectApprovedRefundDetails$;
  }
  getSelectedData() {
    return this.selectedData$;
  }
  getWorkflowDetails() {
    return this.workflowDeatils$;
  }
  getDropdownValue() {
    return this.dropDownValue$;
  }

  getrefundDropdownValue() {
    return this.refundDropDownValue$;
  }

  loadTEPHistory(
    requestPayload: AdvanceHistoryItemsRequestPayload,
    searchField?: string,
    searchType?: string,
    status?: string,
    page?: number,
    size?: number,
    txnType?: string,
    subTxnType?: string,
    sort?: SortItem
  ) {
    this.store.dispatch(
      new TEPRequestActions.LoadTEPHistory(
        requestPayload,
        searchField,
        searchType,
        status,
        page,
        size,
        txnType,
        subTxnType,
        sort
      )
    );
  }

  getHistorySearchParamDetails(): Observable<HistorySearchParamDetails> {
    return this.historySearchParamDetails$;
  }

  getSelectedRequests() {
    return this.selectRequests$;
  }

  getSelectedRefundRequests() {
    return this.selectRefundRequests$;
  }

  loadRequests(data: RequestPayload) {
    this.store.dispatch(new TEPRequestActions.LoadRequests(data));
  }

  loadTepRefundDetails(data: RefundRequestPayload) {
    this.store.dispatch(new TEPRequestActions.LoadRefundOrderDeatils(data));
  }

  ApproveRefundDetails(data: RefundRequestPayload) {
    this.store.dispatch(new TEPRequestActions.ApproveRefundOrderDeatils(data));
  }

  loadRefundRequests(data: RequestPayload) {
    this.store.dispatch(new TEPRequestActions.LoadRefundRequests(data));
  }

  loadworkflowProcessDetails(data: workflowPayload) {
    this.store.dispatch(new TEPRequestActions.LoadWorkflowDeatils(data));
  }
  setSearchValue(payload: ABSearchValues) {
    this.store.dispatch(new TEPRequestActions.SetSearchValues(payload));
  }
  loadTepItemConfiguration(
    itemCode: string,
    tepType: string,
    customerMobileNo?: string
  ) {
    this.store.dispatch(
      new TEPRequestActions.GetTepItemConfiguration(
        itemCode,
        tepType,
        customerMobileNo
      )
    );
  }

  searchTEP(
    searchValue?: AdvanceBookingSearchPayload,
    notConfirmedRequestPayload?: RequestPayload
  ) {
    this.store.dispatch(
      new TEPRequestActions.SearchTEP(searchValue, notConfirmedRequestPayload)
    );
  }

  setHistorySearchParamDetails(payload: HistorySearchParamDetails) {
    this.store.dispatch(
      new TEPRequestActions.SetHistoryTEPSearchParamDetails(payload)
    );
  }
  getHasError() {
    return this.hasError$;
  }

  getIsLoading() {
    return this.isLoading$;
  }

  getRequestCount() {
    return this.requestCout$;
  }

  getRefundCount() {
    return this.refundCout$;
  }
}
