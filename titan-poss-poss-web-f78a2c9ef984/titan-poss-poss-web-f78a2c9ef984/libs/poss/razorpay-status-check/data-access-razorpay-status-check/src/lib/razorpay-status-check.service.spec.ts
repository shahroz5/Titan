import { TestBed } from '@angular/core/testing';
import {
  AirpayPaymentAdaptor,
  AirpayPaymentsHelper
} from '@poss-web/shared/util-adaptors';
import { RazorpayStatusCheckService } from './razorpay-status-check.service';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import {
  CustomerPayload,
  GenerateCnPayload,
  LoadPaymentRequestPayload,
  PaymentRequestDetails,
  SearchCustomerPayload,
  SEARCH_BY_ENUM
} from '@poss-web/shared/models';
import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import {
  airpayGenerateCnEndpointUrl,
  getAirpayRequestsUrl,
  getCustomerSearchUrl,
  validateAirpayPaymentRequestsEndpointUrl
} from '@poss-web/shared/util-api-service';

describe('RazorpayStatusCheckService', () => {
  let service: RazorpayStatusCheckService;
  let httpTestingController: HttpTestingController;
  const apiUrl = 'http://localhost:3000';

  const dummyCustomerSearchResponse: CustomerPayload = {
    currentTier: 'Encircle Silver',
    custTaxNo: null,
    customerDetails: {
      data: {},
      type: 'REGULAR'
    },
    customerId: 174,
    customerName: 'JOE',
    customerType: 'REGULAR',
    // emailId: "jobitsunny@gmail.com",
    instiTaxNo: null,
    isMemberBlocked: false,
    isPulseCustomer: false,
    mobileNumber: '9745512430',
    passportId: null,
    title: 'Mr',
    ulpId: '700001977805'
  };

  const dummyPaymentDetailsResponse: PaymentRequestDetails = {
    amount: 1234,
    approvedBy: null,
    approvedDate: null,
    approvedReason: null,
    // currencyCode: 'INR',
    customerId: 174,
    // docDate: null,
    // fiscalYear: 2020,
    id: '10E617F7-28D3-43A6-952E-ACEB944CB0EE',
    locationCode: 'CPD',
    otherDetails: {
      data: {},
      type: 'RAZOR PAY'
    },
    paymentCode: 'RAZOR PAY',
    referenceId: 'plink_HTHafZjAa4pfYL',
    requestedBy: 'cashiercpd',
    requestedDate: 1624905000000,
    requestedReason: null,
    status: 'OPEN',
    utilizedAmount: null,
    customerName: 'JOE',
    customerMobileNo: '9745512430',
    customerTitle: 'Mr.',
    ulpId: '7001234567',
    isVerifying: false
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        RazorpayStatusCheckService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(RazorpayStatusCheckService);
  });
  afterEach(() => {
    httpTestingController.verify();
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  describe('searchCustomer', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(AirpayPaymentAdaptor, 'fromJson').and.returnValue({});

      const reqPaylod: SearchCustomerPayload = {
        searchFieldValue: '9745512430',
        searchType: SEARCH_BY_ENUM.MOBILE_NO
      };
      const { path, params } = getCustomerSearchUrl(
        reqPaylod.searchType,
        reqPaylod.searchFieldValue
      );
      service.searchCustomer(reqPaylod).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('searchType')).toEqual(
        SEARCH_BY_ENUM.MOBILE_NO
      );
      expect(request.request.params.get('searchField')).toEqual('9745512430');

      request.flush({});
    });
    it('should call fromJson adaptor method with correct arguments', () => {
      spyOn(AirpayPaymentAdaptor, 'fromJson').and.returnValue({});
      const reqPaylod: SearchCustomerPayload = {
        searchFieldValue: '9745512430',
        searchType: SEARCH_BY_ENUM.MOBILE_NO
      };
      const { path, params } = getCustomerSearchUrl(
        reqPaylod.searchType,
        reqPaylod.searchFieldValue
      );
      service.searchCustomer(reqPaylod).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush(dummyCustomerSearchResponse);
      expect(AirpayPaymentAdaptor.fromJson).toHaveBeenCalledWith(
        dummyCustomerSearchResponse
      );
    });

    it('should retun data mapped by adaptor', () => {
      spyOn(AirpayPaymentAdaptor, 'fromJson').and.returnValue(
        dummyCustomerSearchResponse
      );
      const reqPaylod: SearchCustomerPayload = {
        searchFieldValue: '9745512430',
        searchType: SEARCH_BY_ENUM.MOBILE_NO
      };
      const path = getCustomerSearchUrl(
        reqPaylod.searchType,
        reqPaylod.searchFieldValue
      ).path;

      service.searchCustomer(reqPaylod).subscribe(data => {
        expect(data).toEqual(dummyCustomerSearchResponse);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush({});
    });
  });

  describe('getPaymentDetails', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(AirpayPaymentsHelper, 'getAirpayPaymentsDetails').and.returnValue(
        {}
      );

      const reqPaylod: LoadPaymentRequestPayload = {
        page: 0,

        paymentCode: 'RAZOR PAY',
        payload: {
          customerId: 174,
          dateRangeType: 'CUSTOM',
          endDate: 1625768999999,
          fiscalYear: null,
          isWorkFlowApproval: false,
          referenceId: null,
          startDate: 1625682600000,
          status: ['COMPLETED', 'IN_PROGRESS', 'OPEN']
        },
        size: 10
      };
      const { path, params } = getAirpayRequestsUrl(
        reqPaylod.page,
        reqPaylod.paymentCode,
        reqPaylod.size,
        reqPaylod.sort
      );
      service.getPaymentDetails(reqPaylod).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('page')).toEqual('0');
      expect(request.request.params.get('size')).toEqual('10');
      expect(request.request.params.get('paymentCode')).toEqual('RAZOR PAY');

      request.flush({});
    });
    it('should call getAirpayPaymentsDetails AirpayPaymentsHelper method with correct arguments', () => {
      spyOn(AirpayPaymentsHelper, 'getAirpayPaymentsDetails').and.returnValue(
        {}
      );
      const reqPaylod: LoadPaymentRequestPayload = {
        page: 0,

        paymentCode: 'RAZOR PAY',
        payload: {
          customerId: 174,
          dateRangeType: 'CUSTOM',
          endDate: 1625768999999,
          fiscalYear: null,
          isWorkFlowApproval: false,
          referenceId: null,
          startDate: 1625682600000,
          status: ['COMPLETED', 'IN_PROGRESS', 'OPEN']
        },
        size: 10
      };
      const { path, params } = getAirpayRequestsUrl(
        reqPaylod.page,
        reqPaylod.paymentCode,
        reqPaylod.size,
        reqPaylod.sort
      );
      service.getPaymentDetails(reqPaylod).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush([dummyPaymentDetailsResponse]);
      expect(
        AirpayPaymentsHelper.getAirpayPaymentsDetails
      ).toHaveBeenCalledWith([dummyPaymentDetailsResponse]);
    });
    it('should retun data mapped by AirpayPaymentsHelper', () => {
      spyOn(AirpayPaymentsHelper, 'getAirpayPaymentsDetails').and.returnValue({
        payments: [dummyPaymentDetailsResponse],
        count: 1
      });
      const reqPaylod: LoadPaymentRequestPayload = {
        page: 0,

        paymentCode: 'RAZOR PAY',
        payload: {
          customerId: 174,
          dateRangeType: 'CUSTOM',
          endDate: 1625768999999,
          fiscalYear: null,
          isWorkFlowApproval: false,
          referenceId: null,
          startDate: 1625682600000,
          status: ['COMPLETED', 'IN_PROGRESS', 'OPEN']
        },
        size: 10
      };
      const path = getAirpayRequestsUrl(
        reqPaylod.page,
        reqPaylod.paymentCode,
        reqPaylod.size,
        reqPaylod.sort
      ).path;

      service.getPaymentDetails(reqPaylod).subscribe(data => {
        expect(data).toEqual({
          payments: [dummyPaymentDetailsResponse],
          count: 1
        });
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush({});
    });
  });

  describe('validatePayment', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(AirpayPaymentAdaptor, 'paymentDetails').and.returnValue({});

      const reqPaylod = '10E617F7-28D3-43A6-952E-ACEB944CB0EE';
      const { path, params } = validateAirpayPaymentRequestsEndpointUrl(
        reqPaylod
      );
      service.validatePayment(reqPaylod).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.responseType).toEqual('json');
      expect(request.request.url).toContain(reqPaylod);

      request.flush({});
    });
    it('should call paymentDetails AirpayPaymentAdaptor method with correct arguments', () => {
      spyOn(AirpayPaymentAdaptor, 'paymentDetails').and.returnValue({});
      const reqPaylod = '10E617F7-28D3-43A6-952E-ACEB944CB0EE';
      const { path, params } = validateAirpayPaymentRequestsEndpointUrl(
        reqPaylod
      );
      service.validatePayment(reqPaylod).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush(dummyPaymentDetailsResponse);
      expect(AirpayPaymentAdaptor.paymentDetails).toHaveBeenCalledWith(
        dummyPaymentDetailsResponse
      );
    });
    it('should retun data mapped by AirpayPaymentAdaptor', () => {
      spyOn(AirpayPaymentAdaptor, 'paymentDetails').and.returnValue(
        dummyPaymentDetailsResponse
      );
      const reqPaylod = '10E617F7-28D3-43A6-952E-ACEB944CB0EE';
      const path = validateAirpayPaymentRequestsEndpointUrl(reqPaylod).path;

      service.validatePayment(reqPaylod).subscribe(data => {
        expect(data).toEqual(dummyPaymentDetailsResponse);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush({});
    });
  });

  describe('generateCN', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(AirpayPaymentAdaptor, 'paymentDetails').and.returnValue({});

      const reqPaylod: GenerateCnPayload = {
        id: '10E617F7-28D3-43A6-952E-ACEB944CB0EE'
      };

      const { path, params } = airpayGenerateCnEndpointUrl(reqPaylod);
      service.generateCN(reqPaylod).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.responseType).toEqual('json');
      expect(request.request.url).toContain(reqPaylod.id);

      request.flush({});
    });
    it('should call paymentDetails AirpayPaymentAdaptor method with correct arguments', () => {
      spyOn(AirpayPaymentAdaptor, 'paymentDetails').and.returnValue({});
      const reqPaylod: GenerateCnPayload = {
        id: '10E617F7-28D3-43A6-952E-ACEB944CB0EE'
      };
      const { path, params } = airpayGenerateCnEndpointUrl(reqPaylod);
      service.generateCN(reqPaylod).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush(dummyPaymentDetailsResponse);
      expect(AirpayPaymentAdaptor.paymentDetails).toHaveBeenCalledWith(
        dummyPaymentDetailsResponse
      );
    });
    it('should retun data mapped by AirpayPaymentAdaptor', () => {
      spyOn(AirpayPaymentAdaptor, 'paymentDetails').and.returnValue(
        dummyPaymentDetailsResponse
      );
      const reqPaylod: GenerateCnPayload = {
        id: '10E617F7-28D3-43A6-952E-ACEB944CB0EE'
      };
      const { path, params } = airpayGenerateCnEndpointUrl(reqPaylod);
      service.generateCN(reqPaylod).subscribe(data => {
        expect(data).toEqual(dummyPaymentDetailsResponse);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush({});
    });
  });
});
