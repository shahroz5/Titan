import * as selectors from './tax-class.selectors';
import {
  TaxClassDetails
} from '@poss-web/shared/models';
import { initialState } from './tax-class.reducer';
import { TaxClassState } from './tax-class.state';

describe('Tax Class Selector Testing Suite', () => {

  const payload: TaxClassDetails = {
    description: 'desc',
    isActive: true,
    taxClassCode: 'code'
  };

  describe('Testing selectTaxClassDetailsByTaxClassCode Related Selectors', () => {
    it('should return selectTaxClassDetailsByTaxClassCode Selector', () => {

      const state: TaxClassState = {
        ...initialState,
        taxClassDetails: payload
      };
      expect(
        selectors.TaxClassSelectors.selectTaxClassDetailsByTaxClassCode.projector(
          state
        )
      ).toEqual(payload);
    });
  });

  describe('Testing selectTaxClassListing Related Selectors', () => {
    it('should return selectTaxClassListing Selector', () => {
      const state: TaxClassState = {
        ...initialState,
        taxClassListing: [payload]
      };
      expect(
        selectors.TaxClassSelectors.selectTaxClassListing.projector(
          state
        )
      ).toEqual([payload]);
    });
  });

  describe('Testing selectIsLoading Related Selectors', () => {
    it('should return selectIsLoading Selector', () => {
      const state: TaxClassState = {
        ...initialState,
        isLoading: true
      };
      expect(
        selectors.TaxClassSelectors.selectIsLoading.projector(
          state
        )
      ).toEqual(true);
    });
  });

  describe('Testing selectSaveTaxClassFormResponse Related Selectors', () => {
    it('should return selectSaveTaxClassFormResponse Selector', () => {
      const state: TaxClassState = {
        ...initialState,
        saveTaxClassResponses: payload
      };
      expect(
        selectors.TaxClassSelectors.selectSaveTaxClassFormResponse.projector(
          state
        )
      ).toEqual(payload);
    });
  });

  describe('Testing selectEditTaxClassFormResponse Related Selectors', () => {
    it('should return selectEditTaxClassFormResponse Selector', () => {
      const state: TaxClassState = {
        ...initialState,
        editTaxClassResponses: payload
      };
      expect(
        selectors.TaxClassSelectors.selectEditTaxClassFormResponse.projector(
          state
        )
      ).toEqual(payload);
    });
  });

});
