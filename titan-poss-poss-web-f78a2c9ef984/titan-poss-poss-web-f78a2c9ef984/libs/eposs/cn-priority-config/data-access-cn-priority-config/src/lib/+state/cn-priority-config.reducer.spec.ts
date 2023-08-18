import * as actions from './cn-priority-config.actions';

import {
  CnPriorityConfigListPayload,
  CnPriorityConfigList,
  CnPriorityConfig,
  CnPriorityConfigResponse
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  cnPriorityConfigReducer,
  initialState
} from './cn-priority-config.reducer';
import { CnPriorityConfigState } from './cn-priority-config.state';

describe('CN priority config reducer Testing Suite', () => {
  const cnPriorityConfigListPayload: CnPriorityConfigListPayload = {
    pageIndex: 0,
    pageSize: 100,
    length: 0
  };

  it('should return the initial state', () => {
    const action: any = {};
    const state = cnPriorityConfigReducer(null, action);

    expect(initialState).toBe(initialState);
  });

  describe('Testing LoadCnPriorityConfigList ', () => {
    beforeEach(() => {});
    it('Load LoadCnPriorityConfigList should set the isLoading to true', () => {
      const action = new actions.LoadCnPriorityConfigList(
        cnPriorityConfigListPayload
      );

      const result: CnPriorityConfigState = cnPriorityConfigReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(true);
    });
    it('LoadCnPriorityConfigListSuccess should return list of ibt configs', () => {
      const payload: CnPriorityConfigList = {
        cnPriorityConfigList: [
          {
            configId: '1',

            description: 'gep',
            ruleDetails: {
              data: {},
              type: 'GEP'
            },
            isActive: true
          }
        ],
        totalElements: 1
      };
      const action = new actions.LoadCnPriorityConfigListSuccess(payload);

      const result: CnPriorityConfigState = cnPriorityConfigReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.cnPriorityConfigList.length).toBe(1);
    });
    it('LoadCnPriorityConfigListFailure should return error', () => {
      const action = new actions.LoadCnPriorityConfigListFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CnPriorityConfigState = cnPriorityConfigReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing SearchConfigByConfigName ', () => {
    beforeEach(() => {});
    it('Load SearchConfigByConfigName should set the isLoading to true', () => {
      const action = new actions.SearchConfigByConfigName('gep');

      const result: CnPriorityConfigState = cnPriorityConfigReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(true);
    });
    it('LoadCnPriorityConfigListSuccess should return list of ibt configs', () => {
      const payload: CnPriorityConfigList = {
        cnPriorityConfigList: [
          {
            configId: '1',

            description: 'gep',
            ruleDetails: {
              data: {},
              type: 'GEP'
            },
            isActive: true
          }
        ],
        totalElements: 1
      };
      const action = new actions.SearchConfigByConfigNameSuccess(payload);

      const result: CnPriorityConfigState = cnPriorityConfigReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.cnPriorityConfigList.length).toBe(1);
    });
    it('LoadCnPriorityConfigListFailure should return error', () => {
      const action = new actions.SearchConfigByConfigNameFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CnPriorityConfigState = cnPriorityConfigReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing SaveCnPriorityConfig Functionality ', () => {
    beforeEach(() => {});
    it('SaveCnPriorityConfig ', () => {
      const payload: CnPriorityConfig = {
        description: 'gep',
        ruleDetails: {
          data: {},
          type: 'GEP'
        },
        isActive: true
      };
      const action = new actions.SaveCnPriorityConfig(payload);

      const result: CnPriorityConfigState = cnPriorityConfigReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(true);
      expect(result.hasSaved).toBe(null);
    });
    it('SaveCnPriorityConfigSuccess should update the hasSaved property to true', () => {
      const payload: CnPriorityConfigResponse = {
        configId: '1',
        description: 'gep',
        configType: 'GEP',
        priorityDetails: [],

        isActive: true
      };
      const action = new actions.SaveCnPriorityConfigSuccess(payload);

      const result: CnPriorityConfigState = cnPriorityConfigReducer(
        initialState,
        action
      );

      expect(result.hasSaved).toBe(true);

      expect(result.isLoading).toBe(false);
    });
    it('SaveCnPriorityConfigFailure should return error', () => {
      const action = new actions.SaveCnPriorityConfigFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CnPriorityConfigState = cnPriorityConfigReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing UpdateCnPriorityConfig ', () => {
    beforeEach(() => {});
    it('UpdateCnPriorityConfig ', () => {
      const payload: CnPriorityConfig = {
        configId: '1',
        description: 'gep',
        ruleDetails: {
          data: {},
          type: 'GEP'
        },
        isActive: true
      };
      const action = new actions.UpdateCnPriorityConfig(payload);

      const result: CnPriorityConfigState = cnPriorityConfigReducer(
        initialState,
        action
      );

      expect(result.hasUpdated).toBe(false);
    });
    it('UpdateCnPriorityConfigSuccess should update the hasUpdated property to true', () => {
      const payload: CnPriorityConfigResponse = {
        configId: '1',
        description: 'gep',
        configType: 'GEP',
        priorityDetails: [],

        isActive: true
      };

      const action = new actions.UpdateCnPriorityConfigSuccess(payload);

      const result: CnPriorityConfigState = cnPriorityConfigReducer(
        initialState,
        action
      );

      expect(result.hasUpdated).toBe(true);
    });
    it('UpdateCnPriorityConfigFailure should return error', () => {
      const action = new actions.UpdateCnPriorityConfigFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CnPriorityConfigState = cnPriorityConfigReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadCnPriorityConfigByConfigId ', () => {
    beforeEach(() => {});
    it('LoadCnPriorityConfigByConfigId should return the ibt config ', () => {
      const payload = '1';
      const action = new actions.LoadCnPriorityConfigByConfigId(payload);

      const result: CnPriorityConfigState = cnPriorityConfigReducer(
        initialState,

        action
      );

      expect(result.isLoading).toBe(true);
    });
    it('LoadCnPriorityConfigByConfigIdSuccess should return the ibt config', () => {
      const payload: CnPriorityConfigResponse = {
        configId: '1',
        description: 'gep',
        configType: 'GEP',
        priorityDetails: [],

        isActive: true
      };

      const action = new actions.LoadCnPriorityConfigByConfigIdSuccess(payload);

      const result: CnPriorityConfigState = cnPriorityConfigReducer(
        initialState,

        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.cnPriorityConfig).toEqual(payload);
    });
    it('LoadCnPriorityConfigByConfigIdFailure should return error', () => {
      const action = new actions.LoadCnPriorityConfigByConfigIdFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CnPriorityConfigState = cnPriorityConfigReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadCnTypeList ', () => {
    it('Load LoadCnTypeList should set the isLoading to true', () => {
      const action = new actions.LoadCnTypeList();

      const result = cnPriorityConfigReducer(initialState, action);

      expect(result.isLoading).toBe(true);
    });
    it('LoadCnTypeListSuccess should return list of cn type', () => {
      const payload = [
        {
          id: 'GEP',
          description: 'GEP'
        }
      ];
      const action = new actions.LoadCnTypeListSuccess(payload);

      const result = cnPriorityConfigReducer(initialState, action);

      expect(result.cnTypeList.length).toBe(1);
    });
    it('LoadCnTypeListFailure should return error', () => {
      const action = new actions.LoadCnTypeListFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result = cnPriorityConfigReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadReset ', () => {
    beforeEach(() => {});
    it('LoadReset should reset the store', () => {
      const action = new actions.LoadReset();

      const result: CnPriorityConfigState = cnPriorityConfigReducer(
        initialState,

        action
      );

      expect(result).toEqual(initialState);
    });
  });
});
