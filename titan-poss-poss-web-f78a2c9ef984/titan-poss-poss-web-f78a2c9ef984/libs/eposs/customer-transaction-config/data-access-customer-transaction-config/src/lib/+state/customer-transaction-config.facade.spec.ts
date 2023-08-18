import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { CustomerTransactionConfigFacade } from './customer-transaction-config.facade';
import { initialState } from './customer-transaction-config.reducer';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import {
  CustomerTransactionConfigListPayload,
  SaveCustomerTranConfigDetails,
  UpdateStatus
} from '@poss-web/shared/models';
import {
  GetCustomerTransactionConfigDetails,
  LoadCustomers,
  LoadCustomerTransactionConfigList,
  LoadTransactionTypes,
  ResetCustomerConfigs,
  SaveCustomerTransactionConfigDetails,
  SearchConfigName,
  UpdateConfigStatus,
  UpdateCustomerTransactionConfigDetails
} from './customer-transaction-config.actions';
describe('Customer Transaction Facade Testing Suite', () => {
  let customerTransactionConfigFacade: CustomerTransactionConfigFacade;
  let store: Store;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({ initialState }),
        CustomerTransactionConfigFacade
      ]
    });
    customerTransactionConfigFacade = TestBed.inject(
      CustomerTransactionConfigFacade
    );
    store = TestBed.inject(Store);
  });
  describe('Dispatch Actions TestCases', () => {
    it('should call LOAD_CUSTOMER_TRANSACTION_CONFIG_LIST', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const listPayload: CustomerTransactionConfigListPayload = {
        pageIndex: 0,
        pageSize: 100,
        length: 0
      };
      const action = new LoadCustomerTransactionConfigList(listPayload);
      customerTransactionConfigFacade.loadConfigList(listPayload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call SEARCH_CONFIG_NAME', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new SearchConfigName('Configuration');
      customerTransactionConfigFacade.searchConfigName('Configuration');
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call UPDATE_CONFIG_STATUS', () => {
      const updateStatus: UpdateStatus = {
        configId: 'abc',
        isActive: true,
        configType: 'CUSTOMER_CONFIG'
      };
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new UpdateConfigStatus(updateStatus);
      customerTransactionConfigFacade.updateConfigStatus(updateStatus);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call LOAD_TRANSACTIONTYPES', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new LoadTransactionTypes('TRANSACTION_TYPE');
      customerTransactionConfigFacade.loadTransactionTypes('TRANSACTION_TYPE');
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call LOAD_CUSTOMERS', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new LoadCustomers();
      customerTransactionConfigFacade.loadCustomers();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call SAVE_CUSTOMER_TRANSACTION_CONFIG_DETAILS', () => {
      const savePayload: SaveCustomerTranConfigDetails = {
        createConfig: {
          description: 'Configuration',
          isActive: true,
          configType: 'CUSTOMER_CONFIG'
        },
        configDetails: {
          addConfigs: [
            {
              customerType: 'AB',
              transactionType: 'TC'
            }
          ],
          removeConfigs: []
        }
      };
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new SaveCustomerTransactionConfigDetails(savePayload);
      customerTransactionConfigFacade.saveCustomerTranConfigDetails(
        savePayload
      );
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call UPDATE_CUSTOMER_TRANSACTION_CONFIG_DETAILS', () => {
      const savePayload: SaveCustomerTranConfigDetails = {
        configId: 'abc',
        createConfig: {
          description: 'Configuration',
          isActive: true,
          configType: 'CUSTOMER_CONFIG'
        },
        configDetails: {
          addConfigs: [
            {
              customerType: 'AB',
              transactionType: 'TC'
            }
          ],
          removeConfigs: []
        }
      };
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new UpdateCustomerTransactionConfigDetails(savePayload);
      customerTransactionConfigFacade.updateCustomerTranConfigDetails(
        savePayload
      );
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call GET_CUSTOMER_TRANSACTION_CONFIG_DETAILS', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new GetCustomerTransactionConfigDetails('abc123');
      customerTransactionConfigFacade.loadConfigDetailsById('abc123');
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call RESET_CUSTOMER_CONFIGS', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new ResetCustomerConfigs();
      customerTransactionConfigFacade.resetCustomerConfigs();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
  });
  describe('Selectors TestCases', () => {
    it('should access the customer-config-list', () => {
      expect(customerTransactionConfigFacade.getConfigList()).toEqual(
        customerTransactionConfigFacade['configList$']
      );
    });
    it('should access the totalelements', () => {
      expect(customerTransactionConfigFacade.getTotalElements()).toEqual(
        customerTransactionConfigFacade['totalElements$']
      );
    });
    it('should access the isloading', () => {
      expect(customerTransactionConfigFacade.getIsLoading()).toEqual(
        customerTransactionConfigFacade['isLoading$']
      );
    });
    it('should access the error', () => {
      expect(customerTransactionConfigFacade.getError()).toEqual(
        customerTransactionConfigFacade['error$']
      );
    });
    it('should access the hasstatusupdated', () => {
      expect(customerTransactionConfigFacade.getHasStatusUpdated()).toEqual(
        customerTransactionConfigFacade['hasStatusUpdated$']
      );
    });
    it('should access the hassearched', () => {
      expect(customerTransactionConfigFacade.getHasSearched()).toEqual(
        customerTransactionConfigFacade['hasSearched$']
      );
    });
    it('should access the transaction types', () => {
      expect(customerTransactionConfigFacade.getTransactionTypes()).toEqual(
        customerTransactionConfigFacade['transactionTypes$']
      );
    });
    it('should access the customer types', () => {
      expect(customerTransactionConfigFacade.getCustomers()).toEqual(
        customerTransactionConfigFacade['customers$']
      );
    });
    it('should access the config id', () => {
      expect(customerTransactionConfigFacade.getConfigId()).toEqual(
        customerTransactionConfigFacade['configId$']
      );
    });
    it('should access the hassaved', () => {
      expect(customerTransactionConfigFacade.getHasSaved()).toEqual(
        customerTransactionConfigFacade['hasSaved$']
      );
    });
    it('should access the hasupdated', () => {
      expect(customerTransactionConfigFacade.getHasUpdated()).toEqual(
        customerTransactionConfigFacade['hasUpdated$']
      );
    });
    it('should access the configDetails', () => {
      expect(customerTransactionConfigFacade.getConfigDetails()).toEqual(
        customerTransactionConfigFacade['configDetails$']
      );
    });
  });
});
