import * as actions from './in-stock.action';

import { Store } from '@ngrx/store';
import { InStockState } from './in-stock.state';
import { TestBed, inject } from '@angular/core/testing';
import { InStockFacade } from './in-stock.facade';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { itemAdapter } from './in-stock.entity';
import * as moment from 'moment';

describe('Stock Receive facade Testing Suite action', () => {
  const initialState: InStockState = {
    binCodes: [],
    binRequestResponse: null,
    hasRequestedFailure: false,
    docNo: 0,
    error: null,
    loaded: false,
    isLoading: false,
    isBinCodeReset: false,
    isDocNoReset: false,
    binCodeCount: 0,
    isRequestedBinSuccess: false,
    isRequestingBin: false,

    binHistoryResponse: itemAdapter.getInitialState(),
    isHistoryLoading: false,
    binHistoryCount: 0,
    binHistoryError: null,
    searchBinHistory: itemAdapter.getInitialState(),
    isSearchHistoryLoading: false,
    searchHistoryError: null,
    advancedFilter: {
      startDate: moment().startOf('day').valueOf(),
      endDate: moment().endOf('day').valueOf(),
      reqFiscalYear: null,
      statuses: []
    }
  };

  let stockFacade: InStockFacade;
  /*
 | LoadPendingFactorySTN
  | LoadPendingFactorySTNSuccess
  | LoadPendingFactorySTNFailure
*/

  let store: MockStore<InStockState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), InStockFacade]
    });

    stockFacade = TestBed.inject(InStockFacade);
    store = TestBed.inject<any>(Store);
  });

  // describe(' Pending Factory STN action', () => {
  //   it('should call load pending factory stn action', inject(
  //     [Store],
  //     store => {
  //       const parameters: StockReceiveLoadPendingPayload = {
  //         pageIndex: 0,
  //         pageSize: 100
  //       };
  //       const storeSpy = spyOn(store, 'dispatch').and.callThrough();
  //       const expectedAction = new LoadPendingFactorySTN(parameters);
  //       stockReceiveFacade.loadPendingFactorySTN(parameters);
  //       expect(storeSpy).toHaveBeenCalledWith(expectedAction);
  //     }
  //   ));
  // });

  describe('Dispatch Actions action', () => {
    it('should call loadBinCodes()', () => {
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new actions.LoadBinCodes();
      stockFacade.loadBinCodes();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call  resetBinCodes()', () => {
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new actions.ResetBinCodes();
      stockFacade.resetBinCodes();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call resetDocNo()', () => {
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new actions.ResetDocNo();
      stockFacade.resetDocNo();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call resetDocNo()', () => {
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new actions.ResetDocNo();
      stockFacade.resetDocNo();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call  resetHistory() ', () => {
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new actions.RESETBINHISTORY();
      stockFacade.resetHistory();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call  resetFilter()', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload = 123450000;
      const action = new actions.RESETFILTER(payload);
      stockFacade.resetFilter(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call  loadbinCodesCount() ', () => {
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new actions.LoadCount();
      stockFacade.loadbinCodesCount();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call  requestedBin(requestBin: BinRequestDto)  ', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const requestBin = {
        bin: 'abc',
        remarks: 'dd'
      };
      const action = new actions.RequestedBin(requestBin);
      stockFacade.requestedBin(requestBin);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call  loadBinHistory', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload = {
        historyRequestBinDto: {
          dateRangeType: 'CUSTOM',
          endDate: 9999,
          reqDocNo: 99,
          reqFiscalYear: 2020,
          startDate: 4555,
          binGroupCode: 'y',
          binName: 'ii',

          statuses: ['jj']
        },
        page: 9,
        size: 10
      };
      const action = new actions.LoadBinHistory(payload);
      stockFacade.loadBinHistory(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call   loadHistoryFilterData', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload = {
        startDate: 8909,
        endDate: 8909,
        reqFiscalYear: 2020,
        statuses: ['jj']
      };
      const action = new actions.LoadHistoryFilterData(payload);
      stockFacade.loadHistoryFilterData(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should access the  getHistoryFilterData() selector action', () => {
      expect(stockFacade.getHistoryFilterData()).toEqual(
        stockFacade['historyFilterData$']
      );
    });

    it('should access the    getBinCodes() selector action', () => {
      expect(stockFacade.getBinCodes()).toEqual(stockFacade['binCodes$']);
    });
    it('should access the    getError() selector action', () => {
      expect(stockFacade.getError()).toEqual(stockFacade['hasError$']);
    });
    it('should access the getBinHistory() selector action', () => {
      expect(stockFacade.getBinHistory()).toEqual(stockFacade['binHistory$']);
    });
    it('should access the getBinHistoryCount() selector action', () => {
      expect(stockFacade.getBinHistoryCount()).toEqual(
        stockFacade['binHistoryCount$']
      );
    });
    it('should access the  getHistoryFilterData() selector action', () => {
      expect(stockFacade.getHistoryFilterData()).toEqual(
        stockFacade['historyFilterData$']
      );
    });
    it('should access the   getHistoryError()  selector action', () => {
      expect(stockFacade.getHistoryError()).toEqual(
        stockFacade['binHistoryError$']
      );
    });
    it('should access the  getHistoryLoading()  selector action', () => {
      expect(stockFacade.getHistoryLoading()).toEqual(
        stockFacade['historyLoading$']
      );
    });
    it('should access the   getIsLoading()  selector action', () => {
      expect(stockFacade.getIsLoading()).toEqual(stockFacade['isLoading$']);
    });
    it('should access the  getHistoryCount() selector action', () => {
      expect(stockFacade.getHistoryCount()).toEqual(
        stockFacade['binHistoryCount$']
      );
    });
    it('should access the   getIsBinCodeReset() selector action', () => {
      expect(stockFacade.getIsBinCodeReset()).toEqual(
        stockFacade['isBinCodeReset$']
      );
    });
    it('should access the  getIsDocNoReset()selector action', () => {
      expect(stockFacade.getIsDocNoReset()).toEqual(
        stockFacade['isDocNoReset$']
      );
    });
    it('should access the   getIsLoaded()  selector action', () => {
      expect(stockFacade.getIsLoaded()).toEqual(stockFacade['isLoaded$']);
    });
    it('should access the  getbinCodesCount() selector action', () => {
      expect(stockFacade.getbinCodesCount()).toEqual(
        stockFacade['binCodesCount$']
      );
    });
    it('should access the   getRequestBin() selector action', () => {
      expect(stockFacade.getRequestBin()).toEqual(stockFacade['requestedBin$']);
    });
    it('should access the  getIsRequestBinSuccess()selector action', () => {
      expect(stockFacade.getIsRequestBinSuccess()).toEqual(
        stockFacade['isRequestBinSuccess$']
      );
    });
    it('should access the   getIsRequestingBin()  selector action', () => {
      expect(stockFacade.getIsRequestingBin()).toEqual(
        stockFacade['isRequestingBin$']
      );
    });
  });
});
