import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { PayerBankState } from './payer-bank.state';
import { PayerBankSelectors } from './payer-bank.selector';
import { PayerBanksPayload } from '@poss-web/shared/models';
import * as PayerBankActions from './payer-bank.actions';
@Injectable()
export class PayerBankFacade {
  constructor(private store: Store<PayerBankState>) {}
  private selectTotalElements$ = this.store.select(
    PayerBankSelectors.selectTotalElements
  );
  private selectBankDetails$ = this.store.select(
    PayerBankSelectors.selectBankDetails
  );
  private selectErorr$ = this.store.select(PayerBankSelectors.selectError);
  private selectIsLoading$ = this.store.select(
    PayerBankSelectors.selectIsLoading
  );
  private selectFileResponse$ = this.store.select(
    PayerBankSelectors.selectFileResponse
  );
  private selectErrorLog$ = this.store.select(
    PayerBankSelectors.selectErrorLog
  );
  getError() {
    return this.selectErorr$;
  }
  getBankDetails() {
    return this.selectBankDetails$;
  }
  getIsLoading() {
    return this.selectIsLoading$;
  }
  getTotalElements() {
    return this.selectTotalElements$;
  }
  getFileResponse() {
    return this.selectFileResponse$;
  }
  getErrorLog() {
    return this.selectErrorLog$;
  }
  uploadFile(file: FormData) {
    this.store.dispatch(new PayerBankActions.FileUpload(file));
  }
  loadPayerBanks(payload: PayerBanksPayload) {
    this.store.dispatch(new PayerBankActions.LoadPayerBanks(payload));
  }
  resetFileData() {
    this.store.dispatch(new PayerBankActions.ResetFileData());
  }
  searchPayerBank(payerBankName: string) {
    this.store.dispatch(new PayerBankActions.SearchPayerBank(payerBankName));
  }
  loadErrorLog(errorId: string) {
    this.store.dispatch(new PayerBankActions.ErrorLogDownload(errorId));
  }
}
