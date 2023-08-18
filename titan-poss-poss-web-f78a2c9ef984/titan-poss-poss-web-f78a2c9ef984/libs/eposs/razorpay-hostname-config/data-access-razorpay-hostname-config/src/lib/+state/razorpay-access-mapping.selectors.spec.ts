import * as selectors from './razorpay-access-mapping.selectors';

import { initialState } from './razorpay-access-mapping.reducers';
import { RazorpayConfigurationState } from './razorpay-access-mapping.state';

describe('Razorpay vendor Selector Testing Suite', () => {
  describe('Testing updateResponse Related Selectors', () => {
    it('should return updateResponse Selector', () => {
      const state: RazorpayConfigurationState = {
        ...initialState,
        updatedAccessList: 'A'
      };
      expect(
        selectors.razorpayConfigurationSelectors.updateResponse.projector(state)
      ).toEqual('A');
    });
  });

  describe('Testing selectTotalElements Related Selectors', () => {
    it('should return selectTotalElements Selector', () => {
      const state: RazorpayConfigurationState = {
        ...initialState,
        totalCount: 0
      };
      expect(
        selectors.razorpayConfigurationSelectors.selectTotalElements.projector(
          state
        )
      ).toEqual(0);
    });
  });

  describe('Testing selectHasError Related Selectors', () => {
    it('should return selectHasError Selector', () => {
      const state: RazorpayConfigurationState = {
        ...initialState,
        hasError: null
      };
      expect(
        selectors.razorpayConfigurationSelectors.selectHasError.projector(state)
      ).toEqual(null);
    });
  });

  describe('Testing selectIsLoading Related Selectors', () => {
    it('should return selectIsLoading Selector', () => {
      const state: RazorpayConfigurationState = {
        ...initialState,
        isLoading: true
      };
      expect(
        selectors.razorpayConfigurationSelectors.selectIsLoading.projector(
          state
        )
      ).toEqual(true);
    });
  });

  describe('Testing selectIsErrorLog Related Selectors', () => {
    it('should return selectIsErrorLog Selector', () => {
      const state: RazorpayConfigurationState = {
        ...initialState,
        errorLog: true
      };
      expect(
        selectors.razorpayConfigurationSelectors.selectIsErrorLog.projector(
          state
        )
      ).toEqual(true);
    });
  });
});
