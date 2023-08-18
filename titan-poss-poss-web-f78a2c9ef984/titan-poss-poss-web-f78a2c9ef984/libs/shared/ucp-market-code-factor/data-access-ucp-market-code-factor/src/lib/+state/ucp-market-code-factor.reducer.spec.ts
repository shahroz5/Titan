//you should simply assert that you get the right state given the provided inputs.

import * as actions from './ucp-market-code-factor.action';

import {
  UcpMarketCodeListPayload,
  UcpMarketCode,
  UpdateUcpMarketCodePayload,
  SaveUcpMarketCodePayload,
  MarketCode,
  UcpProductGroup,
  UcpMarketCodeListing
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  ucpMarketCodeFactorReducer,
  initialState
} from './ucp-market-code-factor.reducer';
import { UcpMarketCodeFactorState } from './ucp-market-code-factor.state';

describe('ucpMarketCodeFactorReducer reducer Testing Suite', () => {
  const testState = initialState;

  describe('Testing LoadUCPMarketCodeFactorCodeList ', () => {
    beforeEach(() => {});
    it('Load LoadUCPMarketCodeFactorCodeList should set the isLoading to true', () => {
      const payload: UcpMarketCodeListPayload = {
        pageIndex: 1,
        pageSize: 10
      };

      const action = new actions.LoadUCPMarketCodeFactorCodeList(payload);

      const result: UcpMarketCodeFactorState = ucpMarketCodeFactorReducer(
        testState,
        action
      );

      expect(result.isLoading).toBe(true);
    });
    it('LoadUCPMarketCodeFactorCodeListSuccess should return list of UCP MarketCode Factor List list', () => {
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
      const action = new actions.LoadUCPMarketCodeFactorCodeListSuccess(
        payload
      );

      const result: UcpMarketCodeFactorState = ucpMarketCodeFactorReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.ucpMarketCodeList.length).toBe(1);
    });
    it('LoadUCPMarketCodeFactorCodeListFailure should return error', () => {
      const action = new actions.LoadUCPMarketCodeFactorCodeListFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: UcpMarketCodeFactorState = ucpMarketCodeFactorReducer(
        testState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadUCPMarketCodeFactorByCode Functionality ', () => {
    beforeEach(() => {});
    it('LoadUCPMarketCodeFactorByCode should set isLoading true ', () => {
      const payload = '1';
      const action = new actions.LoadUCPMarketCodeFactorByCode(payload);

      const result: UcpMarketCodeFactorState = ucpMarketCodeFactorReducer(
        testState,
        action
      );

      expect(result.isLoading).toBe(true);
    });
    it('LoadUCPMarketCodeFactorByCodeSuccess should return   UCP MarketCode Factor By Code', () => {
      const payload: UcpMarketCode = {
        marketCode: 'KA',
        id: '1',
        ucpCfa: '71',
        ucpFactor: '1.1'
      };
      const action = new actions.LoadUCPMarketCodeFactorByCodeSuccess(payload);

      const result: UcpMarketCodeFactorState = ucpMarketCodeFactorReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.ucpMarketCode).toEqual(payload);
    });
    it('LoadUCPMarketCodeFactorByCodeFailure should return error', () => {
      const action = new actions.LoadUCPMarketCodeFactorByCodeFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: UcpMarketCodeFactorState = ucpMarketCodeFactorReducer(
        testState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing UpdateUCPMarketCodeFactorByCode ', () => {
    beforeEach(() => {});
    it('UpdateUCPMarketCodeFactorByCode  should set isLoading true', () => {
      const payload: UpdateUcpMarketCodePayload = {
        data: {
          ucpFactor: 1
        },
        id: '1'
      };
      const action = new actions.UpdateUCPMarketCodeFactorByCode(payload);

      const result: UcpMarketCodeFactorState = ucpMarketCodeFactorReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(true);
    });
    it('UpdateUCPMarketCodeFactorByCodeSuccess should update hasUpdated to true ', () => {
      const action = new actions.UpdateUCPMarketCodeFactorByCodeSuccess();

      const result: UcpMarketCodeFactorState = ucpMarketCodeFactorReducer(
        initialState,
        action
      );

      expect(result.hasUpdated).toEqual(true);

      expect(result.isLoading).toBe(false);
    });
    it('UpdateUCPMarketCodeFactorByCodeFailure should return error', () => {
      const action = new actions.UpdateUCPMarketCodeFactorByCodeFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: UcpMarketCodeFactorState = ucpMarketCodeFactorReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing SaveUCPMarketCodeFactorCode ', () => {
    beforeEach(() => {});
    it('SaveUCPMarketCodeFactorCode should set the isLoading true', () => {
      const payload: SaveUcpMarketCodePayload = {
        marketCode: 'KA',
        markupFactor: 1,
        productGroupCode: '71'
      };
      const action = new actions.SaveUCPMarketCodeFactorCode(payload);

      const result: UcpMarketCodeFactorState = ucpMarketCodeFactorReducer(
        initialState,

        action
      );

      expect(result.isLoading).toBe(true);
    });
    it('SaveUCPMarketCodeFactorCodeSuccess should update hasSaved to true', () => {
      const action = new actions.SaveUCPMarketCodeFactorCodeSuccess();

      const result: UcpMarketCodeFactorState = ucpMarketCodeFactorReducer(
        initialState,

        action
      );

      expect(result.hasSaved).toBe(true);
      expect(result.isLoading).toBe(false);
    });
    it('SaveUCPMarketCodeFactorCodeFailure should return error', () => {
      const action = new actions.SaveUCPMarketCodeFactorCodeFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: UcpMarketCodeFactorState = ucpMarketCodeFactorReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadMarketCode Functionality ', () => {
    beforeEach(() => {});
    it('LoadMarketCode should set isLaoding to true ', () => {
      const action = new actions.LoadMarketCode();

      const result: UcpMarketCodeFactorState = ucpMarketCodeFactorReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(true);
    });
    it('LoadMarketCodeSuccess should return market codes ', () => {
      const payload: MarketCode[] = [
        {
          id: '29',
          name: 'KA'
        }
      ];

      const action = new actions.LoadMarketCodeSuccess(payload);

      const result: UcpMarketCodeFactorState = ucpMarketCodeFactorReducer(
        initialState,
        action
      );

      expect(result.marketCode.length).toBe(1);
      expect(result.isLoading).toBe(false);
    });
    it('LoadMarketCodeFailure should return error', () => {
      const action = new actions.LoadMarketCodeFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: UcpMarketCodeFactorState = ucpMarketCodeFactorReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadUcpProductCode Functionality ', () => {
    beforeEach(() => {});
    it('LoadUcpProductCode should set isLoading to true ', () => {
      const action = new actions.LoadUcpProductCode();

      const result: UcpMarketCodeFactorState = ucpMarketCodeFactorReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(true);
    });

    it('LoadUcpProductCodeSuccess should set hasUpdated true', () => {
      const payload: UcpProductGroup[] = [
        {
          id: '72',
          name: 'Gold studed'
        }
      ];

      const action = new actions.LoadUcpProductCodeSuccess(payload);

      const result: UcpMarketCodeFactorState = ucpMarketCodeFactorReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.ucpProductGroup.length).toBe(1);
    });
    it('LoadUcpProductCodeFailure should return error', () => {
      const action = new actions.LoadUcpProductCodeFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: UcpMarketCodeFactorState = ucpMarketCodeFactorReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadReset Functionality ', () => {
    beforeEach(() => {});
    it('LoadReset should reset the state', () => {
      const action = new actions.LoadReset();

      const result: UcpMarketCodeFactorState = ucpMarketCodeFactorReducer(
        initialState,
        action
      );

      expect(result).toEqual(initialState);
    });
  });
});
