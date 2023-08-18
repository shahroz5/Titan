import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  AddGiftCardItemPayload,
  GcCashMemoCancelRequestBody,
  GcCashMemoDetailsRequest,
  GiftCardItem,
  GiftCardsHistoryRequestPayload,
  PartiallyUpdateGcCmPayload,
  PartiallyUpdateGiftDetailsPayload,
  QCGCGetBalancePayload
} from '@poss-web/shared/models';
import * as GiftCardsActions from './gift-cards.actions';
import { giftCardsSelectors } from './gift-cards.selectors';
import { GiftCardsState } from './gift-cards.state';

@Injectable()
export class GiftCardsFacade {
  constructor(private store: Store<GiftCardsState>) {}

  private error$ = this.store.select(giftCardsSelectors.selectError);

  private isLoading$ = this.store.select(giftCardsSelectors.selectIsLoading);

  private gcCashMemoDetails$ = this.store.select(
    giftCardsSelectors.selectGcCashMemoDetails
  );

  private partiallyUpdatedGcCmResponse$ = this.store.select(
    giftCardsSelectors.selectPartiallyUpdatedGcCmResponse
  );

  private updatedGcCashMemoResponse$ = this.store.select(
    giftCardsSelectors.selectUpdateGcCashMemoResponse
  );

  private addGiftCardItemResponse$ = this.store.select(
    giftCardsSelectors.selectAddGiftCardItemResponse
  );

  private getAddedGiftCardItemResponse$ = this.store.select(
    giftCardsSelectors.selectGetAddedGiftCardItemResponse
  );

  private deleteAddedGiftCardItemResponse$ = this.store.select(
    giftCardsSelectors.selectDeleteAddedGiftCardItemResponse
  );

  private partiallyUpdateGiftCardItemResponse$ = this.store.select(
    giftCardsSelectors.selectPartiallyUpdateGiftCardItemResponse
  );

  private printDataResponse$ = this.store.select(
    giftCardsSelectors.selectprintDataResponse
  );

  private gcCashMemoReadyForCancellation$ = this.store.select(
    giftCardsSelectors.selectGcCashMemoAvailableForCancellation
  );

  private selectedGcCashMemoData$ = this.store.select(
    giftCardsSelectors.selectSelectedGcCashMemoData
  );

  private selectedRSOName$ = this.store.select(
    giftCardsSelectors.selectSelectedRSOName
  );

  private cardsTotalAmount$ = this.store.select(
    giftCardsSelectors.selectCardsTotalAmount
  );

  private cardsTotalQty$ = this.store.select(
    giftCardsSelectors.selectCardsTotalQty
  );

  private gcTotalPaidAmount$ = this.store.select(
    giftCardsSelectors.selectGcTotalPaidAmount
  );

  private gcBalance$ = this.store.select(giftCardsSelectors.selectGcBalance);

  private cardsList$ = this.store.select(giftCardsSelectors.selectCardsList);

  private maxAmount$ = this.store.select(giftCardsSelectors.selectMaxAmount);

  private minAmount$ = this.store.select(giftCardsSelectors.selectMinAmount);

  private rsoDetails$ = this.store.select(
    giftCardsSelectors.selectLoadRSODetails
  );

  private gcCashMemoCancelResponse$ = this.store.select(
    giftCardsSelectors.selectGcCashMemoCancelResponse
  );

  private gcCancellationReasons$ = this.store.select(
    giftCardsSelectors.selectGcCancellationReasons
  );

  private selectedCancellationReason$ = this.store.select(
    giftCardsSelectors.selectSelectedCancellationReason
  );

  private remarks$ = this.store.select(giftCardsSelectors.selectRemarks);

  private orderNumber$ = this.store.select(
    giftCardsSelectors.selectOrderNumber
  );
  private gcHistory$ = this.store.select(
    giftCardsSelectors.selectGcHistoryListing
  );
  private gcHistoryTotalElements$ = this.store.select(
    giftCardsSelectors.selectGcHistoryTotalElements
  );
  private historySearchParameter$ = this.store.select(
    giftCardsSelectors.selectHistorySearchParameter
  );

