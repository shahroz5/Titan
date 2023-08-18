import { Observable } from 'rxjs';
import { hot, cold } from 'jasmine-marbles';

import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { HttpClient } from '@angular/common/http';

import { DataPersistence } from '@nrwl/angular';

import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { BinService } from '../bin.service';
import { BinEffect } from './bin.effect';
import {
  SaveBinCodeNewFormDetails,
  SaveBinCodeNewFormDetailsSuccess,
  SaveBinCodeNewFormDetailsFailure,
  LoadBinCodesByBinGroupCode,
  LoadBinCodesByBinGroupCodeSuccess,
  LoadBinCodesByBinGroupCodeFailure,
  EditBinCodeFormDetails,
  EditBinCodeFormDetailsSuccess,
  EditBinCodeFormDetailsFailure,
  SearchBinName,
  SearchBinNameSuccess,
  SearchBinNameFailure,
  LoadLocationsByBinGroupAndBinCode,
  LoadLocationsByBinGroupAndBinCodeSuccess,
  LoadLocationsByBinGroupAndBinCodeFailure,
  SaveLocationMappingDetails,
  SaveLocationMappingDetailsSuccess,
  SaveLocationMappingDetailsFailure
} from './bin.actions';
import {
  SaveBinCodeFormPayload,
  LocationsByBinGroupAndBinCodePayload,
  LocationMappingPostPayload,
  BinCodeSaveModel,
  LocationList,
  LocationMappingPost,
  LoadSearchBinCodeDetails
} from '@poss-web/shared/models';

