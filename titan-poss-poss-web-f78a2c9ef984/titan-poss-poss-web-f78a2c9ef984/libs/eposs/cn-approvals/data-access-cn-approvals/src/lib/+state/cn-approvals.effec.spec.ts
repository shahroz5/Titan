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
  CnApprovalListRequest,
  CnApprovalListResponse,
  SaveCnApproval
} from '@poss-web/shared/models';

import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { CnApprovalsService } from '../cn-approvals.service';

import { CnApprovalEffect } from './cn-approvals.effect';
import {
  LoadCnApprovalsList,
  LoadCnApprovalsListSuccess,
  LoadCnApprovalsListFailure,
  SaveCnApprovalStatus,
  SaveCnApprovalStatusFailure,
  SaveCnApprovalStatusSuccess
} from './cn-approvals.action';

describe('CnApprovalEffect Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: CnApprovalEffect;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get', 'post', 'patch']
  );
  const initialState = {};
  let cnApprovalsService = jasmine.createSpyObj<CnApprovalsService>(
    'CnApprovalsService',
    ['loadCnApprovalList', 'saveCnApprovalStatus']
  );

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CnApprovalEffect,
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
          provide: CnApprovalsService,
          useValue: {
            loadCnApprovalList: jasmine.createSpy(),
            saveCnApprovalStatus: jasmine.createSpy()
          }
        }
      ]
    });

    effect = TestBed.inject(CnApprovalEffect);
    cnApprovalsService = TestBed.inject<any>(CnApprovalsService);
  });

  describe('loadCnApprovalsList', () => {
    it('should return a stream with cn request list', () => {
      const payload: CnApprovalListRequest = {
        approvalStatus: 'PENDING',
        filterOptions: {
          fiscalYear: 2020,
          dateRangeType: 'CUSTOM'
        },
        workflowType: 'CREDIT_NOTE_ACTIVATE',
        pageIndex: 0,
        pageSize: 10
      };

      const res: CnApprovalListResponse[] = [
        {
          locationCode: 'CPD',
          cnNumber: '1',
          fiscalYear: '2020',
          cnType: 'ACTIVATE',
          cnDate: '21/06/2021',
          customerName: 'ABC',
          customerMobileNumber: '8976542378',
          amount: '1000',
          requestedBy: 'CPD',
          requestedType: 'ACTIVATE',
          suspendedDate: '20/06/2021',
          requestorRemarks: 11,
          remarks: 'OK',
          processId: '22',
          taskId: '33',
          taskName: 'TEST',
          totalElements: 10
        }
      ];

      const action = new LoadCnApprovalsList(payload);
      const outcome = new LoadCnApprovalsListSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      cnApprovalsService.loadCnApprovalList.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadCnApprovalsList$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: CnApprovalListRequest = {
        approvalStatus: 'PENDING',
        filterOptions: {
          fiscalYear: 2020,
          dateRangeType: 'CUSTOM'
        },
        workflowType: 'CREDIT_NOTE_ACTIVATE',
        pageIndex: 0,
        pageSize: 10
      };

      const action = new LoadCnApprovalsList(payload);
      const error = new Error('some error');
      const outcome = new LoadCnApprovalsListFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      cnApprovalsService.loadCnApprovalList.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadCnApprovalsList$).toBeObservable(expected);
    });
  });

  describe('saveCnApprovalStatus', () => {
    it('should return a stream with  saved ids', () => {
      const payload: SaveCnApproval = {
        bulkApproverRequestObjectDto: [
          {
            approvedData: {
              data: 'ok',
              type: 'string'
            },
            approved: true,
            approverRemarks: 'test',
            processId: '11',
            taskId: '22',
            taskName: 'ABc'
          }
        ]
      };

      const res = ['1', '2'];
      const action = new SaveCnApprovalStatus(payload);
      const outcome = new SaveCnApprovalStatusSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      cnApprovalsService.saveCnApprovalStatus.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.saveCnApprovals$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: SaveCnApproval = {
        bulkApproverRequestObjectDto: [
          {
            approvedData: {
              data: 'ok',
              type: 'string'
            },
            approved: true,
            approverRemarks: 'test',
            processId: '11',
            taskId: '22',
            taskName: 'ABc'
          }
        ]
      };

      const action = new SaveCnApprovalStatus(payload);
      const error = new Error('some error');
      const outcome = new SaveCnApprovalStatusFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      cnApprovalsService.saveCnApprovalStatus.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.saveCnApprovals$).toBeObservable(expected);
    });
  });
});
