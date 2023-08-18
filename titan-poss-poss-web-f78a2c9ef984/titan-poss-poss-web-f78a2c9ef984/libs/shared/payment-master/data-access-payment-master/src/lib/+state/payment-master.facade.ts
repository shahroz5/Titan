
import { Injectable } from '@angular/core';
import * as PaymentMasterActions from './payment-master.actions';
import { PaymentMasterSelectors } from './payment-master.selector';
import { PaymentMasterState } from './payment-master.state';
import {
  PaymentMasterListPayload, UpdatePaymentMasterPayload, SavePaymentMasterPayload
} from '@poss-web/shared/models';

import { Store } from '@ngrx/store';
@Injectable()
export class PaymentMasterFacade {
  constructor(public store: Store<PaymentMasterState>) { }


  private isLoading$ = this.store.select(PaymentMasterSelectors.selectIsloading);
  private error$ = this.store.select(PaymentMasterSelectors.selectError);
  private hasSaved$ = this.store.select(PaymentMasterSelectors.selectHasSaved);
  private hasUpdated$ = this.store.select(PaymentMasterSelectors.selectHasUpdated);

  private totalElements$ = this.store.select(
    PaymentMasterSelectors.selectTotalElements
  );
  private paymentMasterList$ = this.store.select(PaymentMasterSelectors.selectPaymentMasterList);
  private paymentMaster$ = this.store.select(PaymentMasterSelectors.selectPaymentMaster);


  getHasSaved() {
    return this.hasSaved$;
  }
  getHasUpdated() {
    return this.hasUpdated$;
  }
  getTotalElements() {
    return this.totalElements$;
  }
  getError() {
    return this.error$;
  }

  getIsloading() {
    return this.isLoading$;
  }

  getPaymentMasterList() {
    return this.paymentMasterList$;
  }
  getPaymentMaster() {
    return this.paymentMaster$;
  }




  loadPaymentMasterList(paymentMasterListPayload: PaymentMasterListPayload) {
    {
      this.store.dispatch(
        new PaymentMasterActions.LoadPaymentMasterList(paymentMasterListPayload)
      );
    }
  }
  loadSavePaymentMaster(savePaymentMasterPayload: SavePaymentMasterPayload) {
    this.store.dispatch(new PaymentMasterActions.SavePaymentMaster(savePaymentMasterPayload))
  }
  loadUpdatePaymentMaster(updatePaymentMasterPayload: UpdatePaymentMasterPayload) {
    this.store.dispatch(new PaymentMasterActions.UpdatePaymentMaster(updatePaymentMasterPayload))
  }
  loadPaymentMasterByPaymentCode(paymentCode: string) {
    this.store.dispatch(new PaymentMasterActions.LoadPaymentMasterByPaymentCode(paymentCode))

  }
  searchPaymentMaster(paymentCode: string) {
    this.store.dispatch(new PaymentMasterActions.SearchPaymentMaster(paymentCode))
  }
  loadReset() {
    this.store.dispatch(new PaymentMasterActions.LoadReset());
  }
}
