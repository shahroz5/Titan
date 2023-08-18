//you should simply assert that you get the right state given the provided inputs.

import * as actions from './cn-direct.action';

import {
  SearchPayloadReq,
  CnListRes,
  UploadCNPayloadReq,
  SaveCnActionPayload
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { cnDirectReducer, initialState } from './cn-direct.reducer';
import { CnDirectState } from './cn-direct.state';

describe('cnDirectReducer  Testing Suite', () => {
  const testState = initialState;

  describe('Testing SearchCnDirectList ', () => {
    beforeEach(() => {});

    it('Load SearchCnDirectList should set the isLoading to true', () => {
      const payload: SearchPayloadReq = {
        fiscalYear: '2020',
        cnNumber: 11,
        locationCode: 'CPD',
        pageEvent: {
          page: 0,
          size: 10
        }
      };
      const action = new actions.SearchCnDirectList(payload);

      const result: CnDirectState = cnDirectReducer(testState, action);

      expect(result.isLoading).toBe(true);
    });
    it('SearchCnDirectListSuccess should set  isLoading false', () => {
      const payload: CnListRes = {
        cnList: [],
        totalElements: 0
      };

      const action = new actions.SearchCnDirectListSuccess(payload);

      const result: CnDirectState = cnDirectReducer(initialState, action);

      expect(result.isLoading).toBe(false);
    });
    it('LoadCnApprovalsListFailure should return error', () => {
      const action = new actions.SearchCnDirectListFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CnDirectState = cnDirectReducer(testState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing UploadCn ', () => {
    beforeEach(() => {});
    it('Load UploadCn should set the isLoading to true', () => {
      const payload: UploadCNPayloadReq = {
        file: null,
        pageEvent: {
          page: 1,
          size: 10
        }
      };
      const action = new actions.UploadCn(payload);

      const result: CnDirectState = cnDirectReducer(testState, action);

      expect(result.isLoading).toBe(true);
    });
    it('UploadCnSuccess should return cn  request list and isLoading false', () => {
      const payload: CnListRes = {
        cnList: [],
        totalElements: 0
      };

      const action = new actions.UploadCnSuccess(payload);

      const result: CnDirectState = cnDirectReducer(initialState, action);

      expect(result.isLoading).toBe(false);
    });
    it('UploadCnFailure should return error', () => {
      const action = new actions.UploadCnFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CnDirectState = cnDirectReducer(testState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing SaveCnDirectAction ', () => {
    beforeEach(() => {});
    it('Load SaveCnDirectAction should set the isLoading to true', () => {
      const payload: SaveCnActionPayload = {
        cnIds: ['1'],
        operation: 'SUSPEND'
      };
      const action = new actions.SaveCnDirectAction(payload);

      const result: CnDirectState = cnDirectReducer(testState, action);

      expect(result.isLoading).toBe(true);
    });
    it('SaveCnDirectActionSuccess should return cn  request list and isLoading false', () => {
      const payload = ['1', '2'];

      const action = new actions.SaveCnDirectActionSuccess(payload);

      const result: CnDirectState = cnDirectReducer(initialState, action);

      expect(result.isLoading).toBe(false);
    });
    it('SaveCnDirectActionFailure should return error', () => {
      const action = new actions.SaveCnDirectActionFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CnDirectState = cnDirectReducer(testState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadReset ', () => {
    beforeEach(() => {});
    it('LoadReset should reset the store', () => {
      const action = new actions.LoadReset();

      const result: CnDirectState = cnDirectReducer(
        initialState,

        action
      );

      expect(result).toEqual(initialState);
    });
  });
});
