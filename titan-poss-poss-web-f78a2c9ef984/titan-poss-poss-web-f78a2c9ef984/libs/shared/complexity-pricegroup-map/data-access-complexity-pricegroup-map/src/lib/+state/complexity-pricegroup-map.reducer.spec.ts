import * as actions from './complexity-pricegroup-map.actions';
import { ComplexityPricegroupState } from './complexity-pricegroup-map.state';
import {
  initialState,
  ComplexityPricegroupReducer
} from './complexity-pricegroup-map.reducer';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  ComplexityPriceGroupDetails,
  LoadComplexityPriceGroupListingPayload,
  LoadComplexityPriceGroupListingSuccessPayload
} from '@poss-web/shared/models';

describe('Stone Type reducer Testing Suite', () => {
  const createComplexityPriceGroup = (
    id: string,
    complexityCode: string,
    priceGroup: string,
    makingChargesPerUnit: string,
    makingChargesPerGram: string,
    wastagePercentage: string,
    makingChargesPercentage: string
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

  describe('Testing Load ComplexityPricegroup details list', () => {
    beforeEach(() => {});
    it('LoadComplexityPricegroupMappingDetails should return list of stone types', () => {
      const payload: LoadComplexityPriceGroupListingPayload = {
        pageIndex: 0,
        pageSize: 100
      };
      const payload2 = 'aaa';
      const action = new actions.LoadComplexityPricegroupMappingDetails(
        payload,
        payload2
      );
      const result: ComplexityPricegroupState = ComplexityPricegroupReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(true);
    });

    it('LoadComplexityPricegroupMappingDetailsSuccess should return list of stone types', () => {
      const payload: LoadComplexityPriceGroupListingSuccessPayload = {
        complexityPricegroupListing: [complexityPriceGroup1],
        totalElements: 1
      };
      const action = new actions.LoadComplexityPricegroupMappingDetailsSuccess(
        payload
      );
      const result: ComplexityPricegroupState = ComplexityPricegroupReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.totalComplexityPricegroupDetails).toBe(
        [complexityPriceGroup1].length
      );
    });

    it('LoadComplexityPricegroupMappingDetailsFailure should return list of stone types', () => {
      const action = new actions.LoadComplexityPricegroupMappingDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: ComplexityPricegroupState = ComplexityPricegroupReducer(
        initialState,
        action
      );
      expect(result.error.message).toEqual('some error');
    });
  });

  // stonetype by stone type code

  describe('Testing Load Complexity price group details by Id list', () => {
    beforeEach(() => {});
    it('LoadComplexityPricegroupMappingDetailsById should return list of stone types', () => {
      const payload = 'AZ';
      const action = new actions.LoadComplexityPricegroupMappingDetailsById(
        payload
      );
      const result: ComplexityPricegroupState = ComplexityPricegroupReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(true);
    });

    it('LoadComplexityPricegroupMappingDetailsByIdSuccess should return list of stone types', () => {
      const payload: ComplexityPriceGroupDetails = complexityPriceGroup1;
      const action = new actions.LoadComplexityPricegroupMappingDetailsByIdSuccess(
        payload
      );
      const result: ComplexityPricegroupState = ComplexityPricegroupReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.complexityPricegroupDetails).toBe(complexityPriceGroup1);
    });

    it('LoadComplexityPricegroupMappingDetailsByIdFailure should return list of stonetypecode', () => {
      const action = new actions.LoadComplexityPricegroupMappingDetailsByIdFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: ComplexityPricegroupState = ComplexityPricegroupReducer(
        initialState,
        action
      );
      expect(result.error.message).toEqual('some error');
    });
  });
});
