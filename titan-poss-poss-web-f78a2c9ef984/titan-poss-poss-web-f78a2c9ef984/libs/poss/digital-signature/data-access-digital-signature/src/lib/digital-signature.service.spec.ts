import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { DigitalSignatureService } from './digital-signature.service';
import {
  generateOTPForCustomerSignatureUrl,
  getCustomerDetailsForDigitalSignatureUrl,
  getEmployeeSignatureDetailsUrl,
  uploadDigitalSignatureUrl,
  uploadEmployeeSignatureUrl,
  validateOTPForCustomerSignatureUrl
} from '@poss-web/shared/util-api-service';
import { CustomerDigitalSignatureRequestPayload } from '@poss-web/shared/models';

describe('DigitalSignatureService', () => {
  let httpTestingController: HttpTestingController;
  let digitalSignatureService: DigitalSignatureService;
  const apiUrl = 'http://localhost:3000';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        DigitalSignatureService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    digitalSignatureService = TestBed.inject(DigitalSignatureService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(digitalSignatureService).toBeTruthy();
  });

  it('getCustomerDetailsForDigitalSignature - should get customer details for digital signature', () => {
    const apiPath = getCustomerDetailsForDigitalSignatureUrl(
      '9988776655',
      null
    );
    digitalSignatureService
      .getCustomerDetailsForDigitalSignature('9988776655', null)
      .subscribe();

    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath.path;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('GET');
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });

  it('sendCustomerDetailsForDigitalSignature - should send customer details for digital signature', () => {
    const apiPath = getCustomerDetailsForDigitalSignatureUrl();
    const payload: CustomerDigitalSignatureRequestPayload = {
      applicableTransactionTypes: {
        type: '',
        data: {
          isAdvanceOrderOrBooking: false,
          isCashMemo: true,
          isGHS: false,
          isAcceptAdvance: false,
          isGRN: false,
          isGRF: true,
          isGiftCard: false,
          isCNCancellation: false,
          isTEPDeclarationAndExchangeForm: false,
          isGEPDeclarationAndExchangeForm: false,
          isCCAFRequestServicePaymentOrCustomerOrder: false
        }
      },
      emailId: 'abc@email.com',
      mobileNumber: '9999999999',
      ulpNumber: '23456',
      customerType: 'REGULAR'
    };
    digitalSignatureService
      .sendCustomerDetailsForDigitalSignature(payload)
      .subscribe();

    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath.path;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('POST');
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });

  it('uploadDigitalSignature - should Upload digital signature', () => {
    const apiPath = uploadDigitalSignatureUrl('9988776655', 'REGULAR');
    const payload: CustomerDigitalSignatureRequestPayload = {
      applicableTransactionTypes: {
        type: '',
        data: {
          isAdvanceOrderOrBooking: false,
          isCashMemo: true,
          isGHS: false,
          isAcceptAdvance: false,
          isGRN: false,
          isGRF: true,
          isGiftCard: false,
          isCNCancellation: false,
          isTEPDeclarationAndExchangeForm: false,
          isGEPDeclarationAndExchangeForm: false,
          isCCAFRequestServicePaymentOrCustomerOrder: false
        }
      },
      emailId: 'abc@email.com',
      mobileNumber: '9999999999',
      ulpNumber: '23456',
      customerType: 'REGULAR'
    };
    digitalSignatureService
      .uploadDigitalSignature('9988776655', 'REGULAR', 'signature')
      .subscribe();

    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath.path;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('POST');
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });

  it('validateOTPForCustomerSignature - should Validate OTP for Customer signature', () => {
    const apiPath = validateOTPForCustomerSignatureUrl('123', '123456');
    digitalSignatureService
      .validateOTPForCustomerSignature('123', '123456')
      .subscribe();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath.path;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('PUT');
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });

  it('sendOTPForCustomerSignature - should Send OTP for Customer signature', () => {
    const apiPath = generateOTPForCustomerSignatureUrl('123');
    digitalSignatureService.sendOTPForCustomerSignature('123').subscribe();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath.path;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('POST');
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });

  it('getEmployeeSignatureDetails - should Get Employee Signature Details', () => {
    const apiPath = getEmployeeSignatureDetailsUrl('cashiercpd');
    digitalSignatureService
      .getEmployeeSignatureDetails('cashiercpd')
      .subscribe();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath.path;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('GET');
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });

  it('uploadEmployeeSignature - should Upload Employee Signature Details', () => {
    const apiPath = uploadEmployeeSignatureUrl('cashiercpd');
    digitalSignatureService
      .uploadEmployeeSignature('cashiercpd', 'cashierSignature')
      .subscribe();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath.path;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('POST');
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });
});
