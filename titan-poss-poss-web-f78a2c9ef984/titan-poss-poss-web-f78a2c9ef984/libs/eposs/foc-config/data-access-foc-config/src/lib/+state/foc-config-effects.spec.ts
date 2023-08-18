//you here need to assert a reactive result as well as trigger an effect.
//To assert that an effect returns the right observable stream, we can use
// Rx Marbles.
import { Observable } from 'rxjs';
import { hot, cold } from 'jasmine-marbles';

import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { HttpClient } from '@angular/common/http';

import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { DataPersistence } from '@nrwl/angular';
import {
  FocConfigurationListPayload,
  FocConfigurationList,
  SchemeDetails,
  VariantDetails,
  SaveVariantDetailsPayload,
  LoadProductGroupPayload,
  ProductGroupMappingOption,
  SaveProductGroup,
  FocLocationListPayload,
  LocationListSuccessPayload,
  SaveLocationPayload,
  FocItemsSavePayload,
  FocItemsPayload,
  FocItemsResponse,
  FOCItemCodes,
  FOCItemCodesPayload
} from '@poss-web/shared/models';

import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { FocConfigurationEffect } from './foc-config-effects';
import { FocConfigService } from '../foc-config.service';
import {
  LoadFocConfigurationListSuccess,
  LoadFocConfigurationListFailure,
  LoadFocConfigurationList,
  UpdateFocSchemeConfigurationSuccess,
  UpdateFocSchemeConfigurationFailure,
  UpdateFocSchemeConfiguration,
  SaveFocSchemeConfigurationSuccess,
  SaveFocSchemeConfigurationFailure,
  SaveFocSchemeConfiguration,
  SearchConfigBySchemeNameSuccess,
  SearchConfigBySchemeNameFailure,
  SearchConfigBySchemeName,
  LoadFocSchemeConfigurationByConfigIdSuccess,
  LoadFocSchemeConfigurationByConfigIdFailure,
  LoadFocSchemeConfigurationByConfigId,
  LoadRangeWeightFailure,
  LoadRangeWeightSuccesss,
  LoadRangeWeight,
  SaveVariantDetailsSuccess,
  SaveVariantDetailsFailure,
  SaveVariantDetails,
  LoadVariantDetailsByIdFailure,
  LoadVariantDetailsByIdSuccess,
  LoadVariantDetailsById,
  LoadMappedProductGroupsByConfigIdSuccess,
  LoadMappedProductGroupsByConfigId,
  LoadMappedProductGroupsByConfigIdFailure,
  UpdateProductGroupByConfigIdSuccess,
  UpdateProductGroupByConfigIdFailure,
  UpdateProductGroupByConfigId,
  LoadLocationByIdSuccess,
  LoadLocationByIdFailure,
  LoadLocationById,
  UpdateLocationByIdSuccess,
  UpdateLocationByIdFailure,
  UpdateLocationById,
  SaveFocItemsSuccess,
  SaveFocItemsFailure,
  SaveFocItems,
  LoadMappedFocItemsByIdFailure,
  LoadMappedFocItemsByIdSuccess,
  LoadMappedFocItemsById,
  SearchFocItemFailure,
  SearchFocItemSuccess,
  SearchFocItem,
  LoadFocItemCodesSuccess,
  LoadFocItemCodesFailure,
  LoadFocItemCodes,
  SearchLocationCodeFailure,
  SearchLocationCodeSuccess,
  SearchLocationCode,
  PublishFocSchemeSuccesss,
  PublishFocScheme,
  PublishFocSchemeFailure,
  LoadVariantDetailsValueGoldStandardByIdSuccess,
  LoadVariantDetailsValueGoldStandardByIdFailure,
  LoadVariantDetailsValueGoldStandardById,
  LoadVariantDetailsValueGoldSlabByIdSuccess,
  LoadVariantDetailsValueGoldSlabById,
  LoadVariantDetailsValueGoldSlabByIdFailure,
  LoadVariantDetailsValueOthersStandardByIdSuccess,
  LoadVariantDetailsValueOthersStandardByIdFailure,
  LoadVariantDetailsValueOthersStandardById,
  LoadVariantDetailsValueOthersSlabByIdSuccess,
  LoadVariantDetailsValueOthersSlabByIdFailure,
  LoadVariantDetailsValueOthersSlabById,
  LoadVariantDetailsWeightGoldStandardByIdFailure,
  LoadVariantDetailsWeightGoldStandardById,
  LoadVariantDetailsWeightGoldStandardByIdSuccess,
  LoadVariantDetailsWeightGoldSlabByIdSuccess,
  LoadVariantDetailsWeightGoldSlabByIdFailure,
  LoadVariantDetailsWeightGoldSlabById,
  LoadVariantDetailsWeightOthersStandardByIdSuccess,
  LoadVariantDetailsWeightOthersStandardByIdFailure,
  LoadVariantDetailsWeightOthersStandardById,
  LoadVariantDetailsWeightOthersSlabByIdSuccess,
  LoadVariantDetailsWeightOthersSlabById,
  LoadVariantDetailsWeightOthersSlabByIdFailure,
  LoadAllSelectedItemCodesSuccess,
  LoadAllSelectedItemCodes,
  LoadAllSelectedItemCodesFailure,
  LoadAllSelectedLocationCodesSuccess,
  LoadAllSelectedLocationCodesFailure,
  LoadAllSelectedLocationCodes
} from './foc-config-actions';

