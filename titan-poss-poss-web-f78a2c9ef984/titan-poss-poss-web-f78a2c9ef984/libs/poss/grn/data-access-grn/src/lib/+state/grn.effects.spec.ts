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
  GrnHistoryPayload,
  GrnHistoryResponse,
  GrnReqStatusListPayload,
  GrnReqStatusListResponse,
  GrnReqDetails,
  ConfirmGrnPayload,
  ConfirmGrnSuccessPayload
} from '@poss-web/shared/models';

import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { GrnEffect } from './grn.effects';
import { GrnService } from '../grn.service';

import {
  LoadGrnHistoryDetailsSuccess,
  LoadGrnHistoryDetails,
  LoadGrnHistoryDetailsFailure,
  LoadGrnReqStatusList,
  LoadGrnReqStatusListSuccess,
  LoadGrnReqStatusListFailure,
  FilterGrnReqStatusList,
  FilterGrnReqStatusListSuccess,
  SearchGrn,
  SearchGrnSuccess,
  SearchGrnFailure,
  LoadGrnDetailsByIdFailure,
  LoadGrnDetailsById,
  ConfirmGrn,
  ConfirmGrnSuccess,
  ConfirmGrnFailure,
  LoadGrnDetailsByIdSuccess,
  FilterGrnReqStatusListFailure
} from './grn.actions';
import {
  LovDataService,
  LocationDataService
} from '@poss-web/shared/masters/data-access-masters';

