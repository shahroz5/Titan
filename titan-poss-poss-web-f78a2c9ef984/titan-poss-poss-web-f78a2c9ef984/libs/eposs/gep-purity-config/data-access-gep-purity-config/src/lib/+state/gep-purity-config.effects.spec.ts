import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { DataPersistence } from '@nrwl/angular';
import {
  LovDataService,
  ProductGroupDataService
} from '@poss-web/shared/masters/data-access-masters';
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
import { FileDownloadService } from '@poss-web/shared/util-common';
import {
  POSS_WEB_API_URL,
  POSS_WEB_CACHING_STRATEGY
} from '@poss-web/shared/util-config';
import { cold, hot } from 'jasmine-marbles';
import { Observable } from 'rxjs';
import { GEPPurityConfigService } from '../gep-purity-config.service';
import * as GEPPurityConfigActions from './gep-purity-config.actions';
import {
  DeleteThemeCodes,
  DeleteThemeCodesFailure, GetExcludeItemCodes,
  GetExcludeItemCodesFailure,
  GetExcludeItemCodesSuccess,
  GetExcludeThemeCodes,
  GetExcludeThemeCodesFailure,
  GetExcludeThemeCodesSuccess, LoadGepDetails,
  LoadGepDetailsFailure,
  LoadGepDetailsSuccess,
  LoadGEPPurityConfig,
  LoadGEPPurityConfigFailure,
  LoadGEPPurityConfigSuccess,
  LoadGepPurityDetails,
  LoadGepPurityDetailsFailure,
  LoadGepPurityDetailsSuccess,
  LoadMetalTypes,
  LoadMetalTypesFailure,
  LoadMetalTypesSuccess,
  LoadProductGroups,
  LoadProductGroupsDeduction,
  LoadProductGroupsDeductionFailure,
  LoadProductGroupsDeductionSuccess,
  LoadProductGroupsFailure,
  LoadProductGroupsSuccess,
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
  UploadFile,
  UploadFileFailure,
  UploadFileSuccess
} from './gep-purity-config.actions';
import { GEPPurityConfigEffects } from './gep-purity-config.effects';
describe('GEPPurityConfigEffects Testing Suite', () => {
  const gepPurityConfigServiceSpy = jasmine.createSpyObj<
    GEPPurityConfigService
  >([
    'getGEPPurityConfigList',
    'searchConfigName',
    'saveGEPDetails',
    'loadMetalTypes',
    'loadItemTypes',
    'loadRanges',
    'savePurityDetails',
    'uploadFile',
    'getExcludeThemeCodes',
    'getExcludeItemCodes',
    'searchProductGroup',
    'productsGroupsDeduction',
    'removeProductGroup',
    'getGepPurityDetails',
    'getGepDetails',
    'saveThemeCodes',
    'deleteThemeCode',
    'loadProductGroupsDeduction',
    'searchItemCode',
    'updateToggleButton'
  ]);
  const lovDataServiceSpy = jasmine.createSpyObj<LovDataService>([
    'getProductLovs'
  ]);
  const productDataServiceSpy = jasmine.createSpyObj<ProductGroupDataService>([
    'getProductGroups'
  ]);
  const fileDownloadServiceSpy = jasmine.createSpyObj<FileDownloadService>([
    'getErrorResponse'
  ]);
  let actions$: Observable<any>;
  let effect: GEPPurityConfigEffects;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get']
  );
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
  const excludeItemCodes: ExcludeItemCodes[] = [
    {
      configId: 'abc123',
      id: '12',
      isActive: true,
      itemCode: '1'
    }
  ];
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
  const initialState = {};
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GEPPurityConfigEffects,
        DataPersistence,
        provideMockStore({ initialState }),
        provideMockActions(() => actions$),
        {
          provide: POSS_WEB_API_URL,
          useValue: ''
        },
        {
          provide: POSS_WEB_CACHING_STRATEGY,
          useValue: []
        },
        {
          provide: HttpClient,
          useValue: httpClientSpy
        },
        {
          provide: GEPPurityConfigService,
          useValue: gepPurityConfigServiceSpy
        },
        {
          provide: LovDataService,
          useValue: lovDataServiceSpy
        },
        {
          provide: FileDownloadService,
          usevalue: fileDownloadServiceSpy
        },
        {
          provide: ProductGroupDataService,
          useValue: productDataServiceSpy
        }
      ]
    });
    effect = TestBed.inject(GEPPurityConfigEffects);
  });
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
  describe('LoadGEPPurityConfig', () => {
    it('should return a stream with LoadGEPPurityConfig', () => {
      const parameters: GEPPurityConfigListPayload = {
        pageIndex: 0,
        pageSize: 10,
        type: 'GEP_ITEM',
        description: 'Configuration'
      };
      const action = new LoadGEPPurityConfig(parameters);
      const outcome = new LoadGEPPurityConfigSuccess(gepPurityConfigResponse);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: gepPurityConfigResponse });
      gepPurityConfigServiceSpy.getGEPPurityConfigList.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.gepPurityConfigList$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const parameters: GEPPurityConfigListPayload = {
        pageIndex: 0,
        pageSize: 100,
        type: 'GEP_ITEM',
        description: 'Configuration'
      };
      const action = new LoadGEPPurityConfig(parameters);
      const error = new Error('some error');
      const outcome = new LoadGEPPurityConfigFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      gepPurityConfigServiceSpy.getGEPPurityConfigList.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.gepPurityConfigList$).toBeObservable(expected);
    });
  });
  describe('SearchConfigName', () => {
    const searchConfigName = {
      description: 'ABC',
      isActive: true,
      configId: 'abc123',
      createdDate: '28-08-1997'
    };
    const searchPayload = {
      configName: 'Configuration',
      type: 'GEP_ITEM'
    };
    it('should return a stream with SearchConfigName', () => {
      const action = new SearchConfigName(searchPayload);
      const outcome = new SearchConfigNameSuccess([searchConfigName]);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: [searchConfigName]
      });
      gepPurityConfigServiceSpy.searchConfigName.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.gepPurityConfigSearch$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new SearchConfigName(searchPayload);
      const error = new Error('some error');
      const outcome = new SearchConfigNameFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      gepPurityConfigServiceSpy.searchConfigName.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.gepPurityConfigSearch$).toBeObservable(expected);
    });
  });
  describe('SearchProductGroup', () => {
    const searchProductPayload: SearchProdcutGroup = {
      configId: 'abc123',
      searchValue: 'itemCode123'
    };
    it('should return a stream with SearchProductGroup', () => {
      const action = new SearchProductGroup(searchProductPayload);
      const outcome = new SearchProductGroupSuccess(productGroupsDeduction);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: productGroupsDeduction
      });
      gepPurityConfigServiceSpy.searchProductGroup.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.searchProductGroups$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new SearchProductGroup(searchProductPayload);
      const error = new Error('some error');
      const outcome = new SearchProductGroupFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      gepPurityConfigServiceSpy.searchProductGroup.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.searchProductGroups$).toBeObservable(expected);
    });
  });
  describe('SaveGepDetails', () => {
    it('should return a stream with SearchProductGroup', () => {
      const action = new SaveGEPDetails(saveGEPDetails);
      const outcome = new SaveGEPDetailsSuccess(gepDetails);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: gepDetails
      });
      gepPurityConfigServiceSpy.saveGEPDetails.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.saveGEPDetails$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new SaveGEPDetails(saveGEPDetails);
      const error = new Error('some error');
      const outcome = new SaveGEPDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      gepPurityConfigServiceSpy.saveGEPDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.saveGEPDetails$).toBeObservable(expected);
    });
  });
  describe('LoadMetalTypes', () => {
    it('should return a stream with LoadMetalTypes', () => {
      const action = new LoadMetalTypes();
      const outcome = new LoadMetalTypesSuccess(metalType);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: metalType
      });
      gepPurityConfigServiceSpy.loadMetalTypes.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadMetalTypes$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new LoadMetalTypes();
      const error = new Error('some error');
      const outcome = new LoadMetalTypesFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      gepPurityConfigServiceSpy.loadMetalTypes.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadMetalTypes$).toBeObservable(expected);
    });
  });

  describe('LoadRanges', () => {
    it('should return a stream with LoadRanges', () => {
      const action = new GEPPurityConfigActions.LoadGoldRanges(
        'GEP_PURITY_GOLD'
      );
      const outcome = new GEPPurityConfigActions.LoadGoldRangesSuccess(range);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: range
      });
      gepPurityConfigServiceSpy.loadRanges.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadRanges$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new GEPPurityConfigActions.LoadGoldRanges(
        'GEP_PURITY_GOLD'
      );
      const error = new Error('some error');
      const outcome = new GEPPurityConfigActions.LoadGoldRangesFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      gepPurityConfigServiceSpy.loadRanges.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadRanges$).toBeObservable(expected);
    });
  });
  describe('SavePurityDetails', () => {
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
    it('should return a stream with LoadRanges', () => {
      const action = new SavePurityDetails(savePurityDetails);
      const outcome = new SavePurityDetailsSuccess(purityDetailsResponse);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: purityDetailsResponse
      });
      gepPurityConfigServiceSpy.savePurityDetails.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.savePurityDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new SavePurityDetails(savePurityDetails);
      const error = new Error('some error');
      const outcome = new SavePurityDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      gepPurityConfigServiceSpy.savePurityDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.savePurityDetails$).toBeObservable(expected);
    });
  });
  describe('UploadFile', () => {
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
    it('should return a stream with UploadFile', () => {
      const action = new UploadFile(uploadFile);
      const outcome = new UploadFileSuccess({
        fileResponse: fileResponse,
        configId: 'abc123'
      });
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: {
          fileResponse: fileResponse,
          configId: 'abc123'
        }
      });
      gepPurityConfigServiceSpy.uploadFile.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.uploadFile$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new UploadFile(uploadFile);
      const error = new Error('some error');
      const outcome = new UploadFileFailure(CustomErrorAdaptor.fromJson(error));
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      gepPurityConfigServiceSpy.uploadFile.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.uploadFile$).toBeObservable(expected);
    });
  });
  describe('GetExcludeThemeCodes', () => {
    const excludeThemeCodes: ExcludeThemeCodes[] = [
      {
        configId: 'abc123',
        id: '12',
        isActive: true,
        themeCode: '1'
      }
    ];
    it('should return a stream with GetExcludeThemeCodes', () => {
      const action = new GetExcludeThemeCodes('abc123');
      const outcome = new GetExcludeThemeCodesSuccess(excludeThemeCodes);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: excludeThemeCodes
      });
      gepPurityConfigServiceSpy.getExcludeThemeCodes.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.getExcludeThemeCodes$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new GetExcludeThemeCodes('abc123');
      const error = new Error('some error');
      const outcome = new GetExcludeThemeCodesFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      gepPurityConfigServiceSpy.getExcludeThemeCodes.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.getExcludeThemeCodes$).toBeObservable(expected);
    });
  });

  describe('GetExcludeItemCodes', () => {
    const payload = {
      pageIndex: 0,
      pageSize: 10,
      configId: 'abc123'
    };

    const response = {
      itemCodes: excludeItemCodes,
      totalElements: 1
    };
    it('should return a stream with GetExcludeItemCodes', () => {
      const action = new GetExcludeItemCodes(payload);
      const outcome = new GetExcludeItemCodesSuccess(response);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: response
      });
      gepPurityConfigServiceSpy.getExcludeItemCodes.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.getExcludeItemCodes$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new GetExcludeItemCodes(payload);
      const error = new Error('some error');
      const outcome = new GetExcludeItemCodesFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      gepPurityConfigServiceSpy.getExcludeItemCodes.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.getExcludeItemCodes$).toBeObservable(expected);
    });
  });
  describe('LoadProductGroups', () => {
    const productGroups: ProductGroup[] = [
      {
        description: 'ProductGroup',
        productGroupCode: 'p'
      }
    ];
    it('should return a stream with LoadProductGroups', () => {
      const action = new LoadProductGroups();
      const outcome = new LoadProductGroupsSuccess(productGroups);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: productGroups
      });
      productDataServiceSpy.getProductGroups.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadProductGroups$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadProductGroups();
      const error = new Error('some error');
      const outcome = new LoadProductGroupsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      productDataServiceSpy.getProductGroups.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadProductGroups$).toBeObservable(expected);
    });
  });
  describe('SaveProductGroupsDeduction', () => {
    it('should return a stream with SaveProductGroupsDeduction', () => {
      const action = new SaveProductGroupsDeduction(saveProductGroupsDeduction);
      const outcome = new SaveProductGroupsDeductionSuccess('abc123');
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: 'abc123'
      });
      gepPurityConfigServiceSpy.productsGroupsDeduction.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.saveProductGroupsDeduction$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new SaveProductGroupsDeduction(saveProductGroupsDeduction);
      const error = new Error('some error');
      const outcome = new SaveProductGroupsDeductionFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      gepPurityConfigServiceSpy.productsGroupsDeduction.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.saveProductGroupsDeduction$).toBeObservable(expected);
    });
  });
  describe('LoadGepDetails', () => {
    it('should return a stream with LoadGepDetails', () => {
      const action = new LoadGepDetails('abc123');
      const outcome = new LoadGepDetailsSuccess(gepDetails);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: gepDetails
      });
      gepPurityConfigServiceSpy.getGepDetails.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.getGepDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadGepDetails('abc123');
      const error = new Error('some error');
      const outcome = new LoadGepDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      gepPurityConfigServiceSpy.getGepDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.getGepDetails$).toBeObservable(expected);
    });
  });

  describe('LoadGepDetails', () => {
    it('should return a stream with LoadGepDetails', () => {
      const action = new LoadGepDetails('abc123');
      const outcome = new LoadGepDetailsSuccess(gepDetails);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: gepDetails
      });
      gepPurityConfigServiceSpy.getGepDetails.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.getGepDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadGepDetails('abc123');
      const error = new Error('some error');
      const outcome = new LoadGepDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      gepPurityConfigServiceSpy.getGepDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.getGepDetails$).toBeObservable(expected);
    });
  });

  describe('LoadGepPurityDetails', () => {
    it('should return a stream with LoadGepPurityDetails', () => {
      const action = new LoadGepPurityDetails('abc123');
      const outcome = new LoadGepPurityDetailsSuccess(purityDetailsResponse);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: purityDetailsResponse
      });
      gepPurityConfigServiceSpy.getGepPurityDetails.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.getGepPurityDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadGepPurityDetails('abc123');
      const error = new Error('some error');
      const outcome = new LoadGepPurityDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      gepPurityConfigServiceSpy.getGepPurityDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.getGepPurityDetails$).toBeObservable(expected);
    });
  });
  describe('LoadProductGroupsDeduction', () => {
    it('should return a stream with LoadProductGroupsDeduction', () => {
      const action = new LoadProductGroupsDeduction({
        configId: 'abc123',
        pageIndex: 0,
        pageSize: 10
      });
      const outcome = new LoadProductGroupsDeductionSuccess({
        productGroupsDeduction: productGroupsDeduction,
        count: 0
      });
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: {
          productGroupsDeduction: productGroupsDeduction,
          count: 0
        }
      });
      gepPurityConfigServiceSpy.loadProductGroupsDeduction.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadProductGroupsDeduction$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadProductGroupsDeduction({
        configId: 'abc123',
        pageIndex: 0,
        pageSize: 10
      });
      const error = new Error('some error');
      const outcome = new LoadProductGroupsDeductionFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      gepPurityConfigServiceSpy.loadProductGroupsDeduction.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.loadProductGroupsDeduction$).toBeObservable(expected);
    });
  });

  describe('SaveThemeCodes', () => {
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

    it('should return a stream with SaveThemeCodes', () => {
      const action = new SaveThemeCodes(saveThemeCodesPayload);
      const outcome = new SaveThemeCodesSuccess('abc123');
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: 'abc123'
      });
      gepPurityConfigServiceSpy.saveThemeCodes.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.saveThemeCodes$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new SaveThemeCodes(saveThemeCodesPayload);
      const error = new Error('some error');
      const outcome = new SaveThemeCodesFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      gepPurityConfigServiceSpy.saveThemeCodes.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.saveThemeCodes$).toBeObservable(expected);
    });
  });

  describe('DeleteThemeCodes', () => {
    it('should return a stream with DeleteThemeCodes', () => {
      const action = new GEPPurityConfigActions.DeleteThemeCodes(
        removeThemeCodes
      );
      const outcome = new GEPPurityConfigActions.DeleteThemeCodesSuccess();
      actions$ = hot('-a', { a: action });

      gepPurityConfigServiceSpy.deleteThemeCode();

      expect(effect.deleteThemeCodes$);
    });

    it('should fail and return an action with the error', () => {
      const action = new DeleteThemeCodes(removeThemeCodes);
      const error = new Error('some error');
      const outcome = new DeleteThemeCodesFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      gepPurityConfigServiceSpy.deleteThemeCode.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.deleteThemeCodes$).toBeObservable(expected);
    });
  });

  describe('RemoveProductGroups', () => {
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
    it('should return a stream with RemoveProductGroups', () => {
      const action = new RemoveProductGroups(removeProductGroups);
      const outcome = new RemoveProductGroupsSuccess();
      actions$ = hot('-a', { a: action });

      gepPurityConfigServiceSpy.removeProductGroup();

      expect(effect.removeProductGroup$);
    });

    it('should fail and return an action with the error', () => {
      const action = new RemoveProductGroups(removeProductGroups);
      const error = new Error('some error');
      const outcome = new RemoveProductGroupsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      gepPurityConfigServiceSpy.removeProductGroup.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.removeProductGroup$).toBeObservable(expected);
    });
  });
  describe('SearchItemCode', () => {
    const payload = {
      configId: 'abc123',
      itemCode: 'item123'
    };
    it('should return a stream with SearchItemCode', () => {
      const action = new SearchItemCode(payload);
      const outcome = new SearchItemCodeSucccess(excludeItemCodes);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: excludeItemCodes
      });
      gepPurityConfigServiceSpy.searchItemCode.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.searchItemCode$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new SearchItemCode(payload);
      const error = new Error('some error');
      const outcome = new SearchItemCodeFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      gepPurityConfigServiceSpy.searchItemCode.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.searchItemCode$).toBeObservable(expected);
    });
  });

  describe('LoadSilverRanges', () => {
    it('should return a stream with LoadSilverRanges', () => {
      const action = new GEPPurityConfigActions.LoadSilverRanges(
        'GEP_PURITY_SILVER'
      );
      const outcome = new GEPPurityConfigActions.LoadSilverRangesSuccess(range);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: range
      });
      gepPurityConfigServiceSpy.loadRanges.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadSilverRanges$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new GEPPurityConfigActions.LoadSilverRanges(
        'GEP_PURITY_SILVER'
      );
      const error = new Error('some error');
      const outcome = new GEPPurityConfigActions.LoadSilverRangesFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      gepPurityConfigServiceSpy.loadRanges.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadSilverRanges$).toBeObservable(expected);
    });
  });

  describe('LoadPlatinumRanges', () => {
    it('should return a stream with LoadPlatinumRanges', () => {
      const action = new GEPPurityConfigActions.LoadPlatinumRanges(
        'GEP_PURITY_PLATINUM'
      );
      const outcome = new GEPPurityConfigActions.LoadPlatinumRangesSuccess(
        range
      );
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: range
      });
      gepPurityConfigServiceSpy.loadRanges.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadPlatinumRanges$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new GEPPurityConfigActions.LoadPlatinumRanges(
        'GEP_PURITY_PLATINUM'
      );
      const error = new Error('some error');
      const outcome = new GEPPurityConfigActions.LoadPlatinumRangesFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      gepPurityConfigServiceSpy.loadRanges.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadPlatinumRanges$).toBeObservable(expected);
    });
  });

  describe('UpdateToggleButton', () => {
    it('should return a stream with UpdateToggleButton', () => {
      const action = new GEPPurityConfigActions.UpdateToggleButton({
        configId: 'abc123',
        isActive: true
      });
      const outcome = new GEPPurityConfigActions.UpdateToggleButtonSuccess();
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: null
      });
      gepPurityConfigServiceSpy.updateToggleButton.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.updateToggleButton$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new GEPPurityConfigActions.UpdateToggleButton({
        configId: 'abc123',
        isActive: true
      });
      const error = new Error('some error');
      const outcome = new GEPPurityConfigActions.UpdateToggleButtonFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      gepPurityConfigServiceSpy.updateToggleButton.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.updateToggleButton$).toBeObservable(expected);
    });
  });

  // describe('ItemCodeErrorLogDownload', () => {
  //   it('should return a stream of ItemCodeErrorLogDownload ', () => {
  //     const action = new ItemCodeErrorLogDownload('');
  //     const outcome = new ItemCodeErrorLogDownloadSuccess([]);

  //     actions$ = hot('-a', { a: action });
  //     const response$ = cold('-b|', {
  //       b: []
  //     });
  //     fileDownloadServiceSpy.getErrorResponse.and.returnValue(response$);

  //     const expected$ = cold('--c', { c: outcome });
  //     expect(effect.errorLogDownload$).toBeObservable(expected$);
  //   });

  //   it('should fail and return an action with the error', () => {
  //     const action = new ItemCodeErrorLogDownload('');
  //     const error = new Error('some error');
  //     const outcome = new ItemCodeErrorLogDownloadFailure(
  //       CustomErrorAdaptor.fromJson(error)
  //     );
  //     actions$ = hot('-a', { a: action });
  //     const response$ = cold('-#', {}, error);
  //     fileDownloadServiceSpy.getErrorResponse.and.returnValue(response$);
  //     const expected = cold('--b', { b: outcome });
  //     expect(effect.errorLogDownload$).toBeObservable(expected);
  //   });
  // });
});
