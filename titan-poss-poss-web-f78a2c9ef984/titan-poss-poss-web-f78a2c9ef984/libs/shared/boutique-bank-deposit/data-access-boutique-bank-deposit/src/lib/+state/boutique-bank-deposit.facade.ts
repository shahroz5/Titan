import { Injectable } from '@angular/core';
import { BoutiqueBankDepositState } from './boutique-bank-deposit.state';

import { Store } from '@ngrx/store';
import {
  LoadBankDepositDetails,
  LoadDepositAmountByPifNo,
  LoadPendingDates,
  ResetBoutiqueBankDepositDetails,
  SaveBankDepositDetails,
  SaveCashDenomition
} from './boutique-bank-deposit.actions';
import { BoutiqueBankDepositSelectors } from './boutique-bank-deposit.selectors';
import { BankDetailsReqPayload, CashDenomition, PendingDatesPayload, PifNoPayload } from '@poss-web/shared/models';
@Injectable()
export class BoutiqueBankDepositFacade {
  constructor(private store: Store<BoutiqueBankDepositState>) {}
  private error$ = this.store.select(BoutiqueBankDepositSelectors.selectError);
  private isLoading$ = this.store.select(
    BoutiqueBankDepositSelectors.selectIsLoading
  );
  private bankDepositDetails$ = this.store.select(
    BoutiqueBankDepositSelectors.selectBankDepositDetails
  );
  private totalElements$ = this.store.select(
    BoutiqueBankDepositSelectors.selectTotalElements
  );
  private hasSaved$ = this.store.select(
    BoutiqueBankDepositSelectors.selectHasSaved
  );
  private depositAmount$ = this.store.select(
    BoutiqueBankDepositSelectors.selectDepositAmount
  );
  private saveResponse$ = this.store.select(
    BoutiqueBankDepositSelectors.selectSaveResponse
  );
  private hasDenomitionSaved$ = this.store.select(
    BoutiqueBankDepositSelectors.selectHasCashDenomoitonSaved
  );
  private pendingDates$ = this.store.select(
    BoutiqueBankDepositSelectors.selectPendingDates
  );
  private pifNoResponse$ = this.store.select(
    BoutiqueBankDepositSelectors.selectPifNoResponse
  );
  getError() {
    return this.error$;
  }
  getIsLoading() {
    return this.isLoading$;
  }
  getBankDepositDetails() {
    return this.bankDepositDetails$;
  }
  getTotalElements() {
    return this.totalElements$;
  }
  getHasSaved() {
    return this.hasSaved$;
  }
  getDepositedAmount() {
    return this.depositAmount$;
  }
  getSaveResponse() {
    return this.saveResponse$;
  }
  getHasDenomitionSaved() {
    return this.hasDenomitionSaved$;
  }
  getPendingDates() {
    return this.pendingDates$;
  }
  getPifNoResponse() {
    return this.pifNoResponse$;
  }
  loadBankDepostDetails(payload: BankDetailsReqPayload) {
    this.store.dispatch(new LoadBankDepositDetails(payload));
  }
  saveBankBoutiqueDepositDetails(payload: any) {
    this.store.dispatch(new SaveBankDepositDetails(payload));
  }
  resetBoutiqueBankDepostDetails() {
    this.store.dispatch(new ResetBoutiqueBankDepositDetails());
  }
  saveCashDenomition(payload: CashDenomition) {
    this.store.dispatch(new SaveCashDenomition(payload));
  }
  loadPendingDates(payload: PendingDatesPayload) {
    this.store.dispatch(new LoadPendingDates(payload));
  }
  loadDepositAmountByPifNo(payload: PifNoPayload) {
    this.store.dispatch(new LoadDepositAmountByPifNo(payload));
  }
}
