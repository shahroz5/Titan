import { Observable } from 'rxjs';
import { hot, cold } from 'jasmine-marbles';

import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { HttpClient } from '@angular/common/http';

import { DataPersistence } from '@nrwl/angular';

import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { SubRegionService } from '../sub-region.service';
import { SubRegionEffect } from './sub-region.effect';
import {
  LoadRegionDetails,
  LoadRegionDetailsSuccess,
  LoadRegionDetailsFailure,
  LoadSubRegionDetails,
  LoadSubRegionDetailsSuccess,
  LoadSubRegionDetailsFailure,
  LoadSubRegionByCode,
  LoadSubRegionByCodeSuccess,
  LoadSubRegionByCodeFailure,
  ResetSubRegionDialog,
  SaveSubRegionFormDetails,
  SaveSubRegionFormDetailsSuccess,
  SaveSubRegionFormDetailsFailure,
  EditSubRegionDetails,
  EditSubRegionDetailsSuccess,
  EditSubRegionDetailsFailure,
  SearchSubRegion,
  SearchSubRegionSuccess,
  SearchSubRegionFailure
} from './sub-region.actions';
import {
  LoadRegionDetailsListingSuccessPayload,
  LoadRegionListingPayload,
  LoadSubRegionListingPayload,
  LoadSubRegionListingSuccessPayload,
  RegionsData,
  SaveRegionDetailsPayload
} from '@poss-web/shared/models';

describe('  Sub Region Effects Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: SubRegionEffect;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get', 'post', 'patch']
  );
  const initialState = {};
  let subRegionService = jasmine.createSpyObj<SubRegionService>(
    'SubRegionService',
    [
      'getRegionDetails',
      'getSubRegionDetails',
      'getSubRegionByCode',
      'saveSubRegionFormDetails',
      'editSubRegionFormDetails',
      'searchSubRegionByCode'
    ]
  );
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SubRegionEffect,
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
          provide: SubRegionService,
          useValue: {
            getRegionDetails: jasmine.createSpy(),
            getSubRegionDetails: jasmine.createSpy(),
            getSubRegionByCode: jasmine.createSpy(),
            saveSubRegionFormDetails: jasmine.createSpy(),
            editSubRegionFormDetails: jasmine.createSpy(),
            searchSubRegionByCode: jasmine.createSpy()
          }
        }
      ]
    });

    effect = TestBed.inject(SubRegionEffect);
    subRegionService = TestBed.get(SubRegionService);
  });

  describe('loadRegionDetails', () => {
    it('should return a stream with Sub Region list', () => {
      const regionListing: LoadRegionDetailsListingSuccessPayload = {
        regionDetailsListing: [],
        totalElements: 1
      };
      const action = new LoadRegionDetails();
      const outcome = new LoadRegionDetailsSuccess(regionListing);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: regionListing });
      subRegionService.getRegionDetails.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadRegionDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadRegionDetails();
      const error = new Error('some error');
      const outcome = new LoadRegionDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      subRegionService.getRegionDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadRegionDetails$).toBeObservable(expected);
    });
  });
  describe('loadSubRegionDetails', () => {
    it('should return a stream with Sub Region list', () => {
      const payload: LoadSubRegionListingPayload = {
        parentRegionCode: 'AAA',
        pageIndex: 0,
        pageSize: 10
      };
      const regionListing: LoadSubRegionListingSuccessPayload = {
        subRegionDetailsListing: [],
        totalElements: 1
      };
      const action = new LoadSubRegionDetails(payload);
      const outcome = new LoadSubRegionDetailsSuccess(regionListing);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: regionListing });
      subRegionService.getSubRegionDetails.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadSubRegionDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: LoadSubRegionListingPayload = {
        parentRegionCode: 'AAA',
        pageIndex: 0,
        pageSize: 10
      };
      const action = new LoadSubRegionDetails(payload);
      const error = new Error('some error');
      const outcome = new LoadSubRegionDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      subRegionService.getSubRegionDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadSubRegionDetails$).toBeObservable(expected);
    });
  });
  describe('loadSubRegionByCode', () => {
    it('should return a stream with Sub Region object', () => {
      const parameters = 'stoneType1';
      const region = {
        regionCode: 'AAA',
        description: 'AAA',
        orgCode: 'AAA',
        configDetails: {},
        parentRegionCode: 'AAA',
        isActive: true
      };

      const action = new LoadSubRegionByCode(parameters);
      const outcome = new LoadSubRegionByCodeSuccess(region);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: region });
      subRegionService.getSubRegionByCode.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadSubRegionByCode$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters = 'stoneType1';
      const action = new LoadSubRegionByCode(parameters);
      const error = new Error('some error');
      const outcome = new LoadSubRegionByCodeFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      subRegionService.getSubRegionByCode.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadSubRegionByCode$).toBeObservable(expected);
    });
  });

  describe('saveSubRegionFormDetails', () => {
    it('should return a stream with Sub Region list', () => {
      const parameters: SaveRegionDetailsPayload = {
        regionCode: 'AAA',
        description: 'AAA',
        orgCode: 'AAA',
        configDetails: {},
        parentRegionCode: 'AAA',
        isActive: true
      };

      const action = new SaveSubRegionFormDetails(parameters);
      const outcome = new SaveSubRegionFormDetailsSuccess(parameters);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: parameters });
      subRegionService.saveSubRegionFormDetails.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.saveSubRegionFormDetails$).toBeObservable(expected$);
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

      const action = new SaveSubRegionFormDetails(parameters);
      const error = new Error('some error');
      const outcome = new SaveSubRegionFormDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      subRegionService.saveSubRegionFormDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.saveSubRegionFormDetails$).toBeObservable(expected);
    });
  });

  describe('editSubTownFormDetails', () => {
    it('should return a stream with Sub Region list', () => {
      const parameters: SaveRegionDetailsPayload = {
        regionCode: 'AAA',
        description: 'AAA',
        orgCode: 'AAA',
        configDetails: {},
        parentRegionCode: 'AAA',
        isActive: true
      };

      const action = new EditSubRegionDetails(parameters);
      const outcome = new EditSubRegionDetailsSuccess(parameters);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: parameters });
      subRegionService.editSubRegionFormDetails.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.editSubTownFormDetails$).toBeObservable(expected$);
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

      const action = new EditSubRegionDetails(parameters);
      const error = new Error('some error');
      const outcome = new EditSubRegionDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      subRegionService.editSubRegionFormDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.editSubTownFormDetails$).toBeObservable(expected);
    });
  });

  describe('searchSubRegionByCode', () => {
    it('should return a stream with Sub Region list', () => {
      const parameters = { regionCode: 'ABC', parentRegionCode: 'AAA' };
      const regionListing: LoadSubRegionListingSuccessPayload = {
        subRegionDetailsListing: [
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

      const action = new SearchSubRegion(parameters);
      const outcome = new SearchSubRegionSuccess(regionListing);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: regionListing });
      subRegionService.searchSubRegionByCode.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.searchSubRegionByCode$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters = { regionCode: 'ABC', parentRegionCode: 'AAA' };
      const action = new SearchSubRegion(parameters);
      const error = new Error('some error');
      const outcome = new SearchSubRegionFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      subRegionService.searchSubRegionByCode.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.searchSubRegionByCode$).toBeObservable(expected);
    });
  });
});
