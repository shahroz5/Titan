import {
  SavePaymentMasterPayload,
  PaymentMasterListPayload,
  UpdatePaymentMasterPayload
} from '@poss-web/shared/models';
import { Store } from '@ngrx/store';

import { TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';

import { PaymentMasterState } from './payment-master.state';
import { PaymentMasterFacade } from './payment-master.facade';
import {
  LoadPaymentMasterList,
  SavePaymentMaster,
  UpdatePaymentMaster,
  LoadReset
} from './payment-master.actions';
import { LoadPaymentMasterByPaymentCode } from './payment-master.actions';

describe(' payment master facade Testing Suite', () => {
  const initialState: PaymentMasterState = {
    paymentMasterList: null,
    paymentMaster: null,
    error: null,
    isLoading: null,
    totalElements: null,
    hasSaved: null,
    hasUpdated: null
  };

  let paymentMasterFacade: PaymentMasterFacade;
  let store: MockStore<PaymentMasterFacade>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), PaymentMasterFacade]
    });
    store = TestBed.inject<any>(Store);
    paymentMasterFacade = TestBed.inject<any>(PaymentMasterFacade);
  });

  describe('Dispatch Actions action', () => {
    it('should call LOAD_PAYMENT_MASTER_LISTING action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: PaymentMasterListPayload = {
        pageIndex: 0,
        pageSize: 100,
        length: 0
      };
      const action = new LoadPaymentMasterList(payload);
      paymentMasterFacade.loadPaymentMasterList(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call SAVE_PAYMENT_MASTER action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: SavePaymentMasterPayload = {
        paymentGroup: 'WALLET',
        data: {
          paymentCode: 'gpay',
          description: 'gogglePay',
          isActive: true,

          customerDependent: true,
          fieldDetails: [
            {
              fieldCode: 'transaction_id',
              fieldName: 'transactionid',
              fieldType: null,
              fieldRegex: null
            }
          ]
        }
      };
      const action = new SavePaymentMaster(payload);
      paymentMasterFacade.loadSavePaymentMaster(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call UPDATE_PAYMENT_MASTER action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: UpdatePaymentMasterPayload = {
        paymentCode: 'GPAY',
        paymentGroup: 'WALLET',
        data: {
          isActive: false
        }
      };
      const action = new UpdatePaymentMaster(payload);
      paymentMasterFacade.loadUpdatePaymentMaster(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LOAD_PAYMENT_MASTER_BY_PAYMENT_CODE action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload = 'jGPAY';
      const action = new LoadPaymentMasterByPaymentCode(payload);
      paymentMasterFacade.loadPaymentMasterByPaymentCode(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LOAD_RESET action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new LoadReset();
      paymentMasterFacade.loadReset();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
  });

  describe('Access Selector action', () => {
    it('should access the getPaymentMasterList selector action', () => {
      expect(paymentMasterFacade.getPaymentMasterList()).toEqual(
        paymentMasterFacade['paymentMasterList$']
      );
    });

    it('should access the getPaymentMaster selector action', () => {
      expect(paymentMasterFacade.getPaymentMaster()).toEqual(
        paymentMasterFacade['paymentMaster$']
      );
    });

    it('should access the getHasSaved selector action', () => {
      expect(paymentMasterFacade.getHasSaved()).toEqual(
        paymentMasterFacade['hasSaved$']
      );
    });

    it('should access the getHasUpdated selector action', () => {
      expect(paymentMasterFacade.getHasUpdated()).toEqual(
        paymentMasterFacade['hasUpdated$']
      );
    });

    it('should access the getIsloading selector action', () => {
      expect(paymentMasterFacade.getIsloading()).toEqual(
        paymentMasterFacade['isLoading$']
      );
    });

    it('should access the getError selector action', () => {
      expect(paymentMasterFacade.getError()).toEqual(
        paymentMasterFacade['error$']
      );
    });

    it('should access the getTotalElements selector action', () => {
      expect(paymentMasterFacade.getTotalElements()).toEqual(
        paymentMasterFacade['totalElements$']
      );
    });
  });
});
