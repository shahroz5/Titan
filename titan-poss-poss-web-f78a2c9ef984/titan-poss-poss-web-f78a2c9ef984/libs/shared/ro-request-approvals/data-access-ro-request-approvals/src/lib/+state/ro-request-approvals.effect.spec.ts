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
  RoRequestApprovalListRequest,
  RoRequestApprovalListResponse,
  BoutiqueRoRequestApprovalListResponse,
  SaveRoRequestApproval
} from '@poss-web/shared/models';

import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { RoRequestApporvalEffect } from './ro-request-approvals.effect';
import { RoRequestApprovalService } from '../ro-request-approval.service';

import {
  LoadPendingRoRequestApprovalList,
  LoadPendingRoRequestApprovalListSuccess,
  LoadPendingRoRequestApprovalListFailure,
  LoadRejectedRoRequestApprovalListSuccess,
  LoadRejectedRoRequestApprovalListFailure,
  LoadRejectedRoRequestApprovalList,
  LoadRoRequestApprovalListSuccess,
  LoadRoRequestApprovalListFailure,
  LoadRoRequestApprovalList,
  SaveRoRequestApprovalStatusSuccess,
  SaveRoRequestApprovalStatusFailure,
  SaveRoRequestApprovalStatus
} from './ro-request-approvals.actions';

