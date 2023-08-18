import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { PayerBankConfigFacade } from './payer-bank-config.facade';
import { PayerBankConfigState } from './payer-bank-config.state';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import {
  PayerBankConfigListingPayload,
  SavePayerBankConfigDetailsPayload,
  ToggleButtonPayload,
  UpdatePayerBankConfigPayload
} from '@poss-web/shared/models';
import {
  LoadPayerBankConfigurations,
  LoadPayerBanks,
  LoadPaymentModes,
  PayerBankDetailsByConfigName,
  ResetPayerBankConfigDetails,
  SavePayerBankConfigDetails,
  SearchConfigName,
  SearchPayerBank,
  UpdatePayerBankConfigDetails,
  UpdateToggleButton
} from './payer-bank-config.actions';
describe('PayerBankConfigFacade Testing', () => {
  const initialState: PayerBankConfigState = {
    payerBankConfigListing: null,
    error: null,
    isLoading: false,
    totalElements: 0,
    hasSaved: false,
    hasUpdated: false,
    payerBanks: [],
    configId: null,
    payerBanksConfigDetails: null,
    paymentModes: null,
    hasSearched: false,
    banksCount: 0
  };
  let payerBankConfigFacade: PayerBankConfigFacade;
  let store: Store;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), PayerBankConfigFacade]
    });
    payerBankConfigFacade = TestBed.inject(PayerBankConfigFacade);
    store = TestBed.inject(Store);
  });
  describe('Dispatch Actions TestCases', () => {
    it('should call LOAD_PAYER_BANK_CONFIGURATIONS', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: PayerBankConfigListingPayload = {
        pageIndex: 0,
        pageSize: 100
      };
      const action = new LoadPayerBankConfigurations(payload);
      payerBankConfigFacade.loadPayerBankConfigurations(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call SAVE_PAYER_BANK_CONFIG_DETAILS', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const savePayload: SavePayerBankConfigDetailsPayload = {
        configPayload: {
          description: 'Configuration',
          paymentCode: 'cc',
          paymentDetails: {},
          isActive: true
        },
        banksPayload: {
          addBankName: ['AXIS'],
          removeBankName: []
        }
      };
      const action = new SavePayerBankConfigDetails(savePayload);
      payerBankConfigFacade.savePayerBankConfigDetails(savePayload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call PAYER_BANK_CONFIG_DETAILS_BY_CONFIGNAME', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new PayerBankDetailsByConfigName('Configuration');
      payerBankConfigFacade.payerBankDetailsByConfigName('Configuration');
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call UPDATE_PAYER_BANK_CONFIG_DETAILS', () => {
      const updatePayload: UpdatePayerBankConfigPayload = {
        id: 'abc123',
        configPayload: {
          description: 'Configuration',
          paymentCode: 'cc',
          paymentDetails: {},
          isActive: true
        },
        banksPayload: {
          addBankName: ['AXIS'],
          removeBankName: []
        }
      };
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new UpdatePayerBankConfigDetails(updatePayload);
      payerBankConfigFacade.updatePayerBankConfigDetails(updatePayload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call SEARCH_CONFIG_NAME', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new SearchConfigName('Configuration');
      payerBankConfigFacade.searchConfigName('Configuration');
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call LOAD_PAYER_BANKS', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: PayerBankConfigListingPayload = {
        pageIndex: 0,
        pageSize: 10
      };
      const action = new LoadPayerBanks(payload);
      payerBankConfigFacade.loadPayerBanks(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call UPDATE_TOGGLE_BUTTON', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: ToggleButtonPayload = {
        isActive: true,
        id: 'abc123'
      };
      const action = new UpdateToggleButton(payload);
      payerBankConfigFacade.updateToggleButton(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call RESET_PAYER_BANK_CONFIG_DETAILS', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new ResetPayerBankConfigDetails();
      payerBankConfigFacade.resetPayerBankConfigDetails();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call LOAD_PAYMENT_MODES', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new LoadPaymentModes();
      payerBankConfigFacade.loadPaymentModes();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call SEARCH_PAYER_BANK', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new SearchPayerBank('Axis');
      payerBankConfigFacade.searchPayerBankName('Axis');
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
  });
  describe('Access Selectors TestCases', () => {
    it('should access the get totalelements', () => {
      expect(payerBankConfigFacade.getTotalElements()).toEqual(
        payerBankConfigFacade['totalElements$']
      );
    });
    it('should access the get isloading', () => {
      expect(payerBankConfigFacade.getIsLoading()).toEqual(
        payerBankConfigFacade['isLoading$']
      );
    });
    it('should access the get error', () => {
      expect(payerBankConfigFacade.getError()).toEqual(
        payerBankConfigFacade['error$']
      );
    });
    it('should access the get payerbankconfiguration', () => {
      expect(payerBankConfigFacade.getPayerBankConfigurations()).toEqual(
        payerBankConfigFacade['payerBankConfigurations$']
      );
    });
    it('should access the get hasupdated', () => {
      expect(payerBankConfigFacade.getHasUpdated()).toEqual(
        payerBankConfigFacade['selectHasUpdated$']
      );
    });
    it('should access the get hassaved', () => {
      expect(payerBankConfigFacade.getHasSaved()).toEqual(
        payerBankConfigFacade['selectHasSaved$']
      );
    });
    it('should access the get configId', () => {
      expect(payerBankConfigFacade.getConfigId()).toEqual(
        payerBankConfigFacade['selectConfigId$']
      );
    });
    it('should access the get payerbanks', () => {
      expect(payerBankConfigFacade.getPayerBanks()).toEqual(
        payerBankConfigFacade['selectPayerBanks$']
      );
    });

    it('should access the get payerbank details', () => {
      expect(payerBankConfigFacade.getPayerBankDetails()).toEqual(
        payerBankConfigFacade['selectPayerBanksDetails$']
      );
    });
    it('should access the get paymentmodes', () => {
      expect(payerBankConfigFacade.getPaymentModes()).toEqual(
        payerBankConfigFacade['selectPaymentModes$']
      );
    });
    it('should access the get hassearched', () => {
      expect(payerBankConfigFacade.getHasSearched()).toEqual(
        payerBankConfigFacade['selectHasSearched$']
      );
    });
    it('should access the get bankscount', () => {
      expect(payerBankConfigFacade.getBanksCount()).toEqual(
        payerBankConfigFacade['selectBanksCount$']
      );
    });
  });
});
