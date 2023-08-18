// Actions are not containing any business logic so this provides less value to
// test. They are only used to trigger a reducer or an effect, which is already
// covered by type-safety by using Typescript. You might anyway want to write tests
// for your action dispatchers for the sake of enforcing a specific coverage level
// and “double checking” that the right action is being dispatched.
import {
  LoadBinCodesPayload,
  LoadBinHistoryPayload,
  LoadBinCodes,
  RESETFILTER,
  LoadHistoryFilterData,
  RESETBINHISTORY,
  LoadBinCodesSuccess,
  LoadBinCodesFailure,
  LoadBinHistory,
  LoadBinHistorySuccess,
  LoadBinHistoryFailure,
  ResetBinCodes,
  ResetDocNo,
  LoadCount,
  LoadCountSuccess,
  LoadCountFailure,
  RequestedBin,
  RequestedBinSuccess,
  RequestedBinFailure,
  InStockActionTypes,
  ResetError
} from './in-stock.action';

import { CustomErrors } from '@poss-web/shared/models';

import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

describe('Bin Listing Action Testing Suite', () => {
  describe('Bin Listing Action   Action Test Cases', () => {
    it('Bin Listing Count action ', () => {
      const action = new LoadBinCodes();

      expect({ ...action }).toEqual({
        type: InStockActionTypes.LOAD_BINCODES
      });
    });
    it('should check correct type is used for  Load  Success action ', () => {
      const payload = null;
      const action = new LoadBinCodesSuccess(payload);

      expect({ ...action }).toEqual({
        type: InStockActionTypes.LOAD_BINCODES_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  Load  BinRequestApprovals CountFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadBinCodesFailure(payload);

      expect({ ...action }).toEqual({
        type: InStockActionTypes.LOAD_BINCODES_FAILURE,
        payload
      });
    });
  });

  describe('Bin Listing Action   Action Test Cases', () => {
    it('Bin Listing Count action ', () => {
      const action = new LoadCount();

      expect({ ...action }).toEqual({
        type: InStockActionTypes.LOAD_COUNT
      });
    });
    it('should check correct type is used for  Load  Success action ', () => {
      const payload = null;
      const action = new LoadCountSuccess(payload);

      expect({ ...action }).toEqual({
        type: InStockActionTypes.LOAD_COUNT_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  Load  BinRequestApprovals CountFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadCountFailure(payload);

      expect({ ...action }).toEqual({
        type: InStockActionTypes.LOAD_COUNT_FAILURE,
        payload
      });
    });
  });

  describe('Bin Listing Action   Action Test Cases', () => {
    it('Bin Listing Count action ', () => {
      const payload = {
        bin: 'string',
        remarks: 'string'
      };
      const action = new RequestedBin(payload);

      expect({ ...action }).toEqual({
        type: InStockActionTypes.REQUESTED_BIN,
        payload
      });
    });
    it('should check correct type is used for  Load  Success action ', () => {
      const payload = null;
      const action = new RequestedBinSuccess(payload);

      expect({ ...action }).toEqual({
        type: InStockActionTypes.REQUESTED_BIN_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  Load  BinRequestApprovals CountFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new RequestedBinFailure(payload);

      expect({ ...action }).toEqual({
        type: InStockActionTypes.REQUESTED_BIN_FAILURE,
        payload
      });
    });
  });

  describe('Bin History Action   Action Test Cases', () => {
    it('Bin History action ', () => {
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
      const action = new LoadBinHistory(payload);

      expect({ ...action }).toEqual({
        type: InStockActionTypes.LOAD_BIN_HISTORY,
        payload
      });
    });
    it('should check correct type is used for  Load  Success action ', () => {
      const payload = null;
      const action = new LoadBinHistorySuccess(payload);

      expect({ ...action }).toEqual({
        type: InStockActionTypes.LOAD_BIN_HISTORY_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  Load  BinRequestApprovals CountFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadBinHistoryFailure(payload);

      expect({ ...action }).toEqual({
        type: InStockActionTypes.LOAD_BIN_HISTORY_FAILURE,
        payload
      });
    });
  });

  describe('Reset  Action Test Cases', () => {
    it('should check correct type is used for  Reset Bncodesaction ', () => {
      const action = new ResetBinCodes();

      expect({ ...action }).toEqual({
        type: InStockActionTypes.RESET_BINCODES
      });
    });
    it('should check correct type is used for  Reset Bncodesaction ', () => {
      const action = new ResetDocNo();

      expect({ ...action }).toEqual({
        type: InStockActionTypes.RESET_DOCUMENT_NO
      });
    });
    it('should check correct type is used for  Reset Bncodesaction ', () => {
      const payload = {
        startDate: 8909,
        endDate: 8909,
        reqFiscalYear: 2020,
        statuses: ['jj']
      };

      const action = new LoadHistoryFilterData(payload);

      expect({ ...action }).toEqual({
        type: InStockActionTypes.LOAD_HISTORY_FILTER_DATA,
        payload
      });
    });
    it('should check correct type is used for  Reset Bncodesaction ', () => {
      const action = new ResetError();

      expect({ ...action }).toEqual({
        type: InStockActionTypes.RESET_ERROR
      });
    });
    it('should check correct type is used for  Reset Bncodesaction ', () => {
      const action = new RESETBINHISTORY();

      expect({ ...action }).toEqual({
        type: InStockActionTypes.RESET_BINHISTORY
      });
    });
    it('should check correct type is used for  Reset Bncodesaction ', () => {
      const payload = 123450000;
      const action = new RESETFILTER(payload);

      expect({ ...action }).toEqual({
        type: InStockActionTypes.RESET_FILTER,
        payload
      });
    });
  });
});
