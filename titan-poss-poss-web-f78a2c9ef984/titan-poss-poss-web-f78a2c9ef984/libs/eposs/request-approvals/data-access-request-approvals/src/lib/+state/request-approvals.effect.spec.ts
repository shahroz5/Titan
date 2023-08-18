import { count } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { hot, cold } from 'jasmine-marbles';
import * as moment from 'moment';
import { TestBed, async } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { HttpClient } from '@angular/common/http';
import { RequestApprovalsEffects } from './request-approvals.effect';
import * as actions from './request-approvals.actions';
import {
  CustomErrors,
  ProductGroup,
  LoadRequestResponse,
  RequestApprovals,
  LoadRequestResponseItems,
  BinRequestApprovalsItems,
  LoadRequestTotalCountSuccessPayload,
  LoadBinRequestResponse,
  RequestApprovalsItems
} from '@poss-web/shared/models';
import { RequestApprovalsService } from '../request-approvals.service';
import { DataPersistence } from '@nrwl/angular';
import { RequestApprovalsState } from './request-approvals.state';
import {
  POSS_WEB_API_URL,
  POSS_WEB_CACHING_STRATEGY
} from '@poss-web/shared/util-config';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  LocationDataService,
  ProductGroupDataService
} from '@poss-web/shared/masters/data-access-masters';

