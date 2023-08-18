import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as CtAcceptAdvanceActions from './ct-accept-advance.actions';
import { CtAcceptAdvanceSelectors } from './ct-accept-advance.selectors';
import { CtAcceptAdvanceState } from './ct-accept-advance.state';
import {
  UpdateAdvanceRequestPayload,
  PartialUpdateAdvanceRequestPayload,
  InitiateAdvanceResponse,
  UpdateAdvanceTransactionResponse,
  CustomErrors,
  AdvanceHistoryItemsRequestPayload,
  HistorySearchParamDetails
} from '@poss-web/shared/models';
import { Observable } from 'rxjs';

@Injectable()
export class CtAcceptAdvanceFacade {
  constructor(private store: Store<CtAcceptAdvanceState>) {}

  private error$ = this.store.select(CtAcceptAdvanceSelectors.selectError);

  private isLoading$ = this.store.select(
    CtAcceptAdvanceSelectors.selectIsLoading
  );

  private selectedRsoName$ = this.store.select(
    CtAcceptAdvanceSelectors.selectSelectedRsoName
  );

  private initiateAdvanceResponse$ = this.store.select(
    CtAcceptAdvanceSelectors.selectInitiateAdvanceResponse
  );

  private updateAdvanceResponse$ = this.store.select(
    CtAcceptAdvanceSelectors.selectUpdateAdvanceResponse
  );

  private partiallyUpdateAdvanceResponse$ = this.store.select(
    CtAcceptAdvanceSelectors.selectPartiallyUpdateAdvanceResponse
  );

  private rsoDetails$ = this.store.select(
    CtAcceptAdvanceSelectors.selectLoadRSODetails
  );

  private remarks$ = this.store.select(CtAcceptAdvanceSelectors.selectRemarks);

  private viewAdvanceResponse$ = this.store.select(
    CtAcceptAdvanceSelectors.selectViewAdvanceResponse
  );

  private advanceHistoryItems$ = this.store.select(
    CtAcceptAdvanceSelectors.selectAdvanceHistoryResponse
  );

  private historySearchParamDetails$ = this.store.select(
    CtAcceptAdvanceSelectors.selectHistorySearchParamDetails
  );

  private orderNumber$ = this.store.select(
    CtAcceptAdvanceSelectors.selectOrderNumber
  );

  private deleteAdvanceTransactionResponse$ = this.store.select(
    CtAcceptAdvanceSelectors.selectDeleteTransactionResponse
  );

  setTotalAmount(totalAmount: number) {
    this.store.dispatch(new CtAcceptAdvanceActions.SetTotalAmount(totalAmount));
  }

  loadRsoDetails(roleCode: string) {
    this.store.dispatch(new CtAcceptAdvanceActions.LoadRSODetails(roleCode));
  }

  initiateAdvance() {
    this.store.dispatch(new CtAcceptAdvanceActions.InitiateAdvance());
  }

  updateAdvance(id: string, requestPayload: UpdateAdvanceRequestPayload) {
    this.store.dispatch(
      new CtAcceptAdvanceActions.UpdateAdvance(id, requestPayload)
    );
  }

  partiallyUpdateAdvance(
    id: string,
    requestPayload: PartialUpdateAdvanceRequestPayload
  ) {
    this.store.dispatch(
      new CtAcceptAdvanceActions.PartiallyUpdateAdvance(id, requestPayload)
    );
  }

  loadAdvanceHistory(
    requestPayload: AdvanceHistoryItemsRequestPayload,
    searchField?: string,
    searchType?: string,
    status?: string,
    page?: number,
    size?: number
  ) {
    console.log('FACADE PAGE :', page);
    this.store.dispatch(
      new CtAcceptAdvanceActions.LoadAdvanceHistory(
        requestPayload,
        searchField,
        searchType,
        status,
        page,
        size
      )
    );
  }

  clearAdvanceHistoryItems() {
    this.store.dispatch(
      new CtAcceptAdvanceActions.LoadAdvanceHistorySuccess(null)
    );
  }

  clearHistorySearchParamDetails() {
    this.store.dispatch(
      new CtAcceptAdvanceActions.SetHistoryAdvanceSearchParamDetails(null)
    );
  }

  getViewAdvanceDetails(id: string) {
    this.store.dispatch(new CtAcceptAdvanceActions.ViewAdvance(id));
  }

  setSelectedRsoName(selectedRsoName: { value: string; description: string }) {
    this.store.dispatch(
      new CtAcceptAdvanceActions.SetSelectedRsoName(selectedRsoName)
    );
  }

  setRemarks(remarks: string) {
    this.store.dispatch(new CtAcceptAdvanceActions.SetRemarks(remarks));
  }

  setHistorySearchParamDetails(payload: HistorySearchParamDetails) {
    this.store.dispatch(
      new CtAcceptAdvanceActions.SetHistoryAdvanceSearchParamDetails(payload)
    );
  }

  setOrderNumber(value: number, status: string) {
    this.store.dispatch(
      new CtAcceptAdvanceActions.SetOrderNumber(value, status)
    );
  }

  deleteAdvanceTransactionDetails(id: string) {
    this.store.dispatch(
      new CtAcceptAdvanceActions.DeleteAdvanceTransactionDetails(id)
    );
  }

  resetAcceptAdvance() {
    this.store.dispatch(new CtAcceptAdvanceActions.ResetAcceptAdvance());
  }

  getSelectedRsoName(): Observable<{ value: string; description: string }> {
    return this.selectedRsoName$;
  }

  getInitiateAdvanceResponse(): Observable<InitiateAdvanceResponse> {
    return this.initiateAdvanceResponse$;
  }

  getUpdateAdvanceResponse(): Observable<UpdateAdvanceTransactionResponse> {
    return this.updateAdvanceResponse$;
  }

  getPartiallyUpdateAdvanceResponse(): Observable<any> {
    return this.partiallyUpdateAdvanceResponse$;
  }

  getViewAdvanceResponse(): Observable<any> {
    return this.viewAdvanceResponse$;
  }

  getError(): Observable<CustomErrors> {
    return this.error$;
  }

  getIsLoading(): Observable<boolean> {
    return this.isLoading$;
  }

  getRsoDetails() {
    return this.rsoDetails$;
  }

  getRemarks() {
    return this.remarks$;
  }

  getAdvanceHistoryItems() {
    return this.advanceHistoryItems$;
  }

  getHistorySearchParamDetails(): Observable<HistorySearchParamDetails> {
    return this.historySearchParamDetails$;
  }

  getOrderNumber() {
    return this.orderNumber$;
  }

  getDeleteAdvanceTransactionResponse(): Observable<any> {
    return this.deleteAdvanceTransactionResponse$;
  }
}
