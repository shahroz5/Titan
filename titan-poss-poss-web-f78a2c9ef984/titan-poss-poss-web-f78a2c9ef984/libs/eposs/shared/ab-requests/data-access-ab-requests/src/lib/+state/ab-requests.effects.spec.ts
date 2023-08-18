
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


import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {ABRequestsEffects } from './ab-requests.effects';
import { AbRequestsService} from '../ab-requests.service';

import {
  LoadABRequests
  , LoadABRequestsSuccess
  , LoadABRequestsFailure

  , ApproveABRequests
  , ApproveABRequestsFailure
  , ApproveABRequestsSuccess
  , Reset
  , LoadLocation
  , LoadLocationSuccess
  , LoadLocationFailure
} from './ab-requests.actions';
import { LocationDataService } from '@poss-web/shared/masters/data-access-masters';
//import { RoRequestApprovalListRequest, RoRequestApprovalListResponse, BoutiqueRoRequestApprovalListResponse, SaveRoRequestApproval } from '@poss-web/shared/models';

describe('RequestApporvalEffect Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: ABRequestsEffects;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get', 'post', 'patch']
  );
  const initialState = {};
  let roRequestApprovalService = jasmine.createSpyObj<AbRequestsService>(
    'AbRequestsService',
    [
      'getloadabRequest',
      'putab'

    ]
  );
  let locservice = jasmine.createSpyObj<LocationDataService>('locservice', [
    'getLocationSummaryList'
  ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ABRequestsEffects,
        DataPersistence,
        provideMockStore({ initialState }),
        provideMockActions(() => actions$),
        {
          provide: POSS_WEB_API_URL,
          useValue: ''
        },
        {
          provide: LocationDataService,
          useValue: {
            getLocationSummaryList: jasmine.createSpy()
          }
        },

        {
          provide: HttpClient,
          useValue: httpClientSpy
        },

        {
          provide: AbRequestsService,
          useValue: roRequestApprovalService
        }
      ]
    });

    effect = TestBed.inject(ABRequestsEffects);
    roRequestApprovalService = TestBed.inject<any>(AbRequestsService);
    locservice=TestBed.inject<any>(LocationDataService)
  });

  describe('loadPendingRequestApprovalList', () => {
    it('should return a stream with ro request list', () => {
      const payload = {
        approvalStatus: 'PENDING',
        workflowType: 'APPROVE_RO_PAYMENT',
        body:{}
      };

      const res ={
        results: [
          {
            approvedBy: 'Abc',
            invoiceNo:788,
            approvedDate: null,
            approverRemarks: 'Abc',
            docDate:null,
            docNo: 89,
            fiscalYear: 89,
            headerData: null,
            customerName: 'Abc',
            totalAmount: 78999,
            locationCode: 'Abc',
            mobileNumber: 907890000,
            abDocNo: 89,
            processId: 'Abc',
            requestedBy: 'Abc',
            requestedDate: null,
            requestorRemarks: 'Abc',
            taskId: 'Abc',
            taskName: 'Abc',
            workflowType: 'Abc',
          }
        ],
        count: 1
      };

      const action = new LoadABRequests(payload);
      const outcome = new LoadABRequestsSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      roRequestApprovalService.getloadabRequest.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.abCancelList$).toBeObservable(
        expected$
      );
    });

    it('should fail and return an action with the error', () => {
      const payload = {
        approvalStatus: 'PENDING',
        workflowType: 'APPROVE_RO_PAYMENT',
        body:{}
      };
      const action = new LoadABRequests(payload);
      const error = new Error('some error');
      const outcome = new LoadABRequestsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      roRequestApprovalService.getloadabRequest.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.abCancelList$).toBeObservable(expected);
    });
  });



  // describe('savRequestApprovalStatus', () => {
  //   it('should return a stream with saved ro request list ids', () => {
  //     const payload = {
  //       approved: 'yes',
  // body: {
  //   approvedData: {
  //     data: null,
  //     type:'cm'
  //   },
  //   approverRemarks: 'string',
  // },
  // processId: '4567890',
  // taskId: '4567890',
  // taskName: 'string',
  //     };

  //     const res = {
  //       data:null,
  //       docNo:null
  //     }
  //     const action = new ApproveABRequests(payload);
  //     const outcome = new ApproveABRequestsSuccess({
  //       data:null,
  //       docNo:null
  //     });
  //     actions$ = hot('-a', { a: action });

  //     const response$ = cold('-a|', { a: res });
  //     roRequestApprovalService.putab.and.returnValue(
  //       response$
  //     );

  //     const expected$ = cold('--b', { b: outcome });
  //     expect(effect.approveCancel$).toBeObservable(expected$);
  //   });

  //   it('should fail and return an action with the error', () => {
  //     const payload = {
  //       approved: 'yes',
  // body: {
  //   approvedData: {
  //     data: null,
  //     type:'cm'
  //   },
  //   approverRemarks: 'string',
  // },
  // processId: '4567890',
  // taskId: '4567890',
  // taskName: 'string',
  //     };

  //     const res =  {
  //       data:null,
  //       docNo:9
  //     };
  //     const action = new ApproveABRequests(payload);
  //     const error = new Error('some error');
  //     const outcome = new ApproveABRequestsFailure(
  //       CustomErrorAdaptor.fromJson(error)
  //     );
  //     actions$ = hot('-a', { a: action });
  //     const response$ = cold('-#|', {}, error);
  //     roRequestApprovalService.putab.and.returnValue(
  //       response$
  //     );
  //     const expected = cold('--b', { b: outcome });
  //     expect(effect.approveCancel$).toBeObservable(expected);
  //   });
  // });

  describe('Load Location', () => {
    it('should return Location', () => {
      const data = [];
      const action = new LoadLocation();
      const outcome = new LoadLocationSuccess(data);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: data });
      locservice.getLocationSummaryList.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.location$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadLocation();
      const error = new Error('some error');
      const outcome = new LoadLocationFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      locservice.getLocationSummaryList.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.location$).toBeObservable(expected);
    });
  });
});
