import { Observable } from 'rxjs';
import { hot, cold } from 'jasmine-marbles';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { HttpClient } from '@angular/common/http';
import { DataPersistence } from '@nrwl/angular';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { CtGrfEffects } from './grf.effects';
import { CtGrfService } from '../grf.service';
import { StoreUserDataService } from '@poss-web/shared/masters/data-access-masters';
import {
  GenerateOTP,
  GenerateOTPFailure,
  GenerateOTPSuccess,
  InitiateGrf,
  InitiateGrfFailure,
  InitiateGrfSuccess,
  LoadFrozenCNs,
  LoadFrozenCNsFailure,
  LoadFrozenCNsSuccess,
  LoadRsoDetails,
  LoadRsoDetailsFailure,
  LoadRsoDetailsSuccess,
  MergeCNs,
  MergeCNsFailure,
  MergeCNsSuccess,
  PartiallyUpdateGrf,
  PartiallyUpdateGrfFailure,
  PartiallyUpdateGrfSuccess,
  SearchGRF,
  SearchGRFFailure,
  SearchGRFSuccess,
  UpdateGrf,
  UpdateGrfFailure,
  UpdateGrfSuccess,
  ValidateOTP,
  ValidateOTPFailure,
  ValidateOTPSuccess
} from './grf.actions';
import {
  CreditNote,
  FrozenCNs,
  InitiateGrfResponse,
  MergeCNPayload,
  MergeCNResponse,
  PartialUpdateGrfRequestPayload,
  UpdateGrfRequestPayload,
  UpdateGrfTransactionResponse
} from '@poss-web/shared/models';
import * as moment from 'moment';

