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
  ComplexityPriceGroupDetails,
  ComplexityCodeData,
  PriceGroupData,
  LoadComplexityPriceGroupListingPayload,
  LoadComplexityPriceGroupListingSuccessPayload,
  SaveComplexityPriceGroupFormPayload,
  EditComplexityPriceGroupFormPayload,
  PriceGroups,
  Complexity
} from '@poss-web/shared/models';
import { ComplexityPricegroupEffect } from './complexity-pricegroup-map.effects';
import { ComplexityPricegroupService } from '../complexity-pricegroup-map.service';
import {
  LoadComplexityPricegroupMappingDetails,
  LoadComplexityPricegroupMappingDetailsSuccess,
  LoadComplexityPricegroupMappingDetailsFailure,
  LoadComplexityPricegroupMappingDetailsById,
  LoadComplexityPricegroupMappingDetailsByIdSuccess,
  LoadComplexityPricegroupMappingDetailsByIdFailure,
  ResetComplexityPricegroupDialog,
  SaveComplexityPricegroupFormDetails,
  SaveComplexityPricegroupFormDetailsSuccess,
  SaveComplexityPricegroupFormDetailsFailure,
  EditComplexityPricegroupFormDetails,
  EditComplexityPricegroupFormDetailsSuccess,
  EditComplexityPricegroupFormDetailsFailure,
  LoadComplexityCode,
  LoadComplexityCodeSuccess,
  LoadComplexityCodeFailure,
  LoadPricegroup,
  LoadPricegroupSuccess,
  LoadPricegroupFailure
} from './complexity-pricegroup-map.actions';