describe('  Region Effects Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: BinEffect;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get', 'post', 'patch']
  );
  const initialState = {};
  let binService = jasmine.createSpyObj<BinService>('BinService', [
    'getBinCodesByBinGroupCode',
    'saveBinCodeNewFormDetails',
    'saveBinCodeEditedFormDetails',
    'searchBinName',
    'saveLocationMapping',
    'getLocationsByBinGroupAndBinCode'
  ]);
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BinEffect,
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
          provide: BinService,
          useValue: {
            getRegionDetails: jasmine.createSpy(),
            getBinCodesByBinGroupCode: jasmine.createSpy(),
            saveBinCodeNewFormDetails: jasmine.createSpy(),
            saveBinCodeEditedFormDetails: jasmine.createSpy(),
            searchBinName: jasmine.createSpy(),
            saveLocationMapping: jasmine.createSpy(),
            getLocationsByBinGroupAndBinCode: jasmine.createSpy()
          }
        }
      ]
    });

    effect = TestBed.inject(BinEffect);
    binService = TestBed.inject<any>(BinService);
  });

  describe('loadBinCodesByBinGroupCode', () => {
    it('should return a stream with bin object', () => {
      const parameters = { binGroupCode: 'aaa', pageIndex: 0, pageSize: 10 };
      const bin: LoadSearchBinCodeDetails = {
        binCodeSearchListing: [],
        totalElements: 0
      };
      const action = new LoadBinCodesByBinGroupCode(parameters);
      const outcome = new LoadBinCodesByBinGroupCodeSuccess(bin);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: bin });
      binService.getBinCodesByBinGroupCode.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadBinCodesByBinGroupCode$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters = { binGroupCode: 'aaa', pageIndex: 0, pageSize: 10 };
      const action = new LoadBinCodesByBinGroupCode(parameters);
      const error = new Error('some error');
      const outcome = new LoadBinCodesByBinGroupCodeFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      binService.getBinCodesByBinGroupCode.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadBinCodesByBinGroupCode$).toBeObservable(expected);
    });
  });

  describe('saveBinCodeNewFormDetails', () => {
    it('should return a stream with saved bin list', () => {
      const parameters: SaveBinCodeFormPayload = {
        binCode: 'aaa',
        binGroups: ['AAA'],
        description: 'aaa'
      };
      const action = new SaveBinCodeNewFormDetails(parameters);
      const outcome = new SaveBinCodeNewFormDetailsSuccess(parameters);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: parameters });
      binService.saveBinCodeNewFormDetails.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.saveBinCodeNewFormDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters: SaveBinCodeFormPayload = {
        binCode: 'aaa',
        binGroups: ['AAA'],
        description: 'aaa'
      };

      const action = new SaveBinCodeNewFormDetails(parameters);
      const error = new Error('some error');
      const outcome = new SaveBinCodeNewFormDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      binService.saveBinCodeNewFormDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.saveBinCodeNewFormDetails$).toBeObservable(expected);
    });
  });

  describe('saveBinCodeEditedFormDetails', () => {
    it('should return a stream with saved list', () => {
      const parameters: BinCodeSaveModel = {
        binCode: 'aaa',
        binGroups: [{ binGroupCode: 'aaa', isActive: true }],
        description: 'aaa'
      };

      const action = new EditBinCodeFormDetails(parameters);
      const outcome = new EditBinCodeFormDetailsSuccess(parameters);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: parameters });
      binService.saveBinCodeEditedFormDetails.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.saveBinCodeEditedFormDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters: BinCodeSaveModel = {
        binCode: 'aaa',
        binGroups: [{ binGroupCode: 'aaa', isActive: true }],
        description: 'aaa'
      };

      const action = new EditBinCodeFormDetails(parameters);
      const error = new Error('some error');
      const outcome = new EditBinCodeFormDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      binService.saveBinCodeEditedFormDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.saveBinCodeEditedFormDetails$).toBeObservable(expected);
    });
  });

  describe('searchBinName', () => {
    it('should return a stream with bin list', () => {
      const parameters = { binCode: 'ABC', binGroupCode: 'AAA' };
      const binListing: LoadSearchBinCodeDetails = {
        binCodeSearchListing: [
          {
            binCode: 'aaa',
            description: 'aaa',
            isActive: true
          }
        ],
        totalElements: 1
      };

      const action = new SearchBinName(parameters);
      const outcome = new SearchBinNameSuccess(binListing);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: binListing });
      binService.searchBinName.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.searchBinName$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters = { binCode: 'ABC', binGroupCode: 'AAA' };
      const action = new SearchBinName(parameters);
      const error = new Error('some error');
      const outcome = new SearchBinNameFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      binService.searchBinName.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.searchBinName$).toBeObservable(expected);
    });
  });

  describe('loadLocationsByBinCodesAndBinGroup', () => {
    it('should return a stream of locations', () => {
      const parameters: LocationsByBinGroupAndBinCodePayload = {
        binGroup: 'aaa',
        binCodes: ['aaa']
      };
      const list: LocationList[] = [
        {
          id: '1',
          description: 'aaa'
        }
      ];
      const action = new LoadLocationsByBinGroupAndBinCode(parameters);
      const outcome = new LoadLocationsByBinGroupAndBinCodeSuccess(list);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: list });
      binService.getLocationsByBinGroupAndBinCode.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadLocationsByBinCodesAndBinGroup$).toBeObservable(
        expected$
      );
    });

    it('should fail and return an action with the error', () => {
      const parameters: LocationsByBinGroupAndBinCodePayload = {
        binGroup: 'aaa',
        binCodes: ['aaa']
      };
      const action = new LoadLocationsByBinGroupAndBinCode(parameters);
      const error = new Error('some error');
      const outcome = new LoadLocationsByBinGroupAndBinCodeFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      binService.getLocationsByBinGroupAndBinCode.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadLocationsByBinCodesAndBinGroup$).toBeObservable(
        expected
      );
    });
  });

  describe('saveLocationMappingDetails', () => {
    it('should return a stream with Mapped location list', () => {
      const parameters: LocationMappingPostPayload = {
        binGroup: 'aaa',
        data: { addLocations: [], binCodes: [], removeLocations: [] }
      };
      const action = new SaveLocationMappingDetails(parameters);
      const saveSuccess: LocationMappingPost = {
        addLocations: [],
        binCodes: [],
        removeLocations: []
      };
      const outcome = new SaveLocationMappingDetailsSuccess(saveSuccess);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: saveSuccess });
      binService.saveLocationMapping.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.saveLocationMappingDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters: LocationMappingPostPayload = {
        binGroup: 'aaa',
        data: { addLocations: [], binCodes: [], removeLocations: [] }
      };

      const action = new SaveLocationMappingDetails(parameters);
      const error = new Error('some error');
      const outcome = new SaveLocationMappingDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      binService.saveLocationMapping.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.saveLocationMappingDetails$).toBeObservable(expected);
    });
  });
});
