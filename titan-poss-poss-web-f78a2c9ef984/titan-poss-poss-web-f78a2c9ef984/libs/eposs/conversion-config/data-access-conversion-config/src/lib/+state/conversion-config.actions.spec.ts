import {
  CheckBoxHeader,
  ConversionConfigByIdPayload,
  ConversionConfigList,
  CustomErrors,
  CustomerTransactionConfigListPayload,
  SaveConversionConfigValuesPayload,
  UpdateToggleButtonPayload
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  ConversionConfigActionTypes,
  ConversionConfigDetailsById,
  ConversionConfigDetailsByIdFailure,
  ConversionConfigDetailsByIdSuccess,
  LoadConversionConfigList,
  LoadConversionConfigListFailure,
  LoadConversionConfigListSuccess,
  LoadProductCategories,
  LoadProductCategoriesFailure,
  LoadProductCategoriesSuccess,
  LoadProductGroups,
  LoadProductGroupsFailure,
  LoadProductGroupsSuccess,
  ResetConversionConfig,
  SaveConversionConfigValues,
  SaveConversionConfigValuesFailure,
  SaveConversionConfigValuesSuccess,
  SearchConfigName,
  SearchConfigNameFailure,
  SearchConfigNameSuccess,
  UpdateConversionConfigDetails,
  UpdateConversionConfigDetailsFailure,
  UpdateConversionConfigDetailsSuccess,
  UpdateToggleButton,
  UpdateToggleButtonFailure,
  UpdateToggleButtonSuccess
} from './conversion-config.actions';
describe('ConversionConfig Testing Suite', () => {
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
  describe('LoadConversionConfigList TestCases', () => {
    it('should check correct type is used for LoadConversionConfigList action ', () => {
      const payload: CustomerTransactionConfigListPayload = {
        pageIndex: 0,
        pageSize: 100,
        length: 0
      };
      const action = new LoadConversionConfigList(payload);

      expect(action.type).toEqual(
        ConversionConfigActionTypes.LOAD_CONVERSION_CONFIG_LIST
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for LoadConversionConfigList action ', () => {
      const action = new LoadConversionConfigListSuccess(listResponse);

      expect(action.type).toEqual(
        ConversionConfigActionTypes.LOAD_CONVERSION_CONFIG_LIST_SUCCESS
      );
      expect(action.payload).toEqual(listResponse);
    });
    it('should check correct type is used for LoadConversionConfigListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadConversionConfigListFailure(payload);

      expect(action.type).toEqual(
        ConversionConfigActionTypes.LOAD_CONVERSION_CONFIG_LIST_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
  describe('ConversionConfigDetailsById TestCases', () => {
    it('should check correct type is used for ConversionConfigDetailsById action ', () => {
      const action = new ConversionConfigDetailsById(1);

      expect(action.type).toEqual(
        ConversionConfigActionTypes.CONVERSION_CONFIG_DETAILS_BY_ID
      );
      expect(action.payload).toEqual(1);
    });
    it('should check correct type is used for ConversionConfigDetailsByIdSuccess action ', () => {
      const action = new ConversionConfigDetailsByIdSuccess(
        conversionConfigDetails
      );

      expect(action.type).toEqual(
        ConversionConfigActionTypes.CONVERSION_CONFIG_DETAILS_BY_ID_SUCCESS
      );
      expect(action.payload).toEqual(conversionConfigDetails);
    });
    it('should check correct type is used for ConversionConfigDetailsByIdFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new ConversionConfigDetailsByIdFailure(payload);

      expect(action.type).toEqual(
        ConversionConfigActionTypes.CONVERSION_CONFIG_DETAILS_BY_ID_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
  describe('SaveConversionConfigValues TestCases', () => {
    it('should check correct type is used for SaveConversionConfigValues action ', () => {
      const action = new SaveConversionConfigValues(savePayload);

      expect(action.type).toEqual(
        ConversionConfigActionTypes.SAVE_CONVERSION_CONFIG_VALUES
      );
      expect(action.payload).toEqual(savePayload);
    });
    it('should check correct type is used for SaveConversionConfigValuesSuccess action ', () => {
      const action = new SaveConversionConfigValuesSuccess(
        conversionConfigDetails
      );

      expect(action.type).toEqual(
        ConversionConfigActionTypes.SAVE_CONVERSION_CONFIG_VALUES_SUCCESS
      );
    });
    it('should check correct type is used for SaveConversionConfigValuesFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SaveConversionConfigValuesFailure(payload);

      expect(action.type).toEqual(
        ConversionConfigActionTypes.SAVE_CONVERSION_CONFIG_VALUES_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
  describe('LoadProductGroups TestCases', () => {
    it('should check correct type is used for LoadProductGroups action ', () => {
      const action = new LoadProductGroups();

      expect(action.type).toEqual(
        ConversionConfigActionTypes.LOAD_PRODUCT_GROUPS
      );
    });
    it('should check correct type is used for LoadProductGroupsSuccess action ', () => {
      const action = new LoadProductGroupsSuccess(productGroups);

      expect(action.type).toEqual(
        ConversionConfigActionTypes.LOAD_PRODUCT_GROUPS_SUCCESS
      );
      expect(action.payload).toEqual(productGroups);
    });
    it('should check correct type is used for LoadProductGroupsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadProductGroupsFailure(payload);

      expect(action.type).toEqual(
        ConversionConfigActionTypes.LOAD_PRODUCT_GROUPS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('LoadProductCategories TestCases', () => {
    it('should check correct type is used for LoadProductCategories action ', () => {
      const action = new LoadProductCategories();

      expect(action.type).toEqual(
        ConversionConfigActionTypes.LOAD_PRODUCT_CATEGORIES
      );
    });
    it('should check correct type is used for LoadProductCategoriesSuccess action ', () => {
      const action = new LoadProductCategoriesSuccess(productCategories);

      expect(action.type).toEqual(
        ConversionConfigActionTypes.LOAD_PRODUCT_CATEGORIES_SUCCESS
      );
      expect(action.payload).toEqual(productCategories);
    });
    it('should check correct type is used for LoadProductCategoriesFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadProductCategoriesFailure(payload);

      expect(action.type).toEqual(
        ConversionConfigActionTypes.LOAD_PRODUCT_CATEGORIES_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
  describe('SearchConfigName TestCases', () => {
    it('should check correct type is used for SearchConfigName action ', () => {
      const action = new SearchConfigName('Config');

      expect(action.type).toEqual(
        ConversionConfigActionTypes.SEARCH_CONFIG_NAME
      );
      expect(action.payload).toEqual('Config');
    });
    it('should check correct type is used for SearchConfigNameSuccess action ', () => {
      const action = new SearchConfigNameSuccess(listResponse);

      expect(action.type).toEqual(
        ConversionConfigActionTypes.SEARCH_CONFIG_NAME_SUCCESS
      );
      expect(action.payload).toEqual(listResponse);
    });
    it('should check correct type is used for SearchConfigNamefailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SearchConfigNameFailure(payload);

      expect(action.type).toEqual(
        ConversionConfigActionTypes.SEARCH_CONFIG_NAME_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
  describe('ResetConversionConfig TestCases', () => {
    it('should check correct type is used for SearchConfigName action ', () => {
      const action = new ResetConversionConfig();

      expect(action.type).toEqual(
        ConversionConfigActionTypes.RESET_CONVERSION_CONFIG
      );
    });
  });
  describe('UpdateToggleButton TestCases', () => {
    it('should check correct type is used for UpdateToggleButton action ', () => {
      const action = new UpdateToggleButton(updateStatusPayload);

      expect(action.type).toEqual(
        ConversionConfigActionTypes.UPDATE_TOGGLE_BUTTON
      );
      expect(action.payload).toEqual(updateStatusPayload);
    });
    it('should check correct type is used for UpdateToggleButtonSuccess action ', () => {
      const action = new UpdateToggleButtonSuccess();

      expect(action.type).toEqual(
        ConversionConfigActionTypes.UPDATE_TOGGLE_BUTTON_SUCCESS
      );
    });
    it('should check correct type is used for UpdateToggleButtonFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new UpdateToggleButtonFailure(payload);

      expect(action.type).toEqual(
        ConversionConfigActionTypes.UPDATE_TOGGLE_BUTTON_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('UpdateConversionConfigDetails TestCases', () => {
    it('should check correct type is used for UpdateConversionConfigDetails action ', () => {
      const action = new UpdateConversionConfigDetails(savePayload);

      expect(action.type).toEqual(
        ConversionConfigActionTypes.UPDATE_CONVERSION_CONFIG_DETAILS
      );
      expect(action.payload).toEqual(savePayload);
    });
    it('should check correct type is used for UpdateConversionConfigDetailsSuccess action ', () => {
      const action = new UpdateConversionConfigDetailsSuccess();

      expect(action.type).toEqual(
        ConversionConfigActionTypes.UPDATE_CONVERSION_CONFIG_DETAILS_SUCCESS
      );
    });
    it('should check correct type is used for UpdateConversionConfigDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new UpdateConversionConfigDetailsFailure(payload);

      expect(action.type).toEqual(
        ConversionConfigActionTypes.UPDATE_CONVERSION_CONFIG_DETAILS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
});
