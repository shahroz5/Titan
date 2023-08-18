import {
  CustomErrors,
  LoadMarketCodeListingSuccessPayload,
  LoadMarketCodesListingPayload,
  MarketCodeDetails,
  MarketMaterialFactors,
  SaveMarketCodeDetailsPayload,
  SaveMarketMaterialFactorsPayload,
  UpdateMarketCodeDetailsPayload
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  LoadMarketCodeDetails,
  LoadMarketCodeDetailsBasedOnMarketCode,
  LoadMarketCodeDetailsBasedOnMarketCodeFailure,
  LoadMarketCodeDetailsBasedOnMarketCodeSuccess,
  LoadMarketCodeDetailsFailure,
  LoadMarketCodeDetailsSuccess,
  MarketCodeActionTypes,
  ResetMarketCodeDetails,
  SaveMarketCodeDetails,
  SaveMarketCodeDetailsFailure,
  SaveMarketCodeDetailsSuccess,
  SaveMarketMaterialFacatorsFailure,
  SaveMarketMaterialFacatorsSuccess,
  SaveMarketMaterialFactors,
  SearchMarketCode,
  SearchMarketCodeFailure,
  SearchMarketCodeSuccess,
  UpdateMarketCodeDetails,
  UpdateMarketCodeDetailsFailure,
  UpdateMarketCodeDetailsSuccess,
  UpdateMarketMaterialFactors,
  UpdateMarketMaterialFactorsFailure,
  UpdateMarketMaterialFactorsSuccess
} from './market-code.actions';

