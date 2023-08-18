import * as selectors from './cash-payment-configuration.selectors';
import {
  CustomErrors,
  RequestList,
  IssueAdvanceFilterPayload,
  CashPaymentConfiguration
} from '@poss-web/shared/models';
import { initialState } from './cash-payment-configuration.reducer';
import { CashPaymentConfigurationState } from './cash-payment-configuration.state';

describe('Product Category Selector Testing Suite', () => {
  const payload: CashPaymentConfiguration = {
    description: 'Desc',
    isActive: true,
    ruleDetails: null,
    ruleId: 1,
    ruleType: 'T'
  };

  describe('Testing selectCashPaymentConfigurationDetails Related Selectors', () => {
    it('should return selectCashPaymentConfigurationDetails Selector', () => {
      const state: CashPaymentConfigurationState = {
        ...initialState,
        cashPaymentConfigurationDetails: payload
      };
      expect(
        selectors.CashPaymentConfigurationSelectors.selectCashPaymentConfigurationDetails.projector(
          state
        )
      ).toEqual(payload);
    });
  });

  describe('Testing selectEditCashPaymentConfigurationResponses Related Selectors', () => {
    it('should return selectEditCashPaymentConfigurationResponses Selector', () => {
      const state: CashPaymentConfigurationState = {
        ...initialState,
        editCashPaymentConfigurationResponses: payload
      };
      expect(
        selectors.CashPaymentConfigurationSelectors.selectEditCashPaymentConfigurationResponses.projector(
          state
        )
      ).toEqual(payload);
    });
  });

  describe('Testing selectIsLoading Related Selectors', () => {
    it('should return selectIsLoading Selector', () => {
      const state: CashPaymentConfigurationState = {
        ...initialState,
        isLoading: true
      };
      expect(
        selectors.CashPaymentConfigurationSelectors.selectIsLoading.projector(
          state
        )
      ).toEqual(true);
    });
  });

  describe('Testing selectIsLoading Related Selectors', () => {
    it('should return selectIsLoading Selector', () => {
      const state: CashPaymentConfigurationState = {
        ...initialState,
        error: null
      };
      expect(
        selectors.CashPaymentConfigurationSelectors.selectError.projector(state)
      ).toEqual(null);
    });
  });
});
