import { TestBed } from '@angular/core/testing';
import { hot, cold } from 'jasmine-marbles';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { DataPersistence } from '@nrwl/angular';
import { LoggerService } from '@poss-web/shared/util-logger';
import { Observable } from 'rxjs';
import { ConversionApprovalsEffects } from './conversion-approvals.effects';
import { ConversionApprovalsService } from '../conversion-approvals.service';
import {
  LoadApprovalRequestsList,
  LoadApprovalRequestsListFailure,
  LoadApprovalRequestsListSuccess,
  LoadMoreApprovalRequestsList,
  LoadMoreApprovalRequestsListFailure,
  LoadMoreApprovalRequestsListSuccess,
  LoadSelectedRequest,
  LoadSelectedRequestData,
  LoadSelectedRequestDataFailure,
  LoadSelectedRequestDataSuccess,
  LoadSelectedRequestFailure,
  LoadSelectedRequestSuccess,
  LoadThumbnailImageUrl,
  LoadThumbnailImageUrlFailure,
  LoadThumbnailImageUrlSuccess,
  UpdateApprovalRequestStatus,
  UpdateApprovalRequestStatusFailure,
  UpdateApprovalRequestStatusSuccess
} from './conversion-approvals.actions';
import {
  ConversionApprovalListingResponsePayload,
  ConversionApprovalRequestsListingPayload,
  ImageReqPayload,
  ImageResponse,
  SelectedRequestDataResponse,
  SelectedRequestDetailsResponse,
  SelectedRequestPayload,
  UpdateApprovalRequestStatusPayload
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import * as moment from 'moment';
import { CommonService } from '@poss-web/shared/common/data-access-common';

describe('Conversion Approval Effects Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: ConversionApprovalsEffects;

  const initialState = {};
  const conversionApprovalsServiceSpy: jasmine.SpyObj<ConversionApprovalsService> = jasmine.createSpyObj<
    ConversionApprovalsService
  >('ConversionApprovalsService', [
    'loadApprovalRequestsList',
    'getSelectedRequestDetails',
    'getSelectedRequestItems',
    'updateStatus'
  ]);
  const loggerService = jasmine.createSpyObj<LoggerService>('LoggerService', [
    'error'
  ]);
  const commonService = jasmine.createSpyObj<CommonService>('CommonService',[
    'getThumbnailImageUrl',
    'getImageUrl'
  ])

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ConversionApprovalsEffects,
        DataPersistence,
        provideMockStore({ initialState }),
        provideMockActions(() => actions$),
        {
          provide: ConversionApprovalsService,
          useValue: conversionApprovalsServiceSpy
        },
        {
          provide: LoggerService,
          useValue: loggerService
        },
        {
          provide: CommonService,
          useValue: commonService
        }
      ]
    });
    effect = TestBed.inject(ConversionApprovalsEffects);
  });

  describe('loadApprovalRequestsList Effects Testing', () => {
    const payload: ConversionApprovalRequestsListingPayload = {
      reqDocNo: 91,
      locationCode: 'CPD',
      status: 'APVL_PENDING',
      pageNumber: 1,
      pageSize: 8
    };

    it('should load approval requests list', () => {
      const responsePayload: ConversionApprovalListingResponsePayload = {
        approvalRequestsList: [
          {
            id: 239,
            reqDocNo: 91,
            requestDate: moment(1638815400000),
            locationCode: 'CPD',
            variantCode: null,
            productDescription: null,
            currencyCode: 'INR',
            totalQuantity: 1,
            totalValue: 139318.21,
            totalWeight: '2.803',
            weightUnit: 'gms',
            status: 'APVL_PENDING'
          }
        ],
        approvalRequestsLength: 8
      };

      const action = new LoadApprovalRequestsList(payload);
      const outCome = new LoadApprovalRequestsListSuccess(responsePayload);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: responsePayload });
      conversionApprovalsServiceSpy.loadApprovalRequestsList.and.returnValue(
        response$
      );
      const expected$ = cold('--b', { b: outCome });
      expect(effect.loadApprovalRequestsList$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadApprovalRequestsList(payload);
      const error = new Error('some error');
      const outCome = new LoadApprovalRequestsListFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      conversionApprovalsServiceSpy.loadApprovalRequestsList.and.returnValue(
        response$
      );
      const expected$ = cold('--b', { b: outCome });
      expect(effect.loadApprovalRequestsList$).toBeObservable(expected$);
    });
  });

  describe('loadMoreApprovalRequestsList Effects Testing', () => {
    const requestPayload: ConversionApprovalRequestsListingPayload = {
      reqDocNo: 91,
      locationCode: 'CPD',
      status: 'APVL_PENDING',
      pageNumber: 1,
      pageSize: 8
    };

    it('should load more approval requests', () => {
      const responsePayload: ConversionApprovalListingResponsePayload = {
        approvalRequestsList: [
          {
            id: 239,
            reqDocNo: 91,
            requestDate: moment(1638815400000),
            locationCode: 'CPD',
            variantCode: null,
            productDescription: null,
            currencyCode: 'INR',
            totalQuantity: 1,
            totalValue: 139318.21,
            totalWeight: '2.803',
            weightUnit: 'gms',
            status: 'APVL_PENDING'
          }
        ],
        approvalRequestsLength: 8
      };
      const action = new LoadMoreApprovalRequestsList(requestPayload);
      const outCome = new LoadMoreApprovalRequestsListSuccess(responsePayload);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: responsePayload });
      conversionApprovalsServiceSpy.loadApprovalRequestsList.and.returnValue(
        response$
      );
      const expected$ = cold('--b', { b: outCome });
      expect(effect.loadMoreApprovalRequestsList$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadMoreApprovalRequestsList(requestPayload);
      const error = new Error('some error');
      const outCome = new LoadMoreApprovalRequestsListFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      conversionApprovalsServiceSpy.loadApprovalRequestsList.and.returnValue(
        response$
      );
      const expected$ = cold('--b', { b: outCome });
      expect(effect.loadMoreApprovalRequestsList$).toBeObservable(expected$);
    });
  });

  describe('loadSeletedRequest Effects Testing', () => {
    const requestPayload: SelectedRequestPayload = {
      id: 239,
      requestType: 'CONV'
    };

    it('should Load selected request details', () => {
      const responsePayload: SelectedRequestDetailsResponse = {
        id: 239,
        reqDocNo: 91,
        status: 'APVL_PENDING',
        createdDate: moment(1638815400000),
        totalRequestedQuantity: 1,
        totalRequestedWeight: 2.803,
        totalRequestedValue: 139318.21,
        otherDetails: null,
        locationCode: 'CPD',
        requestRemarks: null,
        approvalRemarks: null
      };

      const action = new LoadSelectedRequest(requestPayload);
      const outCome = new LoadSelectedRequestSuccess(responsePayload);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: responsePayload });
      conversionApprovalsServiceSpy.getSelectedRequestDetails.and.returnValue(
        response$
      );
      const expected$ = cold('--b', { b: outCome });
      expect(effect.loadSeletedRequest$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadSelectedRequest(requestPayload);
      const error = new Error('some error');
      const outCome = new LoadSelectedRequestFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      conversionApprovalsServiceSpy.getSelectedRequestDetails.and.returnValue(
        response$
      );
      const expected$ = cold('--b', { b: outCome });
      expect(effect.loadSeletedRequest$).toBeObservable(expected$);
    });
  });

  describe('loadSelectedRequestItems Effects Testing', () => {
    const requestPayload: SelectedRequestPayload = {
      id: 239,
      requestType: 'CONV'
    };

    it('should load selected request data', () => {
      const responsePayload: SelectedRequestDataResponse = {
        conversionRequestItems: [
          {
            binCode: '',
            imageURL: '',
            thumbnailImageURL: '',
            inventoryId: '',
            itemCode: '',
            itemDetails: {
              complexityCode: '',
              itemCode: '',
              itemType: '',
              netWeight: '',
              remarks: '',
              sold: '',
              stonePrice: ''
            },
            lotNumber: '',
            mfgDate: moment(123456789),
            productCategory: '',
            productCategoryDesc: '',
            productGroup: '',
            productGroupDesc: '',
            stdValue: 1,
            stdWeight: 1,
            weightUnit: '',
            isStudded: true,
            isLoadingImage: false,
            isLoadingThumbnailImage: false
          }
        ],
        itemIds: ['']
      };

      const action = new LoadSelectedRequestData(requestPayload);
      const outCome = new LoadSelectedRequestDataSuccess(responsePayload);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: responsePayload });
      conversionApprovalsServiceSpy.getSelectedRequestItems.and.returnValue(
        response$
      );
      const expected$ = cold('--b', { b: outCome });
      expect(effect.loadSelectedRequestItems$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadSelectedRequestData(requestPayload);
      const error = new Error('some error');
      const outCome = new LoadSelectedRequestDataFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      conversionApprovalsServiceSpy.getSelectedRequestItems.and.returnValue(
        response$
      );
      const expected$ = cold('--b', { b: outCome });
      expect(effect.loadSelectedRequestItems$).toBeObservable(expected$);
    });
  });

  describe('updateApprovalRequestStatus Effects Testing', () => {
    const requestPayload: UpdateApprovalRequestStatusPayload = {
      id: 239,
      requestType: 'CONV',
      requestUpdateDto: {
        itemIds: [''],
        remarks: null,
        status: 'ACKNOWLEDGED'
      }
    };

    it('should update approval request status', () => {
      const responsePayload: SelectedRequestDetailsResponse = {
        id: 239,
        reqDocNo: 91,
        status: 'APVL_PENDING',
        createdDate: moment(1638815400000),
        totalRequestedQuantity: 1,
        totalRequestedWeight: 2.803,
        totalRequestedValue: 139318.21,
        otherDetails: null,
        locationCode: 'CPD',
        requestRemarks: null,
        approvalRemarks: null
      };

      const action = new UpdateApprovalRequestStatus(requestPayload);
      const outCome = new UpdateApprovalRequestStatusSuccess(responsePayload);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: responsePayload });
      conversionApprovalsServiceSpy.updateStatus.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.updateApprovalRequestStatus$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new UpdateApprovalRequestStatus(requestPayload);
      const error = new Error('some error');
      const outCome = new UpdateApprovalRequestStatusFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      conversionApprovalsServiceSpy.updateStatus.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.updateApprovalRequestStatus$).toBeObservable(expected$);
    });
  });
});
