import { CashPaymentConfigurationFacade } from './cash-payment-configuration.facade';
import { CashPaymentConfigurationState } from './cash-payment-configuration.state';
import { provideMockStore } from '@ngrx/store/testing';
import {
  AddNewCashPaymentConfiguration,
  EditCashPaymentConfiguration,
  LoadCashPaymentConfiguration
} from './cash-payment-configuration.actions';
import { TestBed, inject } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import {
  CashPaymentConfiguration,
  SaveProductCategoryFormDetailsPayload
} from '@poss-web/shared/models';

describe('CashPaymentConfigurationFacade', () => {
  let cashPaymentConfigurationFacade: CashPaymentConfigurationFacade;
  const initialState: CashPaymentConfigurationState = {
    cashPaymentConfigurationDetails: null,
    editCashPaymentConfigurationResponses: null,
    error: null,
    isLoading: false
  };

  const payload: SaveProductCategoryFormDetailsPayload = {
    orgCode: 'orgCode',
    productCategoryCode: 'A',
    description: 'desc',
    isActive: true,
    hallmarkDetails: {
      data: {
        isAllowedForHallmarking: true,
        hallmarkingCharges: '1',
        isFOCForHallmarkingCharges: true
      },
      type: 'HALLMARK'
    },
    hallmarkQuantity: 3,
    isConversionEnabled: true
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({ initialState }),
        CashPaymentConfigurationFacade
      ]
    });

    cashPaymentConfigurationFacade = TestBed.inject(
      CashPaymentConfigurationFacade
    );
  });

  it('should create facade', () => {
    expect(cashPaymentConfigurationFacade).toBeDefined();
  });

  describe('#getCashPaymentConfigurationDetails', () => {
    it('should get getCashPaymentConfigurationDetails', () => {
      expect(
        cashPaymentConfigurationFacade.getCashPaymentConfigurationDetails()
      ).toBeTruthy();
    });
  });

  describe('#editCashPaymentConfigurationResponse', () => {
    it('should get editCashPaymentConfigurationResponse', () => {
      expect(
        cashPaymentConfigurationFacade.editCashPaymentConfigurationResponse()
      ).toBeTruthy();
    });
  });

  describe('#getIsLoading', () => {
    it('should get getIsLoading', () => {
      expect(cashPaymentConfigurationFacade.getIsLoading()).toBeTruthy();
    });
  });

  describe('#getError', () => {
    it('should getError', () => {
      expect(cashPaymentConfigurationFacade.getError()).toBeTruthy();
    });
  });

  describe('#loadCashPaymentConfigurationDetails', () => {
    it('should loadCashPaymentConfigurationDetails', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const expectedAction = new LoadCashPaymentConfiguration(3);
      cashPaymentConfigurationFacade.loadCashPaymentConfigurationDetails(3);

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('#AddNewCashPaymentConfiguration', () => {
    it('should AddNewCashPaymentConfiguration', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const payload2: CashPaymentConfiguration = {
        description: 'Desc',
        isActive: true,
        ruleDetails: null,
        ruleId: 1,
        ruleType: 'T'
      };

      const expectedAction = new AddNewCashPaymentConfiguration(payload2);
      cashPaymentConfigurationFacade.addNewCashPaymentConfigurationDetails(
        payload2
      );

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('#editproductCategoryFormDetails', () => {
    it('should editproductCategoryFormDetails', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const payload2: {
        ruleId: number;
        cashPaymentConfigurationForm: CashPaymentConfiguration;
      } = {
        ruleId: 1,
        cashPaymentConfigurationForm: {
          description: 'Desc',
          isActive: true,
          ruleDetails: null,
          ruleId: 1,
          ruleType: 'T'
        }
      };

      const expectedAction = new EditCashPaymentConfiguration(payload2);
      cashPaymentConfigurationFacade.editCashPaymentConfigurationDetails(
        payload2.ruleId,
        payload2.cashPaymentConfigurationForm
      );

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });
});
