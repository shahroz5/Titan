import { Observable } from 'rxjs';
import { hot, cold } from 'jasmine-marbles';

import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { HttpClient } from '@angular/common/http';

import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { DataPersistence } from '@nrwl/angular';
import {
  CnValidation,
  CnValidationList,
  CnValidationListPayload,
  CnValidationResponse
} from '@poss-web/shared/models';

import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { CnValidationEffect } from './cn-validation.effects';
import { CnValidationService } from '../cn-validation.service';
import {
  LoadCnTypeList,
  LoadCnTypeListFailure,
  LoadCnTypeListSuccess,
  LoadCnValidationByRuleId,
  LoadCnValidationByRuleIdFailure,
  LoadCnValidationByRuleIdSuccess,
  LoadCnValidationList,
  LoadCnValidationListFailure,
  LoadCnValidationListSuccess,
  SaveCnValidation,
  SaveCnValidationFailure,
  SaveCnValidationSuccess,
  SearchCnValidationByCnType,
  SearchCnValidationByCnTypeFailure,
  SearchCnValidationByCnTypeSuccess,
  UpdateCnValidation,
  UpdateCnValidationFailure,
  UpdateCnValidationSuccess
} from './cn-validation.actions';

describe('CnValidationEffect Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: CnValidationEffect;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get', 'post', 'patch']
  );
  const initialState = {};
  let cnValidationService = jasmine.createSpyObj<CnValidationService>(
    'cnValidationService',
    [
      'getCnValidationList',
      'saveCnValidation',
      'updateCnValidation',
      'searchCnValidationByCnType',
      'getCnValidation',
      'getNewCnValidationByRuleId',
      'getCreditNoteType'
    ]
  );

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CnValidationEffect,
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
          provide: CnValidationService,
          useValue: {
            getCnValidationList: jasmine.createSpy(),
            saveCnValidation: jasmine.createSpy(),
            updateCnValidation: jasmine.createSpy(),
            searchCnValidationByCnType: jasmine.createSpy(),
            getCnValidation: jasmine.createSpy(),
            getNewCnValidationByRuleId: jasmine.createSpy(),
            getCreditNoteType: jasmine.createSpy()
          }
        }
      ]
    });

    effect = TestBed.inject(CnValidationEffect);
    cnValidationService = TestBed.inject<any>(CnValidationService);
  });

  const cnValidationList: CnValidationList = {
    cnValidationList: [
      {
        ruleId: '1',

        description: 'GEP',
        ruleDetails: {
          data: {},
          type: 'GEP'
        },
        isActive: true
      }
    ],
    totalElements: 1
  };

  const cnValidation: CnValidation = {
    ruleId: '1',

    description: 'GEP',
    ruleDetails: {
      data: {},
      type: 'GEP'
    },
    isActive: true
  };

  const listPayload: CnValidationListPayload = {
    pageIndex: 0,
    pageSize: 100,
    length: 0
  };

  const cnValidationResponse: CnValidationResponse = {
    ruleId: '1',
    description: 'string',
    ruleType: 'GEP',
    isCancellationAllowed: true,
    deductionRate: '30',
    criteriaRateForDeduction: '30',
    residentialValueAmount: '5000',
    isBrandWiseTransferAllowed: true,
    isBoutiqueWiseTransferAllowed: true,
    GHSUtilizationTransferPercent: '30',
    GHSMaxAmountTransfer: '2000',

    isActive: true
  };

  const cnTypeList = [
    {
      id: 'GEP',
      description: 'Gold Exchange Policy'
    }
  ];
  describe('cnValidationList', () => {
    it('should return a stream with CN Validation list', () => {
      const action = new LoadCnValidationList(listPayload);
      const outcome = new LoadCnValidationListSuccess(cnValidationList);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: cnValidationList });
      cnValidationService.getCnValidationList.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.cnValidationList$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadCnValidationList(listPayload);
      const error = new Error('some error');
      const outcome = new LoadCnValidationListFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      cnValidationService.getCnValidationList.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.cnValidationList$).toBeObservable(expected);
    });
  });

  describe('SaveCnValidation', () => {
    it('should return a stream with ibt config ', () => {
      const action = new SaveCnValidation(cnValidation);
      const outcome = new SaveCnValidationSuccess(cnValidationResponse);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: cnValidationResponse });
      cnValidationService.saveCnValidation.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.saveCnValidation$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new SaveCnValidation(cnValidationResponse);
      const error = new Error('some error');
      const outcome = new SaveCnValidationFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      cnValidationService.saveCnValidation.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.saveCnValidation$).toBeObservable(expected);
    });
  });

  describe('UpdateCnValidation', () => {
    it('should return a stream with updated ibt config', () => {
      const action = new UpdateCnValidation(cnValidation);
      const outcome = new UpdateCnValidationSuccess(cnValidationResponse);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: cnValidationResponse });
      cnValidationService.updateCnValidation.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.updateCnValidation$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new UpdateCnValidation(cnValidationResponse);
      const error = new Error('some error');
      const outcome = new UpdateCnValidationFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      cnValidationService.updateCnValidation.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.updateCnValidation$).toBeObservable(expected);
    });
  });

  describe('LoadCnValidationByRuleId', () => {
    it('should return a stream with  ibt config  object', () => {
      const payload = '1';

      const action = new LoadCnValidationByRuleId(payload, 'GEP');
      const outcome = new LoadCnValidationByRuleIdSuccess(cnValidationResponse);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: cnValidationResponse });
      cnValidationService.getCnValidation.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadCnValidationByRuleId$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload = 'GPAY';
      const action = new LoadCnValidationByRuleId(payload, 'GEP');
      const error = new Error('some error');
      const outcome = new LoadCnValidationByRuleIdFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      cnValidationService.getCnValidation.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadCnValidationByRuleId$).toBeObservable(expected);
    });
  });

  describe('SearchCnValidationByCnType', () => {
    it('should return a stream with searched ibt config', () => {
      const payload = '1';

      const action = new SearchCnValidationByCnType(payload);
      const outcome = new SearchCnValidationByCnTypeSuccess(cnValidationList);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: cnValidationList });
      cnValidationService.searchCnValidationByCnType.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.searchCnValidationByCnType$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters = 'tanishq';
      const action = new SearchCnValidationByCnType(parameters);
      const error = new Error('some error');
      const outcome = new SearchCnValidationByCnTypeFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      cnValidationService.searchCnValidationByCnType.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.searchCnValidationByCnType$).toBeObservable(expected);
    });
  });

  describe('LoadCnTypeList', () => {
    it('should return a stream with searched ibt config', () => {
      const action = new LoadCnTypeList();
      const outcome = new LoadCnTypeListSuccess(cnTypeList);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: cnTypeList });
      cnValidationService.getCreditNoteType.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadCnTypeList$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadCnTypeList();
      const error = new Error('some error');
      const outcome = new LoadCnTypeListFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      cnValidationService.getCreditNoteType.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadCnTypeList$).toBeObservable(expected);
    });
  });

  describe('LoadCnValidationByRuleId', () => {
    it('should return a stream with  ibt config  object', () => {
      const payload = '1';

      const action = new LoadCnValidationByRuleId(payload, 'GEP');
      const outcome = new LoadCnValidationByRuleIdSuccess(cnValidationResponse);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: cnValidationResponse });
      cnValidationService.getCnValidation.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadCnValidationByRuleId$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload = 'GPAY';
      const action = new LoadCnValidationByRuleId(payload, 'GEP');
      const error = new Error('some error');
      const outcome = new LoadCnValidationByRuleIdFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      cnValidationService.getCnValidation.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadCnValidationByRuleId$).toBeObservable(expected);
    });
  });

  //   describe('LoadNewCnValidationByRuleId', () => {
  //     it('should return a Cn Validation with ruleId New', () => {
  //       const action = new LoadNewCnValidationByRuleId();
  //       const outcome = new LoadCnValidationByRuleIdSuccess(cnValidationResponse);
  //       actions$ = hot('-a', { a: action });

  //       const response$ = cold('-a|', cnValidationResponse);
  //       cnValidationService.getNewCnValidationByRuleId.and.returnValue(response$);

  //       const expected = cold('--b', { b: outcome });
  //       expect(effect.loadNewCnValidationByRuleId$).toBeObservable(expected);
  //     });
  //   });
});
