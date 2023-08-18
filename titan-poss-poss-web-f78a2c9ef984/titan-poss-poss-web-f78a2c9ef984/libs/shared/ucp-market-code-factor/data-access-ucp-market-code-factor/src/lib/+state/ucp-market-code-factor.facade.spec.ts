import {
  SaveUcpMarketCodePayload,
  UpdateUcpMarketCodePayload,
  UcpMarketCodeListPayload
} from '@poss-web/shared/models';
import { Store } from '@ngrx/store';

import { TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';

import { UcpMarketCodeFactorFacade } from './ucp-market-code-factor.facade';

import { UcpMarketCodeFactorState } from './ucp-market-code-factor.state';
import {
  LoadReset,
  LoadMarketCode,
  LoadUcpProductCode,
  SaveUCPMarketCodeFactorCode,
  UpdateUCPMarketCodeFactorByCode,
  LoadUCPMarketCodeFactorByCode,
  LoadUCPMarketCodeFactorCodeList
} from './ucp-market-code-factor.action';

describe(' ucpMarketCodeFactorFacade Testing Suite', () => {
  const initialState: UcpMarketCodeFactorState = {
    ucpMarketCodeList: [],
    ucpMarketCode: null,
    isLoading: null,
    error: null,
    hasSaved: null,
    hasUpdated: null,
    totalElements: null,
    marketCode: [],
    ucpProductGroup: []
  };

  let ucpMarketCodeFactorFacade: UcpMarketCodeFactorFacade;
  let store: MockStore<UcpMarketCodeFactorFacade>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), UcpMarketCodeFactorFacade]
    });
    store = TestBed.inject<any>(Store);
    ucpMarketCodeFactorFacade = TestBed.inject<any>(UcpMarketCodeFactorFacade);
  });

  describe('Dispatch Actions action', () => {
    it('should call LOAD_UCP_MARKET_CODE_FACTOR_LISTING action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: UcpMarketCodeListPayload = {
        pageIndex: 1,
        pageSize: 10
      };
      const searchValue = undefined;
      const action = new LoadUCPMarketCodeFactorCodeList(payload);
      ucpMarketCodeFactorFacade.loadUcpMarketCodeFactorList(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LOAD_UCP_MARKET_CODE_FACTOR_BY_CODE action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload = '1';

      const action = new LoadUCPMarketCodeFactorByCode(payload);
      ucpMarketCodeFactorFacade.loadUcpMarketCodeFactorByCode(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call UPDATE_UCP_MARKET_CODE_FACTOR_BY_CODE action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: UpdateUcpMarketCodePayload = {
        data: {
          ucpFactor: 1
        },
        id: '1'
      };
      const action = new UpdateUCPMarketCodeFactorByCode(payload);
      ucpMarketCodeFactorFacade.updateUcpMarketCodeFactor(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call SAVE_UCP_MARKET_CODE_FACTOR action', () => {
      const saveUcpMarketCodePayload: SaveUcpMarketCodePayload = {
        marketCode: 'KA',
        markupFactor: 1,
        productGroupCode: '71'
      };
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new SaveUCPMarketCodeFactorCode(saveUcpMarketCodePayload);
      ucpMarketCodeFactorFacade.saveUcpMarketCodeFactor(
        saveUcpMarketCodePayload
      );
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LOAD_UCP_PRODUCT_CODE action', () => {
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new LoadUcpProductCode();
      ucpMarketCodeFactorFacade.loadUcpProductGroup();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call LOAD_MARKET_CODE action', () => {
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new LoadMarketCode();
      ucpMarketCodeFactorFacade.loadMarketCode();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LOAD_RESET action', () => {
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new LoadReset();
      ucpMarketCodeFactorFacade.loadReset();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
  });

  describe('Access Selector action', () => {
    it('should access the getIsloading selector action', () => {
      expect(ucpMarketCodeFactorFacade.getIsloading()).toEqual(
        ucpMarketCodeFactorFacade['isLoading$']
      );
    });

    it('should access the getTotalElements selector action', () => {
      expect(ucpMarketCodeFactorFacade.getTotalElements()).toEqual(
        ucpMarketCodeFactorFacade['totalElements$']
      );
    });

    it('should access the getUcpProductGroup selector action', () => {
      expect(ucpMarketCodeFactorFacade.getUcpProductGroup()).toEqual(
        ucpMarketCodeFactorFacade['ucpProductGroup$']
      );
    });

    it('should access the getMarketCode selector action', () => {
      expect(ucpMarketCodeFactorFacade.getMarketCode()).toEqual(
        ucpMarketCodeFactorFacade['marketCode$']
      );
    });

    it('should access the getHasSaved selector action', () => {
      expect(ucpMarketCodeFactorFacade.getHasSaved()).toEqual(
        ucpMarketCodeFactorFacade['hasSaved$']
      );
    });

    it('should access the getHasUpdated selector action', () => {
      expect(ucpMarketCodeFactorFacade.getHasUpdated()).toEqual(
        ucpMarketCodeFactorFacade['hasUpdated$']
      );
    });

    it('should access the getUcpMarketCodeFactor selector action', () => {
      expect(ucpMarketCodeFactorFacade.getUcpMarketCodeFactor()).toEqual(
        ucpMarketCodeFactorFacade['ucpMarketCodeFactor$']
      );
    });

    it('should access the getError selector action', () => {
      expect(ucpMarketCodeFactorFacade.getError()).toEqual(
        ucpMarketCodeFactorFacade['error$']
      );
    });
    it('should access the getUcpMarketCodeFactorList selector action', () => {
      expect(ucpMarketCodeFactorFacade.getUcpMarketCodeFactorList()).toEqual(
        ucpMarketCodeFactorFacade['ucpMarketCodeFactorList$']
      );
    });
  });
});
