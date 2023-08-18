import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { DataPersistence } from '@nrwl/angular';
import {
  FOCBCLListingPayload,
  FOCBlockingCustomerLevelListResponse,
  FOCBlockingLocaionLevelListResponse,
  FOCBlockingLocationLevelListPayload
} from '@poss-web/shared/models';
import { Observable } from 'rxjs';
import { FOCBCLService } from '../foc-bcl.service';
import { FOCBCLEffects } from './foc-bcl.effect';
import { provideMockActions } from '@ngrx/effects/testing';
import {
  POSS_WEB_API_URL,
  POSS_WEB_CACHING_STRATEGY
} from '@poss-web/shared/util-config';
import {
  LoadFOCBCLDetails,
  LoadFOCBCLDetailsFailure,
  LoadFOCBCLDetailsSuccess,
  LoadFOCSchemes,
  LoadFOCSchemesFailure,
  LoadFOCSchemesSuccess,
  SaveFOCBCLDetails,
  SaveFOCBCLDetailsFailure,
  SaveFOCBCLDetailsSuccess,
  SearchLocation,
  SearchLocationFailure,
  SearchLocationSuccess
} from './foc-bcl.actions';
import { hot, cold } from 'jasmine-marbles';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
describe('FOC Blocking Location Level Effects Testing', () => {
  const savePayload = {
    validity: {
      endDate: 123123213213213,
      startDate: 123123123213,

      status: true
    },
    configDetails: {
      type: 'FOC_LOCATION_DETAILS',
      data: {
        remarks: 'good',
        approvedBy: 'CM',
        isCMNumber: 'true'
      }
    },
    addLocations: ['URB'],
    updateLocations: [],
    removeLocations: [],
    mobileNo: null
  };
  const focBlockingCustomerDetails: FOCBlockingCustomerLevelListResponse = {
    response: [
      {
        locationCode: 'URB',
        description: 'URB',
        fromDate: '12312312',
        toDate: '12323213',
        approvedBy: 'CM',
        isCMMandatory: true,
        remarks: 'Good',
        isActive: true,
        mobileNumber: '9010462817',
        id: 'abc123',
        focItemCode: 'abc123',
        quantity: '12'
      }
    ],
    totalElements: 1
  };
  const focBlockingCustomerLevelServiceSpy = jasmine.createSpyObj<
    FOCBCLService
  >([
    'saveFOCBCLDetails',
    'searchLocation',
    'loadFOCBCLDetails',
    'loadSchemeId'
  ]);
  let actions$: Observable<any>;
  let effect: FOCBCLEffects;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get']
  );
  const initialState = {};

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FOCBCLEffects,
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
          provide: FOCBCLService,
          useValue: focBlockingCustomerLevelServiceSpy
        }
      ]
    });
    effect = TestBed.inject(FOCBCLEffects);
  });
  describe('SaveFOCBLLDetails', () => {
    it('should return a stream with SaveFOCBLLDetails', () => {
      const action = new SaveFOCBCLDetails({
        id: 'abc123',
        savePayload: savePayload
      });
      const outcome = new SaveFOCBCLDetailsSuccess();
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: null });
      focBlockingCustomerLevelServiceSpy.saveFOCBCLDetails.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.saveFOCBCLDetails$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new SaveFOCBCLDetails({
        id: 'abc123',
        savePayload: savePayload
      });
      const error = new Error('some error');
      const outcome = new SaveFOCBCLDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      focBlockingCustomerLevelServiceSpy.saveFOCBCLDetails.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.saveFOCBCLDetails$).toBeObservable(expected);
    });
  });

  describe('LoadFOCBCLDetails', () => {
    const parameters: FOCBCLListingPayload = {
      pageIndex: 0,
      pageSize: 100,
      schemeId: 'abc123'
    };
    it('should return a stream with LoadFOCBCLDetails', () => {
      const action = new LoadFOCBCLDetails(parameters);
      const outcome = new LoadFOCBCLDetailsSuccess(focBlockingCustomerDetails);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: focBlockingCustomerDetails });
      focBlockingCustomerLevelServiceSpy.loadFOCBCLDetails.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadFOCBCLDetails$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new LoadFOCBCLDetails(parameters);
      const error = new Error('some error');
      const outcome = new LoadFOCBCLDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      focBlockingCustomerLevelServiceSpy.loadFOCBCLDetails.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.loadFOCBCLDetails$).toBeObservable(expected);
    });
  });

  describe('SearchLocation', () => {
    it('should return a stream with SearchLocation', () => {
      const action = new SearchLocation({
        schemeId: 'abc123',
        locationCode: 'urb'
      });
      const outcome = new SearchLocationSuccess(
        focBlockingCustomerDetails.response
      );
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: focBlockingCustomerDetails.response });
      focBlockingCustomerLevelServiceSpy.searchLocation.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.searchLocation$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new SearchLocation({
        schemeId: 'abc123',
        locationCode: 'URB'
      });
      const error = new Error('some error');
      const outcome = new SearchLocationFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      focBlockingCustomerLevelServiceSpy.searchLocation.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.searchLocation$).toBeObservable(expected);
    });
  });

  describe('LoadFOCSchemes', () => {
    it('should return a stream with LoadFOCSchemes', () => {
      const action = new LoadFOCSchemes('FOC_BLOCKING_CUSTOMER');
      const outcome = new LoadFOCSchemesSuccess('abc123');
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: 'abc123'
      });
      focBlockingCustomerLevelServiceSpy.loadSchemeId.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadFOCSchemes$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new LoadFOCSchemes('FOC_LOCATION');
      const error = new Error('some error');
      const outcome = new LoadFOCSchemesFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      focBlockingCustomerLevelServiceSpy.loadSchemeId.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.loadFOCSchemes$).toBeObservable(expected);
    });
  });
});
