import {
  PaymentConfigurationListPayLoad,
  SavePaymentConfigurationPayload,
  UpdatePaymentConfigurationPayload,
  LoadSelectedConfigById,
  UpdatePaymentConfigurationDetailsPayload
} from '@poss-web/shared/models';
import { Store } from '@ngrx/store';

import { TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';

import { PaymentConfigurationFacade } from './payment-configuration.facade';

import {
  LoadReset,
  LoadPaymentConfigurationList,
  SearchPaymentConfigurationList,
  CheckUniquePaymentName,
  LoadPaymentModesandTransactionTypes,
  SavePaymentConfiguration,
  UpdatePaymentConfiguration,
  LoadPaymentConfigurationByConfigId,
  LoadMappedCount,
  UpdateCount,
  LoadSelectedPaymentConfigurationDetailsByConfigId,
  UpdateSelectedPaymentConfigurationDetailsByConfigId,
  LoadPaymentModeCount,
  LoadTCSPaymentMode
} from './payment-configuration.actions';
import { PaymentConfigurationState } from './payment-configuration.state';
import { paymentModeAdaptor } from './payment-configuration.entity';

describe(' paymentConfigurationFacade Testing Suite', () => {
  const initialState: PaymentConfigurationState = {
    paymentConfigurationlist: [],
    paymentConfiguration: null,
    isLoading: null,
    hasSaved: null,
    hasUpdated: null,
    totalElements: null,
    error: null,
    transctionTypes: [],
    paymentModes: paymentModeAdaptor.getInitialState(),
    selectedOptions: null,
    paymentModeCount: null,
    configId: null,
    tcsPaymentModes: []
  };

  let paymentConfigurationFacade: PaymentConfigurationFacade;
  let store: MockStore<PaymentConfigurationFacade>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({ initialState }),
        PaymentConfigurationFacade
      ]
    });
    store = TestBed.inject<any>(Store);
    paymentConfigurationFacade = TestBed.inject<any>(
      PaymentConfigurationFacade
    );
  });

  describe('Dispatch Actions action', () => {
    it('should call LOAD_PAYMENT_CONFIGURATION_LIST action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: PaymentConfigurationListPayLoad = {
        pageSize: 10,
        pageIndex: 1
      };

      const action = new LoadPaymentConfigurationList(payload);
      paymentConfigurationFacade.loadPaymentConfigurationList(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call SEARCH_PAYMENT_CONFIGURATION_LIST action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload = 'cash';
      const action = new SearchPaymentConfigurationList(payload);
      paymentConfigurationFacade.searchPaymentConfigurationList(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call CHECK_UNIQUE_PAYMENT_NAME action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload = 'cash';

      const action = new CheckUniquePaymentName(payload);
      paymentConfigurationFacade.checkUniquePaymentName(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LOAD_PAYMENT_MODES_AND_TRANSACTION_TYPES action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload = '1';
      const action = new LoadPaymentModesandTransactionTypes(payload);
      paymentConfigurationFacade.loadPaymentModeAndTransacionType(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call SAVE_PAYMENT_CONFIGURATION action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: SavePaymentConfigurationPayload = {
        paymentConfiguration: {
          description: 'cash'
        },
        saveData: ''
      };

      const action = new SavePaymentConfiguration(payload);
      paymentConfigurationFacade.savePaymentConfiguration(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call UPADTE_PAYMENT_CONFIGURATION action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: UpdatePaymentConfigurationPayload = {
        configId: '1',
        data: {
          isActive: false
        }
      };
      const action = new UpdatePaymentConfiguration(payload);
      paymentConfigurationFacade.updatePaymentConfiguration(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LOAD_PAYMENT_CONFIGURATION_BY_CONFIG_ID action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload = '1';

      const action = new LoadPaymentConfigurationByConfigId(payload);
      paymentConfigurationFacade.loadPaymentConfigurationByConfigId(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LOAD_MAPPED_COUNT action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload = '1';
      const action = new LoadMappedCount(payload);
      paymentConfigurationFacade.loadMappedCount(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call UPDATE_COUNT action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: { count: number; id: string } = {
        count: 10,
        id: '1'
      };
      const action = new UpdateCount(payload);
      paymentConfigurationFacade.updateCount(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call LOAD_SELECTED_PAYMENT_CONFIGURATION_DETAILS_BY_CONFIG_ID action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: LoadSelectedConfigById = {
        configId: '1',
        paymentName: 'cash'
      };
      const action = new LoadSelectedPaymentConfigurationDetailsByConfigId(
        payload
      );
      paymentConfigurationFacade.loadSelectedPaymentConfigurationByConfigId(
        payload
      );
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call UPDATE_SELECTED_PAYMENT_CONFIGURATION_DETAILS_BY_CONFIG_ID action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: UpdatePaymentConfigurationDetailsPayload = {
        configId: '1',
        data: {
          isActive: true
        }
      };
      const action = new UpdateSelectedPaymentConfigurationDetailsByConfigId(
        payload
      );
      paymentConfigurationFacade.updateSelectedPaymentConfigurationByConfigId(
        payload
      );
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call LOAD_PAYMENT_MODE_COUNT action', () => {
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new LoadPaymentModeCount();
      paymentConfigurationFacade.loadPaymentModeCount();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LOAD_TCS_PAYMENT_MODE action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload = 'AIRPAY';
      const action = new LoadTCSPaymentMode(payload);
      paymentConfigurationFacade.loadTcsPaymentModes(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LOAD_RESET action', () => {
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new LoadReset();
      paymentConfigurationFacade.loadReset();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    describe('Access Selector action', () => {
      it('should access the getHasUpdated selector action', () => {
        expect(paymentConfigurationFacade.getHasUpdated()).toEqual(
          paymentConfigurationFacade['hasUpdated$']
        );
      });

      it('should access the getPaymentModeCount selector action', () => {
        expect(paymentConfigurationFacade.getPaymentModeCount()).toEqual(
          paymentConfigurationFacade['paymentModeCount$']
        );
      });

      it('should access the getTotalElements selector action', () => {
        expect(paymentConfigurationFacade.getTotalElements()).toEqual(
          paymentConfigurationFacade['totalElements$']
        );
      });

      it('should access the getHasSaved selector action', () => {
        expect(paymentConfigurationFacade.getHasSaved()).toEqual(
          paymentConfigurationFacade['hasSaved$']
        );
      });

      it('should access the getPaymentConfigurationList selector action', () => {
        expect(
          paymentConfigurationFacade.getPaymentConfigurationList()
        ).toEqual(paymentConfigurationFacade['paymentConfigurationList$']);
      });

      it('should access the getPaymentConfiguration selector action', () => {
        expect(paymentConfigurationFacade.getPaymentConfiguration()).toEqual(
          paymentConfigurationFacade['paymentConfiguration$']
        );
      });

      it('should access the getSelectedOptions selector action', () => {
        expect(paymentConfigurationFacade.getSelectedOptions()).toEqual(
          paymentConfigurationFacade['selectedOptions$']
        );
      });

      it('should access the getTransactionTypes selector action', () => {
        expect(paymentConfigurationFacade.getTransactionTypes()).toEqual(
          paymentConfigurationFacade['transactionTypes$']
        );
      });

      it('should access the getPaymentModes selector action', () => {
        expect(paymentConfigurationFacade.getPaymentModes()).toEqual(
          paymentConfigurationFacade['paymentModes$']
        );
      });
      it('should access the getConfigId selector action', () => {
        expect(paymentConfigurationFacade.getConfigId()).toEqual(
          paymentConfigurationFacade['configId$']
        );
      });

      it('should access the getError selector action', () => {
        expect(paymentConfigurationFacade.getError()).toEqual(
          paymentConfigurationFacade['error$']
        );
      });

      it('should access the getTcsPaymentModes selector action', () => {
        expect(paymentConfigurationFacade.getTcsPaymentModes()).toEqual(
          paymentConfigurationFacade['tcsPaymentModes$']
        );
      });

      it('should access the isLoading selector action', () => {
        expect(paymentConfigurationFacade.getIsloading()).toEqual(
          paymentConfigurationFacade['isLoading$']
        );
      });
    });
  });
});
