import {
  CashPaymentConfiguration,
  LoadProductCategoryListingPayload,
  LoadProductCategoryListingSuccessPayload,
  ProductCategoryDetails
} from '@poss-web/shared/models';
import * as actions from './cash-payment-configuration.actions';
import { CashPaymentConfigurationState } from './cash-payment-configuration.state';
import { CashPaymentConfigurationReducer, initialState as istate } from './cash-payment-configuration.reducer';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

describe('Product Category Reducer Testing Suite', () => {
  const initialState: CashPaymentConfigurationState = { ...istate };

  const responsePayload: CashPaymentConfiguration = {
    description: 'Desc',
    isActive: true,
    ruleDetails: null,
    ruleId: 1,
    ruleType: 'T'
  };

  describe('Testing CashPaymentConfigurationReducer Functionality', () => {
    it('CashPaymentConfigurationReducer should be called', () => {

      const action = new actions.LoadCashPaymentConfiguration(3);

      const result: CashPaymentConfigurationState = CashPaymentConfigurationReducer(initialState, action);
      expect(result.isLoading).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('LoadCashPaymentConfigurationSuccess should return list', () => {
      const action = new actions.LoadCashPaymentConfigurationSuccess(responsePayload);
      const result: CashPaymentConfigurationState = CashPaymentConfigurationReducer(initialState, action);

      expect(result.cashPaymentConfigurationDetails.ruleId).toBe(1);
      expect(result.isLoading).toBe(false);
    });
    it('LoadCashPaymentConfigurationFailure should return error', () => {
      const action = new actions.LoadCashPaymentConfigurationFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CashPaymentConfigurationState = CashPaymentConfigurationReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });


  describe('Testing AddNewCashPaymentConfiguration Functionality', () => {
    it('AddNewCashPaymentConfiguration should be called', () => {
      const action = new actions.AddNewCashPaymentConfiguration(responsePayload);

      const result: CashPaymentConfigurationState = CashPaymentConfigurationReducer(initialState, action);
      expect(result.isLoading).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('AddNewCashPaymentConfigurationSuccess should return list', () => {
      const action = new actions.AddNewCashPaymentConfigurationSuccess(responsePayload);
      const result: CashPaymentConfigurationState = CashPaymentConfigurationReducer(initialState, action);

      expect(result.cashPaymentConfigurationDetails).toBeDefined();
      expect(result.isLoading).toBe(false);
    });
    it('LoadProductCategoryByProductCategoryCodeFailure should return error', () => {
      const action = new actions.AddNewCashPaymentConfigurationFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CashPaymentConfigurationState = CashPaymentConfigurationReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });


  describe('Testing EditCashPaymentConfiguration Functionality', () => {
    it('EditCashPaymentConfiguration should be called', () => {
      const action = new actions.EditCashPaymentConfiguration({ ruleId: 1, cashPaymentConfigurationForm: responsePayload });
      const result: CashPaymentConfigurationState = CashPaymentConfigurationReducer(initialState, action);
      expect(result.isLoading).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('EditCashPaymentConfigurationSuccess should return list', () => {
      const action = new actions.EditCashPaymentConfigurationSuccess(responsePayload);
      const result: CashPaymentConfigurationState = CashPaymentConfigurationReducer(initialState, action);
      expect(result.cashPaymentConfigurationDetails).toBeDefined();
      expect(result.isLoading).toBe(false);
    });
    it('LoadProductCategoryByProductCategoryCodeFailure should return error', () => {
      const action = new actions.EditCashPaymentConfigurationFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: CashPaymentConfigurationState = CashPaymentConfigurationReducer(initialState, action);
      expect(result.error.message).toEqual('some error');
    });
  });


});
