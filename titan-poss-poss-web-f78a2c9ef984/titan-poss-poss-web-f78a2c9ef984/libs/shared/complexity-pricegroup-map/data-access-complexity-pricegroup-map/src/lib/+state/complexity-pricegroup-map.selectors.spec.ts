import { ComplexityPricegroupState } from './complexity-pricegroup-map.state';
import { initialState } from './complexity-pricegroup-map.reducer';
import * as selectors from './complexity-pricegroup-map.selectors';
import {
  ComplexityPriceGroupDetails,
  CustomErrors
} from '@poss-web/shared/models';

describe('complexity price group selector Testing Suite', () => {
  const createComplexityPriceGroup = (
    id: 'abc',
    complexityCode: 'abc',
    priceGroup: 'abc',
    makingChargesPerUnit: 'abc',
    makingChargesPerGram: 'abc',
    wastagePercentage: 'abc',
    makingChargesPercentage: 'abc'
  ): ComplexityPriceGroupDetails => {
    return {
      id,
      complexityCode,
      priceGroup,
      makingChargesPerUnit,
      makingChargesPerGram,
      wastagePercentage,
      makingChargesPercentage
    };
  };

  const complexityPriceGroup1 = createComplexityPriceGroup(
    'abc',
    'abc',
    'abc',
    'abc',
    'abc',
    'abc',
    'abc'
  );

  const complexityPriceGroup2 = createComplexityPriceGroup(
    'abc',
    'abc',
    'abc',
    'abc',
    'abc',
    'abc',
    'abc'
  );

  const complexityPriceGroupArray = [
    complexityPriceGroup1,
    complexityPriceGroup2
  ];

  const complexityCodeData = {
    complexityCode: 'abc',
    description: 'abc'
  };
  const priceGroupData = {
    priceGroup: 'abc',
    description: 'abc'
  };
  const error: CustomErrors = {
    error: null,
    code: '',
    message: '',
    traceId: '',
    timeStamp: ''
  };
  describe('Testing complexity price group master related Selectors', () => {
    it('Should return the list of complexity price group list', () => {
      const state: ComplexityPricegroupState = {
        ...initialState,
        complexityPricegroupListing: complexityPriceGroupArray
      };
      expect(
        selectors.ComplexityPricegroupSelectors.selectComplexityPriceGroupDetailsListing.projector(
          state
        )
      ).toEqual(complexityPriceGroupArray);
    });
    it('Should return the true or false', () => {
      const state: ComplexityPricegroupState = {
        ...initialState,
        isLoading: true
      };
      expect(
        selectors.ComplexityPricegroupSelectors.selectIsLoading.projector(state)
      ).toEqual(true);
    });
    it('Should return the count', () => {
      const state: ComplexityPricegroupState = {
        ...initialState,
        totalComplexityPricegroupDetails: 0
      };
      expect(
        selectors.ComplexityPricegroupSelectors.selectTotalComplexityPriceGroupDetailsCount.projector(
          state
        )
      ).toEqual(0);
    });
    it('Should return the error object', () => {
      const state: ComplexityPricegroupState = {
        ...initialState,
        error: {
          error: null,
          timeStamp: '',
          traceId: '',
          code: '',
          message: ''
        }
      };
      expect(
        selectors.ComplexityPricegroupSelectors.selectError.projector(state)
      ).toEqual(error);
    });
    it('Should return the complexity price group object', () => {
      const state: ComplexityPricegroupState = {
        ...initialState,
        complexityPricegroupDetails: complexityPriceGroup1
      };
      expect(
        selectors.ComplexityPricegroupSelectors.selectComplexityPriceGroupDetailsById.projector(
          state
        )
      ).toEqual(complexityPriceGroup1);
    });

    it('savecomplexityPricegroup Should save the complexity price group', () => {
      const state: ComplexityPricegroupState = {
        ...initialState,
        savecomplexityPricegroup: complexityPriceGroup1
      };
      expect(
        selectors.ComplexityPricegroupSelectors.selectSaveComplexityPriceGroupFormResponse.projector(
          state
        )
      ).toEqual(complexityPriceGroup1);
    });
    it('editcomplexityPricegroup Should edit the complexity price group', () => {
      const state: ComplexityPricegroupState = {
        ...initialState,
        editcomplexityPricegroup: complexityPriceGroup1
      };
      expect(
        selectors.ComplexityPricegroupSelectors.selectEditComplexityPriceGroupFormResponse.projector(
          state
        )
      ).toEqual(complexityPriceGroup1);
    });

    it('editcomplexityPricegroup Should edit the complexity price group', () => {
      const state: ComplexityPricegroupState = {
        ...initialState,
        complexityCode: [complexityCodeData]
      };
      expect(
        selectors.ComplexityPricegroupSelectors.selectComplexityCode.projector(
          state
        )
      ).toEqual([complexityCodeData]);
    });

    it('editcomplexityPricegroup Should edit the complexity price group', () => {
      const state: ComplexityPricegroupState = {
        ...initialState,
        pricegroup: [priceGroupData]
      };
      expect(
        selectors.ComplexityPricegroupSelectors.selectPriceGroup.projector(
          state
        )
      ).toEqual([priceGroupData]);
    });
  });
});
