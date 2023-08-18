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

import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { SubbrandService } from '../subbrand.service';
import { SubBrandMasterEffect } from './subbrand.effects';
import {
  LoadSubrandDetailsByBrandCodeSuccess,
  LoadSubrandDetailsByBrandCode,
  LoadSubrandDetailsByBrandCodeFailure,
  LoadParenBrandsSuccess,
  LoadParenBrands,
  LoadParenBrandsFailure,
  UpdateIsActive,
  LoadSubBrandListing,
  LoadSubBrandListingSuccess,
  LoadSubBrandListingFailure,
  SaveSubBrandMasterDetails,
  SaveSubBrandMasterDetailsSuccess,
  SaveSubBrandMasterDetailsFailure,
  UpdateSubBrandMasterDetails,
  UpdateSubBrandMasterDetailsSuccess,
  UpdateSubBrandMasterDetailsFailure,
  UpdateIsActiveSuccess,
  UpdateIsActiveFailure,
  SearchSubBrandByBrandCode,
  SearchSubBrandByBrandCodeSuccess,
  SearchSubBrandByBrandCodeFailure
} from './subbrand.actions';
import {
  UpadateIsActivePayload,
  BrandSummary,
  BrandListing,
  BrandMaster,
  SubBrandListingPayload,
  UpdateBrandMasterDetailsPayload,
  SearchPayload
} from '@poss-web/shared/models';
import { BrandDataService } from '@poss-web/shared/masters/data-access-masters';