  createGcCashMemo() {
    this.store.dispatch(new GiftCardsActions.CreateGcCashMemo());
  }

  partiallyUpdateGcCashMemo(
    cashMemoId: string,
    requestBody: PartiallyUpdateGcCmPayload
  ) {
    this.store.dispatch(
      new GiftCardsActions.PartiallyUpdateGcCashMemo(cashMemoId, requestBody)
    );
  }

  addGiftCardItem(cashMemoId: string, requestBody: AddGiftCardItemPayload) {
    this.store.dispatch(
      new GiftCardsActions.AddGiftCardItem(cashMemoId, requestBody)
    );
  }

  getAddedGiftCardItem(cashMemoId: string, giftCardItemId: string) {
    this.store.dispatch(
      new GiftCardsActions.GetAddedGiftCardItem(cashMemoId, giftCardItemId)
    );
  }

  deleteAddedGiftCardItem(cashMemoId: string, giftCardItemId: string) {
    this.store.dispatch(
      new GiftCardsActions.DeleteAddedGiftCardItem(cashMemoId, giftCardItemId)
    );
  }

  partiallyUpdateGiftCardItem(
    cashMemoId: string,
    giftCardItemId: string,
    requestBody: PartiallyUpdateGiftDetailsPayload
  ) {
    this.store.dispatch(
      new GiftCardsActions.PartiallyUpdateGiftCardItem(
        cashMemoId,
        giftCardItemId,
        requestBody
      )
    );
  }

  updateGcCashMemo(
    cashMemoId: string,
    requestDetails: GcCashMemoDetailsRequest
  ) {
    this.store.dispatch(
      new GiftCardsActions.UpdateGcCashMemo(cashMemoId, requestDetails)
    );
  }

  loadRsoDetails(roleCode: string) {
    this.store.dispatch(new GiftCardsActions.LoadRSODetails(roleCode));
  }

  loadGcCashMemoAvailableForCancellation(
    mobileNumber: string,
    cmNumber: number
  ) {
    this.store.dispatch(
      new GiftCardsActions.LoadCashMemoBillsAvailableForCancellation(
        mobileNumber,
        cmNumber
      )
    );
  }

  loadSelectedGcCashMemoDetails(cashMemoId: string) {
    this.store.dispatch(
      new GiftCardsActions.LoadSelectedGcCashMemoDetails(cashMemoId)
    );
  }

  loadCancelGcCashMemo(requestBody: GcCashMemoCancelRequestBody) {
    this.store.dispatch(new GiftCardsActions.LoadCancelGcCashMemo(requestBody));
  }

  loadGcBalance(requestBody: QCGCGetBalancePayload) {
    this.store.dispatch(new GiftCardsActions.LoadGcBalance(requestBody));
  }

  clearGcBalance() {
    this.store.dispatch(new GiftCardsActions.LoadGcBalanceSuccess(null));
  }

  setRemarks(remarks: string) {
    this.store.dispatch(new GiftCardsActions.SetRemarks(remarks));
  }

  printGcCashMemo() {
    this.store.dispatch(new GiftCardsActions.PrintGcCashMemo());
  }

  loadGcCancellationReasons() {
    this.store.dispatch(new GiftCardsActions.LoadGcCancellationReasons());
  }

  loadSelectedRSOName(selectedRSOName: { value: string; description: string }) {
    this.store.dispatch(
      new GiftCardsActions.SetSelectedRSOName(selectedRSOName)
    );
  }

  setSelectedCancellationReason(selectedCancellationReason: string) {
    this.store.dispatch(
      new GiftCardsActions.SetSelectedCancellationReason(
        selectedCancellationReason
      )
    );
  }

  setCardsTotalAmount(cardsTotalAmount: number) {
    this.store.dispatch(
      new GiftCardsActions.SetCardsTotalAmount(cardsTotalAmount)
    );
  }