describe('Stock Receive Effects Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: RequestApprovalsEffects;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get']
  );
  const initialState = {};
  let service = jasmine.createSpyObj<RequestApprovalsService>('service', [
    'getBinRequestApprovalsCount',
    'getRequestsCount',
    'getLocationCount',
    'getIbtRequestApprovalsCount',
    'getBinRequestApprovalsItems',
    'updateBinApprovalStatus',
    'updateIbtApprovalStatus',
    'updateIbtCancelApprovals',
    'getIbtsApprovals',
    'getIbtItemsRequestApprovalsCount',
    'getIbtCancelRequestApprovalsItems',
    'getIbtRequestApprovalsItems',
    'updateIbtApprovals',
    'getIbtCancelRequestApprovalsCount',
    'getRequest',
    'getCancelRequest'
  ]);
  let locservice = jasmine.createSpyObj<LocationDataService>('locservice', [
    'getLocationSummaryList'
  ]);
  let proservice = jasmine.createSpyObj<ProductGroupDataService>('proservice', [
    'getProductGroups'
  ]);
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RequestApprovalsEffects,
        DataPersistence,
        provideMockStore({ initialState }),
        provideMockActions(() => actions$),
        {
          provide: POSS_WEB_API_URL,
          useValue: ''
        },
        {
          provide: POSS_WEB_CACHING_STRATEGY,
          useValue: []
        },
        {
          provide: HttpClient,
          useValue: httpClientSpy
        },
        {
          provide: LocationDataService,
          useValue: {
            getLocationSummaryList: jasmine.createSpy()
          }
        },
        {
          provide: ProductGroupDataService,
          useValue: {
            getProductGroups: jasmine.createSpy()
          }
        },
        {
          provide: RequestApprovalsService,
          useValue: {
            getBinRequestApprovalsCount: jasmine.createSpy(),
            getRequestsCount: jasmine.createSpy(),
            getLocationCount: jasmine.createSpy(),
            getIbtRequestApprovalsCount: jasmine.createSpy(),
            getBinRequestApprovalsItems: jasmine.createSpy(),
            updateBinApprovalStatus: jasmine.createSpy(),
            updateIbtApprovalStatus: jasmine.createSpy(),
            updateIbtCancelApprovals: jasmine.createSpy(),
            getIbtsApprovals: jasmine.createSpy(),
            getIbtItemsRequestApprovalsCount: jasmine.createSpy(),
            getIbtCancelRequestApprovalsItems: jasmine.createSpy(),
            getIbtRequestApprovalsItems: jasmine.createSpy(),
            updateIbtApprovals: jasmine.createSpy(),
            getIbtsCancellationApprovals: jasmine.createSpy(),

            getIbtCancelRequestApprovalsCount: jasmine.createSpy(),
            getRequest: jasmine.createSpy(),
            getCancelRequest: jasmine.createSpy()
          }
        }
      ]
    });

    effect = TestBed.get(RequestApprovalsEffects);
    service = TestBed.get(RequestApprovalsService);
    locservice = TestBed.get(LocationDataService);
    proservice = TestBed.get(ProductGroupDataService);
  });

  describe('BinRequestItems Count', () => {
    it('Bin request Item count', () => {
      const parameters = 10;
      const action = new actions.LoadBinRequestApprovalsCount();
      const outcome = new actions.LoadBinRequestApprovalsCountSuccess(
        parameters
      );
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: parameters });
      service.getBinRequestApprovalsCount.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.binCount$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new actions.LoadBinRequestApprovalsCount();
      const error = new Error('some error');
      const outcome = new actions.LoadBinRequestApprovalsCountFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      service.getBinRequestApprovalsCount.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.binCount$).toBeObservable(expected);
    });
  });

  describe(' IbtApprovalStatus', () => {
    // it(' IbtApprovalStatus', () => {
    //   const parameters = 10;
    //   const action = new actions.LoadBinRequestApprovalsCount();
    //   const outcome = new actions.LoadBinRequestApprovalsCountSuccess(
    //     parameters
    //   );
    //   actions$ = hot('-a', { a: action });

    //   const response$ = cold('-a|', { a: parameters });
    //   service.getBinRequestApprovalsCount.and.returnValue(response$);

    //   const expected$ = cold('--b', { b: outcome });
    //   expect(effect.IbtApprovalStatus).toBeObservable(expected$);
    // });

    it('should fail and return an action with the error', () => {
      const action = new actions.LoadBinRequestApprovalsCount();
      const error = new Error('some error');
      const outcome = new actions.LoadBinRequestApprovalsCountFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      service.getBinRequestApprovalsCount.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.binCount$).toBeObservable(expected);
    });
  });

  describe('Item Request Count', () => {
    it('Item Request Count', () => {
      const parameters = {
        id: 145,
        reqDocNo: 123,
        srcLocationCode: 'Sty',
        destLocationCode: 'Sty',
        totalAcceptedQuantity: 123,
        totalAcceptedValue: 123,
        totalAcceptedWeight: 123,
        totalRequestedWeight: 123,
        totalRequestedQuantity: 123,
        totalRequestedValue: 123,
        weightUnit: 'Sty',
        currencyCode: 'Sty',
        srcDocNo: 123,
        totalIssuedQuantity: 123,
        status: 'Sty',
        reqDocDate: null,
        requestType: 'Sty',
        totalIssuedValue: 123,
        totalIssuedWeight: 123,
        srcDocDate: null,
createdDate:null,
        otherDetails: {
          type: 'Sty',
          data: {
            approvedCode: 'Sty',
            approvedBy: 'Sty'
          }
        },
        carrierDetails: {
          type: 'Sty',
          data: {
            employeeName: 'Sty',
            employeeId: 'Sty',
            emailId: 'Sty'
          }
        }
      };

      const parameter = {
        id: 123,
        requestType: 'IBT',
        requestUpdateDto: {
          itemIds: ['45'],
          remarks: 'yuuo',
          status: 'aproval'
        }
      };
      const action = new actions.IBTRequest(parameter);
      const outcome = new actions.IbtRequestSuccess(parameters);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: parameters });
      service.updateIbtApprovals.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.IbtApprovalStatus).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameter = {
        id: 123,
        requestType: 'IBT',
        requestUpdateDto: null
      };
      const action = new actions.IBTRequest(parameter);
      const error = new Error('some error');
      const outcome = new actions.IbtRequestFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      service.updateIbtApprovals.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.IbtApprovalStatus).toBeObservable(expected);
    });
  });

  describe('Item Request Count', () => {
    //  it('Item Request Count', () => {
    //   const parameters = {
    //     items: [
    //       {
    //         id: 145,
    //         reqDocNo: 123,
    //         srcLocationCode: 'Sty',
    //         destLocationCode: 'Sty',
    //         totalAcceptedQuantity: 123,
    //         totalAcceptedValue: 123,
    //         totalAcceptedWeight: 123,
    //         totalRequestedWeight: 123,
    //         totalRequestedQuantity: 123,
    //         totalRequestedValue: 123,
    //         weightUnit: 'Sty',
    //         currencyCode: 'Sty',
    //         srcDocNo: 123,
    //         totalIssuedQuantity: 123,
    //         status: 'Sty',
    //         reqDocDate: null,
    //         requestType: 'Sty',
    //         totalIssuedValue: 123,
    //         totalIssuedWeight: 123,
    //         srcDocDate: null,

    //         otherDetails: {
    //           type: 'Sty',
    //           data: {
    //             approvedCode: 'Sty',
    //             approvedBy: 'Sty'
    //           }
    //         },
    //         carrierDetails: {
    //           type: 'Sty',
    //           data: {
    //             employeeName: 'Sty',
    //             employeeId: 'Sty',
    //             emailId: 'Sty'
    //           }
    //         }
    //       }
    //     ],
    //     count: 1
    //   };

    //   const parameter = {
    //     requestType: 'rrr',
    //     pageIndex: 123,
    //     pageSize: 123,

    //     status: 'rrr'
    //   };
    //   const action = new actions.LoadIBtCancellationRequest(parameter);
    //   const outcome = new actions.LoadIBtCancellationRequestSuccess(parameters);
    //   actions$ = hot('-a', { a: action });

    //   const response$ = cold('-a|', { a: parameters });
    //   service.getIbtsCancellationApprovals.and.returnValue(response$);

    //   const expected$ = cold('--b', { b: outcome });
    //   expect(effect.loadIbtCancellationRequest$).toBeObservable(expected$);
    // });

    it('should fail and return an action with the error', () => {
      const parameter = {
        requestType: 'rrr',
        pageIndex: 123,
        pageSize: 123,

        status: 'rrr'
      };
      const action = new actions.LoadIBtCancellationRequest(parameter);
      const error = new Error('some error');
      const outcome = new actions.ClearIbtSearchItems();
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      service.getIbtsCancellationApprovals.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadIbtCancellationRequest$).toBeObservable(expected);
    });
  });

  describe('loadADJRequest$', () => {
    // it('loadADJRequest$', () => {
    //   const parameters = {
    //     items: [
    //       {
    //         id: 145,
    //         reqDocNo: 123,
    //         srcLocationCode: 'Sty',
    //         destLocationCode: 'Sty',
    //         totalAcceptedQuantity: 123,
    //         totalAcceptedValue: 123,
    //         totalAcceptedWeight: 123,
    //         totalRequestedWeight: 123,
    //         totalRequestedQuantity: 123,
    //         totalRequestedValue: 123,
    //         weightUnit: 'Sty',
    //         currencyCode: 'Sty',
    //         srcDocNo: 123,
    //         totalIssuedQuantity: 123,
    //         status: 'Sty',
    //         reqDocDate: null,
    //         requestType: 'Sty',
    //         totalIssuedValue: 123,
    //         totalIssuedWeight: 123,
    //         srcDocDate: null,

    //         otherDetails: {
    //           type: 'Sty',
    //           data: {
    //             approvedCode: 'Sty',
    //             approvedBy: 'Sty'
    //           }
    //         },
    //         carrierDetails: {
    //           type: 'Sty',
    //           data: {
    //             employeeName: 'Sty',
    //             employeeId: 'Sty',
    //             emailId: 'Sty'
    //           }
    //         }
    //       }
    //     ],
    //     count: 1
    //   };

    //   const parameter = {
    //     requestType: 'rrr',
    //     pageIndex: 123,
    //     pageSize: 123,

    //     status: 'rrr'
    //   };
    //   const action = new actions.LoadADJRequest(parameter);
    //   const outcome = new actions.LoadADJRequestSuccess(parameters);
    //   actions$ = hot('-a', { a: action });

    //   const response$ = cold('-a|', { a: parameters });
    //   service.getIbtsApprovals.and.returnValue(response$);

    //   const expected$ = cold('--b', { b: outcome });
    //   expect(effect.loadADJRequest$).toBeObservable(expected$);
    // });

    it('should fail and return an action with the error', () => {
      const parameter = {
        requestType: 'rrr',
        pageIndex: 123,
        pageSize: 123,

        status: 'rrr'
      };
      const action = new actions.LoadADJRequest(parameter);
      const error = new Error('some error');
      const outcome = new actions.ClearADJRequest();
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      service.getIbtsApprovals.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadADJRequest$).toBeObservable(expected);
    });
  });

  describe(' ibtCancelCount$', () => {
    it(' ibtCancelCount$', () => {
      const parameters = {
        items: [
          {
            id: 145,
            reqDocNo: 123,
            srcLocationCode: 'Sty',
            destLocationCode: 'Sty',
            totalAcceptedQuantity: 123,
            totalAcceptedValue: 123,
            totalAcceptedWeight: 123,
            totalRequestedWeight: 123,
            totalRequestedQuantity: 123,
            totalRequestedValue: 123,
            weightUnit: 'Sty',
            currencyCode: 'Sty',
            srcDocNo: 123,
            totalIssuedQuantity: 123,
            status: 'Sty',
            reqDocDate: null,
            createdDate:null,
            requestType: 'Sty',
            totalIssuedValue: 123,
            totalIssuedWeight: 123,
            srcDocDate: null,

            otherDetails: {
              type: 'Sty',
              data: {
                approvedCode: 'Sty',
                approvedBy: 'Sty'
              }
            },
            carrierDetails: {
              type: 'Sty',
              data: {
                employeeName: 'Sty',
                employeeId: 'Sty',
                emailId: 'Sty'
              }
            }
          }
        ],
        count: 1
      };

      const parameter = {
        requestType: 'rrr',
        pageIndex: 123,
        pageSize: 123,

        status: 'rrr'
      };
      const action = new actions.LoadIBTCancelRequestApprovalsCount();
      const outcome = new actions.LoadIBTCancelRequestApprovalsCountSuccess(
        parameters
      );
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: parameters });
      service.getIbtCancelRequestApprovalsCount.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.ibtCancelCount$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameter = {
        requestType: 'rrr',
        pageIndex: 123,
        pageSize: 123,

        status: 'rrr'
      };
      const action = new actions.LoadIBTCancelRequestApprovalsCount();
      const error = new Error('some error');
      const outcome = new actions.LoadIBTCancelRequestApprovalsCountFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      service.getIbtCancelRequestApprovalsCount.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.ibtCancelCount$).toBeObservable(expected);
    });
  });

  describe('load location count', () => {
    it('should return count of location', () => {
      const parameters = 10;
      const action = new actions.LoadLocationCount();
      const outcome = new actions.LoadLocationCountSuccess(parameters);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: parameters });
      service.getLocationCount.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.locationCount$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new actions.LoadLocationCount();
      const error = new Error('some error');
      const outcome = new actions.LoadLocationCountFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      service.getLocationCount.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.locationCount$).toBeObservable(expected);
    });
  });

  describe('load ibt count', () => {
    it('should return a  count on ibt', () => {
      const parameters = 10;
      const action = new actions.LoadIBTRequestApprovalsCount();
      const outcome = new actions.LoadIBTRequestApprovalsCountSuccess(
        parameters
      );
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: parameters });
      service.getIbtRequestApprovalsCount.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.ibtRequestCount$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new actions.LoadIBTRequestApprovalsCount();
      const error = new Error('some error');
      const outcome = new actions.LoadIBTRequestApprovalsCountFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      service.getIbtRequestApprovalsCount.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.ibtRequestCount$).toBeObservable(expected);
    });
  });
  describe('load bin request items', () => {
    it('should return items of bin request', () => {
      const parameters: actions.GetBinRequestPayload = {
        reqDocNo: 456,
        locationCode: 'ABO',
        pageIndex: 90,
        pageSize: 8
      };

      const data: LoadBinRequestResponse = {
        count: 1,
        items: [
          {
            binName: 'abc',
            id: 8090,
            reqLocationCode: 'ABO',
            reqDocDate: null,
            reqDocNo: 89,
            status: 'APPROVED',
            requestedRemarks: 'approved',
            binGroupCode: 'P'
          }
        ]
      };

      const action = new actions.LoadBinRequestApprovals(parameters);
      const outcome = new actions.LoadBinRequestApprovalsSuccess(data);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: data });
      service.getBinRequestApprovalsItems.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadBinItems$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const parameters: actions.GetBinRequestPayload = {
        reqDocNo: 456,
        locationCode: 'ABO',
        pageIndex: 90,
        pageSize: 8
      };
      const action = new actions.LoadBinRequestApprovals(parameters);
      const error = new Error('some error');
      const outcome = new actions.SearchClear();
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      service.getBinRequestApprovalsItems.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadBinItems$).toBeObservable(expected);
    });
  });

  describe('load bin request items', () => {
    it('should return items of bin request', () => {
      const parameters: actions.GetBinRequestPayload = {
        reqDocNo: 456,
        locationCode: 'ABO',
        pageIndex: 90,
        pageSize: 8
      };

      const data: LoadBinRequestResponse = {
        count: 1,
        items: [
          {
            binName: 'abc',
            id: 8090,
            reqLocationCode: 'ABO',
            reqDocDate: null,
            reqDocNo: 89,
            status: 'APPROVED',
            requestedRemarks: 'approved',
            binGroupCode: 'P'
          }
        ]
      };

      const action = new actions.LoadBinRequestApprovals(parameters);
      const outcome = new actions.LoadBinRequestApprovalsSuccess(data);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: data });
      service.getBinRequestApprovalsItems.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadBinItems$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const parameters: actions.GetBinRequestPayload = {
        reqDocNo: 456,
        locationCode: 'ABO',
        pageIndex: 90,
        pageSize: 8
      };
      const action = new actions.LoadBinRequestApprovals(parameters);
      const error = new Error('some error');
      const outcome = new actions.SearchClear();
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      service.getBinRequestApprovalsItems.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadBinItems$).toBeObservable(expected);
    });
  });
  describe('Update Bin Request Approvals', () => {
    it('Update Bin Request Approvals', () => {
      const parameters: actions.BinApprovalspayload = {
        binRequestUpdateDto: {
          remarks: 'appved',
          status: 'APVL_REJECTED'
        },
        id: 567
      };
      const data = {
        binName: 'abc',
        id: 8090,
        reqLocationCode: 'ABO',
        reqDocDate: null,
        reqDocNo: 89,
        status: 'APPROVED',
        requestedRemarks: 'approved',
        binGroupCode: 'P'
      };
      const action = new actions.UpdateBinRequestApprovals(parameters);
      const outcome = new actions.UpdateBinRequestApprovalsSuccess(data);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: data });
      service.updateBinApprovalStatus.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.updateBinApprovalStatus).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters: actions.BinApprovalspayload = {
        binRequestUpdateDto: {
          remarks: 'appved',
          status: 'APVL_REJECTED'
        },
        id: 567
      };
      const action = new actions.UpdateBinRequestApprovals(parameters);
      const error = new Error('some error');
      const outcome = new actions.UpdateBinRequestApprovalsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      service.updateBinApprovalStatus.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.updateBinApprovalStatus).toBeObservable(expected);
    });
  });

  describe('Update Bin Request Approvals', () => {
    it('Update Bin Request Approvals', () => {
      const parameters: actions.BinApprovalspayload = {
        binRequestUpdateDto: {
          remarks: 'appved',
          status: 'APVL_REJECTED'
        },
        id: 567
      };
      const data = {
        binName: 'abc',
        id: 8090,
        reqLocationCode: 'ABO',
        reqDocDate: null,
        reqDocNo: 89,
        status: 'APPROVED',
        requestedRemarks: 'approved',
        binGroupCode: 'P'
      };
      const action = new actions.UpdateBinRequestApprovals(parameters);
      const outcome = new actions.UpdateBinRequestApprovalsSuccess(data);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: data });
      service.updateBinApprovalStatus.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.updateBinApprovalStatus).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters: actions.BinApprovalspayload = {
        binRequestUpdateDto: {
          remarks: 'appved',
          status: 'APVL_REJECTED'
        },
        id: 567
      };
      const action = new actions.UpdateBinRequestApprovals(parameters);
      const error = new Error('some error');
      const outcome = new actions.UpdateBinRequestApprovalsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      service.updateBinApprovalStatus.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.updateBinApprovalStatus).toBeObservable(expected);
    });
  });

  describe('UpdaterequestCount$ ', () => {
    it('requestCount$ ', () => {
      const parameters: actions.BinApprovalspayload = {
        binRequestUpdateDto: {
          remarks: 'appved',
          status: 'APVL_REJECTED'
        },
        id: 567
      };
      const data = null;

      const action = new actions.LoadItemsTotalCount();
      const outcome = new actions.LoadItemsTotalCountSuccess(data);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: data });
      service.getRequestsCount.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.requestCount$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new actions.LoadItemsTotalCount();
      const error = new Error('some error');
      const outcome = new actions.LoadItemsTotalCountFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      service.getRequestsCount.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.requestCount$).toBeObservable(expected);
    });
  });

  describe('Update Bin Request Approvals', () => {
    it('Update Bin Request Approvals', () => {
      const parameters: actions.BinApprovalspayload = {
        binRequestUpdateDto: {
          remarks: 'appved',
          status: 'APVL_REJECTED'
        },
        id: 567
      };
      const data = {
        binName: 'abc',
        id: 8090,
        reqLocationCode: 'ABO',
        reqDocDate: null,
        reqDocNo: 89,
        status: 'APPROVED',
        requestedRemarks: 'approved',
        binGroupCode: 'P'
      };
      const action = new actions.UpdateBinRequestApprovals(parameters);
      const outcome = new actions.UpdateBinRequestApprovalsSuccess(data);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: data });
      service.updateBinApprovalStatus.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.updateBinApprovalStatus).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters: actions.BinApprovalspayload = {
        binRequestUpdateDto: {
          remarks: 'appved',
          status: 'APVL_REJECTED'
        },
        id: 567
      };
      const action = new actions.UpdateBinRequestApprovals(parameters);
      const error = new Error('some error');
      const outcome = new actions.UpdateBinRequestApprovalsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      service.updateBinApprovalStatus.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.updateBinApprovalStatus).toBeObservable(expected);
    });
  });

  describe('Update IBT Request Approvals', () => {
    it('Update IBT Request Approvals', () => {
      const parameters: actions.IbtApprovalspayload = {
        id: 8990,
        itemId: 'yuu',
        itemUpdateDto: {
          quantity: 8,
          status: 'aoo['
        }
      };
      const data = null;
      const action = new actions.UpdateIBTRequestApprovals(parameters);
      const outcome = new actions.UpdateIbtRequestApprovalsSuccess(data);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: data });
      service.updateIbtApprovalStatus.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.updateIbtApprovalStatus).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters: actions.IbtApprovalspayload = {
        id: 8990,
        itemId: 'yuu',
        itemUpdateDto: {
          quantity: 8,
          status: 'aoo['
        }
      };
      const action = new actions.UpdateIBTRequestApprovals(parameters);

      const error = new Error('some error');
      const outcome = new actions.UpdateIbtRequestApprovalsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      service.updateIbtApprovalStatus.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.updateIbtApprovalStatus).toBeObservable(expected);
    });
  });

  describe('Update IbtCancelUpdate  Approvals', () => {
    it('Update IbtCancelUpdate Approvals', () => {
      const parameters: actions.IbtCancelPayload = {
        id: 8990,
        stUpdateDto: null,
        transferType: 'ss'
      };
      const data = null;
      const action = new actions.IBTCancelRequest(parameters);
      const outcome = new actions.IbtCancelRequestSuccess(data);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: data });
      service.updateIbtCancelApprovals.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.IbtCancelUpdate).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters: actions.IbtCancelPayload = {
        id: 8990,
        stUpdateDto: null,
        transferType: 'ss'
      };
      const action = new actions.IBTCancelRequest(parameters);

      const error = new Error('some error');
      const outcome = new actions.IbtCancelRequestFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      service.updateIbtCancelApprovals.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.IbtCancelUpdate).toBeObservable(expected);
    });
  });

  // describe(' loadIbtItems$ Approvals', () => {
    // it(' loadIbtItems$ Approvals', () => {
    //   const parameters: actions.GetIbtRequestPayload = {
    //     id: 99,
    //     itemCode: null,
    //     requestType: 'IBT',
    //     pageIndex: 8,
    //     pageSize: 5,
    //     sortBy: null,
    //     sortOrder: null,
    //     filter: null,
    //     isSelectedArray: null
    //   };
    //   const data = {
    //     count: 1,
    //     items: [
    //       {
    //         isSelected: true,
    //         id: '67',
    //         itemCode: 'P',
    //         lotNumber: 'uiii',
    //         mfgDate: null,
    //         productCategory: null,
    //         productGroup: null,
    //         binCode: null,
    //         binGroupCode: null,
    //         stdValue: 789,
    //         stdWeight: 789,
    //         currencyCode: null,
    //         weightUnit: null,
    //         status: null,
    //         imageURL: null,
    //         requestedQuantity: 789,
    //         acceptedQuantity: 789,
    //         approvedQuantity: 789,
    //         availableQuantity: 789,
    //         inventoryId: null,
    //         totalApprovedQuantity: 789,
    //         totalReceivedQuantity: 789,
    //         totalReceivedValue: 789,
    //         totalReceivedWeight: 789,
    //         productGroupDesc: null,
    //         productCategoryDesc: null,
    //         isStudded: false
    //       }
    //     ]
    //   };
    //   const action = new actions.LoadIbtRequestApprovals(parameters);
    //   const outcome = new actions.LoadIbtRequestApprovalsSuccess(data);
    //   actions$ = hot('-a', { a: action });

    //   const response$ = cold('-a|', { a: data });
    //   service.getIbtRequestApprovalsItems.and.returnValue(response$);

    //   const expected$ = cold('--b', { b: outcome });
    //   expect(effect.loadIbtItems$).toBeObservable(expected$);
    // });

  //   it('should fail and return an action with the error', () => {
  //     const parameters: actions.GetIbtRequestPayload = {
  //       id: 99,
  //       itemCode: null,
  //       requestType: 'IBT',
  //       pageIndex: 8,
  //       pageSize: 5,
  //       sortBy: null,
  //       sortOrder: null,
  //       filter: null,
  //       isSelectedArray: null
  //     };
  //     const action = new actions.LoadIbtRequestApprovals(parameters);

  //     const error = new Error('some error');
  //     const outcome = new actions.LoadIbtRequestApprovalsFailure(
  //       CustomErrorAdaptor.fromJson(error)
  //     );
  //     actions$ = hot('-a', { a: action });
  //     const response$ = cold('-#|', {}, error);
  //     service.getIbtRequestApprovalsItems.and.returnValue(response$);
  //     const expected = cold('--b', { b: outcome });
  //     console.log(expected);
  //     expect(effect.loadIbtItems$).toBeObservable(expected);
  //   });
  // });

  describe('Update IbtCancelUpdate  Approvals', () => {
    it('Update IbtCancelUpdate Approvals', () => {
      const parameters: actions.LoadIbtRequestPayload = {
        requestType: 'jj',
        pageIndex: 1,
        pageSize: 5
      };
      const data = null;
      const action = new actions.LoadIBtRequest(parameters);
      const outcome = new actions.LoadIBtRequestSuccess(data);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: data });
      service.getIbtsApprovals.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadIbtRequest$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters: actions.LoadIbtRequestPayload = {
        requestType: 'jj',
        pageIndex: 1,
        pageSize: 5
      };
      const action = new actions.LoadIBtRequest(parameters);

      const error = new Error('some error');
      const outcome = new actions.ClearIbtSearchItems();
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      service.getIbtsApprovals.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadIbtRequest$).toBeObservable(expected);
    });
  });

  describe('LoadIBTRequestApprovalsItemsCount Approvals', () => {
    it('LoadIBTRequestApprovalsItemsCount', () => {
      const parameters: actions.CountPayload = {
        requestType: 'jj',
        id: 788
      };
      const data = 7;
      const action = new actions.LoadIBTRequestApprovalsItemsCount(parameters);
      const outcome = new actions.LoadIBTRequestApprovalsItemsCountSuccess(
        data
      );
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: data });
      service.getIbtItemsRequestApprovalsCount.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.ibtItemsCount$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters: actions.CountPayload = {
        requestType: 'jj',
        id: 788
      };
      const action = new actions.LoadIBTRequestApprovalsItemsCount(parameters);

      const error = new Error('some error');
      const outcome = new actions.LoadIBTRequestApprovalsItemsCountFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      service.getIbtItemsRequestApprovalsCount.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.ibtItemsCount$).toBeObservable(expected);
    });
  });

  describe('LoadIBTRequestApprovalsItemsCount Approvals', () => {
    it('LoadIBTRequestApprovalsItemsCount', () => {
      const parameters: actions.CountPayload = {
        requestType: 'jj',
        id: 788
      };
      const data = [];
      const action = new actions.LoadStuddedProductGroups();
      const outcome = new actions.LoadStuddedProductGroupsSuccess(data);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: data });
      proservice.getProductGroups.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadStuddedProductGroups$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters: actions.CountPayload = {
        requestType: 'jj',
        id: 788
      };
      const action = new actions.LoadStuddedProductGroups();

      const error = new Error('some error');
      const outcome = new actions.LoadStuddedProductGroupsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      proservice.getProductGroups.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadStuddedProductGroups$).toBeObservable(expected);
    });
  });

  describe('LoadIBTRequestApprovalsItemsCount Approvals', () => {
    it('LoadIBTRequestApprovalsItemsCount', () => {
      const parameters: actions.CountPayload = {
        requestType: 'jj',
        id: 788
      };
      const data = [];
      const action = new actions.LoadStuddedProductGroups();
      const outcome = new actions.LoadStuddedProductGroupsSuccess(data);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: data });
      proservice.getProductGroups.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadStuddedProductGroups$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters: actions.CountPayload = {
        requestType: 'jj',
        id: 788
      };
      const action = new actions.LoadStuddedProductGroups();

      const error = new Error('some error');
      const outcome = new actions.LoadStuddedProductGroupsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      proservice.getProductGroups.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadStuddedProductGroups$).toBeObservable(expected);
    });
  });

  // describe('LoadIbtCancelRequestItemsApprovalst Approvals', () => {
    // it('LoadIbtCancelRequestItemsApprovals', () => {
    //   const parameters: actions.GetIbtRequestPayload = {
    //     pageSize: 8,
    //     pageIndex: 0,
    //     isSelectedArray: null,
    //     id: 89977,
    //     requestType: 'RTT'
    //   };
    //   const data = null;
    //   const action = new actions.LoadIbtCancelRequestItemsApprovals(parameters);
    //   const outcome = new actions.LoadIbtCancelRequestApprovalsItemsSuccess(
    //     data
    //   );
    //   actions$ = hot('-a', { a: action });

    //   const response$ = cold('-a|', { a: data });
    //   service.getIbtCancelRequestApprovalsItems.and.returnValue(response$);

    //   const expected$ = cold('--b', { b: outcome });
    //   expect(effect.loadIbtCancelItems$).toBeObservable(expected$);
    // });

    // it('should fail and return an action with the error', () => {
    //   const parameters: actions.GetIbtRequestPayload = {
    //     pageSize: 8,
    //     pageIndex: 0,
    //     id: 89977,
    //     requestType: 'RTT',
    //     isSelectedArray: null
    //   };
    //   const action = new actions.LoadIbtCancelRequestItemsApprovals(parameters);
    //   const error = new Error('some error');
    //   const outcome = new actions.LoadIbtCancelRequestApprovalsItemsFailure(
    //     CustomErrorAdaptor.fromJson(error)
    //   );
    //   actions$ = hot('-a', { a: action });
    //   const response$ = cold('-#|', {}, error);
    //   service.getIbtCancelRequestApprovalsItems.and.returnValue(response$);
    //   const expected = cold('--b', { b: outcome });
    //   expect(effect.loadIbtCancelItems$).toBeObservable(expected);
    // });
  // });

  describe('Load Location', () => {
    it('should return Location', () => {
      const data = [];
      const action = new actions.LoadLocation();
      const outcome = new actions.LoadLocationSuccess(data);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: data });
      locservice.getLocationSummaryList.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.location$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new actions.LoadLocation();
      const error = new Error('some error');
      const outcome = new actions.LoadLocationFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      locservice.getLocationSummaryList.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.location$).toBeObservable(expected);
    });
  });

  // describe('loadPendingFactorySTN', () => {
  //   it('should return a stream with Factory Pending STN', () => {

  //   const parameters=10;
  //   const action = new actions.LoadBinRequestApprovalsCount();
  //   const outcome = new actions.LoadBinRequestApprovalsCountSuccess(parameters);
  //   actions$ = hot('-a', { a: action });

  //   const response$ = cold('-a|', { a: parameters });
  //  service.getBinRequestApprovalsCount.and.returnValue(response$);

  //   const expected$ = cold('--b', { b: outcome });
  //   expect(effect.binCount$).toBeObservable(expected$);
  // });

  // it('should fail and return an action with the error', () => {

  //   const action = new actions.LoadBinRequestApprovalsCount();
  //   const error = new Error('some error');
  //   const outcome = new actions.LoadBinRequestApprovalsCountFailure(
  //     CustomErrorAdaptor.fromJson(error)
  //   );
  //   actions$ = hot('-a', { a: action });
  //   const response$ = cold('-#|', {}, error);
  //    service.getBinRequestApprovalsCount.and.returnValue(response$);
  //   const expected = cold('--b', { b: outcome });
  //   expect(effect.binCount$).toBeObservable(expected);
  // });
  // });
  // describe('loadPendingFactorySTN', () => {
  //   it('should return a stream with Factory Pending STN', () => {

  //   const parameters=10;
  //   const action = new actions.LoadBinRequestApprovalsCount();
  //   const outcome = new actions.LoadBinRequestApprovalsCountSuccess(parameters);
  //   actions$ = hot('-a', { a: action });

  //   const response$ = cold('-a|', { a: parameters });
  //  service.getBinRequestApprovalsCount.and.returnValue(response$);

  //   const expected$ = cold('--b', { b: outcome });
  //   expect(effect.binCount$).toBeObservable(expected$);
  // });

  // it('should fail and return an action with the error', () => {

  //   const action = new actions.LoadBinRequestApprovalsCount();
  //   const error = new Error('some error');
  //   const outcome = new actions.LoadBinRequestApprovalsCountFailure(
  //     CustomErrorAdaptor.fromJson(error)
  //   );
  //   actions$ = hot('-a', { a: action });
  //   const response$ = cold('-#|', {}, error);
  //    service.getBinRequestApprovalsCount.and.returnValue(response$);
  //   const expected = cold('--b', { b: outcome });
  //   expect(effect.binCount$).toBeObservable(expected);
  // });
  // });
  // describe('loadPendingFactorySTN', () => {
  //   it('should return a stream with Factory Pending STN', () => {

  //   const parameters=10;
  //   const action = new actions.LoadBinRequestApprovalsCount();
  //   const outcome = new actions.LoadBinRequestApprovalsCountSuccess(parameters);
  //   actions$ = hot('-a', { a: action });

  //   const response$ = cold('-a|', { a: parameters });
  //  service.getBinRequestApprovalsCount.and.returnValue(response$);

  //   const expected$ = cold('--b', { b: outcome });
  //   expect(effect.binCount$).toBeObservable(expected$);
  // });

  // it('should fail and return an action with the error', () => {

  //   const action = new actions.LoadBinRequestApprovalsCount();
  //   const error = new Error('some error');
  //   const outcome = new actions.LoadBinRequestApprovalsCountFailure(
  //     CustomErrorAdaptor.fromJson(error)
  //   );
  //   actions$ = hot('-a', { a: action });
  //   const response$ = cold('-#|', {}, error);
  //    service.getBinRequestApprovalsCount.and.returnValue(response$);
  //   const expected = cold('--b', { b: outcome });
  //   expect(effect.binCount$).toBeObservable(expected);
  // });
  // });
  // describe('loadPendingFactorySTN', () => {
  //   it('should return a stream with Factory Pending STN', () => {

  //   const parameters=10;
  //   const action = new actions.LoadBinRequestApprovalsCount();
  //   const outcome = new actions.LoadBinRequestApprovalsCountSuccess(parameters);
  //   actions$ = hot('-a', { a: action });

  //   const response$ = cold('-a|', { a: parameters });
  //  service.getBinRequestApprovalsCount.and.returnValue(response$);

  //   const expected$ = cold('--b', { b: outcome });
  //   expect(effect.binCount$).toBeObservable(expected$);
  // });

  // it('should fail and return an action with the error', () => {

  //   const action = new actions.LoadBinRequestApprovalsCount();
  //   const error = new Error('some error');
  //   const outcome = new actions.LoadBinRequestApprovalsCountFailure(
  //     CustomErrorAdaptor.fromJson(error)
  //   );
  //   actions$ = hot('-a', { a: action });
  //   const response$ = cold('-#|', {}, error);
  //    service.getBinRequestApprovalsCount.and.returnValue(response$);
  //   const expected = cold('--b', { b: outcome });
  //   expect(effect.binCount$).toBeObservable(expected);
  // });
  // });
  // describe('loadPendingFactorySTN', () => {
  //   it('should return a stream with Factory Pending STN', () => {

  //   const parameters=10;
  //   const action = new actions.LoadBinRequestApprovalsCount();
  //   const outcome = new actions.LoadBinRequestApprovalsCountSuccess(parameters);
  //   actions$ = hot('-a', { a: action });

  //   const response$ = cold('-a|', { a: parameters });
  //  service.getBinRequestApprovalsCount.and.returnValue(response$);

  //   const expected$ = cold('--b', { b: outcome });
  //   expect(effect.binCount$).toBeObservable(expected$);
  // });

  // it('should fail and return an action with the error', () => {

  //   const action = new actions.LoadBinRequestApprovalsCount();
  //   const error = new Error('some error');
  //   const outcome = new actions.LoadBinRequestApprovalsCountFailure(
  //     CustomErrorAdaptor.fromJson(error)
  //   );
  //   actions$ = hot('-a', { a: action });
  //   const response$ = cold('-#|', {}, error);
  //    service.getBinRequestApprovalsCount.and.returnValue(response$);
  //   const expected = cold('--b', { b: outcome });
  //   expect(effect.binCount$).toBeObservable(expected);
  // });
  // });
  // describe('loadPendingFactorySTN', () => {
  //   it('should return a stream with Factory Pending STN', () => {

  //   const parameters=10;
  //   const action = new actions.LoadBinRequestApprovalsCount();
  //   const outcome = new actions.LoadBinRequestApprovalsCountSuccess(parameters);
  //   actions$ = hot('-a', { a: action });

  //   const response$ = cold('-a|', { a: parameters });
  //  service.getBinRequestApprovalsCount.and.returnValue(response$);

  //   const expected$ = cold('--b', { b: outcome });
  //   expect(effect.binCount$).toBeObservable(expected$);
  // });

  // it('should fail and return an action with the error', () => {

  //   const action = new actions.LoadBinRequestApprovalsCount();
  //   const error = new Error('some error');
  //   const outcome = new actions.LoadBinRequestApprovalsCountFailure(
  //     CustomErrorAdaptor.fromJson(error)
  //   );
  //   actions$ = hot('-a', { a: action });
  //   const response$ = cold('-#|', {}, error);
  //    service.getBinRequestApprovalsCount.and.returnValue(response$);
  //   const expected = cold('--b', { b: outcome });
  //   expect(effect.binCount$).toBeObservable(expected);
  // });
  // });
  // describe('loadPendingFactorySTN', () => {
  //   it('should return a stream with Factory Pending STN', () => {

  //   const parameters=10;
  //   const action = new actions.LoadBinRequestApprovalsCount();
  //   const outcome = new actions.LoadBinRequestApprovalsCountSuccess(parameters);
  //   actions$ = hot('-a', { a: action });

  //   const response$ = cold('-a|', { a: parameters });
  //  service.getBinRequestApprovalsCount.and.returnValue(response$);

  //   const expected$ = cold('--b', { b: outcome });
  //   expect(effect.binCount$).toBeObservable(expected$);
  // });

  // it('should fail and return an action with the error', () => {

  //   const action = new actions.LoadBinRequestApprovalsCount();
  //   const error = new Error('some error');
  //   const outcome = new actions.LoadBinRequestApprovalsCountFailure(
  //     CustomErrorAdaptor.fromJson(error)
  //   );
  //   actions$ = hot('-a', { a: action });
  //   const response$ = cold('-#|', {}, error);
  //    service.getBinRequestApprovalsCount.and.returnValue(response$);
  //   const expected = cold('--b', { b: outcome });
  //   expect(effect.binCount$).toBeObservable(expected);
  // });
  // });
});
