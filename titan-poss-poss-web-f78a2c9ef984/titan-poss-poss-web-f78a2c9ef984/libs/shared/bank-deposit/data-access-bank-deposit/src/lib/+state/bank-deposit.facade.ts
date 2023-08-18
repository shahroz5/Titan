import * as BankDepositActions from './bank-deposit.actions';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { BankDepositState } from './bank-deposit.state';
import { BankDepositSelectors } from './bank-deposit.selectors';
import { PaginatePayload, BankDepositRequest, DepositDatePayload } from '@poss-web/shared/models';

@Injectable()
export class BankDepositFacade {
  private isLoading$ = this.store.select(BankDepositSelectors.selectIsLoading);

  private bankDepositList$ = this.store.select(
    BankDepositSelectors.selectBankDepositList
  );

  private error$ = this.store.select(BankDepositSelectors.selectError);

  private transacionDetails$ = this.store.select(BankDepositSelectors.selectTransactionDetails);

  constructor(private store: Store<BankDepositState>) {}

  getError() {
    return this.error$;
  }

  getBankDepositList() {
    return this.bankDepositList$;
  }

  getIsLoading() {
    return this.isLoading$;
  }

  gettransacionDetails() {
    return this.transacionDetails$;
  }

  loadBankDeposit = (paginateData: PaginatePayload, data: BankDepositRequest) =>
    this.store.dispatch(
      new BankDepositActions.LoadBankDepositList(paginateData, data)
    );

  resetError() {
    this.store.dispatch(new BankDepositActions.ResetError());
  }

  resetValues() {
    this.store.dispatch(new BankDepositActions.ResetValues());
  }

  loadTransacionDetails(payload: DepositDatePayload) {
    this.store.dispatch(new BankDepositActions.GetTransactionDetails(payload));
  }
}
