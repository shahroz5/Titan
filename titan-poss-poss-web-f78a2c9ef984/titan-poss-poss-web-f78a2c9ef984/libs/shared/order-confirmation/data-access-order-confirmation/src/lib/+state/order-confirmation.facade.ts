import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import * as OrderConfirmationActions from './order-confirmation.actions';
import { orderConfirmationSelectors } from './order-confirmation.selectors';
import { OrderConfirmationState } from './order-confirmation.state';
import { UpdateOrderDetails } from '@poss-web/shared/models';

@Injectable()
export class OrderConfirmationFacade {
  constructor(private store: Store<OrderConfirmationState>) {}

  private hasError$ = this.store.select(
    orderConfirmationSelectors.selectHasError
  );

  private isLoading$ = this.store.select(
    orderConfirmationSelectors.selectIsLoading
  );

  private confirmCashMemoResponse$ = this.store.select(
    orderConfirmationSelectors.updateCashMemoResponse
  );

  getHasError() {
    return this.hasError$;
  }

  getIsLoading() {
    return this.isLoading$;
  }
  confirmCashMemoResponse() {
    return this.confirmCashMemoResponse$;
  }
  confirmCashMemo(payload: UpdateOrderDetails) {
    this.store.dispatch(new OrderConfirmationActions.ConfirmCashMemo(payload));
  }

  resetValues() {
    this.store.dispatch(new OrderConfirmationActions.ResetValues());
  }
}
