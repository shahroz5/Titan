//you should simply assert that you get the right state given the provided inputs.

import * as actions from './ibt-configuration.actions';

import {
  IbtConfigurationListPayload,
  IbtConfigurationList,
  IbtConfiguration,
  IbtConfigurationResponse
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  ibtConfigurationReducer,
  initialState
} from './ibt-configuration.reducer';
import { IbtConfigurationState } from './ibt-configuration.state';

describe('ibt config reducer Testing Suite', () => {
  const ibtConfigurationListPayload: IbtConfigurationListPayload = {
    pageIndex: 0,
    pageSize: 100,
    length: 0
  };
  describe('Testing LoadIbtConfigurationList ', () => {
    beforeEach(() => {});
    it('Load LoadIbtConfigurationList should set the isLoading to true', () => {
      const action = new actions.LoadIbtConfigurationList(
        ibtConfigurationListPayload
      );

      const result: IbtConfigurationState = ibtConfigurationReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(true);
    });
    it('LoadIbtConfigurationListSuccess should return list of ibt configs', () => {
      const payload: IbtConfigurationList = {
        ibtConfigList: [
          {
            configId: '1',

            description: 'ibtconfig',
            ruleDetails: {
              data: {
                maxProductsPerStn: '',
                maxReqPerMonth: '',
                maxValPerStn: '',
                validRequestTime: ''
              },
              type: 'IBT_CONIG'
            },
            isActive: true
          }
        ],
        totalElements: 1
      };
      const action = new actions.LoadIbtConfigurationListSuccess(payload);

      const result: IbtConfigurationState = ibtConfigurationReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.ibtConfigList.length).toBe(1);
    });
    it('LoadIbtConfigurationListFailure should return error', () => {
      const action = new actions.LoadIbtConfigurationListFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: IbtConfigurationState = ibtConfigurationReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing SearchConfigByConfigName ', () => {
    beforeEach(() => {});
    it('Load SearchConfigByConfigName should set the isLoading to true', () => {
      const action = new actions.SearchConfigByConfigName('ibtconfig');

      const result: IbtConfigurationState = ibtConfigurationReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(true);
    });
    it('LoadIbtConfigurationListSuccess should return list of ibt configs', () => {
      const payload: IbtConfigurationList = {
        ibtConfigList: [
          {
            configId: '1',

            description: 'ibtconfig',
            ruleDetails: {
              data: {
                maxProductsPerStn: '',
                maxReqPerMonth: '',
                maxValPerStn: '',
                validRequestTime: ''
              },
              type: 'IBT_CONIG'
            },
            isActive: true
          }
        ],
        totalElements: 1
      };
      const action = new actions.SearchConfigByConfigNameSuccess(payload);

      const result: IbtConfigurationState = ibtConfigurationReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.ibtConfigList.length).toBe(1);
    });
    it('LoadIbtConfigurationListFailure should return error', () => {
      const action = new actions.SearchConfigByConfigNameFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: IbtConfigurationState = ibtConfigurationReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing SaveIbtConfiguration Functionality ', () => {
    beforeEach(() => {});
    it('SaveIbtConfiguration ', () => {
      const payload: IbtConfiguration = {
        description: 'ibtconfig',
        ruleDetails: {
          data: {
            maxProductsPerStn: '',
            maxReqPerMonth: '',
            maxValPerStn: '',
            validRequestTime: ''
          },
          type: 'IBT_CONIG'
        },
        isActive: true
      };
      const action = new actions.SaveIbtConfiguration(payload);

      const result: IbtConfigurationState = ibtConfigurationReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(true);
      expect(result.hasSaved).toBe(null);
    });
    it('SaveIbtConfigurationSuccess should update the hasSaved property to true', () => {
      const payload: IbtConfigurationResponse = {
        configId: '1',
        description: 'ibtconfig',
        configType: 'IBT_CONFIG',
        maxProductsPerStn: '',
        maxReqPerMonth: '',
        maxValPerStn: '',
        validRequestTime: '',

        isActive: true
      };
      const action = new actions.SaveIbtConfigurationSuccess(payload);

      const result: IbtConfigurationState = ibtConfigurationReducer(
        initialState,
        action
      );

      expect(result.hasSaved).toBe(true);

      expect(result.isLoading).toBe(false);
    });
    it('SaveIbtConfigurationFailure should return error', () => {
      const action = new actions.SaveIbtConfigurationFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: IbtConfigurationState = ibtConfigurationReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing UpdateIbtConfiguration ', () => {
    beforeEach(() => {});
    it('UpdateIbtConfiguration ', () => {
      const payload: IbtConfiguration = {
        configId: '1',
        description: 'ibtconfig',
        ruleDetails: {
          data: {
            maxProductsPerStn: '1',
            maxReqPerMonth: '2',
            maxValPerStn: '3',
            validRequestTime: '4'
          },
          type: 'IBT_CONIG'
        },
        isActive: true
      };
      const action = new actions.UpdateIbtConfiguration(payload);

      const result: IbtConfigurationState = ibtConfigurationReducer(
        initialState,
        action
      );

      expect(result.hasUpdated).toBe(false);
    });
    it('UpdateIbtConfigurationSuccess should update the hasUpdated property to true', () => {
      const payload: IbtConfigurationResponse = {
        configId: '1',
        description: 'ibtconfig',
        configType: 'IBT_CONFIG',
        maxProductsPerStn: '',
        maxReqPerMonth: '',
        maxValPerStn: '',
        validRequestTime: '',

        isActive: true
      };

      const action = new actions.UpdateIbtConfigurationSuccess(payload);

      const result: IbtConfigurationState = ibtConfigurationReducer(
        initialState,
        action
      );

      expect(result.hasUpdated).toBe(true);
    });
    it('UpdateIbtConfigurationFailure should return error', () => {
      const action = new actions.UpdateIbtConfigurationFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: IbtConfigurationState = ibtConfigurationReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadIbtConfigurationByConfigId ', () => {
    beforeEach(() => {});
    it('LoadIbtConfigurationByConfigId should return the ibt config ', () => {
      const payload = '1';
      const action = new actions.LoadIbtConfigurationByConfigId(payload);

      const result: IbtConfigurationState = ibtConfigurationReducer(
        initialState,

        action
      );

      expect(result.isLoading).toBe(true);
    });
    it('LoadIbtConfigurationByConfigIdSuccess should return the ibt config', () => {
      const payload: IbtConfigurationResponse = {
        configId: '1',
        description: 'ibtconfig',
        configType: 'IBT_CONFIG',
        maxProductsPerStn: '',
        maxReqPerMonth: '',
        maxValPerStn: '',
        validRequestTime: '',

        isActive: true
      };

      const action = new actions.LoadIbtConfigurationByConfigIdSuccess(payload);

      const result: IbtConfigurationState = ibtConfigurationReducer(
        initialState,

        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.ibtConfiguration).toEqual(payload);
    });
    it('LoadIbtConfigurationByConfigIdFailure should return error', () => {
      const action = new actions.LoadIbtConfigurationByConfigIdFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: IbtConfigurationState = ibtConfigurationReducer(
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

      const result: IbtConfigurationState = ibtConfigurationReducer(
        initialState,

        action
      );

      expect(result).toEqual(initialState);
    });
  });
});
