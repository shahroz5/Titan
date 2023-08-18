import { Observable } from 'rxjs';
import { hot, cold } from 'jasmine-marbles';

import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { HttpClient } from '@angular/common/http';

import { DataPersistence } from '@nrwl/angular';

import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { DiscountConfigEffect } from './discount-config.effects';
import { DiscountConfigService } from '../discount-config.service';
import {
  DiscountConfigSuccessList,
  SaveDiscountLocationsPayload,
  DiscountLocationList,
  SaveDiscountProductCategoryPayload,
  DiscountProductCategoryList,
  SaveDiscountProductGroupPayload,
  DiscountProductGroupList,
  DisountConfigListPayload,
  NewDiscountDetails,
  DiscountLocationListPayload,
  DiscountLocationSuccessList,
  DiscountProductCategoryListPayload,
  DiscountProductCategorySuccessList,
  DiscountProductGroupListPayload,
  DiscountProductGroupSuccessList,
  NewDiscountApplicableConfig,
  DiscounExcludeItemListPayload,
  DiscountExcludeItemSuccessList,
  SaveDiscountThemesPayload,
  SaveExcludeTypePayload,
  DiscountApplicableEnum,
  DiscountTypeEnum,
  SaveBestDealDiscountPayload,
  DiscountBestDealListPayload,
  MappedBestDealDiscountSuccessList,
  TSSSRequestPayload,
  SaveDiscountSchemesPayload,
  MappedDetails,
  Lov,
  BrandSummary,
  CustomErrors,
  ProductGroupMappingOption
} from '@poss-web/shared/models';
import {
  DiscountConfigActionTypes,
  LoadDiscountConfigList,
  LoadDiscountConfigListSuccess,
  LoadDiscountConfigListFailure,
  LoadDiscountConfigDetails,
  LoadDiscountConfigDetailsSuccess,
  LoadDiscountConfigDetailsFailure,
  SaveDiscountConfigList,
  SaveDiscountConfigListSuccess,
  SaveDiscountConfigListFailure,
  EditDiscountConfigList,
  EditDiscountConfigListSuccess,
  EditDiscountConfigListFailure,
  LoadDiscountMappedLocationList,
  LoadDiscountMappedLocationListSuccess,
  LoadDiscountMappedLocationListFailure,
  LoadDiscountMappedProductCategoryList,
  LoadDiscountMappedProductCategoryListSuccess,
  LoadDiscountMappedProductCategoryListFailure,
  LoadDiscountMappedProductGroupList,
  LoadDiscountMappedProductGroupListSuccess,
  LoadDiscountMappedProductGroupListFailure,
  LoadDiscountExcludeTypeList,
  LoadDiscountExcludeTypeListSuccess,
  LoadDiscountExcludeTypeListFailure,
  LoadDiscountExcludeItemCodes,
  LoadDiscountExcludeItemCodesSuccess,
  LoadDiscountExcludeItemCodesFailure,
  SaveDiscountLocations,
  SaveDiscountLocationsSuccess,
  SaveDiscountLocationsFailure,
  SaveDiscountProductCategory,
  SaveDiscountProductCategorySuccess,
  SaveDiscountProductCategoryFailure,
  SaveDiscountProductGroups,
  SaveDiscountProductGroupsSuccess,
  SaveDiscountProductGroupsFailure,
  SaveDiscountExcludeThemes,
  SaveDiscountExcludeThemesSuccess,
  SaveDiscountExcludeThemesFailure,
  SaveDiscountExcludeTypes,
  SaveDiscountExcludeTypesSuccess,
  SaveDiscountExcludeTypesFailure,
  ResetDiscounts,
  LoadBestDealDiscountList,
  LoadBestDealDiscountListSuccess,
  LoadBestDealDiscountListFailure,
  SaveBestDealDiscounts,
  SaveBestDealDiscountsSuccess,
  SaveBestDealDiscountsFailure,
  LoadSelectedBestDealDiscounts,
  LoadSelectedBestDealDiscountSuccess,
  LoadSelectedBestDealDiscountFailure,
  PublishDiscountConfig,
  PublishDiscountConfigSuccess,
  PublishDiscountConfigFailure,
  SaveEmpowermentDetails,
  SaveEmpowermentDetailsSuccess,
  SaveEmpowermentDetailsFailure,
  ComputeTsssConfig,
  ComputeTsssConfigSuccess,
  ComputeTsssConfigFailure,
  UpdateEmpowermentDetailsSuccess,
  UpdateEmpowermentDetails,
  UpdateEmpowermentDetailsFailure,
  LoadTsssConfigDownloadUrl,
  LoadTsssConfigDownloadUrlSuccess,
  LoadTsssConfigDownloadUrlFailure,
  LoadEmpowermentDiscountDetails,
  LoadEmpowermentDiscountDetailsSuccess,
  LoadEmpowermentDiscountDetailsFailure,
  SaveDiscountExcludeSchemesSuccess,
  SaveDiscountExcludeSchemes,
  SaveDiscountExcludeSchemesFailure,
  LoadSelectedLocationsSuccess,
  LoadSelectedLocationsFailure,
  LoadSelectedLocations,
  LoadSelectedProductGroupsSuccess,
  LoadSelectedProductGroupsFailure,
  LoadSelectedProductGroups,
  LoadSelectedProductCategoriesFailure,
  LoadSelectedProductCategoriesSuccess,
  LoadSelectedProductCategories,
  LoadApplicableLevelsSuccess,
  LoadApplicableLevelsFailure,
  LoadApplicableLevels,
  LoadBrands,
  LoadBrandsSuccess,
  LoadBrandsFailure,
  LoadSubBrands,
  LoadSubBrandsSuccess,
  LoadSubBrandsFailure,
  LoadTepDurationDaysRange,
  LoadTepDurationDaysRangeSuccess,
  LoadTepDurationDaysRangeFailure,
  SaveDiscountDetailsSuccess,
  SaveDiscountDetailsFailure,
  SaveDiscountDetails,
  LoadDiscountDetailsSuccess,
  LoadDiscountDetailsFailure,
  LoadDiscountDetails,
  LoadMappedProductGroupsByConfigIdSuccess,
  LoadMappedProductGroupsByConfigIdFailure,
  LoadMappedProductGroupsByConfigId,
  UpdateMappedProductGroupByConfigIdSuccess,
  UpdateMappedProductGroupByConfigIdFailure,
  UpdateMappedProductGroupByConfigId,
  LoadDiscountTypesSuccess,
  LoadDiscountTypesFailure,
  LoadDiscountTypes,
  SaveSlabDetails,
  SaveSlabDetailsSuccess,
  SaveSlabDetailsFailure
} from './discount-config.actions';
import * as moment from 'moment';
import {
  BrandDataService,
  LovDataService,
  ProductGroupDataService
} from '@poss-web/shared/masters/data-access-masters';

