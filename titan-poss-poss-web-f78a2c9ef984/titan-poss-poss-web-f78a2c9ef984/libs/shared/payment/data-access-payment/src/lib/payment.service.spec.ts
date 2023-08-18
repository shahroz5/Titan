import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { PaymentService } from './payment.service';
import { PaymentHelper, PaymentAdaptor } from '@poss-web/shared/util-adaptors';
import {
  TransactionTypeEnum,
  ConfigTypeEnum,
  AllowedPaymentsResponse,
  PaymentModeEnum,
  PaymentGroupEnum,
  IntegratedPaymentRequestPayload,
  PaymentRequest,
  SubTransactionTypeEnum,
  PaymentStatusEnum,
  CashPaymentPayload,
  PaymentDetails,
  PaymentConfig,
  ROPaymentRequestStatus,
  PaymentType,
  CashPayment,
  WalletPayment,
  QCGCGetBalancePayload,
  BankLoanPayment,
  GiftCardTxnEnum,
  QCGCCardDetails,
  ROPayment,
  ROManualPayment,
  GHSeVoucherDetails,
  CNListRequestPayload,
  CNListResponse,
  CNListResponsePayload,
  GVStatusListingPayload,
  GVStatusUpdateList,
  InvokeCNRequestPayload,
  ThirdPartyCNRequestPayload,
  GenerateOtpPayload,
  CashLimitDetails
} from '@poss-web/shared/models';
import {
  getPaymentModesEndpointUrl,
  getPaymentRequestUrl,
  getEditPaymentEndpointUrl,
  getPaymentEndpointUrl,
  getLoadPaymentDetailsEndpointUrl,
  getPayerBanksEndpointUrl,
  getCustomerUrl,
  getMaxCashLimitEndpointUrl,
  validatePaymentEndpointUrl,
  getConfirmPaymentEndpointUrl,
  getCmRequestDetailsUrl,
  getPaymentRequestStatusURL,
  getROPaymentRequestStatusURLByID,
  getBankPrioritiesEndpointUrl,
  getPayeeBanksEndpointUrl,
  getAddPaymentEndpointUrl,
  getQCGCPaymentEndpointURl,
  getQCGCProductGroupEndpointURl,
  getQCGCPaymentCustomerEndpointURl,
  getCnPriorityUrl,
  getCnRequestListUrl,
  getLoadCreditNoteDetailsEndpointUrl,
  getGVBalanceUrl,
  getConfirmlinkedCNPaymentEndpointUrl,
  generateOTPForCnUrl,
  getInvokeCNUrl,
  getThirdPartyCnRequestListUrl
} from '@poss-web/shared/util-api-service';
import * as moment from 'moment';
import { HttpClientModule } from '@angular/common/http';
import { CryptoService } from '@poss-web/shared/auth/data-access-auth';

