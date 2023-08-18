import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  CustomErrors,
  InvglobalConfiguration,
  InvglobalConfigurationFiledValue,
  UpdateFieldValuePayload
} from '@poss-web/shared/models';
import {
  LoadInvGlobalConfigurationListSuccess,
  LoadInvGlobalConfigurationListFailure,
  LoadReset,
  LoadInvGlobalConfigurationList,
  InvGlobalConfigurationActionTypes,
  LoadInvGlobalConfigurationFiledValue,
  LoadInvGlobalConfigurationFiledValueSuccess,
  LoadInvGlobalConfigurationFiledValueFailure,
  UpdateInvGlobalConfigurationFieldValue,
  UpdateInvGlobalConfigurationFieldValueSuccess,
  UpdateInvGlobalConfigurationFieldValueFailure,
  SaveInvGlobalConfiguration,
  SaveInvGlobalConfigurationSuccess,
  SaveInvGlobalConfigurationFailure
} from './inventory-global-config.actions';

describe('Inv Global Config Action Testing Suite', () => {
  describe('LoadInvGlobalConfigurationList Action Test Cases', () => {
    it('should check correct type is used for  LoadInvGlobalConfigurationList action ', () => {
      const action = new LoadInvGlobalConfigurationList();
      expect({ ...action }).toEqual({
        type:
          InvGlobalConfigurationActionTypes.LOAD_INV_GLOBAL_CONFIGURATION_LIST
      });
    });
    it('should check correct type is used for  LoadInvGlobalConfigurationListSuccess action ', () => {
      const payload: InvglobalConfiguration[] = [
        {
          configId: '1',
          description: 'testConfig',
          isActive: true,
          configType: 'HISTORY_TIME_CONFIG',
          ruleDetails: {
            data: {
              maxTimeToMoveTranscToHistory: '1'
            },
            type: 'HISTORY_TIME_CONFIG'
          }
        }
      ];
      const action = new LoadInvGlobalConfigurationListSuccess(payload);

      expect({ ...action }).toEqual({
        type:
          InvGlobalConfigurationActionTypes.LOAD_INV_GLOBAL_CONFIGURATION_LIST_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadInvGlobalConfigurationListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadInvGlobalConfigurationListFailure(payload);

      expect({ ...action }).toEqual({
        type:
          InvGlobalConfigurationActionTypes.LOAD_INV_GLOBAL_CONFIGURATION_LIST_FAILURE,
        payload
      });
    });
  });

  describe('LoadInvGlobalConfigurationFiledValue Action Test Cases', () => {
    it('should check correct type is used for  LoadInvGlobalConfigurationFiledValue action ', () => {
      const payload = '1';

      const action = new LoadInvGlobalConfigurationFiledValue(payload);
      expect({ ...action }).toEqual({
        type:
          InvGlobalConfigurationActionTypes.LOAD_INV_GLOBAL_CONFIGURATION_FILED_VALUE,
        payload
      });
    });
    it('should check correct type is used for LoadInvGlobalConfigurationFiledValueSuccess action ', () => {
      const payload: InvglobalConfigurationFiledValue = {
        maxTimeToMoveTranscToHistory: '250'
      };
      const action = new LoadInvGlobalConfigurationFiledValueSuccess(payload);

      expect({ ...action }).toEqual({
        type:
          InvGlobalConfigurationActionTypes.LOAD_INV_GLOBAL_CONFIGURATION_FILED_VALUE_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadInvGlobalConfigurationFiledValueFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadInvGlobalConfigurationFiledValueFailure(payload);

      expect({ ...action }).toEqual({
        type:
          InvGlobalConfigurationActionTypes.LOAD_INV_GLOBAL_CONFIGURATION_FILED_VALUE_FAILURE,
        payload
      });
    });
  });

  describe('SaveInvGlobalConfiguration Action Test Cases', () => {
    it('should check correct type is used for  SaveInvGlobalConfiguration action ', () => {
      const action = new SaveInvGlobalConfiguration();
      expect({ ...action }).toEqual({
        type: InvGlobalConfigurationActionTypes.SAVE_INV_GLOBAL_CONFIGURATION
      });
    });
    it('should check correct type is used for SaveInvGlobalConfigurationSuccess action ', () => {
      const payload: InvglobalConfiguration[] = [
        {
          configId: '1',
          description: 'testConfig',
          isActive: true,
          configType: 'HISTORY_TIME_CONFIG',
          ruleDetails: {
            data: {
              maxTimeToMoveTranscToHistory: '1'
            },
            type: 'HISTORY_TIME_CONFIG'
          }
        }
      ];
      const action = new SaveInvGlobalConfigurationSuccess(payload);

      expect({ ...action }).toEqual({
        type:
          InvGlobalConfigurationActionTypes.SAVE_INV_GLOBAL_CONFIGURATION_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  UpdateInvGlobalConfigurationFieldValueFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SaveInvGlobalConfigurationFailure(payload);

      expect({ ...action }).toEqual({
        type:
          InvGlobalConfigurationActionTypes.SAVE_INV_GLOBAL_CONFIGURATION_FAILURE,
        payload
      });
    });
  });
  describe('UpdateInvGlobalConfigurationFieldValue Action Test Cases', () => {
    it('should check correct type is used for  UpdateInvGlobalConfigurationFieldValue action ', () => {
      const payload: UpdateFieldValuePayload = {
        configId: '1',
        ruleDetails: {
          data: {
            maxTimeToMoveTranscToHistory: '250'
          },
          type: 'HISTROY_TIME_CONFIG'
        }
      };
      const action = new UpdateInvGlobalConfigurationFieldValue(payload);
      expect({ ...action }).toEqual({
        type:
          InvGlobalConfigurationActionTypes.UPDATE_INV_GLOBAL_CONFIGURATION_FIELD_VALUE,
        payload
      });
    });
    it('should check correct type is used for LoadInvGlobalConfigurationFiledValueSuccess action ', () => {
      const payload: InvglobalConfigurationFiledValue = {
        maxTimeToMoveTranscToHistory: '250'
      };
      const action = new UpdateInvGlobalConfigurationFieldValueSuccess(payload);

      expect({ ...action }).toEqual({
        type:
          InvGlobalConfigurationActionTypes.UPDATE_INV_GLOBAL_CONFIGURATION_FIELD_VALUE_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  UpdateInvGlobalConfigurationFieldValueFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new UpdateInvGlobalConfigurationFieldValueFailure(payload);

      expect({ ...action }).toEqual({
        type:
          InvGlobalConfigurationActionTypes.UPDATE_INV_GLOBAL_CONFIGURATION_FIELD_VALUE_FAILURE,
        payload
      });
    });
  });

  describe('LoadReset Action Test Cases', () => {
    it('should check correct type is used for  LoadReset action ', () => {
      const action = new LoadReset();
      expect({ ...action }).toEqual({
        type: InvGlobalConfigurationActionTypes.LOAD_RESET
      });
    });
  });
});
