import { TestBed } from '@angular/core/testing';
import { DataPersistence } from '@nrwl/angular';
import { Observable } from 'rxjs';
import { CnMasterService } from '../cn-master.service';
import { CreditNoteMasterEffect } from './cn-master.effect';
import { creditNoteMasterFeatureKey } from './cn-master.reducer';
import { initialState } from './cn-master.reducer';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { CnMasterListResponse, PaginatePayload } from '@poss-web/shared/models';
import * as moment from 'moment';
import {
  LoadCreditNoteMasterDetailByCNType,
  LoadCreditNoteMasterDetailByCNTypeFailure,
  LoadCreditNoteMasterDetailByCNTypeSuccess,
  LoadCreditNoteMasterList,
  LoadCreditNoteMasterListFailure,
  LoadCreditNoteMasterListSuccess,
  SearchCreditNoteMasterList,
  SearchCreditNoteMasterListFailure,
  SearchCreditNoteMasterListSuccess,
  UpdateCreditNoteMasterDetail,
  UpdateCreditNoteMasterDetailFailure,
  UpdateCreditNoteMasterDetailSuccess
} from './cn-master.actions';
import { hot, cold } from 'jasmine-marbles';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

describe('Credit Note MasterEffect Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: CreditNoteMasterEffect;

  const cnServiceSpy = jasmine.createSpyObj<CnMasterService>([
    'getCnMasterList',
    'searchCnMasterByCnType',
    'getCnMasterDetailByCnType',
    'updateCnMasterDetail'
  ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CreditNoteMasterEffect,
        DataPersistence,
        provideMockStore({
          initialState: {
            [creditNoteMasterFeatureKey]: initialState
          }
        }),
        provideMockActions(() => actions$),

        {
          provide: CnMasterService,
          useValue: cnServiceSpy
        }
      ]
    });

    effect = TestBed.inject(CreditNoteMasterEffect);
  });

  describe('getCnMasterList', () => {
    it('should return a LoadCreditNoteMasterList', () => {
      const cnMasterListResponse: CnMasterListResponse = {
        cnMasterList: [
          {
            creditNoteType: 'Advance',
            description: 'advance booking description',
            isActive: true,
            IsAllowedForGHSGrammageAccount: false,
            IsAllowedforEghs: false
          },
          {
            creditNoteType: 'BillCancellation',
            description: 'BillCancellation',
            isActive: true,
            IsAllowedForGHSGrammageAccount: false,
            IsAllowedforEghs: false
          },
          {
            creditNoteType: 'CNIntBTQ',
            description: 'InterBoutique CN',
            isActive: true,
            IsAllowedForGHSGrammageAccount: false,
            IsAllowedforEghs: false
          }
        ],
        totalElements: 3
      };

      const payload: PaginatePayload = {
        pageIndex: 0,
        pageSize: 10
      };

      const action = new LoadCreditNoteMasterList(payload);
      const outcome = new LoadCreditNoteMasterListSuccess(cnMasterListResponse);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: cnMasterListResponse });
      cnServiceSpy.getCnMasterList.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.loadCreditNoteMasterList$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: PaginatePayload = {
        pageIndex: 0,
        pageSize: 10
      };

      const action = new LoadCreditNoteMasterList(payload);
      const error = new Error('some error');
      const outcome = new LoadCreditNoteMasterListFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      cnServiceSpy.getCnMasterList.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadCreditNoteMasterList$).toBeObservable(expected);
    });
  });

  describe('SearchCreditNoteMasterList', () => {
    it('should return a Credit Note Master List By CN Type', () => {
      const cnMasterListResponse: CnMasterListResponse = {
        cnMasterList: [
          {
            creditNoteType: 'Advance',
            description: 'advance booking description',
            isActive: true,
            IsAllowedForGHSGrammageAccount: false,
            IsAllowedforEghs: false
          },
          {
            creditNoteType: 'BillCancellation',
            description: 'BillCancellation',
            isActive: true,
            IsAllowedForGHSGrammageAccount: false,
            IsAllowedforEghs: false
          },
          {
            creditNoteType: 'CNIntBTQ',
            description: 'InterBoutique CN',
            isActive: true,
            IsAllowedForGHSGrammageAccount: false,
            IsAllowedforEghs: false
          }
        ],
        totalElements: 3
      };
      const payload = 'GEP';

      const action = new SearchCreditNoteMasterList(payload);
      const outcome = new SearchCreditNoteMasterListSuccess(
        cnMasterListResponse
      );
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: cnMasterListResponse });
      cnServiceSpy.searchCnMasterByCnType.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.searchCreditNoteMasterList$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload = '';

      const action = new SearchCreditNoteMasterList(payload);
      const error = new Error('some error');
      const outcome = new SearchCreditNoteMasterListFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      cnServiceSpy.searchCnMasterByCnType.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.searchCreditNoteMasterList$).toBeObservable(expected);
    });
  });

  describe('LoadCreditNoteMasterDetailByCNType', () => {
    it('should return a Credit Note Master Detail By CN Type', () => {
      const cnMasterDetailResponse = {
        creditNoteType: 'GEP',
        description: 'GEP',
        isActive: true,
        IsAllowedForGHSGrammageAccount: false,
        IsAllowedforEghs: false
      };
      const payload = 'GEP';

      const action = new LoadCreditNoteMasterDetailByCNType(payload);
      const outcome = new LoadCreditNoteMasterDetailByCNTypeSuccess(
        cnMasterDetailResponse
      );
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: cnMasterDetailResponse });
      cnServiceSpy.getCnMasterDetailByCnType.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.loadCreditNoteMasterDetailByCnType$).toBeObservable(
        expected$
      );
    });

    it('should fail and return an action with the error', () => {
      const payload = '';

      const action = new LoadCreditNoteMasterDetailByCNType(payload);
      const error = new Error('some error');
      const outcome = new LoadCreditNoteMasterDetailByCNTypeFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      cnServiceSpy.getCnMasterDetailByCnType.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadCreditNoteMasterDetailByCnType$).toBeObservable(
        expected
      );
    });
  });

  describe('UpdateCreditNoteMasterDetail', () => {
    it('should update Credit Note Master Detail', () => {
      const cnMasterDetailResponse = {
        creditNoteType: 'GEP',
        description: 'GEP',
        isActive: true,
        IsAllowedForGHSGrammageAccount: false,
        IsAllowedforEghs: false
      };
      const payload = {
        cnType: 'GEP',
        cnDetail: {
          creditNoteType: 'BillCancellation',
          description: 'BillCancellation',
          configDetails: {
            data: {
              IsAllowedForGHSGrammageAccount: true,
              IsAllowedforEghs: true
            }
          },
          isActive: true
        }
      };

      const action = new UpdateCreditNoteMasterDetail(payload);
      const outcome = new UpdateCreditNoteMasterDetailSuccess(
        cnMasterDetailResponse
      );
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: cnMasterDetailResponse });
      cnServiceSpy.updateCnMasterDetail.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.updateCreditNoteMasterDetail$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload = {
        cnType: 'GEP',
        cnDetail: {
          creditNoteType: 'BillCancellation',
          description: 'BillCancellation',
          configDetails: {
            data: {
              IsAllowedForGHSGrammageAccount: true,
              IsAllowedforEghs: true
            }
          },
          isActive: true
        }
      };

      const action = new UpdateCreditNoteMasterDetail(payload);
      const error = new Error('some error');
      const outcome = new UpdateCreditNoteMasterDetailFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      cnServiceSpy.updateCnMasterDetail.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.updateCreditNoteMasterDetail$).toBeObservable(expected);
    });
  });
});
