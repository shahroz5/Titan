import {
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
  SaveThemeCodesPayload,
  SearchProdcutGroup
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import * as actions from './gep-purity-config.actions';
import {
  GEPPurityConfigReducer,
  initialState
} from './gep-purity-config.reducer';

describe('GEPPurityConfig Reducer Testing', () => {
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
  const range: Ranges[] = [
    {
      fromRange: 12,
      toRange: 20,
      range: '100',
      id: 'abc12',
      isActive: true
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
  const productGroupsDeduction: ProductGroupsDeduction[] = [
    {
      id: 'abc123',
      productGroupCode: '123',
      rangeId: '123',
      percentValue: '100',
      configId: 'abc123',
      rivaahAdditionalDiscount: '12'
    }
  ];
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
  const productGroups: ProductGroup[] = [
    {
      description: 'ProductGroup',
      productGroupCode: 'p'
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
  describe('LoadGEPPurityConfig Reducer Testing', () => {
    it('LoadGEPPurityConfig should return proepr state', () => {
      const payload: GEPPurityConfigListPayload = {
        pageIndex: 0,
        pageSize: 100,
        type: 'GEP_ITEM',
        description: 'Configuration'
      };

      const action = new actions.LoadGEPPurityConfig(payload);

      const result = GEPPurityConfigReducer(initialState, action);

      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });
    it('LoadGEPPurityConfigSuccess should return proepr state', () => {
      const action = new actions.LoadGEPPurityConfigSuccess(
        gepPurityConfigResponse
      );

      const result = GEPPurityConfigReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.GEPPurityConfigList).toBe(
        gepPurityConfigResponse.gepPurityConfigList
      );
      expect(result.totalElements).toBe(gepPurityConfigResponse.totalElements);
    });
    it('LoadGEPPurityConfigFailure should return error', () => {
      const action = new actions.LoadGEPPurityConfigFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result = GEPPurityConfigReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
    });
  });
  describe('SearchConfigName Reducer Testing', () => {
    it('SearchConfigName should return proepr state', () => {
      const payload = {
        configName: 'Configuration',
        type: 'GEP_ITEM'
      };

      const action = new actions.SearchConfigName(payload);

      const result = GEPPurityConfigReducer(initialState, action);

      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });
    it('SearchConfigNameSuccess should return proepr state', () => {
      const searchConfigName = [
        {
          description: 'ABC',
          isActive: true,
          configId: 'abc123',
          createdDate: '28-08-1997'
        }
      ];
      const action = new actions.SearchConfigNameSuccess(searchConfigName);

      const result = GEPPurityConfigReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.GEPPurityConfigList).toBe(searchConfigName);
      expect(result.totalElements).toBe(0);
    });
    it('SearchConfigNameFailure should return error', () => {
      const action = new actions.SearchConfigNameFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result = GEPPurityConfigReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
    });
  });
  describe('SaveGEPDetails Reducer Testing', () => {
    it('SaveGEPDetails should return proepr state', () => {
      const action = new actions.SaveGEPDetails(saveGEPDetails);

      const result = GEPPurityConfigReducer(initialState, action);

      expect(result.isLoading).toBe(true);
      expect(result.hasGEPDetailsSaved).toBe(false);
    });
    it('SaveGEPDetailsDetailsSuccess should return proepr state', () => {
      const action = new actions.SaveGEPDetailsSuccess(gepDetails);

      const result = GEPPurityConfigReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.hasGEPDetailsSaved).toBe(true);
      expect(result.gepDetails).toBe(gepDetails);
      expect(result.configId).toBe(action.payload.configId);
    });

    it('SaveGEPDetailsDetailsFailure should return error', () => {
      const action = new actions.SaveGEPDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result = GEPPurityConfigReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
      expect(result.hasGEPDetailsSaved).toEqual(false);
    });
  });
  describe('LoadMetalTypes Reducer Testing', () => {
    it('LoadMetalTypes should return proepr state', () => {
      const action = new actions.LoadMetalTypes();

      const result = GEPPurityConfigReducer(initialState, action);
      expect(result.isLoading).toBe(true);
      expect(result.hasGEPDetailsSaved).toBe(false);
    });
    it('LoadMetalTypesSuccess should return proepr state', () => {
      const action = new actions.LoadMetalTypesSuccess(metalType);

      const result = GEPPurityConfigReducer(initialState, action);
      expect(result.isLoading).toBe(false);
      expect(result.metalType).toBe(metalType);
    });
    it('LoadMetalTypesFailure should return error', () => {
      const action = new actions.LoadMetalTypesFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result = GEPPurityConfigReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
    });
  });
  describe('LoadItemTypes Reducer Testing', () => {
    it('LoadItemTypes should return proepr state', () => {
      const action = new actions.LoadItemTypes();

      const result = GEPPurityConfigReducer(initialState, action);
      expect(result.isLoading).toBe(true);
      expect(result.hasGEPDetailsSaved).toBe(false);
    });
    it('LoadItemTypesSuccess should return proepr state', () => {
      const action = new actions.LoadItemTypesSuccess(itemTypes);

      const result = GEPPurityConfigReducer(initialState, action);
      expect(result.isLoading).toBe(false);
      expect(result.itemType).toBe(itemTypes);
    });
    it('LoadItemTypesFailure should return error', () => {
      const action = new actions.LoadItemTypesFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result = GEPPurityConfigReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
    });
  });
  describe('LoadRanges Reducer Testing', () => {
    it('LoadRanges should return proepr state', () => {
      const action = new actions.LoadGoldRanges('GEP_PURITY_GOLD');

      const result = GEPPurityConfigReducer(initialState, action);
      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });
    it('LoadRangesSuccess should return proepr state', () => {
      const action = new actions.LoadGoldRangesSuccess(range);

      const result = GEPPurityConfigReducer(initialState, action);
      expect(result.isLoading).toBe(false);
      expect(result.goldRanges).toBe(range);
    });
    it('LoadRangesFailure should return error', () => {
      const action = new actions.LoadGoldRangesFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result = GEPPurityConfigReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
    });
  });
  describe('SavePurityDetails Reducer Testing', () => {
    it('SavePurityDetails should return proepr state', () => {
      const action = new actions.SavePurityDetails(savePurityDetails);

      const result = GEPPurityConfigReducer(initialState, action);
      expect(result.isLoading).toBe(true);
      expect(result.hasPurityDetailsSaved).toBe(false);
    });
    it('SavePurityDetailsSuccess should return proepr state', () => {
      const action = new actions.SavePurityDetailsSuccess(
        purityDetailsResponse
      );

      const result = GEPPurityConfigReducer(initialState, action);
      expect(result.isLoading).toBe(false);
      expect(result.hasPurityDetailsSaved).toBe(true);
      expect(result.configId).toBe(
        purityDetailsResponse[0].configId
          ? purityDetailsResponse[0].configId
          : null
      );
      expect(result.purityDetails).toBe(purityDetailsResponse);
    });
    it('SavePurityDetailsFailure should return error', () => {
      const action = new actions.SavePurityDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result = GEPPurityConfigReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
      expect(result.hasPurityDetailsSaved).toEqual(false);
    });
  });
  describe('UploadFile Reducer Testing', () => {
    it('UploadFile should return proepr state', () => {
      const action = new actions.UploadFile(uploadFile);

      const result = GEPPurityConfigReducer(initialState, action);
      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });
    it('UploadFileSuccess should return proepr state', () => {
      const fileOutput = {
        fileResponse: fileResponse,
        configId: 'anc123'
      };
      const action = new actions.UploadFileSuccess(fileOutput);

      const result = GEPPurityConfigReducer(initialState, action);
      expect(result.isLoading).toBe(false);
      expect(result.fileResponse).toBe(fileOutput.fileResponse);
      expect(result.configId).toBe(fileOutput.configId);
    });
    it('UploadFileFailure should return error', () => {
      const action = new actions.UploadFileFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result = GEPPurityConfigReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
    });
  });
  describe('GetExcludeThemeCodes Reducer Testing', () => {
    it('GetExcludeThemeCodes should return proepr state', () => {
      const action = new actions.GetExcludeThemeCodes('abc123');

      const result = GEPPurityConfigReducer(initialState, action);
      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });

    it('GetExcludeThemeCodesSuccess should return proepr state', () => {
      const action = new actions.GetExcludeThemeCodesSuccess(excludeThemeCodes);

      const result = GEPPurityConfigReducer(initialState, action);
      expect(result.isLoading).toBe(false);
      expect(result.excludeThemeCodes).toBe(excludeThemeCodes);
    });
    it('GetExcludeThemeCodesFailure should return error', () => {
      const action = new actions.GetExcludeThemeCodesFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result = GEPPurityConfigReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
    });
  });
  describe('GetExcludeItemCodes Reducer Testing', () => {
    const payload = { configId: 'abc123', pageIndex: 1, pageSize: 10 };
    it('GetExcludeItemCodes should return proepr state', () => {
      const action = new actions.GetExcludeItemCodes(payload);

      const result = GEPPurityConfigReducer(initialState, action);
      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });
    it('GetExcludeItemCodesSuccess should return proepr state', () => {
      const excludeItemCodePayload = {
        itemCodes: excludeItemCodes,
        totalElements: 10
      };
      const action = new actions.GetExcludeItemCodesSuccess(
        excludeItemCodePayload
      );

      const result = GEPPurityConfigReducer(initialState, action);
      expect(result.isLoading).toBe(false);
      expect(result.error).toBe(null);
      expect(result.excludeItemCodes).toBe(excludeItemCodePayload.itemCodes);
      expect(result.totalElements).toBe(excludeItemCodePayload.totalElements);
    });
    it('GetExcludeItemCodesFailure should return error', () => {
      const action = new actions.GetExcludeItemCodesFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result = GEPPurityConfigReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
    });
  });
  describe('LoadProductGroups Reducer Testing', () => {
    it('LoadProductGroups should return proepr state', () => {
      const action = new actions.LoadProductGroups();

      const result = GEPPurityConfigReducer(initialState, action);
      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });
    it('LoadProductGroupsSuccess should return proepr state', () => {
      const action = new actions.LoadProductGroupsSuccess(productGroups);

      const result = GEPPurityConfigReducer(initialState, action);
      expect(result.isLoading).toBe(false);
      expect(result.productGroups).toBe(productGroups);
    });
    it('LoadProductGroupsFailure should return error', () => {
      const action = new actions.LoadProductGroupsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result = GEPPurityConfigReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
    });
  });
  describe('SearchProductGroup Reducer Testing', () => {
    it('SearchProductGroup should return proepr state', () => {
      const searchPayload: SearchProdcutGroup = {
        configId: 'abc123',
        searchValue: 'Configuration'
      };
      const action = new actions.SearchProductGroup(searchPayload);

      const result = GEPPurityConfigReducer(initialState, action);
      expect(result.isLoading).toBe(true);
      expect(result.hasSearched).toBe(false);
    });
    it('SearchProductGroupSuccess should return proepr state', () => {
      const action = new actions.SearchProductGroupSuccess(
        productGroupsDeduction
      );

      const result = GEPPurityConfigReducer(initialState, action);
      expect(result.isLoading).toBe(false);
      expect(result.hasSearched).toBe(true);
      expect(result.productGroupsDeduction).toBe(productGroupsDeduction);
    });
    it('SearchProductGroupFailure should return error', () => {
      const action = new actions.SearchProductGroupFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result = GEPPurityConfigReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
      expect(result.hasSearched).toEqual(false);
    });
  });
  describe('ResetGepPurityConfiguration Reducer Testing', () => {
    it('ResetGepPurityConfiguration should return proepr state', () => {
      const action = new actions.ResetGepPurityConfiguration();

      const result = GEPPurityConfigReducer(initialState, action);
      expect(result.configId).toBe(null);
      expect(result.hasGEPDetailsSaved).toBe(false);
      expect(result.hasPurityDetailsSaved).toBe(false);
      expect(result.hasGroupsSaved).toBe(false);
      expect(result.gepDetails).toBe(null);
      expect(result.purityDetails.length).toEqual(0);
      expect(result.error).toBe(null);
      expect(result.productGroupsDeduction).toBe(null);
      expect(result.hasThemeCodeSaved).toBe(false);
      expect(result.excludeThemeCodes).toBe(null);
      expect(result.hasProductGroupRemoved).toBe(null);
      expect(result.hasThemeCodeRemoved).toBe(false);
      expect(result.fileResponse).toBe(undefined);
      expect(result.errorLog).toBe(null);
    });
  });
  describe('SaveProductGroupsDeduction Reducer Testing', () => {
    it('SaveProductGroupsDeduction should return proepr state', () => {
      const action = new actions.SaveProductGroupsDeduction(
        saveProductGroupsDeduction
      );

      const result = GEPPurityConfigReducer(initialState, action);
      expect(result.isLoading).toBe(true);
      expect(result.hasGroupsSaved).toBe(false);
    });
    it('SaveProductGroupsDeductionSuccess should return proepr state', () => {
      const action = new actions.SaveProductGroupsDeductionSuccess('abc123');

      const result = GEPPurityConfigReducer(initialState, action);
      expect(result.isLoading).toBe(false);
      expect(result.hasGroupsSaved).toBe(true);
      expect(result.configId).toBe(action.payload);
    });
    it('SaveProductGroupsDeductionFailure should return error', () => {
      const action = new actions.SaveProductGroupsDeductionFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result = GEPPurityConfigReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
      expect(result.hasGroupsSaved).toEqual(false);
    });
  });
  describe('LoadGepPurityDetails Reducer Testing', () => {
    it('LoadGepPurityDetails should return proepr state', () => {
      const action = new actions.LoadGepPurityDetails('abc123');

      const result = GEPPurityConfigReducer(initialState, action);
      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });
    it('LoadGepPurityDetailsSuccess should return proepr state', () => {
      const action = new actions.LoadGepPurityDetailsSuccess(
        purityDetailsResponse
      );

      const result = GEPPurityConfigReducer(initialState, action);
      expect(result.isLoading).toBe(false);
      expect(result.purityDetails).toBe(purityDetailsResponse);
    });
    it('LoadGepPurityDetailsFailure should return error', () => {
      const action = new actions.LoadGepPurityDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result = GEPPurityConfigReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
    });
  });
  describe('LoadGepDetails Reducer TestCases', () => {
    it('LoadGepDetails should return proepr state', () => {
      const action = new actions.LoadGepDetails('abc123');

      const result = GEPPurityConfigReducer(initialState, action);
      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });
    it('LoadGepDetailsSuccess should return proepr state', () => {
      const action = new actions.LoadGepDetailsSuccess(gepDetails);

      const result = GEPPurityConfigReducer(initialState, action);
      expect(result.isLoading).toBe(false);
      expect(result.gepDetails).toBe(gepDetails);
    });
    it('LoadGepDetailsFailure should return error', () => {
      const action = new actions.LoadGepDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result = GEPPurityConfigReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
    });
  });
  describe('LoadProductGroupsDeduction TestCases', () => {
    it('LoadProductGroupsDeduction should return proepr state', () => {
      const action = new actions.LoadProductGroupsDeduction({
        configId: 'abc123',
        pageIndex: 0,
        pageSize: 10
      });

      const result = GEPPurityConfigReducer(initialState, action);
      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });
    it('LoadProductGroupsDeductionSuccess should return proepr state', () => {
      const action = new actions.LoadProductGroupsDeductionSuccess({
        productGroupsDeduction: productGroupsDeduction,
        count: 0
      });

      const result = GEPPurityConfigReducer(initialState, action);
      expect(result.isLoading).toBe(false);
      expect(result.productGroupsDeduction).toBe(productGroupsDeduction);
    });
    it('LoadProductGroupsDeductionFailure should return error', () => {
      const action = new actions.LoadProductGroupsDeductionFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result = GEPPurityConfigReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
    });
  });
  describe('SaveThemeCodes TestCases', () => {
    it('SaveThemeCodes should return proepr state', () => {
      const action = new actions.SaveThemeCodes(saveThemeCodesPayload);

      const result = GEPPurityConfigReducer(initialState, action);
      expect(result.isLoading).toBe(true);
      expect(result.hasThemeCodeSaved).toBe(false);
    });
    it('SaveThemeCodesSuccess should return proepr state', () => {
      const action = new actions.SaveThemeCodesSuccess('abc123');

      const result = GEPPurityConfigReducer(initialState, action);
      expect(result.isLoading).toBe(false);
      expect(result.hasThemeCodeSaved).toBe(true);
      expect(result.configId).toBe('abc123');
    });
    it('SaveThemeCodesFailure should return error', () => {
      const action = new actions.SaveThemeCodesFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result = GEPPurityConfigReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
      expect(result.hasThemeCodeSaved).toEqual(false);
      expect(result.isLoading).toEqual(false);
    });
  });
  describe('DeleteThemeCodes Reducer Testing', () => {
    it('DeleteThemeCodes should return proepr state', () => {
      const action = new actions.DeleteThemeCodes(removeThemeCodes);

      const result = GEPPurityConfigReducer(initialState, action);
      expect(result.isLoading).toBe(true);
      expect(result.hasThemeCodeRemoved).toBe(false);
    });
    it('DeleteThemeCodesSuccess should return proepr state', () => {
      const action = new actions.DeleteThemeCodesSuccess();

      const result = GEPPurityConfigReducer(initialState, action);
      expect(result.isLoading).toBe(false);
      expect(result.hasThemeCodeRemoved).toBe(true);
    });
    it('DeleteThemeCodesFailure should return error', () => {
      const action = new actions.DeleteThemeCodesFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result = GEPPurityConfigReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
      expect(result.hasThemeCodeRemoved).toEqual(false);
      expect(result.isLoading).toEqual(false);
    });
  });
  describe('RemoveProductGroups Reducer Testing', () => {
    it('RemoveProductGroups should return proepr state', () => {
      const action = new actions.RemoveProductGroups(removeProductGroups);

      const result = GEPPurityConfigReducer(initialState, action);
      expect(result.isLoading).toBe(true);
      expect(result.hasProductGroupRemoved).toBe(false);
    });
    it('RemoveProductGroupsSuccess should return proepr state', () => {
      const action = new actions.RemoveProductGroupsSuccess();

      const result = GEPPurityConfigReducer(initialState, action);
      expect(result.isLoading).toBe(false);
      expect(result.hasProductGroupRemoved).toBe(true);
    });
    it('RemoveProductGroupsFailure should return error', () => {
      const action = new actions.RemoveProductGroupsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result = GEPPurityConfigReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
      expect(result.hasProductGroupRemoved).toEqual(false);
      expect(result.isLoading).toEqual(false);
    });
  });
  describe('SearchItemCode Reducer TestCases', () => {
    it('SearchItemCode should return proepr state', () => {
      const searchItemCodePayload = {
        configId: 'abc123',
        itemCode: 'item123'
      };
      const action = new actions.SearchItemCode(searchItemCodePayload);

      const result = GEPPurityConfigReducer(initialState, action);
      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });
    it('SearchItemCodeSuccess should return proepr state', () => {
      const action = new actions.SearchItemCodeSucccess(excludeItemCodes);

      const result = GEPPurityConfigReducer(initialState, action);
      expect(result.isLoading).toBe(false);
      expect(result.excludeItemCodes).toBe(excludeItemCodes);
    });
    it('SearchItemCodeFailure should return error', () => {
      const action = new actions.SearchItemCodeFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result = GEPPurityConfigReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
    });
  });
  describe('ItemCodeErrorLogDownload Reducer TestCases', () => {
    it('ItemCodeErrorLogDownload should return proepr state', () => {
      const action = new actions.ItemCodeErrorLogDownload('abc123');

      const result = GEPPurityConfigReducer(initialState, action);
      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });
    it('ItemCodeErrorLogDownloadSuccess should return proepr state', () => {
      const action = new actions.ItemCodeErrorLogDownloadSuccess(null);

      const result = GEPPurityConfigReducer(initialState, action);
      expect(result.isLoading).toBe(false);
      expect(result.errorLog).toBe(action.payload);
      expect(result.error).toBe(null);
    });
    it('ItemCodeErrorLogDownloadFailure should return error', () => {
      const action = new actions.ItemCodeErrorLogDownloadFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result = GEPPurityConfigReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
    });
  });

  describe('LoadSilverRanges Reducer Testing', () => {
    it('LoadRanges should return proepr state', () => {
      const action = new actions.LoadSilverRanges('GEP_PURITY_SILVER');

      const result = GEPPurityConfigReducer(initialState, action);
      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });
    it('LoadSilverRangesSuccess should return proepr state', () => {
      const action = new actions.LoadSilverRangesSuccess(range);

      const result = GEPPurityConfigReducer(initialState, action);
      expect(result.isLoading).toBe(false);
      expect(result.silverRanges).toBe(range);
    });
    it('LoadSilverRangesFailure should return error', () => {
      const action = new actions.LoadSilverRangesFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result = GEPPurityConfigReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
      expect(result.isLoading).toEqual(false);
    });
  });
  describe('LoadPlatinumRanges', () => {
    it('should call LoadPlatinumRangesSuccess', () => {
      const action = new actions.LoadPlatinumRangesSuccess(range);

      const result = GEPPurityConfigReducer(initialState, action);
      expect(result.isLoading).toBe(false);
      expect(result.platinumRanges).toBe(range);
    });
  })
})
