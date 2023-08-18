import { WalkInsRecordState } from './walk-ins-record.state';
import { initialState, WalkInsRecordReducer } from './walk-ins-record.reducer';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import * as actions from './walk-ins-record.actions';
import {
  SaveWalkInDetailsRequestPayload,
  WalkInsCustomerVisitDetails,
  WalkInsDetails,
  WalkInsDetailsHistoryResponse
} from '@poss-web/shared/models';

describe('WalkinsRecord reducer Testing Suite', () => {
  describe('Testing Load Walk-In Details Functionality', () => {
    beforeEach(() => {});
    it('Testing LOAD_WALKIN_DETAILS', () => {
      const action = new actions.LoadWalkInDetailsForBusinessDay({
        businessDate: 123456789
      });
      const result: WalkInsRecordState = WalkInsRecordReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(true);
      expect(result.errors).toBe(null);
    });
    it('LOAD_WALKIN_DETAILS_SUCCESS should get Walk-Ins Details', () => {
      const responsePayload: WalkInsCustomerVisitDetails = {
        date: 123456789,
        invoices: 10,
        purchasers: 1
      };
      const action = new actions.LoadWalkInDetailsForBusinessDaySuccess(
        responsePayload
      );
      const result: WalkInsRecordState = WalkInsRecordReducer(
        initialState,
        action
      );
      expect(result.walkInsDate).toBe(action.payload.date);
      expect(result.purchasersCount).toBe(action.payload.purchasers);
      expect(result.numberOfInvoices).toBe(action.payload.invoices);
      expect(result.errors).toBe(null);
      expect(result.isLoading).toBe(false);
    });
    it('LOAD_WALKIN_DETAILS_FAILURE should return error', () => {
      const action = new actions.LoadWalkInDetailsForBusinessDayFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: WalkInsRecordState = WalkInsRecordReducer(
        initialState,
        action
      );
      expect(result.walkInsDate).toEqual(null);
      expect(result.purchasersCount).toEqual(0);
      expect(result.numberOfInvoices).toEqual(0);
      expect(result.errors).toEqual(action.payload);
      expect(result.isLoading).toEqual(false);
    });
  });

  describe('Testing Load Walk-Ins History Data Functionality', () => {
    beforeEach(() => {});
    it('Testing LOAD_WALK_INS_HISTORY_DATA', () => {
      const action = new actions.LoadWalkInsHistoryData();
      const result: WalkInsRecordState = WalkInsRecordReducer(
        initialState,
        action
      );
      expect(result.walkInsHistoryData).toBe(null);
      expect(result.isLoading).toBe(true);
      expect(result.errors).toBe(null);
    });
    it('LOAD_WALK_INS_HISTORY_DATA_SUCCESS should get Walk-Ins History Data', () => {
      const responsePayload: WalkInsDetailsHistoryResponse[] = [
        {
          businessDate: 123456789,
          noOfInvoice: 10,
          nonPurchaserCount: 9,
          purchaserCount: 1,
          walkins: 10
        }
      ];
      const action = new actions.LoadWalkInsHistoryDataSuccess(responsePayload);
      const result: WalkInsRecordState = WalkInsRecordReducer(
        initialState,
        action
      );
      expect(result.walkInsHistoryData).toBe(action.payload);
      expect(result.errors).toBe(null);
      expect(result.isLoading).toBe(false);
    });
    it('LOAD_WALK_INS_HISTORY_DATA_FAILURE should return error', () => {
      const action = new actions.LoadWalkInsHistoryDataFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: WalkInsRecordState = WalkInsRecordReducer(
        initialState,
        action
      );
      expect(result.walkInsHistoryData).toEqual(null);
      expect(result.errors).toEqual(action.payload);
      expect(result.isLoading).toEqual(false);
    });
  });

  describe('Testing Load Save Walk In Details Functionality', () => {
    beforeEach(() => {});
    it('Testing LOAD_SAVE_WALK_IN_DETAILS', () => {
      const requestPayload: SaveWalkInDetailsRequestPayload = {
        businessDate: 123456789,
        walkins: 10,
        noOfInvoice: 10,
        nonPurchaserCount: 2,
        purchaserCount: 8
      };
      const action = new actions.LoadSaveWalkInDetails(requestPayload);
      const result: WalkInsRecordState = WalkInsRecordReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(true);
      expect(result.errors).toBe(null);
    });
    it('LOAD_SAVE_WALK_IN_DETAILS_SUCCESS should update saveWalkInDetailsResponse field in state', () => {
      const saveWalkInsDetailsResponse: WalkInsDetails = {
        businessDate: 123456789,
        walkins: 10,
        noOfInvoice: 10,
        nonPurchaserCount: 2,
        purchaserCount: 8
      };
      const action = new actions.LoadSaveWalkInDetailsSuccess(
        saveWalkInsDetailsResponse
      );
      const result: WalkInsRecordState = WalkInsRecordReducer(
        initialState,
        action
      );
      expect(result.saveWalkInDetailsResponse).toBe(saveWalkInsDetailsResponse);
    });
    it('LOAD_SAVE_WALK_IN_DETAILS_FAILURE should return error', () => {
      const action = new actions.LoadSaveWalkInDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: WalkInsRecordState = WalkInsRecordReducer(
        initialState,
        action
      );
      expect(result.errors.message).toEqual('some error');
    });
  });

  it('SET_WALK_INS_COUNT should set Walk ins count field in state', () => {
    const action = new actions.SetWalkInsCount(10);
    const result: WalkInsRecordState = WalkInsRecordReducer(
      initialState,
      action
    );
    expect(result.walkInsCount).toBe(10);
    expect(result.errors).toBe(null);
    expect(result.isLoading).toBe(false);
  });

  it('CLEAR_VALUES should clear Walk-in details in state', () => {
    const action = new actions.ClearValues();
    const result: WalkInsRecordState = WalkInsRecordReducer(
      initialState,
      action
    );

    expect(result.errors).toBe(null);
    expect(result.isLoading).toBe(false);

    expect(result.purchasersCount).toBe(0);
    expect(result.walkInsCount).toBe(null);
    expect(result.numberOfInvoices).toBe(0);
    expect(result.walkInsDate).toBe(null);
  });

  it('RESET_VALUES should reset all fields in state', () => {
    const action = new actions.ResetValues();
    const result: WalkInsRecordState = WalkInsRecordReducer(
      initialState,
      action
    );

    expect(result.errors).toBe(null);
    expect(result.isLoading).toBe(false);

    expect(result.purchasersCount).toBe(0);
    expect(result.walkInsCount).toBe(null);
  });
});
