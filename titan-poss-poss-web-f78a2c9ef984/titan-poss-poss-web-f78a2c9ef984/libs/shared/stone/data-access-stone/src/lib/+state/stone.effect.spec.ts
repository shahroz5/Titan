import { Observable } from 'rxjs';
import { hot, cold } from 'jasmine-marbles';

import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { HttpClient } from '@angular/common/http';

import { DataPersistence } from '@nrwl/angular';

import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { StoneEffect } from './stone.effect';
import { StoneService } from '../stone.service';

import {
  // LoadStoneDetails,
  // LoadStoneDetailsSuccess,
  // LoadStoneDetailsFailure,
  SearchStoneCode,
  SearchStoneCodeSuccess,
  SearchStoneCodeFailure,
  FilterStone,
  ResetFilter,
  FilterStoneSuccess,
  FilterStoneFailure
} from './stone.actions';
import {
  LoadStoneListingPayload,
  LoadStoneListingSuccessPayload,
  StoneDetails,
  StoneFilter
} from '@poss-web/shared/models';

describe('  Stone  Effects Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: StoneEffect;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get', 'post', 'patch']
  );
  const initialState = {};
  let stoneService = jasmine.createSpyObj<StoneService>('StoneService', [
    'getFilteredStoneList'
  ]);
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        StoneEffect,
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
          provide: StoneService,
          useValue: {
            getFilteredStoneList: jasmine.createSpy(),
            getStoneSearchResult: jasmine.createSpy()
          }
        }
      ]
    });

    effect = TestBed.inject(StoneEffect);
    stoneService = TestBed.inject<any>(StoneService);
  });

  describe('FilterStone', () => {
    it('should return a stream with stone list', () => {
      const parameters: StoneFilter = {
        payloadData: {
          color: 'AAA',
          fromStdValue: 10,
          quality: 'AAA',
          ratePerCarat: 10,
          stoneCode: 'AAA',
          stoneTypeCode: 'AAA',
          toStdValue: 10
        },
        pageIndex: 0,
        pageSize: 100
      };
      const stoneListing: LoadStoneListingSuccessPayload = {
        stoneListing: [
          {
            stoneCode: 'ABC',
            stoneTypeCode: 'ABC',
            stdWeight: 'ABC',
            color: 'ABC',
            stdValue: 'ABC',
            quality: 'ABC',
            configDetails: { StoneTEPDiscount: 0 },
            ratePerCarat: 0,
            isActive: true
          }
        ],
        totalElements: 1
      };
      const action = new FilterStone(parameters);
      const outcome = new FilterStoneSuccess(stoneListing);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: stoneListing });
      stoneService.getFilteredStoneList.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.filterStoneDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters: StoneFilter = {
        payloadData: {
          color: 'AAA',
          fromStdValue: 10,
          quality: 'AAA',
          ratePerCarat: 10,
          stoneCode: 'AAA',
          stoneTypeCode: 'AAA',
          toStdValue: 10
        },
        pageIndex: 0,
        pageSize: 100
      };

      const action = new FilterStone(parameters);
      const error = new Error('some error');
      const outcome = new FilterStoneFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      stoneService.getFilteredStoneList.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.filterStoneDetails$).toBeObservable(expected);
    });
  });
});
