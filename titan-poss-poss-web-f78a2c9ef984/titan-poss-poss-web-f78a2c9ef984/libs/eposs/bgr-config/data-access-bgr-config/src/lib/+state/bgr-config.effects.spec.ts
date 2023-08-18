import { Observable } from 'rxjs';
import { hot, cold } from 'jasmine-marbles';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { HttpClient } from '@angular/common/http';
import { DataPersistence } from '@nrwl/angular';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { BgrConfigEffects } from './bgr-config.effects';
import { BgrConfigService } from '../bgr-config.service';
import { StoreUserDataService } from '@poss-web/shared/masters/data-access-masters';
import {
  EditBgrConfigDetails,
  EditBgrConfigDetailsFailure,
  EditBgrConfigDetailsSuccess,
  LoadBgrConfigDetails,
  LoadBgrConfigDetailsFailure,
  LoadBgrConfigDetailsSuccess,
  LoadBgrConfigListing,
  LoadBgrConfigListingFailure,
  LoadBgrConfigListingSuccess,
  SaveBgrConfigDetails,
  SaveBgrConfigDetailsFailure,
  SaveBgrConfigDetailsSuccess,
  SearchBgrConfigListing,
  SearchBgrConfigListingFailure,
  SearchBgrConfigListingSuccess
} from './bgr-config.actions';
import {
  BgrConfigDetails,
  BgrConfigListingParams,
  BgrConfigListingRequestPayload,
  BgrConfigListingResult
} from '@poss-web/shared/models';
import { LocationMappingFacade } from '@poss-web/shared/location-mapping/data-access-location-mapping';

