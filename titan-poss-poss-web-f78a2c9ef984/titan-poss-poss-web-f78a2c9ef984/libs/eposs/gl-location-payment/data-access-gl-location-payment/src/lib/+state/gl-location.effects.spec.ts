import { Observable } from 'rxjs';
import { hot, cold } from 'jasmine-marbles';

import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { HttpClient } from '@angular/common/http';

import { DataPersistence } from '@nrwl/angular';

import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  LoadGlLocationPaymentList,
  LoadGlLocationPaymentListSuccess,
  LoadGlLocationPaymentListFailure,
  SaveGlLocationPayment,
  SaveGlLocationPaymentSuccess,
  SaveGlLocationPaymentFailure,
  LoadPaymentCodes,
  LoadPaymentCodesSuccess,
  LoadPaymentCodesFailure,
  GetLocationCodes,
  GetLocationCodesSuccess,
  GetLocationCodesFailure
} from './gl-location.actions';
import {
  GLLocationPaymentList,
  SaveGlLocationPayments,
  GLLocationPaymentListPayload,
  GLLocationPaymentSuccessList,
  PaymentCodes,
  LocationCodeDetails
} from '@poss-web/shared/models';
import { GlLocationPaymentEffect } from './gl-location.effects';
import { GlLocationPaymentService } from '../gl-location-payment.service';
import { LocationDataService } from '@poss-web/shared/masters/data-access-masters';

describe('  GL Location Payment Effects Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: GlLocationPaymentEffect;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get', 'post', 'patch']
  );
  const initialState = {};
  let glLocationPaymentService = jasmine.createSpyObj<GlLocationPaymentService>(
    'GlLocationPaymentService',
    [
      'getGlLocationPaymentList',
      'getPaymentCodes',
      'saveGlLocationPayment',
      'getLocationCodes'
    ]
  );
  const locationDataServiceSpy = jasmine.createSpyObj<LocationDataService>([
    'getLocationSummaryList'
  ]);
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GlLocationPaymentEffect,
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
          provide: GlLocationPaymentService,
          useValue: {
            getGlLocationPaymentList: jasmine.createSpy(),
            getPaymentCodes: jasmine.createSpy(),
            saveGlLocationPayment: jasmine.createSpy()
          }
        },
        {
          provide: LocationDataService,
          useValue: locationDataServiceSpy
        }
      ]
    });

    effect = TestBed.inject(GlLocationPaymentEffect);
    glLocationPaymentService = TestBed.inject<any>(GlLocationPaymentService);
  });

  describe('loadGlLocationPaymentDetails', () => {
    it('should return a stream with GL Location Payment list', () => {
      const parameters: GLLocationPaymentListPayload = {
        pageIndex: 0,
        pageSize: 100
      };
      const glLocationPaymentListing: GLLocationPaymentSuccessList = {
        glLocationPaymentList: [],
        count: 1
      };
      const action = new LoadGlLocationPaymentList(parameters);
      const outcome = new LoadGlLocationPaymentListSuccess(
        glLocationPaymentListing
      );
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: glLocationPaymentListing });
      glLocationPaymentService.getGlLocationPaymentList.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadGlLocationPaymentDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters: GLLocationPaymentListPayload = {
        pageIndex: 0,
        pageSize: 100
      };
      const action = new LoadGlLocationPaymentList(parameters);
      const error = new Error('some error');
      const outcome = new LoadGlLocationPaymentListFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      glLocationPaymentService.getGlLocationPaymentList.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.loadGlLocationPaymentDetails$).toBeObservable(expected);
    });
  });

  describe('saveGlLocationPaymentDetails', () => {
    it('should return a stream with GL Location Payment list', () => {
      const parameters: SaveGlLocationPayments = {
        locationCode: 'URB',
        addLocations: ['URB', 'BGR'],
        addPaymentCodes: ['CASH'],
        removeLocations: ['ADH'],
        removePaymentCodes: ['CHEQUE']
      };
      const param2: GLLocationPaymentList = {
        id: '4567890',
        glCode: 23456,
        locationCode: 'URB',
        paymentCode: 'CASH',
        lastModified: true
      };

      const action = new SaveGlLocationPayment(parameters);
      const outcome = new SaveGlLocationPaymentSuccess(param2);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: param2 });
      glLocationPaymentService.saveGlLocationPayment.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.saveGlLocationPaymentDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters: SaveGlLocationPayments = {
        locationCode: 'URB',
        addLocations: ['URB', 'BGR'],
        addPaymentCodes: ['CASH'],
        removeLocations: ['ADH'],
        removePaymentCodes: ['CHEQUE']
      };

      const action = new SaveGlLocationPayment(parameters);
      const error = new Error('some error');
      const outcome = new SaveGlLocationPaymentFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      glLocationPaymentService.saveGlLocationPayment.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.saveGlLocationPaymentDetails$).toBeObservable(expected);
    });
  });

  describe('loadPaymentCodes', () => {
    it('should return a stream with GL Location Payment object', () => {
      const paymentCodes: PaymentCodes[] = [
        {
          value: 'CASH',
          description: 'CASH'
        }
      ];

      const action = new LoadPaymentCodes();
      const outcome = new LoadPaymentCodesSuccess(paymentCodes);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: paymentCodes });
      glLocationPaymentService.getPaymentCodes.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadPaymentCodes$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadPaymentCodes();
      const error = new Error('some error');
      const outcome = new LoadPaymentCodesFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      glLocationPaymentService.getPaymentCodes.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadPaymentCodes$).toBeObservable(expected);
    });
  });

  describe('loadLocationCodes', () => {
    it('should return a stream with GL Location Payment object', () => {
      const locationCodes: LocationCodeDetails[] = [
        {
          locationCode: 'URB',
          description: 'aaaa'
        }
      ];

      const action = new GetLocationCodes();
      const outcome = new GetLocationCodesSuccess(locationCodes);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: locationCodes });
      locationDataServiceSpy.getLocationSummaryList.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadLocationCodes$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new GetLocationCodes();
      const error = new Error('some error');
      const outcome = new GetLocationCodesFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      locationDataServiceSpy.getLocationSummaryList.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadLocationCodes$).toBeObservable(expected);
    });
  });
});
