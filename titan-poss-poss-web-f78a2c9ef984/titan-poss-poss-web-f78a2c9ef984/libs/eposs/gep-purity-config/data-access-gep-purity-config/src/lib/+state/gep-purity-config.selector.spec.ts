import {
  CustomErrors, ExcludeItemCodes, ExcludeThemeCodes, FileResponse, GepDetails, GEPPurityConfigResponse, Lov, MetalType, ProductGroup, ProductGroupMappingOption, ProductGroupsDeduction, PurityDetailsResponse, Ranges
} from '@poss-web/shared/models';
import { initialState } from './gep-purity-config.reducer';
import { GEPPurityConfigSelectors } from './gep-purity-config.selector';
import { GEPPurityConfigState } from './gep-purity-config.state';

describe('Testing Selector Testing Suite', () => {
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
  const gepPuirtyConfig = [
    {
      description: 'GEP',
      isActive: true,
      configId: 'abc123',
      createdDate: '28-08-1997'
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
  const range: Ranges[] = [
    {
      fromRange: 12,
      toRange: 20,
      range: '100',
      id: 'abc12',
      isActive: true
    }
  ];
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
  const fileResponse: FileResponse = {
    totalCount: 12,
    successCount: 12,
    failureCount: 0,
    errorLogId: {},
    hasError: false
  };
  it('should return the totalElements ', () => {
    const state: GEPPurityConfigState = {
      ...initialState,
      totalElements: gepPurityConfigResponse.totalElements
    };
    expect(GEPPurityConfigSelectors.selectCount.projector(state)).toEqual(
      gepPurityConfigResponse.totalElements
    );
  });
  it('should return the list ', () => {
    const state: GEPPurityConfigState = {
      ...initialState,
      GEPPurityConfigList: gepPuirtyConfig
    };
    expect(
      GEPPurityConfigSelectors.selectGepPurityConfigList.projector(state)
    ).toEqual(gepPuirtyConfig);
  });
  it('should return the isLoading ', () => {
    const state: GEPPurityConfigState = {
      ...initialState,
      isLoading: true
    };
    expect(GEPPurityConfigSelectors.selectIsLoading.projector(state)).toEqual(
      true
    );
  });
  it('should return the hasGEPDetailsSaved ', () => {
    const state: GEPPurityConfigState = {
      ...initialState,
      hasGEPDetailsSaved: true
    };
    expect(
      GEPPurityConfigSelectors.selectHasGEPDetailsSaved.projector(state)
    ).toEqual(true);
  });
  it('should return the hasGEPDetailsSaved ', () => {
    const state: GEPPurityConfigState = {
      ...initialState,
      hasGEPDetailsSaved: true
    };
    expect(
      GEPPurityConfigSelectors.selectHasGEPDetailsSaved.projector(state)
    ).toEqual(true);
  });
  it('should return the error ', () => {
    const error: CustomErrors = {
      code: 'ERR_1',
      message: 'Error',
      traceId: 'TraceID',
      timeStamp: '122131',
      error: null
    };
    const state: GEPPurityConfigState = {
      ...initialState,
      error: error
    };
    expect(GEPPurityConfigSelectors.selectError.projector(state)).toEqual(
      error
    );
  });
  it('should return the metalTypes ', () => {
    const state: GEPPurityConfigState = {
      ...initialState,
      metalType: metalType
    };
    expect(GEPPurityConfigSelectors.selectMetalTypes.projector(state)).toEqual(
      metalType
    );
  });
  it('should return the itemTypes ', () => {
    const state: GEPPurityConfigState = {
      ...initialState,
      itemType: itemTypes
    };
    expect(GEPPurityConfigSelectors.selectItemTypes.projector(state)).toEqual(
      itemTypes
    );
  });
  it('should return the ranges ', () => {
    const state: GEPPurityConfigState = {
      ...initialState,
      goldRanges: range
    };
    expect(GEPPurityConfigSelectors.selectGoldRanges.projector(state)).toEqual(
      range
    );
  });
  it('should return the hasPurityDetailsSaved ', () => {
    const state: GEPPurityConfigState = {
      ...initialState,
      hasPurityDetailsSaved: true
    };
    expect(
      GEPPurityConfigSelectors.selectHasPurityDetailsSaved.projector(state)
    ).toEqual(true);
  });
  it('should return the hasSearched ', () => {
    const state: GEPPurityConfigState = {
      ...initialState,
      hasSearched: true
    };
    expect(GEPPurityConfigSelectors.selectHasSearched.projector(state)).toEqual(
      true
    );
  });
  it('should return the hasGroupsSaved ', () => {
    const state: GEPPurityConfigState = {
      ...initialState,
      hasGroupsSaved: true
    };
    expect(
      GEPPurityConfigSelectors.selectHasProductGroupsDeducted.projector(state)
    ).toEqual(true);
  });
  it('should return the hasThemeCodeSaved ', () => {
    const state: GEPPurityConfigState = {
      ...initialState,
      hasThemeCodeSaved: true
    };
    expect(
      GEPPurityConfigSelectors.selectHasThemeCodeSaved.projector(state)
    ).toEqual(true);
  });
  it('should return the hasThemeCodeRemoved ', () => {
    const state: GEPPurityConfigState = {
      ...initialState,
      hasThemeCodeRemoved: true
    };
    expect(
      GEPPurityConfigSelectors.selectHasThemeCodeRemoved.projector(state)
    ).toEqual(true);
  });
  it('should return the hasProductGroupRemoved ', () => {
    const state: GEPPurityConfigState = {
      ...initialState,
      hasProductGroupRemoved: true
    };
    expect(
      GEPPurityConfigSelectors.selectHasRemoveProductGroup.projector(state)
    ).toEqual(true);
  });
  it('should return the excludeThemeCodes ', () => {
    const state: GEPPurityConfigState = {
      ...initialState,
      excludeThemeCodes: excludeThemeCodes
    };
    expect(
      GEPPurityConfigSelectors.selectExcludeThemeCodes.projector(state)
    ).toEqual(excludeThemeCodes);
  });
  it('should return the excludeItemCodes ', () => {
    const state: GEPPurityConfigState = {
      ...initialState,
      excludeItemCodes: excludeItemCodes
    };
    expect(
      GEPPurityConfigSelectors.selectExcludeItemCodes.projector(state)
    ).toEqual(excludeItemCodes);
  });
  it('should return the productGroups ', () => {
    const state: GEPPurityConfigState = {
      ...initialState,
      productGroups: productGroups
    };
    expect(
      GEPPurityConfigSelectors.selectProductGroups.projector(state)
    ).toEqual(productGroups);
  });
  it('should return the configId ', () => {
    const state: GEPPurityConfigState = {
      ...initialState,
      configId: 'abc123'
    };
    expect(GEPPurityConfigSelectors.selectConfigId.projector(state)).toEqual(
      'abc123'
    );
  });
  it('should return the configId ', () => {
    const state: GEPPurityConfigState = {
      ...initialState,
      configId: 'abc123'
    };
    expect(GEPPurityConfigSelectors.selectConfigId.projector(state)).toEqual(
      'abc123'
    );
  });
  it('should return the gepDetails ', () => {
    const state: GEPPurityConfigState = {
      ...initialState,
      gepDetails: gepDetails
    };
    expect(GEPPurityConfigSelectors.selectGepDetails.projector(state)).toEqual(
      gepDetails
    );
  });
  it('should return the purityDetails ', () => {
    const state: GEPPurityConfigState = {
      ...initialState,
      purityDetails: purityDetailsResponse
    };
    expect(
      GEPPurityConfigSelectors.selectPurityDetails.projector(state)
    ).toEqual(purityDetailsResponse);
  });
  it('should return the productGroupsDeduction ', () => {
    const state: GEPPurityConfigState = {
      ...initialState,
      productGroupsDeduction: productGroupsDeduction
    };
    expect(
      GEPPurityConfigSelectors.selectProductGroupsDeduction.projector(state)
    ).toEqual(productGroupsDeduction);
  });
  it('should return the fileResponse ', () => {
    const state: GEPPurityConfigState = {
      ...initialState,
      fileResponse: fileResponse
    };
    expect(
      GEPPurityConfigSelectors.selectFileUploadResponse.projector(state)
    ).toEqual(fileResponse);
  });
  it('should return the errorLog ', () => {
    const state: GEPPurityConfigState = {
      ...initialState,
      errorLog: null
    };
    expect(GEPPurityConfigSelectors.selectErrorLog.projector(state)).toEqual(
      null
    );
  });
  it('should return the totalItemCodes ', () => {
    const state: GEPPurityConfigState = {
      ...initialState,
      totalElements: 10
    };
    expect(
      GEPPurityConfigSelectors.selectTotalItemCodes.projector(state)
    ).toEqual(10);
  });

  it('should return the productGroupsCount ', () => {
    const state: GEPPurityConfigState = {
      ...initialState,
      productGroupsCount: 10
    };
    expect(
      GEPPurityConfigSelectors.selectProductGroupsCount.projector(state)
    ).toEqual(10);
  });

  it('should return the hasUpdateToggleButton ', () => {
    const state: GEPPurityConfigState = {
      ...initialState,
      hasUpdateToggleButton: true
    };
    expect(
      GEPPurityConfigSelectors.selectHasUpdatedToggleButton.projector(state)
    ).toEqual(true);
  });

  it('should return the silverRanges ', () => {
    const state: GEPPurityConfigState = {
      ...initialState,
      silverRanges: range
    };
    expect(
      GEPPurityConfigSelectors.selectSilverRanges.projector(state)
    ).toEqual(range);
  });

  it('should return the platinumRanges ', () => {
    const state: GEPPurityConfigState = {
      ...initialState,
      platinumRanges: range
    };
    expect(
      GEPPurityConfigSelectors.selectPlatinumRanges.projector(state)
    ).toEqual(range);
  });

  it('should return the allSelectedGroups ', () => {
    const response: ProductGroupMappingOption[] = [
      {
        id: 'CP',
        uuid: '1234',
        description: 'CP',
        isActive: true,
        isDeletable: true
      }
    ];
    const state: GEPPurityConfigState = {
      ...initialState,
      allSelectedGroups: response
    };
    expect(
      GEPPurityConfigSelectors.selectedProductGroups.projector(state)
    ).toEqual(response);
  });
});