describe('GRF Effects Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: BgrConfigEffects;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get', 'post', 'patch']
  );
  const initialState = {};
  const bgrConfigServiceSpy = jasmine.createSpyObj<BgrConfigService>(
    'BgrConfigService',
    [
      'getBgrConfigList',
      'getBgrConfigSearch',
      'getBgrConfigDetails',
      'saveBgrConfigDetails',
      'editBgrConfigDetails'
    ]
  );
  const locationMappingFacadeSpy = jasmine.createSpyObj<LocationMappingFacade>(
    'LocationMappingFacade',
    ['updateLocationMapping']
  );
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BgrConfigEffects,
        DataPersistence,
        provideMockStore({ initialState }),
        provideMockActions(() => actions$),
        {
          provide: HttpClient,
          useValue: httpClientSpy
        },
        {
          provide: BgrConfigService,
          useValue: bgrConfigServiceSpy
        },
        {
          provide: LocationMappingFacade,
          useValue: locationMappingFacadeSpy
        }
      ]
    });
    effect = TestBed.inject(BgrConfigEffects);
  });

  describe('loadBgrConfigListing$ effects', () => {
    it('should load max flat tep config effects', () => {
      const params: BgrConfigListingParams = {
        pageIndex: 0,
        pageSize: 10
      };
      const requestPayload: BgrConfigListingRequestPayload = {
        ruleType: 'BGR_CONFIG'
      };
      const action = new LoadBgrConfigListing(params, requestPayload);
      const successPayload: BgrConfigListingResult = {
        results: [
          {
            ruleId: 1234,
            ruleType: 'BGR_CONFIG'
          }
        ],
        pageNumber: 0,
        pageSize: 10,
        totalPages: 10,
        totalElements: 100
      };
      const outCome = new LoadBgrConfigListingSuccess(successPayload);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: successPayload });
      bgrConfigServiceSpy.getBgrConfigList.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.loadBgrConfigListing$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const params: BgrConfigListingParams = {
        pageIndex: 0,
        pageSize: 10
      };
      const requestPayload: BgrConfigListingRequestPayload = {
        ruleType: 'BGR_CONFIG'
      };
      const action = new LoadBgrConfigListing(params, requestPayload);
      const error = new Error('some error');
      const outCome = new LoadBgrConfigListingFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      bgrConfigServiceSpy.getBgrConfigList.and.returnValue(response$);
      const expected = cold('--b', { b: outCome });
      expect(effect.loadBgrConfigListing$).toBeObservable(expected);
    });
  });

  describe('searchBgrConfigListing$ effects', () => {
    it('should search bgr config listing effects', () => {
      const action = new SearchBgrConfigListing('');
      const successPayload: BgrConfigListingResult = {
        results: [
          {
            ruleId: 1234,
            ruleType: 'BGR_CONFIG'
          }
        ],
        pageNumber: 0,
        pageSize: 10,
        totalPages: 10,
        totalElements: 100
      };
      const outCome = new SearchBgrConfigListingSuccess(successPayload);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: successPayload });
      bgrConfigServiceSpy.getBgrConfigSearch.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.searchBgrConfigListing$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new SearchBgrConfigListing('');
      const error = new Error('some error');
      const outCome = new SearchBgrConfigListingFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      bgrConfigServiceSpy.getBgrConfigSearch.and.returnValue(response$);
      const expected = cold('--b', { b: outCome });
      expect(effect.searchBgrConfigListing$).toBeObservable(expected);
    });
  });

  describe('loadBgrConfigDetails$ effects', () => {
    it('should load bgr config details effects', () => {
      const action = new LoadBgrConfigDetails('');

      const successPayload: BgrConfigDetails = {
        ruleId: 1234,
        ruleType: 'BGR_CONFIG'
      };
      const outCome = new LoadBgrConfigDetailsSuccess(successPayload);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: successPayload });
      bgrConfigServiceSpy.getBgrConfigDetails.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.loadBgrConfigDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadBgrConfigDetails('');
      const error = new Error('some error');
      const outCome = new LoadBgrConfigDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      bgrConfigServiceSpy.getBgrConfigDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outCome });
      expect(effect.loadBgrConfigDetails$).toBeObservable(expected);
    });
  });

  describe('saveBgrConfigDetails$ effects', () => {
    it('should save bgr config details effects', () => {
      const payload: BgrConfigDetails = {
        ruleId: 1234,
        ruleType: 'BGR_CONFIG'
      };
      const action = new SaveBgrConfigDetails(payload, null);
      const successPayload: BgrConfigDetails = {
        ruleId: 1234,
        ruleType: 'BGR_CONFIG'
      };
      const outCome = new SaveBgrConfigDetailsSuccess(successPayload);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: successPayload });
      bgrConfigServiceSpy.saveBgrConfigDetails.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.saveBgrConfigDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: BgrConfigDetails = {
        ruleId: 1234,
        ruleType: 'BGR_CONFIG'
      };
      const action = new SaveBgrConfigDetails(payload, null);
      const error = new Error('some error');
      const outCome = new SaveBgrConfigDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      bgrConfigServiceSpy.saveBgrConfigDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outCome });
      expect(effect.saveBgrConfigDetails$).toBeObservable(expected);
    });
  });

  describe('editBgrConfigDetails$ effects', () => {
    it('should edit bgr config details effects', () => {
      const payload: BgrConfigDetails = {
        ruleId: 1234,
        ruleType: 'BGR_CONFIG'
      };
      const action = new EditBgrConfigDetails(payload);
      const successPayload: BgrConfigDetails = {
        ruleId: 1234,
        ruleType: 'BGR_CONFIG'
      };
      const outCome = new EditBgrConfigDetailsSuccess(successPayload);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: successPayload });
      bgrConfigServiceSpy.editBgrConfigDetails.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.editBgrConfigDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: BgrConfigDetails = {
        ruleId: 1234,
        ruleType: 'BGR_CONFIG'
      };
      const action = new EditBgrConfigDetails(payload);
      const error = new Error('some error');
      const outCome = new EditBgrConfigDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      bgrConfigServiceSpy.editBgrConfigDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outCome });
      expect(effect.editBgrConfigDetails$).toBeObservable(expected);
    });
  });
});