describe('Gift Cards Effects Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: CtGrfEffects;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get', 'post', 'patch']
  );
  const initialState = {};
  const ctGrfServiceSpy = jasmine.createSpyObj<CtGrfService>('CtGrfService', [
    'initiateGrfTransaction',
    'updateGrfTransaction',
    'partiallyUpdateGrfTransaction',
    'loadFrozenCNs',
    'searchGRF',
    'mergeCNs',
    'generateOTP',
    'validateOTP'
  ]);
  const storeUserDataServiceSpy = jasmine.createSpyObj<StoreUserDataService>(
    'storeUserDataService',
    ['getStoreUsers']
  );
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CtGrfEffects,
        DataPersistence,
        provideMockStore({ initialState }),
        provideMockActions(() => actions$),
        {
          provide: HttpClient,
          useValue: httpClientSpy
        },
        {
          provide: CtGrfService,
          useValue: ctGrfServiceSpy
        },
        {
          provide: StoreUserDataService,
          useValue: storeUserDataServiceSpy
        }
      ]
    });
    effect = TestBed.inject(CtGrfEffects);
  });

  describe('loadRSODetails', () => {
    it('should Load RSO Details', () => {
      const rsoDetailsResponse = [
        {
          employeeCode: 'rso.urb.2',
          empName: 'rso.urb.2'
        }
      ];
      const action = new LoadRsoDetails('RSO');
      const outCome = new LoadRsoDetailsSuccess([
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
      const action = new LoadRsoDetails('RSO');
      const error = new Error('some error');
      const outCome = new LoadRsoDetailsFailure(
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
      const initiateGrfResponse: InitiateGrfResponse = {
        docNo: 0,
        id: '',
        status: '',
        subTxnType: '',
        txnType: ''
      };
      const action = new InitiateGrf('NEW_GRF', null);
      const outCome = new InitiateGrfSuccess(initiateGrfResponse);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: initiateGrfResponse });
      ctGrfServiceSpy.initiateGrfTransaction.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.initiateGrf$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new InitiateGrf('NEW_GRF', null);
      const error = new Error('some error');
      const outCome = new InitiateGrfFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      ctGrfServiceSpy.initiateGrfTransaction.and.returnValue(response$);
      const expected = cold('--b', { b: outCome });
      expect(effect.initiateGrf$).toBeObservable(expected);
    });
  });

  describe('updateGrf effects', () => {
    it('should update Grf', () => {
      const updateAdvanceResponse: UpdateGrfTransactionResponse = {
        cndocNos: [],
        docNo: 0,
        id: ''
      };
      const updateGrfRequestPayload: UpdateGrfRequestPayload = {
        customerId: 0,
        paidValue: 10000,
        remarks: 'sdsfsf',
        metalRateList: {
          metalRates: {
            J: {
              metalTypeCode: 'J',
              purity: 92,
              ratePerUnit: 1540,
              applicableDate: Number(new Date().toTimeString()),
              currency: 'INR'
            }
          }
        },
        weightAgreed: 2.5
      };
      const action = new UpdateGrf('NEW_GRF', '', updateGrfRequestPayload);
      const outCome = new UpdateGrfSuccess(updateAdvanceResponse);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: updateAdvanceResponse });
      ctGrfServiceSpy.updateGrfTransaction.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.updateGrf$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const updateGrfResponse: UpdateGrfTransactionResponse = {
        cndocNos: [],
        docNo: 0,
        id: ''
      };
      const updateGrfRequestPayload: UpdateGrfRequestPayload = {
        customerId: 0,
        paidValue: 10000,
        remarks: 'sdsfsf',
        metalRateList: {
          metalRates: {
            J: {
              metalTypeCode: 'J',
              purity: 92,
              ratePerUnit: 1540,
              applicableDate: Number(new Date().toTimeString()),
              currency: 'INR'
            }
          }
        },
        weightAgreed: 2.5
      };
      const action = new UpdateGrf('NEW_GRF', '', updateGrfRequestPayload);
      const error = new Error('some error');
      const outCome = new UpdateGrfFailure(CustomErrorAdaptor.fromJson(error));
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      ctGrfServiceSpy.updateGrfTransaction.and.returnValue(response$);
      const expected = cold('--b', { b: outCome });
      expect(effect.updateGrf$).toBeObservable(expected);
    });
  });

  describe('partiallyUpdateGrf effects', () => {
    it('should partially update Grf', () => {
      const partiallyUpdateGrfRequestPayload: PartialUpdateGrfRequestPayload = {
        customerId: 0
      };
      const action = new PartiallyUpdateGrf(
        'NEW_GRF',
        '',
        partiallyUpdateGrfRequestPayload
      );
      const outCome = new PartiallyUpdateGrfSuccess(
        new Date().toLocaleTimeString()
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: {} });
      ctGrfServiceSpy.partiallyUpdateGrfTransaction.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.partiallyUpdateGrf$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const partiallyUpdateGrfRequestPayload: PartialUpdateGrfRequestPayload = {
        customerId: 0
      };
      const action = new PartiallyUpdateGrf(
        'NEW_GRF',
        '',
        partiallyUpdateGrfRequestPayload
      );
      const error = new Error('some error');
      const outCome = new PartiallyUpdateGrfFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      ctGrfServiceSpy.partiallyUpdateGrfTransaction.and.returnValue(response$);
      const expected = cold('--b', { b: outCome });
      expect(effect.partiallyUpdateGrf$).toBeObservable(expected);
    });
  });

  describe('Merging CNs Testing Suite', () => {
    describe('loadFrozenCNs', () => {
      it('should return a stream with loadFrozenCNs', () => {
        const response: FrozenCNs[] = [
          {
            docNo: '12',
            fiscalYear: '2020',
            cnDocNo: '12',
            cnFiscalYear: '2021'
          }
        ];
        const action = new LoadFrozenCNs('abc123');
        const outcome = new LoadFrozenCNsSuccess(response);
        actions$ = hot('-a', { a: action });

        const response$ = cold('-a|', { a: response });
        ctGrfServiceSpy.loadFrozenCNs.and.returnValue(response$);

        const expected$ = cold('--b', { b: outcome });
        expect(effect.loadFrozenCNs$).toBeObservable(expected$);
      });
      it('should fail and return an action with the error', () => {
        const action = new LoadFrozenCNs('abc123');
        const error = new Error('some error');
        const outcome = new LoadFrozenCNsFailure(
          CustomErrorAdaptor.fromJson(error)
        );
        actions$ = hot('-a', { a: action });
        const response$ = cold('-#|', {}, error);
        ctGrfServiceSpy.loadFrozenCNs.and.returnValue(response$);
        const expected = cold('--b', { b: outcome });
        expect(effect.loadFrozenCNs$).toBeObservable(expected);
      });
    });

    describe('searchGRF', () => {
      it('should return a stream with searchGRF', () => {
        const response: FrozenCNs[] = [
          {
            docNo: '12',
            fiscalYear: '2020',
            cnDocNo: '12',
            cnFiscalYear: '2021'
          }
        ];
        const creditNoteResponse: CreditNote = {
          amount: 123,
          creditNoteType: 'CN',
          customerId: 12,
          customerName: 'Rama',
          docDate: moment('123'),
          docNo: 12,
          fiscalYear: 2021,
          ratePerUnit: 12,
          weight: 12,
          id: 'abc123',
          linkedTxnId: 'abc123',
          linkedTxnType: 'abc456',
          locationCode: 'CPD',
          mobileNumber: '9010462817',
          status: 'OPEN',
          utilisedAmount: 100,
          workflowStatus: 'OPEN',
          cashCollected: 123
        };
        const action = new SearchGRF({ docNo: 'abc123', fiscalYear: '2020' });
        const outcome = new SearchGRFSuccess(creditNoteResponse);
        actions$ = hot('-a', { a: action });

        const response$ = cold('-a|', { a: creditNoteResponse });
        ctGrfServiceSpy.searchGRF.and.returnValue(response$);

        const expected$ = cold('--b', { b: outcome });
        expect(effect.searchGRF$).toBeObservable(expected$);
      });
      it('should fail and return an action with the error', () => {
        const action = new SearchGRF({ docNo: 'abc123', fiscalYear: '2020' });
        const error = new Error('some error');
        const outcome = new SearchGRFFailure(
          CustomErrorAdaptor.fromJson(error)
        );
        actions$ = hot('-a', { a: action });
        const response$ = cold('-#|', {}, error);
        ctGrfServiceSpy.searchGRF.and.returnValue(response$);
        const expected = cold('--b', { b: outcome });
        expect(effect.searchGRF$).toBeObservable(expected);
      });
    });

    describe('mergeCNs', () => {
      const mergeCNPayload: MergeCNPayload = {
        tempFileIds: { others: ['abc123'] },
        customerId: '12',
        employeeCode: 'URB',
        ids: ['12'],
        remarks: 'abc'
      };
      it('should return a stream with MergeCNs', () => {
        const response: MergeCNResponse = {
          amount: 123,
          cnDocNo: 12,
          docNo: 2021,
          id: 'abc123'
        };
        const action = new MergeCNs(mergeCNPayload);
        const outcome = new MergeCNsSuccess(response);
        actions$ = hot('-a', { a: action });

        const response$ = cold('-a|', { a: response });
        ctGrfServiceSpy.mergeCNs.and.returnValue(response$);

        const expected$ = cold('--b', { b: outcome });
        expect(effect.mergeCNs$).toBeObservable(expected$);
      });
      it('should fail and return an action with the error', () => {
        const action = new MergeCNs(mergeCNPayload);
        const error = new Error('some error');
        const outcome = new MergeCNsFailure(CustomErrorAdaptor.fromJson(error));
        actions$ = hot('-a', { a: action });
        const response$ = cold('-#|', {}, error);
        ctGrfServiceSpy.mergeCNs.and.returnValue(response$);
        const expected = cold('--b', { b: outcome });
        expect(effect.mergeCNs$).toBeObservable(expected);
      });
    });

    describe('generateOTP', () => {
      it('should return a stream with generateOTP', () => {
        const action = new GenerateOTP('12');
        const outcome = new GenerateOTPSuccess();
        actions$ = hot('-a', { a: action });

        const response$ = cold('-a|', { a: null });
        ctGrfServiceSpy.generateOTP.and.returnValue(response$);

        const expected$ = cold('--b', { b: outcome });
        expect(effect.generateOTP$).toBeObservable(expected$);
      });
      it('should fail and return an action with the error', () => {
        const action = new GenerateOTP('12');
        const error = new Error('some error');
        const outcome = new GenerateOTPFailure(
          CustomErrorAdaptor.fromJson(error)
        );
        actions$ = hot('-a', { a: action });
        const response$ = cold('-#|', {}, error);
        ctGrfServiceSpy.generateOTP.and.returnValue(response$);
        const expected = cold('--b', { b: outcome });
        expect(effect.generateOTP$).toBeObservable(expected);
      });
    });

    describe('validateOTP', () => {
      it('should return a stream with validateOTP', () => {
        const action = new ValidateOTP({ token: 'abc123', id: 'abc123' });
        const outcome = new ValidateOTPSuccess();
        actions$ = hot('-a', { a: action });

        const response$ = cold('-a|', { a: null });
        ctGrfServiceSpy.validateOTP.and.returnValue(response$);

        const expected$ = cold('--b', { b: outcome });
        expect(effect.validateOTP$).toBeObservable(expected$);
      });
      it('should fail and return an action with the error', () => {
        const action = new ValidateOTP({ token: 'abc123', id: 'abc123' });
        const error = new Error('some error');
        const outcome = new ValidateOTPFailure(
          CustomErrorAdaptor.fromJson(error)
        );
        actions$ = hot('-a', { a: action });
        const response$ = cold('-#|', {}, error);
        ctGrfServiceSpy.validateOTP.and.returnValue(response$);
        const expected = cold('--b', { b: outcome });
        expect(effect.validateOTP$).toBeObservable(expected);
      });
    });
  });
});
