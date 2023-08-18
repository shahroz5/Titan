import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  CustomErrors,
  IbtConfigurationListPayload,
  IbtConfigurationList,
  IbtConfiguration,
  IbtConfigurationResponse
} from '@poss-web/shared/models';
import {
  IbtConfigurationActionTypes,
  LoadIbtConfigurationListSuccess,
  LoadIbtConfigurationListFailure,
  SearchConfigByConfigName,
  SearchConfigByConfigNameSuccess,
  SearchConfigByConfigNameFailure,
  SaveIbtConfiguration,
  SaveIbtConfigurationSuccess,
  SaveIbtConfigurationFailure,
  LoadIbtConfigurationByConfigId,
  LoadIbtConfigurationByConfigIdSuccess,
  LoadIbtConfigurationByConfigIdFailure,
  LoadNewIbtConfigurationByConfigId,
  LoadIbtConfigurationList,
  UpdateIbtConfiguration,
  UpdateIbtConfigurationSuccess,
  UpdateIbtConfigurationFailure,
  LoadReset
} from './ibt-configuration.actions';

describe('IBT Config action Action Testing Suite', () => {
  describe('LoadIbtConfigurationList Action Test Cases', () => {
    it('should check correct type is used for  LoadIbtConfigurationList action ', () => {
      const payload: IbtConfigurationListPayload = {
        pageIndex: 0,
        pageSize: 100,
        length: 0
      };
      const action = new LoadIbtConfigurationList(payload);
      expect({ ...action }).toEqual({
        type: IbtConfigurationActionTypes.LOAD_IBT_CONFIGURATION_LIST,
        payload
      });
    });
    it('should check correct type is used for  LoadIbtConfigurationListSuccess action ', () => {
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
      const action = new LoadIbtConfigurationListSuccess(payload);

      expect({ ...action }).toEqual({
        type: IbtConfigurationActionTypes.LOAD_IBT_CONFIGURATION_LIST_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadIbtConfigurationListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadIbtConfigurationListFailure(payload);

      expect({ ...action }).toEqual({
        type: IbtConfigurationActionTypes.LOAD_IBT_CONFIGURATION_LIST_FAILURE,
        payload
      });
    });
  });

  describe('SearchConfigByConfigName Action Test Cases', () => {
    it('should check correct type is used for  SearchConfigByConfigName action ', () => {
      const payload = 'ibtconfig';
      const action = new SearchConfigByConfigName(payload);
      expect({ ...action }).toEqual({
        type: IbtConfigurationActionTypes.SEARCH_CONFIG_BY_CONFIG_NAME,
        payload
      });
    });
    it('should check correct type is used for SearchConfigByConfigNameSuccess action ', () => {
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
      const action = new SearchConfigByConfigNameSuccess(payload);

      expect({ ...action }).toEqual({
        type: IbtConfigurationActionTypes.SEARCH_CONFIG_BY_CONFIG_NAME_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  SearchConfigByConfigNameFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SearchConfigByConfigNameFailure(payload);

      expect({ ...action }).toEqual({
        type: IbtConfigurationActionTypes.SEARCH_CONFIG_BY_CONFIG_NAME_FAILURE,
        payload
      });
    });
  });

  describe('SaveIbtConfiguration Action Test Cases', () => {
    it('should check correct type is used for  SaveIbtConfiguration action ', () => {
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

      const action = new SaveIbtConfiguration(payload);
      expect({ ...action }).toEqual({
        type: IbtConfigurationActionTypes.SAVE_IBT_CONFIGURATION,
        payload
      });
    });
    it('should check correct type is used for SaveIbtConfigurationSuccess action ', () => {
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
      const action = new SaveIbtConfigurationSuccess(payload);

      expect({ ...action }).toEqual({
        type: IbtConfigurationActionTypes.SAVE_IBT_CONFIGURATION_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  SaveIbtConfigurationFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SaveIbtConfigurationFailure(payload);

      expect({ ...action }).toEqual({
        type: IbtConfigurationActionTypes.SAVE_IBT_CONFIGURATION_FAILURE,
        payload
      });
    });
  });

  describe('UpdateIbtConfiguration Action Test Cases', () => {
    it('should check correct type is used for  UpdateIbtConfiguration action ', () => {
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
      const action = new UpdateIbtConfiguration(payload);
      expect({ ...action }).toEqual({
        type: IbtConfigurationActionTypes.UPDATE_IBT_CONFIGURATION,
        payload
      });
    });
    it('should check correct type is used for SaveIbtConfigurationSuccess action ', () => {
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
      const action = new UpdateIbtConfigurationSuccess(payload);

      expect({ ...action }).toEqual({
        type: IbtConfigurationActionTypes.UPDATE_IBT_CONFIGURATION_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  UpdateIbtConfigurationFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new UpdateIbtConfigurationFailure(payload);

      expect({ ...action }).toEqual({
        type: IbtConfigurationActionTypes.UPDATE_IBT_CONFIGURATION_FAILURE,
        payload
      });
    });
  });

  describe('LoadIbtConfigurationByConfigId Action Test Cases', () => {
    it('should check correct type is used for  LoadIbtConfigurationByConfigId action ', () => {
      const payload = '1';
      const action = new LoadIbtConfigurationByConfigId(payload);
      expect({ ...action }).toEqual({
        type: IbtConfigurationActionTypes.LOAD_IBT_CONFIGURATION_BY_CONFIG_ID,
        payload
      });
    });
    it('should check correct type is used for LoadIbtConfigurationByConfigIdSuccess action ', () => {
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
      const action = new LoadIbtConfigurationByConfigIdSuccess(payload);

      expect({ ...action }).toEqual({
        type:
          IbtConfigurationActionTypes.LOAD_IBT_CONFIGURATION_BY_CONFIG_ID_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadIbtConfigurationByConfigIdFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadIbtConfigurationByConfigIdFailure(payload);

      expect({ ...action }).toEqual({
        type:
          IbtConfigurationActionTypes.LOAD_IBT_CONFIGURATION_BY_CONFIG_ID_FAILURE,
        payload
      });
    });
  });

  describe('LoadNewIbtConfigurationByConfigId Action Test Cases', () => {
    it('should check correct type is used for  LoadNewIbtConfigurationByConfigId action ', () => {
      const action = new LoadNewIbtConfigurationByConfigId();
      expect({ ...action }).toEqual({
        type:
          IbtConfigurationActionTypes.LOAD_NEW_IBT_CONFIGURATION_BY_CONFIG_ID
      });
    });
  });

  describe('LoadReset Action Test Cases', () => {
    it('should check correct type is used for  LoadReset action ', () => {
      const action = new LoadReset();
      expect({ ...action }).toEqual({
        type: IbtConfigurationActionTypes.LOAD_RESET
      });
    });
  });
});
