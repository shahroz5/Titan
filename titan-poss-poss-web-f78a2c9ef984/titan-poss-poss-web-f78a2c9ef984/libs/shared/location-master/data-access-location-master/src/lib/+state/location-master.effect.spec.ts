import { Observable } from 'rxjs';
import { LocationMasterEffect } from './location-master.effect';
import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { DataPersistence } from '@nrwl/angular';
import { hot, cold } from 'jasmine-marbles';
import {
  POSS_WEB_API_URL,
  POSS_WEB_CACHING_STRATEGY
} from '@poss-web/shared/util-config';
import { LocationMasterService } from '../location-master.service';
import {
  BrandSummary,
  CopyDetailsPayload,
  LocationCFAType,
  LocationListingPage,
  LocationListingPayload,
  LocationMasterDetails,
  LocationMasterDropdownList,
  LocationTypes,
  MarketCodeTypes,
  OwnerTypes,
  RegionSummary,
  StateTypes,
  Towns
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { LOCATION_MASTER_FEATURE_KEY } from './location-master.reducer';
import {
  CopyDetails,
  CopyDetailsFailure,
  CopyDetailsSuccess,
  LoadBaseCurrency,
  LoadBaseCurrencyFailure,
  LoadBaseCurrencySuccess,
  LoadBrand,
  LoadBrandFailure,
  LoadBrandSuccess,
  LoadCFAList,
  LoadCFAListFailure,
  LoadCFAListSuccess,
  LoadCountryCode,
  LoadCountryCodeFailure,
  LoadCountryCodeSuccess,
  LoadCurrency,
  LoadCurrencyFailure,
  LoadCurrencySuccess,
  LoadInvoiceType,
  LoadInvoiceTypeFailure,
  LoadInvoiceTypeSuccess,
  LoadLocationDetails,
  LoadLocationDetailsFailure,
  LoadLocationDetailsSuccess,
  LoadLocationListing,
  LoadLocationListingFailure,
  LoadLocationListingSuccess,
  LoadLocationSize,
  LoadLocationSizeFailure,
  LoadLocationSizeSuccess,
  LoadLocationTypes,
  LoadLocationTypesFailure,
  LoadLocationTypesSuccess,
  LoadMarketCode,
  LoadMarketCodeFailure,
  LoadMarketCodeSuccess,
  LoadOwnerInfo,
  LoadOwnerInfoFailure,
  LoadOwnerInfoSuccess,
  LoadRefundMode,
  LoadRefundModeFailure,
  LoadRefundModeSuccess,
  LoadRegion,
  LoadRegionSuccess,
  LoadStates,
  LoadStatesFailure,
  LoadStatesSuccess,
  LoadTowns,
  LoadTownsFailure,
  LoadTownsSuccess,
  SaveLocationDetails,
  SaveLocationDetailsFailure,
  SaveLocationDetailsSuccess,
  SearchLocationByLocationCode,
  SearchLocationByLocationCodeFailure,
  SearchLocationByLocationCodeSuccess,
  UpdateLocationDetails,
  UpdateLocationDetailsFailure,
  UpdateLocationDetailsSuccess
} from './location-master.actions';

describe('Location Master Effects Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: LocationMasterEffect;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get', 'post', 'patch']
  );
  const initialState = {};

  const locationMasterServiceSpy = jasmine.createSpyObj<LocationMasterService>([
    'getLocationListing',
    'searchLocationByLocationCode',
    'copyLocationDetail',
    'getLocationDetails',
    'saveLocationDetails',
    'updateLocationDetails',
    'getLocationSize',
    'getInvoiceType',
    'getCountryCode',
    'getRefundMode',
    'getLocationTypes',
    'getLocationCFAList',
    'getPersonalTownsData',
    'getPersonalStatesData',
    'getOwnerTypeList',
    'getMarketCodeData',
    'getBaseCurrencyData',
    'getCurrencyDetails',
    'getRegionSummary',
    'getBrandSummary'
  ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LocationMasterEffect,
        DataPersistence,
        provideMockStore({
          initialState: {
            [LOCATION_MASTER_FEATURE_KEY]: initialState
          }
        }),
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
          provide: LocationMasterService,
          useValue: locationMasterServiceSpy
        }
      ]
    });

    effect = TestBed.inject(LocationMasterEffect);
  });

  describe('LoadLocationListing', () => {
    it('should return LoadLocationListing', () => {
      const payload: LocationListingPage = {
        pageIndex: 0,
        pageSize: 8
      };

      const payload2: LocationListingPayload = {
        results: [],
        pageNumber: 1,
        pageSize: 1,
        totalPages: 1,
        totalElements: 0
      };

      const action = new LoadLocationListing(payload);
      const outcome = new LoadLocationListingSuccess(payload2);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: payload2
      });
      locationMasterServiceSpy.getLocationListing.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadLocationListing$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: LocationListingPage = {
        pageIndex: 0,
        pageSize: 8
      };

      const action = new LoadLocationListing(payload);
      const error = new Error('some error');
      const outcome = new LoadLocationListingFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      locationMasterServiceSpy.getLocationListing.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadLocationListing$).toBeObservable(expected);
    });
  });

  describe('SearchLocationByLocationCode Details', () => {
    it('should return a details of Location Master for SearchLocationByLocationCode', () => {
      const payload: LocationListingPayload = {
        results: [],
        pageNumber: 1,
        pageSize: 1,
        totalPages: 1,
        totalElements: 0
      };

      const action = new SearchLocationByLocationCode('Code');
      const outcome = new SearchLocationByLocationCodeSuccess(payload);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: payload
      });
      locationMasterServiceSpy.searchLocationByLocationCode.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.searchLocationByLocationCode$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error for SearchLocationByLocationCodeFailure', () => {
      const action = new SearchLocationByLocationCode('Code');
      const error = new Error('some error');
      const outcome = new SearchLocationByLocationCodeFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      locationMasterServiceSpy.searchLocationByLocationCode.and.returnValue(
        response$
      );

      const expected = cold('--b', { b: outcome });
      expect(effect.searchLocationByLocationCode$).toBeObservable(expected);
    });
  });

  describe('CopyDetails Details', () => {
    it('should return a details of Location Master for CopyDetails', () => {
      const payload: CopyDetailsPayload = {
        newLocationCode: 'ABC',
        oldLocationCode: 'XYZ'
      };

      const action = new CopyDetails(payload);
      const outcome = new CopyDetailsSuccess();
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: payload
      });
      locationMasterServiceSpy.copyLocationDetail.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.copyLocationDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error for CopyDetailsFailure', () => {
      const payload: CopyDetailsPayload = {
        newLocationCode: 'ABC',
        oldLocationCode: 'XYZ'
      };

      const action = new CopyDetails(payload);
      const error = new Error('some error');
      const outcome = new CopyDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      locationMasterServiceSpy.copyLocationDetail.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.copyLocationDetails$).toBeObservable(expected);
    });
  });

  describe('LoadLocationDetails Details', () => {
    const payload: LocationMasterDetails = {
      locationCode: 'Code'
    };
    it('should return a details of Location Master for LoadLocationDetailsSuccess', () => {
      const action = new LoadLocationDetails('Code');
      const outcome = new LoadLocationDetailsSuccess(payload);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: payload
      });
      locationMasterServiceSpy.getLocationDetails.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadLocationDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error for LoadLocationDetailsFailure', () => {
      const action = new LoadLocationDetails('Code');
      const error = new Error('some error');
      const outcome = new LoadLocationDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      locationMasterServiceSpy.getLocationDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadLocationDetails$).toBeObservable(expected);
    });
  });

  describe('SaveLocationDetails Details', () => {
    const payload: LocationMasterDetails = {
      locationCode: 'Code'
    };
    it('should return a details of Location Master for SaveLocationDetailsSuccess', () => {
      const action = new SaveLocationDetails(payload);
      const outcome = new SaveLocationDetailsSuccess(payload);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: payload
      });
      locationMasterServiceSpy.saveLocationDetails.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.saveLocationDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error for SaveLocationDetailsFailure', () => {
      const action = new SaveLocationDetails(payload);
      const error = new Error('some error');
      const outcome = new SaveLocationDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      locationMasterServiceSpy.saveLocationDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.saveLocationDetails$).toBeObservable(expected);
    });
  });

  describe('UpdateLocationDetails Details', () => {
    const payload: LocationMasterDetails = {
      locationCode: 'Code'
    };
    it('should return a details of Location Master for UpdateLocationDetailsSuccess', () => {
      const action = new UpdateLocationDetails(payload);
      const outcome = new UpdateLocationDetailsSuccess(payload);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: payload
      });
      locationMasterServiceSpy.updateLocationDetails.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.updateLocationDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error for UpdateLocationDetailsFailure', () => {
      const action = new UpdateLocationDetails(payload);
      const error = new Error('some error');
      const outcome = new UpdateLocationDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      locationMasterServiceSpy.updateLocationDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.updateLocationDetails$).toBeObservable(expected);
    });
  });

  describe('LoadLocationTypes Details', () => {
    const payload: LocationTypes = {
      code: 'Code',
      value: 'Value'
    };
    it('should return a details of Location Master for LoadLocationTypesSuccess', () => {
      const action = new LoadLocationTypes();
      const outcome = new LoadLocationTypesSuccess(payload);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: payload
      });
      locationMasterServiceSpy.getLocationTypes.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadLocationTypes$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error for LoadLocationTypesFailure', () => {
      const action = new LoadLocationTypes();
      const error = new Error('some error');
      const outcome = new LoadLocationTypesFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      locationMasterServiceSpy.getLocationTypes.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadLocationTypes$).toBeObservable(expected);
    });
  });

  describe('LoadTowns Details', () => {
    const payload: Towns[] = [
      {
        id: '1',
        name: 'name',
        state_id: '2'
      }
    ];
    it('should return a details of Location Master for LoadTownsSuccess', () => {
      const action = new LoadTowns('Code');
      const outcome = new LoadTownsSuccess(payload);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: payload
      });
      locationMasterServiceSpy.getPersonalTownsData.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadTowns$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error for LoadTownsFailure', () => {
      const action = new LoadTowns('Code');
      const error = new Error('some error');
      const outcome = new LoadTownsFailure(CustomErrorAdaptor.fromJson(error));
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      locationMasterServiceSpy.getPersonalTownsData.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadTowns$).toBeObservable(expected);
    });
  });

  describe('LoadStates Details', () => {
    const payload: StateTypes[] = [
      {
        id: '1',
        name: 'name'
      }
    ];
    it('should return a details of Location Master for LoadStatesSuccess', () => {
      const action = new LoadStates('Code');
      const outcome = new LoadStatesSuccess(payload);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: payload
      });
      locationMasterServiceSpy.getPersonalStatesData.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadStates$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error for LoadTownsFailure', () => {
      const action = new LoadStates('Code');
      const error = new Error('some error');
      const outcome = new LoadStatesFailure(CustomErrorAdaptor.fromJson(error));
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      locationMasterServiceSpy.getPersonalStatesData.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadStates$).toBeObservable(expected);
    });
  });

  describe('LoadOwnerInfo Details', () => {
    const payload: OwnerTypes = {
      id: '1',
      name: 'name'
    };
    it('should return a details of Location Master for LoadOwnerInfoSuccess', () => {
      const action = new LoadOwnerInfo();
      const outcome = new LoadOwnerInfoSuccess(payload);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: payload
      });
      locationMasterServiceSpy.getOwnerTypeList.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadOwnerInfo$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error for LoadOwnerInfoFailure', () => {
      const action = new LoadOwnerInfo();
      const error = new Error('some error');
      const outcome = new LoadOwnerInfoFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      locationMasterServiceSpy.getOwnerTypeList.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadOwnerInfo$).toBeObservable(expected);
    });
  });

  describe('LoadRegion Details', () => {
    const payload: LocationMasterDropdownList[] = [
      {
        id: '1',
        name: 'name'
      }
    ];
    it('should return a details of Location Master for LoadRegionSuccess', () => {
      const action = new LoadRegion();
      const outcome = new LoadRegionSuccess(payload);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: payload
      });
      locationMasterServiceSpy.getRegionSummary.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadRegions$).toBeObservable(expected$);
    });

    // it('should fail and return an action with the error for LoadRegionFailure', () => {
    //   const action = new LoadRegion();
    //   const error = new Error('some error');
    //   const outcome = new LoadRegionFailure(CustomErrorAdaptor.fromJson(error));
    //   actions$ = hot('-a', { a: action });
    //   const response$ = cold('-#|', {}, error);
    //   locationMasterServiceSpy.getRegionSummary.and.returnValue(response$);
    //   const expected = cold('--b', { b: outcome });
    //   expect(effect.loadRegions$).toBeObservable(expected);
    // });
  });

  describe('LoadSubRegion Details', () => {
    const payload: RegionSummary[] = [
      {
        description: 'Desc',
        regionCode: 'code'
      }
    ];
    // it('should return a details of Location Master for LoadSubRegionSuccess', () => {
    //   const action = new LoadSubRegion('Code');
    //   const outcome = new LoadSubRegionSuccess(payload);
    //   actions$ = hot('-a', { a: action });

    //   const response$ = cold('-a|', {
    //     a: payload
    //   });
    //   locationMasterServiceSpy.getOwnerTypeList.and.returnValue(response$);

    //   const expected$ = cold('--b', { b: outcome });
    //   expect(effect.loadSubRegions$).toBeObservable(expected$);
    // });

    // it('should fail and return an action with the error for LoadSubRegionFailure', () => {
    //   const action = new LoadSubRegion('Code');
    //   const error = new Error('some error');
    //   const outcome = new LoadSubRegionFailure(
    //     CustomErrorAdaptor.fromJson(error)
    //   );
    //   actions$ = hot('-a', { a: action });
    //   const response$ = cold('-#|', {}, error);
    //   locationMasterServiceSpy.getPersonalTownsData.and.returnValue(response$);
    //   const expected = cold('--b', { b: outcome });
    //   expect(effect.loadSubRegions$).toBeObservable(expected);
    // });
  });

  describe('LoadBrand Details', () => {
    const payload: LocationMasterDropdownList[] = [
      {
        id: '1',
        name: 'name'
      }
    ];
    it('should return a details of Location Master for LoadBrandSuccess', () => {
      const action = new LoadBrand();
      const outcome = new LoadBrandSuccess(payload);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: payload
      });
      locationMasterServiceSpy.getBrandSummary.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadBrands$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error for LoadBrandFailure', () => {
      const action = new LoadBrand();
      const error = new Error('some error');
      const outcome = new LoadBrandFailure(CustomErrorAdaptor.fromJson(error));
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      locationMasterServiceSpy.getBrandSummary.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadBrands$).toBeObservable(expected);
    });
  });

  describe('LoadSubBrand Details', () => {
    const payload: BrandSummary[] = [
      {
        brandCode: 'Code',
        description: 'Desc'
      }
    ];
    // it('should return a details of Location Master for LoadSubBrandSuccess', () => {
    //   const action = new LoadSubBrand('');
    //   const outcome = new LoadSubBrandSuccess(payload);
    //   actions$ = hot('-a', { a: action });

    //   const response$ = cold('-a|', {
    //     a: payload
    //   });
    //   locationMasterServiceSpy.getBrandSummary.and.returnValue(response$);

    //   const expected$ = cold('--b', { b: outcome });
    //   expect(effect.loadSubBrands$).toBeObservable(expected$);
    // });

    // it('should fail and return an action with the error for LoadSubBrandFailure', () => {
    //   const action = new LoadSubBrand('Code');
    //   const error = new Error('some error');
    //   const outcome = new LoadSubBrandFailure(
    //     CustomErrorAdaptor.fromJson(error)
    //   );
    //   actions$ = hot('-a', { a: action });
    //   const response$ = cold('-#|', {}, error);
    //   locationMasterServiceSpy.getBrandSummary.and.returnValue(response$);
    //   const expected = cold('--b', { b: outcome });
    //   expect(effect.loadSubBrands$).toBeObservable(expected);
    // });
  });

  describe('LoadMarketCode Details', () => {
    const payload: MarketCodeTypes = {
      id: '1',
      name: 'Name'
    };
    it('should return a details of Location Master for LoadMarketCodeSuccess', () => {
      const action = new LoadMarketCode();
      const outcome = new LoadMarketCodeSuccess(payload);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: payload
      });
      locationMasterServiceSpy.getMarketCodeData.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadMarketCode$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error for LoadMarketCodeFailure', () => {
      const action = new LoadMarketCode();
      const error = new Error('some error');
      const outcome = new LoadMarketCodeFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      locationMasterServiceSpy.getMarketCodeData.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadMarketCode$).toBeObservable(expected);
    });
  });

  describe('LoadLocationSize Details', () => {
    const payload: StateTypes[] = [
      {
        id: '1',
        name: 'Name'
      }
    ];
    it('should return a details of Location Master for LoadLocationSizeSuccess', () => {
      const action = new LoadLocationSize();
      const outcome = new LoadLocationSizeSuccess(payload);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: payload
      });
      locationMasterServiceSpy.getLocationSize.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadLocationSize$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error for LoadLocationSizeFailure', () => {
      const action = new LoadLocationSize();
      const error = new Error('some error');
      const outcome = new LoadLocationSizeFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      locationMasterServiceSpy.getLocationSize.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadLocationSize$).toBeObservable(expected);
    });
  });

  describe('LoadInvoiceType Details', () => {
    const payload: StateTypes[] = [
      {
        id: '1',
        name: 'Name'
      }
    ];
    it('should return a details of Location Master for LoadInvoiceTypeSuccess', () => {
      const action = new LoadInvoiceType();
      const outcome = new LoadInvoiceTypeSuccess(payload);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: payload
      });
      locationMasterServiceSpy.getInvoiceType.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadInvoiceType$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error for LoadInvoiceTypeFailure', () => {
      const action = new LoadInvoiceType();
      const error = new Error('some error');
      const outcome = new LoadInvoiceTypeFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      locationMasterServiceSpy.getInvoiceType.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadInvoiceType$).toBeObservable(expected);
    });
  });

  describe('LoadRefundMode Details', () => {
    const payload: StateTypes[] = [
      {
        id: '1',
        name: 'Name'
      }
    ];
    it('should return a details of Location Master for LoadRefundModeSuccess', () => {
      const action = new LoadRefundMode();
      const outcome = new LoadRefundModeSuccess(payload);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: payload
      });
      locationMasterServiceSpy.getRefundMode.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadRefundMode$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error for LoadRefundModeFailure', () => {
      const action = new LoadRefundMode();
      const error = new Error('some error');
      const outcome = new LoadRefundModeFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      locationMasterServiceSpy.getRefundMode.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadRefundMode$).toBeObservable(expected);
    });
  });

  describe('LoadBaseCurrency Details', () => {
    const payload: StateTypes[] = [
      {
        id: '1',
        name: 'Name'
      }
    ];
    it('should return a details of Location Master for LoadBaseCurrencySuccess', () => {
      const action = new LoadBaseCurrency();
      const outcome = new LoadBaseCurrencySuccess(payload);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: payload
      });
      locationMasterServiceSpy.getBaseCurrencyData.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadBaseCurrency$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error for LoadBaseCurrencyFailure', () => {
      const action = new LoadBaseCurrency();
      const error = new Error('some error');
      const outcome = new LoadBaseCurrencyFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      locationMasterServiceSpy.getBaseCurrencyData.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadBaseCurrency$).toBeObservable(expected);
    });
  });

  describe('LoadCurrency Details', () => {
    const payload: StateTypes[] = [
      {
        id: '1',
        name: 'Name'
      }
    ];
    it('should return a details of Location Master for LoadCurrencySuccess', () => {
      const action = new LoadCurrency();
      const outcome = new LoadCurrencySuccess(payload);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: payload
      });
      locationMasterServiceSpy.getCurrencyDetails.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadCurrency$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error for LoadCurrencyFailure', () => {
      const action = new LoadCurrency();
      const error = new Error('some error');
      const outcome = new LoadCurrencyFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      locationMasterServiceSpy.getCurrencyDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadCurrency$).toBeObservable(expected);
    });
  });

  describe('LoadCountryCode Details', () => {
    const payload = [{ id: 'IND', name: 'INDIA' }];
    it('should return a details of Location Master for LoadCountryCodeSuccess', () => {
      const action = new LoadCountryCode();
      const outcome = new LoadCountryCodeSuccess(payload);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: payload
      });
      locationMasterServiceSpy.getCountryCode.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadCountryCode$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error for LoadCountryCodeFailure', () => {
      const action = new LoadCountryCode();
      const error = new Error('some error');
      const outcome = new LoadCountryCodeFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      locationMasterServiceSpy.getCountryCode.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadCountryCode$).toBeObservable(expected);
    });
  });

  describe('LoadCFAList Details', () => {
    const payload: LocationCFAType[] = [
      {
        id: '1',
        name: 'Name'
      }
    ];
    it('should return a details of Location Master for LoadCFAListSuccess', () => {
      const action = new LoadCFAList();
      const outcome = new LoadCFAListSuccess(payload);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: payload
      });
      locationMasterServiceSpy.getLocationCFAList.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadCFALists$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error for LoadCFAListFailure', () => {
      const action = new LoadCFAList();
      const error = new Error('some error');
      const outcome = new LoadCFAListFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      locationMasterServiceSpy.getLocationCFAList.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadCFALists$).toBeObservable(expected);
    });
  });
});
