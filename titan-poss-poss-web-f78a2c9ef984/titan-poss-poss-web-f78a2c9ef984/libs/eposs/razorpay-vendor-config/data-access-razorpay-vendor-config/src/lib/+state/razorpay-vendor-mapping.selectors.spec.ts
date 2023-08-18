import * as selectors from './razorpay-vendor-mapping.selectors';

import { initialState } from './razorpay-vendor-mapping.reducers';
import { RazorpayVendorConfigurationState } from './razorpay-vendor-mapping.state';
import {
  CustomErrors,
  LovMaster,
  LovMasterType,
  RazorpayVendorSuccessList
} from '@poss-web/shared/models';

describe('Razorpay vendor Selector Testing Suite', () => {
  describe('Testing updateResponse Related Selectors', () => {
    it('should return updateResponse Selector', () => {
      const state: RazorpayVendorConfigurationState = {
        ...initialState,
        updatedVendorList: 'A'
      };
      expect(
        selectors.razorpayVendorConfigurationSelectors.updateResponse.projector(
          state
        )
      ).toEqual('A');
    });
  });

  describe('Testing selectTotalElements Related Selectors', () => {
    it('should return selectTotalElements Selector', () => {
      const state: RazorpayVendorConfigurationState = {
        ...initialState,
        totalCount: 0
      };
      expect(
        selectors.razorpayVendorConfigurationSelectors.selectTotalElements.projector(
          state
        )
      ).toEqual(0);
    });
  });

  describe('Testing selectHasError Related Selectors', () => {
    it('should return selectHasError Selector', () => {
      const state: RazorpayVendorConfigurationState = {
        ...initialState,
        hasError: null
      };
      expect(
        selectors.razorpayVendorConfigurationSelectors.selectHasError.projector(
          state
        )
      ).toEqual(null);
    });
  });

  describe('Testing selectIsLoading Related Selectors', () => {
    it('should return selectIsLoading Selector', () => {
      const state: RazorpayVendorConfigurationState = {
        ...initialState,
        isLoading: true
      };
      expect(
        selectors.razorpayVendorConfigurationSelectors.selectIsLoading.projector(
          state
        )
      ).toEqual(true);
    });
  });

  describe('Testing selectIsErrorLog Related Selectors', () => {
    it('should return selectIsErrorLog Selector', () => {
      const state: RazorpayVendorConfigurationState = {
        ...initialState,
        errorLog: true
      };
      expect(
        selectors.razorpayVendorConfigurationSelectors.selectIsErrorLog.projector(
          state
        )
      ).toEqual(true);
    });
  });
});
