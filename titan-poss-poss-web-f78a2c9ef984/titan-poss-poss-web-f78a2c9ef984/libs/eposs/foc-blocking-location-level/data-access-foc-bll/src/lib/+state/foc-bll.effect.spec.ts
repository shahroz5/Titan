import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { DataPersistence } from '@nrwl/angular';
import {
  FOCBlockingLocaionLevelListResponse,
  FOCBlockingLocationLevelListPayload
} from '@poss-web/shared/models';
import { Observable } from 'rxjs';
import { FOCBLLService } from '../foc-bll.service';
import { FOCBLLEffects } from './foc-bll.effect';
import { provideMockActions } from '@ngrx/effects/testing';
import {
  POSS_WEB_API_URL,
  POSS_WEB_CACHING_STRATEGY
} from '@poss-web/shared/util-config';
import {
  LoadFOCBLLDetails,
  LoadFOCBLLDetailsFailure,
  LoadFOCBLLDetailsSuccess,
  LoadFOCSchemes,
  LoadFOCSchemesFailure,
  LoadFOCSchemesSuccess,
  SaveFOCBLLDetails,
  SaveFOCBLLDetailsFailure,
  SaveFOCBLLDetailsSuccess,
  SearchLocation,
  SearchLocationFailure,
  SearchLocationSuccess
} from './foc-bll.actions';
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
  const focBlockingLocationDetails: FOCBlockingLocaionLevelListResponse = {
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
        id: 'abc123'
      }
    ],
    totalElements: 1
  };
  const focBlockingLocationLevelServiceSpy = jasmine.createSpyObj<
    FOCBLLService
  >([
    'saveFOCBLLDetails',
    'searchLocation',
    'loadFOCBLLDetails',
    'loadSchemeId'
  ]);
  let actions$: Observable<any>;
  let effect: FOCBLLEffects;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get']
  );
  const initialState = {};

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FOCBLLEffects,
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
          provide: FOCBLLService,
          useValue: focBlockingLocationLevelServiceSpy
        }
      ]
    });
    effect = TestBed.inject(FOCBLLEffects);
  });
  describe('SaveFOCBLLDetails', () => {
    it('should return a stream with SaveFOCBLLDetails', () => {
      const action = new SaveFOCBLLDetails({
        id: 'abc123',
        savePayload: savePayload
      });
      const outcome = new SaveFOCBLLDetailsSuccess();
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: null });
      focBlockingLocationLevelServiceSpy.saveFOCBLLDetails.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.saveFOCBLLDetails$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new SaveFOCBLLDetails({
        id: 'abc123',
        savePayload: savePayload
      });
      const error = new Error('some error');
      const outcome = new SaveFOCBLLDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      focBlockingLocationLevelServiceSpy.saveFOCBLLDetails.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.saveFOCBLLDetails$).toBeObservable(expected);
    });
  });

  describe('LoadFOCBLLDetails', () => {
    const parameters: FOCBlockingLocationLevelListPayload = {
      pageIndex: 0,
      pageSize: 100,
      id: 'abc123'
    };
    it('should return a stream with LoadFOCBLLDetails', () => {
      const action = new LoadFOCBLLDetails(parameters);
      const outcome = new LoadFOCBLLDetailsSuccess(focBlockingLocationDetails);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: focBlockingLocationDetails });
      focBlockingLocationLevelServiceSpy.loadFOCBLLDetails.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadFOCBLLDetails$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new LoadFOCBLLDetails(parameters);
      const error = new Error('some error');
      const outcome = new LoadFOCBLLDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      focBlockingLocationLevelServiceSpy.loadFOCBLLDetails.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.loadFOCBLLDetails$).toBeObservable(expected);
    });
  });

  describe('SearchLocation', () => {
    it('should return a stream with SearchLocation', () => {
      const action = new SearchLocation({
        schemeId: 'abc123',
        locationCode: 'urb'
      });
      const outcome = new SearchLocationSuccess(
        focBlockingLocationDetails.response
      );
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: focBlockingLocationDetails.response });
      focBlockingLocationLevelServiceSpy.searchLocation.and.returnValue(
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
      focBlockingLocationLevelServiceSpy.searchLocation.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.searchLocation$).toBeObservable(expected);
    });
  });

  describe('LoadFOCSchemes', () => {
    it('should return a stream with LoadFOCSchemes', () => {
      const action = new LoadFOCSchemes('FOC_LOCATION');
      const outcome = new LoadFOCSchemesSuccess('abc123');
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: 'abc123'
      });
      focBlockingLocationLevelServiceSpy.loadSchemeId.and.returnValue(
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
      focBlockingLocationLevelServiceSpy.loadSchemeId.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.loadFOCSchemes$).toBeObservable(expected);
    });
  });
});