describe('FocConfigurationEffect Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: FocConfigurationEffect;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get', 'post', 'patch']
  );
  const initialState = {};
  let focConfigService = jasmine.createSpyObj<FocConfigService>(
    'FocConfigService',
    [
      'getFocConfiguratonList',
      'saveFocConfiguration',
      'updateFocConfiguration',
      'searchConfigBySchemeName',
      'getFocSchemeConfiguration',
      'loadRangeWeight',
      'saveVariantDetails',
      'loadVariantDetails',
      'loadMappedProductGroups',
      'updateProductGroups',
      'loadMappedLocations',
      'updateLocationById',
      'loadFOCItemCodes',
      'saveFocItems',
      'loadMappedFocItems',
      'searchFocItems',
      'searchLocationCode',
      'publishFocScheme'
    ]
  );
  const variantDetails: VariantDetails = {
    weightBasedVariantDetails: [
      {
        focEligibility: 'PRE_DISCOUNT_TAX',
        id: '1',
        isActive: true,
        isMultiple: true,
        isSingle: true,
        itemCode: '',
        quantity: '1',
        rowId: '0',
        productGroupCount: 10,
        totalFocWt: '11',
        karatage: '22',
        multiplyingValue: '100',
        stdValue: '1',
        slabFrom: '100',
        slabTo: '200'
      }
    ],
    valueBasedVariantDetails: [
      {
        focEligibility: 'PRE_DISCOUNT_TAX',
        id: '1',
        isActive: true,
        isMultiple: true,
        isSingle: true,
        itemCode: '',
        quantity: '1',
        rowId: '0',
        productGroupCount: 10,
        totalFocWt: '11',
        karatage: '22',
        multiplyingValue: '100',
        stdValue: '1',
        slabFrom: '100',
        slabTo: '200'
      }
    ]
  };
  const fOCItemCodes: FOCItemCodes[] = [
    {
      itemCode: '53FCDS2222AE0',
      stdWeight: 32,
      karat: 22
    }
  ];
  const locationListSuccessPayload: LocationListSuccessPayload = {
    totalLocations: 100,
    locationList: [
      {
        locationCode: 'URB',
        description: 'URB',
        subBrandCode: 'Mia',
        startDate: '10',
        endDate: '12',
        isActive: 'isActive',
        id: '1'
      }
    ]
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FocConfigurationEffect,
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
          provide: FocConfigService,
          useValue: {
            searchSavedLocationPriceByLocationCode: jasmine.createSpy(),
            getFocConfiguratonList: jasmine.createSpy(),
            saveFocConfiguration: jasmine.createSpy(),
            updateFocConfiguration: jasmine.createSpy(),
            searchConfigBySchemeName: jasmine.createSpy(),
            getFocSchemeConfiguration: jasmine.createSpy(),
            loadRangeWeight: jasmine.createSpy(),
            saveVariantDetails: jasmine.createSpy(),
            loadVariantDetails: jasmine.createSpy(),
            loadMappedProductGroups: jasmine.createSpy(),
            updateProductGroups: jasmine.createSpy(),
            loadMappedLocations: jasmine.createSpy(),
            updateLocationById: jasmine.createSpy(),
            loadFOCItemCodes: jasmine.createSpy(),
            saveFocItems: jasmine.createSpy(),
            loadMappedFocItems: jasmine.createSpy(),
            searchFocItems: jasmine.createSpy(),
            searchLocationCode: jasmine.createSpy(),
            publishFocScheme: jasmine.createSpy()
          }
        }
      ]
    });

    effect = TestBed.inject(FocConfigurationEffect);
    focConfigService = TestBed.inject<any>(FocConfigService);
  });

  describe('loadFocConfigurationList', () => {
    it('should return a stream with foc config  list', () => {
      const payload: FocConfigurationListPayload = {
        pageIndex: 0,
        pageSize: 10,
        length: 10
      };

      const res: FocConfigurationList = {
        focConfigList: [
          {
            name: 'scheme one',
            description: 'scheme one'
          }
        ],
        totalElements: '1'
      };

      const action = new LoadFocConfigurationList(payload);
      const outcome = new LoadFocConfigurationListSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      focConfigService.getFocConfiguratonList.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadFocConfigurationList$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: FocConfigurationListPayload = {
        pageIndex: 0,
        pageSize: 10,
        length: 10
      };

      const action = new LoadFocConfigurationList(payload);
      const error = new Error('some error');
      const outcome = new LoadFocConfigurationListFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      focConfigService.getFocConfiguratonList.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadFocConfigurationList$).toBeObservable(expected);
    });
  });

  describe('updateFocSchemeConfiguration', () => {
    it('should return a stream with Updated scheme details ', () => {
      const schemeDetails: SchemeDetails = {
        id: '1',
        clubbingConfigData: {
          data: {
            isExchangeOffer: true,
            isCBO: true,
            isGHS: true,
            isRiva: true,
            isEmpowerment: true,
            isDV: true
          },
          type: 'CLUBBING OFFER'
        },
        description: 'Scheme One',
        grnConfigData: {
          data: {
            noOfDaysBeforeOfferPeriod: '1',
            noOfDaysAfterOfferPeriod: '2',
            utilizationPercent: '3'
          },
          type: 'GRN_CONFIG'
        },
        isActive: true,
        name: 'Scheme One',
        orderConfigData: {
          data: {
            isGoldRateFrozenForCO: true,
            isGoldRateFrozenForAB: true,
            offerPeriodForCO: '1',
            offerPeriodForAB: '2',
            coPercent: '3',
            abPercent: '22'
          },
          type: 'ORDER_CONFIG'
        },
        tepConfigData: {
          data: {
            isEnabled: true,
            tepDetails: [
              {
                durationInDays: '1',
                recoveryPercent: '10'
              }
            ]
          },
          type: 'TEP_CONFIG'
        }
      };

      const action = new UpdateFocSchemeConfiguration(schemeDetails);
      const outcome = new UpdateFocSchemeConfigurationSuccess(schemeDetails);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: schemeDetails });
      focConfigService.updateFocConfiguration.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.updateFocSchemeConfiguration$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const schemeDetails: SchemeDetails = {
        id: '1',
        clubbingConfigData: {
          data: {
            isExchangeOffer: true,
            isCBO: true,
            isGHS: true,
            isRiva: true,
            isEmpowerment: true,
            isDV: true
          },
          type: 'CLUBBING OFFER'
        },
        description: 'Scheme One',
        grnConfigData: {
          data: {
            noOfDaysBeforeOfferPeriod: '1',
            noOfDaysAfterOfferPeriod: '2',
            utilizationPercent: '3'
          },
          type: 'GRN_CONFIG'
        },
        isActive: true,
        name: 'Scheme One',
        orderConfigData: {
          data: {
            isGoldRateFrozenForCO: true,
            isGoldRateFrozenForAB: true,
            offerPeriodForCO: '1',
            offerPeriodForAB: '2',
            coPercent: '3',
            abPercent: '22'
          },
          type: 'ORDER_CONFIG'
        },
        tepConfigData: {
          data: {
            isEnabled: true,
            tepDetails: [
              {
                durationInDays: '1',
                recoveryPercent: '10'
              }
            ]
          },
          type: 'TEP_CONFIG'
        }
      };

      const action = new UpdateFocSchemeConfiguration(schemeDetails);
      const error = new Error('some error');
      const outcome = new UpdateFocSchemeConfigurationFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      focConfigService.updateFocConfiguration.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.updateFocSchemeConfiguration$).toBeObservable(expected);
    });
  });

  describe('saveFocSchemeConfiguration', () => {
    it('should return a stream with Saved Scheme Details', () => {
      const schemeDetails: SchemeDetails = {
        id: '1',
        clubbingConfigData: {
          data: {
            isExchangeOffer: true,
            isCBO: true,
            isGHS: true,
            isRiva: true,
            isEmpowerment: true,
            isDV: true
          },
          type: 'CLUBBING OFFER'
        },
        description: 'Scheme One',
        grnConfigData: {
          data: {
            noOfDaysBeforeOfferPeriod: '1',
            noOfDaysAfterOfferPeriod: '2',
            utilizationPercent: '3'
          },
          type: 'GRN_CONFIG'
        },
        isActive: true,
        name: 'Scheme One',
        orderConfigData: {
          data: {
            isGoldRateFrozenForCO: true,
            isGoldRateFrozenForAB: true,
            offerPeriodForCO: '1',
            offerPeriodForAB: '2',
            coPercent: '3',
            abPercent: '22'
          },
          type: 'ORDER_CONFIG'
        },
        tepConfigData: {
          data: {
            isEnabled: true,
            tepDetails: [
              {
                durationInDays: '1',
                recoveryPercent: '10'
              }
            ]
          },
          type: 'TEP_CONFIG'
        }
      };

      const action = new SaveFocSchemeConfiguration(schemeDetails);
      const outcome = new SaveFocSchemeConfigurationSuccess(schemeDetails);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: schemeDetails });
      focConfigService.saveFocConfiguration.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.saveFocSchemeConfiguration$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const schemeDetails: SchemeDetails = {
        id: '1',
        clubbingConfigData: {
          data: {
            isExchangeOffer: true,
            isCBO: true,
            isGHS: true,
            isRiva: true,
            isEmpowerment: true,
            isDV: true
          },
          type: 'CLUBBING OFFER'
        },
        description: 'Scheme One',
        grnConfigData: {
          data: {
            noOfDaysBeforeOfferPeriod: '1',
            noOfDaysAfterOfferPeriod: '2',
            utilizationPercent: '3'
          },
          type: 'GRN_CONFIG'
        },
        isActive: true,
        name: 'Scheme One',
        orderConfigData: {
          data: {
            isGoldRateFrozenForCO: true,
            isGoldRateFrozenForAB: true,
            offerPeriodForCO: '1',
            offerPeriodForAB: '2',
            coPercent: '3',
            abPercent: '22'
          },
          type: 'ORDER_CONFIG'
        },
        tepConfigData: {
          data: {
            isEnabled: true,
            tepDetails: [
              {
                durationInDays: '1',
                recoveryPercent: '10'
              }
            ]
          },
          type: 'TEP_CONFIG'
        }
      };

      const action = new SaveFocSchemeConfiguration(schemeDetails);
      const error = new Error('some error');
      const outcome = new SaveFocSchemeConfigurationFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      focConfigService.saveFocConfiguration.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.saveFocSchemeConfiguration$).toBeObservable(expected);
    });
  });

  describe('searchConfigBySchemeName', () => {
    it('should return a stream with foc scheme', () => {
      const payload = 'Scheme One';
      const res: FocConfigurationList = {
        focConfigList: [
          {
            name: 'scheme one',
            description: 'scheme one'
          }
        ],
        totalElements: '1'
      };

      const action = new SearchConfigBySchemeName(payload);
      const outcome = new SearchConfigBySchemeNameSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      focConfigService.searchConfigBySchemeName.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.searchConfigBySchemeName$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload = 'Scheme one';

      const action = new SearchConfigBySchemeName(payload);
      const error = new Error('some error');
      const outcome = new SearchConfigBySchemeNameFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      focConfigService.searchConfigBySchemeName.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.searchConfigBySchemeName$).toBeObservable(expected);
    });
  });

  describe('loadFocConfigurationByConfigId', () => {
    it('should return a stream with  Scheme Details', () => {
      const payload = '1';
      const schemeDetails: SchemeDetails = {
        id: '1',
        clubbingConfigData: {
          data: {
            isExchangeOffer: true,
            isCBO: true,
            isGHS: true,
            isRiva: true,
            isEmpowerment: true,
            isDV: true
          },
          type: 'CLUBBING OFFER'
        },
        description: 'Scheme One',
        grnConfigData: {
          data: {
            noOfDaysBeforeOfferPeriod: '1',
            noOfDaysAfterOfferPeriod: '2',
            utilizationPercent: '3'
          },
          type: 'GRN_CONFIG'
        },
        isActive: true,
        name: 'Scheme One',
        orderConfigData: {
          data: {
            isGoldRateFrozenForCO: true,
            isGoldRateFrozenForAB: true,
            offerPeriodForCO: '1',
            offerPeriodForAB: '2',
            coPercent: '3',
            abPercent: '22'
          },
          type: 'ORDER_CONFIG'
        },
        tepConfigData: {
          data: {
            isEnabled: true,
            tepDetails: [
              {
                durationInDays: '1',
                recoveryPercent: '10'
              }
            ]
          },
          type: 'TEP_CONFIG'
        }
      };

      const action = new LoadFocSchemeConfigurationByConfigId(payload);
      const outcome = new LoadFocSchemeConfigurationByConfigIdSuccess(
        schemeDetails
      );
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: schemeDetails });
      focConfigService.getFocSchemeConfiguration.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadFocConfigurationByConfigId$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload = '1';

      const action = new LoadFocSchemeConfigurationByConfigId(payload);
      const error = new Error('some error');
      const outcome = new LoadFocSchemeConfigurationByConfigIdFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      focConfigService.getFocSchemeConfiguration.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadFocConfigurationByConfigId$).toBeObservable(expected);
    });
  });

  describe('loadRangeWeight', () => {
    it('should return a stream with ranges', () => {
      const res = ['100-200'];
      const action = new LoadRangeWeight();
      const outcome = new LoadRangeWeightSuccesss(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      focConfigService.loadRangeWeight.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadRangeWeight$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadRangeWeight();
      const error = new Error('some error');
      const outcome = new LoadRangeWeightFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      focConfigService.loadRangeWeight.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadRangeWeight$).toBeObservable(expected);
    });
  });

  describe('saveVariantDetails', () => {
    it('should return a stream with saved variant details', () => {
      const payload: SaveVariantDetailsPayload = {
        masterId: '1',
        discountType: 'STANDARD',
        addSchemeDetails: [
          {
            category: 'VALUE_BASED',
            focEligibility: 'PRE_DISCOUNT_TAX',
            fromSaleValue: '100',
            isActive: true,
            isMultiple: true,
            isSingle: true,
            itemCode: '',
            itemType: 'GOLD',
            karat: '22',
            offerType: 'STANDARD',
            quantity: '1',
            rowId: '0',
            stdSaleValue: '1000',
            toSaleValue: '200',
            weight: '1'
          }
        ],
        updateSchemeDetails: [],
        deleteSchemeDetails: []
      };

      const action = new SaveVariantDetails(payload);
      const outcome = new SaveVariantDetailsSuccess(variantDetails);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: variantDetails });
      focConfigService.saveVariantDetails.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.saveVariantDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: SaveVariantDetailsPayload = {
        masterId: '1',
        discountType: 'STANDARD',
        addSchemeDetails: [
          {
            category: 'VALUE_BASED',
            focEligibility: 'PRE_DISCOUNT_TAX',
            fromSaleValue: '100',
            isActive: true,
            isMultiple: true,
            isSingle: true,
            itemCode: '',
            itemType: 'GOLD',
            karat: '22',
            offerType: 'STANDARD',
            quantity: '1',
            rowId: '0',
            stdSaleValue: '1000',
            toSaleValue: '200',
            weight: '1'
          }
        ],
        updateSchemeDetails: [],
        deleteSchemeDetails: []
      };

      const action = new SaveVariantDetails(payload);
      const error = new Error('some error');
      const outcome = new SaveVariantDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      focConfigService.saveVariantDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.saveVariantDetails$).toBeObservable(expected);
    });
  });

  describe('loadVariantDetails', () => {
    it('should return a stream with  variant details', () => {
      const payload = '1';

      const action = new LoadVariantDetailsById(payload);
      const outcome = new LoadVariantDetailsByIdSuccess(variantDetails);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: variantDetails });
      focConfigService.loadVariantDetails.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadVariantDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload = '1';
      const action = new LoadVariantDetailsById(payload);
      const error = new Error('some error');
      const outcome = new LoadVariantDetailsByIdFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      focConfigService.loadVariantDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadVariantDetails$).toBeObservable(expected);
    });
  });

  describe('loadProductGroups', () => {
    it('should return a stream with Product groups list', () => {
      const payload: LoadProductGroupPayload = {
        masterId: '11',
        category: 'GOLD_COIN',
        schemeDetailsId: '22'
      };
      const res: ProductGroupMappingOption[] = [
        { id: '76', uuid: '1', description: 'GOLD' }
      ];

      const action = new LoadMappedProductGroupsByConfigId(payload);
      const outcome = new LoadMappedProductGroupsByConfigIdSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      focConfigService.loadMappedProductGroups.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadProductGroups$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: LoadProductGroupPayload = {
        masterId: '11',
        category: 'GOLD_COIN',
        schemeDetailsId: '22'
      };

      const action = new LoadMappedProductGroupsByConfigId(payload);
      const error = new Error('some error');
      const outcome = new LoadMappedProductGroupsByConfigIdFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      focConfigService.loadMappedProductGroups.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadProductGroups$).toBeObservable(expected);
    });
  });

  describe('updateProductGroups', () => {
    it('should return a stream with Product groups ', () => {
      const payload: SaveProductGroup = {
        masterId: '11',
        category: 'GOLD_COIN',
        schemeDetailsId: '22',
        addProducts: ['76'],
        removeProducts: []
      };
      const res: ProductGroupMappingOption[] = [
        { id: '76', uuid: '1', description: 'GOLD' }
      ];

      const action = new UpdateProductGroupByConfigId(payload);
      const outcome = new UpdateProductGroupByConfigIdSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      focConfigService.updateProductGroups.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.updateProductGroups$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: SaveProductGroup = {
        masterId: '11',
        schemeDetailsId: '22',
        category: 'GOLD_COIN',
        addProducts: ['76'],
        removeProducts: []
      };

      const action = new UpdateProductGroupByConfigId(payload);
      const error = new Error('some error');
      const outcome = new UpdateProductGroupByConfigIdFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      focConfigService.updateProductGroups.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.updateProductGroups$).toBeObservable(expected);
    });
  });
  describe('loadLocationById', () => {
    it('should return a stream with location  list', () => {
      const payload: FocLocationListPayload = {
        pageSize: 10,
        pageIndex: 1,
        length: 100,
        id: '1'
      };

      const action = new LoadLocationById(payload);
      const outcome = new LoadLocationByIdSuccess(locationListSuccessPayload);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: locationListSuccessPayload });
      focConfigService.loadMappedLocations.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadLocationById$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: FocLocationListPayload = {
        pageSize: 10,
        pageIndex: 1,
        length: 100,
        id: '1'
      };

      const action = new LoadLocationById(payload);
      const error = new Error('some error');
      const outcome = new LoadLocationByIdFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      focConfigService.loadMappedLocations.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadLocationById$).toBeObservable(expected);
    });
  });

  describe('updateLocationById', () => {
    it('should return a stream with UpdateLocationByIdSuccess', () => {
      const payload: SaveLocationPayload = {
        id: '1',
        saveLocationPayload: {
          addLocations: ['URB']
        }
      };

      const action = new UpdateLocationById(payload);
      const outcome = new UpdateLocationByIdSuccess();
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: {} });
      focConfigService.updateLocationById.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.updateLocationById$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: SaveLocationPayload = {
        id: '1',
        saveLocationPayload: {
          addLocations: ['URB']
        }
      };

      const action = new UpdateLocationById(payload);
      const error = new Error('some error');
      const outcome = new UpdateLocationByIdFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      focConfigService.updateLocationById.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.updateLocationById$).toBeObservable(expected);
    });
  });

  describe('saveFocItems', () => {
    it('should return a stream with SaveFocItemsSuccess', () => {
      const payload: FocItemsSavePayload = {
        id: '1',
        savePayload: {
          addItems: [
            {
              itemCode: '53FCDS2222AE0',
              stdWeight: 32,
              karat: 22
            }
          ],
          removeItems: []
        }
      };

      const action = new SaveFocItems(payload);
      const outcome = new SaveFocItemsSuccess();
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: {} });
      focConfigService.saveFocItems.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.saveFocItems$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: FocItemsSavePayload = {
        id: '1',
        savePayload: {
          addItems: [
            {
              itemCode: '53FCDS2222AE0',
              stdWeight: 32,
              karat: 22
            }
          ],
          removeItems: []
        }
      };

      const action = new SaveFocItems(payload);
      const error = new Error('some error');
      const outcome = new SaveFocItemsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      focConfigService.saveFocItems.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.saveFocItems$).toBeObservable(expected);
    });
  });

  describe('loadMappedFocItems', () => {
    it('should return a stream with mapped foc items', () => {
      const payload: FocItemsPayload = {
        id: '1',
        pageIndex: 1,
        pageSize: 10
      };

      const res: FocItemsResponse = {
        items: [
          {
            itemCode: '53FCDS2222AE0',
            stdWeight: 32,
            karat: 22
          }
        ],
        totalElements: 1
      };
      const action = new LoadMappedFocItemsById(payload);
      const outcome = new LoadMappedFocItemsByIdSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      focConfigService.loadMappedFocItems.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadMappedFocItems$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: FocItemsPayload = {
        id: '1',
        pageIndex: 1,
        pageSize: 10
      };
      const action = new LoadMappedFocItemsById(payload);
      const error = new Error('some error');
      const outcome = new LoadMappedFocItemsByIdFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      focConfigService.loadMappedFocItems.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadMappedFocItems$).toBeObservable(expected);
    });
  });

  describe('searchFocItem', () => {
    it('should return a stream with searched foc item code', () => {
      const payload: { configId: string; itemCode: string } = {
        configId: '1',
        itemCode: '5FSCDDCD000'
      };

      const action = new SearchFocItem(payload);
      const outcome = new SearchFocItemSuccess(fOCItemCodes);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: fOCItemCodes });
      focConfigService.searchFocItems.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.searchFocItem$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: { configId: string; itemCode: string } = {
        configId: '1',
        itemCode: '5FSCDDCD000'
      };
      const action = new SearchFocItem(payload);
      const error = new Error('some error');
      const outcome = new SearchFocItemFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      focConfigService.searchFocItems.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.searchFocItem$).toBeObservable(expected);
    });
  });

  describe('loadFocItems', () => {
    it('should return a stream with All foc items', () => {
      const payload: FOCItemCodesPayload = {
        excludeProductCategories: [],
        excludeProductGroups: [],
        includeProductCategories: [],
        includeProductGroups: ['74'],
        isFocItem: true
      };
      const res: FOCItemCodes[] = [
        {
          itemCode: '53FCDS2222AE0',
          stdWeight: 32,
          karat: 22
        }
      ];
      const action = new LoadFocItemCodes(payload);
      const outcome = new LoadFocItemCodesSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      focConfigService.loadFOCItemCodes.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadFocItems$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: FOCItemCodesPayload = {
        excludeProductCategories: [],
        excludeProductGroups: [],
        includeProductCategories: [],
        includeProductGroups: ['74'],
        isFocItem: true
      };
      const action = new LoadFocItemCodes(payload);
      const error = new Error('some error');
      const outcome = new LoadFocItemCodesFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      focConfigService.loadFOCItemCodes.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadFocItems$).toBeObservable(expected);
    });
  });

  describe('searchLocationCode', () => {
    it('should return a stream with Searched location', () => {
      const payload: { configId: string; locationCode: string } = {
        configId: '1',
        locationCode: '5FSCDDCD000'
      };
      const res: LocationListSuccessPayload = {
        totalLocations: 100,
        locationList: [
          {
            locationCode: 'URB',
            description: 'URB',
            subBrandCode: 'Mia',
            startDate: '10',
            endDate: '12',
            isActive: 'isActive',
            id: '1'
          }
        ]
      };
      const action = new SearchLocationCode(payload);
      const outcome = new SearchLocationCodeSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      focConfigService.searchLocationCode.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.searchLocationCode$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: { configId: string; locationCode: string } = {
        configId: '1',
        locationCode: '5FSCDDCD000'
      };
      const action = new SearchLocationCode(payload);
      const error = new Error('some error');
      const outcome = new SearchLocationCodeFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      focConfigService.searchLocationCode.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.searchLocationCode$).toBeObservable(expected);
    });
  });

  describe('publishFocScheme', () => {
    it('should return a PublishFocSchemeSuccesss', () => {
      const payload = '1';

      const action = new PublishFocScheme(payload);
      const outcome = new PublishFocSchemeSuccesss();
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {});
      focConfigService.publishFocScheme.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.publishFocScheme$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload = '1';
      const action = new PublishFocScheme(payload);
      const error = new Error('some error');
      const outcome = new PublishFocSchemeFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      focConfigService.publishFocScheme.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.publishFocScheme$).toBeObservable(expected);
    });
  });

  describe('loadVariantDetailsValueGoldStandardById', () => {
    it('should return VariantDetails', () => {
      const payload = '1';

      const action = new LoadVariantDetailsValueGoldStandardById(payload);
      const outcome = new LoadVariantDetailsValueGoldStandardByIdSuccess(
        variantDetails
      );
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: variantDetails });
      focConfigService.loadVariantDetails.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadVariantDetailsValueGoldStandardById$).toBeObservable(
        expected$
      );
    });

    it('should fail and return an action with the error', () => {
      const payload = '1';
      const action = new LoadVariantDetailsValueGoldStandardById(payload);
      const error = new Error('some error');
      const outcome = new LoadVariantDetailsValueGoldStandardByIdFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      focConfigService.loadVariantDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadVariantDetailsValueGoldStandardById$).toBeObservable(
        expected
      );
    });
  });

  describe('LoadVariantDetailsValueGoldSlabById', () => {
    it('should return VariantDetails', () => {
      const payload = '1';

      const action = new LoadVariantDetailsValueGoldSlabById(payload);
      const outcome = new LoadVariantDetailsValueGoldSlabByIdSuccess(
        variantDetails
      );
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: variantDetails });
      focConfigService.loadVariantDetails.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.LoadVariantDetailsValueGoldSlabById$).toBeObservable(
        expected$
      );
    });

    it('should fail and return an action with the error', () => {
      const payload = '1';
      const action = new LoadVariantDetailsValueGoldSlabById(payload);
      const error = new Error('some error');
      const outcome = new LoadVariantDetailsValueGoldSlabByIdFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      focConfigService.loadVariantDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.LoadVariantDetailsValueGoldSlabById$).toBeObservable(
        expected
      );
    });
  });

  describe('LoadVariantDetailsValueOthersStandardById', () => {
    it('should return VariantDetails', () => {
      const payload = '1';

      const action = new LoadVariantDetailsValueOthersStandardById(payload);
      const outcome = new LoadVariantDetailsValueOthersStandardByIdSuccess(
        variantDetails
      );
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: variantDetails });
      focConfigService.loadVariantDetails.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.LoadVariantDetailsValueOthersStandardById$).toBeObservable(
        expected$
      );
    });

    it('should fail and return an action with the error', () => {
      const payload = '1';
      const action = new LoadVariantDetailsValueOthersStandardById(payload);
      const error = new Error('some error');
      const outcome = new LoadVariantDetailsValueOthersStandardByIdFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      focConfigService.loadVariantDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.LoadVariantDetailsValueOthersStandardById$).toBeObservable(
        expected
      );
    });
  });

  describe('LoadVariantDetailsValueOthersSlabById', () => {
    it('should return VariantDetails', () => {
      const payload = '1';

      const action = new LoadVariantDetailsValueOthersSlabById(payload);
      const outcome = new LoadVariantDetailsValueOthersSlabByIdSuccess(
        variantDetails
      );
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: variantDetails });
      focConfigService.loadVariantDetails.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.LoadVariantDetailsValueOthersSlabById$).toBeObservable(
        expected$
      );
    });

    it('should fail and return an action with the error', () => {
      const payload = '1';
      const action = new LoadVariantDetailsValueOthersSlabById(payload);
      const error = new Error('some error');
      const outcome = new LoadVariantDetailsValueOthersSlabByIdFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      focConfigService.loadVariantDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.LoadVariantDetailsValueOthersSlabById$).toBeObservable(
        expected
      );
    });
  });

  describe('LoadVariantDetailsWeightGoldStandardById', () => {
    it('should return VariantDetails', () => {
      const payload = '1';

      const action = new LoadVariantDetailsWeightGoldStandardById(payload);
      const outcome = new LoadVariantDetailsWeightGoldStandardByIdSuccess(
        variantDetails
      );
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: variantDetails });
      focConfigService.loadVariantDetails.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.LoadVariantDetailsWeightGoldStandardById$).toBeObservable(
        expected$
      );
    });

    it('should fail and return an action with the error', () => {
      const payload = '1';
      const action = new LoadVariantDetailsWeightGoldStandardById(payload);
      const error = new Error('some error');
      const outcome = new LoadVariantDetailsWeightGoldStandardByIdFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      focConfigService.loadVariantDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.LoadVariantDetailsWeightGoldStandardById$).toBeObservable(
        expected
      );
    });
  });

  describe('LoadVariantDetailsWeightGoldSlabById', () => {
    it('should return VariantDetails', () => {
      const payload = '1';

      const action = new LoadVariantDetailsWeightGoldSlabById(payload);
      const outcome = new LoadVariantDetailsWeightGoldSlabByIdSuccess(
        variantDetails
      );
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: variantDetails });
      focConfigService.loadVariantDetails.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.LoadVariantDetailsWeightGoldSlabById$).toBeObservable(
        expected$
      );
    });

    it('should fail and return an action with the error', () => {
      const payload = '1';
      const action = new LoadVariantDetailsWeightGoldSlabById(payload);
      const error = new Error('some error');
      const outcome = new LoadVariantDetailsWeightGoldSlabByIdFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      focConfigService.loadVariantDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.LoadVariantDetailsWeightGoldSlabById$).toBeObservable(
        expected
      );
    });
  });

  describe('LoadVariantDetailsWeightOthersStandardById', () => {
    it('should return VariantDetails', () => {
      const payload = '1';

      const action = new LoadVariantDetailsWeightOthersStandardById(payload);
      const outcome = new LoadVariantDetailsWeightOthersStandardByIdSuccess(
        variantDetails
      );
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: variantDetails });
      focConfigService.loadVariantDetails.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.LoadVariantDetailsWeightOthersStandardById$).toBeObservable(
        expected$
      );
    });

    it('should fail and return an action with the error', () => {
      const payload = '1';
      const action = new LoadVariantDetailsWeightOthersStandardById(payload);
      const error = new Error('some error');
      const outcome = new LoadVariantDetailsWeightOthersStandardByIdFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      focConfigService.loadVariantDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.LoadVariantDetailsWeightOthersStandardById$).toBeObservable(
        expected
      );
    });
  });

  describe('LoadVariantDetailsWeightOthersSlabById', () => {
    it('should return VariantDetails', () => {
      const payload = '1';

      const action = new LoadVariantDetailsWeightOthersSlabById(payload);
      const outcome = new LoadVariantDetailsWeightOthersSlabByIdSuccess(
        variantDetails
      );
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: variantDetails });
      focConfigService.loadVariantDetails.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.LoadVariantDetailsWeightOthersSlabById$).toBeObservable(
        expected$
      );
    });

    it('should fail and return an action with the error', () => {
      const payload = '1';
      const action = new LoadVariantDetailsWeightOthersSlabById(payload);
      const error = new Error('some error');
      const outcome = new LoadVariantDetailsWeightOthersSlabByIdFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      focConfigService.loadVariantDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.LoadVariantDetailsWeightOthersSlabById$).toBeObservable(
        expected
      );
    });
  });

  describe('LoadAllSelectedLocationCodes', () => {
    const payload: FocLocationListPayload = {
      pageSize: 10,
      pageIndex: 1,
      length: 100,
      id: '1'
    };
    // it('should return VariantDetails', () => {
    //   const action = new LoadAllSelectedLocationCodes(payload);
    //   const outcome = new LoadAllSelectedLocationCodesSuccess(
    //     locationListSuccessPayload
    //   );
    //   actions$ = hot('-a', { a: action });

    //   const response$ = cold('-a|', { a: variantDetails });
    //   focConfigService.loadMappedLocations.and.returnValue(response$);

    //   const expected$ = cold('--b', { b: outcome });
    //   expect(effect.loadAllSelectedLocations$).toBeObservable(expected$);
    // });

    it('should fail and return an action with the error', () => {
      const action = new LoadAllSelectedLocationCodes(payload);
      const error = new Error('some error');
      const outcome = new LoadAllSelectedLocationCodesFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      focConfigService.loadMappedLocations.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadAllSelectedLocations$).toBeObservable(expected);
    });
  });

  describe('LoadAllSelectedItemCodes', () => {
    const payload: FocItemsPayload = {
      id: '1',
      pageIndex: 1,
      pageSize: 10
    };
    // it('should return VariantDetails', () => {
    //   const action = new LoadAllSelectedItemCodes(payload);
    //   const outcome = new LoadAllSelectedItemCodesSuccess(fOCItemCodes);
    //   actions$ = hot('-a', { a: action });

    //   const response$ = cold('-a|', { a: fOCItemCodes });
    //   focConfigService.loadMappedFocItems.and.returnValue(response$);

    //   const expected$ = cold('--b', { b: outcome });
    //   expect(effect.loadAllMappedFocItems$).toBeObservable(expected$);
    // });

    it('should fail and return an action with the error', () => {
      const action = new LoadAllSelectedItemCodes(payload);
      const error = new Error('some error');
      const outcome = new LoadAllSelectedItemCodesFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      focConfigService.loadMappedFocItems.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadAllMappedFocItems$).toBeObservable(expected);
    });
  });
});
