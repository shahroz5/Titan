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
  MetalTypeListing,
  MetalTypePayload,
  CreateMetalTypePayload,
  UpdateMetalTypePayload,
  MaterialType,
  MaterialTypelov,
  Lov
} from '@poss-web/shared/models';

import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { MetalTypeEffect } from './metal-type.effect';
import { MetalTypeService } from '../metal-type.service';
import {
  LoadMetalTypeList,
  CreateMetalType,
  CreateMetalTypeSuccess,
  CreateMetalTypeFailure,
  UpdateMetalTypeDeatil,
  UpdateMetalTypeDeatilSuccess,
  UpdateMetalTypeDeatilFailure,
  LoadMetalTypeDetailByMaterialCodeSuccess,
  LoadMetalTypeDetailByMaterialCodeFailure,
  LoadMetalTypeDetailByMaterialCode,
  SearchMetalTypeByMaterialCodeSuccess,
  SearchMetalTypeByMaterialCode,
  SearchMetalTypeByMaterialCodeFailure,
  LoadMaterialTypeLovSuccess,
  LoadMaterialTypeLov,
  LoadMaterialTypeLovFailure,
  LoadMetalTypeListSuccess,
  LoadMetalTypeListFailure
} from './metal-type.actions';
import { LovDataService } from '@poss-web/shared/masters/data-access-masters';

describe('MetalTypeEffect Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: MetalTypeEffect;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get', 'post', 'patch']
  );
  const initialState = {};
  let metalTypeService = jasmine.createSpyObj<MetalTypeService>(
    'materialTypeService',
    [
      'getAllMetalTypeList',
      'searchMetalTypeList',
      'saveMetalType',
      'updateMetalTypeDetail',
      'loadMetalTypeByMaterialCode'
    ]
  );
  const lovDataServiceSpy = jasmine.createSpyObj<LovDataService>([
    'getProductLovs'
  ]);
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MetalTypeEffect,
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
          provide: LovDataService,
          useValue: lovDataServiceSpy
        },
        {
          provide: MetalTypeService,
          useValue: {
            getAllMetalTypeList: jasmine.createSpy(),
            searchMetalTypeList: jasmine.createSpy(),
            saveMetalType: jasmine.createSpy(),
            updateMetalTypeDetail: jasmine.createSpy(),
            loadMetalTypeByMaterialCode: jasmine.createSpy(),
            loadMaterialTypeLov: jasmine.createSpy()
          }
        }
      ]
    });

    effect = TestBed.inject(MetalTypeEffect);
    metalTypeService = TestBed.inject<any>(MetalTypeService);
  });

  describe('loadMetalTypeList', () => {
    it('should return a stream with metal type list', () => {
      const payload: MetalTypePayload = {
        pageIndex: 0,
        pageSize: 100
      };
      const metalTypeList: MetalTypeListing = { results: [], totalElements: 0 };
      const action = new LoadMetalTypeList(payload);
      const outcome = new LoadMetalTypeListSuccess(metalTypeList);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: metalTypeList });
      metalTypeService.getAllMetalTypeList.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadMetalTypeList$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: MetalTypePayload = {
        pageIndex: 0,
        pageSize: 100
      };

      const action = new LoadMetalTypeList(payload);
      const error = new Error('some error');
      const outcome = new LoadMetalTypeListFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      metalTypeService.getAllMetalTypeList.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadMetalTypeList$).toBeObservable(expected);
    });
  });

  describe('CreateMetalType', () => {
    it('should return a stream with brand ', () => {
      const parameters: CreateMetalTypePayload = {
        materialTypeCode: 'J',

        description: 'Gold',
        isActive: true,
        orgCode: 'TJ'
      };

      const action = new CreateMetalType(parameters);
      const outcome = new CreateMetalTypeSuccess();
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: parameters });
      metalTypeService.saveMetalType.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.createMetalType$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters: CreateMetalTypePayload = {
        materialTypeCode: 'J',

        description: 'Gold',
        isActive: true,
        orgCode: 'TJ'
      };
      const action = new CreateMetalType(parameters);
      const error = new Error('some error');
      const outcome = new CreateMetalTypeFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      metalTypeService.saveMetalType.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.createMetalType$).toBeObservable(expected);
    });
  });

  describe('updateMetalTypeDetail', () => {
    it('should return a stream with updated metal type', () => {
      const payload: UpdateMetalTypePayload = {
        materialTypeCode: 'J',
        data: {
          isActive: true
        }
      };
      const res: MaterialType = {
        materialCode: 'J'
      };
      const action = new UpdateMetalTypeDeatil(payload);
      const outcome = new UpdateMetalTypeDeatilSuccess(res);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: res });
      metalTypeService.updateMetalTypeDetail.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.updateMetalTypeDetail$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: UpdateMetalTypePayload = {
        materialTypeCode: 'J',
        data: {
          isActive: true
        }
      };
      const action = new UpdateMetalTypeDeatil(payload);
      const error = new Error('some error');
      const outcome = new UpdateMetalTypeDeatilFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      metalTypeService.updateMetalTypeDetail.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.updateMetalTypeDetail$).toBeObservable(expected);
    });
  });

  describe('loadMetalTypeByMaterialCodeDetail', () => {
    it('should return a stream with metal type  object', () => {
      const payload = 'J';
      const res: MaterialType = {
        materialCode: 'J',
        description: 'Gold'
      };

      const action = new LoadMetalTypeDetailByMaterialCode(payload);
      const outcome = new LoadMetalTypeDetailByMaterialCodeSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      metalTypeService.loadMetalTypeByMaterialCode.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadMetalTypeByMaterialCodeDetail$).toBeObservable(
        expected$
      );
    });

    it('should fail and return an action with the error', () => {
      const parameters = 'tanishq';
      const action = new LoadMetalTypeDetailByMaterialCode(parameters);
      const error = new Error('some error');
      const outcome = new LoadMetalTypeDetailByMaterialCodeFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      metalTypeService.loadMetalTypeByMaterialCode.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadMetalTypeByMaterialCodeDetail$).toBeObservable(
        expected
      );
    });
  });

  describe('searchMetalTypeList', () => {
    it('should return a stream with searched metal type', () => {
      const payload = 'J';
      const res: MetalTypeListing = {
        totalElements: 1,
        results: [
          {
            materialCode: 'J',
            description: 'Gold'
          }
        ]
      };
      const action = new SearchMetalTypeByMaterialCode(payload);
      const outcome = new SearchMetalTypeByMaterialCodeSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      metalTypeService.searchMetalTypeList.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.searchMetalTypeList$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters = 'tanishq';
      const action = new SearchMetalTypeByMaterialCode(parameters);
      const error = new Error('some error');
      const outcome = new SearchMetalTypeByMaterialCodeFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      metalTypeService.searchMetalTypeList.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.searchMetalTypeList$).toBeObservable(expected);
    });
  });

  describe('loadMaterialTypeLov', () => {
    it('loadMaterialTypeLov should return a stream with material type lovs ', () => {
      const res: Lov[] = [
        {
          code: 'Metal',
          value: 'Metal',
          isActive: true
        }
      ];
      const action = new LoadMaterialTypeLov();
      const outcome = new LoadMaterialTypeLovSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      lovDataServiceSpy.getProductLovs.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadMaterialTypeLov$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadMaterialTypeLov();
      const error = new Error('some error');
      const outcome = new LoadMaterialTypeLovFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      lovDataServiceSpy.getProductLovs.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadMaterialTypeLov$).toBeObservable(expected);
    });
  });
});