describe('RoRequestApporvalEffect Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: RoRequestApporvalEffect;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get', 'post', 'patch']
  );
  const initialState = {};
  let roRequestApprovalService = jasmine.createSpyObj<RoRequestApprovalService>(
    'RoRequestApprovalService',
    [
      'getRoRequestApprovalList',
      'saveRoRequestApprovalStatus',
      'getBoutiqueRoRequestApprovalList'
    ]
  );

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RoRequestApporvalEffect,
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
          provide: RoRequestApprovalService,
          useValue: {
            getRoRequestApprovalList: jasmine.createSpy(),
            saveRoRequestApprovalStatus: jasmine.createSpy(),
            getBoutiqueRoRequestApprovalList: jasmine.createSpy()
          }
        }
      ]
    });

    effect = TestBed.inject(RoRequestApporvalEffect);
    roRequestApprovalService = TestBed.inject<any>(RoRequestApprovalService);
  });

  describe('loadPendingRoRequestApprovalList', () => {
    it('should return a stream with ro request list', () => {
      const payload: RoRequestApprovalListRequest = {
        approvalStatus: 'PENDING',
        workflowType: 'APPROVE_RO_PAYMENT'
      };

      const res: RoRequestApprovalListResponse[] = [
        {
          approvedBy: '',
          approvedDate: 1,
          remarks: '',
          docDate: '11',
          reqNo: 11,
          fiscalYear: 2020,
          amount: 1000,
          customerName: 'rso',
          customerTitle: 'rso',
          customerMobileNumber: 123467890,
          cashierId: '1',
          customerId: '1',
          locationCode: 'URB',
          processId: '111',
          cashierName: 'rso',
          requestedDate: '22',
          requestorReason: 'RO',
          taskId: '111',
          taskName: 'TEST',
          workflowType: 'APPROVE_RO_PAYMENT',
          requestTime: '11',
          totalElements: 1,
          approvalStatus: 'PENDING'
        }
      ];

      const action = new LoadPendingRoRequestApprovalList(payload);
      const outcome = new LoadPendingRoRequestApprovalListSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      roRequestApprovalService.getRoRequestApprovalList.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadPendingRoRequestApprovalList$).toBeObservable(
        expected$
      );
    });

    it('should fail and return an action with the error', () => {
      const payload: RoRequestApprovalListRequest = {
        approvalStatus: 'PENDING',
        workflowType: 'APPROVE_RO_PAYMENT'
      };
      const action = new LoadPendingRoRequestApprovalList(payload);
      const error = new Error('some error');
      const outcome = new LoadPendingRoRequestApprovalListFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      roRequestApprovalService.getRoRequestApprovalList.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.loadPendingRoRequestApprovalList$).toBeObservable(expected);
    });
  });

  describe('loadRejectedRoRequestApprovalList', () => {
    it('should return a stream with ro request list', () => {
      const payload: RoRequestApprovalListRequest = {
        approvalStatus: 'REJECTED',
        workflowType: 'APPROVE_RO_PAYMENT'
      };

      const res: RoRequestApprovalListResponse[] = [
        {
          approvedBy: '',
          approvedDate: 1,
          remarks: '',
          docDate: '11',
          reqNo: 11,
          fiscalYear: 2020,
          amount: 1000,
          customerName: 'rso',
          customerTitle: 'rso',
          customerMobileNumber: 123467890,
          cashierId: '1',
          customerId: '1',
          locationCode: 'URB',
          processId: '111',
          cashierName: 'rso',
          requestedDate: '22',
          requestorReason: 'RO',
          taskId: '111',
          taskName: 'TEST',
          workflowType: 'APPROVE_RO_PAYMENT',
          requestTime: '11',
          totalElements: 1,
          approvalStatus: 'PENDING'
        }
      ];

      const action = new LoadRejectedRoRequestApprovalList(payload);
      const outcome = new LoadRejectedRoRequestApprovalListSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      roRequestApprovalService.getRoRequestApprovalList.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadRejectedRoRequestApprovalList$).toBeObservable(
        expected$
      );
    });

    it('should fail and return an action with the error', () => {
      const payload: RoRequestApprovalListRequest = {
        approvalStatus: 'PENDING',
        workflowType: 'APPROVE_RO_PAYMENT'
      };
      const action = new LoadRejectedRoRequestApprovalList(payload);
      const error = new Error('some error');
      const outcome = new LoadRejectedRoRequestApprovalListFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      roRequestApprovalService.getRoRequestApprovalList.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.loadRejectedRoRequestApprovalList$).toBeObservable(
        expected
      );
    });
  });

  describe('loadApprovedRoRequestList', () => {
    it('should return a stream with ro request list', () => {
      const payload: RoRequestApprovalListRequest = {
        approvalStatus: 'APPROVED',
        workflowType: 'APPROVE_RO_PAYMENT'
      };

      const res: RoRequestApprovalListResponse[] = [
        {
          approvedBy: '',
          approvedDate: 1,
          remarks: '',
          docDate: '11',
          reqNo: 11,
          fiscalYear: 2020,
          amount: 1000,
          customerName: 'rso',
          customerTitle: 'rso',
          customerMobileNumber: 123467890,
          cashierId: '1',
          customerId: '1',
          locationCode: 'URB',
          processId: '111',
          cashierName: 'rso',
          requestedDate: '22',
          requestorReason: 'RO',
          taskId: '111',
          taskName: 'TEST',
          workflowType: 'APPROVE_RO_PAYMENT',
          requestTime: '11',
          totalElements: 1,
          approvalStatus: 'PENDING'
        }
      ];

      const action = new LoadRejectedRoRequestApprovalList(payload);
      const outcome = new LoadRejectedRoRequestApprovalListSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      roRequestApprovalService.getRoRequestApprovalList.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadRejectedRoRequestApprovalList$).toBeObservable(
        expected$
      );
    });

    it('should fail and return an action with the error', () => {
      const payload: RoRequestApprovalListRequest = {
        approvalStatus: 'APPROVED',
        workflowType: 'APPROVE_RO_PAYMENT'
      };
      const action = new LoadRejectedRoRequestApprovalList(payload);
      const error = new Error('some error');
      const outcome = new LoadRejectedRoRequestApprovalListFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      roRequestApprovalService.getRoRequestApprovalList.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.loadRejectedRoRequestApprovalList$).toBeObservable(
        expected
      );
    });
  });

  describe('loadRoRequestApprovalList', () => {
    it('should return a stream with ro request list', () => {
      const payload: RoRequestApprovalListRequest = {
        approvalStatus: 'APPROVED',
        workflowType: 'APPROVE_RO_PAYMENT'
      };

      const res: BoutiqueRoRequestApprovalListResponse = {
        requestList: [
          {
            amount: 100,
            approvedBy: 'commercial',
            approvedDate: '10',
            id: '1',
            reqNo: '1',
            requestedBy: 'rso',
            fiscalYear: '2020',
            requestedDate: '9',
            requestTime: '11',
            cashierName: 'rso',
            customerName: 'Sharath',
            customerMobileNumber: 12345567890,
            requestorReason: 'RO',
            status: 'PENDING',
            remarks: ''
          }
        ],
        totalElements: 10
      };

      const action = new LoadRoRequestApprovalList(payload);
      const outcome = new LoadRoRequestApprovalListSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      roRequestApprovalService.getBoutiqueRoRequestApprovalList.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadRoRequestApprovalList$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: RoRequestApprovalListRequest = {
        approvalStatus: 'APPROVED',
        workflowType: 'APPROVE_RO_PAYMENT'
      };
      const action = new LoadRoRequestApprovalList(payload);
      const error = new Error('some error');
      const outcome = new LoadRoRequestApprovalListFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      roRequestApprovalService.getBoutiqueRoRequestApprovalList.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.loadRoRequestApprovalList$).toBeObservable(expected);
    });
  });

  describe('saveRoRequestApprovalStatus', () => {
    it('should return a stream with saved ro request list ids', () => {
      const payload: SaveRoRequestApproval = {
        bulkApproverRequestObjectDto: [
          {
            approved: true,
            approverRemarks: 'APPROVING IT',
            taskId: '1',
            processId: '1',
            taskName: 'task'
          }
        ]
      };

      const res = ['1'];

      const action = new SaveRoRequestApprovalStatus(payload);
      const outcome = new SaveRoRequestApprovalStatusSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      roRequestApprovalService.saveRoRequestApprovalStatus.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.saveRoRequestApprovalStatus$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: SaveRoRequestApproval = {
        bulkApproverRequestObjectDto: [
          {
            approved: true,
            approverRemarks: 'APPROVING IT',
            taskId: '1',
            processId: '1',
            taskName: 'task'
          }
        ]
      };
      const action = new SaveRoRequestApprovalStatus(payload);
      const error = new Error('some error');
      const outcome = new SaveRoRequestApprovalStatusFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      roRequestApprovalService.saveRoRequestApprovalStatus.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.saveRoRequestApprovalStatus$).toBeObservable(expected);
    });
  });
});
