import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  CustomErrors,
  F2MarginListPayload,
  F2MarginListResponse
} from '@poss-web/shared/models';

import {
  LoadReset,
  LoadF2MarginList,
  LoadF2MarginListSuccess,
  LoadF2MarginListFailure,
  F2MarginActionTypes
} from './f2-margin.action';

describe('F2MarginActionTypes  Action Testing Suite', () => {
  describe('LoadF2MarginList Action Test Cases', () => {
    it('should check correct type is used for  LoadF2MarginList action ', () => {
      const payload: F2MarginListPayload = {
        cfaCode: '71',
        pageIndex: 1,
        pageSize: 10
      };

      const action = new LoadF2MarginList(payload);
      expect({ ...action }).toEqual({
        type: F2MarginActionTypes.LOAD_F2_MARGIN_LIST,
        payload
      });
    });
    it('should check correct type is used for  LoadF2MarginListSuccess action ', () => {
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

      const action = new LoadF2MarginListSuccess(payload);

      expect({ ...action }).toEqual({
        type: F2MarginActionTypes.LOAD_F2_MARGIN_LIST_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadF2MarginListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadF2MarginListFailure(payload);

      expect({ ...action }).toEqual({
        type: F2MarginActionTypes.LOAD_F2_MARGIN_LIST_FAILURE,
        payload
      });
    });
  });

  describe('LoadReset Action Test Cases', () => {
    it('should check correct type is used for  LoadReset action ', () => {
      const action = new LoadReset();
      expect({ ...action }).toEqual({
        type: F2MarginActionTypes.LOAD_RESET
      });
    });
  });
});
