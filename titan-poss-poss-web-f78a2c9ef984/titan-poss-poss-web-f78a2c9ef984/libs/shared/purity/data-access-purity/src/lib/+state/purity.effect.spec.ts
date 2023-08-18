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
  UpdatePurityPayload,
  PurityListPayload,
  PurityListResult,
  CreatePurityPayload,
  MaterialType
} from '@poss-web/shared/models';

import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { PurityEffects } from './purity.effects';
import { PurityService } from '../purity.service';
import {
  LoadPurityList,
  LoadPurityListSuccess,
  LoadPurityListFailure,
  CreatePurity,
  CreatePuritySuccess,
  CreatePurityFailure,
  UpdatePurity,
  UpdatePuritySuccess,
  UpdatePurityFailure,
  LoadPurityByMaterialCodeAndPurity,
  LoadPurityByMaterialCodeAndPuritySuccess,
  LoadPurityByMaterialCodeAndPurityFailure,
  LoadMetalTypes,
  LoadMetalTypesSuccess,
  LoadMetalTypesFailure
} from './purity.actions';

describe('PurityEffects Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: PurityEffects;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get', 'post', 'patch']
  );
  const initialState = {};
  let purityService = jasmine.createSpyObj<PurityService>('purityService', [
    'getPurityList',
    'loadMetalTypes',
    'loadPurityByMaterialCodeAndPurity',
    'savePurity',
    'updatePurity'
  ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PurityEffects,
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
          provide: PurityService,
          useValue: {
            getPurityList: jasmine.createSpy(),
            loadMetalTypes: jasmine.createSpy(),
            loadPurityByMaterialCodeAndPurity: jasmine.createSpy(),
            savePurity: jasmine.createSpy(),
            updatePurity: jasmine.createSpy()
          }
        }
      ]
    });

    effect = TestBed.inject(PurityEffects);
    purityService = TestBed.inject<any>(PurityService);
  });

  describe('loadPurityList', () => {
    it('should return a stream with  purity list', () => {
      const payload: PurityListPayload = {
        pageIndex: 0,
        pageSize: 100,
        length: 0
      };
      const res: PurityListResult = {
        purityList: [
          {
            purity: '90',
            offset: '1',
            materialCode: 'J',
            karat: '24',
            description: 'purity for j',
            isActive: true
          }
        ],
        totalElements: 1
      };
      const action = new LoadPurityList(payload);
      const outcome = new LoadPurityListSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      purityService.getPurityList.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadPurityList$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: PurityListPayload = {
        pageIndex: 0,
        pageSize: 100,
        length: 0
      };

      const action = new LoadPurityList(payload);
      const error = new Error('some error');
      const outcome = new LoadPurityListFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      purityService.getPurityList.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadPurityList$).toBeObservable(expected);
    });
  });

  describe('savePurity', () => {
    it('should return a stream with purity ', () => {
      const payload: CreatePurityPayload = {
        purity: '90',
        offset: '1',
        itemTypeCode: 'J',
        karat: '24',
        description: 'purity for j',
        isActive: true
      };

      const action = new CreatePurity(payload);
      const outcome = new CreatePuritySuccess();
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: {} });
      purityService.savePurity.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.savePurity$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: CreatePurityPayload = {
        purity: '90',
        offset: '1',
        itemTypeCode: 'J',
        karat: '24',
        description: 'purity for j',
        isActive: true
      };
      const action = new CreatePurity(payload);
      const error = new Error('some error');
      const outcome = new CreatePurityFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      purityService.savePurity.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.savePurity$).toBeObservable(expected);
    });
  });

  describe('updatePurityDetails', () => {
    it('should return a stream with updated purity details', () => {
      const payload: UpdatePurityPayload = {
        id: 1,
        data: {
          isActive: false
        }
      };
      const action = new UpdatePurity(payload);
      const outcome = new UpdatePuritySuccess();
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: {} });
      purityService.updatePurity.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.updatePurityDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: UpdatePurityPayload = {
        id: 1,
        data: {
          isActive: false
        }
      };
      const action = new UpdatePurity(payload);
      const error = new Error('some error');
      const outcome = new UpdatePurityFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      purityService.updatePurity.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.updatePurityDetails$).toBeObservable(expected);
    });
  });

  describe('loadPurityByMaterialCode', () => {
    it('should return a stream with purity  object', () => {
      const payload = 'J';
      const res = {
        purity: '90',
        offset: '1',
        materialCode: 'J',
        karat: '24',
        description: 'purity for j',
        isActive: true
      };
      const action = new LoadPurityByMaterialCodeAndPurity(payload);
      const outcome = new LoadPurityByMaterialCodeAndPuritySuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      purityService.loadPurityByMaterialCodeAndPurity.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadPurityByMaterialCode$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload = 'GPAY';
      const action = new LoadPurityByMaterialCodeAndPurity(payload);
      const error = new Error('some error');
      const outcome = new LoadPurityByMaterialCodeAndPurityFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      purityService.loadPurityByMaterialCodeAndPurity.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.loadPurityByMaterialCode$).toBeObservable(expected);
    });
  });

  describe('loadMetalTypes', () => {
    it('should return a stream with  metal type list', () => {
      const res: MaterialType[] = [
        {
          materialCode: 'J',
          description: 'Gold'
        }
      ];
      const action = new LoadMetalTypes();
      const outcome = new LoadMetalTypesSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      purityService.loadMetalTypes.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadMetalTypes$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters = 'tanishq';
      const action = new LoadMetalTypes();
      const error = new Error('some error');
      const outcome = new LoadMetalTypesFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      purityService.loadMetalTypes.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadMetalTypes$).toBeObservable(expected);
    });
  });
});
