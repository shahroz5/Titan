import {
  CustomErrors,
  ExcludeItemCodes,
  ExcludeItemCodesPayload,
  ExcludeThemeCodes,
  FileResponse,
  GepDetails,
  GEPDetailsPayload,
  GEPPurityConfigListPayload,
  GEPPurityConfigResponse,
  Lov,
  MetalType,
  ProductGroup,
  ProductGroupDeduction,
  ProductGroupsDeduction,
  PurityDetailsPayload,
  PurityDetailsResponse,
  Ranges,
  RemoveProductGroupDeduction,
  RemoveThemeCodesPayload,
  SaveThemeCodesPayload
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  DeleteThemeCodes,
  DeleteThemeCodesFailure,
  DeleteThemeCodesSuccess,
  GEPPurityConfigActionTypes,
  GetExcludeItemCodes,
  GetExcludeItemCodesFailure,
  GetExcludeItemCodesSuccess,
  GetExcludeThemeCodes,
  GetExcludeThemeCodesFailure,
  GetExcludeThemeCodesSuccess,
  ItemCodeErrorLogDownload,
  ItemCodeErrorLogDownloadFailure,
  ItemCodeErrorLogDownloadSuccess,
  LoadGepDetails,
  LoadGepDetailsFailure,
  LoadGepDetailsSuccess,
  LoadGEPPurityConfig,
  LoadGEPPurityConfigFailure,
  LoadGEPPurityConfigSuccess,
  LoadGepPurityDetails,
  LoadGepPurityDetailsFailure,
  LoadGepPurityDetailsSuccess,
  LoadGoldRanges,
  LoadGoldRangesFailure,
  LoadGoldRangesSuccess,
  LoadItemTypes,
  LoadItemTypesFailure,
  LoadItemTypesSuccess,
  LoadMetalTypes,
  LoadMetalTypesFailure,
  LoadMetalTypesSuccess,
  LoadPlatinumRanges,
  LoadPlatinumRangesFailure,
  LoadPlatinumRangesSuccess,
  LoadProductGroups,
  LoadProductGroupsDeduction,
  LoadProductGroupsDeductionFailure,
  LoadProductGroupsDeductionSuccess,
  LoadProductGroupsFailure,
  LoadProductGroupsSuccess,
  LoadSelectedPgs,
  LoadSelectedPgsFailure,
  LoadSelectedPgsSuccess,
  LoadSilverRanges,
  LoadSilverRangesFailure,
  LoadSilverRangesSuccess,
  RemoveProductGroups,
  RemoveProductGroupsFailure,
  RemoveProductGroupsSuccess,
  SaveGEPDetails,
  SaveGEPDetailsFailure,
  SaveGEPDetailsSuccess,
  SaveProductGroupsDeduction,
  SaveProductGroupsDeductionFailure,
  SaveProductGroupsDeductionSuccess,
  SavePurityDetails,
  SavePurityDetailsFailure,
  SavePurityDetailsSuccess,
  SaveThemeCodes,
  SaveThemeCodesFailure,
  SaveThemeCodesSuccess,
  SearchConfigName,
  SearchConfigNameFailure,
  SearchConfigNameSuccess,
  SearchItemCode,
  SearchItemCodeFailure,
  SearchItemCodeSucccess,
  SearchProductGroup,
  SearchProductGroupFailure,
  SearchProductGroupSuccess,
  UpdateToggleButton,
  UpdateToggleButtonFailure,
  UpdateToggleButtonSuccess,
  UploadFile,
  UploadFileFailure,
  UploadFileSuccess
} from './gep-purity-config.actions';