  setGcTotalPaidAmount(gcTotalPaidAmount: number) {
    this.store.dispatch(
      new GiftCardsActions.SetGcTotalPaidAmount(gcTotalPaidAmount)
    );
  }

  setCardsTotalQty(cardsTotalQty: number) {
    this.store.dispatch(new GiftCardsActions.SetCardsTotalQty(cardsTotalQty));
  }

  loadCardsList(cardsList: GiftCardItem[]) {
    this.store.dispatch(new GiftCardsActions.LoadCardsList(cardsList));
  }

  resetGiftCardsData() {
    this.store.dispatch(new GiftCardsActions.ResetGiftCardsData());
  }

  setOrderNumber(value: number, status: string) {
    this.store.dispatch(new GiftCardsActions.SetOrderNumber(value, status));
  }
  loadGiftCardsHistoryListItems(
    giftCardsHistoryRequestPayload: GiftCardsHistoryRequestPayload
  ) {
    this.store.dispatch(
      new GiftCardsActions.LoadGiftCardsHistoryListItems(
        giftCardsHistoryRequestPayload
      )
    );
  }
  resetHistory() {
    this.store.dispatch(new GiftCardsActions.ResetHistory());
  }
  updatetHistorySearchParameter(
    giftCardsHistoryRequestPayload: GiftCardsHistoryRequestPayload
  ) {
    this.store.dispatch(
      new GiftCardsActions.UpdateHistorySearchParameter(
        giftCardsHistoryRequestPayload
      )
    );
  }

  getError() {
    return this.error$;
  }

  getIsLoading() {
    return this.isLoading$;
  }

  getGcCashMemoDetails() {
    return this.gcCashMemoDetails$;
  }

  getPartiallyUpdatedGcCmResponse() {
    return this.partiallyUpdatedGcCmResponse$;
  }

  getAddGiftCardItemResponse() {
    return this.addGiftCardItemResponse$;
  }

  getAddedGiftCardItemResponse() {
    return this.getAddedGiftCardItemResponse$;
  }

  getDeleteAddedGiftCardItemResponse() {
    return this.deleteAddedGiftCardItemResponse$;
  }

  getPartiallyUpdateGiftCardItemResponse() {
    return this.partiallyUpdateGiftCardItemResponse$;
  }

  getUpdateGcCashMemoResponse() {
    return this.updatedGcCashMemoResponse$;
  }

  getPrintDataResponse() {
    return this.printDataResponse$;
  }

  getCashMemoAvailableForCancellation() {
    return this.gcCashMemoReadyForCancellation$;
  }

  getSelectedGcCashMemoDetails() {
    return this.selectedGcCashMemoData$;
  }

  getGcCashMemoCancelResponse() {
    return this.gcCashMemoCancelResponse$;
  }

  getGcCancellationReasons() {
    return this.gcCancellationReasons$;
  }

  getSelectedCancellationReason() {
    return this.selectedCancellationReason$;
  }

  getTotalCardsAmount() {
    return this.cardsTotalAmount$;
  }

  getGcTotalPaidAmount() {
    return this.gcTotalPaidAmount$;
  }

  getTotalCardsQty() {
    return this.cardsTotalQty$;
  }

  getSelectedRSONames() {
    return this.selectedRSOName$;
  }

  getCardsList() {
    return this.cardsList$;
  }

  getMaxAmount() {
    return this.maxAmount$;
  }

  getMinAmount() {
    return this.minAmount$;
  }

  getRsoDetails() {
    return this.rsoDetails$;
  }

  getRemarks() {
    return this.remarks$;
  }

  getOrderNumber() {
    return this.orderNumber$;
  }

  getGcBalance() {
    return this.gcBalance$;
  }

  getGiftCardsHistory() {
    return this.gcHistory$;
  }
  getGiftCardsHistoryTotalElements() {
    return this.gcHistoryTotalElements$;
  }
  getHistorySearchParameter() {
    return this.historySearchParameter$;
  }
}
