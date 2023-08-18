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
  GrnRequestApprovalListRequest,
  GrnRequestApprovalListResponse,
  SaveGrnRequestApproval,
  F2MarginListResponse,
  F2MarginListPayload
} from '@poss-web/shared/models';

import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { F2MarginEffect } from './f2-margin.effect';
import { F2MarginService } from '../f2-margin.service';

import {} from './f2-margin.effect';
import {
  LoadF2MarginList,
  LoadF2MarginListSuccess,
  LoadF2MarginListFailure
} from './f2-margin.action';

describe('F2MarginEffect Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: F2MarginEffect;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get', 'post', 'patch']
  );
  const initialState = {};
  let f2MarginService = jasmine.createSpyObj<F2MarginService>(
    'F2MarginService',
    ['getF2MarginList']
  );

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        F2MarginEffect,
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
          provide: F2MarginService,
          useValue: {
            getF2MarginList: jasmine.createSpy()
          }
        }
      ]
    });

    effect = TestBed.inject(F2MarginEffect);
    f2MarginService = TestBed.inject<any>(F2MarginService);
  });

  describe('loadF2MarginList', () => {
    it('should return a stream with  f2 margin list', () => {
      const payload: F2MarginListPayload = {
        cfaCode: '71',
        pageIndex: 1,
        pageSize: 10
      };

      const res: F2MarginListResponse = {
        f2MarginList: [
          {
            id: '1',
            cfa: '71',
            f1From: 1,
            f1To: 2,
            stoneBandFrom: 1,
            stoneBandTo: 2,
            margin: 1
          }
        ],
        totalElements: 1
      };

      const action = new LoadF2MarginList(payload);
      const outcome = new LoadF2MarginListSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      f2MarginService.getF2MarginList.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadF2MarginList$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: F2MarginListPayload = {
        cfaCode: '71',
        pageIndex: 1,
        pageSize: 10
      };

      const action = new LoadF2MarginList(payload);
      const error = new Error('some error');
      const outcome = new LoadF2MarginListFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      f2MarginService.getF2MarginList.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadF2MarginList$).toBeObservable(expected);
    });
  });
});
