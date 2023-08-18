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
  CatchmentDetails,
  ConfigListingPayload,
  LoadCatchmentListingPayload,
  LoadCatchmentListingSuccessPayload,
  RazorpayVendorSuccessList,
  SortItem
} from '@poss-web/shared/models';

import { CatchmentService } from '../catchment.service';
import { CatchmentEffect } from './catchment.effect';
import { CATCHMENT_FEATURE_KEY } from './catchment.reducer';

import {
  LoadCatchmentDetails,
  LoadCatchmentDetailsFailure,
  LoadCatchmentDetailsSuccess,
  LoadCatchmentListing,
  LoadCatchmentListingFailure,
  LoadCatchmentListingSuccess
} from './catchment.actions';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

describe('Razorpay vendor Effects Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: CatchmentEffect;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get', 'post', 'patch']
  );
  const initialState = {};

  const catchmentServiceSpy = jasmine.createSpyObj<CatchmentService>([
    'getCatchmentListing',
    'searchCatchmentDetails',
    'getCatchmentDetails',
    'saveCatchmentFormDetails',
    'editCatchmentFormDetails',
    'editCatchmentFormDetails'
  ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CatchmentEffect,
        DataPersistence,
        provideMockStore({
          initialState: {
            [CATCHMENT_FEATURE_KEY]: initialState
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
          provide: CatchmentService,
          useValue: catchmentServiceSpy
        }
      ]
    });

    effect = TestBed.inject(CatchmentEffect);
  });

  describe('LoadCatchmentListing', () => {
    it('should return LoadCatchmentListingSuccess', () => {
      const payload: LoadCatchmentListingPayload = {
        pageIndex: 0,
        pageSize: 10
      };
      const action = new LoadCatchmentListing(payload);

      const payload2: LoadCatchmentListingSuccessPayload = {
        catchmentListing: [
          {
            catchmentCode: 'Code',
            description: 'Desc',
            isActive: true
          }
        ],
        totalElements: 1
      };
      const outcome = new LoadCatchmentListingSuccess(payload2);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: payload2
      });
      catchmentServiceSpy.getCatchmentListing.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadCatchmentListing$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error LoadCatchmentListingFailure', () => {
      const payload: LoadCatchmentListingPayload = {
        pageIndex: 0,
        pageSize: 10
      };
      const action = new LoadCatchmentListing(payload);
      const error = new Error('some error');
      const outcome = new LoadCatchmentListingFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      catchmentServiceSpy.getCatchmentListing.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadCatchmentListing$).toBeObservable(expected$);
    });
  });

  describe('LoadCatchmentDetails', () => {
    it('should return LoadCatchmentListingSuccess', () => {
      const action = new LoadCatchmentDetails('');

      const payload: CatchmentDetails = {
        catchmentCode: 'Code',
        description: 'Desc',
        isActive: true
      };
      const outcome = new LoadCatchmentDetailsSuccess(payload);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: payload
      });
      catchmentServiceSpy.getCatchmentDetails.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadCatchmentDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error LoadCatchmentDetailsFailure', () => {
      const action = new LoadCatchmentDetails('');
      const error = new Error('some error');
      const outcome = new LoadCatchmentDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      catchmentServiceSpy.getCatchmentDetails.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadCatchmentDetails$).toBeObservable(expected$);
    });
  });
});
