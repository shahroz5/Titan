import { TestBed } from '@angular/core/testing';
import { DataPersistence } from '@nrwl/angular';
import { Observable } from 'rxjs';
import { RevenueService } from '../revenue.service';
import { RevenueEffect } from './revenue.effect';
import { REVENUE_FEATURE_KEY } from './revenue.state';
import { initialState } from './revenue.reducer';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import {
  PaginatePayload,
  RevenueResponse,
  TodayRevenueResponse
} from '@poss-web/shared/models';
import * as moment from 'moment';
import {
  GetGhsRevenueList,
  GetGhsRevenueListFailure,
  GetGhsRevenueListSuccess,
  GetTodayRevenueList,
  GetTodayRevenueListFailure,
  GetTodayRevenueListSuccess,
  LoadRevenueList,
  LoadRevenueListFailure,
  LoadRevenueListSuccess
} from './revenue.actions';
import { hot, cold } from 'jasmine-marbles';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

describe('Revenue Effect Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: RevenueEffect;

  const revenueServiceSpy = jasmine.createSpyObj<RevenueService>([
    'loadDayWiseRevenue',
    'getTodayRevenue',
    'getGhsRevenue'
  ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RevenueEffect,
        DataPersistence,
        provideMockStore({
          initialState: {
            [REVENUE_FEATURE_KEY]: initialState
          }
        }),
        provideMockActions(() => actions$),

        {
          provide: RevenueService,
          useValue: revenueServiceSpy
        }
      ]
    });

    effect = TestBed.inject(RevenueEffect);
  });

  describe('LoadRevenueList', () => {
    it('should return a LoadRevenueList', () => {
      const serviceReponse: RevenueResponse = {
        totalRevenues: 10,
        revenues: []
      };
      const payload: PaginatePayload = {
        pageIndex: 0,
        pageSize: 10
      };

      const requestBody = {
        fromDate: moment('2020-08-31T18:30:00.000Z'),
        toDate: moment('2020-11-09T18:30:00.000Z')
      };
      const action = new LoadRevenueList(payload, requestBody);
      const outcome = new LoadRevenueListSuccess(serviceReponse);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: serviceReponse });
      revenueServiceSpy.loadDayWiseRevenue.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.loadDayWiseRevenueList$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: PaginatePayload = {
        pageIndex: 0,
        pageSize: 10
      };

      const requestBody = {
        fromDate: moment('2020-08-31T18:30:00.000Z'),
        toDate: moment('2020-11-09T18:30:00.000Z')
      };
      const action = new LoadRevenueList(payload, requestBody);
      const error = new Error('some error');
      const outcome = new LoadRevenueListFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      revenueServiceSpy.loadDayWiseRevenue.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadDayWiseRevenueList$).toBeObservable(expected);
    });
  });

  describe('GetTodayRevenueList', () => {
    it('should return a Today Revenue List', () => {
      const serviceReponse: TodayRevenueResponse = {
        results: []
      };
      const payload = '';
      const businessDate = '';

      const action = new GetTodayRevenueList(payload);
      const outcome = new GetTodayRevenueListSuccess(serviceReponse);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: serviceReponse });
      revenueServiceSpy.getTodayRevenue.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.loadTodayRevenueList$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload = '';
      const businessDate = '';

      const action = new GetTodayRevenueList(payload);
      const error = new Error('some error');
      const outcome = new GetTodayRevenueListFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      revenueServiceSpy.getTodayRevenue.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadTodayRevenueList$).toBeObservable(expected);
    });
  });

  describe('GetGhsRevenueList', () => {
    it('should return a Ghs Revenue List', () => {
      const serviceReponse: TodayRevenueResponse = {
        results: []
      };
      const businessDate = '';

      const action = new GetGhsRevenueList(businessDate);
      const outcome = new GetGhsRevenueListSuccess(serviceReponse);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: serviceReponse });
      revenueServiceSpy.getGhsRevenue.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.loadGhsRevenueList$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload = '';

      const action = new GetGhsRevenueList(payload);
      const error = new Error('some error');
      const outcome = new GetGhsRevenueListFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      revenueServiceSpy.getGhsRevenue.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadGhsRevenueList$).toBeObservable(expected);
    });
  });
});
