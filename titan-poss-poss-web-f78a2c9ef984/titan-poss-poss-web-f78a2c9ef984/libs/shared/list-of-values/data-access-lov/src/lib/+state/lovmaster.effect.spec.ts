import { Observable } from 'rxjs';
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
import {
  LoadLovListingSuccessPayload,
  LovMaster,
  LovMasterType
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

import { LovMasterService } from '../lov-master.service';
import { LOV_MASTER_FEATURE_KEY } from './lovmaster.reducer';
import { LovMasterEffect } from './lovmaster.effect';
import {
  EditLovFormDetails,
  EditLovFormDetailsFailure,
  EditLovFormDetailsSuccess,
  LoadLovListing,
  LoadLovListingFailure,
  LoadLovListingSuccess,
  LoadLovTypes,
  LoadLovTypesFailure,
  LoadLovTypesSuccess,
  SaveLovFormDetails,
  SaveLovFormDetailsFailure,
  SaveLovFormDetailsSuccess
} from './lovmaster.actons';

describe('LOV Master Effects Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: LovMasterEffect;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get', 'post', 'patch']
  );
  const initialState = {};

  const lovMasterServiceSpy = jasmine.createSpyObj<LovMasterService>([
    'getLovMasterType',
    'getLovMasterList',
    'saveLovFormDetails',
    'createLovFormDetails'
  ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LovMasterEffect,
        DataPersistence,
        provideMockStore({
          initialState: {
            [LOV_MASTER_FEATURE_KEY]: initialState
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
          provide: LovMasterService,
          useValue: lovMasterServiceSpy
        }
      ]
    });

    effect = TestBed.inject(LovMasterEffect);
  });

  describe('LoadLovTypes', () => {
    it('should return LoadLovTypes', () => {
      const payload: LovMasterType[] = [
        {
          name: 'LOV_Name',
          value: 'LOV_Value'
        }
      ];

      const action = new LoadLovTypes();
      const outcome = new LoadLovTypesSuccess(payload);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: payload
      });
      lovMasterServiceSpy.getLovMasterType.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadLovMasterTypes$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadLovTypes();
      const error = new Error('some error');
      const outcome = new LoadLovTypesFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      lovMasterServiceSpy.getLovMasterType.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadLovMasterTypes$).toBeObservable(expected);
    });
  });

  describe('LoadLovListing Details', () => {
    it('should return a details of LOV Master for LoadLovListingSuccess', () => {
      const payload1 = 'LOV_Name';

      const payload2: LoadLovListingSuccessPayload = {
        LovListing: [
          {
            description: 'Desc',
            isActive: true,
            lovName: 'LOV_Name',
            lovType: 'LOV_Type'
          }
        ],
        totalElements: 1
      };

      const action = new LoadLovListing(payload1);
      const outcome = new LoadLovListingSuccess(payload2);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: payload2
      });
      lovMasterServiceSpy.getLovMasterList.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadLovMasterList$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error for LoadLovListingFailure', () => {
      const payload1 = 'LOV_Name';

      const action = new LoadLovListing(payload1);
      const error = new Error('some error');
      const outcome = new LoadLovListingFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      lovMasterServiceSpy.getLovMasterList.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadLovMasterList$).toBeObservable(expected);
    });
  });

  describe('saveLovFormDetails Details', () => {
    it('should return a details of LOV Master for saveLovFormDetailsSuccess', () => {
      const payload1: LovMaster = {
        lovName: 'LOV_Name',
        description: 'Desc',
        isActive: true,
        lovType: 'LOV_Type'
      };

      const action = new SaveLovFormDetails(payload1);
      const outcome = new SaveLovFormDetailsSuccess(payload1);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: payload1
      });
      lovMasterServiceSpy.createLovFormDetails.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.saveLovFormDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error for SaveLovFormDetails', () => {
      const payload1: LovMaster = {
        lovName: 'LOV_Name',
        description: 'Desc',
        isActive: true,
        lovType: 'LOV_Type'
      };

      const action = new SaveLovFormDetails(payload1);
      const error = new Error('some error');
      const outcome = new SaveLovFormDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      lovMasterServiceSpy.createLovFormDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.saveLovFormDetails$).toBeObservable(expected);
    });
  });

  describe('EditLovFormDetails Details', () => {
    it('should return a details of LOV Master for EditLovFormDetails', () => {
      const payload1: LovMaster = {
        lovName: 'LOV_Name',
        description: 'Desc',
        isActive: true,
        lovType: 'LOV_Type'
      };

      const payload2: LoadLovListingSuccessPayload = {
        LovListing: [payload1],
        totalElements: 1
      };

      const action = new EditLovFormDetails(payload1);
      const outcome = new EditLovFormDetailsSuccess(payload2);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: payload2
      });
      lovMasterServiceSpy.saveLovFormDetails.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.editLovFormDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error for EditLovFormDetailsFailure', () => {
      const payload1: LovMaster = {
        lovName: 'LOV_Name',
        description: 'Desc',
        isActive: true,
        lovType: 'LOV_Type'
      };

      const action = new EditLovFormDetails(payload1);
      const error = new Error('some error');
      const outcome = new EditLovFormDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      lovMasterServiceSpy.saveLovFormDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.editLovFormDetails$).toBeObservable(expected);
    });
  });
});
