//you should simply assert that you get the right state given the provided inputs.

import * as actions from './f2-margin.action';

import {
  F2MarginListPayload,
  F2MarginListResponse
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { f2MarginReducer, initialState } from './f2-margin.reducer';
import { F2MarginState } from './f2-margin.state';

describe('f2MarginReducer  Testing Suite', () => {
  const testState = initialState;

  describe('Testing LoadF2MarginList ', () => {
    beforeEach(() => {});
    it('Load LoadF2MarginList should set the isLoading to true', () => {
      const payload: F2MarginListPayload = {
        cfaCode: '71',
        pageIndex: 1,
        pageSize: 10
      };
      const action = new actions.LoadF2MarginList(payload);

      const result: F2MarginState = f2MarginReducer(testState, action);

      expect(result.isLoading).toBe(true);
    });
    it('LoadF2MarginListSuccess should return list of f2 margin list and isLoading false', () => {
      const payload: F2MarginListResponse = {
        f2MarginList: [
          {
            id: '1',
            cfa: '71',
            f1From: 1,
            f1To: 2,
            stoneBandFrom: 1,
            stoneBandTo: 2,
            margin: 1
          }
        ],
        totalElements: 1
      };

      const action = new actions.LoadF2MarginListSuccess(payload);

      const result: F2MarginState = f2MarginReducer(initialState, action);

      expect(result.isLoading).toBe(false);
    });
    it('LoadF2MarginListFailure should return error', () => {
      const action = new actions.LoadF2MarginListFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: F2MarginState = f2MarginReducer(testState, action);

      expect(result.error.message).toEqual('some error');
    });

    describe('Testing LoadReset ', () => {
      beforeEach(() => {});
      it('LoadReset should reset the store', () => {
        const action = new actions.LoadReset();

        const result: F2MarginState = f2MarginReducer(
          initialState,

          action
        );

        expect(result).toEqual(initialState);
      });
    });
  });
});