describe('SubBrand Master  Effects Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: SubBrandMasterEffect;
  const brandDataService = jasmine.createSpyObj<BrandDataService>([
    'getBrandSummary'
  ]);
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get', 'post', 'patch']
  );
  const initialState = {};
  let subbrandService = jasmine.createSpyObj<SubbrandService>(
    'SubbrandService',
    [
      'getSubBrandMasterList',
      'saveSubBrandMasterDetails',
      'updateSubBrandMasterDetails',
      'updateIsActive',
      'getSubBrandDetailsBySubBrandCode',
      'searchSubBrandByBrandCode',
      'updateIsActive'
    ]
  );
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SubBrandMasterEffect,
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
          provide: BrandDataService,
          useValue: brandDataService
        },

        {
          provide: SubbrandService,
          useValue: {
            getSubBrandMasterList: jasmine.createSpy(),
            saveSubBrandMasterDetails: jasmine.createSpy(),
            updateSubBrandMasterDetails: jasmine.createSpy(),
            getSubBrandDetailsBySubBrandCode: jasmine.createSpy(),
            searchSubBrandByBrandCode: jasmine.createSpy(),
            updateIsActive: jasmine.createSpy()
          }
        }
      ]
    });

    effect = TestBed.inject(SubBrandMasterEffect);
    subbrandService = TestBed.inject<any>(SubbrandService);
  });

  describe('loadSubBrandMasterListing', () => {
    it('should return a stream with subbrand list', () => {
      const parameters: SubBrandListingPayload = {
        pageEvent: { pageIndex: 0, pageSize: 100 },
        parentBrandCode: 'Tanishq'
      };
      const brandLsit: BrandListing = {
        results: [
          {
            brandCode: 'brand1',
            description: 'brand1',
            orgCode: 'TJ',
            configDetails: {},
            isActive: true
          }
        ],
        totalElements: 1
      };
      const action = new LoadSubBrandListing(parameters);
      const outcome = new LoadSubBrandListingSuccess(brandLsit);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: brandLsit });
      subbrandService.getSubBrandMasterList.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadSubBrandMasterListing$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters: SubBrandListingPayload = {
        pageEvent: { pageIndex: 0, pageSize: 100 },
        parentBrandCode: 'Tanishq'
      };

      const action = new LoadSubBrandListing(parameters);
      const error = new Error('some error');
      const outcome = new LoadSubBrandListingFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      subbrandService.getSubBrandMasterList.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadSubBrandMasterListing$).toBeObservable(expected);
    });
  });

  describe('saveSubBrandMasterDetails', () => {
    it('should return a stream with subbrand ', () => {
      const parameters: BrandMaster = {
        brandCode: 'tanishq',
        description: 'ABC',
        parentBrandCode: 'titan',
        configDetails: {},
        orgCode: 'TJ',
        isActive: true
      };

      const action = new SaveSubBrandMasterDetails(parameters);
      const outcome = new SaveSubBrandMasterDetailsSuccess();
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: parameters });
      subbrandService.saveSubBrandMasterDetails.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.saveSubBrandMasterDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters: BrandMaster = {
        brandCode: 'tanishq',
        description: 'ABC',
        parentBrandCode: 'titan',
        configDetails: {},
        orgCode: 'TJ',
        isActive: true
      };
      const action = new SaveSubBrandMasterDetails(parameters);
      const error = new Error('some error');
      const outcome = new SaveSubBrandMasterDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      subbrandService.saveSubBrandMasterDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.saveSubBrandMasterDetails$).toBeObservable(expected);
    });
  });

  describe('UpdateSubBrandMasterDetails', () => {
    it('should return a stream with updated brand details', () => {
      const parameters: UpdateBrandMasterDetailsPayload = {
        brandCode: 'tanishq',
        data: {
          isActive: false
        }
      };
      const res: BrandMaster = {
        brandCode: 'tanishq',
        description: 'ABC',
        parentBrandCode: 'titan',
        configDetails: {},
        orgCode: 'TJ',
        isActive: true
      };
      const action = new UpdateSubBrandMasterDetails(parameters);
      const outcome = new UpdateSubBrandMasterDetailsSuccess();
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: res });
      subbrandService.updateSubBrandMasterDetails.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.updatesubBrandMasterDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters: UpdateBrandMasterDetailsPayload = {
        brandCode: 'tanishq',
        data: {
          isActive: false
        }
      };
      const action = new UpdateSubBrandMasterDetails(parameters);
      const error = new Error('some error');
      const outcome = new UpdateSubBrandMasterDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      subbrandService.updateSubBrandMasterDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.updatesubBrandMasterDetails$).toBeObservable(expected);
    });
  });

  describe('loadSubBrandDetailsByBrandCode', () => {
    it('should return a stream with brand  object', () => {
      const parameters = 'tanishq';
      const res: BrandMaster = {
        brandCode: 'tanishq',
        description: 'ABC',
        parentBrandCode: 'titan',
        configDetails: {},
        orgCode: 'TJ',
        isActive: true
      };

      const action = new LoadSubrandDetailsByBrandCode(parameters);
      const outcome = new LoadSubrandDetailsByBrandCodeSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      subbrandService.getSubBrandDetailsBySubBrandCode.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadSubBrandDetailsByBrandCode$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters = 'tanishq';
      const action = new LoadSubrandDetailsByBrandCode(parameters);
      const error = new Error('some error');

      const outcome = new LoadSubrandDetailsByBrandCodeFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      subbrandService.getSubBrandDetailsBySubBrandCode.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.loadSubBrandDetailsByBrandCode$).toBeObservable(expected);
    });
  });

  describe('searchSubBrandByBrandCode', () => {
    it('should return a stream with searched brand', () => {
      const parameters: SearchPayload = {
        brandCode: 'tanishq',
        parentBrandCode: 'Titan'
      };
      const brandLsit: BrandListing = {
        results: [
          {
            brandCode: 'new',
            description: '',
            parentBrandCode: '',
            configDetails: {},
            orgCode: '',
            isActive: true
          }
        ],
        totalElements: 1
      };
      const action = new SearchSubBrandByBrandCode(parameters);
      const outcome = new SearchSubBrandByBrandCodeSuccess(brandLsit);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: brandLsit });
      subbrandService.searchSubBrandByBrandCode.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.searchSubBrandByBrandCode$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters: SearchPayload = {
        brandCode: 'tanishq',
        parentBrandCode: 'Titan'
      };
      const action = new SearchSubBrandByBrandCode(parameters);
      const error = new Error('some error');
      const outcome = new SearchSubBrandByBrandCodeFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      subbrandService.searchSubBrandByBrandCode.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.searchSubBrandByBrandCode$).toBeObservable(expected);
    });
  });

  describe('updateIsActive', () => {
    it('should return a stream with UpdateIsActiveSuccess', () => {
      const parameters: UpadateIsActivePayload = {
        brandCode: 'tanishq',
        isActive: true
      };

      const action = new UpdateIsActive(parameters);
      const outcome = new UpdateIsActiveSuccess('');
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: '' });
      subbrandService.updateIsActive.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.updateIsActive$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters: UpadateIsActivePayload = {
        brandCode: 'tanishq',
        isActive: true
      };
      const action = new UpdateIsActive(parameters);
      const error = new Error('some error');
      const outcome = new UpdateIsActiveFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      subbrandService.updateIsActive.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.updateIsActive$).toBeObservable(expected);
    });
  });

  describe('LoadParenBrands', () => {
    it('LoadParenBrands should return a stream with parent brands ', () => {
      const res: BrandSummary[] = [
        {
          brandCode: 'ABC',
          description: 'ABC'
        }
      ];
      const action = new LoadParenBrands();
      const outcome = new LoadParenBrandsSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      brandDataService.getBrandSummary.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadParentBrand$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadParenBrands();
      const error = new Error('some error');
      const outcome = new LoadParenBrandsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      brandDataService.getBrandSummary.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadParentBrand$).toBeObservable(expected);
    });
  });
});
