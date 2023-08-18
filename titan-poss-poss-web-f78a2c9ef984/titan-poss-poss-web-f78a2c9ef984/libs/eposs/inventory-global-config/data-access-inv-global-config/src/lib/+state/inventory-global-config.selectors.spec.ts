// you will need to assert that the store is calling the right selector function.

import {
  CustomErrors,
  InvglobalConfiguration,
  InvglobalConfigurationFiledValue
} from '@poss-web/shared/models';

import { initialState } from './inventory-global-config.reducer';
import * as selectors from './inventory-global-config.selectors';

import { InvGlobalConfigurationState } from './inventory-global-config.state';

describe('Inv global Config selector Testing Suite', () => {
  const invglobalConfigurationList: InvglobalConfiguration[] = [
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
  const invglobalConfigurationFiledValue: InvglobalConfigurationFiledValue = {
    maxTimeToMoveTranscToHistory: '250'
  };
  const error: CustomErrors = {
    error: null,
    code: '',
    message: '',
    traceId: '',
    timeStamp: ''
  };
  describe('Testing Inv global config related Selectors', () => {
    it('selectGlobalConfigurationList Should return the list of payment master list', () => {
      const state: InvGlobalConfigurationState = {
        ...initialState,
        invglobalConfigurationList: invglobalConfigurationList
      };
      expect(
        selectors.invglobalConfigurationSelectors.selectGlobalConfigurationList.projector(
          state
        )
      ).toEqual(invglobalConfigurationList);
    });

    it('selectIsloading Should return the true or false', () => {
      const state: InvGlobalConfigurationState = {
        ...initialState,
        isLoading: true
      };
      expect(
        selectors.invglobalConfigurationSelectors.selectIsLoading.projector(
          state
        )
      ).toEqual(true);
    });
    it('selectError Should return the error object', () => {
      const state: InvGlobalConfigurationState = {
        ...initialState,
        error: {
          error: null,
          timeStamp: '',
          traceId: '',
          code: '',
          message: ''
        }
      };
      expect(
        selectors.invglobalConfigurationSelectors.selectError.projector(state)
      ).toEqual(error);
    });
    it('selectGlobalConfiguration Should return the Payment master object', () => {
      const state: InvGlobalConfigurationState = {
        ...initialState,
        invglobalConfigurationFiledValue: invglobalConfigurationFiledValue
      };
      expect(
        selectors.invglobalConfigurationSelectors.selectGlobalConfiguration.projector(
          state
        )
      ).toEqual(invglobalConfigurationFiledValue);
    });

    it('selectHasSaved Should return the true or false', () => {
      const state: InvGlobalConfigurationState = {
        ...initialState,
        hasUpdated: true
      };
      expect(
        selectors.invglobalConfigurationSelectors.selectHasUpdated.projector(
          state
        )
      ).toEqual(true);
    });
    it('selectHasUpdated Should return the true or false', () => {
      const state: InvGlobalConfigurationState = {
        ...initialState,
        hasUpdated: true
      };
      expect(
        selectors.invglobalConfigurationSelectors.selectHasUpdated.projector(
          state
        )
      ).toEqual(true);
    });
  });
});
