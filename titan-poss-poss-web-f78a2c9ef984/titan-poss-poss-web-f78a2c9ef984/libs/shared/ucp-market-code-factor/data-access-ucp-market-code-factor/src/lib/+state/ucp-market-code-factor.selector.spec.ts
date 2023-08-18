// you will need to assert that the store is calling the right selector function.

import {
  CustomErrors,
  UcpMarketCode,
  MarketCode,
  UcpProductGroup
} from '@poss-web/shared/models';

import { initialState } from './ucp-market-code-factor.reducer';
import * as selectors from './ucp-market-code-factor.selector';

import { UcpMarketCodeFactorState } from './ucp-market-code-factor.state';

describe('UcpMarketCodeFactorState selector Testing Suite', () => {
  const error: CustomErrors = {
    error: null,
    code: '',
    message: '',
    traceId: '',
    timeStamp: ''
  };

  describe('Testing UcpMarketCodeFactorState related Selectors', () => {
    it('selectUcpMarketCodeFactorList Should return the UCP market code list  list', () => {
      const ucpMarketCodeListing: UcpMarketCode[] = [
        {
          marketCode: 'KA',
          id: '1',
          ucpCfa: '71',
          ucpFactor: '1.1'
        }
      ];

      const state: UcpMarketCodeFactorState = {
        ...initialState,
        ucpMarketCodeList: ucpMarketCodeListing
      };
      expect(
        selectors.upcMarketCodeFactorSelector.selectUcpMarketCodeFactorList.projector(
          state
        )
      ).toEqual(ucpMarketCodeListing);
    });

    it('selectIsloading Should return the true or false', () => {
      const state: UcpMarketCodeFactorState = {
        ...initialState,
        isLoading: true
      };
      expect(
        selectors.upcMarketCodeFactorSelector.selectIsloading.projector(state)
      ).toEqual(true);
    });
    it('selectError Should return the error object', () => {
      const state: UcpMarketCodeFactorState = {
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
        selectors.upcMarketCodeFactorSelector.selectError.projector(state)
      ).toEqual(error);
    });

    it('selectHasSaved Should return the true or false', () => {
      const state: UcpMarketCodeFactorState = {
        ...initialState,
        hasSaved: true
      };
      expect(
        selectors.upcMarketCodeFactorSelector.selectHasSaved.projector(state)
      ).toEqual(true);
    });

    it('selectTotalElements  Should return total elements', () => {
      const state: UcpMarketCodeFactorState = {
        ...initialState,
        totalElements: 10
      };
      expect(
        selectors.upcMarketCodeFactorSelector.selectTotalElements.projector(
          state
        )
      ).toEqual(10);
    });
    it(' selectUcpMarketCodeFactor', () => {
      const ucpMarketCode: UcpMarketCode = {
        marketCode: 'KA',
        id: '1',
        ucpCfa: '71',
        ucpFactor: '1.1'
      };

      const state: UcpMarketCodeFactorState = {
        ...initialState,
        ucpMarketCode: ucpMarketCode
      };
      expect(
        selectors.upcMarketCodeFactorSelector.selectUcpMarketCodeFactor.projector(
          state
        )
      ).toEqual(ucpMarketCode);
    });

    it('selectMarketCode  Should return market codes', () => {
      const marketCode: MarketCode[] = [
        {
          id: '29',
          name: 'KA'
        }
      ];
      const state: UcpMarketCodeFactorState = {
        ...initialState,
        marketCode: marketCode
      };
      expect(
        selectors.upcMarketCodeFactorSelector.selectMarketCode.projector(state)
      ).toEqual(marketCode);
    });

    it('selectUcpProductGroup  Should return UCP Product Groups', () => {
      const ucpProductGroup: UcpProductGroup[] = [
        {
          id: '72',
          name: 'Gold studed'
        }
      ];
      const state: UcpMarketCodeFactorState = {
        ...initialState,
        ucpProductGroup: ucpProductGroup
      };
      expect(
        selectors.upcMarketCodeFactorSelector.selectUcpProductGroup.projector(
          state
        )
      ).toEqual(ucpProductGroup);
    });
  });
});
