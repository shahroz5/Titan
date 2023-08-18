import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  CustomErrors,
  UcpMarketCodeListPayload,
  UcpMarketCodeListing,
  UcpMarketCode,
  UpdateUcpMarketCodePayload,
  SaveUcpMarketCodePayload,
  MarketCode,
  UcpProductGroup
} from '@poss-web/shared/models';

import {
  UcpMarketCodeFactorActionTypes,
  LoadUCPMarketCodeFactorCodeListSuccess,
  LoadUCPMarketCodeFactorCodeListFailure,
  LoadUCPMarketCodeFactorCodeList,
  LoadUCPMarketCodeFactorByCode,
  LoadUCPMarketCodeFactorByCodeSuccess,
  LoadUCPMarketCodeFactorByCodeFailure,
  UpdateUCPMarketCodeFactorByCodeSuccess,
  UpdateUCPMarketCodeFactorByCodeFailure,
  UpdateUCPMarketCodeFactorByCode,
  SaveUCPMarketCodeFactorCode,
  SaveUCPMarketCodeFactorCodeSuccess,
  SaveUCPMarketCodeFactorCodeFailure,
  LoadMarketCode,
  LoadMarketCodeSuccess,
  LoadMarketCodeFailure,
  LoadUcpProductCodeSuccess,
  LoadUcpProductCodeFailure,
  LoadUcpProductCode,
  LoadReset
} from './ucp-market-code-factor.action';
describe('UCPMarketCodeFactorCodeActions  Action Testing Suite', () => {
  describe('LoadUCPMarketCodeFactorCodeList Action Test Cases', () => {
    it('should check correct type is used for  LoadUCPMarketCodeFactorCodeList action ', () => {
      const payload: UcpMarketCodeListPayload = {
        pageIndex: 1,
        pageSize: 10
      };
      const searchValue = undefined;

      const action = new LoadUCPMarketCodeFactorCodeList(payload);
      expect({ ...action }).toEqual({
        type:
          UcpMarketCodeFactorActionTypes.LOAD_UCP_MARKET_CODE_FACTOR_LISTING,
        payload,
        searchValue
      });
    });
    it('should check correct type is used for  LoadUCPMarketCodeFactorCodeListSuccess action ', () => {
      const payload: UcpMarketCodeListing = {
        results: [
          {
            marketCode: 'KA',
            id: '1',
            ucpCfa: '71',
            ucpFactor: '1.1'
          }
        ],
        totalElements: 10
      };
      const action = new LoadUCPMarketCodeFactorCodeListSuccess(payload);

      expect({ ...action }).toEqual({
        type:
          UcpMarketCodeFactorActionTypes.LOAD_UCP_MARKET_CODE_FACTOR_LISTING_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadUCPMarketCodeFactorCodeListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadUCPMarketCodeFactorCodeListFailure(payload);

      expect({ ...action }).toEqual({
        type:
          UcpMarketCodeFactorActionTypes.LOAD_UCP_MARKET_CODE_FACTOR_LISTING_FAILURE,
        payload
      });
    });
  });

  describe('LoadUCPMarketCodeFactorByCode Action Test Cases', () => {
    it('should check correct type is used for  LoadUCPMarketCodeFactorByCode action ', () => {
      const payload = '1';
      const action = new LoadUCPMarketCodeFactorByCode(payload);
      expect({ ...action }).toEqual({
        type:
          UcpMarketCodeFactorActionTypes.LOAD_UCP_MARKET_CODE_FACTOR_BY_CODE,
        payload
      });
    });
    it('should check correct type is used for LoadUCPMarketCodeFactorByCodeSuccess action ', () => {
      const payload: UcpMarketCode = {
        marketCode: 'KA',
        id: '1',
        ucpCfa: '71',
        ucpFactor: '1.1'
      };

      const action = new LoadUCPMarketCodeFactorByCodeSuccess(payload);

      expect({ ...action }).toEqual({
        type:
          UcpMarketCodeFactorActionTypes.LOAD_UCP_MARKET_CODE_FACTOR_BY_CODE_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadUCPMarketCodeFactorByCodeFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadUCPMarketCodeFactorByCodeFailure(payload);

      expect({ ...action }).toEqual({
        type:
          UcpMarketCodeFactorActionTypes.LOAD_UCP_MARKET_CODE_FACTOR_BY_CODE_FAILURE,
        payload
      });
    });
  });

  describe('UpdateUCPMarketCodeFactorByCode Action Test Cases', () => {
    it('should check correct type is used for  UpdateUCPMarketCodeFactorByCode action ', () => {
      const payload: UpdateUcpMarketCodePayload = {
        data: {
          ucpFactor: 1
        },
        id: '1'
      };
      const action = new UpdateUCPMarketCodeFactorByCode(payload);
      expect({ ...action }).toEqual({
        type:
          UcpMarketCodeFactorActionTypes.UPDATE_UCP_MARKET_CODE_FACTOR_BY_CODE,
        payload
      });
    });
    it('should check correct type is used for UpdateUCPMarketCodeFactorByCodeSuccess action ', () => {
      const action = new UpdateUCPMarketCodeFactorByCodeSuccess();

      expect({ ...action }).toEqual({
        type:
          UcpMarketCodeFactorActionTypes.UPDATE_UCP_MARKET_CODE_FACTOR_BY_CODE_SUCCESS
      });
    });
    it('should check correct type is used for  UpdateUCPMarketCodeFactorByCodeFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new UpdateUCPMarketCodeFactorByCodeFailure(payload);

      expect({ ...action }).toEqual({
        type:
          UcpMarketCodeFactorActionTypes.UPDATE_UCP_MARKET_CODE_FACTOR_BY_CODE_FAILURE,
        payload
      });
    });
  });

  describe('SaveUCPMarketCodeFactorCode Action Test Cases', () => {
    it('should check correct type is used for  SaveUCPMarketCodeFactorCode action ', () => {
      const payload: SaveUcpMarketCodePayload = {
        marketCode: 'KA',
        markupFactor: 1,
        productGroupCode: '71'
      };
      const action = new SaveUCPMarketCodeFactorCode(payload);
      expect({ ...action }).toEqual({
        type: UcpMarketCodeFactorActionTypes.SAVE_UCP_MARKET_CODE_FACTOR,
        payload
      });
    });
    it('should check correct type is used for SaveUCPMarketCodeFactorCodeSuccess action ', () => {
      const action = new SaveUCPMarketCodeFactorCodeSuccess();

      expect({ ...action }).toEqual({
        type: UcpMarketCodeFactorActionTypes.SAVE_UCP_MARKET_CODE_FACTOR_SUCCESS
      });
    });
    it('should check correct type is used for  SaveUCPMarketCodeFactorCodeFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SaveUCPMarketCodeFactorCodeFailure(payload);

      expect({ ...action }).toEqual({
        type:
          UcpMarketCodeFactorActionTypes.SAVE_UCP_MARKET_CODE_FACTOR_FAILURE,
        payload
      });
    });
  });

  describe('LoadMarketCode Action Test Cases', () => {
    it('should check correct type is used for  LoadMarketCode action ', () => {
      const action = new LoadMarketCode();
      expect({ ...action }).toEqual({
        type: UcpMarketCodeFactorActionTypes.LOAD_MARKET_CODE
      });
    });
    it('should check correct type is used for LoadMarketCodeSuccess action ', () => {
      const payload: MarketCode[] = [
        {
          id: '29',
          name: 'KA'
        }
      ];

      const action = new LoadMarketCodeSuccess(payload);

      expect({ ...action }).toEqual({
        type: UcpMarketCodeFactorActionTypes.LOAD_MARKET_CODE_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadMarketCodeFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadMarketCodeFailure(payload);

      expect({ ...action }).toEqual({
        type: UcpMarketCodeFactorActionTypes.LOAD_MARKET_CODE_FAILURE,
        payload
      });
    });
  });

  describe('LoadUcpProductCode Action Test Cases', () => {
    it('should check correct type is used for  LoadUcpProductCode action ', () => {
      const action = new LoadUcpProductCode();
      expect({ ...action }).toEqual({
        type: UcpMarketCodeFactorActionTypes.LOAD_UCP_PRODUCT_CODE
      });
    });
    it('should check correct type is used for UpdateIsActiveSuccess action ', () => {
      const payload: UcpProductGroup[] = [
        {
          id: '72',
          name: 'Gold studed'
        }
      ];

      const action = new LoadUcpProductCodeSuccess(payload);

      expect({ ...action }).toEqual({
        type: UcpMarketCodeFactorActionTypes.LOAD_UCP_PRODUCT_CODE_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadUcpProductCodeFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadUcpProductCodeFailure(payload);

      expect({ ...action }).toEqual({
        type: UcpMarketCodeFactorActionTypes.LOAD_UCP_PRODUCT_CODE_FAILURE,
        payload
      });
    });
  });

  describe('LoadReset Action Test Cases', () => {
    it('should check correct type is used for  LoadReset action ', () => {
      const action = new LoadReset();
      expect({ ...action }).toEqual({
        type: UcpMarketCodeFactorActionTypes.LOAD_RESET
      });
    });
  });
});
