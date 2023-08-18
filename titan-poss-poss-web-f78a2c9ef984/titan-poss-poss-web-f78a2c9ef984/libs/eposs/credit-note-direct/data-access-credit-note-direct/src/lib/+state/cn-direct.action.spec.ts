import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  CustomErrors,
  SearchPayloadReq,
  CnListRes,
  SaveCnActionPayload,
  UploadCNPayloadReq
} from '@poss-web/shared/models';

import {
  LoadReset,
  SearchCnDirectList,
  SearchCnDirectListSuccess,
  SearchCnDirectListFailure,
  SaveCnDirectAction,
  SaveCnDirectActionSuccess,
  SaveCnDirectActionFailure,
  CNDirectActionTypes,
  UploadCnSuccess,
  UploadCn,
  UploadCnFailure
} from './cn-direct.action';

describe('CnDirectActions  Action Testing Suite', () => {
  describe('SearchCnDirectList Action Test Cases', () => {
    it('should check correct type is used for  SearchCnDirectList action ', () => {
      const payload: SearchPayloadReq = {
        fiscalYear: '2020',
        cnNumber: 11,
        locationCode: 'CPD',
        pageEvent: {
          page: 0,
          size: 10
        }
      };

      const action = new SearchCnDirectList(payload);
      expect({ ...action }).toEqual({
        type: CNDirectActionTypes.SEARCH_CN_DIRECT_LIST,
        payload
      });
    });
    it('should check correct type is used for  SearchCnDirectListSuccess action ', () => {
      const payload: CnListRes = {
        cnList: [],
        totalElements: 0
      };

      const action = new SearchCnDirectListSuccess(payload);

      expect({ ...action }).toEqual({
        type: CNDirectActionTypes.SEARCH_CN_DIRECT_LIST_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  SearchCnDirectListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SearchCnDirectListFailure(payload);
      expect({ ...action }).toEqual({
        type: CNDirectActionTypes.SEARCH_CN_DIRECT_LIST_FAILURE,
        payload
      });
    });
  });

  describe('UploadCn Action Test Cases', () => {
    it('should check correct type is used for  UploadCn action ', () => {
      const payload: UploadCNPayloadReq = {
        file: null,
        pageEvent: {
          page: 1,
          size: 10
        }
      };

      const action = new UploadCn(payload);
      expect({ ...action }).toEqual({
        type: CNDirectActionTypes.UPLOAD_CN,
        payload
      });
    });
    it('should check correct type is used for  UploadCnSuccess action ', () => {
      const payload: CnListRes = {
        cnList: [],
        totalElements: 0
      };

      const action = new UploadCnSuccess(payload);

      expect({ ...action }).toEqual({
        type: CNDirectActionTypes.UPLOAD_CN_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  UploadCnFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new UploadCnFailure(payload);

      expect({ ...action }).toEqual({
        type: CNDirectActionTypes.UPLOAD_CN_FAILURE,
        payload
      });
    });
  });
  describe('SaveCnDirectAction Action Test Cases', () => {
    it('should check correct type is used for  SaveCnDirectAction action ', () => {
      const payload: SaveCnActionPayload = {
        cnIds: ['1'],
        operation: 'SUSPEND'
      };

      const action = new SaveCnDirectAction(payload);
      expect({ ...action }).toEqual({
        type: CNDirectActionTypes.SAVE_CN_DIRECT_ACTION,
        payload
      });
    });
    it('should check correct type is used for  SaveCnDirectActionSuccess action ', () => {
      const payload = ['1', '2'];

      const action = new SaveCnDirectActionSuccess(payload);

      expect({ ...action }).toEqual({
        type: CNDirectActionTypes.SAVE_CN_DIRECT_ACTION_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  SaveCnDirectActionFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SaveCnDirectActionFailure(payload);

      expect({ ...action }).toEqual({
        type: CNDirectActionTypes.SAVE_CN_DIRECT_ACTION_FAILURE,
        payload
      });
    });
  });

  describe('LoadReset Action Test Cases', () => {
    it('should check correct type is used for  LoadReset action ', () => {
      const action = new LoadReset();
      expect({ ...action }).toEqual({
        type: CNDirectActionTypes.LOAD_RESET
      });
    });
  });
});