describe('PaymentService', () => {
  let httpTestingController: HttpTestingController;
  let paymentService: PaymentService;
  const apiUrl = 'http://localhost:3000';
  let mockEncryptPassword;

  beforeEach(() => {
    mockEncryptPassword = jasmine.createSpyObj(['encryptPassword']);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, HttpClientModule],
      providers: [
        PaymentService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        },
        {
          provide: CryptoService,
          useValue: mockEncryptPassword
        },
        {
          provide: 'env',
          useValue: 'DEV'
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    paymentService = TestBed.inject(PaymentService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(paymentService).toBeTruthy();
  });

  describe('getAllowedPayments', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(PaymentHelper, 'getAllowedPayments').and.returnValue({});

      const type = TransactionTypeEnum.CM;

      const { path, params } = getPaymentModesEndpointUrl(type);

      paymentService.getAllowedPayments(type).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('config-type')).toEqual(
        ConfigTypeEnum.PAYMENT_CONFIGURATIONS
      );

      request.flush({});
    });

    it('should call Payment Helper method with correct arguments', () => {
      spyOn(PaymentHelper, 'getAllowedPayments').and.returnValue({});
      const type = TransactionTypeEnum.CM;
      const apiResponse = ['CASH', 'CARD', 'DD'];

      const { path } = getPaymentModesEndpointUrl(type);

      paymentService.getAllowedPayments(type).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(apiResponse);
      expect(PaymentHelper.getAllowedPayments).toHaveBeenCalledWith(
        apiResponse
      );
    });

    it('should return data mapped by Payment Helper', () => {
      const helperResponse: AllowedPaymentsResponse = {
        allowedPayments: new Map<PaymentModeEnum, PaymentGroupEnum>().set(
          PaymentModeEnum.CASH,
          PaymentGroupEnum.REGULAR
        ),
        wallets: ['GPAY', 'PHONEPE'],
        subBankLoans: ['BANK LOAN 1'],
        customerSpecificPayments: [PaymentModeEnum.CASH],
        customerSpecificWalletPayments: ['PHONEPE'],
        customerSpecificBankLoanPayments: ['BANK LOAN 1']
      };

      spyOn(PaymentHelper, 'getAllowedPayments').and.returnValue(
        helperResponse
      );

      const type = TransactionTypeEnum.CM;

      const { path } = getPaymentModesEndpointUrl(type);

      paymentService.getAllowedPayments(type).subscribe(data => {
        expect(data).toEqual(helperResponse);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush({});
    });
  });

  describe('sendROPaymentRquest', () => {
    it('should call POST api method with correct url and params', () => {
      spyOn(PaymentAdaptor, 'getROPaymentRequest').and.returnValue({});
      const requestBody: IntegratedPaymentRequestPayload = {
        amount: 100,
        customerId: '22',
        paymentCode: 'RO',
        requestedReason: 'TEST'
      };

      const path = getPaymentRequestUrl();

      paymentService.sendROPaymentRquest(requestBody).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.body as Object).toEqual(
        JSON.stringify(requestBody)
      );
      request.flush({});
    });

    it('should call Payment Adaptor method with correct arguments', () => {
      spyOn(PaymentAdaptor, 'getROPaymentRequest').and.returnValue({});
      const requestBody: IntegratedPaymentRequestPayload = {
        amount: 100,
        customerId: '22',
        paymentCode: 'RO',
        requestedReason: 'TEST'
      };

      const apiResponse: PaymentRequest = {
        customerId: 11,
        paymentCode: 'RO',
        amount: 100,
        requestedReason: 'Test',
        approvedBy: 'RSO',
        referenceId: 'REF_ID',
        id: '123AWW',
        status: 'APPROVED',
        utilizedAmount: 100,
        locationCode: 'URB',
        requestedBy: 'RAKESH',
        requestedDate: null,
        approvedDate: null,
        approvedReason: 'Test',
        otherDetails: null
      };

      const path = getPaymentRequestUrl();

      paymentService.sendROPaymentRquest(requestBody).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(apiResponse);
      expect(PaymentAdaptor.getROPaymentRequest).toHaveBeenCalledWith(
        apiResponse
      );
    });

    it('should return data mapped by  Payment Adaptor', () => {
      const helperResponse: PaymentRequest = {
        customerId: 11,
        paymentCode: 'RO',
        amount: 100,
        requestedReason: 'Test',
        approvedBy: 'RSO',
        referenceId: 'REF_ID',
        id: '123AWW',
        status: 'APPROVED',
        utilizedAmount: 100,
        locationCode: 'URB',
        requestedBy: 'RAKESH',
        requestedDate: null,
        approvedDate: null,
        approvedReason: 'Test',
        otherDetails: null
      };
      const requestBody: IntegratedPaymentRequestPayload = {
        amount: 100,
        customerId: '22',
        paymentCode: 'RO',
        requestedReason: 'TEST'
      };

      spyOn(PaymentAdaptor, 'getROPaymentRequest').and.returnValue(
        helperResponse
      );

      const path = getPaymentRequestUrl();

      paymentService.sendROPaymentRquest(requestBody).subscribe(data => {
        expect(data).toEqual(helperResponse);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });

  describe('editPayment', () => {
    it('should call PATCH api method with correct url and params', () => {
      spyOn(PaymentHelper, 'getPaymentDetails').and.returnValue({});

      const transactionType = TransactionTypeEnum.CM;
      const subTransactionType = SubTransactionTypeEnum.NEW_CM;
      const paymentId = '1234';

      const details: CashPaymentPayload = {
        amount: 100
      };

      const { path, params } = getEditPaymentEndpointUrl(
        transactionType,
        subTransactionType,
        paymentId,
        PaymentStatusEnum.COMPLETED
      );

      paymentService
        .editPayment(transactionType, subTransactionType, paymentId, details)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.body as Object).toEqual(JSON.stringify(details));
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.params.get('status')).toEqual(
        PaymentStatusEnum.COMPLETED
      );
      expect(request.request.params.get('txnType')).toEqual(transactionType);
      expect(request.request.params.get('subTxnType')).toEqual(
        subTransactionType
      );
      request.flush({});
    });

    it('should call Payment Helper method with correct arguments', () => {
      spyOn(PaymentHelper, 'getPaymentDetails').and.returnValue({});

      const apiResponse: PaymentDetails = {
        amount: 100,
        id: 'WQ1223',
        paymentCode: PaymentModeEnum.CASH,
        paymentGroup: PaymentGroupEnum.REGULAR,
        instrumentDate: moment(),
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

      const transactionType = TransactionTypeEnum.CM;
      const subTransactionType = SubTransactionTypeEnum.NEW_CM;
      const paymentId = '1234';

      const details: CashPaymentPayload = {
        amount: 100
      };

      const { path } = getEditPaymentEndpointUrl(
        transactionType,
        subTransactionType,
        paymentId,
        PaymentStatusEnum.COMPLETED
      );

      paymentService
        .editPayment(transactionType, subTransactionType, paymentId, details)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush(apiResponse);
      expect(PaymentHelper.getPaymentDetails).toHaveBeenCalledWith(apiResponse);
    });

    it('should return data mapped by  Payment Helper', () => {
      const helperResponse: PaymentDetails = {
        amount: 100,
        id: 'WQ1223',
        paymentCode: PaymentModeEnum.CASH,
        paymentGroup: PaymentGroupEnum.REGULAR,
        instrumentDate: moment(),
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

      const transactionType = TransactionTypeEnum.CM;
      const subTransactionType = SubTransactionTypeEnum.NEW_CM;
      const paymentId = '1234';

      const details: CashPaymentPayload = {
        amount: 100
      };

      const { path } = getEditPaymentEndpointUrl(
        transactionType,
        subTransactionType,
        paymentId,
        PaymentStatusEnum.COMPLETED
      );

      paymentService
        .editPayment(transactionType, subTransactionType, paymentId, details)
        .subscribe(data => {
          expect(data).toEqual(helperResponse);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });

  // describe('deletePayment', () => {
  //   it('should call DELETE api method with correct url and params', () => {
  //     const transactionType = TransactionTypeEnum.CM;
  //     const subTransactionType = SubTransactionTypeEnum.NEW_CM;
  //     const paymentId = '1234';

  //     const { path, params } = getPaymentEndpointUrl(
  //       transactionType,
  //       subTransactionType,
  //       paymentId
  //     );

  //     paymentService
  //       .deletePayment(transactionType, subTransactionType, paymentId)
  //       .subscribe();

  //     const request = httpTestingController.expectOne(req => {
  //       return req.url === apiUrl + path;
  //     });

  //     expect(request.cancelled).toBeFalsy();
  //     expect(request.request.method).toEqual('DELETE');
  //     expect(request.request.responseType).toEqual('json');
  //     expect(request.request.params.toString()).toEqual(params.toString());

  //     request.flush({});
  //   });
  // });

  describe('loadPaymentDetails', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(PaymentHelper, 'getPaymentList').and.returnValue({});

      const transactionType = TransactionTypeEnum.CM;
      const subTransactionType = SubTransactionTypeEnum.NEW_CM;
      const txntId = '1234';

      const { path, params } = getLoadPaymentDetailsEndpointUrl(
        txntId,
        transactionType,
        subTransactionType
      );

      paymentService
        .loadPaymentDetails(txntId, transactionType, subTransactionType)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.params.get('transactionId')).toEqual(txntId);
      expect(request.request.params.get('txnType')).toEqual(transactionType);
      expect(request.request.params.get('subTxnType')).toEqual(
        subTransactionType
      );
      request.flush({});
    });

    it('should call Payment Helper method with correct arguments', () => {
      spyOn(PaymentHelper, 'getPaymentList').and.returnValue({});

      const apiResponse: PaymentDetails[] = [
        {
          amount: 100,
          id: 'WQ1223',
          paymentCode: PaymentModeEnum.CASH,
          paymentGroup: PaymentGroupEnum.REGULAR,
          instrumentDate: moment(),
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
        }
      ];

      const transactionType = TransactionTypeEnum.CM;
      const subTransactionType = SubTransactionTypeEnum.NEW_CM;
      const txntId = '1234';

      const { path } = getLoadPaymentDetailsEndpointUrl(
        txntId,
        transactionType,
        subTransactionType
      );

      paymentService
        .loadPaymentDetails(txntId, transactionType, subTransactionType)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(apiResponse);
      expect(PaymentHelper.getPaymentList).toHaveBeenCalledWith(apiResponse);
    });

    it('should return data mapped by  Payment Helper', () => {
      const helperResponse: PaymentDetails[] = [
        {
          amount: 100,
          id: 'WQ1223',
          paymentCode: PaymentModeEnum.CASH,
          paymentGroup: PaymentGroupEnum.REGULAR,
          instrumentDate: moment(),
          instrumentNo: '1234',
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
        }
      ];

      spyOn(PaymentHelper, 'getPaymentList').and.returnValue(helperResponse);

      const transactionType = TransactionTypeEnum.CM;
      const subTransactionType = SubTransactionTypeEnum.NEW_CM;
      const txntId = '1234';

      const { path } = getLoadPaymentDetailsEndpointUrl(
        txntId,
        transactionType,
        subTransactionType
      );

      paymentService
        .loadPaymentDetails(txntId, transactionType, subTransactionType)
        .subscribe(data => {
          expect(data).toEqual(helperResponse);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });

  describe('loadPayerBanks', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(PaymentHelper, 'getPayerBanks').and.returnValue({});

      const paymentMode = PaymentModeEnum.CHEQUE;

      const { path, params } = getPayerBanksEndpointUrl(paymentMode);

      paymentService.loadPayerBanks(paymentMode).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.params.get('paymentCode')).toEqual(paymentMode);

      request.flush({});
    });

    it('should call Payment Helper method with correct arguments', () => {
      spyOn(PaymentHelper, 'getPayerBanks').and.returnValue({});

      const apiResponse: PaymentConfig = {
        payerBanks: ['ICICI', 'HDFC'],
        cardType: ['CC', 'DC'],
        isBankMandatory: null,
        isCardTypeMandatory: null
      };

      const paymentMode = PaymentModeEnum.CHEQUE;

      const { path } = getPayerBanksEndpointUrl(paymentMode);

      paymentService.loadPayerBanks(paymentMode).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(apiResponse);
      expect(PaymentHelper.getPayerBanks).toHaveBeenCalledWith(apiResponse);
    });

    it('should return data mapped by  Payment Helper', () => {
      const helperResponse: PaymentConfig = {
        payerBanks: ['ICICI', 'HDFC'],
        cardType: ['CC', 'DC'],
        isBankMandatory: null,
        isCardTypeMandatory: null
      };

      spyOn(PaymentHelper, 'getPayerBanks').and.returnValue(helperResponse);

      const paymentMode = PaymentModeEnum.CHEQUE;

      const { path } = getPayerBanksEndpointUrl(paymentMode);

      paymentService.loadPayerBanks(paymentMode).subscribe(data => {
        expect(data).toEqual(helperResponse);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });

  describe('loadEncirclePoints', () => {
    it('should call GET api method with correct url and params', () => {
      const customerID = '123';

      const path = getCustomerUrl(customerID);

      paymentService.loadEncirclePoints(customerID).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });

    it('should return encirecle points', () => {
      const apiResponse = {
        pointBalance: 1000,
        name: 'RAKESH',
        customerId: 123
      };

      const customerID = '123';

      const path = getCustomerUrl(customerID);

      paymentService.loadEncirclePoints(customerID).subscribe(data => {
        expect(data).toEqual(apiResponse.pointBalance);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(apiResponse);
    });
  });

  describe('getMaxCashLimit', () => {
    it('should call GET api method with correct url and params', () => {
      const customerId = '123';
      const transactionType = TransactionTypeEnum.CM;
      const subTransactionType = SubTransactionTypeEnum.NEW_CM;
      const transactionId = '1234';
      const paymentCode = PaymentModeEnum.CASH;
      const paymentGroup = PaymentGroupEnum.REGULAR;

      const { path, params } = getMaxCashLimitEndpointUrl(
        transactionType,
        subTransactionType,
        customerId,
        paymentCode,
        paymentGroup,
        transactionId
      );

      paymentService
        .getMaxCashLimit(
          transactionType,
          subTransactionType,
          customerId,
          paymentCode,
          paymentGroup,
          transactionId
        )
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('customerId')).toEqual(customerId);
      expect(request.request.params.get('paymentCode')).toEqual(paymentCode);
      expect(request.request.params.get('paymentGroup')).toEqual(paymentGroup);
      expect(request.request.params.get('transactionId')).toEqual(
        transactionId
      );

      expect(request.request.params.get('txnType')).toEqual(transactionType);
      expect(request.request.params.get('subTxnType')).toEqual(
        subTransactionType
      );

      request.flush({});
    });

    it('should return max cash limit', () => {
      const apiResponse: CashLimitDetails = {
        eligibleAmount: 2,
        amountDue: 2,
        pmlaEligibleAmount: 2,
        totalAmount: 1000
      };

      const customerId = '123';
      const transactionType = TransactionTypeEnum.CM;
      const subTransactionType = SubTransactionTypeEnum.NEW_CM;
      const transactionId = '1234';
      const paymentCode = PaymentModeEnum.CASH;
      const paymentGroup = PaymentGroupEnum.REGULAR;

      const { path } = getMaxCashLimitEndpointUrl(
        transactionType,
        subTransactionType,
        customerId,
        paymentCode,
        paymentGroup,
        transactionId
      );

      paymentService
        .getMaxCashLimit(
          transactionType,
          subTransactionType,
          customerId,
          paymentCode,
          paymentGroup,
          transactionId
        )
        .subscribe(data => {
          expect(data).toEqual(apiResponse);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(apiResponse);
    });
  });

  describe('resendPaymentLink', () => {
    it('should call PUT api method with correct url and params', () => {
      spyOn(PaymentAdaptor, 'getROPaymentRequest').and.returnValue({});

      const transactionType = TransactionTypeEnum.CM;
      const subTransactionType = SubTransactionTypeEnum.NEW_CM;
      const paymentId = '1234';
      const status = PaymentStatusEnum.COMPLETED;

      const details: CashPaymentPayload = {
        amount: 100
      };

      const path = getROPaymentRequestStatusURLByID(paymentId);

      paymentService.resendPaymentLink(paymentId).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PUT');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });

    it('should call Payment Helper method with correct arguments', () => {
      spyOn(PaymentAdaptor, 'getROPaymentRequest').and.returnValue({});

      const apiResponse: PaymentRequest = {
        customerId: 23345,
        amount: 100,
        id: 'WQ1223',
        paymentCode: PaymentModeEnum.CASH,
        otherDetails: null,
        referenceId: 'REF_1',
        status: 'COMPLETE',
        requestedBy: 'ABC',
        requestedReason: 'w3ee',
        approvedBy: 'ADF',
        approvedDate: moment(),
        approvedReason: '1234',
        requestedDate: moment(),
        locationCode: 'CPD',
        utilizedAmount: 1000
      };

      const transactionType = TransactionTypeEnum.CM;
      const subTransactionType = SubTransactionTypeEnum.NEW_CM;
      const paymentId = '1234';
      const status = PaymentStatusEnum.COMPLETED;

      const details: CashPaymentPayload = {
        amount: 100
      };

      const path = getROPaymentRequestStatusURLByID(paymentId);

      paymentService.resendPaymentLink(paymentId).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush(apiResponse);
      expect(PaymentAdaptor.getROPaymentRequest).toHaveBeenCalledWith(
        apiResponse
      );
    });

    it('should return data mapped by  Payment Helper', () => {
      const helperResponse: any = {
        amount: 100,
        id: 'WQ1223',
        paymentCode: PaymentModeEnum.CASH,
        paymentGroup: PaymentGroupEnum.REGULAR,
        instrumentDate: moment(),
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

      spyOn(PaymentAdaptor, 'getROPaymentRequest').and.returnValue(
        helperResponse
      );

      const transactionType = TransactionTypeEnum.CM;
      const subTransactionType = SubTransactionTypeEnum.NEW_CM;
      const paymentId = '1234';
      const status = PaymentStatusEnum.COMPLETED;

      const details: CashPaymentPayload = {
        amount: 100
      };

      const path = getROPaymentRequestStatusURLByID(paymentId);

      paymentService.resendPaymentLink(paymentId).subscribe(data => {
        expect(data).toEqual(helperResponse);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });

  describe('validatePayment', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(PaymentHelper, 'getPaymentDetails').and.returnValue({});

      const transactionType = TransactionTypeEnum.CM;
      const subTransactionType = SubTransactionTypeEnum.NEW_CM;
      const paymentId = '1234';
      const inputValue = 'url';

      const { path, params } = validatePaymentEndpointUrl(
        transactionType,
        subTransactionType,
        paymentId,
        inputValue
      );

      paymentService
        .validatePayment(
          transactionType,
          subTransactionType,
          paymentId,
          inputValue
        )
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.params.get('txnType')).toEqual(transactionType);
      expect(request.request.params.get('subTxnType')).toEqual(
        subTransactionType
      );

      expect(request.request.params.get('inputValue')).toEqual(inputValue);

      request.flush({});
    });

    it('should call Payment Helper method with correct arguments', () => {
      spyOn(PaymentHelper, 'getPaymentDetails').and.returnValue({});

      const apiResponse: PaymentDetails = {
        amount: 100,
        id: 'WQ1223',
        paymentCode: PaymentModeEnum.CASH,
        paymentGroup: PaymentGroupEnum.REGULAR,
        instrumentDate: moment(),
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

      const transactionType = TransactionTypeEnum.CM;
      const subTransactionType = SubTransactionTypeEnum.NEW_CM;
      const paymentId = '1234';
      const inputValue = 'url';

      const { path } = validatePaymentEndpointUrl(
        transactionType,
        subTransactionType,
        paymentId,
        inputValue
      );

      paymentService
        .validatePayment(
          transactionType,
          subTransactionType,
          paymentId,
          inputValue
        )
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush(apiResponse);
      expect(PaymentHelper.getPaymentDetails).toHaveBeenCalledWith(apiResponse);
    });

    it('should return data mapped by  Payment Helper', () => {
      const helperResponse: PaymentDetails = {
        amount: 100,
        id: 'WQ1223',
        paymentCode: PaymentModeEnum.CASH,
        paymentGroup: PaymentGroupEnum.REGULAR,
        instrumentDate: moment(),
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

      const transactionType = TransactionTypeEnum.CM;
      const subTransactionType = SubTransactionTypeEnum.NEW_CM;
      const paymentId = '1234';
      const inputValue = 'url';

      const { path } = validatePaymentEndpointUrl(
        transactionType,
        subTransactionType,
        paymentId,
        inputValue
      );

      paymentService
        .validatePayment(
          transactionType,
          subTransactionType,
          paymentId,
          inputValue
        )
        .subscribe(data => {
          expect(data).toEqual(helperResponse);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });

  describe('ConfirmPayment', () => {
    it('should call PUT api method with correct url and params', () => {
      spyOn(PaymentHelper, 'getPaymentDetails').and.returnValue({});

      const transactionType = TransactionTypeEnum.CM;
      const subTransactionType = SubTransactionTypeEnum.NEW_CM;
      const paymentId = '1234';

      const { path, params } = getConfirmPaymentEndpointUrl(
        transactionType,
        subTransactionType,
        paymentId,
        PaymentStatusEnum.COMPLETED
      );

      paymentService
        .confirmPayment(
          transactionType,
          subTransactionType,
          paymentId,
          null,
          PaymentModeEnum.AIRPAY
        )
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PUT');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.params.get('txnType')).toEqual(transactionType);
      expect(request.request.params.get('subTxnType')).toEqual(
        subTransactionType
      );

      expect(request.request.params.get('status')).toEqual(
        PaymentStatusEnum.COMPLETED
      );

      request.flush({});
    });

    it('should call PUT api method with correct url and params', () => {
      spyOn(PaymentAdaptor, 'getLinkedCNPaymentDetails').and.returnValue({});

      const transactionType = TransactionTypeEnum.CM;
      const subTransactionType = SubTransactionTypeEnum.NEW_CM;
      const paymentId = '1234';

      const { path, params } = getConfirmlinkedCNPaymentEndpointUrl(
        transactionType,
        subTransactionType,
        paymentId
      );

      paymentService
        .confirmPayment(
          transactionType,
          subTransactionType,
          paymentId,
          null,
          PaymentModeEnum.LINKED_CN
        )
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PUT');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.params.get('txnType')).toEqual(transactionType);
      expect(request.request.params.get('subTxnType')).toEqual(
        subTransactionType
      );

      request.flush({});
    });

    it('should call Payment Helper method with correct arguments', () => {
      spyOn(PaymentHelper, 'getPaymentDetails').and.returnValue({});

      const apiResponse: PaymentDetails = {
        amount: 100,
        id: 'WQ1223',
        paymentCode: PaymentModeEnum.CASH,
        paymentGroup: PaymentGroupEnum.REGULAR,
        instrumentDate: moment(),
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

      const transactionType = TransactionTypeEnum.CM;
      const subTransactionType = SubTransactionTypeEnum.NEW_CM;
      const paymentId = '1234';

      const { path } = getConfirmPaymentEndpointUrl(
        transactionType,
        subTransactionType,
        paymentId,
        PaymentStatusEnum.COMPLETED
      );

      paymentService
        .confirmPayment(
          transactionType,
          subTransactionType,
          paymentId,
          null,
          PaymentModeEnum.AIRPAY
        )
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush(apiResponse);
      expect(PaymentHelper.getPaymentDetails).toHaveBeenCalledWith(apiResponse);
    });

    it('should return data mapped by  Payment Helper', () => {
      const helperResponse: PaymentDetails = {
        amount: 100,
        id: 'WQ1223',
        paymentCode: PaymentModeEnum.CASH,
        paymentGroup: PaymentGroupEnum.REGULAR,
        instrumentDate: moment(),
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

      const transactionType = TransactionTypeEnum.CM;
      const subTransactionType = SubTransactionTypeEnum.NEW_CM;
      const paymentId = '1234';

      const { path } = getConfirmPaymentEndpointUrl(
        transactionType,
        subTransactionType,
        paymentId,
        PaymentStatusEnum.COMPLETED
      );

      paymentService
        .confirmPayment(
          transactionType,
          subTransactionType,
          paymentId,
          null,
          PaymentModeEnum.AIRPAY
        )
        .subscribe(data => {
          expect(data).toEqual(helperResponse);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });

  describe('loadCMRequestPaymentDetails', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(PaymentHelper, 'getPaymentList').and.returnValue({});

      const workflowType = 'RO';
      const taskName = 'APPROVAL';
      const processId = '1234';
      const taskId = '1234';

      const { path, params } = getCmRequestDetailsUrl(
        processId,
        taskId,
        taskName,
        workflowType
      );
      paymentService
        .loadCMRequestPaymentDetails(processId, taskId, taskName, workflowType)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.params.get('processId')).toEqual(processId);
      expect(request.request.params.get('taskName')).toEqual(taskName);

      expect(request.request.params.get('workflowType')).toEqual(workflowType);

      request.flush({});
    });

    it('should call Payment Helper method with correct arguments', () => {
      spyOn(PaymentHelper, 'getPaymentList').and.returnValue({});

      const list: PaymentDetails[] = [
        {
          amount: 100,
          id: 'WQ1223',
          paymentCode: PaymentModeEnum.CASH,
          paymentGroup: PaymentGroupEnum.REGULAR,
          instrumentDate: moment(),
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
        }
      ];

      const apiResponse = {
        approvedData: { data: { paymentList: list } }
      };

      const workflowType = 'RO';
      const taskName = 'APPROVAL';
      const processId = '1234';
      const taskId = '1234';

      const { path } = getCmRequestDetailsUrl(
        processId,
        taskId,
        taskName,
        workflowType
      );

      paymentService
        .loadCMRequestPaymentDetails(processId, taskId, taskName, workflowType)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush(apiResponse);
      expect(PaymentHelper.getPaymentList).toHaveBeenCalledWith({
        results: apiResponse.approvedData.data.paymentList
      });
    });

    it('should return data mapped by  Payment Helper', () => {
      const helperResponse: PaymentDetails[] = [
        {
          amount: 100,
          id: 'WQ1223',
          paymentCode: PaymentModeEnum.CASH,
          paymentGroup: PaymentGroupEnum.REGULAR,
          instrumentDate: moment(),
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
        }
      ];

      spyOn(PaymentHelper, 'getPaymentList').and.returnValue(helperResponse);

      const workflowType = 'RO';
      const taskName = 'APPROVAL';
      const processId = '1234';
      const taskId = '1234';

      const { path } = getCmRequestDetailsUrl(
        processId,
        taskId,
        taskName,
        workflowType
      );

      paymentService
        .loadCMRequestPaymentDetails(processId, taskId, taskName, workflowType)
        .subscribe(data => {
          expect(data).toEqual(helperResponse);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });

  describe('getROPaymentRequestStatus', () => {
    it('should call api method with correct url and params', () => {
      const customerID = '123';
      const requestId = '123';
      const url1 = getPaymentRequestStatusURL(PaymentModeEnum.RO_PAYMENT);
      const payload = {
        customerId: customerID,
        isWorkFlowApproval: true,
        status: [
          ROPaymentRequestStatus.APPROVED,
          ROPaymentRequestStatus.REJECTED,
          ROPaymentRequestStatus.PENDING
        ]
      };
      const requestResponse: PaymentRequest[] = [
        {
          customerId: 11,
          paymentCode: 'RO',
          amount: 100,
          requestedReason: 'Test',
          approvedBy: 'RSO',
          referenceId: 'REF_ID',
          id: '123',
          status: 'APPROVED',
          utilizedAmount: 100,
          locationCode: 'URB',
          requestedBy: 'RAKESH',
          requestedDate: null,
          approvedDate: null,
          approvedReason: 'Test',
          otherDetails: null
        }
      ];

      spyOn(PaymentHelper, 'getROPaymentRequests').and.returnValue(
        requestResponse
      );
      spyOn(PaymentAdaptor, 'getROPaymentRequest').and.returnValue(
        requestResponse[0]
      );

      const url2 = getROPaymentRequestStatusURLByID(requestId);

      paymentService.getROPaymentRequestStatus(customerID).subscribe();

      const request1 = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url1.path;
      });
      expect(request1.cancelled).toBeFalsy();
      expect(request1.request.method).toEqual('POST');
      expect(request1.request.responseType).toEqual('json');
      expect(request1.request.params.toString()).toEqual(
        url1.params.toString()
      );
      expect(request1.request.params.get('paymentCode')).toEqual(
        PaymentModeEnum.RO_PAYMENT
      );
      expect(request1.request.params.get('sort')).toEqual('createdDate,desc');
      expect(request1.request.body as Object).toEqual(JSON.stringify(payload));
      request1.flush({});

      const request2 = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url2;
      });
      expect(request2.cancelled).toBeFalsy();
      expect(request2.request.method).toEqual('GET');
      expect(request2.request.responseType).toEqual('json');

      request2.flush({});
    });

    it('should not call request by id api if no empty response from list api ', () => {
      const customerID = '123';
      const requestId = '123';
      const url1 = getPaymentRequestStatusURL(PaymentModeEnum.RO_PAYMENT);
      const payload = {
        customerId: customerID,
        isWorkFlowApproval: true,
        status: [
          ROPaymentRequestStatus.APPROVED,
          ROPaymentRequestStatus.REJECTED,
          ROPaymentRequestStatus.PENDING
        ]
      };
      const requestResponse: PaymentRequest[] = [
        {
          customerId: 11,
          paymentCode: 'RO',
          amount: 100,
          requestedReason: 'Test',
          approvedBy: 'RSO',
          referenceId: 'REF_ID',
          id: '123',
          status: 'APPROVED',
          utilizedAmount: 100,
          locationCode: 'URB',
          requestedBy: 'RAKESH',
          requestedDate: null,
          approvedDate: null,
          approvedReason: 'Test',
          otherDetails: null
        }
      ];

      spyOn(PaymentHelper, 'getROPaymentRequests').and.returnValue([]);
      spyOn(PaymentAdaptor, 'getROPaymentRequest').and.returnValue(
        requestResponse[0]
      );

      const url2 = getROPaymentRequestStatusURLByID(requestId);

      paymentService.getROPaymentRequestStatus(customerID).subscribe();

      const request1 = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url1.path;
      });
      expect(request1.cancelled).toBeFalsy();
      expect(request1.request.method).toEqual('POST');
      expect(request1.request.responseType).toEqual('json');
      expect(request1.request.params.toString()).toEqual(
        url1.params.toString()
      );
      expect(request1.request.params.get('paymentCode')).toEqual(
        PaymentModeEnum.RO_PAYMENT
      );
      expect(request1.request.params.get('sort')).toEqual('createdDate,desc');
      expect(request1.request.body as Object).toEqual(JSON.stringify(payload));
      request1.flush({});

      httpTestingController.expectNone(req => {
        return req.url === apiUrl + url2;
      });
    });

    it('should call Payment Helper method with correct arguments', () => {
      const customerID = '123';
      const requestId = '123';
      const url1 = getPaymentRequestStatusURL(PaymentModeEnum.RO_PAYMENT);

      const requestResponse: PaymentRequest[] = [
        {
          customerId: 11,
          paymentCode: 'RO',
          amount: 100,
          requestedReason: 'Test',
          approvedBy: 'RSO',
          referenceId: 'REF_ID',
          id: '123',
          status: 'APPROVED',
          utilizedAmount: 100,
          locationCode: 'URB',
          requestedBy: 'RAKESH',
          requestedDate: null,
          approvedDate: null,
          approvedReason: 'Test',
          otherDetails: null
        }
      ];

      const apiResponse = { results: requestResponse };

      spyOn(PaymentHelper, 'getROPaymentRequests').and.returnValue(
        requestResponse
      );
      spyOn(PaymentAdaptor, 'getROPaymentRequest').and.returnValue(
        requestResponse[0]
      );

      const url2 = getROPaymentRequestStatusURLByID(requestId);

      paymentService.getROPaymentRequestStatus(customerID).subscribe();

      const request1 = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url1.path;
      });

      request1.flush(apiResponse);

      const request2 = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url2;
      });

      request2.flush(requestResponse[0]);
      expect(PaymentHelper.getROPaymentRequests).toHaveBeenCalledWith(
        apiResponse
      );
      expect(PaymentAdaptor.getROPaymentRequest).toHaveBeenCalledWith(
        requestResponse[0]
      );
    });

    it('should return data mapped by Payment adaptor', () => {
      const customerID = '123';
      const requestId = '123';
      const url1 = getPaymentRequestStatusURL(PaymentModeEnum.RO_PAYMENT);

      const requestResponse: PaymentRequest[] = [
        {
          customerId: 11,
          paymentCode: 'RO',
          amount: 100,
          requestedReason: 'Test',
          approvedBy: 'RSO',
          referenceId: 'REF_ID',
          id: '123',
          status: 'APPROVED',
          utilizedAmount: 100,
          locationCode: 'URB',
          requestedBy: 'RAKESH',
          requestedDate: null,
          approvedDate: null,
          approvedReason: 'Test',
          otherDetails: null
        }
      ];

      const apiResponse = { results: requestResponse };

      spyOn(PaymentHelper, 'getROPaymentRequests').and.returnValue(
        requestResponse
      );
      spyOn(PaymentAdaptor, 'getROPaymentRequest').and.returnValue(
        requestResponse[0]
      );

      const url2 = getROPaymentRequestStatusURLByID(requestId);

      paymentService.getROPaymentRequestStatus(customerID).subscribe(data => {
        expect(data).toEqual(requestResponse[0]);
      });

      const request1 = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url1.path;
      });

      request1.flush(apiResponse);

      const request2 = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url2;
      });

      request2.flush(requestResponse[0]);
    });
  });

  describe('loadPayeeBanks', () => {
    it('should call api method with correct url and params', () => {
      const bankPrioritiesApi = getBankPrioritiesEndpointUrl();
      const payeeBankApi = getPayeeBanksEndpointUrl(PaymentModeEnum.CARD);

      const payerBanks: string[] = ['AXIS', 'ICIC'];

      const payerBanksPriorities: string[] = ['AXIS', 'ICIC'];

      spyOn(PaymentHelper, 'getPayeeBanks').and.returnValue(payerBanks);
      spyOn(PaymentHelper, 'createPayeeBankList').and.returnValue(
        payerBanksPriorities
      );

      paymentService.loadPayeeBanks().subscribe();

      const request1 = httpTestingController.expectOne(req => {
        return req.url === apiUrl + bankPrioritiesApi;
      });
      expect(request1.cancelled).toBeFalsy();
      expect(request1.request.method).toEqual('GET');
      expect(request1.request.responseType).toEqual('json');
      request1.flush(payerBanksPriorities);

      const request2 = httpTestingController.expectOne(req => {
        return req.url === apiUrl + payeeBankApi.path;
      });
      expect(request2.cancelled).toBeFalsy();
      expect(request2.request.method).toEqual('GET');
      expect(request2.request.responseType).toEqual('json');
      expect(request2.request.params.toString()).toEqual(
        payeeBankApi.params.toString()
      );
      expect(request2.request.params.get('paymentCode')).toEqual(
        PaymentModeEnum.CARD
      );

      request2.flush(payerBanks);
    });

    it('should call Payment Helper method with correct arguments', () => {
      const bankPrioritiesApi = getBankPrioritiesEndpointUrl();
      const payeeBankApi = getPayeeBanksEndpointUrl(PaymentModeEnum.CARD);

      const payerBanks: string[] = ['AXIS', 'ICIC'];

      const payerBanksPriorities: string[] = ['AXIS', 'ICIC'];

      spyOn(PaymentHelper, 'getPayeeBanks').and.returnValue(payerBanks);
      spyOn(PaymentHelper, 'createPayeeBankList').and.returnValue(
        payerBanksPriorities
      );

      paymentService.loadPayeeBanks().subscribe();

      const request1 = httpTestingController.expectOne(req => {
        return req.url === apiUrl + bankPrioritiesApi;
      });

      request1.flush(payerBanksPriorities);

      const request2 = httpTestingController.expectOne(req => {
        return req.url === apiUrl + payeeBankApi.path;
      });

      request2.flush({ results: payerBanks });

      expect(PaymentHelper.getPayeeBanks).toHaveBeenCalledWith(
        payerBanksPriorities
      );
      expect(PaymentHelper.createPayeeBankList).toHaveBeenCalledWith(
        payerBanksPriorities,
        payerBanks
      );
    });

    it('should return data mapped by Payment adaptor', () => {
      const bankPrioritiesApi = getBankPrioritiesEndpointUrl();
      const payeeBankApi = getPayeeBanksEndpointUrl(PaymentModeEnum.CARD);

      const payerBanks: string[] = ['AXIS', 'ICIC'];

      const payerBanksPriorities: string[] = ['AXIS', 'ICIC'];

      spyOn(PaymentHelper, 'getPayeeBanks').and.returnValue(payerBanks);
      spyOn(PaymentHelper, 'createPayeeBankList').and.returnValue(
        payerBanksPriorities
      );

      paymentService.loadPayeeBanks().subscribe(data => {
        expect(data).toEqual(payerBanks);
      });
      const request1 = httpTestingController.expectOne(req => {
        return req.url === apiUrl + bankPrioritiesApi;
      });

      request1.flush(payerBanksPriorities);

      const request2 = httpTestingController.expectOne(req => {
        return req.url === apiUrl + payeeBankApi.path;
      });

      request2.flush(payerBanks);
    });
  });

  describe('addPayment', () => {
    it('should call POST api method with correct url and params', () => {
      spyOn(PaymentHelper, 'getPaymentDetails').and.returnValue({});

      const transactionType = TransactionTypeEnum.CM;
      const subTransactionType = SubTransactionTypeEnum.NEW_CM;
      const transactionId = '1234';

      const paymentDetails: PaymentType = new CashPayment(
        PaymentGroupEnum.REGULAR,
        {
          amount: 100
        }
      );
      const paymentCode = paymentDetails.mode.toString();

      const { path, params } = getAddPaymentEndpointUrl(
        transactionType,
        subTransactionType,
        transactionId,
        paymentCode,
        paymentDetails.group
      );

      paymentService
        .addPayment(
          transactionType,
          subTransactionType,
          transactionId,
          paymentDetails
        )
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.body as Object).toEqual(
        JSON.stringify(paymentDetails.payload)
      );
      expect(request.request.params.toString()).toEqual(params.toString());

      expect(request.request.params.get('txnType')).toEqual(transactionType);
      expect(request.request.params.get('subTxnType')).toEqual(
        subTransactionType
      );

      expect(request.request.params.get('transactionId')).toEqual(
        transactionId
      );

      expect(request.request.params.get('paymentCode')).toEqual(paymentCode);

      expect(request.request.params.get('paymentGroup')).toEqual(
        paymentDetails.group
      );

      request.flush({});
    });

    it('should call POST api method with correct url and params for WALLET', () => {
      spyOn(PaymentHelper, 'getPaymentDetails').and.returnValue({});

      const transactionType = TransactionTypeEnum.CM;
      const subTransactionType = SubTransactionTypeEnum.NEW_CM;
      const transactionId = '1234';

      const paymentDetails: PaymentType = new WalletPayment(
        PaymentGroupEnum.WALLET,
        {
          amount: 100,
          instrumentDate: moment(),
          instrumentType: 'GPAY',
          reference1: 'REF_1',
          instrumentNo: '123',
          reference2: 'REF2',
          reference3: 'REF3'
        }
      );
      const paymentCode = paymentDetails.payload.instrumentType;

      const { path, params } = getAddPaymentEndpointUrl(
        transactionType,
        subTransactionType,
        transactionId,
        paymentDetails.payload.instrumentNo,
        paymentDetails.group
      );

      paymentService
        .addPayment(
          transactionType,
          subTransactionType,
          transactionId,
          paymentDetails
        )
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.body as Object).toEqual(
        JSON.stringify(paymentDetails.payload)
      );
      expect(request.request.params.toString()).toEqual(params.toString());

      expect(request.request.params.get('txnType')).toEqual(transactionType);
      expect(request.request.params.get('subTxnType')).toEqual(
        subTransactionType
      );

      expect(request.request.params.get('transactionId')).toEqual(
        transactionId
      );

      expect(request.request.params.get('paymentCode')).toEqual(
        paymentDetails.payload.instrumentNo
      );

      expect(request.request.params.get('paymentGroup')).toEqual(
        paymentDetails.group
      );

      request.flush({});
    });

    it('should call POST api method with correct url and params for BANK_LOAN', () => {
      spyOn(PaymentHelper, 'getPaymentDetails').and.returnValue({});

      const transactionType = TransactionTypeEnum.CM;
      const subTransactionType = SubTransactionTypeEnum.NEW_CM;
      const transactionId = '1234';

      const paymentDetails: PaymentType = new BankLoanPayment(
        PaymentGroupEnum.BANK_LOAN,
        {
          amount: 100,
          instrumentDate: moment(),
          instrumentType: 'GPAy',
          reference1: 'REF_1',
          reference2: 'REF_2',
          reference3: 'REF_2'
        }
      );
      const paymentCode = paymentDetails.payload.instrumentType;

      const { path, params } = getAddPaymentEndpointUrl(
        transactionType,
        subTransactionType,
        transactionId,
        paymentCode,
        paymentDetails.group
      );

      paymentService
        .addPayment(
          transactionType,
          subTransactionType,
          transactionId,
          paymentDetails
        )
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.body as Object).toEqual(
        JSON.stringify(paymentDetails.payload)
      );
      expect(request.request.params.toString()).toEqual(params.toString());

      expect(request.request.params.get('txnType')).toEqual(transactionType);
      expect(request.request.params.get('subTxnType')).toEqual(
        subTransactionType
      );

      expect(request.request.params.get('transactionId')).toEqual(
        transactionId
      );

      expect(request.request.params.get('paymentCode')).toEqual(paymentCode);

      expect(request.request.params.get('paymentGroup')).toEqual(
        paymentDetails.group
      );

      request.flush({});
    });

    it('should call Payment Helper method with correct arguments', () => {
      spyOn(PaymentHelper, 'getPaymentDetails').and.returnValue({});

      const apiResponse: PaymentDetails = {
        amount: 100,
        id: 'WQ1223',
        paymentCode: PaymentModeEnum.CASH,
        paymentGroup: PaymentGroupEnum.REGULAR,
        instrumentDate: moment(),
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

      const transactionType = TransactionTypeEnum.CM;
      const subTransactionType = SubTransactionTypeEnum.NEW_CM;
      const transactionId = '1234';

      const paymentDetails: PaymentType = new CashPayment(
        PaymentGroupEnum.REGULAR,
        {
          amount: 100
        }
      );
      const paymentCode = paymentDetails.mode.toString();

      const { path } = getAddPaymentEndpointUrl(
        transactionType,
        subTransactionType,
        transactionId,
        paymentCode,
        paymentDetails.group
      );

      paymentService
        .addPayment(
          transactionType,
          subTransactionType,
          transactionId,
          paymentDetails
        )
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush(apiResponse);
      expect(PaymentHelper.getPaymentDetails).toHaveBeenCalledWith(apiResponse);
    });

    it('should return data mapped by  Payment Helper', () => {
      const helperResponse: PaymentDetails = {
        amount: 100,
        id: 'WQ1223',
        paymentCode: PaymentModeEnum.CASH,
        paymentGroup: PaymentGroupEnum.REGULAR,
        instrumentDate: moment(),
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

      const transactionType = TransactionTypeEnum.CM;
      const subTransactionType = SubTransactionTypeEnum.NEW_CM;
      const transactionId = '1234';

      const paymentDetails: PaymentType = new CashPayment(
        PaymentGroupEnum.REGULAR,
        {
          amount: 100
        }
      );
      const paymentCode = paymentDetails.mode.toString();

      const { path } = getAddPaymentEndpointUrl(
        transactionType,
        subTransactionType,
        transactionId,
        paymentCode,
        paymentDetails.group
      );

      paymentService
        .addPayment(
          transactionType,
          subTransactionType,
          transactionId,
          paymentDetails
        )
        .subscribe(data => {
          expect(data).toEqual(helperResponse);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });

  describe('getQCGCBalance', () => {
    it('should call api method with correct url and params', () => {
      const request: QCGCGetBalancePayload = {
        cardType: GiftCardTxnEnum.CM,
        cardNumber: '1234'
      };

      const response: QCGCCardDetails = {
        amount: '100',
        cardExpiryDate: '12-12-2020',
        cardNumber: '1234',
        cardType: 'TEST',
        cardName: 'ABCD',
        responseCode: 112,
        responseMessage: 'SDHEE',
        transactionId: 12334,
        productGroup: ['GROUP'],
        paymentCategoryName: 'Category',
        partialRedemption: false
      };
      const url1 = getQCGCPaymentEndpointURl(request);
      const url2 = getQCGCProductGroupEndpointURl(request);

      spyOn(PaymentAdaptor, 'getQCGCCardBalanceDetails').and.returnValue(
        response
      );

      paymentService.getQCGCBalance(request).subscribe();

      const request1 = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url1.path;
      });
      expect(request1.cancelled).toBeFalsy();
      expect(request1.request.method).toEqual('GET');
      expect(request1.request.responseType).toEqual('json');
      expect(request1.request.params.toString()).toEqual(
        url1.params.toString()
      );
      expect(request1.request.params.get('cardNumber')).toEqual(
        request.cardNumber
      );

      request1.flush(response);

      const request2 = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url2.path;
      });
      expect(request2.cancelled).toBeFalsy();
      expect(request2.request.method).toEqual('GET');
      expect(request2.request.responseType).toEqual('json');
      expect(request2.request.params.toString()).toEqual(
        url2.params.toString()
      );
      expect(request1.request.params.get('cardNumber')).toEqual(
        request.cardNumber
      );

      expect(request1.request.params.get('vendorCode')).toEqual(
        request.cardType
      );

      request2.flush(response);
    });

    it('should call Payment Helper method with correct arguments', () => {
      const request: QCGCGetBalancePayload = {
        cardType: GiftCardTxnEnum.CM,
        cardNumber: '1234'
      };

      const response: QCGCCardDetails = {
        amount: '100',
        cardExpiryDate: '12-12-2020',
        cardNumber: '1234',
        cardType: 'TEST',
        cardName: 'ABCD',
        responseCode: 112,
        responseMessage: 'SDHEE',
        transactionId: 12334,
        productGroup: ['GROUP'],
        paymentCategoryName: 'Category',
        partialRedemption: false
      };
      const url1 = getQCGCPaymentEndpointURl(request);
      const url2 = getQCGCProductGroupEndpointURl(request);

      spyOn(PaymentAdaptor, 'getQCGCCardBalanceDetails').and.returnValue(
        response
      );

      paymentService.getQCGCBalance(request).subscribe();

      const request1 = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url1.path;
      });

      request1.flush(response);

      const request2 = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url2.path;
      });

      request2.flush(response);
      expect(PaymentAdaptor.getQCGCCardBalanceDetails).toHaveBeenCalledWith([
        response,
        response
      ]);
    });

    it('should return data mapped by Payment adaptor', () => {
      const request: QCGCGetBalancePayload = {
        cardType: GiftCardTxnEnum.CM,
        cardNumber: '1234'
      };

      const response: QCGCCardDetails = {
        amount: '100',
        cardExpiryDate: '12-12-2020',
        cardNumber: '1234',
        cardType: 'TEST',
        cardName: 'ABCD',
        responseCode: 112,
        responseMessage: 'SDHEE',
        transactionId: 12334,
        productGroup: ['GROUP'],
        paymentCategoryName: 'Category',
        partialRedemption: false
      };
      const url1 = getQCGCPaymentEndpointURl(request);
      const url2 = getQCGCProductGroupEndpointURl(request);

      spyOn(PaymentAdaptor, 'getQCGCCardBalanceDetails').and.returnValue(
        response
      );

      paymentService
        .getQCGCBalance(request)
        .subscribe(data => expect(data).toEqual(response));

      const request1 = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url1.path;
      });

      request1.flush(response);

      const request2 = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url2.path;
      });

      request2.flush(response);
    });
  });

  describe('getGHSeVoucherCustomerBalance', () => {
    it('should call api method with correct url and params', () => {
      const request: QCGCGetBalancePayload = {
        cardType: GiftCardTxnEnum.CM,
        cardNumber: '1234'
      };

      const response: GHSeVoucherDetails = {
        cardExpiryDate: '12-12-2020',
        responseCode: 112,
        responseMessage: 'SDHEE',
        productGroup: ['GROUP'],
        paymentCategoryName: 'Category',
        partialRedemption: false,
        firstName: 'Rakesh',
        phone: '1233',
        cardNumber: '1234',
        cardBalance: '1000',
        cardStatus: 'OPEN',
        cardProgramGroupName: 'SE'
      };

      const url1 = getQCGCPaymentCustomerEndpointURl(request);
      const url2 = getQCGCProductGroupEndpointURl(request);

      spyOn(PaymentAdaptor, 'getGHSeVoucherBalanceDetails').and.returnValue(
        response
      );

      paymentService.getGHSeVoucherCustomerBalance(request).subscribe();

      const request1 = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url1.path;
      });
      expect(request1.cancelled).toBeFalsy();
      expect(request1.request.method).toEqual('GET');
      expect(request1.request.responseType).toEqual('json');
      expect(request1.request.params.toString()).toEqual(
        url1.params.toString()
      );
      expect(request1.request.params.get('giftCardNumber')).toEqual(
        request.cardNumber
      );
      expect(request1.request.params.get('vendorCode')).toEqual(
        request.cardType
      );

      request1.flush(response);

      const request2 = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url2.path;
      });
      expect(request2.cancelled).toBeFalsy();
      expect(request2.request.method).toEqual('GET');
      expect(request2.request.responseType).toEqual('json');
      expect(request2.request.params.toString()).toEqual(
        url2.params.toString()
      );

      request2.flush(response);
    });

    it('should call Payment Helper method with correct arguments', () => {
      const request: QCGCGetBalancePayload = {
        cardType: GiftCardTxnEnum.CM,
        cardNumber: '1234'
      };

      const response: GHSeVoucherDetails = {
        cardExpiryDate: '12-12-2020',
        responseCode: 112,
        responseMessage: 'SDHEE',
        productGroup: ['GROUP'],
        paymentCategoryName: 'Category',
        partialRedemption: false,
        firstName: 'Rakesh',
        phone: '1233',
        cardNumber: '1234',
        cardBalance: '1000',
        cardStatus: 'OPEN',
        cardProgramGroupName: 'SE'
      };

      const url1 = getQCGCPaymentCustomerEndpointURl(request);
      const url2 = getQCGCProductGroupEndpointURl(request);

      spyOn(PaymentAdaptor, 'getGHSeVoucherBalanceDetails').and.returnValue(
        response
      );

      paymentService.getGHSeVoucherCustomerBalance(request).subscribe();

      const request1 = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url1.path;
      });

      request1.flush(response);

      const request2 = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url2.path;
      });

      request2.flush(response);
      expect(PaymentAdaptor.getGHSeVoucherBalanceDetails).toHaveBeenCalledWith([
        response,
        response
      ]);
    });

    it('should return data mapped by Payment adaptor', () => {
      const request: QCGCGetBalancePayload = {
        cardType: GiftCardTxnEnum.CM,
        cardNumber: '1234'
      };

      const response: GHSeVoucherDetails = {
        cardExpiryDate: '12-12-2020',
        responseCode: 112,
        responseMessage: 'SDHEE',
        productGroup: ['GROUP'],
        paymentCategoryName: 'Category',
        partialRedemption: false,
        firstName: 'Rakesh',
        phone: '1233',
        cardNumber: '1234',
        cardBalance: '1000',
        cardStatus: 'OPEN',
        cardProgramGroupName: 'SE'
      };

      const url1 = getQCGCPaymentCustomerEndpointURl(request);
      const url2 = getQCGCProductGroupEndpointURl(request);
      spyOn(PaymentAdaptor, 'getGHSeVoucherBalanceDetails').and.returnValue(
        response
      );

      paymentService
        .getGHSeVoucherCustomerBalance(request)
        .subscribe(data => expect(data).toEqual(response));

      const request1 = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url1.path;
      });

      request1.flush(response);

      const request2 = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url2.path;
      });

      request2.flush(response);
    });
  });

  describe('addROManualPayment', () => {
    it('should call api method with correct url and params', () => {
      const transactionType = TransactionTypeEnum.CM;
      const subTransactionType = SubTransactionTypeEnum.NEW_CM;
      const transactionId = '1234';

      const paymentDetails: PaymentType = new ROManualPayment(
        PaymentGroupEnum.REGULAR,
        {
          amount: 100,
          approvedBy: 'Rakesh',
          customerId: '123',
          paymentCode: 'RO',
          requestedReason: 'TEST',
          instrumentDate: moment().format()
        }
      );
      const requestResponse: PaymentRequest = {
        customerId: 11,
        paymentCode: 'RO',
        amount: 100,
        requestedReason: 'Test',
        approvedBy: 'RSO',
        referenceId: 'REF_ID',
        id: '123AWW',
        status: 'APPROVED',
        utilizedAmount: 100,
        locationCode: 'URB',
        requestedBy: 'RAKESH',
        requestedDate: null,
        approvedDate: null,
        approvedReason: 'Test',
        otherDetails: null
      };

      // const paymentData = {
      //   amount: paymentDetails.payload.amount,
      //   instrumentDate: moment('12-12-2020'),
      //   payerBankName: paymentDetails.payload.approvedBy,
      //   reference1: requestResponse.referenceId,
      //   reference2: requestResponse.id,
      //   remarks: paymentDetails.payload.requestedReason
      // };

      const url1 = getPaymentRequestUrl();
      const url2 = getAddPaymentEndpointUrl(
        transactionType,
        subTransactionType,
        transactionId,
        paymentDetails.mode,
        paymentDetails.group
      );

      spyOn(PaymentAdaptor, 'getROPaymentRequest').and.returnValue(
        requestResponse
      );
      spyOn(PaymentHelper, 'getPaymentDetails').and.returnValue({});

      paymentService
        .addManualPayment(
          transactionType,
          subTransactionType,
          transactionId,
          paymentDetails
        )
        .subscribe();

      const request1 = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url1;
      });
      expect(request1.cancelled).toBeFalsy();
      expect(request1.request.method).toEqual('POST');
      expect(request1.request.responseType).toEqual('json');

      expect(request1.request.body as Object).toEqual(
        JSON.stringify(paymentDetails.payload)
      );

      request1.flush(requestResponse);

      const request2 = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url2.path;
      });
      expect(request2.cancelled).toBeFalsy();
      expect(request2.request.method).toEqual('POST');
      expect(request2.request.responseType).toEqual('json');
      expect(request2.request.params.toString()).toEqual(
        url2.params.toString()
      );

      expect(request2.request.params.get('txnType')).toEqual(transactionType);
      expect(request2.request.params.get('subTxnType')).toEqual(
        subTransactionType
      );
      expect(request2.request.params.get('transactionId')).toEqual(
        transactionId
      );
      expect(request2.request.params.get('paymentCode')).toEqual(
        paymentDetails.mode
      );
      expect(request2.request.params.get('paymentGroup')).toEqual(
        paymentDetails.group
      );

      request2.flush({});
    });

    it('should call Payment Helper method with correct arguments', () => {
      const transactionType = TransactionTypeEnum.CM;
      const subTransactionType = SubTransactionTypeEnum.NEW_CM;
      const transactionId = '1234';

      const paymentDetails: PaymentType = new ROManualPayment(
        PaymentGroupEnum.REGULAR,
        {
          amount: 100,
          approvedBy: 'Rakesh',
          customerId: '123',
          paymentCode: 'RO',
          requestedReason: 'TEST',
          instrumentDate: moment().format()
        }
      );
      const requestResponse: PaymentRequest = {
        customerId: 11,
        paymentCode: 'RO',
        amount: 100,
        requestedReason: 'Test',
        approvedBy: 'RSO',
        referenceId: 'REF_ID',
        id: '123AWW',
        status: 'APPROVED',
        utilizedAmount: 100,
        locationCode: 'URB',
        requestedBy: 'RAKESH',
        requestedDate: null,
        approvedDate: null,
        approvedReason: 'Test',
        otherDetails: null
      };

      const apiResponse: PaymentDetails = {
        amount: 100,
        id: 'WQ1223',
        paymentCode: PaymentModeEnum.CASH,
        paymentGroup: PaymentGroupEnum.REGULAR,
        instrumentDate: moment(),
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

      const url1 = getPaymentRequestUrl();
      const url2 = getAddPaymentEndpointUrl(
        transactionType,
        subTransactionType,
        transactionId,
        paymentDetails.mode,
        paymentDetails.group
      );

      spyOn(PaymentAdaptor, 'getROPaymentRequest').and.returnValue(
        requestResponse
      );
      spyOn(PaymentHelper, 'getPaymentDetails').and.returnValue({});

      paymentService
        .addManualPayment(
          transactionType,
          subTransactionType,
          transactionId,
          paymentDetails
        )
        .subscribe();

      const request1 = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url1;
      });

      request1.flush(requestResponse);

      const request2 = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url2.path;
      });

      request2.flush(apiResponse);
      expect(PaymentAdaptor.getROPaymentRequest).toHaveBeenCalledWith(
        requestResponse
      );
      expect(PaymentHelper.getPaymentDetails).toHaveBeenCalledWith(apiResponse);
    });

    it('should return data mapped by Payment adaptor', () => {
      const transactionType = TransactionTypeEnum.CM;
      const subTransactionType = SubTransactionTypeEnum.NEW_CM;
      const transactionId = '1234';

      const paymentDetails: PaymentType = new ROManualPayment(
        PaymentGroupEnum.REGULAR,
        {
          amount: 100,

          approvedBy: 'Rakesh',
          customerId: '123',
          paymentCode: 'RO',
          requestedReason: 'TEST',
          instrumentDate: moment().format()
        }
      );
      const requestResponse: PaymentRequest = {
        customerId: 11,
        paymentCode: 'RO',
        amount: 100,
        requestedReason: 'Test',
        approvedBy: 'RSO',
        referenceId: 'REF_ID',
        id: '123AWW',
        status: 'APPROVED',
        utilizedAmount: 100,
        locationCode: 'URB',
        requestedBy: 'RAKESH',
        requestedDate: null,
        approvedDate: null,
        approvedReason: 'Test',
        otherDetails: null
      };

      const apiResponse: PaymentDetails = {
        amount: 100,
        id: 'WQ1223',
        paymentCode: PaymentModeEnum.CASH,
        paymentGroup: PaymentGroupEnum.REGULAR,
        instrumentDate: moment(),
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

      const url1 = getPaymentRequestUrl();
      const url2 = getAddPaymentEndpointUrl(
        transactionType,
        subTransactionType,
        transactionId,
        paymentDetails.mode,
        paymentDetails.group
      );

      spyOn(PaymentAdaptor, 'getROPaymentRequest').and.returnValue(
        requestResponse
      );
      spyOn(PaymentHelper, 'getPaymentDetails').and.returnValue(apiResponse);

      paymentService
        .addManualPayment(
          transactionType,
          subTransactionType,
          transactionId,
          paymentDetails
        )
        .subscribe(data => expect(data).toEqual(apiResponse));

      const request1 = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url1;
      });

      request1.flush(requestResponse);

      const request2 = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url2.path;
      });

      request2.flush(apiResponse);
    });
  });
  describe('loadCreditNoteList', () => {
    it('should call api method with correct url and params', () => {
      const payload: CNListRequestPayload = {
        customerId: 344,
        isPageable: false,
        locationCode: 'URB',
        isFrozenRateCnRequired: true
      };
      const ruleType = 'CN_PRIORITY_CONFIG';

      const creditNotePrioritiesApi = getCnPriorityUrl(ruleType);
      const cnListUrl = getCnRequestListUrl(
        payload.customerId,
        payload.isPageable,
        true
      );

      const cnType: string[] = ['GRN', 'ADVANCE', 'TEP'];

      const cnTypeList: CNListResponse = {
        cnList: [
          {
            creditNoteType: 'GRN',
            customerName: 'Panith',
            amount: 5000,
            docNo: 49,
            fiscalYear: '2020',
            id: '393934nf',
            linkedTxnId: '',
            linkedTxnType: 'CREDIT NOTE',
            locationCode: 'URB',
            mobileNumber: '9493848383',
            status: 'OPEN',
            priority: 1
          }
        ],
        totalElements: 1
      };

      spyOn(PaymentHelper, 'getCnType').and.returnValue(cnType);
      spyOn(PaymentHelper, 'getCNListResponse').and.returnValue(cnTypeList);

      paymentService.loadCreditNoteList(payload).subscribe();

      const request1 = httpTestingController.expectOne(req => {
        return req.url === apiUrl + creditNotePrioritiesApi;
      });
      expect(request1.cancelled).toBeFalsy();
      expect(request1.request.method).toEqual('POST');
      expect(request1.request.responseType).toEqual('json');
      request1.flush(cnType);

      const request2 = httpTestingController.expectOne(req => {
        return req.url === apiUrl + cnListUrl.path;
      });
      expect(request2.cancelled).toBeFalsy();
      expect(request2.request.method).toEqual('GET');
      expect(request2.request.responseType).toEqual('json');
      expect(request2.request.params.toString()).toEqual(
        cnListUrl.params.toString()
      );

      request2.flush(cnTypeList);
    });

    it('should call Payment Helper method with correct arguments', () => {
      const payload: CNListRequestPayload = {
        customerId: 344,
        isPageable: false,
        locationCode: 'URB'
      };
      const ruleType = 'CN_PRIORITY_CONFIG';

      const creditNotePrioritiesApi = getCnPriorityUrl(ruleType);
      const cnListUrl = getCnRequestListUrl(
        payload.customerId,
        payload.isPageable,
        true
      );

      const cnType: string[] = ['GRN', 'ADVANCE', 'TEP'];

      const cnTypeList: CNListResponse = {
        cnList: [
          {
            creditNoteType: 'GRN',
            customerName: 'Panith',
            amount: 5000,
            docNo: 49,
            fiscalYear: '2020',
            id: '393934nf',
            linkedTxnId: '',
            linkedTxnType: 'CREDIT NOTE',
            locationCode: 'URB',
            mobileNumber: '9493848383',
            status: 'OPEN',
            priority: 1
          }
        ],
        totalElements: 1
      };

      spyOn(PaymentHelper, 'getCnType').and.returnValue(cnType);
      spyOn(PaymentHelper, 'getCNListResponse').and.returnValue(cnTypeList);

      paymentService.loadCreditNoteList(payload).subscribe();

      const request1 = httpTestingController.expectOne(req => {
        return req.url === apiUrl + creditNotePrioritiesApi;
      });

      request1.flush({ priorityDetails: cnType });

      const request2 = httpTestingController.expectOne(req => {
        return req.url === apiUrl + cnListUrl.path;
      });
      request2.flush({ results: cnTypeList });

      expect(PaymentHelper.getCNListResponse).toHaveBeenCalledWith(cnType, {
        results: cnTypeList
      });
      // expect(PaymentHelper.getCNListResponse).toBe(cnType, cnTypeList);
    });

    it('should return data mapped by Payment adaptor', () => {
      const payload: CNListRequestPayload = {
        customerId: 344,
        isPageable: false,
        locationCode: 'URB'
      };
      const ruleType = 'CN_PRIORITY_CONFIG';

      const creditNotePrioritiesApi = getCnPriorityUrl(ruleType);
      const cnListUrl = getCnRequestListUrl(
        payload.customerId,
        payload.isPageable,
        true
      );

      const cnType: string[] = ['GRN', 'ADVANCE', 'TEP'];

      const cnTypeList: CNListResponse = {
        cnList: [
          {
            creditNoteType: 'GRN',
            customerName: 'Panith',
            amount: 5000,
            docNo: 49,
            fiscalYear: '2020',
            id: '393934nf',
            linkedTxnId: '',
            linkedTxnType: 'CREDIT NOTE',
            locationCode: 'URB',
            mobileNumber: '9493848383',
            status: 'OPEN',
            priority: 2
          }
        ],
        totalElements: 1
      };

      spyOn(PaymentHelper, 'getCnType').and.returnValue(cnType);
      spyOn(PaymentHelper, 'getCNListResponse').and.returnValue(cnTypeList);

      paymentService.loadCreditNoteList(payload).subscribe(data => {
        expect(data).toEqual(cnTypeList);
      });

      const request1 = httpTestingController.expectOne(req => {
        return req.url === apiUrl + creditNotePrioritiesApi;
      });

      request1.flush(cnType);

      const request2 = httpTestingController.expectOne(req => {
        return req.url === apiUrl + cnListUrl.path;
      });
      request2.flush({ results: cnTypeList });
    });
  });

  describe('loadCreditNoteDetails', () => {
    it('should call GET api method with correct url and params', () => {
      const payload = '123';

      const api = getLoadCreditNoteDetailsEndpointUrl(payload, 'CM');
      const data = {
        results: [
          {
            amount: 100,
            creditNoteType: 'Type',
            customerName: 'Customer Name',
            fiscalYear: '2021',
            id: 'TEST ID',
            mobileNumber: '990099009',
            status: 'OPEN',
            locationCode: 'CPD',
            linkedTxnType: 'TYPE',
            linkedTxnId: 'ID',
            docNo: 123,
            priority: 0
          }
        ]
      };

      paymentService.loadCreditNoteDetails(payload, 'CM').subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + api.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('linkedTxnId')).toEqual(payload);

      request.flush(data);
    });

    it('should return cn details ', () => {
      const payload = '123';

      const api = getLoadCreditNoteDetailsEndpointUrl(payload, 'CM');
      const data = {
        results: [
          {
            amount: 100,
            creditNoteType: 'Type',
            customerName: 'Customer Name',
            fiscalYear: '2021',
            id: 'TEST ID',
            mobileNumber: '990099009',
            status: 'OPEN',
            locationCode: 'CPD',
            linkedTxnType: 'TYPE',
            linkedTxnId: 'ID',
            docNo: 123,
            priority: 0
          }
        ]
      };

      paymentService
        .loadCreditNoteDetails(payload, 'CM')
        .subscribe(details => expect(details).toEqual(data.results));

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + api.path;
      });

      request.flush(data);
    });
  });

  describe('getGVBalance', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(PaymentAdaptor, 'GVBalanceDetails').and.returnValue({});

      const payload: GVStatusListingPayload = {
        pageIndex: 10,
        pageSize: 12,
        serialNo: '10'
      };

      const { path, params } = getGVBalanceUrl(payload);

      paymentService.getGVBalance(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('serialNo')).toEqual(payload.serialNo);

      request.flush({});
    });

    it('should call Payment Helper method with correct arguments', () => {
      spyOn(PaymentAdaptor, 'GVBalanceDetails').and.returnValue({});

      const payload: GVStatusListingPayload = {
        pageIndex: 10,
        pageSize: 12,
        serialNo: '10'
      };

      const gvStatus = {
        serialNo: 123,
        newlyAdded: true,
        giftCode: 'CODE',
        regionCode: 'REGION_CODE',
        denomination: 1,
        quantity: 2,
        totalValue: 3,
        status: 'OPEN',
        mfgDate: 2021,
        locationCode: 12,
        validityDays: 22,
        activationDate: 12,
        validFrom: null,
        validTill: null,
        giftDetails: null,
        remarks: 'Remarks',
        excludes: ['ITEM1'],
        indentNo: 12,
        extendCount: 12
      };
      const data: GVStatusUpdateList = {
        gvStatusList: [gvStatus],
        count: 100
      };
      const { path, params } = getGVBalanceUrl(payload);

      paymentService.getGVBalance(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(data);
      expect(PaymentAdaptor.GVBalanceDetails).toHaveBeenCalledWith(data);
    });

    it('should return data mapped by Payment Helper', () => {
      const payload: GVStatusListingPayload = {
        pageIndex: 10,
        pageSize: 12,
        serialNo: '10'
      };

      const gvStatus = {
        serialNo: 123,
        newlyAdded: true,
        giftCode: 'CODE',
        regionCode: 'REGION_CODE',
        denomination: 1,
        quantity: 2,
        totalValue: 3,
        status: 'OPEN',
        mfgDate: 2021,
        locationCode: 12,
        validityDays: 22,
        activationDate: 12,
        validFrom: null,
        validTill: null,
        giftDetails: null,
        remarks: 'Remarks',
        excludes: ['ITEM1'],
        indentNo: 12,
        extendCount: 12
      };
      const data: GVStatusUpdateList = {
        gvStatusList: [gvStatus],
        count: 100
      };

      spyOn(PaymentAdaptor, 'GVBalanceDetails').and.returnValue(data);

      const { path, params } = getGVBalanceUrl(payload);

      paymentService.getGVBalance(payload).subscribe(details => {
        expect(details).toEqual(data);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush({});
    });
  });

  describe('generateOTPForCN', () => {
    it('should call POST api method with correct url and params', () => {
      const payload: GenerateOtpPayload = {
        id: 'TEST ID',
        otpType: 'NEW'
      };

      const { path, params } = generateOTPForCnUrl(payload.id, payload.otpType);

      paymentService.generateOTPForCN(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.params.get('id')).toEqual(payload.id);

      expect(request.request.params.get('otpType')).toEqual(payload.otpType);

      request.flush({});
    });
  });

  describe('invokeCN', () => {
    it('should call api method with correct url and params', () => {
      const payload: InvokeCNRequestPayload = {
        cnNumber: 123,
        fiscalYear: 2021,
        locationCode: 'URB'
      };

      const ruleType = 'CN_PRIORITY_CONFIG';

      const creditNotePrioritiesApi = getCnPriorityUrl(ruleType);
      const cnListUrl = getInvokeCNUrl(payload.cnNumber, payload.fiscalYear);

      spyOn(PaymentHelper, 'getCNListResponse').and.returnValue({});

      paymentService.invokeCN(payload).subscribe();

      const request1 = httpTestingController.expectOne(req => {
        return req.url === apiUrl + creditNotePrioritiesApi;
      });
      expect(request1.cancelled).toBeFalsy();
      expect(request1.request.method).toEqual('POST');
      expect(request1.request.responseType).toEqual('json');
      request1.flush({});

      const request2 = httpTestingController.expectOne(req => {
        return req.url === apiUrl + cnListUrl.path;
      });
      expect(request2.cancelled).toBeFalsy();
      expect(request2.request.method).toEqual('GET');
      expect(request2.request.responseType).toEqual('json');
      expect(request2.request.params.toString()).toEqual(
        cnListUrl.params.toString()
      );

      request2.flush({});
    });

    it('should call Payment Helper method with correct arguments', () => {
      const payload: InvokeCNRequestPayload = {
        cnNumber: 123,
        fiscalYear: 2021,
        locationCode: 'URB'
      };

      const ruleType = 'CN_PRIORITY_CONFIG';

      const creditNotePrioritiesApi = getCnPriorityUrl(ruleType);
      const cnListUrl = getInvokeCNUrl(payload.cnNumber, payload.fiscalYear);

      spyOn(PaymentHelper, 'getCNListResponse').and.returnValue({});

      const cnType: string[] = ['GRN', 'ADVANCE', 'TEP'];

      const cnTypeList: CNListResponse = {
        cnList: [
          {
            creditNoteType: 'GRN',
            customerName: 'Panith',
            amount: 5000,
            docNo: 49,
            fiscalYear: '2020',
            id: '393934nf',
            linkedTxnId: '',
            linkedTxnType: 'CREDIT NOTE',
            locationCode: 'URB',
            mobileNumber: '9493848383',
            status: 'OPEN',
            priority: 1
          }
        ],
        totalElements: 1
      };

      paymentService.invokeCN(payload).subscribe();

      const request1 = httpTestingController.expectOne(req => {
        return req.url === apiUrl + creditNotePrioritiesApi;
      });

      request1.flush({ priorityDetails: cnType });

      const request2 = httpTestingController.expectOne(req => {
        return req.url === apiUrl + cnListUrl.path;
      });
      request2.flush({ results: cnTypeList });

      expect(PaymentHelper.getCNListResponse).toHaveBeenCalledWith(cnType, {
        results: cnTypeList
      });
    });

    it('should return data mapped by Payment adaptor', () => {
      const payload: InvokeCNRequestPayload = {
        cnNumber: 123,
        fiscalYear: 2021,
        locationCode: 'URB'
      };

      const ruleType = 'CN_PRIORITY_CONFIG';

      const creditNotePrioritiesApi = getCnPriorityUrl(ruleType);
      const cnListUrl = getInvokeCNUrl(payload.cnNumber, payload.fiscalYear);

      const cnType: string[] = ['GRN', 'ADVANCE', 'TEP'];

      const cnTypeList: CNListResponse = {
        cnList: [
          {
            creditNoteType: 'GRN',
            customerName: 'Panith',
            amount: 5000,
            docNo: 49,
            fiscalYear: '2020',
            id: '393934nf',
            linkedTxnId: '',
            linkedTxnType: 'CREDIT NOTE',
            locationCode: 'URB',
            mobileNumber: '9493848383',
            status: 'OPEN',
            priority: 2
          }
        ],
        totalElements: 1
      };

      spyOn(PaymentHelper, 'getCNListResponse').and.returnValue(cnTypeList);

      paymentService.invokeCN(payload).subscribe(data => {
        expect(data).toEqual(cnTypeList);
      });

      const request1 = httpTestingController.expectOne(req => {
        return req.url === apiUrl + creditNotePrioritiesApi;
      });

      request1.flush(cnType);

      const request2 = httpTestingController.expectOne(req => {
        return req.url === apiUrl + cnListUrl.path;
      });
      request2.flush({ results: cnTypeList });
    });
  });

  describe('getThirdPartyCnList', () => {
    it('should call api method with correct url and params', () => {
      const payload: ThirdPartyCNRequestPayload = {
        customerIds: ['123'],
        isPageable: false,
        locationCode: 'URB'
      };

      const ruleType = 'CN_PRIORITY_CONFIG';

      const creditNotePrioritiesApi = getCnPriorityUrl(ruleType);
      const cnListUrl = getThirdPartyCnRequestListUrl(
        payload.customerIds,
        payload.isPageable
      );

      spyOn(PaymentHelper, 'getCNListResponse').and.returnValue({});

      paymentService.getThirdPartyCnList(payload).subscribe();

      const request1 = httpTestingController.expectOne(req => {
        return req.url === apiUrl + creditNotePrioritiesApi;
      });
      expect(request1.cancelled).toBeFalsy();
      expect(request1.request.method).toEqual('POST');
      expect(request1.request.responseType).toEqual('json');
      request1.flush({});

      const request2 = httpTestingController.expectOne(req => {
        return req.url === apiUrl + cnListUrl.path;
      });
      expect(request2.cancelled).toBeFalsy();
      expect(request2.request.method).toEqual('GET');
      expect(request2.request.responseType).toEqual('json');
      expect(request2.request.params.toString()).toEqual(
        cnListUrl.params.toString()
      );

      request2.flush({});
    });

    it('should call Payment Helper method with correct arguments', () => {
      const payload: ThirdPartyCNRequestPayload = {
        customerIds: ['123'],
        isPageable: false,
        locationCode: 'URB'
      };

      const ruleType = 'CN_PRIORITY_CONFIG';

      const creditNotePrioritiesApi = getCnPriorityUrl(ruleType);
      const cnListUrl = getThirdPartyCnRequestListUrl(
        payload.customerIds,
        payload.isPageable
      );

      spyOn(PaymentHelper, 'getCNListResponse').and.returnValue({});

      const cnType: string[] = ['GRN', 'ADVANCE', 'TEP'];

      const cnTypeList: CNListResponse = {
        cnList: [
          {
            creditNoteType: 'GRN',
            customerName: 'Panith',
            amount: 5000,
            docNo: 49,
            fiscalYear: '2020',
            id: '393934nf',
            linkedTxnId: '',
            linkedTxnType: 'CREDIT NOTE',
            locationCode: 'URB',
            mobileNumber: '9493848383',
            status: 'OPEN',
            priority: 1
          }
        ],
        totalElements: 1
      };

      paymentService.getThirdPartyCnList(payload).subscribe();

      const request1 = httpTestingController.expectOne(req => {
        return req.url === apiUrl + creditNotePrioritiesApi;
      });

      request1.flush({ priorityDetails: cnType });

      const request2 = httpTestingController.expectOne(req => {
        return req.url === apiUrl + cnListUrl.path;
      });
      request2.flush({ results: cnTypeList });

      expect(PaymentHelper.getCNListResponse).toHaveBeenCalledWith(cnType, {
        results: cnTypeList
      });
    });

    it('should return data mapped by Payment adaptor', () => {
      const payload: ThirdPartyCNRequestPayload = {
        customerIds: ['123'],
        isPageable: false,
        locationCode: 'URB'
      };

      const ruleType = 'CN_PRIORITY_CONFIG';

      const creditNotePrioritiesApi = getCnPriorityUrl(ruleType);
      const cnListUrl = getThirdPartyCnRequestListUrl(
        payload.customerIds,
        payload.isPageable
      );

      const cnType: string[] = ['GRN', 'ADVANCE', 'TEP'];

      const cnTypeList: CNListResponse = {
        cnList: [
          {
            creditNoteType: 'GRN',
            customerName: 'Panith',
            amount: 5000,
            docNo: 49,
            fiscalYear: '2020',
            id: '393934nf',
            linkedTxnId: '',
            linkedTxnType: 'CREDIT NOTE',
            locationCode: 'URB',
            mobileNumber: '9493848383',
            status: 'OPEN',
            priority: 2
          }
        ],
        totalElements: 1
      };

      spyOn(PaymentHelper, 'getCNListResponse').and.returnValue(cnTypeList);

      paymentService.getThirdPartyCnList(payload).subscribe(data => {
        expect(data).toEqual(cnTypeList);
      });

      const request1 = httpTestingController.expectOne(req => {
        return req.url === apiUrl + creditNotePrioritiesApi;
      });

      request1.flush(cnType);

      const request2 = httpTestingController.expectOne(req => {
        return req.url === apiUrl + cnListUrl.path;
      });
      request2.flush({ results: cnTypeList });
    });
  });
});
