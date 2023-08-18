import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import * as BankPriorityActions from './bankPriority.action';
import { BankPriorityState } from './bankPriority.state';
import { BankPrioritySelectors } from './bankPriority.selectors';
import {

  SaveBankPriorityFormDetailsPayload
} from '@poss-web/shared/models';

@Injectable()
export class BankPriorityFacade {
  constructor(private store: Store<BankPriorityState>) { }

  private bankPriorityListing$ = this.store.select(
    BankPrioritySelectors.selectBankPriorityDetailsListing
  );

  private isLoading$ = this.store.select(BankPrioritySelectors.selectIsLoading);


  private hasError$ = this.store.select(BankPrioritySelectors.selectError);


  private hasUpdated$ = this.store.select(BankPrioritySelectors.selectHasUpdated);

  getisLoading() {
    return this.isLoading$;
  }

  getBankPriorityDetailsListing() {
    return this.bankPriorityListing$;
  }


  getError() {
    return this.hasError$;
  }

  getHasUpdated() {
    return this.hasUpdated$;

  }

  loadBankPriorityDetailsListing() {
    this.store.dispatch(
      new BankPriorityActions.LoadBankPriority()
    );
  }

  resetBankPriorityDialogData() {
    this.store.dispatch(new BankPriorityActions.ResetBankPriorityDialog());
  }


  saveBankPriorityFormDetails(
    saveFormDetails: SaveBankPriorityFormDetailsPayload
  ) {
    this.store.dispatch(
      new BankPriorityActions.SaveBankPriority(saveFormDetails)
    );
  }
}
