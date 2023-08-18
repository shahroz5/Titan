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
  GrnRequestApprovalListRequest,
  GrnRequestApprovalListResponse,
  SaveGrnRequestApproval
} from '@poss-web/shared/models';

import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { GrnRequestApprovalEffect } from './grn-request-approvals.effect';
import { GrnRequestApprovalsService } from '../grn-request-approvals.service';

import {
  LoadGrnRequestList,
  LoadGrnRequestListFailure,
  LoadGrnRequestListSuccess,
  SaveGrnRequestApprovalStatusFailure,
  SaveGrnRequestApprovalStatus,
  SaveGrnRequestApprovalStatusSuccess
} from './grn-request-approvals.action';

describe('GrnRequestApprovalEffect Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: GrnRequestApprovalEffect;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get', 'post', 'patch']
  );
  const initialState = {};
  let grnRequestApprovalsService = jasmine.createSpyObj<
    GrnRequestApprovalsService
  >('GrnRequestApprovalsService', [
    'loadGrnRequestList',
    'saveGrnRequestApprovalStatus'
  ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GrnRequestApprovalEffect,
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
          provide: GrnRequestApprovalsService,
          useValue: {
            loadGrnRequestList: jasmine.createSpy(),
            saveGrnRequestApprovalStatus: jasmine.createSpy()
          }
        }
      ]
    });

    effect = TestBed.inject(GrnRequestApprovalEffect);
    grnRequestApprovalsService = TestBed.inject<any>(
      GrnRequestApprovalsService
    );
  });

  describe('loadGrnRequestList', () => {
    it('should return a stream with GRN request list', () => {
      const payload: GrnRequestApprovalListRequest = {
        approvalStatus: 'PENDING',
        workflowType: 'GOODS_RETURN',
        pageIndex: 1,
        pageSize: 10
      };
      const res: GrnRequestApprovalListResponse[] = [];

      const action = new LoadGrnRequestList(payload);
      const outcome = new LoadGrnRequestListSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      grnRequestApprovalsService.loadGrnRequestList.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadGrnRequestList$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: GrnRequestApprovalListRequest = {
        approvalStatus: 'PENDING',
        workflowType: 'GOODS_RETURN',
        pageIndex: 1,
        pageSize: 10
      };

      const action = new LoadGrnRequestList(payload);
      const error = new Error('some error');
      const outcome = new LoadGrnRequestListFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      grnRequestApprovalsService.loadGrnRequestList.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadGrnRequestList$).toBeObservable(expected);
    });
  });

  describe('saveGrnRequestApprovalStatus', () => {
    it('should return a stream with saved request ids ', () => {
      const payload: SaveGrnRequestApproval = {
        bulkApproverRequestObjectDto: [
          {
            processId: '1',
            taskId: '2',
            taskName: 't',
            approved: true,
            approverRemarks: 'test'
          }
        ]
      };

      const res = ['1', '2'];

      const action = new SaveGrnRequestApprovalStatus(payload);
      const outcome = new SaveGrnRequestApprovalStatusSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      grnRequestApprovalsService.saveGrnRequestApprovalStatus.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.saveGrnRequestApprovalStatus$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: SaveGrnRequestApproval = {
        bulkApproverRequestObjectDto: [
          {
            processId: '1',
            taskId: '2',
            taskName: 't',
            approved: true,
            approverRemarks: 'test'
          }
        ]
      };

      const action = new SaveGrnRequestApprovalStatus(payload);
      const error = new Error('some error');
      const outcome = new SaveGrnRequestApprovalStatusFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      grnRequestApprovalsService.saveGrnRequestApprovalStatus.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.saveGrnRequestApprovalStatus$).toBeObservable(expected);
    });
  });
});
