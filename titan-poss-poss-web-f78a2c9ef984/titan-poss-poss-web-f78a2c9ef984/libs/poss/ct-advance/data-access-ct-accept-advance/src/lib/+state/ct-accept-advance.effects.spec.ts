import { Observable } from 'rxjs';
import { hot, cold } from 'jasmine-marbles';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { HttpClient } from '@angular/common/http';
import { DataPersistence } from '@nrwl/angular';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { CtAcceptAdvanceEffects } from './ct-accept-advance.effects';
import { CtAcceptAdvanceService } from '../ct-accept-advance.service';
import { StoreUserDataService } from '@poss-web/shared/masters/data-access-masters';
import {
  InitiateAdvance,
  InitiateAdvancesFailure,
  InitiateAdvancesSuccess,
  LoadRSODetails,
  LoadRSODetailsFailure,
  LoadRSODetailsSuccess,
  PartiallyUpdateAdvance,
  PartiallyUpdateAdvanceFailure,
  PartiallyUpdateAdvanceSuccess,
  UpdateAdvance,
  UpdateAdvanceFailure,
  UpdateAdvanceSuccess
} from './ct-accept-advance.actions';
import {
  InitiateAdvanceResponse,
  PartialUpdateAdvanceRequestPayload,
  UpdateAdvanceRequestPayload,
  UpdateAdvanceTransactionResponse
} from '@poss-web/shared/models';

describe('Gift Cards Effects Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: CtAcceptAdvanceEffects;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get', 'post', 'patch']
  );
  const initialState = {};
  const ctAcceptAdvanceServiceSpy = jasmine.createSpyObj<
    CtAcceptAdvanceService
  >('CtAcceptAdvanceService', [
    'initiateAdvanceTransaction',
    'updateAdvanceTransaction',
    'partiallyUpdateAdvanceTransaction'
  ]);
  const storeUserDataServiceSpy = jasmine.createSpyObj<StoreUserDataService>(
    'storeUserDataService',
    ['getStoreUsers']
  );
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CtAcceptAdvanceEffects,
        DataPersistence,
        provideMockStore({ initialState }),
        provideMockActions(() => actions$),
        {
          provide: HttpClient,
          useValue: httpClientSpy
        },
        {
          provide: CtAcceptAdvanceService,
          useValue: ctAcceptAdvanceServiceSpy
        },
        {
          provide: StoreUserDataService,
          useValue: storeUserDataServiceSpy
        }
      ]
    });
    effect = TestBed.inject(CtAcceptAdvanceEffects);
  });

  describe('loadRSODetails', () => {
    it('should Load RSO Details', () => {
      const rsoDetailsResponse = [
        {
          employeeCode: 'rso.urb.2',
          empName: 'rso.urb.2'
        }
      ];
      const action = new LoadRSODetails('RSO');
      const outCome = new LoadRSODetailsSuccess([
        {
          value: 'rso.urb.2',
          description: 'rso.urb.2'
        }
      ]);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: rsoDetailsResponse });
      storeUserDataServiceSpy.getStoreUsers.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.loadRSODetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadRSODetails('RSO');
      const error = new Error('some error');
      const outCome = new LoadRSODetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      storeUserDataServiceSpy.getStoreUsers.and.returnValue(response$);
      const expected = cold('--b', { b: outCome });
      expect(effect.loadRSODetails$).toBeObservable(expected);
    });
  });

  describe('initiateAdvance effects', () => {
    it('should initiate Advance and create open state', () => {
      const initiateAdvanceResponse: InitiateAdvanceResponse = {
        docNo: 0,
        id: '',
        status: '',
        subTxnType: '',
        txnType: ''
      };
      const action = new InitiateAdvance();
      const outCome = new InitiateAdvancesSuccess(initiateAdvanceResponse);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: initiateAdvanceResponse });
      ctAcceptAdvanceServiceSpy.initiateAdvanceTransaction.and.returnValue(
        response$
      );
      const expected$ = cold('--b', { b: outCome });
      expect(effect.initiateAdvance$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new InitiateAdvance();
      const error = new Error('some error');
      const outCome = new InitiateAdvancesFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      ctAcceptAdvanceServiceSpy.initiateAdvanceTransaction.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outCome });
      expect(effect.initiateAdvance$).toBeObservable(expected);
    });
  });

  describe('updateAdvance effects', () => {
    it('should update Advance', () => {
      const updateAdvanceResponse: UpdateAdvanceTransactionResponse = {
        cndocNos: [],
        docNo: 0,
        id: ''
      };
      const updateAdvanceRequestPayload: UpdateAdvanceRequestPayload = {
        customerId: 0,
        paidValue: 10000,
        remarks: 'sdsfsf',
        weightAgreed: 2.5
      };
      const action = new UpdateAdvance('', updateAdvanceRequestPayload);
      const outCome = new UpdateAdvanceSuccess(updateAdvanceResponse);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: updateAdvanceResponse });
      ctAcceptAdvanceServiceSpy.updateAdvanceTransaction.and.returnValue(
        response$
      );
      const expected$ = cold('--b', { b: outCome });
      expect(effect.updateAdvance$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const updateAdvanceResponse: UpdateAdvanceTransactionResponse = {
        cndocNos: [],
        docNo: 0,
        id: ''
      };
      const updateAdvanceRequestPayload: UpdateAdvanceRequestPayload = {
        customerId: 0,
        paidValue: 10000,
        remarks: 'sdsfsf',
        weightAgreed: 2.5
      };
      const action = new UpdateAdvance('', updateAdvanceRequestPayload);
      const error = new Error('some error');
      const outCome = new UpdateAdvanceFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      ctAcceptAdvanceServiceSpy.updateAdvanceTransaction.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outCome });
      expect(effect.updateAdvance$).toBeObservable(expected);
    });
  });

  describe('partiallyUpdateAdvance effects', () => {
    it('should partially update Advance', () => {
      const partiallyUpdateAdvanceRequestPayload: PartialUpdateAdvanceRequestPayload = {
        customerId: 0
      };
      const action = new PartiallyUpdateAdvance(
        '',
        partiallyUpdateAdvanceRequestPayload
      );
      const outCome = new PartiallyUpdateAdvanceSuccess(
        new Date().toLocaleTimeString()
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: {} });
      ctAcceptAdvanceServiceSpy.partiallyUpdateAdvanceTransaction.and.returnValue(
        response$
      );
      const expected$ = cold('--b', { b: outCome });
      expect(effect.partiallyUpdateAdvance$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const partiallyUpdateAdvanceRequestPayload: PartialUpdateAdvanceRequestPayload = {
        customerId: 0
      };
      const action = new PartiallyUpdateAdvance(
        '',
        partiallyUpdateAdvanceRequestPayload
      );
      const error = new Error('some error');
      const outCome = new PartiallyUpdateAdvanceFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      ctAcceptAdvanceServiceSpy.partiallyUpdateAdvanceTransaction.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outCome });
      expect(effect.partiallyUpdateAdvance$).toBeObservable(expected);
    });
  });
});