describe('  Discount Config Effects Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: DiscountConfigEffect;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get', 'post', 'patch']
  );

  const initialState = {};
  let discountConfigService = jasmine.createSpyObj<DiscountConfigService>(
    'DiscountConfigService',
    [
      'loadDiscountConfigList',
      'loadDiscountDetailsById',
      'saveDiscountsDetails',
      'editDiscountDetails',
      'getMappedLocationsList',
      'getMappedProductCategoryList',
      'getMappedProductGroupsList',
      'getExcludeItemsList',
      'saveMappedLocations',
      'saveMappedProductCategories',
      'saveMappedProductGroups',
      'saveExcludeThemeCodes',
      'saveExcludeTypes',
      'getSelectedLocations',
      'getSelectedProductGroups',
      'getSelectedProductCategories',
      'loadRangeTepDurationDays',
      'loadBeastDealDiscount',
      'saveMappedBestDealDiscount',
      'getSelectedBestDealDiscount',
      'publishDiscount',
      'saveSlabDetails',
      'computeTSSSConfig',
      'updateEmpowermentDiscountDetails',
      'getDownloadUrlOfTsssConfig',
      'getEmpowermentDiscountDetails',
      'saveExcludeSchemeCodes',
      'updateMappedProductGroups',
      'loadMappedProductGroups',
      'loadDiscountDetails',
      'saveDiscountDetails'
    ]
  );
  const lovDataServiceSpy = jasmine.createSpyObj<LovDataService>([
    'getLocationLovs',
    'getLov'
  ]);
  const brandDataServiceeSpy = jasmine.createSpyObj<BrandDataService>([
    'getBrandSummary'
  ]);
  const productGroupDataServicepy = jasmine.createSpyObj<
    ProductGroupDataService
  >(['getProductGroups']);
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DiscountConfigEffect,
        DataPersistence,
        provideMockStore({ initialState }),
        provideMockActions(() => actions$),
        {
          provide: POSS_WEB_API_URL,
          useValue: ''
        },

        {
          provide: HttpClient,
          useValue: httpClientSpy
        },
        {
          provide: DiscountConfigService,
          useValue: {
            loadDiscountConfigList: jasmine.createSpy(),
            loadDiscountDetailsById: jasmine.createSpy(),
            saveDiscountsDetails: jasmine.createSpy(),
            editDiscountDetails: jasmine.createSpy(),
            getMappedLocationsList: jasmine.createSpy(),
            loadBeastDealDiscount: jasmine.createSpy(),
            saveMappedBestDealDiscount: jasmine.createSpy(),
            getSelectedBestDealDiscount: jasmine.createSpy(),
            publishDiscount: jasmine.createSpy(),
            saveSlabDetails: jasmine.createSpy(),
            computeTSSSConfig: jasmine.createSpy(),
            updateEmpowermentDiscountDetails: jasmine.createSpy(),
            getDownloadUrlOfTsssConfig: jasmine.createSpy(),
            getEmpowermentDiscountDetails: jasmine.createSpy(),
            saveExcludeSchemeCodes: jasmine.createSpy(),
            getSelectedProductCategories: jasmine.createSpy(),
            getSelectedProductGroups: jasmine.createSpy(),
            getSelectedLocations: jasmine.createSpy(),
            loadRangeTepDurationDays: jasmine.createSpy(),
            saveMappedProductCategories: jasmine.createSpy(),
            getMappedProductCategoryList: jasmine.createSpy(),
            saveMappedLocations: jasmine.createSpy(),
            saveMappedProductGroups: jasmine.createSpy(),
            getMappedProductGroupsList: jasmine.createSpy(),
            updateMappedProductGroups: jasmine.createSpy(),
            loadMappedProductGroups: jasmine.createSpy(),
            loadDiscountDetails: jasmine.createSpy(),
            saveDiscountDetails: jasmine.createSpy(),
            saveExcludeTypes: jasmine.createSpy(),
            saveExcludeThemeCodes: jasmine.createSpy(),
            getExcludeItemsList: jasmine.createSpy()
          }
        },
        {
          provide: LovDataService,
          useValue: lovDataServiceSpy
        },
        {
          provide: BrandDataService,
          useValue: brandDataServiceeSpy
        },
        {
          provide: ProductGroupDataService,
          useValue: productGroupDataServicepy
        }
      ]
    });

    effect = TestBed.inject(DiscountConfigEffect);
    discountConfigService = TestBed.inject<any>(DiscountConfigService);
  });
  const discountConfig: NewDiscountApplicableConfig = {
    abCoData: {
      type: DiscountApplicableEnum.AB_CO_DATA,
      data: {
        coDiscount: {
          preview: false,
          regular: false,
          co: false,
          postCO: false,
          postRegular: false
        },
        abDiscount: {
          preview: false,
          regular: false,
          ab: false,
          postAB: false,
          postRegular: false
        }
      }
    },
    orderDetails: {
      type: DiscountApplicableEnum.AB_CO_TYPE,
      data: {
        isGoldRateFrozenForCO: false,
        isGoldRateFrozenForAB: false,
        offerPeriodForCO: 0,
        offerPeriodForAB: 0,
        coPercent: 0,
        abPercent: 0,
        isAllowedToChangeCO: false,
        isDisplayOnCO: false,
        isAllowedToChangeAB: false,
        isDisplayOnAB: false
      }
    },
    tepDetails: {
      type: DiscountApplicableEnum.TEP_TYPE,
      data: {
        isEnabled: true,
        tepDetails: []
      }
    },
    grnDetails: {
      type: DiscountApplicableEnum.GRN_TYPE,
      data: {
        noOfDaysAfterOfferPeriod: 0,
        utilizationPercent: 0,
        isAllowedBeforeOffer: false,
        isSameCfaEligible: false
      }
    },
    basicCriteria: {
      type: DiscountApplicableEnum.BASIC_CRITERIA_TYPE,
      data: {
        isNarationMandatory: false,
        isTepRecovery: true,
        isEditable: true,
        isMultipleTransactionPerDayAllowed: false,
        maxTransactionPerDay: 0,
        ucp: {
          isValue: true,
          value: 0
        },
        startingSerialNo: null,

        tataEmployeeConfig: {
          maxCount: 0
        },
        coinConfig: {
          tepCNPercentage: 0,
          coinPurchasePeriod: {
            from: null,
            to: null
          },
          tepPeriod: {
            from: null,
            to: null
          },
          makingChargePercentage: 0
        },
        isFullValueTepDiscountRecovery: false,
        isApplicableForAutomatedDiscount: false
      }
    },
    clubOtherOffersConfig: {
      type: DiscountApplicableEnum.CLUB_OTHER_OFFERS,
      data: {
        isExchangeOffer: null,
        isFOCOffer: null,
        isGHS: null,
        isRiva: null,
        isDV: null,
        isCoin: null,
        isBillLevelDiscount: null
      }
    },
    clubDiscountType: {
      type: DiscountApplicableEnum.CLUB_DISCOUNT_TYPE,
      data: {
        isClubbedOtherDiscounts: false,
        isClubbedOtherBillLevelDiscounts: false,
        discountType: null
      }
    },
    cumulativeDetails: {
      type: DiscountApplicableEnum.CUMULATIVE_TYPE,
      data: { isSameStore: false, isOtherStore: false, isFamilyTree: false }
    },
    applicableThemes: {
      type: DiscountTypeEnum.HIGH_VALUE_DISCOUNT,
      data: {
        digit1: false,
        digit2: false,
        digit3: false,
        digit4: false,
        digit5: false,
        digit6: false,
        digit8: false,
        digit9: false,
        digit10: false,
        digit11: false,
        digit12: false,
        digit13: false,
        digit14: false
      }
    },
    configDetails: {
      type: DiscountApplicableEnum.EXCHANGE_OFFER_CONFIG,
      data: {
        applicableCN: {
          isTep: false,
          isGep: false
        },
        minCNUtilizationPercent: null,
        isResidualFund: false
      }
    }
  };
  const discountHeaderDetails: NewDiscountDetails = {
    id: 'AAA',
    discountCode: 'AAA',
    description: 'AAA',
    discountType: 'AAA',
    occasion: 'AAA',
    approvedBy: 'AAA',
    brandCode: 'AAA',
    subBrandCode: 'AAA',
    applicableLevels: 'AAA',
    remarks: 'AAA',
    isAccrualUlpPoints: false,
    isActive: false,
    isRiva: false,
    // configDetails?: any,
    // itemGroupConfi?: any;
    isCoOfferApplicable: false,
    isPreviewApplicable: false,
    isAbOfferApplicable: false,
    ulpCreateDate: moment()
  };
  describe('loadDiscountConfigList', () => {
    it('should return a stream with discount config list', () => {
      const parameters: DisountConfigListPayload = {
        pageIndex: 0,
        pageSize: 100
      };
      const discountListing: DiscountConfigSuccessList = {
        discountConfigList: [],
        count: 0
      };
      const action = new LoadDiscountConfigList(parameters);
      const outcome = new LoadDiscountConfigListSuccess(discountListing);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: discountListing });
      discountConfigService.loadDiscountConfigList.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadDiscountConfigList$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters: DisountConfigListPayload = {
        pageIndex: 0,
        pageSize: 100
      };

      const action = new LoadDiscountConfigList(parameters);
      const error = new Error('some error');
      const outcome = new LoadDiscountConfigListFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      discountConfigService.loadDiscountConfigList.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadDiscountConfigList$).toBeObservable(expected);
    });
  });
  describe('loadDiscountDetails', () => {
    it('should return a stream with Discount Config object', () => {
      const parameters = 'disicountId';

      const action = new LoadDiscountConfigDetails(parameters);
      const outcome = new LoadDiscountConfigDetailsSuccess(discountConfig);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: discountConfig });
      discountConfigService.loadDiscountDetailsById.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadDiscountDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters = 'disicountId';
      const action = new LoadDiscountConfigDetails(parameters);
      const error = new Error('some error');
      const outcome = new LoadDiscountConfigDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      discountConfigService.loadDiscountDetailsById.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadDiscountDetails$).toBeObservable(expected);
    });
  });

  describe('saveDiscountsDetails', () => {
    it('should return a stream with Discount Details list', () => {
      const parameters = discountHeaderDetails;

      const action = new SaveDiscountConfigList(parameters);
      const outcome = new SaveDiscountConfigListSuccess(parameters);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: parameters });
      discountConfigService.saveDiscountsDetails.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.saveDiscountDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters = discountHeaderDetails;

      const action = new SaveDiscountConfigList(parameters);
      const error = new Error('some error');
      const outcome = new SaveDiscountConfigListFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      discountConfigService.saveDiscountsDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.saveDiscountDetails$).toBeObservable(expected);
    });
  });

  describe('editDiscountDetails', () => {
    it('should return a stream with Discount Config list', () => {
      const id = 'discountId';
      const parameters = discountConfig;

      const action = new EditDiscountConfigList(id, parameters);
      const outcome = new EditDiscountConfigListSuccess();
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: parameters });
      discountConfigService.editDiscountDetails.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.editDiscountDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const id = 'discountId';
      const parameters = discountConfig;

      const action = new EditDiscountConfigList(id, parameters);
      const error = new Error('some error');
      const outcome = new EditDiscountConfigListFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      discountConfigService.editDiscountDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.editDiscountDetails$).toBeObservable(expected);
    });
  });

  describe('loadDiscountLocationDetails', () => {
    const parameters: DiscountLocationListPayload = {
      id: 'AAA-TEST-BBBB-CCCC',
      pageIndex: 0,
      pageSize: 100,
      locationCode: 'CPD',
      offerEndDate: moment(),
      offerStartDate: moment(),
      previewEndDate: moment(),
      previewStartDate: moment(),
      configDetails: {}
    };
    it('should return a stream with Discount Config list', () => {
      const discountLocationListing: DiscountLocationSuccessList = {
        discountLocationList: [],
        count: 0
      };
      const action = new LoadDiscountMappedLocationList(parameters);
      const outcome = new LoadDiscountMappedLocationListSuccess(
        discountLocationListing
      );
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: discountLocationListing });
      discountConfigService.getMappedLocationsList.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadDiscountLocationDetails$).toBeObservable(expected$);
    });

    // it('should fail and return an action with the error', () => {
    //   const action = new LoadDiscountMappedLocationList(parameters);
    //   const error = new Error('some error');
    //   const outcome = new LoadDiscountMappedLocationListFailure(
    //     CustomErrorAdaptor.fromJson(error)
    //   );
    //   actions$ = hot('-a', { a: action });
    //   const response$ = cold('-#|', {}, error);
    //   discountConfigService.getMappedLocationsList.and.returnValue(response$);
    //   const expected = cold('--b', { b: outcome });
    //   expect(effect.loadDiscountLocationDetails$).toBeObservable(expected);
    // });
    it('should fail and return an action with the error', () => {
      const response = {
        discountLocationList: [],
        count: 0
      };
      const action = new LoadDiscountMappedLocationList(parameters);
      const error = new Error('some error');
      const outcome = new LoadDiscountMappedLocationListSuccess(response);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      discountConfigService.getMappedLocationsList.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadDiscountLocationDetails$).toBeObservable(expected);
    });
  });

  describe('LoadBestDealDiscountList', () => {
    it('should return a stream with  Best Deal Discount list', () => {
      const parameters: DisountConfigListPayload = {
        pageIndex: 0,
        pageSize: 10,
        discountCode: 'AANDDJIWEE',
        discountType: 'HIGH-VALUE-DISCOUNT'
      };

      const bestDealDiscount: DiscountConfigSuccessList = {
        discountConfigList: [],
        count: 0
      };

      const action = new LoadBestDealDiscountList(parameters);
      const outcome = new LoadBestDealDiscountListSuccess(bestDealDiscount);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: bestDealDiscount });
      discountConfigService.loadBeastDealDiscount.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadBestDealDiscountList$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters: DisountConfigListPayload = {
        pageIndex: 0,
        pageSize: 10,
        discountCode: 'AANDDJIWEE',
        discountType: 'HIGH-VALUE-DISCOUNT'
      };
      const action = new LoadBestDealDiscountList(parameters);
      const error = new Error('some error');
      const outcome = new LoadBestDealDiscountListFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      discountConfigService.loadBeastDealDiscount.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadBestDealDiscountList$).toBeObservable(expected);
    });
  });

  describe('SaveBestDealDiscounts', () => {
    it('should return a stream with  Save Best Deal Discount', () => {
      const parameters: SaveBestDealDiscountPayload = {
        id: 'AKDDDM93999',
        addLinks: [],
        removeLinks: []
      };

      const action = new SaveBestDealDiscounts(parameters);
      const outcome = new SaveBestDealDiscountsSuccess();
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {});
      discountConfigService.saveMappedBestDealDiscount.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.saveBestDealDiscounts$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters: SaveBestDealDiscountPayload = {
        id: 'AKDDDM93999',
        addLinks: [],
        removeLinks: []
      };
      const action = new SaveBestDealDiscounts(parameters);
      const error = new Error('some error');
      const outcome = new SaveBestDealDiscountsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      discountConfigService.saveMappedBestDealDiscount.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.saveBestDealDiscounts$).toBeObservable(expected);
    });
  });

  describe('LoadSelectedBestDealDiscounts', () => {
    it('should return a stream with  selected Best Deal Discount', () => {
      const parameters: DiscountBestDealListPayload = {
        id: 'AKDDDM93999',
        pageIndex: 0,
        pageSize: 10
      };

      const response: MappedBestDealDiscountSuccessList = {
        mappedDetails: [],
        count: 0
      };

      const action = new LoadSelectedBestDealDiscounts(parameters);
      const outcome = new LoadSelectedBestDealDiscountSuccess(response);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: response });
      discountConfigService.getSelectedBestDealDiscount.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadSelectedBestDealDiscounts$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters: DiscountBestDealListPayload = {
        id: 'AKDDDM93999',
        pageIndex: 0,
        pageSize: 10
      };
      const action = new LoadSelectedBestDealDiscounts(parameters);
      const error = new Error('some error');
      const outcome = new LoadSelectedBestDealDiscountFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      discountConfigService.getSelectedBestDealDiscount.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.loadSelectedBestDealDiscounts$).toBeObservable(expected);
    });
  });

  describe('PublishDiscountConfig', () => {
    it('should return a stream with  published Discount', () => {
      const parameters = 'AKDDDM93999';

      const action = new PublishDiscountConfig(parameters);
      const outcome = new PublishDiscountConfigSuccess();
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {});
      discountConfigService.publishDiscount.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.publishDiscountConfig$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters = 'AKDDDM93999';
      const action = new PublishDiscountConfig(parameters);
      const error = new Error('some error');
      const outcome = new PublishDiscountConfigFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      discountConfigService.publishDiscount.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.publishDiscountConfig$).toBeObservable(expected);
    });
  });

  describe('SaveEmpowermentDetails', () => {
    it('should return a stream with  save empowerment details', () => {
      const parameters = null;

      const response = null;

      const action = new SaveEmpowermentDetails(parameters);
      const outcome = new SaveEmpowermentDetailsSuccess(response);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: response });
      discountConfigService.saveSlabDetails.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.saveEmpowermentDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters: DiscountBestDealListPayload = {
        id: 'AKDDDM93999',
        pageIndex: 0,
        pageSize: 10
      };
      const action = new SaveEmpowermentDetails(parameters);
      const error = new Error('some error');
      const outcome = new SaveEmpowermentDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      discountConfigService.saveSlabDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.saveEmpowermentDetails$).toBeObservable(expected);
    });
  });

  describe('ComputeTsssConfig', () => {
    it('should return a stream with  computed TSSS config', () => {
      const parameters: TSSSRequestPayload = {
        discountId: 'AFSFFF6777',
        couponRequest: null
      };

      const response = null;

      const action = new ComputeTsssConfig(parameters);
      const outcome = new ComputeTsssConfigSuccess(response);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: response });
      discountConfigService.computeTSSSConfig.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.computeTsssConfig$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters: TSSSRequestPayload = {
        discountId: 'AFSFFF6777',
        couponRequest: null
      };

      const action = new ComputeTsssConfig(parameters);
      const error = new Error('some error');
      const outcome = new ComputeTsssConfigFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      discountConfigService.computeTSSSConfig.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.computeTsssConfig$).toBeObservable(expected);
    });
  });

  describe('UpdateEmpowermentDetails', () => {
    it('should return a stream with  Update Empowerment Details', () => {
      const parameters = null;

      const response = null;

      const action = new UpdateEmpowermentDetails(parameters);
      const outcome = new UpdateEmpowermentDetailsSuccess(response);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: response });
      discountConfigService.updateEmpowermentDiscountDetails.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.updateEmpowermentDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters = null;

      const action = new UpdateEmpowermentDetails(parameters);
      const error = new Error('some error');
      const outcome = new UpdateEmpowermentDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      discountConfigService.updateEmpowermentDiscountDetails.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.updateEmpowermentDetails$).toBeObservable(expected);
    });
  });

  describe('LoadTsssConfigDownloadUrl', () => {
    it('should return a stream with Load TSSS config download url', () => {
      const parameters = null;

      const response = null;

      const action = new LoadTsssConfigDownloadUrl(parameters);
      const outcome = new LoadTsssConfigDownloadUrlSuccess(response);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: response });
      discountConfigService.getDownloadUrlOfTsssConfig.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.tsssConfigDownloadUrl$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters = null;

      const action = new LoadTsssConfigDownloadUrl(parameters);
      const error = new Error('some error');
      const outcome = new LoadTsssConfigDownloadUrlFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      discountConfigService.getDownloadUrlOfTsssConfig.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.tsssConfigDownloadUrl$).toBeObservable(expected);
    });
  });

  describe('loadEmpowermentDiscDetails', () => {
    it('should return a stream with Load Empowerment discount details', () => {
      const parameters = null;

      const response = null;

      const action = new LoadEmpowermentDiscountDetails(parameters);
      const outcome = new LoadEmpowermentDiscountDetailsSuccess(response);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: response });
      discountConfigService.getEmpowermentDiscountDetails.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadEmpowermentDiscDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters = null;

      const action = new LoadEmpowermentDiscountDetails(parameters);
      const error = new Error('some error');
      const outcome = new LoadEmpowermentDiscountDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      discountConfigService.getEmpowermentDiscountDetails.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.loadEmpowermentDiscDetails$).toBeObservable(expected);
    });
  });

  describe('saveDiscountExcludeSchemesDetails', () => {
    it('should return a stream with Load saveDiscountExcludeSchemesDetails discount details', () => {
      const parameters: SaveDiscountSchemesPayload = {
        id: '1',
        isActive: true,
        excludeType: 'SCHME_CODE',
        addSchemes: [],
        removeSchemes: [],
        updateSchemes: []
      };

      const action = new SaveDiscountExcludeSchemes(parameters);
      const outcome = new SaveDiscountExcludeSchemesSuccess();
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: {} });
      discountConfigService.saveExcludeSchemeCodes.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.saveDiscountExcludeSchemesDetails$).toBeObservable(
        expected$
      );
    });

    it('should fail and return an action with the error', () => {
      const parameters = null;

      const action = new SaveDiscountExcludeSchemes(parameters);
      const error = new Error('some error');
      const outcome = new SaveDiscountExcludeSchemesFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      discountConfigService.saveExcludeSchemeCodes.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.saveDiscountExcludeSchemesDetails$).toBeObservable(
        expected
      );
    });
  });

  describe('loadSelectedLocations', () => {
    it('should return a stream with Load loadSelectedLocations discount details', () => {
      const parameters: DiscountLocationListPayload = {
        id: 'AAA-TEST-BBBB-CCCC',
        pageIndex: 0,
        pageSize: 100,
        locationCode: 'CPD',
        offerEndDate: moment(),
        offerStartDate: moment(),
        previewEndDate: moment(),
        previewStartDate: moment(),
        configDetails: {}
      };
      const res: MappedDetails[] = [
        {
          id: '',
          uuid: '2',
          description: 'URB',
          isActive: true
        }
      ];

      const action = new LoadSelectedLocations(parameters);
      const outcome = new LoadSelectedLocationsSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      discountConfigService.getSelectedLocations.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadSelectedLocations$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters = null;

      const action = new LoadSelectedLocations(parameters);
      const error = new Error('some error');
      const outcome = new LoadSelectedLocationsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      discountConfigService.getSelectedLocations.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadSelectedLocations$).toBeObservable(expected);
    });
  });

  describe('loadSelectedProductGroups', () => {
    it('should return a stream with Load loadSelectedProductGroups  discount details', () => {
      const parameters: DiscountProductGroupListPayload = {
        id: 'AAA-TEST-BBBB-CCCC',
        pagination: { pageIndex: 0, pageSize: 100 },
        productGroupCodeList: [],
        karatType: 'TEP'
      };
      const res: MappedDetails[] = [
        {
          id: '',
          uuid: '2',
          description: 'GOLD',
          isActive: true
        }
      ];

      const action = new LoadSelectedProductGroups(parameters);
      const outcome = new LoadSelectedProductGroupsSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      discountConfigService.getSelectedProductGroups.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadSelectedProductGroups$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters = null;

      const action = new LoadSelectedProductGroups(parameters);
      const error = new Error('some error');
      const outcome = new LoadSelectedProductGroupsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      discountConfigService.getSelectedProductGroups.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadSelectedProductGroups$).toBeObservable(expected);
    });
  });

  describe('loadSelectedProductCategories', () => {
    it('should return a stream with Load loadSelectedProductCategories  discount details', () => {
      const parameters: DiscountProductCategoryListPayload = {
        id: 'AAA-TEST-BBBB-CCCC',
        pagination: { pageIndex: 0, pageSize: 100 },
        productCategoryCode: 'A'
      };
      const res: MappedDetails[] = [
        {
          id: '',
          uuid: '2',
          description: 'GOLD',
          isActive: true
        }
      ];

      const action = new LoadSelectedProductCategories(parameters);
      const outcome = new LoadSelectedProductCategoriesSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      discountConfigService.getSelectedProductCategories.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadSelectedProductCategories$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters = null;

      const action = new LoadSelectedProductCategories(parameters);
      const error = new Error('some error');
      const outcome = new LoadSelectedProductCategoriesFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      discountConfigService.getSelectedProductCategories.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.loadSelectedProductCategories$).toBeObservable(expected);
    });
  });

  describe('loadApplicableLevels', () => {
    it('should return a stream with Load loadApplicableLevels  discount details', () => {
      const parameters = 'L1';
      const res: Lov[] = [
        {
          code: 'L1',
          value: 'L1',
          isActive: true
        }
      ];
      const action = new LoadApplicableLevels(parameters);
      const outcome = new LoadApplicableLevelsSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      lovDataServiceSpy.getLocationLovs.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadApplicableLevels$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters = null;

      const action = new LoadApplicableLevels(parameters);
      const error = new Error('some error');
      const outcome = new LoadApplicableLevelsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      lovDataServiceSpy.getLocationLovs.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadApplicableLevels$).toBeObservable(expected);
    });
  });

  describe('loadBrands$', () => {
    it('should return a stream with list of brands', () => {
      const res: BrandSummary[] = [
        {
          brandCode: 'Tanishq',
          description: 'Tanishq'
        }
      ];

      const action = new LoadBrands();
      const outcome = new LoadBrandsSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      brandDataServiceeSpy.getBrandSummary.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadBrands$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadBrands();
      const error = new Error('some error');
      const outcome = new LoadBrandsFailure(CustomErrorAdaptor.fromJson(error));
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      brandDataServiceeSpy.getBrandSummary.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadBrands$).toBeObservable(expected);
    });
  });

  describe('loadSubBrands$', () => {
    const parameters = 'Tanishq';
    it('should return a stream with list of subbrands', () => {
      const res: BrandSummary[] = [
        {
          brandCode: 'Tanishq',
          description: 'Tanishq'
        }
      ];

      const action = new LoadSubBrands(parameters);
      const outcome = new LoadSubBrandsSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      brandDataServiceeSpy.getBrandSummary.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadSubBrands$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadSubBrands(parameters);
      const error = new Error('some error');
      const outcome = new LoadSubBrandsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      brandDataServiceeSpy.getBrandSummary.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadSubBrands$).toBeObservable(expected);
    });
  });
  describe('LoadTepDurationDaysRange', () => {
    it('should return a stream with Load LoadTepDurationDaysRange  discount details', () => {
      const res: Lov[] = [
        {
          code: 'L1',
          value: 'L1',
          isActive: true
        }
      ];
      const action = new LoadTepDurationDaysRange();
      const outcome = new LoadTepDurationDaysRangeSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      discountConfigService.loadRangeTepDurationDays.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadRangeWeight$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadTepDurationDaysRange();
      const error = new Error('some error');
      const outcome = new LoadTepDurationDaysRangeFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      discountConfigService.loadRangeTepDurationDays.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadRangeWeight$).toBeObservable(expected);
    });
  });

  describe('saveDiscountLocationDetails', () => {
    it('should return a stream with Load saveDiscountLocationDetails  discount details', () => {
      const parameters: SaveDiscountLocationsPayload = {
        id: 'AAA',
        payload: {
          addLocations: [],
          configDetails: {
            data: {},
            type: 'AAA'
          },
          removeLocations: [],
          status: true,
          updateLocations: [],
          validity: {
            offerEndDate: 1111,
            offerStartDate: 1111,
            previewEndDate: 1111,
            previewStartDate: 1111
          }
        }
      };

      const action = new SaveDiscountLocations(parameters);
      const outcome = new SaveDiscountLocationsSuccess();
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: {} });
      discountConfigService.saveMappedLocations.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.saveDiscountLocationDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters = null;

      const action = new SaveDiscountLocations(parameters);
      const error = new Error('some error');
      const outcome = new SaveDiscountLocationsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      discountConfigService.saveMappedLocations.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.saveDiscountLocationDetails$).toBeObservable(expected);
    });
  });

  describe('loadDiscountProductCategoryDetails', () => {
    it('should return a stream with Load loadDiscountProductCategoryDetails  discount details', () => {
      const parameters: DiscountProductCategoryListPayload = {
        id: 'AAA-TEST-BBBB-CCCC',
        pagination: { pageIndex: 0, pageSize: 100 },
        productCategoryCode: 'A'
      };
      const res: DiscountProductCategorySuccessList = {
        discountProductCategoryList: [],
        count: 0
      };

      const action = new LoadDiscountMappedProductCategoryList(parameters);
      const outcome = new LoadDiscountMappedProductCategoryListSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      discountConfigService.getMappedProductCategoryList.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadDiscountProductCategoryDetails$).toBeObservable(
        expected$
      );
    });
  });

  describe('saveDiscountProductCategoryDetails', () => {
    it('should return a stream with Load saveDiscountProductCategoryDetails  discount details', () => {
      const parameters: SaveDiscountProductCategoryPayload = {
        id: '',
        addProductCategories: [],
        isActive: true,
        removeProductCategories: [],
        updateProductCategories: []
      };

      const action = new SaveDiscountProductCategory(parameters);
      const outcome = new SaveDiscountProductCategorySuccess();
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: {} });
      discountConfigService.saveMappedProductCategories.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.saveDiscountProductCategoryDetails$).toBeObservable(
        expected$
      );
    });

    it('should fail and return an action with the error', () => {
      const parameters = null;

      const action = new SaveDiscountProductCategory(parameters);
      const error = new Error('some error');
      const outcome = new SaveDiscountProductCategoryFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      discountConfigService.saveMappedProductCategories.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.saveDiscountProductCategoryDetails$).toBeObservable(
        expected
      );
    });
  });

  describe('loadDiscountProductGroupDetails', () => {
    it('should return a stream with Load loadDiscountProductGroupDetails  discount details', () => {
      const parameters: DiscountProductGroupListPayload = {
        id: 'AAA-TEST-BBBB-CCCC',
        pagination: { pageIndex: 0, pageSize: 100 },
        productGroupCodeList: [],
        karatType: 'TEP'
      };
      const res: DiscountProductGroupSuccessList = {
        discountProductGroupList: [],
        count: 0
      };

      const action = new LoadDiscountMappedProductGroupList(parameters);
      const outcome = new LoadDiscountMappedProductGroupListSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      discountConfigService.getMappedProductGroupsList.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadDiscountProductGroupDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters = null;

      const action = new LoadDiscountMappedProductGroupList(parameters);
      const error = new Error('some error');
      const outcome = new LoadDiscountMappedProductGroupListFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      discountConfigService.getMappedProductGroupsList.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.loadDiscountProductGroupDetails$).toBeObservable(expected);
    });
  });

  describe('saveDiscountProductGroupDetails', () => {
    it('should return a stream with Load saveDiscountProductGroupDetails  discount details', () => {
      const parameters: SaveDiscountProductGroupPayload = {
        id: '',
        karatType: 'TEP',
        addProducts: [],
        eligibleKarat: 5,
        removeProducts: [],
        updateProducts: []
      };

      const action = new SaveDiscountProductGroups(parameters);
      const outcome = new SaveDiscountProductGroupsSuccess();
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: {} });
      discountConfigService.saveMappedProductGroups.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.saveDiscountProductGroupDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters = null;

      const action = new SaveDiscountProductGroups(parameters);
      const error = new Error('some error');
      const outcome = new SaveDiscountProductGroupsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      discountConfigService.saveMappedProductGroups.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.saveDiscountProductGroupDetails$).toBeObservable(expected);
    });
  });

  describe('loadDiscountExcludeConfigDetails', () => {
    it('should return a stream with Load loadDiscountExcludeConfigDetails  discount details', () => {
      const parameters: DiscounExcludeItemListPayload = {
        id: 'AAA-TEST-BBBB-CCCC',
        pagination: { pageIndex: 0, pageSize: 100 },
        isPageable: false,
        itemCode: 'AAA',
        excludeType: 'THEME_CODE',
        sort: true
      };
      const res: DiscountExcludeItemSuccessList = {
        discountExcludeItemList: [],
        count: 0
      };

      const action = new LoadDiscountExcludeTypeList(parameters);
      const outcome = new LoadDiscountExcludeTypeListSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      discountConfigService.getExcludeItemsList.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadDiscountExcludeConfigDetails$).toBeObservable(
        expected$
      );
    });

    it('should fail and return an action with the error', () => {
      const parameters = null;

      const action = new LoadDiscountExcludeTypeList(parameters);
      const error = new Error('some error');
      const outcome = new LoadDiscountExcludeTypeListFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      discountConfigService.getExcludeItemsList.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadDiscountExcludeConfigDetails$).toBeObservable(expected);
    });
  });

  describe('loadDiscountExcludeItemDetails', () => {
    it('should return a stream with Load loadDiscountExcludeItemDetails  discount details', () => {
      const parameters: DiscounExcludeItemListPayload = {
        id: 'AAA-TEST-BBBB-CCCC',
        pagination: { pageIndex: 0, pageSize: 100 },
        isPageable: false,
        itemCode: 'AAA',
        excludeType: 'THEME_CODE',
        sort: true
      };
      const res: DiscountExcludeItemSuccessList = {
        discountExcludeItemList: [],
        count: 0
      };

      const action = new LoadDiscountExcludeItemCodes(parameters);
      const outcome = new LoadDiscountExcludeItemCodesSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      discountConfigService.getExcludeItemsList.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadDiscountExcludeItemDetails$).toBeObservable(expected$);
    });

    // it('should fail and return an action with the error', () => {
    //   const parameters = null;

    //   const action = new LoadDiscountExcludeItemCodes(parameters);
    //   const error = new Error('some error');
    //   const outcome = new LoadDiscountExcludeItemCodesFailure(
    //     CustomErrorAdaptor.fromJson(error)
    //   );
    //   actions$ = hot('-a', { a: action });
    //   const response$ = cold('-#|', {}, error);
    //   discountConfigService.getExcludeItemsList.and.returnValue(response$);
    //   const expected = cold('--b', { b: outcome });
    //   expect(effect.loadDiscountExcludeItemDetails$).toBeObservable(expected);
    // });
  });

  describe('saveDiscountExcludeThemesDetails', () => {
    it('should return a stream with Load saveDiscountExcludeThemesDetails  discount details', () => {
      const parameters: SaveDiscountThemesPayload = {
        id: '',
        excludeType: 'THEME_CODE',
        addThemes: [],
        removeThemes: [],
        updateThemes: []
      };
      const res: DiscountExcludeItemSuccessList = {
        discountExcludeItemList: [],
        count: 0
      };

      const action = new SaveDiscountExcludeThemes(parameters);
      const outcome = new SaveDiscountExcludeThemesSuccess();
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: {} });
      discountConfigService.saveExcludeThemeCodes.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.saveDiscountExcludeThemesDetails$).toBeObservable(
        expected$
      );
    });

    it('should fail and return an action with the error', () => {
      const parameters = null;

      const action = new SaveDiscountExcludeThemes(parameters);
      const error = new Error('some error');
      const outcome = new SaveDiscountExcludeThemesFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      discountConfigService.saveExcludeThemeCodes.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.saveDiscountExcludeThemesDetails$).toBeObservable(expected);
    });
  });

  describe('saveDiscountExcludeTypeDetails', () => {
    it('should return a stream with Load saveDiscountExcludeTypeDetails  discount details', () => {
      const parameters: SaveExcludeTypePayload = {
        id: '',
        excludeType: 'COMPLEXITY_PERCENT',
        payload: {
          addValues: [
            {
              fromValue: 1,
              toValue: 2
            }
          ],
          removeValues: [],
          updateValue: [
            {
              fromValue: 2,
              id: 'AAA',
              toValue: 3
            }
          ]
        }
      };

      const action = new SaveDiscountExcludeTypes(parameters);
      const outcome = new SaveDiscountExcludeTypesSuccess();
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: {} });
      discountConfigService.saveExcludeTypes.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.saveDiscountExcludeTypeDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters = null;

      const action = new SaveDiscountExcludeTypes(parameters);
      const error = new Error('some error');
      const outcome = new SaveDiscountExcludeTypesFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      discountConfigService.saveExcludeTypes.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.saveDiscountExcludeTypeDetails$).toBeObservable(expected);
    });
  });

  describe('saveSlabDetails', () => {
    it('should return a stream with Load saveSlabDetails  discount details', () => {
      const slabDetails = {
        discountCategory: '',
        eligibility: '',
        isSingle: true,
        maxValue: 1000,
        minValue: 1,
        rowId: 1,
        slabName: 'slab1',
        isActive: true
      };
      const payload = {
        addSlabDetails: [slabDetails],
        updateSlabDetails: [],
        isActive: true,
        removeDetails: []
      };

      const action = new SaveSlabDetails(payload);
      const outcome = new SaveSlabDetailsSuccess(payload);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: payload });
      discountConfigService.saveSlabDetails.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.saveSlabDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters = null;

      const action = new SaveSlabDetails(parameters);
      const error = new Error('some error');
      const outcome = new SaveSlabDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      discountConfigService.saveSlabDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.saveSlabDetails$).toBeObservable(expected);
    });
  });

  describe('saveDiscDetails', () => {
    it('should return a stream with Load saveDiscDetails  discount details', () => {
      const parameters: SaveExcludeTypePayload = {
        id: '',
        excludeType: 'COMPLEXITY_PERCENT',
        payload: {
          addValues: [
            {
              fromValue: 1,
              toValue: 2
            }
          ],
          removeValues: [],
          updateValue: [
            {
              fromValue: 2,
              id: 'AAA',
              toValue: 3
            }
          ]
        }
      };

      const action = new SaveDiscountDetails(parameters);
      const outcome = new SaveDiscountDetailsSuccess(parameters);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: parameters });
      discountConfigService.saveDiscountDetails.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.saveDiscDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters = null;

      const action = new SaveDiscountDetails(parameters);
      const error = new Error('some error');
      const outcome = new SaveDiscountDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      discountConfigService.saveDiscountDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.saveDiscDetails$).toBeObservable(expected);
    });
  });

  describe('loadDiscDetails', () => {
    it('should return a stream with Load loadDiscDetails  discount details', () => {
      const parameters: SaveExcludeTypePayload = {
        id: '',
        excludeType: 'COMPLEXITY_PERCENT',
        payload: {
          addValues: [
            {
              fromValue: 1,
              toValue: 2
            }
          ],
          removeValues: [],
          updateValue: [
            {
              fromValue: 2,
              id: 'AAA',
              toValue: 3
            }
          ]
        }
      };

      const action = new LoadDiscountDetails(parameters);
      const outcome = new LoadDiscountDetailsSuccess(parameters);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: parameters });
      discountConfigService.loadDiscountDetails.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadDiscDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters = null;

      const action = new LoadDiscountDetails(parameters);
      const error = new Error('some error');
      const outcome = new LoadDiscountDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      discountConfigService.loadDiscountDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadDiscDetails$).toBeObservable(expected);
    });
  });

  describe('loadProductGroups', () => {
    it('should return a stream with Load loadProductGroups  discount details', () => {
      const parameters = {
        discountId: '1',
        discountDetailsId: '2'
      };
      const res: ProductGroupMappingOption[] = [
        {
          id: '1',
          description: '71'
        }
      ];
      const action = new LoadMappedProductGroupsByConfigId(parameters);
      const outcome = new LoadMappedProductGroupsByConfigIdSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      discountConfigService.loadMappedProductGroups.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadProductGroups$).toBeObservable(expected$);
    });

    // it('should fail and return an action with the error', () => {
    //   const parameters = {
    //     discountId: '1',
    //     discountDetailsId: '2'
    //   };

    //   const action = new LoadMappedProductGroupsByConfigId(parameters);
    //   const error = new Error('some error');
    //   const outcome = new LoadMappedProductGroupsByConfigIdFailure(
    //     CustomErrorAdaptor.fromJson(error)
    //   );
    //   actions$ = hot('-a', { a: action });
    //   const response$ = cold('-#|', {}, error);
    //   discountConfigService.loadMappedProductGroups.and.returnValue(response$);
    //   const expected = cold('--b', { b: outcome });
    //   expect(effect.loadProductGroups$).toBeObservable(expected);
    // });
  });

  describe('updateProductGroups', () => {
    // it('should return a stream with Load updateProductGroups  discount details', () => {
    //   const parameters = {
    //     discountId: '1',
    //     discountDetailsId: '2',
    //     data: {
    //       addProducts: [],
    //       removeProducts: [],
    //       updateProducts: []
    //     },
    //     loadData: null
    //   };
    //   const res: ProductGroupMappingOption[] = [
    //     {
    //       id: '1',
    //       description: '71'
    //     }
    //   ];
    //   const action = new UpdateMappedProductGroupByConfigId(parameters);
    //   const outcome = new UpdateMappedProductGroupByConfigIdSuccess(res);
    //   actions$ = hot('-a', { a: action });
    //   const response$ = cold('-a|', { a: res });
    //   discountConfigService.updateMappedProductGroups.and.returnValue(
    //     response$
    //   );
    //   const expected$ = cold('--b', { b: outcome });
    //   expect(effect.updateProductGroups$).toBeObservable(expected$);
    // });
    // it('should fail and return an action with the error', () => {
    //   const parameters = null;
    //   const action = new UpdateMappedProductGroupByConfigId(parameters);
    //   const error = new Error('some error');
    //   const outcome = new UpdateMappedProductGroupByConfigIdFailure(
    //     CustomErrorAdaptor.fromJson(error)
    //   );
    //   actions$ = hot('-a', { a: action });
    //   const response$ = cold('-#|', {}, error);
    //   discountConfigService.updateMappedProductGroups.and.returnValue(
    //     response$
    //   );
    //   const expected = cold('--b', { b: outcome });
    //   expect(effect.updateProductGroups$).toBeObservable(expected);
    // });
  });

  describe('loadDiscountTypes$', () => {
    const parameters = 'Tanishq';
    it('should return a stream  loadDiscountTypes', () => {
      const res: Lov[] = [
        {
          code: 'BEST_DEAL_DISCOUNT',
          value: 'BEST DEAL DISCOUNT',
          isActive: true
        }
      ];

      const action = new LoadDiscountTypes(parameters);
      const outcome = new LoadDiscountTypesSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      lovDataServiceSpy.getLov.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadDiscountTypes$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadDiscountTypes(parameters);
      const error = new Error('some error');
      const outcome = new LoadDiscountTypesFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      lovDataServiceSpy.getLov.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadDiscountTypes$).toBeObservable(expected);
    });
  });
});
