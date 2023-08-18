import * as selectors from './tax-master.selectors';
import {
  CustomErrors,
  RequestList,
  IssueAdvanceFilterPayload,
  CashPaymentConfiguration,
  TaxMasterDetails
} from '@poss-web/shared/models';
import { initialState } from './tax-master.reducer';
import { TaxMasterState } from './tax-master.state';

describe('Tax Master Selector Testing Suite', () => {

  const payload: TaxMasterDetails = {
    description: 'desc',
    isActive: true,
    taxCode: 'code',
    taxSystem: 'VAT'
  };

  describe('Testing selectTaxMasterDetailsByTaxMasterCode Related Selectors', () => {
    it('should return selectTaxMasterDetailsByTaxMasterCode Selector', () => {

      const state: TaxMasterState = {
        ...initialState,
        taxMasterDetails: payload
      };
      expect(
        selectors.TaxMasterSelectors.selectTaxMasterDetailsByTaxMasterCode.projector(
          state
        )
      ).toEqual(payload);
    });
  });

  describe('Testing selectTaxMasterListing Related Selectors', () => {
    it('should return selectTaxMasterListing Selector', () => {
      const state: TaxMasterState = {
        ...initialState,
        taxMasterListing: [payload]
      };
      expect(
        selectors.TaxMasterSelectors.selectTaxMasterListing.projector(
          state
        )
      ).toEqual([payload]);
    });
  });

  describe('Testing selectIsLoading Related Selectors', () => {
    it('should return selectIsLoading Selector', () => {
      const state: TaxMasterState = {
        ...initialState,
        isLoading: true
      };
      expect(
        selectors.TaxMasterSelectors.selectIsLoading.projector(
          state
        )
      ).toEqual(true);
    });
  });

  describe('Testing selectSaveTaxMasterFormResponse Related Selectors', () => {
    it('should return selectSaveTaxMasterFormResponse Selector', () => {
      const state: TaxMasterState = {
        ...initialState,
        saveTaxMasterResponses: payload
      };
      expect(
        selectors.TaxMasterSelectors.selectSaveTaxMasterFormResponse.projector(
          state
        )
      ).toEqual(payload);
    });
  });

  describe('Testing selectEditTaxMasterFormResponse Related Selectors', () => {
    it('should return selectEditTaxMasterFormResponse Selector', () => {
      const state: TaxMasterState = {
        ...initialState,
        editTaxMasterResponses: payload
      };
      expect(
        selectors.TaxMasterSelectors.selectEditTaxMasterFormResponse.projector(
          state
        )
      ).toEqual(payload);
    });
  });

});
