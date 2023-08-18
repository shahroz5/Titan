import {
  LoadWalkInDetailsForBusinessDay,
  LoadWalkInDetailsForBusinessDayFailure,
  LoadWalkInDetailsForBusinessDaySuccess,
  LoadSaveWalkInDetails,
  LoadSaveWalkInDetailsFailure,
  LoadSaveWalkInDetailsSuccess,
  LoadWalkInsHistoryData,
  LoadWalkInsHistoryDataFailure,
  LoadWalkInsHistoryDataSuccess,
  SetWalkInsCount,
  WalkInsRecordActionTypes,
  ClearValues
} from './walk-ins-record.actions';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  CustomErrors,
  SaveWalkInDetailsRequestPayload,
  WalkInsDetails,
  WalkInsDetailsHistoryResponse
} from '@poss-web/shared/models';

describe('Actions Testing Suite', () => {
  describe('SetWalkInsCount Action Test Cases', () => {
    it('should Set Walk Ins Count action ', () => {
      const action = new SetWalkInsCount(10);
      expect({ ...action }).toEqual({
        type: WalkInsRecordActionTypes.SET_WALK_INS_COUNT,
        payload: 10
      });
    });
  });
  describe('LoadWalkInDetailsForBusinessDay Action Test Cases', () => {
    it('should load conversion count action ', () => {
      const action = new LoadWalkInDetailsForBusinessDay({
        businessDate: 34323535353
      });
      expect({ ...action }).toEqual({
        type: WalkInsRecordActionTypes.LOAD_WALKIN_DETAILS,
        payload: { businessDate: 34323535353 }
      });
    });
    it('should check correct type is used for LoadWalkInDetailsForBusinessDaySuccess action ', () => {
      const action = new LoadWalkInDetailsForBusinessDaySuccess({
        date: 123456789,
        invoices: 10,
        purchasers: 8
      });
      expect({ ...action }).toEqual({
        type: WalkInsRecordActionTypes.LOAD_WALKIN_DETAILS_SUCCESS,
        payload: {
          date: 123456789,
          invoices: 10,
          purchasers: 8
        }
      });
    });
    it('should check correct type is used for  LoadWalkInDetailsForBusinessDayFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadWalkInDetailsForBusinessDayFailure(payload);
      expect({ ...action }).toEqual({
        type: WalkInsRecordActionTypes.LOAD_WALKIN_DETAILS_FAILURE,
        payload
      });
    });
  });

  describe('LoadWalkInsHistoryData Action Test Cases', () => {
    it('should load Walk-Ins History Data', () => {
      const action = new LoadWalkInsHistoryData();
      expect({ ...action }).toEqual({
        type: WalkInsRecordActionTypes.LOAD_WALK_INS_HISTORY_DATA
      });
    });
    it('should check correct type is used for LoadWalkInsHistoryDataSuccess action ', () => {
      const responsePayload: WalkInsDetailsHistoryResponse[] = [
        {
          businessDate: 123456789,
          noOfInvoice: 10,
          nonPurchaserCount: 9,
          purchaserCount: 1,
          walkins: 10
        }
      ];
      const action = new LoadWalkInsHistoryDataSuccess(responsePayload);
      expect({ ...action }).toEqual({
        type: WalkInsRecordActionTypes.LOAD_WALK_INS_HISTORY_DATA_SUCCESS,
        payload: responsePayload
      });
    });
    it('should check correct type is used for  LoadWalkInsHistoryDataFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadWalkInsHistoryDataFailure(payload);
      expect({ ...action }).toEqual({
        type: WalkInsRecordActionTypes.LOAD_WALK_INS_HISTORY_DATA_FAILURE,
        payload
      });
    });
  });

  describe('LoadSaveWalkInDetails Action Test Cases', () => {
    it('should check correct type is used for LoadSaveWalkInDetails action ', () => {
      const mockRequestPayload: SaveWalkInDetailsRequestPayload = {
        businessDate: 123456789,
        walkins: 10,
        noOfInvoice: 10,
        nonPurchaserCount: 2,
        purchaserCount: 8
      };
      const action = new LoadSaveWalkInDetails(mockRequestPayload);
      expect({ ...action }).toEqual({
        type: WalkInsRecordActionTypes.LOAD_SAVE_WALK_IN_DETAILS,
        payload: mockRequestPayload
      });
    });
    it('should check correct type is used for LoadSaveWalkInDetailsSuccess action ', () => {
      const walkInsDetailsResponse: WalkInsDetails = {
        businessDate: 123456789,
        walkins: 10,
        noOfInvoice: 10,
        nonPurchaserCount: 2,
        purchaserCount: 8
      };
      const action = new LoadSaveWalkInDetailsSuccess(walkInsDetailsResponse);
      expect({ ...action }).toEqual({
        type: WalkInsRecordActionTypes.LOAD_SAVE_WALK_IN_DETAILS_SUCCESS,
        payload: walkInsDetailsResponse
      });
    });
    it('should check correct type is used for  LoadSaveWalkInDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadSaveWalkInDetailsFailure(payload);
      expect({ ...action }).toEqual({
        type: WalkInsRecordActionTypes.LOAD_SAVE_WALK_IN_DETAILS_FAILURE,
        payload
      });
    });
  });
  describe('ClearValues Action Test Cases', () => {
    it('should Clear Walk-in details', () => {
      const action = new ClearValues();
      expect({ ...action }).toEqual({
        type: WalkInsRecordActionTypes.CLEAR_VALUES
      });
    });
  });
});