describe('GEPPuirtyConfig Actions Testing Suite', () => {
  const gepPurityConfigResponse: GEPPurityConfigResponse = {
    gepPurityConfigList: [
      {
        description: 'Configuration',
        isActive: true,
        type: 'GEP_ITEM'
      }
    ],
    totalElements: 0
  };
  const searchConfigName = {
    description: 'ABC',
    isActive: true,
    configId: 'abc123',
    createdDate: '28-08-1997'
  };
  const productGroupsDeduction: ProductGroupsDeduction[] = [
    {
      id: 'abc123',
      productGroupCode: '123',
      rangeId: '123',
      percentValue: '100',
      configId: 'abc123',
      rivaahAdditionalDiscount:'12'
    }
  ];
  const metalType: MetalType[] = [
    {
      materialTypeCode: 'M',
      description: 'material'
    }
  ];
  const itemTypes: Lov[] = [
    {
      code: 'M',
      value: 'material',
      isActive: true
    }
  ];
  const ranges: Ranges[] = [
    {
      fromRange: 12,
      toRange: 20,
      range: '100',
      id: 'abc12',
      isActive: true
    }
  ];
  const saveGEPDetails: GEPDetailsPayload = {
    gepConfiguration: {
      description: 'Configuration',
      isActive: true
    },
    gepDetails: {
      offerDetails: {
        gepCNUtilizationPercentage: 12,
        gepDiscountStartDate: 12,
        gepDiscountEndDate: 12,
        daysForGEPCNAfterOffer: 12,
        daysForGRNAndRebillingAfterOffer: 12,
        grnCNUtilizationPercentage: 12,
        isRivaah: true
      },
      configDetails: {
        gepDaysAfterCOOffer: 12,
        gepDaysAfterABOffer: 12,
        minKaratAccepted: 12,
        gepDiscountDeductionAmt: true,
        gepAsPayment: true,
        baseKaratForPurity: 12,
        holdTime: 12,
        isPreMeltingDetailsMandatory: true
      },
      description: 'Configuration',
      isActive: true,
      isOfferEnabled: true
    },

    configId: '123'
  };
  const excludeThemeCodes: ExcludeThemeCodes[] = [
    {
      configId: 'abc123',
      id: '12',
      isActive: true,
      themeCode: '1'
    }
  ];
  const excludeItemCodes: ExcludeItemCodes[] = [
    {
      configId: 'abc123',
      id: '12',
      isActive: true,
      itemCode: '1'
    }
  ];
  const removeProductGroups: RemoveProductGroupDeduction = {
    configId: 'abc123',
    deleteProductGroup: {
      addProductGroups: [],
      addRanges: [
        {
          rangeId: 'abc123',
          percentValue: 100
        }
      ],
      removeProductGroups: ['71']
    }
  };

  const productGroups: ProductGroup[] = [
    {
      description: 'ProductGroup',
      productGroupCode: 'p'
    }
  ];
  const gepDetails: GepDetails = {
    offerDetails: {
      gepCNUtilizationPercentage: 12,
      gepDiscountStartDate: 12,
      gepDiscountEndDate: 12,
      daysForGEPCNAfterOffer: 12,
      daysForGRNAndRebillingAfterOffer: 12,
      grnCNUtilizationPercentage: 12,
      isRivaah: true
    },
    configDetails: {
      gepDaysAfterCOOffer: 12,
      gepDaysAfterABOffer: 12,
      minKaratAccepted: 12,
      gepDiscountDeductionAmt: true,
      gepAsPayment: true,
      baseKaratForPurity: 12,
      holdTime: 12,
      isPreMeltingDetailsMandatory: true
    },
    description: 'Configuration',
    isActive: true,
    isOfferEnabled: true,
    configId: '123'
  };
  const savePurityDetails: PurityDetailsPayload = {
    configuration: {
      description: 'Configuration',
      isActive: true
    },
    purityDetails: {
      addConfigDetails: [
        {
          deductionPercent: 12,
          endDate: 16000000,
          itemType: 'item',
          metalType: 'metal',
          rangeId: '123',
          schemePercent: 100,
          startDate: 1600000,
          id: 'abc123'
        }
      ],
      removeConfigDetails: [],
      updateConfigDetails: [
        {
          deductionPercent: 12,
          endDate: 16000000,
          itemType: 'item',
          metalType: 'metal',
          rangeId: '123',
          schemePercent: 100,
          startDate: 1600000,
          id: 'abc123'
        }
      ]
    },
    configId: 'abc123'
  };
  const uploadFile: ExcludeItemCodesPayload = {
    gepConfiguration: {
      description: 'Configuration',
      isActive: true,
      type: 'GEP_ITEM'
    },
    uploadPayload: {
      configId: 'abc123',
      type: 'GEP_ITEM',
      formData: null
    }
  };
  const fileResponse: FileResponse = {
    totalCount: 12,
    successCount: 12,
    failureCount: 0,
    errorLogId: {},
    hasError: false
  };
  const purityDetailsResponse: PurityDetailsResponse[] = [
    {
      rangeId: 'abc123',
      deductionPercent: 100,
      schemePercent: 100,
      startDate: 600000,
      endDate: 5555555,
      metalType: 'metal',
      itemType: 'item',
      id: 'abc123',
      configId: 'abc123'
    }
  ];
  const excludeItemCodesPayload: ExcludeItemCodes[] = [
    {
      configId: 'abc123',
      id: '12',
      isActive: true,
      itemCode: '1'
    }
  ];
  const saveThemeCodesPayload: SaveThemeCodesPayload = {
    saveThemeCodes: {
      addThemes: ['1'],
      removeThemes: ['2']
    },
    config: {
      description: 'Configuration',
      isActive: true
    },
    configId: 'abc123'
  };
  const removeThemeCodes: RemoveThemeCodesPayload = {
    configId: 'abc123',
    deleteThemeCode: {
      addThemes: [],
      removeThemes: ['1']
    }
  };
  const saveProductGroupsDeduction: ProductGroupDeduction = {
    config: {
      description: 'Configuration',
      isActive: true
    },
    productGroups: {
      addProductGroups: [{ productGroupCode: '71', configDetails: {} }],
      addRanges: [
        {
          rangeId: 'abc123',
          percentValue: 100
        }
      ],
      removeProductGroups: []
    },
    configId: 'abc123'
  };

  describe('LoadGEPPurityConfig Testing Suite', () => {
    it('should check correct type is used for LoadGEPPurityConfig action ', () => {
      const payload: GEPPurityConfigListPayload = {
        pageIndex: 0,
        pageSize: 100,
        type: 'GEP_ITEM',
        description: 'Configuration'
      };
      const action = new LoadGEPPurityConfig(payload);

      expect(action.type).toEqual(
        GEPPurityConfigActionTypes.LOAD_GEP_PURITY_CONFIG_LIST
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for LoadGEPPurityConfigSuccess action ', () => {
      const action = new LoadGEPPurityConfigSuccess(gepPurityConfigResponse);

      expect(action.type).toEqual(
        GEPPurityConfigActionTypes.LOAD_GEP_PURITY_CONFIG_LIST_SUCCESS
      );
      expect(action.payload).toEqual(gepPurityConfigResponse);
    });
    it('should check correct type is used for LoadGEPPurityConfigFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadGEPPurityConfigFailure(payload);

      expect(action.type).toEqual(
        GEPPurityConfigActionTypes.LOAD_GEP_PURITY_CONFIG_LIST_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
  describe('SearchConfigName TestCases', () => {
    it('should check correct type is used for SearchConfigName action ', () => {
      const searchPayload = {
        configName: 'Configuration',
        type: 'GEP_ITEM'
      };
      const action = new SearchConfigName(searchPayload);

      expect(action.type).toEqual(
        GEPPurityConfigActionTypes.SEARCH_CONFIG_NAME
      );
      expect(action.payload).toEqual(searchPayload);
    });
    it('should check correct type is used for SearchConfigNameSuccess action ', () => {
      const action = new SearchConfigNameSuccess([searchConfigName]);

      expect(action.type).toEqual(
        GEPPurityConfigActionTypes.SEARCH_CONFIG_NAME_SUCCESS
      );
      expect(action.payload).toEqual([searchConfigName]);
    });
    it('should check correct type is used for SearchConfigNameFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SearchConfigNameFailure(payload);

      expect(action.type).toEqual(
        GEPPurityConfigActionTypes.SEARCH_CONFIG_NAME_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
  describe('SaveGEPDetails TestCases', () => {
    it('should check correct type is used for SaveGEPDetails action ', () => {
      const action = new SaveGEPDetails(saveGEPDetails);

      expect(action.type).toEqual(GEPPurityConfigActionTypes.SAVE_GEP_DETAILS);
      expect(action.payload).toEqual(saveGEPDetails);
    });
    it('should check correct type is used for SaveGEPDetailsSuccess action ', () => {
      const action = new SaveGEPDetailsSuccess(gepDetails);

      expect(action.type).toEqual(
        GEPPurityConfigActionTypes.SAVE_GEP_DETAILS_SUCCESS
      );
      expect(action.payload).toEqual(gepDetails);
    });
    it('should check correct type is used for SaveGEPDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SaveGEPDetailsFailure(payload);

      expect(action.type).toEqual(
        GEPPurityConfigActionTypes.SAVE_GEP_DETAILS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
  describe('LoadMetalTypes TestCases', () => {
    it('should check correct type is used for LoadMetalTypes action ', () => {
      const action = new LoadMetalTypes();

      expect(action.type).toEqual(GEPPurityConfigActionTypes.LOAD_METAL_TYPES);
    });
    it('should check correct type is used for LoadMetalTypesSuccess action ', () => {
      const action = new LoadMetalTypesSuccess(metalType);

      expect(action.type).toEqual(
        GEPPurityConfigActionTypes.LOAD_METAL_TYPES_SUCCESS
      );
      expect(action.payload).toEqual(metalType);
    });
    it('should check correct type is used for LoadMetalTypesFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadMetalTypesFailure(payload);

      expect(action.type).toEqual(
        GEPPurityConfigActionTypes.LOAD_METAL_TYPES_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
  describe('LoadItemTypes Testing', () => {
    it('should check correct type is used for LoadItemTypes action ', () => {
      const action = new LoadItemTypes();

      expect(action.type).toEqual(GEPPurityConfigActionTypes.LOAD_ITEM_TYPES);
    });
    it('should check correct type is used for LoadItemTypesSuccess action ', () => {
      const action = new LoadItemTypesSuccess(itemTypes);

      expect(action.type).toEqual(
        GEPPurityConfigActionTypes.LOAD_ITEM_TYPES_SUCCESS
      );
      expect(action.payload).toEqual(itemTypes);
    });
    it('should check correct type is used for LoadItemTypesFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadItemTypesFailure(payload);

      expect(action.type).toEqual(
        GEPPurityConfigActionTypes.LOAD_ITEM_TYPES_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
  describe('LoadRanges TestCases', () => {
    it('should check correct type is used for LoadRanges action ', () => {
      const action = new LoadGoldRanges('GEP_GOLD');

      expect(action.type).toEqual(GEPPurityConfigActionTypes.LOAD_GOLD_RANGES);
      expect(action.payload).toEqual('GEP_GOLD');
    });
    it('should check correct type is used for LoadRangesSuccess action ', () => {
      const action = new LoadGoldRangesSuccess(ranges);

      expect(action.type).toEqual(
        GEPPurityConfigActionTypes.LOAD_GOLD_RANGES_SUCCESS
      );
      expect(action.payload).toEqual(ranges);
    });
    it('should check correct type is used for LoadRangesFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadGoldRangesFailure(payload);

      expect(action.type).toEqual(
        GEPPurityConfigActionTypes.LOAD_GOLD_RANGES_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
  describe('SavePurityDetails TestCases', () => {
    it('should check correct type is used for SavePurityDetails action ', () => {
      const action = new SavePurityDetails(savePurityDetails);

      expect(action.type).toEqual(
        GEPPurityConfigActionTypes.SAVE_PURITY_DETAILS
      );
      expect(action.payload).toEqual(savePurityDetails);
    });
    it('should check correct type is used for SavePurityDetailsSuccess action ', () => {
      const action = new SavePurityDetailsSuccess(purityDetailsResponse);

      expect(action.type).toEqual(
        GEPPurityConfigActionTypes.SAVE_PURITY_DETAILS_SUCCESS
      );
      expect(action.payload).toEqual(purityDetailsResponse);
    });
    it('should check correct type is used for SavePurityDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SavePurityDetailsFailure(payload);

      expect(action.type).toEqual(
        GEPPurityConfigActionTypes.SAVE_PURITY_DETAILS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
  describe('UploadFile TestCases', () => {
    it('should check correct type is used for UploadFile action ', () => {
      const action = new UploadFile(uploadFile);

      expect(action.type).toEqual(GEPPurityConfigActionTypes.UPLOAD_FILE);
      expect(action.payload).toEqual(uploadFile);
    });
    it('should check correct type is used for UploadFileSuccess action ', () => {
      const action = new UploadFileSuccess({
        fileResponse: fileResponse,
        configId: 'abc123'
      });

      expect(action.type).toEqual(
        GEPPurityConfigActionTypes.UPLOAD_FILE_SUCCESS
      );
      expect(action.payload).toEqual({
        fileResponse: fileResponse,
        configId: 'abc123'
      });
    });
    it('should check correct type is used for UploadFileFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new UploadFileFailure(payload);

      expect(action.type).toEqual(
        GEPPurityConfigActionTypes.UPLOAD_FILE_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
  describe('GetExcludeThemeCodes TestCases', () => {
    it('should check correct type is used for GetExcludeThemeCodes action ', () => {
      const action = new GetExcludeThemeCodes('abc123');

      expect(action.type).toEqual(
        GEPPurityConfigActionTypes.GET_EXCLUDE_THEME_CODES
      );
      expect(action.payload).toEqual('abc123');
    });
    it('should check correct type is used for GetExcludeThemeCodesSucess action ', () => {
      const action = new GetExcludeThemeCodesSuccess(excludeThemeCodes);

      expect(action.type).toEqual(
        GEPPurityConfigActionTypes.GET_EXCLUDE_THEME_CODES_SUCCESS
      );
      expect(action.payload).toEqual(excludeThemeCodes);
    });
    it('should check correct type is used for GetExcludeThemeCodesFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new GetExcludeThemeCodesFailure(payload);

      expect(action.type).toEqual(
        GEPPurityConfigActionTypes.GET_EXCLUDE_THEME_CODES_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
  describe('GetExcludeItemCodes TestCases', () => {
    it('should check correct type is used for GetExcludeItemCodes action ', () => {
      const action = new GetExcludeItemCodes({
        configId: 'abc123',
        pageIndex: 0,
        pageSize: 100
      });

      expect(action.type).toEqual(
        GEPPurityConfigActionTypes.GET_EXCLUDE_ITEM_CODES
      );
      expect(action.payload).toEqual({
        configId: 'abc123',
        pageIndex: 0,
        pageSize: 100
      });
    });
    it('should check correct type is used for GetExcludeItemCodesSuccess action ', () => {
      const action = new GetExcludeItemCodesSuccess({
        itemCodes: excludeItemCodes,
        totalElements: 0
      });

      expect(action.type).toEqual(
        GEPPurityConfigActionTypes.GET_EXCLUDE_ITEM_CODES_SUCCESS
      );
      expect(action.payload).toEqual({
        itemCodes: excludeItemCodes,
        totalElements: 0
      });
    });
    it('should check correct type is used for GetExcludeItemCodesFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new GetExcludeItemCodesFailure(payload);

      expect(action.type).toEqual(
        GEPPurityConfigActionTypes.GET_EXCLUDE_ITEM_CODES_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
  describe('LoadProductGroups TestCases', () => {
    it('should check correct type is used for LoadProductGroups action ', () => {
      const action = new LoadProductGroups();

      expect(action.type).toEqual(
        GEPPurityConfigActionTypes.LOAD_PRODUCT_GROUPS
      );
    });
    it('should check correct type is used for LoadProductGroupsSuccess action ', () => {
      const action = new LoadProductGroupsSuccess(productGroups);

      expect(action.type).toEqual(
        GEPPurityConfigActionTypes.LOAD_PRODUCT_GROUPS_SUCCESS
      );
      expect(action.payload).toEqual(productGroups);
    });
    it('should check correct type is used for LoadProductGroupsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadProductGroupsFailure(payload);

      expect(action.type).toEqual(
        GEPPurityConfigActionTypes.LOAD_PRODUCT_GROUPS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
  describe('SearchProductGroup TestCases', () => {
    it('should check correct type is used for SearchProductGroup action ', () => {
      const action = new SearchProductGroup({
        searchValue: 'configuration',
        configId: 'abc123'
      });

      expect(action.type).toEqual(
        GEPPurityConfigActionTypes.SEARCH_PRODUCT_GROUP
      );
      expect(action.payload).toEqual({
        searchValue: 'configuration',
        configId: 'abc123'
      });
    });
    it('should check correct type is used for SearchProductGroupSuccess action ', () => {
      const action = new SearchProductGroupSuccess(productGroupsDeduction);

      expect(action.type).toEqual(
        GEPPurityConfigActionTypes.SEARCH_PRODUCT_GROUP_SUCCESS
      );
      expect(action.payload).toEqual(productGroupsDeduction);
    });
    it('should check correct type is used for SearchProductGroupFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SearchProductGroupFailure(payload);

      expect(action.type).toEqual(
        GEPPurityConfigActionTypes.SEARCH_PRODUCT_GROUP_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
  describe('SaveProductGroupsDeduction TestCases', () => {
    it('should check correct type is used for SaveProductGroupsDeduction action ', () => {
      const action = new SaveProductGroupsDeduction(saveProductGroupsDeduction);

      expect(action.type).toEqual(
        GEPPurityConfigActionTypes.SAVE_PRODUCT_GROUPS_DEDUCTION
      );
      expect(action.payload).toEqual(saveProductGroupsDeduction);
    });
    it('should check correct type is used for SaveProductGroupsDeductionSuccess action ', () => {
      const action = new SaveProductGroupsDeductionSuccess('abc123');

      expect(action.type).toEqual(
        GEPPurityConfigActionTypes.SAVE_PRODUCT_GROUPS_DEDUCTION_SUCCESS
      );
      expect(action.payload).toEqual('abc123');
    });
    it('should check correct type is used for SaveProductGroupsDeductionFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SaveProductGroupsDeductionFailure(payload);

      expect(action.type).toEqual(
        GEPPurityConfigActionTypes.SAVE_PRODUCT_GROUPS_DEDUCTION_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
  describe('LoadGepPurityDetails TestCases', () => {
    it('should check correct type is used for LoadGepPurityDetails action ', () => {
      const action = new LoadGepPurityDetails('abc123');

      expect(action.type).toEqual(
        GEPPurityConfigActionTypes.LOAD_GEP_PURITY_DETAILS
      );
      expect(action.payload).toEqual('abc123');
    });
    it('should check correct type is used for LoadGepPurityDetailsSuccess action ', () => {
      const action = new LoadGepPurityDetailsSuccess(purityDetailsResponse);

      expect(action.type).toEqual(
        GEPPurityConfigActionTypes.LOAD_GEP_PURITY_DETAILS_SUCCESS
      );
      expect(action.payload).toEqual(purityDetailsResponse);
    });
    it('should check correct type is used for LoadGepPurityDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadGepPurityDetailsFailure(payload);

      expect(action.type).toEqual(
        GEPPurityConfigActionTypes.LOAD_GEP_PURITY_DETAILS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
  describe('LoadGEPDetails', () => {
    it('should check correct type is used for LoadGEPDetails action ', () => {
      const action = new LoadGepDetails('abc123');

      expect(action.type).toEqual(GEPPurityConfigActionTypes.LOAD_GEP_DETAILS);
      expect(action.payload).toEqual('abc123');
    });
    it('should check correct type is used for LoadGEPDetailsSuccess action ', () => {
      const action = new LoadGepDetailsSuccess(gepDetails);

      expect(action.type).toEqual(
        GEPPurityConfigActionTypes.LOAD_GEP_DETAILS_SUCCESS
      );
      expect(action.payload).toEqual(gepDetails);
    });

    it('should check correct type is used for LoadGepPurityDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadGepDetailsFailure(payload);

      expect(action.type).toEqual(
        GEPPurityConfigActionTypes.LOAD_GEP_DETAILS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
  describe('LoadProductGroupsDeduction TestCases', () => {
    it('should check correct type is used for LoadProductGroupsDeduction action ', () => {
      const action = new LoadProductGroupsDeduction({
        configId: 'abc123',
        pageIndex: 0,
        pageSize: 10
      });

      expect(action.type).toEqual(
        GEPPurityConfigActionTypes.LOAD_PRODUCT_GROUPS_DEUCTION
      );
      expect(action.payload).toEqual({
        configId: 'abc123',
        pageIndex: 0,
        pageSize: 10
      });
    });
    it('should check correct type is used for LoadProductGroupsDeductionSuccess action ', () => {
      const action = new LoadProductGroupsDeductionSuccess({
        productGroupsDeduction: productGroupsDeduction,
        count: 0
      });

      expect(action.type).toEqual(
        GEPPurityConfigActionTypes.LOAD_PRODUCT_GROUPS_DEUCTION_SUCCESS
      );
      expect(action.payload).toEqual({
        productGroupsDeduction: productGroupsDeduction,
        count: 0
      });
    });
    it('should check correct type is used for LoadProductGroupsDeductionFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadProductGroupsDeductionFailure(payload);

      expect(action.type).toEqual(
        GEPPurityConfigActionTypes.LOAD_PRODUCT_GROUPS_DEUCTION_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
  describe('SaveThemeCodes TestCases', () => {
    it('should check correct type is used for SaveThemeCodes action ', () => {
      const action = new SaveThemeCodes(saveThemeCodesPayload);

      expect(action.type).toEqual(GEPPurityConfigActionTypes.SAVE_THEME_CODES);
      expect(action.payload).toEqual(saveThemeCodesPayload);
    });
    it('should check correct type is used for SaveThemeCodesSuccess action ', () => {
      const action = new SaveThemeCodesSuccess('abc123');

      expect(action.type).toEqual(
        GEPPurityConfigActionTypes.SAVE_THEME_CODES_SUCCESS
      );
      expect(action.payload).toEqual('abc123');
    });
    it('should check correct type is used for SaveThemeCodesFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SaveThemeCodesFailure(payload);

      expect(action.type).toEqual(
        GEPPurityConfigActionTypes.SAVE_THEME_CODES_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
  describe('DeleteThemeCodes TestCases', () => {
    it('should check correct type is used for DeleteThemeCodes action ', () => {
      const action = new DeleteThemeCodes(removeThemeCodes);

      expect(action.type).toEqual(
        GEPPurityConfigActionTypes.DELETE_THEME_CODES
      );
      expect(action.payload).toEqual(removeThemeCodes);
    });
    it('should check correct type is used for DeleteThemeCodesSuccess action ', () => {
      const action = new DeleteThemeCodesSuccess();

      expect(action.type).toEqual(
        GEPPurityConfigActionTypes.DELETE_THEME_CODES_SUCCESS
      );
    });
    it('should check correct type is used for DeleteThemeCodesFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new DeleteThemeCodesFailure(payload);

      expect(action.type).toEqual(
        GEPPurityConfigActionTypes.DELETE_THEME_CODES_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
  describe('SearchItemCode TestCases', () => {
    it('should check correct type is used for SearchItemCode action ', () => {
      const action = new SearchItemCode({
        configId: 'abc123',
        itemCode: '123'
      });

      expect(action.type).toEqual(GEPPurityConfigActionTypes.SEARCH_ITEM_CODE);
      expect(action.payload).toEqual({
        configId: 'abc123',
        itemCode: '123'
      });
    });

    it('should check correct type is used for SearchItemCodeSuccess action ', () => {
      const action = new SearchItemCodeSucccess(excludeItemCodes);

      expect(action.type).toEqual(
        GEPPurityConfigActionTypes.SEARCH_ITEM_CODE_SUCCESS
      );
      expect(action.payload).toEqual(excludeItemCodes);
    });
    it('should check correct type is used for SearchItemCodeFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SearchItemCodeFailure(payload);

      expect(action.type).toEqual(
        GEPPurityConfigActionTypes.SEARCH_ITEM_CODE_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
  describe('ItemCodeErrorLogDownload TestCases', () => {
    it('should check correct type is used for ItemCodeErrorLogDownload action ', () => {
      const action = new ItemCodeErrorLogDownload('abc123');

      expect(action.type).toEqual(
        GEPPurityConfigActionTypes.ITEM_CODES_ERROR_LOG_DOWNLOAD
      );
      expect(action.payload).toEqual('abc123');
    });
    it('should check correct type is used for ItemCodeErrorLogDownloadSuccess action ', () => {
      const action = new ItemCodeErrorLogDownloadSuccess({});

      expect(action.type).toEqual(
        GEPPurityConfigActionTypes.ITEM_CODES_ERROR_LOG_DOWNLOAD_SUCCESS
      );
      expect(action.payload).toEqual({});
    });
    it('should check correct type is used for ItemCodeErrorLogDownloadFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new ItemCodeErrorLogDownloadFailure(payload);

      expect(action.type).toEqual(
        GEPPurityConfigActionTypes.ITEM_CODES_ERROR_LOG_DOWNLOAD_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
  describe('RemoveProductGroups TestCases', () => {
    it('should check correct type is used for RemoveProductGroups action ', () => {
      const action = new RemoveProductGroups(removeProductGroups);

      expect(action.type).toEqual(
        GEPPurityConfigActionTypes.REMOVE_PRODUCT_GROUP
      );
      expect(action.payload).toEqual(removeProductGroups);
    });
    it('should check correct type is used for RemoveProductGroupsSuccess action ', () => {
      const action = new RemoveProductGroupsSuccess();

      expect(action.type).toEqual(
        GEPPurityConfigActionTypes.REMOVE_PRODUCT_GROUP_SUCCESS
      );
    });
    it('should check correct type is used for RemoveProductGroupsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new RemoveProductGroupsFailure(payload);

      expect(action.type).toEqual(
        GEPPurityConfigActionTypes.REMOVE_PRODUCT_GROUP_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('LoadSilverRanges TestCases', () => {
    it('should check correct type is used for LoadSilverRanges action ', () => {
      const action = new LoadSilverRanges('GEP_SILVER');

      expect(action.type).toEqual(
        GEPPurityConfigActionTypes.LOAD_SILVER_RANGES
      );
      expect(action.payload).toEqual('GEP_SILVER');
    });
    it('should check correct type is used for LoadSilverRangesSuccess action ', () => {
      const action = new LoadSilverRangesSuccess(ranges);

      expect(action.type).toEqual(
        GEPPurityConfigActionTypes.LOAD_SILVER_RANGES_SUCCESS
      );
      expect(action.payload).toEqual(ranges);
    });
    it('should check correct type is used for LoadSilverRangesFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadSilverRangesFailure(payload);

      expect(action.type).toEqual(
        GEPPurityConfigActionTypes.LOAD_SILVER_RANGES_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('LoadPlatinumRanges TestCases', () => {
    it('should check correct type is used for LoadPlatinumRanges action ', () => {
      const action = new LoadPlatinumRanges('GEP_PLATINUM');

      expect(action.type).toEqual(
        GEPPurityConfigActionTypes.LOAD_PLATINUM_RANGES
      );
      expect(action.payload).toEqual('GEP_PLATINUM');
    });
    it('should check correct type is used for LoadPlatinumRangesSuccess action ', () => {
      const action = new LoadPlatinumRangesSuccess(ranges);

      expect(action.type).toEqual(
        GEPPurityConfigActionTypes.LOAD_PLATINUM_RANGES_SUCCESS
      );
      expect(action.payload).toEqual(ranges);
    });
    it('should check correct type is used for LoadPlatinumRangesFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadPlatinumRangesFailure(payload);

      expect(action.type).toEqual(
        GEPPurityConfigActionTypes.LOAD_PLATINUM_RANGES_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('LoadSelectedPgs TestCases', () => {
    it('should check correct type is used for LoadSelectedPgs action ', () => {
      const action = new LoadSelectedPgs({
        configId: 'abc123',
        pageIndex: 0,
        pageSize: 10
      });

      expect(action.type).toEqual(
        GEPPurityConfigActionTypes.LOAD_SELETED_PRODUCT_GROUPS
      );
      expect(action.payload).toEqual({
        configId: 'abc123',
        pageIndex: 0,
        pageSize: 10
      });
    });
    it('should check correct type is used for LoadSelectedPgsSuccess action ', () => {
      const response = {
        response: null,
        totalElements: 0
      };
      const action = new LoadSelectedPgsSuccess(response);

      expect(action.type).toEqual(
        GEPPurityConfigActionTypes.LOAD_SELETED_PRODUCT_GROUPS_SUCCESS
      );
      expect(action.payload).toEqual(response);
    });
    it('should check correct type is used for LoadSelectedPgsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadSelectedPgsFailure(payload);

      expect(action.type).toEqual(
        GEPPurityConfigActionTypes.LOAD_SELETED_PRODUCT_GROUPS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('UpdateToggleButton TestCases', () => {
    it('should check correct type is used for UpdateToggleButton action ', () => {
      const action = new UpdateToggleButton({
        configId: 'abc123',
        isActive: true
      });

      expect(action.type).toEqual(
        GEPPurityConfigActionTypes.UPDATE_TOGGLE_BUTTON
      );
      expect(action.payload).toEqual({
        configId: 'abc123',
        isActive: true
      });
    });
    it('should check correct type is used for UpdateToggleButtonSuccess action ', () => {
      const action = new UpdateToggleButtonSuccess();

      expect(action.type).toEqual(
        GEPPurityConfigActionTypes.UPDATE_TOGGLE_BUTTON_SUCCESS
      );
      //expect(action.payload).toEqual(ranges);
    });
    it('should check correct type is used for UpdateToggleButtonFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new UpdateToggleButtonFailure(payload);

      expect(action.type).toEqual(
        GEPPurityConfigActionTypes.UPDATE_TOGGLE_BUTTON_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
});
