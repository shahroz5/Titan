import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { PaymentAdaptor, PaymentHelper } from '@poss-web/shared/util-adaptors';
import {
  getEditPaymentEndpointUrl,
  getUnipayEndpointUrl,
  verifyHostNameEndpointUrl
} from '@poss-web/shared/util-api-service';
import { UnipayService } from './unipay.service';
import {
  OtherDetailsForUnipay,
  PaymentDetails,
  PaymentGroupEnum,
  PaymentModeEnum,
  PaymentStatusEnum,
  SubTransactionTypeEnum,
  TransactionTypeEnum,
  UniPayRequest,
  UpdateUnipayPaylaod
} from '@poss-web/shared/models';
import * as moment from 'moment';

describe('UnipayService', () => {
  let httpTestingController: HttpTestingController;
  let unipayService: UnipayService;
  const apiUrl = 'http://localhost:3000';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        UnipayService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    unipayService = TestBed.inject(UnipayService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(unipayService).toBeTruthy();
  });

  describe('getUnipayConfiguration', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(PaymentAdaptor, 'getHostConfiguration').and.returnValue({});

      const path = verifyHostNameEndpointUrl();

      unipayService.getUnipayConfiguration().subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });

    // it('should call Payment Helper method with correct arguments', () => {
    //   spyOn(PaymentAdaptor, 'getHostConfiguration').and.returnValue({});
    //   const path = verifyHostNameEndpointUrl();

    //   const data = 'Unipay configuation';
    //   unipayService.getUnipayConfiguration().subscribe();

    //   const request = httpTestingController.expectOne(req => {
    //     return req.url === apiUrl + path;
    //   });

    //   request.flush(data);
    //   expect(PaymentAdaptor.getHostConfiguration).toHaveBeenCalledWith(data);
    // });

    it('should return data mapped by Payment Helper', () => {
      let helperResponse;

      spyOn(PaymentAdaptor, 'getHostConfiguration').and.returnValue(
        helperResponse
      );

      const path = verifyHostNameEndpointUrl();

      unipayService.getUnipayConfiguration().subscribe(data => {
        expect(data).toEqual(helperResponse);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush({});
    });
  });

  describe('updateUniPayment', () => {
    it('should call PATCH api method with correct url and params', () => {
      spyOn(PaymentHelper, 'getPaymentDetails').and.returnValue({});

      const payload: UpdateUnipayPaylaod = {
        status: PaymentStatusEnum.COMPLETED,
        transactionId: '123',
        transactionType: TransactionTypeEnum.CM,
        subTransactionType: SubTransactionTypeEnum.MANUAL_CM,
        updateUnipayPlayload: null
      };

      const url = getEditPaymentEndpointUrl(
        payload.transactionType,
        payload.subTransactionType,
        payload.transactionId,
        payload.status
      );

      unipayService.updateUniPayment(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('status')).toEqual(payload.status);

      request.flush({});
    });

    it('should call Payment Helper method with correct arguments', () => {
      spyOn(PaymentHelper, 'getPaymentDetails').and.returnValue({});
      const data: PaymentDetails = {
        amount: 100,
        id: 'WQ1223',
        paymentCode: PaymentModeEnum.CASH,
        paymentGroup: PaymentGroupEnum.REGULAR,
        instrumentDate: null,
        instrumentNo: '123',
        instrumentType: 'CAHS',
        lineItemNo: 1,
        otherDetails: null,
        reference1: 'REF_1',
        reference2: 'REF_2',
        reference3: 'REF_3',
        remarks: 'REMARKS',
        status: 'COMPLETE',
        bankName: 'BANK1',
        bankBranch: 'Bank Branch',
        isEditable: true
      };

      const payload: UpdateUnipayPaylaod = {
        status: PaymentStatusEnum.COMPLETED,
        transactionId: '123',
        transactionType: TransactionTypeEnum.CM,
        subTransactionType: SubTransactionTypeEnum.MANUAL_CM,
        updateUnipayPlayload: null
      };

      const url = getEditPaymentEndpointUrl(
        payload.transactionType,
        payload.subTransactionType,
        payload.transactionId,
        payload.status
      );

      unipayService.updateUniPayment(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush(data);
      expect(PaymentHelper.getPaymentDetails).toHaveBeenCalledWith(data);
    });

    it('should return data mapped by Payment Helper', () => {
      const helperResponse: PaymentDetails = {
        amount: 100,
        id: 'WQ1223',
        paymentCode: PaymentModeEnum.CASH,
        paymentGroup: PaymentGroupEnum.REGULAR,
        instrumentDate: null,
        instrumentNo: '123',
        instrumentType: 'CAHS',
        lineItemNo: 1,
        otherDetails: null,
        reference1: 'REF_1',
        reference2: 'REF_2',
        reference3: 'REF_3',
        remarks: 'REMARKS',
        status: 'COMPLETE',
        bankName: 'BANK1',
        bankBranch: 'Bank Branch',
        isEditable: true
      };

      spyOn(PaymentHelper, 'getPaymentDetails').and.returnValue(helperResponse);

      const payload: UpdateUnipayPaylaod = {
        status: PaymentStatusEnum.COMPLETED,
        transactionId: '123',
        transactionType: TransactionTypeEnum.CM,
        subTransactionType: SubTransactionTypeEnum.MANUAL_CM,
        updateUnipayPlayload: null
      };

      const url = getEditPaymentEndpointUrl(
        payload.transactionType,
        payload.subTransactionType,
        payload.transactionId,
        payload.status
      );

      unipayService.updateUniPayment(payload).subscribe(data => {
        expect(data).toEqual(helperResponse);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      request.flush({});
    });
  });

  describe('startUnipayPayment', () => {
    it('should call PATCH api method with correct url and params', () => {
      spyOn(PaymentAdaptor, 'getUnipayResponse').and.returnValue({});

      const payload: UniPayRequest = {
        transactionType: TransactionTypeEnum.CM,
        subTransactionType: SubTransactionTypeEnum.NEW_CM,
        txnType: 123,
        txnMode: 123,
        txnId: '123',
        txnAmount: 100,
        date: moment().format(),
        BankInvoiceNumber: 123
      };

      const url = getUnipayEndpointUrl(payload);

      unipayService.startUnipayPayment(payload).subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === url.path;
      });

      const UniPayPayload: string =
        payload.txnType +
        ',' +
        payload.txnMode +
        ',' +
        payload.txnId +
        ',' +
        payload.txnAmount * 100 +
        ',' +
        payload.date;

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('value')).toEqual(UniPayPayload);

      request.flush({});
    });

    it('should call Payment Helper method with correct arguments', () => {
      spyOn(PaymentAdaptor, 'getUnipayResponse').and.returnValue({});

      const payload: UniPayRequest = {
        transactionType: TransactionTypeEnum.CM,
        subTransactionType: SubTransactionTypeEnum.NEW_CM,
        txnType: 123,
        txnMode: 123,
        txnId: '123',
        txnAmount: 100,
        date: moment().format(),
        BankInvoiceNumber: 123
      };

      const data: OtherDetailsForUnipay = {
        url: 'Test url',
        request: 'Test data',
        response: 'Test data',
        requestTime: '200',
        responseTime: '200',
        totalTime: 200,
        httpStatus: 200,
        transactionStatus: true,
        cardNumber: '123',
        referenceNumber: 'Ref'
      };
      const url = getUnipayEndpointUrl(payload);

      unipayService.startUnipayPayment(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === url.path;
      });

      request.flush(data);
      expect(PaymentAdaptor.getUnipayResponse).toHaveBeenCalledWith(data);
    });

    it('should return data mapped by Payment Helper', () => {
      const helperResponse: OtherDetailsForUnipay = {
        url: 'Test url',
        request: 'Test data',
        response: 'Test data',
        requestTime: '200',
        responseTime: '200',
        totalTime: 200,
        httpStatus: 200,
        transactionStatus: true,
        cardNumber: '123',
        referenceNumber: 'Ref'
      };

      spyOn(PaymentAdaptor, 'getUnipayResponse').and.returnValue(
        helperResponse
      );

      const payload: UniPayRequest = {
        transactionType: TransactionTypeEnum.CM,
        subTransactionType: SubTransactionTypeEnum.NEW_CM,
        txnType: 123,
        txnMode: 123,
        txnId: '123',
        txnAmount: 100,
        date: moment().format(),
        BankInvoiceNumber: 123
      };
      const url = getUnipayEndpointUrl(payload);

      unipayService.startUnipayPayment(payload).subscribe(data => {
        expect(data).toEqual(helperResponse);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === url.path;
      });
      request.flush({});
    });
  });
});
