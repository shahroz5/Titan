import { Observable } from 'rxjs';
import { hot, cold } from 'jasmine-marbles';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { HttpClient } from '@angular/common/http';

import { DataPersistence } from '@nrwl/angular';

import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { RegionService } from '../region.service';
import { RegionEffect } from './region.effect';
import {
  LoadRegionDetails,
  LoadRegionDetailsSuccess,
  LoadRegionDetailsFailure,
  LoadRegionByCode,
  LoadRegionByCodeSuccess,
  LoadRegionByCodeFailure,
  ResetRegionDialog,
  SaveRegionFormDetails,
  SaveRegionFormDetailsSuccess,
  SaveRegionFormDetailsFailure,
  EditRegionDetails,
  EditRegionDetailsSuccess,
  EditRegionDetailsFailure,
  SearchRegion,
  SearchRegionSuccess,
  SearchRegionFailure
} from './region.actions';
import {
  LoadRegionDetailsListingSuccessPayload,
  LoadRegionListingPayload,
  RegionsData,
  SaveRegionDetailsPayload
} from '@poss-web/shared/models';

describe('  Region Effects Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: RegionEffect;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get', 'post', 'patch']
  );
  const initialState = {};
  let regionService = jasmine.createSpyObj<RegionService>('RegionService', [
    'getRegionDetails',
    'getRegionByCode',
    'saveRegionFormDetails',
    'editRegionFormDetails',
    'searchRegionByCode'
  ]);
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RegionEffect,
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
          provide: RegionService,
          useValue: {
            getRegionDetails: jasmine.createSpy(),
            getRegionByCode: jasmine.createSpy(),
            saveRegionFormDetails: jasmine.createSpy(),
            editRegionFormDetails: jasmine.createSpy(),
            searchRegionByCode: jasmine.createSpy()
          }
        }
      ]
    });

    effect = TestBed.inject(RegionEffect);
    regionService = TestBed.inject<any>(RegionService);
  });

  describe('loadRegionDetails', () => {
    it('should return a stream withRegion list', () => {
      const parameters: LoadRegionListingPayload = {
        pageIndex: 0,
        pageSize: 100
      };
      const regionListing: LoadRegionDetailsListingSuccessPayload = {
        regionDetailsListing: [],
        totalElements: 1
      };
      const action = new LoadRegionDetails(parameters);
      const outcome = new LoadRegionDetailsSuccess(regionListing);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: regionListing });
      regionService.getRegionDetails.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadRegionDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters: LoadRegionListingPayload = {
        pageIndex: 0,
        pageSize: 100
      };

      const action = new LoadRegionDetails(parameters);
      const error = new Error('some error');
      const outcome = new LoadRegionDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      regionService.getRegionDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadRegionDetails$).toBeObservable(expected);
    });
  });
  describe('loadRegionByCode', () => {
    it('should return a stream withRegion object', () => {
      const parameters = 'stoneType1';
      const region = {
        regionCode: 'AAA',
        description: 'AAA',
        orgCode: 'AAA',
        configDetails: {},
        parentRegionCode: 'AAA',
        isActive: true
      };

      const action = new LoadRegionByCode(parameters);
      const outcome = new LoadRegionByCodeSuccess(region);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: region });
      regionService.getRegionByCode.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadRegionByCode$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters = 'stoneType1';
      const action = new LoadRegionByCode(parameters);
      const error = new Error('some error');
      const outcome = new LoadRegionByCodeFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      regionService.getRegionByCode.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadRegionByCode$).toBeObservable(expected);
    });
  });

  describe('saveRegionFormDetails', () => {
    it('should return a stream withRegion list', () => {
      const parameters: SaveRegionDetailsPayload = {
        regionCode: 'AAA',
        description: 'AAA',
        orgCode: 'AAA',
        configDetails: {},
        parentRegionCode: 'AAA',
        isActive: true
      };

      const action = new SaveRegionFormDetails(parameters);
      const outcome = new SaveRegionFormDetailsSuccess(parameters);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: parameters });
      regionService.saveRegionFormDetails.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.saveRegionFormDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters: SaveRegionDetailsPayload = {
        regionCode: 'AAA',
        description: 'AAA',
        orgCode: 'AAA',
        configDetails: {},
        parentRegionCode: 'AAA',
        isActive: true
      };

      const action = new SaveRegionFormDetails(parameters);
      const error = new Error('some error');
      const outcome = new SaveRegionFormDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      regionService.saveRegionFormDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.saveRegionFormDetails$).toBeObservable(expected);
    });
  });

  describe('editRegionFormDetails', () => {
    it('should return a stream withRegion list', () => {
      const parameters: SaveRegionDetailsPayload = {
        regionCode: 'AAA',
        description: 'AAA',
        orgCode: 'AAA',
        configDetails: {},
        parentRegionCode: 'AAA',
        isActive: true
      };

      const action = new EditRegionDetails(parameters);
      const outcome = new EditRegionDetailsSuccess(parameters);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: parameters });
      regionService.editRegionFormDetails.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.editRegionFormDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters: SaveRegionDetailsPayload = {
        regionCode: 'AAA',
        description: 'AAA',
        orgCode: 'AAA',
        configDetails: {},
        parentRegionCode: 'AAA',
        isActive: true
      };

      const action = new EditRegionDetails(parameters);
      const error = new Error('some error');
      const outcome = new EditRegionDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      regionService.editRegionFormDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.editRegionFormDetails$).toBeObservable(expected);
    });
  });

  describe('searchRegionByCode', () => {
    it('should return a stream withRegion list', () => {
      const parameters = 'stoneType1';
      const regionListing: LoadRegionDetailsListingSuccessPayload = {
        regionDetailsListing: [
          {
            regionCode: 'AAA',
            description: 'AAA',
            orgCode: 'AAA',
            configDetails: {},
            parentRegionCode: 'AAA',
            isActive: true
          }
        ],
        totalElements: 1
      };

      const action = new SearchRegion(parameters);
      const outcome = new SearchRegionSuccess(regionListing);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: regionListing });
      regionService.searchRegionByCode.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.searchRegionByCode$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters = 'stoneType1';
      const action = new SearchRegion(parameters);
      const error = new Error('some error');
      const outcome = new SearchRegionFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      regionService.searchRegionByCode.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.searchRegionByCode$).toBeObservable(expected);
    });
  });
});
