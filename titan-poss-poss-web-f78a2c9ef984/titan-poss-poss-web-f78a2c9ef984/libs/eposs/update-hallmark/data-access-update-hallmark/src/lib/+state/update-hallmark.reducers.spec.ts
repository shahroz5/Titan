import {
  CustomErrors,
  StockReceiveUpdateItemFailurePayload
} from '@poss-web/shared/models';

import * as moment from 'moment';
import { Moment } from 'moment';
import * as actions from './update-hallmark.action';
import { Action } from '@ngrx/store';
import {
  initialBoutiqueStatisticsState,
  InStockReducer
} from './update-hallmark.reducers';
import { InStockState } from './update-hallmark.state';
import { itemAdapter } from './update-hallmark.entity';

describe('Instockreducer Testing Suite', () => {
  const testState = initialBoutiqueStatisticsState;

  const HistoryPayload: actions.LoadBinHistoryPayload = {
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

  const customError: CustomErrors = {
    code: 'C',
    message: 'M',
    traceId: 'T',
    timeStamp: 'TS',
    error: {
      name: 'N',
      message: 'M',
      stack: 'S'
    }
  };

  describe('Actions should load state properly', () => {
    beforeEach(() => {});
    it('LoadBinCodesSuccess', () => {
      const bincodes = null;
      const action = new actions.LoadBinCodesSuccess(bincodes);

      const result: InStockState = InStockReducer(testState, action);

      expect(result.isLoading).toBe(false);
      expect(result.binCodes).toBe(null);
    });

    it('LoadBinCodes', () => {
      const action = new actions.LoadBinCodes();
      const result: InStockState = InStockReducer(testState, action);

      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });

    it('LoadBinCodesFailure', () => {
      const customErrorData: CustomErrors = {
        code: 'C',
        message: 'M',
        traceId: 'T',
        timeStamp: 'TS',
        error: {
          name: 'N',
          message: 'M',
          stack: 'ST'
        }
      };
      const action = new actions.LoadBinCodesFailure(customErrorData);
      const result: InStockState = InStockReducer(testState, action);
      expect(result.isLoading).toBe(false);
      expect(result.error).toEqual(customErrorData);
    });
  });

  describe('Actions should load Bin hISTORYstate properly', () => {
    beforeEach(() => {});
    it('LoadBinHistorySuccess', () => {
      const bincodes = {
        count: 0,
        items: []
      };
      const action = new actions.LoadBinHistorySuccess(bincodes);

      const result: InStockState = InStockReducer(testState, action);

      expect(result.isLoading).toBe(false);
    });

    it('LoadBinHistory', () => {
      const action = new actions.LoadBinHistory(HistoryPayload);
      const result: InStockState = InStockReducer(testState, action);

      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });

    it('LoadBinHistoryFailure', () => {
      const customErrorData: CustomErrors = {
        code: 'C',
        message: 'M',
        traceId: 'T',
        timeStamp: 'TS',
        error: {
          name: 'N',
          message: 'M',
          stack: 'ST'
        }
      };
      const action = new actions.LoadBinHistoryFailure(customErrorData);
      const result: InStockState = InStockReducer(testState, action);
      expect(result.isLoading).toBe(false);
      expect(result.binHistoryError).toEqual(customErrorData);
    });
  });

  describe('Actions should load countstate properly', () => {
    beforeEach(() => {});
    it('LoadCountSuccess', () => {
      const bincodes = 0;
      const action = new actions.LoadCountSuccess(bincodes);

      const result: InStockState = InStockReducer(testState, action);

      expect(result.error).toBe(null);
      expect(result.binCodeCount).toBe(0);
    });

    it('Loadcounts', () => {
      const action = new actions.LoadCount();
      const result: InStockState = InStockReducer(testState, action);

      expect(result.hasRequestedFailure).toBe(null);
      expect(result.error).toBe(null);
    });

    it('LoadBinCodesFailure', () => {
      const customErrorData: CustomErrors = {
        code: 'C',
        message: 'M',
        traceId: 'T',
        timeStamp: 'TS',
        error: {
          name: 'N',
          message: 'M',
          stack: 'ST'
        }
      };
      const action = new actions.LoadCountFailure(customErrorData);
      const result: InStockState = InStockReducer(testState, action);

      expect(result.error).toEqual(customErrorData);
    });
  });

  describe('Actions should Requested Bin state properly', () => {
    beforeEach(() => {});
    it('Requested BinSuccess', () => {
      const bincodes = null;
      const action = new actions.RequestedBinSuccess(bincodes);

      const result: InStockState = InStockReducer(testState, action);

      expect(result.isLoading).toBe(false);
      expect(result.isRequestedBinSuccess).toBe(true);
    });

    it('Requested Bin', () => {
      const payload = {
        bin: ' string;',
        remarks: 'string;'
      };

      const action = new actions.RequestedBin(payload);
      const result: InStockState = InStockReducer(testState, action);

      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });

    it('LoadBinCodesFailure', () => {
      const customErrorData: CustomErrors = {
        code: 'C',
        message: 'M',
        traceId: 'T',
        timeStamp: 'TS',
        error: {
          name: 'N',
          message: 'M',
          stack: 'ST'
        }
      };
      const action = new actions.RequestedBinFailure(customErrorData);
      const result: InStockState = InStockReducer(testState, action);
      expect(result.isLoading).toBe(false);
      expect(result.error).toEqual(customErrorData);
    });
  });
  describe('Actions should Reset Bin state properly', () => {
    beforeEach(() => {});
    it('Reset', () => {
      const action = new actions.RESETBINHISTORY();
      const result: InStockState = InStockReducer(testState, action);

      expect(result.isLoading).toBe(false);
      expect(result.error).toBe(null);
    });

    it('Reset Bin', () => {
      const payload = {
        bin: ' string;',
        remarks: 'string;'
      };

      const action = new actions.ResetBinCodes();
      const result: InStockState = InStockReducer(testState, action);

      expect(result.isLoading).toBe(false);
      expect(result.error).toBe(null);
    });

    it('Reset No', () => {
      const action = new actions.ResetDocNo();
      const result: InStockState = InStockReducer(testState, action);

      expect(result.isLoading).toBe(false);
      expect(result.error).toBe(null);
    });

    // it('RESET_FILTER', () => {
    //   const action = new actions.RESETFILTER();
    //   const result: InStockState = InStockReducer(testState, action);

    //   expect(result.advancedFilter).toBe(testState.advancedFilter);
    // });

    it('Load HstoryData', () => {
      const payload = {
        startDate: 7899,
        endDate: 9999,
        reqFiscalYear: null,
        statuses: ['APPROVED']
      };

      const action = new actions.LoadHistoryFilterData(payload);
      const result: InStockState = InStockReducer(testState, action);

      expect(result.advancedFilter).toBe(payload);
      expect(result.error).toBe(null);
    });
    // it('initialBoutiqueStatisticsState', () => {
    //   const result: InStockState = InStockReducer(testState, null);

    //   expect(result).toBe({
    //     binCodes: [],
    //     binRequestResponse: null,
    //     hasRequestedFailure: false,
    //     docNo: 0,
    //     error: null,
    //     loaded: false,
    //     isLoading: false,
    //     isBinCodeReset: false,
    //     isDocNoReset: false,
    //     binCodeCount: 0,
    //     isRequestedBinSuccess: false,
    //     isRequestingBin: false,

    //     binHistoryResponse: itemAdapter.getInitialState(),
    //     isHistoryLoading: false,
    //     binHistoryCount: 0,
    //     binHistoryError: null,
    //     searchBinHistory: itemAdapter.getInitialState(),
    //     isSearchHistoryLoading: false,
    //     searchHistoryError: null,
    //     advancedFilter: {
    //       startDate: moment().startOf('day').valueOf(),
    //       endDate: moment().endOf('day').valueOf(),
    //       reqFiscalYear: null,
    //       statuses: []
    //     }
    //   });
    // });
  });
});