describe('GrnEffect Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: GrnEffect;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get', 'post', 'patch']
  );

  const lovDataService = jasmine.createSpyObj<LovDataService>([
    'getEnginePaymentLovs'
  ]);
  const locationDataService = jasmine.createSpyObj<LocationDataService>([
    'getLocationSummaryList'
  ]);
  const initialState = {};
  let grnService = jasmine.createSpyObj<GrnService>('GrnService', [
    'getGrnHistoryDetails',
    'getGrnReqStatusList',
    'searchGrn',
    'loadGrnDetailsById',
    'confirmGrn',
    'sendForApproval',
    'confirmWithoutApproval',
    'initiateGrn',
    'getGrnApprovers'
  ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GrnEffect,
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
          useValue: lovDataService
        },
        {
          provide: LocationDataService,
          useValue: locationDataService
        },
        {
          provide: GrnService,
          useValue: {
            getGrnHistoryDetails: jasmine.createSpy(),
            getGrnReqStatusList: jasmine.createSpy(),
            searchGrn: jasmine.createSpy(),
            loadGrnDetailsById: jasmine.createSpy(),
            confirmGrn: jasmine.createSpy(),
            sendForApproval: jasmine.createSpy(),
            confirmWithoutApproval: jasmine.createSpy(),
            initiateGrn: jasmine.createSpy(),
            getGrnApprovers: jasmine.createSpy()
          }
        }
      ]
    });

    effect = TestBed.inject(GrnEffect);
    grnService = TestBed.inject<any>(GrnService);
  });

  describe('loadGrnHistoryDetails', () => {
    it('should return a stream with GRN history list', () => {
      const payload: GrnHistoryPayload = {
        filterOptions: {
          fiscalYear: 2020
        }
      };
      const res: GrnHistoryResponse = {
        grnHistoryDetails: [],
        totalElements: 0
      };

      const action = new LoadGrnHistoryDetails(payload);
      const outcome = new LoadGrnHistoryDetailsSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      grnService.getGrnHistoryDetails.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadGrnHistoryDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: GrnHistoryPayload = {
        filterOptions: {
          fiscalYear: 2020
        }
      };

      const action = new LoadGrnHistoryDetails(payload);
      const error = new Error('some error');
      const outcome = new LoadGrnHistoryDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      grnService.getGrnHistoryDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadGrnHistoryDetails$).toBeObservable(expected);
    });
  });

  describe('loadGrnReqStatusList', () => {
    it('should return a stream with grn request list ', () => {
      const payload: GrnReqStatusListPayload = {
        filterOptions: {
          fiscalYear: '2020'
        },
        approvalStatus: 'APPROVED',
        workflowType: 'GOODS_RETURN'
      };

      const res: GrnReqStatusListResponse = {
        grnReqStatus: [],
        totalElement: 0
      };

      const action = new LoadGrnReqStatusList(payload);
      const outcome = new LoadGrnReqStatusListSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      grnService.getGrnReqStatusList.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadGrnReqStatusList$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: GrnReqStatusListPayload = {
        filterOptions: {
          fiscalYear: '2020'
        },
        approvalStatus: 'APPROVED',
        workflowType: 'GOODS_RETURN'
      };

      const action = new LoadGrnReqStatusList(payload);
      const error = new Error('some error');
      const outcome = new LoadGrnReqStatusListFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      grnService.getGrnReqStatusList.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadGrnReqStatusList$).toBeObservable(expected);
    });
  });

  describe('searchGrn', () => {
    it('should return a stream with grn request list ', () => {
      const payload: GrnReqStatusListPayload = {
        filterOptions: {
          fiscalYear: '2020'
        },
        approvalStatus: 'APPROVED',
        workflowType: 'GOODS_RETURN'
      };

      const res: GrnReqStatusListResponse = {
        grnReqStatus: [],
        totalElement: 0
      };

      const action = new SearchGrn(payload);
      const outcome = new SearchGrnSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      grnService.searchGrn.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.searchGrn$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: GrnReqStatusListPayload = {
        filterOptions: {
          fiscalYear: '2020'
        },
        approvalStatus: 'APPROVED',
        workflowType: 'GOODS_RETURN'
      };

      const action = new SearchGrn(payload);
      const error = new Error('some error');
      const outcome = new SearchGrnFailure(CustomErrorAdaptor.fromJson(error));
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      grnService.searchGrn.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.searchGrn$).toBeObservable(expected);
    });
  });

  describe('filterGrnReqStatusList', () => {
    it('should return a stream with grn request list ', () => {
      const payload: GrnReqStatusListPayload = {
        filterOptions: {
          fiscalYear: '2020'
        },
        approvalStatus: 'APPROVED',
        workflowType: 'GOODS_RETURN'
      };

      const res: GrnReqStatusListResponse = {
        grnReqStatus: [],
        totalElement: 0
      };

      const action = new FilterGrnReqStatusList(payload);
      const outcome = new FilterGrnReqStatusListSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      grnService.getGrnReqStatusList.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.filterGrnReqStatusList$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: GrnReqStatusListPayload = {
        filterOptions: {
          fiscalYear: '2020'
        },
        approvalStatus: 'APPROVED',
        workflowType: 'GOODS_RETURN'
      };

      const action = new FilterGrnReqStatusList(payload);
      const error = new Error('some error');
      const outcome = new FilterGrnReqStatusListFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      grnService.getGrnReqStatusList.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.filterGrnReqStatusList$).toBeObservable(expected);
    });
  });

  describe('loadGrnDetailsById', () => {
    it('should return a stream with grn details ', () => {
      const payload = '1';
      const res: GrnReqDetails = {
        txnType: 'GRN',
        subTxnType: 'CM',
        boutiqueCode: 'URB',
        boutiqueName: 'BANGLORE',
        fiscalYear: '2020',
        cmNumber: '100',
        cmDate: '12',
        invoicedGoldRate: '1',
        invoicedPlatinumRate: '2',
        productDetails: [],
        cmNetAmount: '22',
        otherCharges: '11',
        encirclePoints: '3',
        tcsTobeRefund: '100',
        focRecoveredValue: '222',
        grnType: 'MFG',
        reasonForCancellation: 'DONT WANT',
        approver: 'SM',
        reason: 'QUALITY ISSUE',
        time: '1',
        status: 'PENDING',
        totalReturnProduct: '1',
        totalReturnGrn: '1000',
        customerId: '1'
      };

      const action = new LoadGrnDetailsById(payload);
      const outcome = new LoadGrnDetailsByIdSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      grnService.loadGrnDetailsById.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadGrnDetailsById$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload = '1';

      const action = new LoadGrnDetailsById(payload);
      const error = new Error('some error');
      const outcome = new LoadGrnDetailsByIdFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      grnService.loadGrnDetailsById.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadGrnDetailsById$).toBeObservable(expected);
    });
  });

  describe('confirmGrn', () => {
    it('should return a stream with confimed grn doc numbers ', () => {
      const payload: ConfirmGrnPayload = {
        data: {
          customerId: '1',
          remarks: 'remarks'
        },
        txnType: 'GRN',
        subTxnType: 'CM',
        grnId: '1'
      };
      const res: ConfirmGrnSuccessPayload = {
        cnAmt: 1000,
        cndocNos: [1],
        docNo: 1,
        loyaltyReversalPoint: 1,
        id: '55'
      };
      const action = new ConfirmGrn(payload);
      const outcome = new ConfirmGrnSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      grnService.confirmGrn.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.confirmGrn$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: ConfirmGrnPayload = {
        data: {
          customerId: '1',
          remarks: 'remarks'
        },
        txnType: 'GRN',
        subTxnType: 'CM',
        grnId: '1'
      };
      const action = new ConfirmGrn(payload);
      const error = new Error('some error');
      const outcome = new ConfirmGrnFailure(CustomErrorAdaptor.fromJson(error));
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      grnService.confirmGrn.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.confirmGrn$).toBeObservable(expected);
    });
  });
});
