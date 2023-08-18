import { Action } from '@ngrx/store';
import {
  CustomErrors,
  GetMaxFlatTepConfigResponse,
  MaxFlatTepConfigDetails,
  MaxFlatValuePatchPayload
} from '@poss-web/shared/models';
import {
  ResetData,
  MaxFlatTepConfigActionTypes,
  LoadMaxFlatTepConfig,
  LoadMaxFlatTepConfigSuccess,
  LoadMaxFlatTepConfigFailure,
  UpdateMaxFlatTepConfig,
  UpdateMaxFlatTepConfigSuccess,
  UpdateMaxFlatTepConfigFailure
} from './max-flat-tep-config.actions';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

describe('Actions Testing Suite', () => {
  describe('ResetGrf Action Test Cases', () => {
    it('should check correct type is used for ResetGrf action ', () => {
      const action = new ResetData();
      expect({ ...action }).toEqual({
        type: MaxFlatTepConfigActionTypes.RESET_DATA
      });
    });
  });
  describe('Load Max Flat TEP Actions Action Test Cases', () => {
    it('should check correct type is used for LoadMaxFlatTepConfig action ', () => {
      const action = new LoadMaxFlatTepConfig();
      expect({ ...action }).toEqual({
        type: MaxFlatTepConfigActionTypes.LOAD_MAX_FLAT_TEP_CONFIG
      });
    });
    it('should check correct type is used for LoadMaxFlatTepConfigSuccess action ', () => {
      const maxFlatTepConfigDetailsResponse: MaxFlatTepConfigDetails = {
        type: 'MAX_FLAT_CONFIG',
        data: {
          maxFlatTepExchangeValue: '1200'
        },
        configId: '1234-abcd'
      };
      const action = new LoadMaxFlatTepConfigSuccess(
        maxFlatTepConfigDetailsResponse
      );
      expect({ ...action }).toEqual({
        type: MaxFlatTepConfigActionTypes.LOAD_MAX_FLAT_TEP_CONFIG_SUCCESS,
        payload: maxFlatTepConfigDetailsResponse
      });
    });
    it('should check correct type is used for  LoadMaxFlatTepConfigFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadMaxFlatTepConfigFailure(payload);
      expect({ ...action }).toEqual({
        type: MaxFlatTepConfigActionTypes.LOAD_MAX_FLAT_TEP_CONFIG_FAILURE,
        payload
      });
    });
  });

  describe('Update Max Flat TEP Actions Action Test Cases', () => {
    it('should check correct type is used for UpdateMaxFlatTepConfig action ', () => {
      const payload = {
        configDetails: {
          type: 'MAX_FLAT_CONFIG',
          data: {
            maxFlatTepExchangeValue: '1200'
          },
          configId: '1234-abcd'
        }
      };
      const action = new UpdateMaxFlatTepConfig('1234-abcd', payload);
      expect({ ...action }).toEqual({
        type: MaxFlatTepConfigActionTypes.UPDATE_MAX_FLAT_TEP_CONFIG,
        configId: '1234-abcd',
        payload: payload
      });
    });
    it('should check correct type is used for UpdateMaxFlatTepConfigSuccess action ', () => {
      const maxFlatTepConfigDetailsResponse: MaxFlatTepConfigDetails = {
        type: 'MAX_FLAT_CONFIG',
        data: {
          maxFlatTepExchangeValue: '1200'
        },
        configId: '1234-abcd'
      };
      const action = new UpdateMaxFlatTepConfigSuccess(
        maxFlatTepConfigDetailsResponse
      );
      expect({ ...action }).toEqual({
        type: MaxFlatTepConfigActionTypes.UPDATE_MAX_FLAT_TEP_CONFIG_SUCCESS,
        payload: maxFlatTepConfigDetailsResponse
      });
    });
    it('should check correct type is used for  LoadMaxFlatTepConfigFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new UpdateMaxFlatTepConfigFailure(payload);
      expect({ ...action }).toEqual({
        type: MaxFlatTepConfigActionTypes.UPDATE_MAX_FLAT_TEP_CONFIG_FAILURE,
        payload
      });
    });
  });
});
