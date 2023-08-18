import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  CustomErrors,
  CnPriorityConfigListPayload,
  CnPriorityConfigList,
  CnPriorityConfig,
  CnPriorityConfigResponse,
  CnTypeList
} from '@poss-web/shared/models';
import {
  CnPriorityConfigActionTypes,
  LoadCnPriorityConfigListSuccess,
  LoadCnPriorityConfigListFailure,
  SearchConfigByConfigName,
  SearchConfigByConfigNameSuccess,
  SearchConfigByConfigNameFailure,
  SaveCnPriorityConfig,
  SaveCnPriorityConfigSuccess,
  SaveCnPriorityConfigFailure,
  LoadCnPriorityConfigByConfigId,
  LoadCnPriorityConfigByConfigIdSuccess,
  LoadCnPriorityConfigByConfigIdFailure,
  LoadNewCnPriorityConfigByConfigId,
  LoadCnPriorityConfigList,
  UpdateCnPriorityConfig,
  UpdateCnPriorityConfigSuccess,
  UpdateCnPriorityConfigFailure,
  LoadReset,
  LoadCnTypeList,
  LoadCnTypeListSuccess,
  LoadCnTypeListFailure
} from './cn-priority-config.actions';

describe('CN Priority Config action Action Testing Suite', () => {
  describe('LoadCnPriorityConfigList Action Test Cases', () => {
    it('should check correct type is used for  LoadCnPriorityConfigList action ', () => {
      const payload: CnPriorityConfigListPayload = {
        pageIndex: 0,
        pageSize: 100,
        length: 0
      };
      const action = new LoadCnPriorityConfigList(payload);
      expect({ ...action }).toEqual({
        type: CnPriorityConfigActionTypes.LOAD_CN_PRIORITY_CONFIG_LIST,
        payload
      });
    });
    it('should check correct type is used for  LoadCnPriorityConfigListSuccess action ', () => {
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
      const action = new LoadCnPriorityConfigListSuccess(payload);

      expect({ ...action }).toEqual({
        type: CnPriorityConfigActionTypes.LOAD_CN_PRIORITY_CONFIG_LIST_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadCnPriorityConfigListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadCnPriorityConfigListFailure(payload);

      expect({ ...action }).toEqual({
        type: CnPriorityConfigActionTypes.LOAD_CN_PRIORITY_CONFIG_LIST_FAILURE,
        payload
      });
    });
  });

  describe('SearchConfigByConfigName Action Test Cases', () => {
    it('should check correct type is used for  SearchConfigByConfigName action ', () => {
      const payload = 'gep';
      const action = new SearchConfigByConfigName(payload);
      expect({ ...action }).toEqual({
        type: CnPriorityConfigActionTypes.SEARCH_CONFIG_BY_CONFIG_NAME,
        payload
      });
    });
    it('should check correct type is used for SearchConfigByConfigNameSuccess action ', () => {
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
      const action = new SearchConfigByConfigNameSuccess(payload);

      expect({ ...action }).toEqual({
        type: CnPriorityConfigActionTypes.SEARCH_CONFIG_BY_CONFIG_NAME_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  SearchConfigByConfigNameFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SearchConfigByConfigNameFailure(payload);

      expect({ ...action }).toEqual({
        type: CnPriorityConfigActionTypes.SEARCH_CONFIG_BY_CONFIG_NAME_FAILURE,
        payload
      });
    });
  });

  describe('SaveCnPriorityConfig Action Test Cases', () => {
    it('should check correct type is used for  SaveCnPriorityConfig action ', () => {
      const payload: CnPriorityConfig = {
        description: 'gep',
        ruleDetails: {
          data: {},
          type: 'GEP'
        },
        isActive: true
      };

      const action = new SaveCnPriorityConfig(payload);
      expect({ ...action }).toEqual({
        type: CnPriorityConfigActionTypes.SAVE_CN_PRIORITY_CONFIG,
        payload
      });
    });
    it('should check correct type is used for SaveCnPriorityConfigSuccess action ', () => {
      const payload: CnPriorityConfigResponse = {
        configId: '1',
        description: 'gep',
        configType: 'GEP',
        priorityDetails: [],

        isActive: true
      };
      const action = new SaveCnPriorityConfigSuccess(payload);

      expect({ ...action }).toEqual({
        type: CnPriorityConfigActionTypes.SAVE_CN_PRIORITY_CONFIG_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  SaveCnPriorityConfigFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SaveCnPriorityConfigFailure(payload);

      expect({ ...action }).toEqual({
        type: CnPriorityConfigActionTypes.SAVE_CN_PRIORITY_CONFIG_FAILURE,
        payload
      });
    });
  });

  describe('UpdateCnPriorityConfig Action Test Cases', () => {
    it('should check correct type is used for  UpdateCnPriorityConfig action ', () => {
      const payload: CnPriorityConfig = {
        configId: '1',
        description: 'gep',
        ruleDetails: {
          data: {},
          type: 'GEP'
        },
        isActive: true
      };
      const action = new UpdateCnPriorityConfig(payload);
      expect({ ...action }).toEqual({
        type: CnPriorityConfigActionTypes.UPDATE_CN_PRIORITY_CONFIG,
        payload
      });
    });
    it('should check correct type is used for SaveCnPriorityConfigSuccess action ', () => {
      const payload: CnPriorityConfigResponse = {
        configId: '1',
        description: 'gep',
        configType: 'GEP',
        priorityDetails: [],

        isActive: true
      };
      const action = new UpdateCnPriorityConfigSuccess(payload);

      expect({ ...action }).toEqual({
        type: CnPriorityConfigActionTypes.UPDATE_CN_PRIORITY_CONFIG_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  UpdateCnPriorityConfigFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new UpdateCnPriorityConfigFailure(payload);

      expect({ ...action }).toEqual({
        type: CnPriorityConfigActionTypes.UPDATE_CN_PRIORITY_CONFIG_FAILURE,
        payload
      });
    });
  });

  describe('LoadCnPriorityConfigByConfigId Action Test Cases', () => {
    it('should check correct type is used for  LoadCnPriorityConfigByConfigId action ', () => {
      const payload = '1';
      const action = new LoadCnPriorityConfigByConfigId(payload);
      expect({ ...action }).toEqual({
        type: CnPriorityConfigActionTypes.LOAD_CN_PRIORITY_CONFIG_BY_CONFIG_ID,
        payload
      });
    });
    it('should check correct type is used for LoadCnPriorityConfigByConfigIdSuccess action ', () => {
      const payload: CnPriorityConfigResponse = {
        configId: '1',
        description: 'ibtconfig',
        configType: 'IBT_CONFIG',
        priorityDetails: [],

        isActive: true
      };
      const action = new LoadCnPriorityConfigByConfigIdSuccess(payload);

      expect({ ...action }).toEqual({
        type:
          CnPriorityConfigActionTypes.LOAD_CN_PRIORITY_CONFIG_BY_CONFIG_ID_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadCnPriorityConfigByConfigIdFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadCnPriorityConfigByConfigIdFailure(payload);

      expect({ ...action }).toEqual({
        type:
          CnPriorityConfigActionTypes.LOAD_CN_PRIORITY_CONFIG_BY_CONFIG_ID_FAILURE,
        payload
      });
    });
  });

  describe('LoadCnTypeList Action Test Cases', () => {
    it('should check correct type is used for  LoadCnTypeList action ', () => {
      const action = new LoadCnTypeList();
      expect({ ...action }).toEqual({
        type: CnPriorityConfigActionTypes.LOAD_CN_TYPE_LIST
      });
    });
    it('should check correct type is used for LoadCnTypeListSuccess action ', () => {
      const payload: CnTypeList[] = [
        {
          id: 'GEP',
          description: 'GEP'
        }
      ];
      const action = new LoadCnTypeListSuccess(payload);

      expect({ ...action }).toEqual({
        type: CnPriorityConfigActionTypes.LOAD_CN_TYPE_LIST_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadCnTypeListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadCnTypeListFailure(payload);

      expect({ ...action }).toEqual({
        type: CnPriorityConfigActionTypes.LOAD_CN_TYPE_LIST_FAILURE,
        payload
      });
    });
  });

  describe('LoadNewCnPriorityConfigByConfigId Action Test Cases', () => {
    it('should check correct type is used for  LoadNewCnPriorityConfigByConfigId action ', () => {
      const action = new LoadNewCnPriorityConfigByConfigId();
      expect({ ...action }).toEqual({
        type:
          CnPriorityConfigActionTypes.LOAD_NEW_CN_PRIORITY_CONFIG_BY_CONFIG_ID
      });
    });
  });

  describe('LoadReset Action Test Cases', () => {
    it('should check correct type is used for  LoadReset action ', () => {
      const action = new LoadReset();
      expect({ ...action }).toEqual({
        type: CnPriorityConfigActionTypes.LOAD_RESET
      });
    });
  });
});
