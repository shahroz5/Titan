import {
  LoadMarketCodeListingSuccessPayload,
  LoadMarketCodesListingPayload,
  MarketCodeDetails,
  MarketMaterialFactors,
  SaveMarketCodeDetailsPayload,
  SaveMarketMaterialFactorsPayload,
  UpdateMarketCodeDetailsPayload
} from '@poss-web/shared/models';
import { LoadMarketCodeDetails } from './market-code.actions';
import * as actions from './market-code.actions';
import { MarketCodeState } from './market-code.state';
import { initialState, MarketCodeReducer } from './market-code.reducer';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

describe('MarketCode Reducer Testing Suite', () => {
  const marketCodeDetails: MarketCodeDetails[] = [
    {
      marketCode: 'MAR',
      description: 'MAR',
      isActive: true,
      marketMaterialFacators: {}
    }
  ];
  const saveMarketMaterialFactorsSuccess: MarketMaterialFactors = {
    goldAddAmount: '123',
    goldDeductAmount: '123',
    goldMarkupFactor: '123',
    silverAddAmount: '123',
    silverDeductAmount: '123',
    silverMarkupFactor: '133',
    platinumAddAmount: '123',
    platinumDeductAmount: '123',
    platinumMarkupFactor: '123',
    marketCode: 'MAR',
    description: 'MAR',
    isActive: true,
    f1MarkupFactor: '123',
    f2MarkupFactor: '123'
  };

  const saveMarketCodeDetails: SaveMarketCodeDetailsPayload = {
    marketCode: 'MAR',
    description: 'MAR',
    isActive: true
  };
  const saveMarketMaterialFactors: SaveMarketMaterialFactorsPayload = {
    marketCode: 'MAR',
    marketMarkupFactors: [
      {
        addAmount: 10,
        deductAmount: 11,
        markupFactor: 12,
        metalTypeCode: 'gold'
      }
    ]
  };
  const dummyMarketCodeListing: LoadMarketCodeListingSuccessPayload = {
    marketCodeListing: marketCodeDetails,
    totalElements: 1
  };
  const updateMarketCodeDetails: UpdateMarketCodeDetailsPayload = {
    marketCode: 'MAR',
    updateMarketDetails: {
      isActive: true
    }
  };
  describe('Testing LoadMarketCodeListing', () => {
    beforeEach(() => {});
    it('LoadMarketCodeDetails should return isLoading=true,error=null', () => {
      const payload: LoadMarketCodesListingPayload = {
        pageIndex: 0,
        pageSize: 100
      };

      const action = new actions.LoadMarketCodeDetails(payload);

      const result: MarketCodeState = MarketCodeReducer(initialState, action);

      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });
    it('LoadCFAProductCodeSuccess should return success response', () => {
      //const cfaProductCodeArray = [cfaProductCode1, cfaProductCode2];
      const response: LoadMarketCodeListingSuccessPayload = dummyMarketCodeListing;

      const action = new actions.LoadMarketCodeDetailsSuccess(response);

      const result: MarketCodeState = MarketCodeReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.marketCodeListing).toBe(response.marketCodeListing);
      expect(result.totalMarketCodes).toBe(response.totalElements);
    });
    it('LoadCFAProductCodeFailure should return error', () => {
      const action = new actions.LoadMarketCodeDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: MarketCodeState = MarketCodeReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
    });
  });

  describe('Testing LoadMarketCodeDetailsBasedOnMarketCode', () => {
    beforeEach(() => {});
    it('LoadMarketCodeDetailsBasedOnMarketCode should return isLoading=true,error=null', () => {
      const action = new actions.LoadMarketCodeDetailsBasedOnMarketCode('MAR');

      const result: MarketCodeState = MarketCodeReducer(initialState, action);

      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });
    it('LoadMarketCodeDetailsBasedOnMarketCodeSuccess should return success response', () => {
      const action = new actions.LoadMarketCodeDetailsBasedOnMarketCodeSuccess(
        saveMarketCodeDetails
      );

      const result: MarketCodeState = MarketCodeReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.marketCodeDetails).toBe(saveMarketCodeDetails);
    });
    it('LoadMarketCodeDetailsBasedOnMarketCodeFailure should return error', () => {
      const action = new actions.LoadMarketCodeDetailsBasedOnMarketCodeFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: MarketCodeState = MarketCodeReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
    });
  });
  describe('ResetMarketCodeDetails', () => {
    it('ResetMarketCodeDetails should return isLoading=true,error=null', () => {
      const action = new actions.ResetMarketCodeDetails();

      const result: MarketCodeState = MarketCodeReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.error).toBe(null);
      expect(result.marketCodeDetails).toBe(null);
      expect(result.hasSavedMarketDetails).toBe(null);
      expect(result.hasUpdatedMarketCodeFacators).toBe(null);
      expect(result.hasUpdatedMarketDetails).toBe(null);
      expect(result.hasSavedMarketCodeFactors).toBe(null);
    });
  });
  describe('Testing SearchMarketCode', () => {
    beforeEach(() => {});
    it('SearchMarketCode should return isLoading=true,error=null', () => {
      const action = new actions.SearchMarketCode('MAR');

      const result: MarketCodeState = MarketCodeReducer(initialState, action);

      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });
    it('SearchMarketCodeSuccess should return success response', () => {
      const action = new actions.SearchMarketCodeSuccess(marketCodeDetails);

      const result: MarketCodeState = MarketCodeReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.marketCodeListing).toBe(marketCodeDetails);
    });
    it('SearchMarketCodeFailure should return error', () => {
      const action = new actions.SearchMarketCodeFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: MarketCodeState = MarketCodeReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
    });
  });
  describe('Testing SaveMarketCodeDetails', () => {
    beforeEach(() => {});
    it('SaveMarketCodeDetails should return isLoading=true,error=null', () => {
      const action = new actions.SaveMarketCodeDetails(saveMarketCodeDetails);

      const result: MarketCodeState = MarketCodeReducer(initialState, action);

      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
      expect(result.hasSavedMarketDetails).toBe(null);
    });
    it('SaveMarketCodeDetailsSuccess should return success response', () => {
      const action = new actions.SaveMarketCodeDetailsSuccess(
        saveMarketCodeDetails
      );

      const result: MarketCodeState = MarketCodeReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.hasSavedMarketDetails).toBe(true);
    });
    it('SaveMarketCodeDetailsFailure should return error', () => {
      const action = new actions.SaveMarketCodeDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: MarketCodeState = MarketCodeReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
      expect(result.hasSavedMarketDetails).toBe(null);
    });
  });
  describe('Testing UpdateMarketCodeDetails', () => {
    beforeEach(() => {});
    it('UpdateMarketCodeDetails should return isLoading=true,error=null', () => {
      const action = new actions.UpdateMarketCodeDetails(
        updateMarketCodeDetails
      );

      const result: MarketCodeState = MarketCodeReducer(initialState, action);

      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
      expect(result.hasUpdatedMarketDetails).toBe(null);
    });
    it('UpdateMarketCodeDetailsSuccess should return success response', () => {
      const action = new actions.UpdateMarketCodeDetailsSuccess(
        saveMarketCodeDetails
      );

      const result: MarketCodeState = MarketCodeReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.hasUpdatedMarketDetails).toBe(true);
      //expect(result.marketCodeListing).toBe([saveMarketCodeDetails]);
    });
    it('UpdateMarketCodeDetailsFailure should return error', () => {
      const action = new actions.UpdateMarketCodeDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: MarketCodeState = MarketCodeReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
      expect(result.hasUpdatedMarketDetails).toBe(false);
    });
  });

  describe('Testing SaveMarketMaterialFactors', () => {
    beforeEach(() => {});
    it('SaveMarketMaterialFactors should return isLoading=true,error=null', () => {
      const action = new actions.SaveMarketMaterialFactors(
        saveMarketMaterialFactors
      );

      const result: MarketCodeState = MarketCodeReducer(initialState, action);

      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
      expect(result.hasSavedMarketCodeFactors).toBe(null);
    });
    it('SaveMarketMaterialFactorsSuccess should return success response', () => {
      const action = new actions.SaveMarketMaterialFacatorsSuccess(
        saveMarketMaterialFactorsSuccess
      );

      const result: MarketCodeState = MarketCodeReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.hasSavedMarketCodeFactors).toBe(true);
      //expect(result.marketCodeListing).toBe(saveMarketCodeDetails);
    });
    it('SaveMarketMaterialFactorsFailure should return error', () => {
      const action = new actions.SaveMarketMaterialFacatorsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: MarketCodeState = MarketCodeReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
      expect(result.hasSavedMarketCodeFactors).toBe(null);
    });
  });

  describe('Testing UpdateMarketMaterialFactors', () => {
    beforeEach(() => {});
    it('SaveMarketMaterialFactors should return isLoading=true,error=null', () => {
      const action = new actions.UpdateMarketMaterialFactors(
        saveMarketMaterialFactors
      );

      const result: MarketCodeState = MarketCodeReducer(initialState, action);

      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
      expect(result.hasUpdatedMarketCodeFacators).toBe(null);
    });
    it('UpdateMarketMaterialFactorsSuccess should return success response', () => {
      const action = new actions.UpdateMarketMaterialFactorsSuccess(
        saveMarketMaterialFactorsSuccess
      );

      const result: MarketCodeState = MarketCodeReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.hasUpdatedMarketCodeFacators).toBe(true);
    });
    it('UpdateMarketMaterialFactorsFailure should return error', () => {
      const action = new actions.UpdateMarketMaterialFactorsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: MarketCodeState = MarketCodeReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
      expect(result.hasSavedMarketCodeFactors).toBe(null);
    });
  });

  describe('Testing LoadMarketCodeDetailsBasedOnMarketCode', () => {
    beforeEach(() => {});
    it('LoadMarketCodeDetailsBasedOnMarketCode should return isLoading=true,error=null', () => {
      const action = new actions.LoadMarketCodeDetailsBasedOnMarketCode('MAR');

      const result: MarketCodeState = MarketCodeReducer(initialState, action);

      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
      expect(result.hasUpdatedMarketCodeFacators).toBe(null);
    });
    it('LoadMarketCodeDetailsBasedOnMarketCodeSuccess should return success response', () => {
      const action = new actions.LoadMarketCodeDetailsBasedOnMarketCodeSuccess(
        saveMarketMaterialFactorsSuccess
      );

      const result: MarketCodeState = MarketCodeReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      //expect(result.hasUpdatedMarketCodeFacators).toBe(true);
      expect(result.marketCodeDetails).toBe(saveMarketMaterialFactorsSuccess);
    });
    it('LoadMarketCodeDetailsBasedOnMarketCodeFailure should return error', () => {
      const action = new actions.LoadMarketCodeDetailsBasedOnMarketCodeFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: MarketCodeState = MarketCodeReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
    });
  });
});
