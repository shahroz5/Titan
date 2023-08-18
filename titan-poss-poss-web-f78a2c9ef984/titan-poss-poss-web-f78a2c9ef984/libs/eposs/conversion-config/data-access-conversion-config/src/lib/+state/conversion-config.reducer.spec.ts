import {
  CheckBoxHeader,
  ConversionConfigByIdPayload,
  ConversionConfigList,
  ConversionConfigListPayload,
  SaveConversionConfigValuesPayload,
  UpdateToggleButtonPayload
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import * as actions from './conversion-config.actions';
import {
  ConversionConfigReducer,
  initialState
} from './conversion-config.reducer';
import { ConversionConfigState } from './conversion-config.state';

describe('ConversionConfig Reducer Testing Suite', () => {
  const savePayload: SaveConversionConfigValuesPayload = {
    configId: 1,
    createConfig: {
      description: 'Configuration',
      isActive: true,
      ruleDetails: {}
    },
    configValues: {
      addProducts: [
        {
          productCategoryCode: '71',
          productGroupCode: '72',
          ruleDetails: {
            allowedLimitValue: 123,
            allowedLimitWeight: 13,
            autoApprovalLimitValue: 13,
            autoApprovalLimitWeight: 13
          }
        }
      ],
      removeProducts: [],
      updateProducts: []
    }
  };
  const conversionConfigDetails: ConversionConfigByIdPayload = {
    createConfig: {
      description: 'Configuration',
      isActive: true,
      ruleId: 123,
      ruleType: 'Config'
    },
    productGroups: [
      {
        id: '123',
        productGroupCode: '71',
        productCategoryCode: '72',
        productGroupDescription: 'ProductGroup',
        productCategoryDescription: 'ProductCategory',
        allowedLimitWeight: '10',
        allowedLimitValue: '11',
        autoApprovalLimitWeight: '12',
        autoApprovalLimitValue: '13'
      }
    ]
  };
  const productGroups: CheckBoxHeader[] = [
    {
      title: 'pro',
      key: 'p'
    }
  ];
  const productCategories: CheckBoxHeader[] = [
    {
      title: 'proCategory',
      key: 'p'
    }
  ];
  const updateStatusPayload: UpdateToggleButtonPayload = {
    id: 1,
    toggleButton: {
      isActive: true,
      ruleDetails: {}
    }
  };
  const listResponse: ConversionConfigList = {
    conversionConfigList: [
      {
        description: 'Configuration',
        isActive: true
      }
    ],
    totalElements: 1
  };
  describe('Testing LoadConversionConfigList', () => {
    it('LoadConversionConfigList should return proper state', () => {
      const payload: ConversionConfigListPayload = {
        pageIndex: 0,
        pageSize: 5,
        length: 0
      };
      const action = new actions.LoadConversionConfigList(payload);

      const result: ConversionConfigState = ConversionConfigReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(true);
    });
    it('LoadConversionConfigListSuccess should return proper state', () => {
      const action = new actions.LoadConversionConfigListSuccess(listResponse);

      const result: ConversionConfigState = ConversionConfigReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.conversionConfigList).toBe(
        listResponse.conversionConfigList
      );
      expect(result.totalElements).toBe(listResponse.totalElements);
      expect(result.hasSearched).toBe(false);
    });
    it('LoadConversionConfigListFailure should return error', () => {
      const action = new actions.LoadConversionConfigListFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: ConversionConfigState = ConversionConfigReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
    });
  });
  describe('Testing ConversionConfigDetailsById', () => {
    it('ConversionConfigDetailsById should return proper state', () => {
      const action = new actions.ConversionConfigDetailsById(1);

      const result: ConversionConfigState = ConversionConfigReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(true);
    });
    it('ConversionConfigDetailsByIdSuccess should return proper state', () => {
      const action = new actions.ConversionConfigDetailsByIdSuccess(
        conversionConfigDetails
      );

      const result: ConversionConfigState = ConversionConfigReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.configDetailsById).toBe(conversionConfigDetails);
    });
    it('ConversionConfigDetailsByIdFailure should return error', () => {
      const action = new actions.ConversionConfigDetailsByIdFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: ConversionConfigState = ConversionConfigReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
    });
  });
  describe('Testing UpdateConversionConfigDetails', () => {
    it('UpdateConversionConfigDetails should return proper state', () => {
      const action = new actions.UpdateConversionConfigDetails(savePayload);

      const result: ConversionConfigState = ConversionConfigReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(true);
      expect(result.hasUpdated).toBe(false);
    });
    it('UpdateConversionConfigDetailsSuccess should return proper state', () => {
      const action = new actions.UpdateConversionConfigDetailsSuccess();

      const result: ConversionConfigState = ConversionConfigReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.hasUpdated).toBe(true);
    });
    it('UpdateConversionConfigDetailsFailure should return error', () => {
      const action = new actions.UpdateConversionConfigDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: ConversionConfigState = ConversionConfigReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
      expect(result.hasUpdated).toEqual(false);
    });
  });

  describe('Testing SaveConversionConfigValues', () => {
    it('SaveConversionConfigValues should return proper state', () => {
      const action = new actions.SaveConversionConfigValues(savePayload);

      const result: ConversionConfigState = ConversionConfigReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(true);
      expect(result.hasSaved).toBe(false);
    });
    it('SaveConversionConfigValuesSuccess should return proper state', () => {
      const action = new actions.SaveConversionConfigValuesSuccess(
        conversionConfigDetails
      );

      const result: ConversionConfigState = ConversionConfigReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.hasSaved).toBe(true);
      expect(result.saveSuccessPayload).toBe(conversionConfigDetails);
    });
    it('SaveConversionConfigValuesFailure should return error', () => {
      const action = new actions.SaveConversionConfigValuesFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: ConversionConfigState = ConversionConfigReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
      expect(result.hasSaved).toEqual(false);
    });
  });
  describe('Testing ResetConversionConfig', () => {
    it('ResetConversionConfig should return proper state', () => {
      const action = new actions.ResetConversionConfig();

      const result: ConversionConfigState = ConversionConfigReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.hasSaved).toBe(null);
      expect(result.hasUpdated).toBe(null);
      expect(result.error).toBe(null);
      expect(result.saveSuccessPayload).toBe(null);
      expect(result.configDetailsById).toBe(null);
    });
  });
  describe('Testing LoadProductGroups', () => {
    it('LoadProductGroups should return proper state', () => {
      const action = new actions.LoadProductGroups();

      const result: ConversionConfigState = ConversionConfigReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(true);
    });
    it('LoadProductGroupsSuccess should return proper state', () => {
      const action = new actions.LoadProductGroupsSuccess(productGroups);

      const result: ConversionConfigState = ConversionConfigReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.productGroups).toBe(productGroups);
    });
    it('LoadProductGroupsFailure should return error', () => {
      const action = new actions.LoadProductGroupsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: ConversionConfigState = ConversionConfigReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
    });
  });

  describe('Testing LoadProductCategories', () => {
    it('LoadProductCategories should return proper state', () => {
      const action = new actions.LoadProductGroups();

      const result: ConversionConfigState = ConversionConfigReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(true);
    });
    it('LoadProductCategoriesSuccess should return proper state', () => {
      const action = new actions.LoadProductCategoriesSuccess(
        productCategories
      );

      const result: ConversionConfigState = ConversionConfigReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.productCategories).toBe(productCategories);
    });
    it('LoadProductCategoriesFailure should return error', () => {
      const action = new actions.LoadProductCategoriesFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: ConversionConfigState = ConversionConfigReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
    });
  });
  describe('Testing SearchConfigName', () => {
    it('SearchConfigName should return proper state', () => {
      const action = new actions.SearchConfigName('Config');

      const result: ConversionConfigState = ConversionConfigReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(true);
      expect(result.hasSearched).toBe(false);
    });
    it('SearchConfigNameSuccess should return proper state', () => {
      const action = new actions.SearchConfigNameSuccess(listResponse);

      const result: ConversionConfigState = ConversionConfigReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.hasSearched).toBe(true);
      expect(result.conversionConfigList).toBe(
        listResponse.conversionConfigList
      );
      expect(result.totalElements).toBe(listResponse.totalElements);
    });
    it('SearchConfigNameFailure should return error', () => {
      const action = new actions.SearchConfigNameFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: ConversionConfigState = ConversionConfigReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
      expect(result.hasSearched).toEqual(false);
    });
  });
  describe('Testing UpdateToggleButton', () => {
    it('UpdateToggleButton should return proper state', () => {
      const action = new actions.UpdateToggleButton(updateStatusPayload);

      const result: ConversionConfigState = ConversionConfigReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(true);
      expect(result.hasUpdated).toBe(false);
    });
    it('UpdateToggleButtonSuccess should return proper state', () => {
      const action = new actions.UpdateToggleButtonSuccess();

      const result: ConversionConfigState = ConversionConfigReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.hasUpdated).toBe(true);
    });
    it('UpdateToggleButtonFailure should return error', () => {
      const action = new actions.UpdateToggleButtonFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: ConversionConfigState = ConversionConfigReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
      expect(result.hasUpdated).toEqual(false);
    });
  });
});
