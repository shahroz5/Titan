import { MaxFlatTepConfigState } from './max-flat-tep-config.state';
import {
  initialState,
  MaxFlatTepConfigReducer
} from './max-flat-tep-config.reducer';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import * as actions from './max-flat-tep-config.actions';
import { MaxFlatTepConfigDetails } from '@poss-web/shared/models';

describe('Max Flat TEP Config reducer Testing Suite', () => {
  describe('Testing Load Max Flat TEP Config Functionality', () => {
    beforeEach(() => {});
    it('Testing LOAD_MAX_FLAT_TEP_CONFIG', () => {
      const action = new actions.LoadMaxFlatTepConfig();
      const result: MaxFlatTepConfigState = MaxFlatTepConfigReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(true);
      expect(result.errors).toBe(null);
    });
    it('LOAD_MAX_FLAT_TEP_CONFIG_SUCCESS should update maxFlatTepConfigDetails field in state', () => {
      const maxFlatTepConfigDetailsResponse: MaxFlatTepConfigDetails = {
        type: 'MAX_FLAT_CONFIG',
        data: {
          maxFlatTepExchangeValue: '1200'
        },
        configId: '1234-abcd'
      };
      const action = new actions.LoadMaxFlatTepConfigSuccess(
        maxFlatTepConfigDetailsResponse
      );
      const result: MaxFlatTepConfigState = MaxFlatTepConfigReducer(
        initialState,
        action
      );
      expect(result.maxFlatTepConfigDetails).toBe(
        maxFlatTepConfigDetailsResponse
      );
    });
    it('LOAD_MAX_FLAT_TEP_CONFIG_FAILURE should return error', () => {
      const action = new actions.LoadMaxFlatTepConfigFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: MaxFlatTepConfigState = MaxFlatTepConfigReducer(
        initialState,
        action
      );
      expect(result.errors.message).toEqual('some error');
    });
  });

  describe('Testing Update Max Flat TEP Config Functionality', () => {
    beforeEach(() => {});
    it('Testing UPDATE_MAX_FLAT_TEP_CONFIG', () => {
      const payload = {
        configDetails: {
          type: 'MAX_FLAT_CONFIG',
          data: {
            maxFlatTepExchangeValue: '1200'
          },
          configId: '1234-abcd'
        }
      };
      const action = new actions.UpdateMaxFlatTepConfig('', payload);
      const result: MaxFlatTepConfigState = MaxFlatTepConfigReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(true);
      expect(result.errors).toBe(null);
    });
    it('UPDATE_MAX_FLAT_TEP_CONFIG_SUCCESS should update updateMaxFlatTepConfigResponse field in state', () => {
      const maxFlatTepConfigDetailsResponse: MaxFlatTepConfigDetails = {
        type: 'MAX_FLAT_CONFIG',
        data: {
          maxFlatTepExchangeValue: '1200'
        },
        configId: '1234-abcd'
      };
      const action = new actions.UpdateMaxFlatTepConfigSuccess(
        maxFlatTepConfigDetailsResponse
      );
      const result: MaxFlatTepConfigState = MaxFlatTepConfigReducer(
        initialState,
        action
      );
      expect(result.updateMaxFlatTepConfigResponse).toBe(
        maxFlatTepConfigDetailsResponse
      );
    });
    it('UPDATE_MAX_FLAT_TEP_CONFIG_FAILURE should return error', () => {
      const action = new actions.UpdateMaxFlatTepConfigFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: MaxFlatTepConfigState = MaxFlatTepConfigReducer(
        initialState,
        action
      );
      expect(result.errors.message).toEqual('some error');
    });
  });

  it('RESET_GRF should reset all field in state', () => {
    const action = new actions.ResetData();
    const result: MaxFlatTepConfigState = MaxFlatTepConfigReducer(
      initialState,
      action
    );
    expect(result.errors).toBe(null);
    expect(result.isLoading).toBe(false);
    expect(result.maxFlatTepConfigDetails).toBe(null);
    expect(result.updateMaxFlatTepConfigResponse).toBe(null);
  });
});
