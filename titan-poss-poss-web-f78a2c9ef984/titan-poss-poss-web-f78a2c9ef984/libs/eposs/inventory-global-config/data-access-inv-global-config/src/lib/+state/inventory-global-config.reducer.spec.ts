//you should simply assert that you get the right state given the provided inputs.

import * as actions from './inventory-global-config.actions';

import {
  InvglobalConfiguration,
  UpdateFieldValuePayload,
  InvglobalConfigurationFiledValue
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  invglobalConfigurationReducer,
  initialState
} from './inventory-global-config.reducer';
import { InvGlobalConfigurationState } from './inventory-global-config.state';

describe('Inv Global Config reducer Testing Suite', () => {
  describe('Testing LoadInvGlobalConfigurationList ', () => {
    beforeEach(() => {});
    it('Load LoadInvGlobalConfigurationList should set the isLoading to true', () => {
      const action = new actions.LoadInvGlobalConfigurationList();

      const result: InvGlobalConfigurationState = invglobalConfigurationReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(true);
    });
    it('LoadInvGlobalConfigurationListSuccess should return list of payment modes', () => {
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
      const action = new actions.LoadInvGlobalConfigurationListSuccess(payload);

      const result: InvGlobalConfigurationState = invglobalConfigurationReducer(
        initialState,
        action
      );

      expect(result.invglobalConfigurationList.length).toBe(1);
    });
    it('LoadInvGlobalConfigurationListFailure should return error', () => {
      const action = new actions.LoadInvGlobalConfigurationListFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: InvGlobalConfigurationState = invglobalConfigurationReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing SaveInvGlobalConfiguration ', () => {
    beforeEach(() => {});
    it('Load SaveInvGlobalConfiguration should set the isLoading to true', () => {
      const action = new actions.SaveInvGlobalConfiguration();

      const result: InvGlobalConfigurationState = invglobalConfigurationReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(true);
    });
    it('SaveInvGlobalConfigurationSuccess should return list of payment modes', () => {
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
      const action = new actions.SaveInvGlobalConfigurationSuccess(payload);

      const result: InvGlobalConfigurationState = invglobalConfigurationReducer(
        initialState,
        action
      );

      expect(result.invglobalConfigurationList.length).toBe(1);
    });
    it('SaveInvGlobalConfigurationFailure should return error', () => {
      const action = new actions.SaveInvGlobalConfigurationFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: InvGlobalConfigurationState = invglobalConfigurationReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing UpdateInvGlobalConfigurationFieldValue ', () => {
    beforeEach(() => {});
    it('UpdateInvGlobalConfigurationFieldValue ', () => {
      const payload: UpdateFieldValuePayload = {
        configId: '1',
        ruleDetails: {
          data: {
            maxTimeToMoveTranscToHistory: '250'
          },
          type: 'HISTROY_TIME_CONFIG'
        }
      };
      const action = new actions.UpdateInvGlobalConfigurationFieldValue(
        payload
      );

      const result: InvGlobalConfigurationState = invglobalConfigurationReducer(
        initialState,
        action
      );

      expect(result.hasUpdated).toBe(null);
    });
    it('UpdateInvGlobalConfigurationFieldValueSuccess should update the hasUpdated property to true', () => {
      const payload: InvglobalConfigurationFiledValue = {
        maxTimeToMoveTranscToHistory: '250'
      };

      const action = new actions.UpdateInvGlobalConfigurationFieldValueSuccess(
        payload
      );

      const result: InvGlobalConfigurationState = invglobalConfigurationReducer(
        initialState,
        action
      );

      expect(result.hasUpdated).toBe(true);
    });
    it('UpdateInvGlobalConfigurationFieldValueFailure should return error', () => {
      const action = new actions.UpdateInvGlobalConfigurationFieldValueFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: InvGlobalConfigurationState = invglobalConfigurationReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadInvGlobalConfigurationFiledValue ', () => {
    beforeEach(() => {});
    it('LoadInvGlobalConfigurationFiledValue should return the payment mode ', () => {
      const payload = '1';
      const action = new actions.LoadInvGlobalConfigurationFiledValue(payload);

      const result: InvGlobalConfigurationState = invglobalConfigurationReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(true);
    });
    it('LoadInvGlobalConfigurationFiledValueSuccess should return the payment mode', () => {
      const payload: InvglobalConfigurationFiledValue = {
        maxTimeToMoveTranscToHistory: '250'
      };

      const action = new actions.LoadInvGlobalConfigurationFiledValueSuccess(
        payload
      );

      const result: InvGlobalConfigurationState = invglobalConfigurationReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.invglobalConfigurationFiledValue).toEqual(payload);
    });
    it('LoadInvGlobalConfigurationFiledValueFailure should return error', () => {
      const action = new actions.LoadInvGlobalConfigurationFiledValueFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: InvGlobalConfigurationState = invglobalConfigurationReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadReset ', () => {
    beforeEach(() => {});
    it('LoadReset should reset the store', () => {
      const action = new actions.LoadReset();

      const result: InvGlobalConfigurationState = invglobalConfigurationReducer(
        initialState,
        action
      );

      expect(result).toEqual(initialState);
    });
  });
});
