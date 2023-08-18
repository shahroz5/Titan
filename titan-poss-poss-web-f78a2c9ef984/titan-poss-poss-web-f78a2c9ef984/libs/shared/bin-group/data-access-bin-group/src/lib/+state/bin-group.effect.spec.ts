import { Observable } from 'rxjs';
import { hot, cold } from 'jasmine-marbles';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { HttpClient } from '@angular/common/http';
import { DataPersistence } from '@nrwl/angular';
import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { BinGroupService } from '../bin-group.service';
import { BinGroupEffect } from './bin-group.effect';
import {
  LoadBinGroupDetailsListingSuccessPayload,
  LoadBinGroupDetailsListingPayload,
  BinGroupDetails,
  SaveBinGroupFormDetailsPayload
} from '@poss-web/shared/models';
import {
  LoadBinGroupDetails,
  LoadBinGroupDetailsSuccess,
  LoadBinGroupDetailsFailure,
  LoadBinGroupByBinGroupCode,
  LoadBinGroupByBinGroupCodeSuccess,
  LoadBinGroupByBinGroupCodeFailure,
  SaveBinGroupFormDetails,
  SaveBinGroupFormDetailsFailure,
  EditBinGroupFormDetails,
  EditBinGroupFormDetailsSuccess,
  EditBinGroupFormDetailsFailure,
  SaveBinGroupFormDetailsSuccess,
  SearchByBinGroupCode,
  SearchByBinGroupCodeSuccess,
  SearchByBinGroupCodeFailure
} from './bin-group.actions';

describe(' Region Effects Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: BinGroupEffect;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get', 'post', 'patch']
  );
  const initialState = {};
  let binGroupService = jasmine.createSpyObj<BinGroupService>(
    'BinGroupService',
    [
      'getbinGroupDetails',
      'getBinGroupByBinGroupCode',
      'saveBinGroupFormDetails',
      'editBinGroupFormDetails',
      'searchBinGroupByBinGroupCode'
    ]
  );
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BinGroupEffect,
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
          provide: BinGroupService,
          useValue: {
            getbinGroupDetails: jasmine.createSpy(),
            getBinGroupByBinGroupCode: jasmine.createSpy(),
            saveBinGroupFormDetails: jasmine.createSpy(),
            editBinGroupFormDetails: jasmine.createSpy(),
            searchBinGroupByBinGroupCode: jasmine.createSpy()
          }
        }
      ]
    });

    effect = TestBed.inject(BinGroupEffect);
    binGroupService = TestBed.get(BinGroupService);
  });

  describe('loadRegionDetails', () => {
    it('should return a stream withRegion list', () => {
      const parameters: LoadBinGroupDetailsListingPayload = {
        pageIndex: 0,
        pageSize: 100
      };
      const regionListing: LoadBinGroupDetailsListingSuccessPayload = {
        binGroupDetailsListing: [],
        totalElements: 1
      };
      const action = new LoadBinGroupDetails(parameters);
      const outcome = new LoadBinGroupDetailsSuccess(regionListing);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: regionListing });
      binGroupService.getbinGroupDetails.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadBinGroupDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters: LoadBinGroupDetailsListingPayload = {
        pageIndex: 0,
        pageSize: 100
      };

      const action = new LoadBinGroupDetails(parameters);
      const error = new Error('some error');
      const outcome = new LoadBinGroupDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      binGroupService.getbinGroupDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadBinGroupDetails$).toBeObservable(expected);
    });
  });
  describe('loadRegionByCode', () => {
    it('should return a stream withRegion object', () => {
      const parameters = 'stoneType1';
      const region = {
        binGroupCode: 'AAA',
        description: 'AAA',
        isActive: true
      };

      const action = new LoadBinGroupByBinGroupCode(parameters);
      const outcome = new LoadBinGroupByBinGroupCodeSuccess(region);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: region });
      binGroupService.getBinGroupByBinGroupCode.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadBinGroupDetailsByBinGroupCode$).toBeObservable(
        expected$
      );
    });

    it('should fail and return an action with the error', () => {
      const parameters = 'stoneType1';
      const action = new LoadBinGroupByBinGroupCode(parameters);
      const error = new Error('some error');
      const outcome = new LoadBinGroupByBinGroupCodeFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      binGroupService.getBinGroupByBinGroupCode.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadBinGroupDetailsByBinGroupCode$).toBeObservable(
        expected
      );
    });
  });

  describe('saveBinGroupFormDetails', () => {
    it('should return a stream withRegion list', () => {
      const parameters: SaveBinGroupFormDetailsPayload = {
        binGroupCode: 'AAA',
        description: 'AAA',
        isActive: true
      };

      const action = new SaveBinGroupFormDetails(parameters);
      const outcome = new SaveBinGroupFormDetailsSuccess(parameters);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: parameters });
      binGroupService.saveBinGroupFormDetails.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.saveBinGroupFormDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters: SaveBinGroupFormDetailsPayload = {
        binGroupCode: 'AAA',
        description: 'AAA',
        isActive: true
      };

      const action = new SaveBinGroupFormDetails(parameters);
      const error = new Error('some error');
      const outcome = new SaveBinGroupFormDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      binGroupService.saveBinGroupFormDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.saveBinGroupFormDetails$).toBeObservable(expected);
    });
  });

  describe('editBinGroupFormDetails', () => {
    it('should return a stream withRegion list', () => {
      const parameters: SaveBinGroupFormDetailsPayload = {
        binGroupCode: 'AAA',
        description: 'AAA',
        isActive: true
      };

      const action = new EditBinGroupFormDetails(parameters);
      const outcome = new EditBinGroupFormDetailsSuccess(parameters);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: parameters });
      binGroupService.editBinGroupFormDetails.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.editBinGroupFormDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters: SaveBinGroupFormDetailsPayload = {
        binGroupCode: 'AAA',
        description: 'AAA',
        isActive: true
      };

      const action = new EditBinGroupFormDetails(parameters);
      const error = new Error('some error');
      const outcome = new EditBinGroupFormDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      binGroupService.editBinGroupFormDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.editBinGroupFormDetails$).toBeObservable(expected);
    });
  });

  describe('searchBinGroupByBinGroupCode', () => {
    it('should return a stream withRegion list', () => {
      const parameters = 'stoneType1';
      const regionListing: LoadBinGroupDetailsListingSuccessPayload = {
        binGroupDetailsListing: [
          {
            binGroupCode: 'AAA',
            description: 'AAA',
            isActive: true
          }
        ],
        totalElements: 1
      };

      const action = new SearchByBinGroupCode(parameters);
      const outcome = new SearchByBinGroupCodeSuccess(regionListing);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: regionListing });
      binGroupService.searchBinGroupByBinGroupCode.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.searchBinGroupByBinCode$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters = 'stoneType1';
      const action = new SearchByBinGroupCode(parameters);
      const error = new Error('some error');
      const outcome = new SearchByBinGroupCodeFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      binGroupService.searchBinGroupByBinGroupCode.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.searchBinGroupByBinCode$).toBeObservable(expected);
    });
  });
});
