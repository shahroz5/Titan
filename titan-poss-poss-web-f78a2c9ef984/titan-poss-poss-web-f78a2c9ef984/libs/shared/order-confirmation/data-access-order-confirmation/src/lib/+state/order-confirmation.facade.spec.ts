import { ConfirmCashMemo, ResetValues } from './order-confirmation.actions';
import { OrderConfirmationState } from './order-confirmation.state';
import { Store } from '@ngrx/store';
import { TestBed, inject } from '@angular/core/testing';
import { OrderConfirmationFacade } from './order-confirmation.facade';

import { provideMockStore, MockStore } from '@ngrx/store/testing';
import {
  StatusTypesEnum,
  SubTransactionTypeEnum,
  TransactionTypeEnum,
  UpdateOrderDetails
} from '@poss-web/shared/models';

const updateOrderDetails: UpdateOrderDetails = {
  cashMemoId: '12',
  orderDetails: {
    customerId: 1,
    finalValue: 1,
    paidValue: 1,
    remarks: '1',
    metalRateList: 1,
    minValue: 1,
    occasion: 'test',
    hallmarkCharges: 0,
    hallmarkDiscount: 0,
    totalDiscount: 1,
    totalQuantity: 1,
    totalTax: 1,
    totalValue: 1,
    totalWeight: 1,
    weightAgreed: 1
  },
  status: StatusTypesEnum.APPROVAL_PENDING,
  subTransactionType: SubTransactionTypeEnum.CANCEL_GEP,
  transactionType: TransactionTypeEnum.AB,
  actionType: 'test'
};

describe('facade Testing Suite action', () => {
  let orderConfirmationFacade: OrderConfirmationFacade;

  const initialState: OrderConfirmationState = {
    hasError: null,
    isLoading: false,
    updateCashMemoResponse: null
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), OrderConfirmationFacade]
    });

    orderConfirmationFacade = TestBed.inject(OrderConfirmationFacade);
  });

  describe('Dispatch orderConfimation action', () => {
    it('should call resetValues action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const action = new ResetValues();
      orderConfirmationFacade.resetValues();

      expect(storeSpy).toHaveBeenCalledWith(action);
    }));

    it('should call Confirm action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const action = new ConfirmCashMemo(updateOrderDetails);
      orderConfirmationFacade.confirmCashMemo(updateOrderDetails);

      expect(storeSpy).toHaveBeenCalledWith(action);
    }));
  });

  describe('Confirm Order action', () => {
    it('should get confirmCashMemoResponse data', () => {
      expect(orderConfirmationFacade.confirmCashMemoResponse()).toBeTruthy();
    });

    it('should get getHasError data', () => {
      expect(orderConfirmationFacade.getHasError()).toBeTruthy();
    });
    it('should get getIsLoading data', () => {
      expect(orderConfirmationFacade.getIsLoading()).toBeTruthy();
    });
  });
});
