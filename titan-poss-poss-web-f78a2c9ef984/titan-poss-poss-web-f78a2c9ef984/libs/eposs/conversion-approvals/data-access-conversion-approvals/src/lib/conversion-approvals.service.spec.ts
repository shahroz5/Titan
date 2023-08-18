import { TestBed } from '@angular/core/testing';
import { ConversionApprovalsService } from './conversion-approvals.service';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import {
  getConversionApprovalRequestsEndpointUrl,
  getRequestByIdEndpointUrl,
  getRequestItemsByIdEndpointUrl,
  getUpdateApprovalRequestStatusEndpointUrl
} from '@poss-web/shared/util-api-service';
import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import {
  ConversionApprovalRequestsListingPayload,
  SelectedRequestPayload,
  UpdateApprovalRequestStatusPayload
} from '@poss-web/shared/models';
import { ConversionAdaptor } from '@poss-web/shared/util-adaptors';
import * as moment from 'moment';

describe('Metal Rates Update Data Service Testing Suite', () => {
  let conversionApprovalsService: ConversionApprovalsService;
  let httpTestingController: HttpTestingController;
  const apiUrl = 'http://localhost:3000';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ConversionApprovalsService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    conversionApprovalsService = TestBed.inject(ConversionApprovalsService);
  });

  it('should be created', () => {
    expect(conversionApprovalsService).toBeTruthy();
  });

  it('loadApprovalRequestsList - should load approval requests list', () => {
    const respose = {
      approvalRequestsList: {
        id: 239,
        reqDocNo: 91,
        requestDate: moment(1638815400000),
        locationCode: 'CPD',
        variantCode: null,
        productDescription: null,
        currencyCode: 'INR',
        totalQuantity: 1,
        totalValue: 139318.21,
        totalWeight: 2.803,
        weightUnit: 'gms',
        status: 'APVL_PENDING'
      },
      approvalRequestsLength: 8
    };
    spyOn(ConversionAdaptor, 'getApprovalRequestsList').and.returnValue(
      respose
    );
    const requestPayload: ConversionApprovalRequestsListingPayload = {
      reqDocNo: 91,
      locationCode: 'CPD',
      status: 'APVL_PENDING',
      pageNumber: 1,
      pageSize: 8
    };
    const apiPath = getConversionApprovalRequestsEndpointUrl(requestPayload);

    conversionApprovalsService
      .loadApprovalRequestsList(requestPayload)
      .subscribe();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath.path;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('GET');
    expect(request.request.params.toString()).toEqual(
      apiPath.params.toString()
    );
    expect(request.request.responseType).toEqual('json');
    expect(request.request.params.get('requestType')).toEqual('CONV');
    expect(request.request.params.get('status')).toEqual('APVL_PENDING');
    expect(request.request.params.get('reqDocNo').toString()).toEqual('91');
    expect(request.request.params.get('reqLocationCode')).toEqual('CPD');
    expect(request.request.params.get('page').toString()).toEqual('1');
    expect(request.request.params.get('size').toString()).toEqual('8');

    request.flush({});
  });

  it('getSelectedRequestDetails - should get selected request details', () => {
    spyOn(ConversionAdaptor, 'getSelectedRequestItemDetails').and.returnValue(
      {}
    );
    const payload: SelectedRequestPayload = {
      id: 239,
      requestType: 'CONV'
    };
    const apiPath = getRequestByIdEndpointUrl(payload.id, payload.requestType);

    conversionApprovalsService.getSelectedRequestDetails(payload).subscribe();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath.path;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('GET');
    expect(request.request.params.toString()).toEqual(
      apiPath.params.toString()
    );
    expect(request.request.responseType).toEqual('json');
    expect(request.request.params.get('requestType')).toEqual('CONV');
    request.flush({});
  });

  it('getSelectedRequestItems - should get selected request items', () => {
    spyOn(ConversionAdaptor, 'SelectedRequestData').and.returnValue({});
    const payload: SelectedRequestPayload = {
      id: 239,
      requestType: 'CONV'
    };
    const apiPath = getRequestItemsByIdEndpointUrl(
      payload.id,
      payload.requestType
    );

    conversionApprovalsService.getSelectedRequestItems(payload).subscribe();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath.path;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('GET');
    expect(request.request.params.toString()).toEqual(
      apiPath.params.toString()
    );
    expect(request.request.responseType).toEqual('json');
    expect(request.request.params.get('requestType')).toEqual('CONV');
    request.flush({});
  });

  it('updateStatus - should update status', () => {
    spyOn(ConversionAdaptor, 'getSelectedRequestItemDetails').and.returnValue(
      {}
    );
    const payload: UpdateApprovalRequestStatusPayload = {
      id: 239,
      requestType: 'CONV',
      requestUpdateDto: {
        itemIds: [''],
        remarks: null,
        status: 'ACKNOWLEDGED'
      }
    };
    const apiPath = getUpdateApprovalRequestStatusEndpointUrl(
      payload.id,
      payload.requestType
    );

    conversionApprovalsService.updateStatus(payload).subscribe();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath.path;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('PATCH');
    expect(request.request.params.toString()).toEqual(
      apiPath.params.toString()
    );
    expect(request.request.responseType).toEqual('json');
    expect(request.request.params.get('requestType')).toEqual('CONV');
    request.flush({});
  });
});