describe('Market Code Testing Suite', () => {
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

  describe('LoadMarketCodeDetails Action Test Cases', () => {
    it('should check correct type is used for  LoadMarketCodeDetails action ', () => {
      const payload: LoadMarketCodesListingPayload = {
        pageIndex: 0,
        pageSize: 100
      };
      const action = new LoadMarketCodeDetails(payload);

      expect(action.type).toEqual(
        MarketCodeActionTypes.LOAD_MARKET_CODE_DETAILS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  LoadMarketCodeDetailsSuccess action ', () => {
      const payload: LoadMarketCodeListingSuccessPayload = dummyMarketCodeListing;
      const action = new LoadMarketCodeDetailsSuccess(payload);

      expect(action.type).toEqual(
        MarketCodeActionTypes.LOAD_MARKET_CODES_DETAILS_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  LoadMarketCodeDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadMarketCodeDetailsFailure(payload);

      expect(action.type).toEqual(
        MarketCodeActionTypes.LOAD_MARKET_CODE_DETAILS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
  describe('LoadMarketCodeDetailsBasedOnMarketCode Action Test Cases', () => {
    it('should check correct type is used for  LoadMarketCodeDetailsBasedOnMarketCode action ', () => {
      const action = new LoadMarketCodeDetailsBasedOnMarketCodeSuccess(
        saveMarketCodeDetails
      );

      expect(action.type).toEqual(
        MarketCodeActionTypes.LOAD_MARKET_CODE_DETAILS_BASED_ON_MARKET_CODE_SUCCESS
      );
      expect(action.payload).toEqual(saveMarketCodeDetails);
    });
    it('should check correct type is used for  LoadMarketCodeDetailsBasedOnMarketCodeFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadMarketCodeDetailsBasedOnMarketCodeFailure(payload);

      expect(action.type).toEqual(
        MarketCodeActionTypes.LOAD_MARKET_CODE_DETAILS_BASED_ON_MARKET_CODE_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('ResetMarketCourierDetails', () => {
    it('should check correct type is used for  ResetMarketCodeDetails action ', () => {
      const action = new ResetMarketCodeDetails();

      expect(action.type).toEqual(
        MarketCodeActionTypes.RESET_MARKET_CODE_DETAILS
      );
      //expect(action.payload).toEqual('MAR');
    });
  });
  describe('SaveMarketCodeDetails Testing Suite', () => {
    it('should check correct type is used for  SaveMarketCodeDetails action ', () => {
      const action = new SaveMarketCodeDetails(saveMarketCodeDetails);

      expect(action.type).toEqual(
        MarketCodeActionTypes.SAVE_MARKET_CODE_DETAILS
      );
      expect(action.payload).toEqual(saveMarketCodeDetails);
    });
    it('should check correct type is used for  SaveMarketCodeDetailsSuccess action ', () => {
      const action = new SaveMarketCodeDetailsSuccess(saveMarketCodeDetails);

      expect(action.type).toEqual(
        MarketCodeActionTypes.SAVE_MARKET_CODE_DETAILS_SUCCESS
      );
      expect(action.payload).toEqual(saveMarketCodeDetails);
    });
    it('should check correct type is used for  SaveMarketCodeDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SaveMarketCodeDetailsFailure(payload);

      expect(action.type).toEqual(
        MarketCodeActionTypes.SAVE_MARKET_CODE_DETAILS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
  describe('SearchMarketCode Testing Suite', () => {
    it('should check correct type is used for  SearchMarketCode action ', () => {
      const action = new SearchMarketCode('MAR');

      expect(action.type).toEqual(MarketCodeActionTypes.SEARCH_MARKET_CODE);
      expect(action.payload).toEqual('MAR');
    });
    it('should check correct type is used for  SearchMarketCodeSuccess action ', () => {
      const action = new SearchMarketCodeSuccess(marketCodeDetails);

      expect(action.type).toEqual(
        MarketCodeActionTypes.SEARCH_MARKET_CODE_SUCCESS
      );
      expect(action.payload).toEqual(marketCodeDetails);
    });
    it('should check correct type is used for  SearchMarketCodeFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SearchMarketCodeFailure(payload);

      expect(action.type).toEqual(
        MarketCodeActionTypes.SEARCH_MARKET_CODE_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
  describe('UpdateMarketCodeDetails Testing Suite', () => {
    it('should check correct type is used for  UpdateMarketCodeDetails action ', () => {
      const action = new UpdateMarketCodeDetails(updateMarketCodeDetails);

      expect(action.type).toEqual(
        MarketCodeActionTypes.UPDATE_MARKET_CODE_DETAILS
      );
      expect(action.payload).toEqual(updateMarketCodeDetails);
    });
    it('should check correct type is used for  UpdateMarketCodeDetailsSuccess action ', () => {
      const action = new UpdateMarketCodeDetailsSuccess(saveMarketCodeDetails);

      expect(action.type).toEqual(
        MarketCodeActionTypes.UPDATE_MARKET_CODE_DETAILS_SUCCESS
      );
      expect(action.payload).toEqual(saveMarketCodeDetails);
    });
    it('should check correct type is used for  UpdateMarketCodeDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new UpdateMarketCodeDetailsFailure(payload);

      expect(action.type).toEqual(
        MarketCodeActionTypes.UPDATE_MARKET_CODE_DETAILS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
  describe('SaveMarketMaterialFactors Testing Suite', () => {
    it('should check correct type is used for  SaveMarketMaterialFactors action ', () => {
      const action = new SaveMarketMaterialFactors(saveMarketMaterialFactors);

      expect(action.type).toEqual(
        MarketCodeActionTypes.SAVE_MARKET_MATERIAL_FACTORS
      );
      expect(action.payload).toEqual(saveMarketMaterialFactors);
    });
    it('should check correct type is used for  SaveMarketMaterialFactorsSuccess action ', () => {
      const action = new SaveMarketMaterialFacatorsSuccess(
        saveMarketMaterialFactorsSuccess
      );

      expect(action.type).toEqual(
        MarketCodeActionTypes.SAVE_MARKET_MATERIAL_FACTORS_SUCCESS
      );
      expect(action.payload).toEqual(saveMarketMaterialFactorsSuccess);
    });
    it('should check correct type is used for  SaveMarketMaterialFactorsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SaveMarketMaterialFacatorsFailure(payload);

      expect(action.type).toEqual(
        MarketCodeActionTypes.SAVE_MARKET_MATERIAL_FACTORS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
  describe('UpdateMarketMaterialFactors Testing Suite', () => {
    it('should check correct type is used for  UpdateMarketMaterialFactors action ', () => {
      const action = new UpdateMarketMaterialFactors(saveMarketMaterialFactors);

      expect(action.type).toEqual(
        MarketCodeActionTypes.UPDATE_MARKET_MATERIAL_FACTORS
      );
      expect(action.payload).toEqual(saveMarketMaterialFactors);
    });
    it('should check correct type is used for  UpdateMarketMaterialFactorsSuccess action ', () => {
      const action = new UpdateMarketMaterialFactorsSuccess(
        saveMarketMaterialFactorsSuccess
      );

      expect(action.type).toEqual(
        MarketCodeActionTypes.UPDATE_MARKET_MATERIAL_FACTORS_SUCCESS
      );
      expect(action.payload).toEqual(saveMarketMaterialFactorsSuccess);
    });
    it('should check correct type is used for  UpdateMarketMaterialFactorsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new UpdateMarketMaterialFactorsFailure(payload);

      expect(action.type).toEqual(
        MarketCodeActionTypes.UPDATE_MARKET_MATERIAL_FACTORS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
});