describe('  Stone Type Effects Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: ComplexityPricegroupEffect;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get', 'post', 'patch']
  );
  const initialState = {};
  let complexityPriceGroupService = jasmine.createSpyObj<
    ComplexityPricegroupService
  >('ComplexityPricegroupService', [
    'getComplexityPricegroupDetails',
    'getComplexityPricegroupDetailsById',
    'saveComplexityPricegroupFormDetails',
    'editComplexityPricegroupFormDetails',
    'getComplexityCode',
    'getPricegroup'
  ]);
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ComplexityPricegroupEffect,
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
          provide: ComplexityPricegroupService,
          useValue: {
            getComplexityPricegroupDetails: jasmine.createSpy(),
            getComplexityPricegroupDetailsById: jasmine.createSpy(),
            saveComplexityPricegroupFormDetails: jasmine.createSpy(),
            editComplexityPricegroupFormDetails: jasmine.createSpy(),
            getComplexityCode: jasmine.createSpy(),
            getPricegroup: jasmine.createSpy()
          }
        }
      ]
    });

    effect = TestBed.get(ComplexityPricegroupEffect);
    complexityPriceGroupService = TestBed.get(ComplexityPricegroupService);
  });

  describe('loadComplexityPricegroupDetails', () => {
    it('should return a stream with complexity price group mapping list', () => {
      const parameters: LoadComplexityPriceGroupListingPayload = {
        pageIndex: 0,
        pageSize: 100
      };
      const param2 = 'aaa';
      const complexityPriceGroupListing: LoadComplexityPriceGroupListingSuccessPayload = {
        complexityPricegroupListing: [
          {
            id: 'abc',
            complexityCode: 'abc',
            priceGroup: 'abc',
            makingChargesPerUnit: 'abc',
            makingChargesPerGram: 'abc',
            wastagePercentage: 'abc',
            makingChargesPercentage: 'abc'
          }
        ],
        totalElements: 1
      };
      const action = new LoadComplexityPricegroupMappingDetails(
        parameters,
        param2
      );
      const outcome = new LoadComplexityPricegroupMappingDetailsSuccess(
        complexityPriceGroupListing
      );
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: complexityPriceGroupListing });
      complexityPriceGroupService.getComplexityPricegroupDetails.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadComplexityPricegroupDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters: LoadComplexityPriceGroupListingPayload = {
        pageIndex: 0,
        pageSize: 100
      };
      const param2 = 'aaa';
      const complexityPriceGroupListing: LoadComplexityPriceGroupListingSuccessPayload = {
        complexityPricegroupListing: [],
        totalElements: 0
      };
      const action = new LoadComplexityPricegroupMappingDetails(
        parameters,
        param2
      );
      const error = new Error('some error');
      // const outcome = new LoadComplexityPricegroupMappingDetailsFailure(
      //   CustomErrorAdaptor.fromJson(error)
      // );
      const outcome = new LoadComplexityPricegroupMappingDetailsSuccess(
        complexityPriceGroupListing
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      complexityPriceGroupService.getComplexityPricegroupDetails.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.loadComplexityPricegroupDetails$).toBeObservable(expected);
    });
  });
  describe('loadComplexityPricegroupDetailsById', () => {
    it('should return a stream with complexity price group mapping object', () => {
      const parameters = 'stoneType1';
      const cpg = {
        id: 'abc',
        complexityCode: 'abc',
        priceGroup: 'abc',
        makingChargesPerUnit: 'abc',
        makingChargesPerGram: 'abc',
        wastagePercentage: 'abc',
        makingChargesPercentage: 'abc'
      };

      const action = new LoadComplexityPricegroupMappingDetailsById(parameters);
      const outcome = new LoadComplexityPricegroupMappingDetailsByIdSuccess(
        cpg
      );
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: cpg });
      complexityPriceGroupService.getComplexityPricegroupDetailsById.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadComplexityPricegroupDetailsById$).toBeObservable(
        expected$
      );
    });

    it('should fail and return an action with the error', () => {
      const parameters = 'stoneType1';
      const action = new LoadComplexityPricegroupMappingDetailsById(parameters);
      const error = new Error('some error');
      const outcome = new LoadComplexityPricegroupMappingDetailsByIdFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      complexityPriceGroupService.getComplexityPricegroupDetailsById.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.loadComplexityPricegroupDetailsById$).toBeObservable(
        expected
      );
    });
  });

  describe('saveStonetype', () => {
    it('should return a stream with complexity price group mapping list', () => {
      const parameters: SaveComplexityPriceGroupFormPayload = {
        complexityCode: 'abc',
        priceGroup: 'abc',
        makingChargePunit: 'abc',
        makingChargePgram: 'abc',
        wastagePct: 'abc',
        makingChargePct: 'abc'
      };

      const payload: ComplexityPriceGroupDetails = {
        id: 'abc',
        complexityCode: 'abc',
        priceGroup: 'abc',
        makingChargesPerUnit: 'abc',
        makingChargesPerGram: 'abc',
        wastagePercentage: 'abc',
        makingChargesPercentage: 'abc'
      };
      const action = new SaveComplexityPricegroupFormDetails(parameters);
      const outcome = new SaveComplexityPricegroupFormDetailsSuccess(payload);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: payload });
      complexityPriceGroupService.saveComplexityPricegroupFormDetails.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.saveComplexityPricegroupFormDetails$).toBeObservable(
        expected$
      );
    });

    it('should fail and return an action with the error', () => {
      const parameters: SaveComplexityPriceGroupFormPayload = {
        complexityCode: 'abc',
        priceGroup: 'abc',
        makingChargePunit: 'abc',
        makingChargePgram: 'abc',
        wastagePct: 'abc',
        makingChargePct: 'abc'
      };

      const action = new SaveComplexityPricegroupFormDetails(parameters);
      const error = new Error('some error');
      const outcome = new SaveComplexityPricegroupFormDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      complexityPriceGroupService.saveComplexityPricegroupFormDetails.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.saveComplexityPricegroupFormDetails$).toBeObservable(
        expected
      );
    });
  });

  describe('editStonetype', () => {
    it('should return a stream with complexity price group mapping list', () => {
      const parameters: EditComplexityPriceGroupFormPayload = {
        id: 'abc',
        complexityCode: 'abc',
        priceGroup: 'abc',
        makingChargePunit: 'abc',
        makingChargePgram: 'abc',
        wastagePct: 'abc',
        makingChargePct: 'abc'
      };
      const payload: ComplexityPriceGroupDetails = {
        id: 'abc',
        complexityCode: 'abc',
        priceGroup: 'abc',
        makingChargesPerUnit: 'abc',
        makingChargesPerGram: 'abc',
        wastagePercentage: 'abc',
        makingChargesPercentage: 'abc'
      };
      const action = new EditComplexityPricegroupFormDetails(parameters);
      const outcome = new EditComplexityPricegroupFormDetailsSuccess(payload);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: payload });
      complexityPriceGroupService.editComplexityPricegroupFormDetails.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.editComplexityPricegroupFormDetails$).toBeObservable(
        expected$
      );
    });

    it('should fail and return an action with the error', () => {
      const parameters: EditComplexityPriceGroupFormPayload = {
        id: 'ab',
        complexityCode: 'abc',
        priceGroup: 'abc',
        makingChargePunit: 'abc',
        makingChargePgram: 'abc',
        wastagePct: 'abc',
        makingChargePct: 'abc'
      };

      const action = new EditComplexityPricegroupFormDetails(parameters);
      const error = new Error('some error');
      const outcome = new EditComplexityPricegroupFormDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      complexityPriceGroupService.editComplexityPricegroupFormDetails.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.editComplexityPricegroupFormDetails$).toBeObservable(
        expected
      );
    });
  });

  describe('complexityCodeDetails', () => {
    it('should return a stream with complexity price group mapping list', () => {
      const parameters: Complexity[] = [
        {
          complexityCode: 'abc',
          description: 'abc'
        }
      ];

      const action = new LoadComplexityCode();
      const outcome = new LoadComplexityCodeSuccess(parameters);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: parameters });
      complexityPriceGroupService.getComplexityCode.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.complexityCodeDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters: ComplexityCodeData[] = [
        {
          id: 'aaa',
          name: 'aaa'
        }
      ];

      const action = new LoadComplexityCode();
      const error = new Error('some error');
      const outcome = new LoadComplexityCodeFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      complexityPriceGroupService.getComplexityCode.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.complexityCodeDetails$).toBeObservable(expected);
    });
  });

  describe('priceGroupDetails', () => {
    it('should return a stream with complexity price group mapping list', () => {
      const parameters: PriceGroups[] = [
        {
          priceGroup: 'abc',
          description: 'abc'
        }
      ];

      const action = new LoadPricegroup();
      const outcome = new LoadPricegroupSuccess(parameters);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: parameters });
      complexityPriceGroupService.getPricegroup.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.priceGroupDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters: PriceGroups[] = [
        {
          priceGroup: 'abc',
          description: 'abc'
        }
      ];

      const action = new LoadPricegroup();
      const error = new Error('some error');
      const outcome = new LoadPricegroupFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      complexityPriceGroupService.getPricegroup.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.priceGroupDetails$).toBeObservable(expected);
    });
  });
});
