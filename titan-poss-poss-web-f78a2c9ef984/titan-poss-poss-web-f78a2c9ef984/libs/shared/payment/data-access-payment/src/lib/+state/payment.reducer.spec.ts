import {
  AirpayPayment,
  AllowedPaymentsResponse,
  CashPayment,
  ChequePayment,
  CmRequestDetailsPayload,
  CNListRequestPayload,
  CNListResponse,
  CNListResponsePayload,
  CreditNotePayment,
  CustomErrors,
  DeletePaymentPayload,
  EditCashPaymentPayload,
  GenerateOtpPayload,
  GHSeVoucherDetails,
  GiftCardTxnEnum,
  GiftVoucher,
  GVStatusListingPayload,
  GVStatusUpdateList,
  InvokeCNRequestPayload,
  LoadMaxCashLimitPayload,
  LoadPaymentDetailsPayload,
  OtherDetailsForUnipay,
  PaymentConfig,
  PaymentDetails,
  PaymentGroupEnum,
  PaymentModeEnum,
  PaymentPayload,
  PaymentStatusEnum,
  QCGCCardDetails,
  PaymentRequest,
  IntegratedPaymentRequestPayload,
  StoreUser,
  SubTransactionTypeEnum,
  ThirdPartyCNRequestPayload,
  TransactionTypeEnum,
  UniPayPayment,
  UniPayRequest,
  UniPayResponse,
  ResendPaymentLinkPayload,
  CashLimitDetails
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import * as moment from 'moment';
import { initialState, paymentsReducer } from './payment.reducer';
import * as actions from './payment.actions';
import { PaymentState } from './payment.state';
import { gvAdapter, paymentDetailsAdapter } from './payment.entity';

describe('Payment Reducer Testing Suite', () => {
  let testState = initialState;

  const paymentDetails: PaymentDetails = {
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

  describe('Actions should check intial state', () => {
    it('should return the initial state', () => {
      const action: any = {};
      const state: PaymentState = paymentsReducer(undefined, action);

      expect(state).toBe(testState);
    });
  });

  describe('Actions should reset payment state', () => {
    it('RESET_PAYMENT action', () => {
      testState = {
        ...testState,
        error: CustomErrorAdaptor.fromJson(Error('Some Error')),
        paymentDetails: paymentDetailsAdapter.setAll(
          [paymentDetails],
          initialState.paymentDetails
        ),
        isChequeDDPaymentSuccess: true,
        maxCashLimit: 100,
        cardConfig: {
          isBankMandatory: false,
          isCardTypeMandatory: false,
          cardType: [],
          payerBanks: []
        }
      };

      const action = new actions.ResetPayment();

      const result: PaymentState = paymentsReducer(testState, action);

      expect(result.error).toBeNull();
      expect(result.paymentDetails).toEqual(
        paymentDetailsAdapter.getInitialState()
      );
      expect(result.cnDetails).toEqual([]);
      expect(result.isChequeDDPaymentSuccess).toBeFalsy();
      expect(result.maxCashLimit).toEqual(0);
      expect(result.allowedPayments).toEqual(
        new Map<PaymentModeEnum, PaymentGroupEnum>()
      );
      expect(result.payeeBanks).toEqual([]);
      expect(result.chequePayerBanks).toEqual([]);
      expect(result.ddPayerBanks).toEqual([]);
      expect(result.cardConfig.payerBanks).toEqual([]);
      expect(result.cardConfig.cardType).toEqual([]);
      expect(result.cardConfig.isBankMandatory).toBeTruthy();
      expect(result.cardConfig.isCardTypeMandatory).toBeTruthy([]);
      expect(result.wallets).toEqual([]);
      expect(result.subBankLoans).toEqual([]);
      expect(result.paymentFieldNames).toEqual([]);

      expect(result.failedGV).toEqual([]);
      expect(result.roPaymentStatus).toBeNull();
    });
  });

  describe('Actions should send RO payment request', () => {
    it('SEND_RO_PAYMENT_REQUEST action', () => {
      testState = {
        ...testState,
        isLoading: false,
        roPaymentStatus: {
          isSuccess: true,
          transactionId: '123'
        }
      };

      const payload: IntegratedPaymentRequestPayload = {
        amount: 100,
        customerId: '22',
        paymentCode: 'RO',
        requestedReason: 'TEST'
      };

      const action = new actions.SendPaymentRequest(payload);

      const result: PaymentState = paymentsReducer(testState, action);

      expect(result.isLoading).toBeTruthy();
      expect(result.roPaymentStatus).toBeNull();
    });

    it('SEND_RO_PAYMENT_REQUEST_SUCCESS action', () => {
      testState = {
        ...testState,
        isLoading: true,
        roPaymentStatus: {
          isSuccess: true,
          transactionId: '123'
        }
      };

      const payload: PaymentRequest = {
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

      const action = new actions.SendPaymentRequestSuccess(payload);

      const result: PaymentState = paymentsReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.roPaymentStatus.isSuccess).toBeTruthy();
      expect(result.roPaymentStatus.transactionId).toBeTruthy(
        payload.referenceId
      );
    });

    it('SEND_RO_PAYMENT_REQUEST_FAILURE action', () => {
      testState = {
        ...testState,
        isLoading: true,
        roPaymentStatus: {
          isSuccess: true,
          transactionId: '123'
        }
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.SendPaymentRequestFailure(payload);

      const result: PaymentState = paymentsReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.roPaymentStatus.isSuccess).toBeFalsy();
      expect(result.roPaymentStatus.transactionId).toBeNull();
    });
  });

  describe('Actions should Load Encirecle Points', () => {
    it('LOAD_ENCIRECLE_POINTS action', () => {
      testState = {
        ...testState,
        isLoading: false,
        encirclePoints: 100
      };

      const payload = '123';

      const action = new actions.LoadEncireclePoints(payload);

      const result: PaymentState = paymentsReducer(testState, action);

      expect(result.isLoading).toBeTruthy();
      expect(result.encirclePoints).toBe(0);
    });

    it('LOAD_ENCIRECLE_POINTS_SUCCESS action', () => {
      testState = {
        ...testState,
        isLoading: true,
        encirclePoints: 100
      };

      const payload = 100;

      const action = new actions.LoadEncireclePointsSuccess(payload);

      const result: PaymentState = paymentsReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.encirclePoints).toBe(payload);
    });

    it('LOAD_ENCIRECLE_POINTS_FAILURE action', () => {
      testState = {
        ...testState,
        isLoading: true,
        error: null
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.LoadEncireclePointsFailure(payload);

      const result: PaymentState = paymentsReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.error).toBe(payload);
    });
  });

  describe('Actions should Load RO Payment Request Status', () => {
    it('LOAD_RO_PAYMENT_REQUEST_STATUS action', () => {
      testState = {
        ...testState,
        isLoading: false,
        roPaymentRequest: {
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
        }
      };

      const payload = '123';

      const action = new actions.LoadROPaymentRequestStatus(payload);

      const result: PaymentState = paymentsReducer(testState, action);

      expect(result.isLoading).toBeTruthy();
      expect(result.roPaymentRequest).toBeNull();
    });

    it('LOAD_RO_PAYMENT_REQUEST_STATUS_SUCCESS action', () => {
      testState = {
        ...testState,
        isLoading: true,
        roPaymentRequest: null
      };

      const payload: PaymentRequest = {
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

      const action = new actions.LoadROPaymentRequestStatusSuccess(payload);

      const result: PaymentState = paymentsReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.roPaymentRequest).toBe(payload);
    });

    it('LOAD_RO_PAYMENT_REQUEST_STATUS_FAILURE action', () => {
      testState = {
        ...testState,
        isLoading: true,
        error: null
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.LoadROPaymentRequestStatusFailure(payload);

      const result: PaymentState = paymentsReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.error).toBe(payload);
    });
  });

  describe('Actions should Add Payment', () => {
    it('ADD_CASH_PAYMENT action', () => {
      testState = {
        ...testState,
        isLoading: false
      };

      const payload: PaymentPayload = {
        transactionType: TransactionTypeEnum.CM,
        subTransactionType: SubTransactionTypeEnum.NEW_CM,
        transactionId: '122',
        paymentDetails: new CashPayment(PaymentGroupEnum.REGULAR, {
          amount: 1000
        })
      };

      const action = new actions.AddCashPayment(payload);

      const result: PaymentState = paymentsReducer(testState, action);

      expect(result.isLoading).toBeTruthy();
    });

    it('ADD_CASH_PAYMENT_SUCCESS action', () => {
      testState = {
        ...testState,
        isLoading: true,
        paymentDetails: paymentDetailsAdapter.getInitialState(),
        loadMaxCashLimit: {
          load: true
        }
      };

      const payload = paymentDetails;

      const action = new actions.AddCashPaymentSuccess(payload);

      const result: PaymentState = paymentsReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.loadMaxCashLimit.load).toBeTruthy();
      expect(result.paymentDetails.entities[payload.id]).toBe(payload);
    });

    it('ADD_CASH_PAYMENT_FAILURE action', () => {
      testState = {
        ...testState,
        isLoading: true,
        error: null
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.AddCashPaymentFailure(payload);

      const result: PaymentState = paymentsReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.error).toBe(payload);
    });
  });

  describe('Actions should Add cheque Payment', () => {
    it('ADD_CHEQUE_DD_PAYMENT action', () => {
      testState = {
        ...testState,
        isLoading: false,
        isChequeDDPaymentSuccess: true
      };

      const payload: PaymentPayload = {
        transactionType: TransactionTypeEnum.CM,
        subTransactionType: SubTransactionTypeEnum.NEW_CM,
        transactionId: '122',
        paymentDetails: new ChequePayment(PaymentGroupEnum.REGULAR, {
          instrumentNo: '123',
          instrumentDate: moment(),
          amount: 1000,
          bankName: 'BANK'
        })
      };
      const action = new actions.AddChequeDDPayment(payload);

      const result: PaymentState = paymentsReducer(testState, action);

      expect(result.isLoading).toBeTruthy();
      expect(result.isChequeDDPaymentSuccess).toBeFalsy();
    });

    it('ADD_CHEQUE_DD_PAYMENT_SUCCESS action', () => {
      testState = {
        ...testState,
        isLoading: true,
        paymentDetails: paymentDetailsAdapter.getInitialState(),
        isChequeDDPaymentSuccess: false
      };

      const payload = paymentDetails;

      const action = new actions.AddChequeDDPaymentSuccess(payload);

      const result: PaymentState = paymentsReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.loadMaxCashLimit.load).toBeTruthy();
      expect(result.paymentDetails.entities[payload.id]).toBe(payload);
      expect(result.isChequeDDPaymentSuccess).toBeTruthy();
    });

    it('ADD_CHEQUE_DD_PAYMENT_FAILURE action', () => {
      testState = {
        ...testState,
        isLoading: true,
        error: null
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.AddCashPaymentFailure(payload);

      const result: PaymentState = paymentsReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.error).toBe(payload);
    });
  });

  describe('Actions should Generate Otp For Cn', () => {
    it('GENERATE_OTP_FOR_CN action', () => {
      testState = {
        ...testState,
        isLoading: false
      };

      const payload: GenerateOtpPayload = {
        id: 'TEST ID',
        otpType: 'NEW'
      };
      const action = new actions.GenerateOtpForCn(payload);

      const result: PaymentState = paymentsReducer(testState, action);

      expect(result.isLoading).toBeTruthy();
    });

    it('GENERATE_OTP_FOR_CN_SUCCESS action', () => {
      testState = {
        ...testState,
        isLoading: true,
        isCnOtpGenerated: false
      };

      const action = new actions.GenerateOtpForCnSuccess();

      const result: PaymentState = paymentsReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.isCnOtpGenerated).toBeTruthy();
    });

    it('GENERATE_OTP_FOR_CN_FAILURE action', () => {
      testState = {
        ...testState,
        isLoading: true,
        error: null
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.GenerateOtpForCnFailure(payload);

      const result: PaymentState = paymentsReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.error).toBe(payload);
    });
  });

  describe('Actions should Get Credit Note List', () => {
    it('GET_CREDIT_NOTE_LIST action', () => {
      testState = {
        ...testState,
        isLoading: false
      };

      const payload: CNListRequestPayload = {
        customerId: 344,
        isPageable: false,
        locationCode: 'URB'
      };
      const action = new actions.GetCreditNoteList(payload);
      const result: PaymentState = paymentsReducer(testState, action);
      expect(result.isLoading).toBeTruthy();
    });

    it('GET_CREDIT_NOTE_LIST_SUCCESS action', () => {
      testState = {
        ...testState,
        isLoading: true,
        creditNoteList: null
      };
      const payload: CNListResponse = {
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

      const action = new actions.GetCreditNoteListSuccess(payload);
      const result: PaymentState = paymentsReducer(testState, action);
      expect(result.isLoading).toBeFalsy();
      expect(result.creditNoteList).toBe(payload);
    });

    it('GET_CREDIT_NOTE_LIST_FAILURE action', () => {
      testState = {
        ...testState,
        isLoading: true,
        error: null
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.GetCreditNoteListFailure(payload);
      const result: PaymentState = paymentsReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.error).toBe(payload);
    });
  });

  describe('Actions should Get Third Party CN List', () => {
    it('GET_THIRD_PARTY_CN_LIST action', () => {
      testState = {
        ...testState,
        isLoading: false
      };

      const payload: ThirdPartyCNRequestPayload = {
        customerIds: ['123'],
        isPageable: false,
        locationCode: 'URB'
      };

      const action = new actions.GetThirdPartyCNList(payload);
      const result: PaymentState = paymentsReducer(testState, action);
      expect(result.isLoading).toBeTruthy();
    });

    it('GET_THIRD_PARTY_CN_LIST_SUCCESS action', () => {
      testState = {
        ...testState,
        isLoading: true,
        thirdPartyCnList: null
      };
      const payload: CNListResponse = {
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

      const action = new actions.GetThirdPartyCNListSuccess(payload);
      const result: PaymentState = paymentsReducer(testState, action);
      expect(result.isLoading).toBeFalsy();
      expect(result.thirdPartyCnList).toBe(payload);
    });

    it('GET_THIRD_PARTY_CN_LIST_FAILURE action', () => {
      testState = {
        ...testState,
        isLoading: true,
        error: null
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.GetThirdPartyCNListFailure(payload);
      const result: PaymentState = paymentsReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.error).toBe(payload);
    });
  });

  //

  describe('Actions should Get Invoked Credit Note', () => {
    it('GET_INVOKED_CREDIT_NOTE action', () => {
      testState = {
        ...testState,
        isLoading: false
      };

      const payload: InvokeCNRequestPayload = {
        cnNumber: 123,
        fiscalYear: 2021,
        locationCode: 'URB'
      };

      const action = new actions.GetInvokedCreditNote(payload);
      const result: PaymentState = paymentsReducer(testState, action);
      expect(result.isLoading).toBeTruthy();
    });

    it('GET_INVOKED_CREDIT_NOTE_SUCCESS action', () => {
      testState = {
        ...testState,
        isLoading: true,
        thirdPartyCnList: null
      };
      const payload: CNListResponse = {
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

      const action = new actions.GetInvokedCreditNoteSuccess(payload);
      const result: PaymentState = paymentsReducer(testState, action);
      expect(result.isLoading).toBeFalsy();
      expect(result.invokedCN).toBe(payload);
    });

    it('GET_INVOKED_CREDIT_NOTE_FAILURE action', () => {
      testState = {
        ...testState,
        isLoading: true,
        error: null
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.GetInvokedCreditNoteFailure(payload);
      const result: PaymentState = paymentsReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.error).toBe(payload);
    });
  });

  describe('Actions should Get GV Balance', () => {
    it('GET_GV_BALANCE action', () => {
      testState = {
        ...testState,
        isLoading: false,
        GVDetails: gvAdapter.setAll(
          [
            {
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
            }
          ],
          testState.GVDetails
        )
      };

      const payload: GVStatusListingPayload = {
        pageIndex: 10,
        pageSize: 12,
        serialNo: '10'
      };

      const action = new actions.GetGVBalance(payload);
      const result: PaymentState = paymentsReducer(testState, action);

      expect(result.isLoading).toBeTruthy();
      expect(result.GVDetails).toEqual(gvAdapter.getInitialState());
    });

    it('GET_GV_BALANCE_SUCCESS action', () => {
      testState = {
        ...testState,
        isLoading: true,
        GVDetails: gvAdapter.getInitialState()
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
      const payload: GVStatusUpdateList = {
        gvStatusList: [gvStatus],
        count: 100
      };

      const action = new actions.GetGVBalanceSuccess(payload);
      const result: PaymentState = paymentsReducer(testState, action);
      expect(result.isLoading).toBeFalsy();
      expect(result.GVDetails.entities[gvStatus.serialNo]).toBe(gvStatus);
    });

    it('GET_GV_BALANCE_FAILURE action', () => {
      testState = {
        ...testState,
        isLoading: true,
        error: null
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.GetGVBalanceFailure(payload);
      const result: PaymentState = paymentsReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.error).toBe(payload);
    });
  });

  describe('Actions should Start Unipay Payment', () => {
    it('START_UNIPAY_PAYMENT action', () => {
      testState = {
        ...testState,
        isLoading: false,
        unipayPaymentDetails: {
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
        }
      };

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

      const action = new actions.StartUnipayPayment(payload);
      const result: PaymentState = paymentsReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.unipayPaymentDetails).toBeNull();
    });

    it('START_UNIPAY_PAYMENT_SUCCESS action', () => {
      testState = {
        ...testState,
        isLoading: false,
        unipayPaymentDetails: null
      };
      const payload: OtherDetailsForUnipay = {
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
      const action = new actions.StartUnipayPaymentSuccess(payload);
      const result: PaymentState = paymentsReducer(testState, action);
      expect(result.isLoading).toBeFalsy();
      expect(result.unipayPaymentDetails).toBe(payload);
    });

    it('START_UNIPAY_PAYMENT_FAILURE action', () => {
      testState = {
        ...testState,
        isLoading: false,
        error: null
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.StartUnipayPaymentFailure(payload);
      const result: PaymentState = paymentsReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.error).toBe(payload);
    });
  });

  describe('Actions should Void Unipay Payment', () => {
    it('VOID_UNIPAY_PAYMENT action', () => {
      testState = {
        ...testState,
        isLoading: false,
        unipayVoidPaymentDetails: {
          Request_Input: 'TEST',
          ResponseCode: 123,
          ResponseMessage: 'Test Data',
          ApprovalCode: 'Test Data',
          RRN_No: 'Test Data',
          Amount: '123',
          Card_Num: 'Test Data',
          Card_Type: 'Test Data',
          CardHolder_Name: 'Test Data',
          Acquirer_Bank: 'Test Data',
          Txn_Date: 'Test Data',
          Txn_Type: 'Test Data',
          BankInvoice_Num: 'Test Data',
          Batch_Number: 'Test Data',
          Terminal_Id: 'Test Data',
          Merchant_Id: 'Test Data',
          errorMsg: 'Test Data',
          errorCode: 'Test Data'
        }
      };

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

      const action = new actions.VoidUnipayPayment(payload);
      const result: PaymentState = paymentsReducer(testState, action);

      expect(result.isLoading).toBeTruthy();
      expect(result.unipayVoidPaymentDetails).toBeNull();
    });

    it('VOID_UNIPAY_PAYMENT_SUCCESS action', () => {
      testState = {
        ...testState,
        isLoading: true,
        unipayVoidPaymentDetails: null
      };
      const payload: UniPayResponse = {
        Request_Input: 'TEST',
        ResponseCode: 123,
        ResponseMessage: 'Test Data',
        ApprovalCode: 'Test Data',
        RRN_No: 'Test Data',
        Amount: '123',
        Card_Num: 'Test Data',
        Card_Type: 'Test Data',
        CardHolder_Name: 'Test Data',
        Acquirer_Bank: 'Test Data',
        Txn_Date: 'Test Data',
        Txn_Type: 'Test Data',
        BankInvoice_Num: 'Test Data',
        Batch_Number: 'Test Data',
        Terminal_Id: 'Test Data',
        Merchant_Id: 'Test Data',
        errorMsg: 'Test Data',
        errorCode: 'Test Data'
      };
      const action = new actions.VoidUnipayPaymentSuccess(payload);
      const result: PaymentState = paymentsReducer(testState, action);
      expect(result.isLoading).toBeFalsy();
      expect(result.unipayVoidPaymentDetails).toBe(payload);
    });

    it('VOID_UNIPAY_PAYMENT_FAILURE action', () => {
      testState = {
        ...testState,
        isLoading: true,
        error: null
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.VoidUnipayPaymentFailure(payload);
      const result: PaymentState = paymentsReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.error).toBe(payload);
    });
  });

  describe('Actions should Add Unipay Payment', () => {
    it('ADD_UNIPAY_PAYMENT action', () => {
      testState = {
        ...testState,
        isLoading: false,
        unipayTransactionDetails: {
          amount: 100,
          id: 'WQ1223'
        }
      };

      const payload: PaymentPayload = {
        transactionType: TransactionTypeEnum.CM,
        subTransactionType: SubTransactionTypeEnum.NEW_CM,
        transactionId: '122',
        paymentDetails: new UniPayPayment(PaymentGroupEnum.REGULAR, {
          amount: 1000
        })
      };

      const action = new actions.AddUnipayPayment(payload);
      const result: PaymentState = paymentsReducer(testState, action);

      expect(result.isLoading).toBeTruthy();
      expect(result.unipayPaymentDetails).toBeNull();
    });

    it('ADD_UNIPAY_PAYMENT_SUCCESS action', () => {
      testState = {
        ...testState,
        isLoading: true,
        unipayPaymentDetails: null
      };
      const payload = {
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
      const action = new actions.AddUnipayPaymentSuccess(payload);
      const result: PaymentState = paymentsReducer(testState, action);
      expect(result.isLoading).toBeFalsy();
      expect(result.unipayTransactionDetails).toBe(payload);
    });

    it('ADD_UNIPAY_PAYMENT_FAILURE action', () => {
      testState = {
        ...testState,
        isLoading: true,
        error: null
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.AddUnipayPaymentFailure(payload);
      const result: PaymentState = paymentsReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.error).toBe(payload);
    });
  });

  describe('Actions should Load Max Cash Limit', () => {
    it('LOAD_MAX_CASH_LIMIT action', () => {
      testState = {
        ...testState,
        isLoading: false,
        maxCashLimit: 100
      };

      const payload: LoadMaxCashLimitPayload = {
        transactionType: TransactionTypeEnum.CM,
        subTransactionType: SubTransactionTypeEnum.NEW_CM,
        customerId: '123',
        transactionId: '456',
        paymentCode: PaymentModeEnum.CASH,
        paymentGroup: PaymentGroupEnum.REGULAR
      };

      const action = new actions.LoadMaxCashLimit(payload);
      const result: PaymentState = paymentsReducer(testState, action);

      expect(result.isLoading).toBeTruthy();
      expect(result.maxCashLimit).toEqual(0);
    });

    it('LOAD_MAX_CASH_LIMIT_SUCCESS action', () => {
      testState = {
        ...testState,
        isLoading: true,
        maxCashLimit: 10
      };
      const payload: CashLimitDetails = {
        amountDue: 1000,
        eligibleAmount: 2000,
        pmlaEligibleAmount: 0,
        totalAmount: 10
      };

      const action = new actions.LoadMaxCashLimitSuccess(payload);
      const result: PaymentState = paymentsReducer(testState, action);
      expect(result.isLoading).toBeFalsy();
      expect(result.maxCashLimit).toBe(payload.eligibleAmount);
    });

    it('LOAD_MAX_CASH_LIMIT_FAILURE action', () => {
      testState = {
        ...testState,
        isLoading: true,
        error: null
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.LoadMaxCashLimitFailure(payload);
      const result: PaymentState = paymentsReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.error).toBe(payload);
    });
  });

  describe('Actions should Load Allowed Payments', () => {
    it('LOAD_ALLOWED_PAYMENTS action', () => {
      testState = {
        ...testState,
        isLoading: false,
        wallets: ['WALLET1'],
        subBankLoans: ['BANk_LOAN1'],
        paymentFieldNames: ['FIELD1'],
        allowedPayments: new Map<PaymentModeEnum, PaymentGroupEnum>().set(
          PaymentModeEnum.AIRPAY,
          PaymentGroupEnum.REGULAR
        ),
        customerSpecificPayments: [PaymentModeEnum.CARD],
        customerSpecificWalletPayments: ['WALLET1'],
        customerSpecificBankLoanPayments: ['BANk_LOAN1']
      };

      const payload = TransactionTypeEnum.CM;

      const action = new actions.LoadAllowedPayments(payload);
      const result: PaymentState = paymentsReducer(testState, action);

      expect(result.isLoading).toBeTruthy();
      expect(result.wallets).toEqual([]);
      expect(result.subBankLoans).toEqual([]);
      expect(result.paymentFieldNames).toEqual([]);
      expect(result.allowedPayments).toEqual(
        new Map<PaymentModeEnum, PaymentGroupEnum>()
      );
      expect(result.customerSpecificPayments).toEqual([]);
      expect(result.customerSpecificWalletPayments).toEqual([]);
      expect(result.customerSpecificBankLoanPayments).toEqual([]);
    });

    it('LOAD_ALLOWED_PAYMENTS_SUCCESS action', () => {
      testState = {
        ...testState,
        isLoading: true,
        wallets: [],
        subBankLoans: [],
        paymentFieldNames: [],
        allowedPayments: new Map<PaymentModeEnum, PaymentGroupEnum>(),
        customerSpecificPayments: [],
        customerSpecificWalletPayments: [],
        customerSpecificBankLoanPayments: []
      };
      const payload: AllowedPaymentsResponse = {
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
      const action = new actions.LoadAllowedPaymentsSuccess(payload);
      const result: PaymentState = paymentsReducer(testState, action);
      expect(result.isLoading).toBeFalsy();
      expect(result.wallets).toEqual(payload.wallets);
      expect(result.subBankLoans).toEqual(payload.subBankLoans);
      expect(result.paymentFieldNames).toEqual(payload.paymentFieldNames);
      expect(result.allowedPayments).toEqual(payload.allowedPayments);
      expect(result.customerSpecificPayments).toEqual(
        payload.customerSpecificPayments
      );
      expect(result.customerSpecificWalletPayments).toEqual(
        payload.customerSpecificWalletPayments
      );
      expect(result.customerSpecificBankLoanPayments).toEqual(
        payload.customerSpecificBankLoanPayments
      );
    });

    it('LOAD_ALLOWED_PAYMENTS_FAILURE action', () => {
      testState = {
        ...testState,
        isLoading: true,
        error: null
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.LoadAllowedPaymentsFailure(payload);
      const result: PaymentState = paymentsReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.error).toBe(payload);
    });
  });

  describe('Actions should Load Card Payer Banks Payments', () => {
    it('LOAD_CARD_PAYER_BANKS action', () => {
      testState = {
        ...testState,
        isLoading: false
      };

      const action = new actions.LoadCardPayerBanks();
      const result: PaymentState = paymentsReducer(testState, action);

      expect(result.isLoading).toBeTruthy();
    });

    it('LOAD_CARD_PAYER_BANKS_SUCCESS action', () => {
      testState = {
        ...testState,
        isLoading: true,
        cardConfig: null
      };
      const payload: PaymentConfig = {
        payerBanks: ['ICICI', 'HDFC'],
        cardType: ['CC', 'DC'],
        isBankMandatory: null,
        isCardTypeMandatory: null
      };
      const action = new actions.LoadCardPayerBanksSuccess(payload);
      const result: PaymentState = paymentsReducer(testState, action);
      expect(result.isLoading).toBeFalsy();
      expect(result.cardConfig).toEqual(payload);
    });

    it('LOAD_CARD_PAYER_BANKS_FAILURE action', () => {
      testState = {
        ...testState,
        isLoading: true,
        error: null
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.LoadCardPayerBanksFailure(payload);
      const result: PaymentState = paymentsReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.error).toBe(payload);
    });
  });

  describe('Actions should Load DD Payer Banks', () => {
    it('LOAD_DD_PAYER_BANKS action', () => {
      testState = {
        ...testState,
        isLoading: false
      };

      const action = new actions.LoadDDPayerBanks();
      const result: PaymentState = paymentsReducer(testState, action);

      expect(result.isLoading).toBeTruthy();
    });

    it('LOAD_DD_PAYER_BANKS_SUCCESS action', () => {
      testState = {
        ...testState,
        isLoading: true,
        ddPayerBanks: []
      };
      const payload: PaymentConfig = {
        payerBanks: ['ICICI', 'HDFC'],
        cardType: ['CC', 'DC'],
        isBankMandatory: null,
        isCardTypeMandatory: null
      };
      const action = new actions.LoadDDPayerBanksSuccess(payload);
      const result: PaymentState = paymentsReducer(testState, action);
      expect(result.isLoading).toBeFalsy();
      expect(result.ddPayerBanks).toEqual(payload.payerBanks);
    });

    it('LOAD_DD_PAYER_BANKS_FAILURE action', () => {
      testState = {
        ...testState,
        isLoading: true,
        error: null
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.LoadDDPayerBanksFailure(payload);
      const result: PaymentState = paymentsReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.error).toBe(payload);
    });
  });

  describe('Actions should Load Cheque Payer Banks', () => {
    it('LOAD_CHEQUE_PAYER_BANKS action', () => {
      testState = {
        ...testState,
        isLoading: false
      };

      const action = new actions.LoadChequePayerBanks();
      const result: PaymentState = paymentsReducer(testState, action);

      expect(result.isLoading).toBeTruthy();
    });

    it('LOAD_CHEQUE_PAYER_BANKS_SUCCESS action', () => {
      testState = {
        ...testState,
        isLoading: true,
        chequePayerBanks: []
      };
      const payload: PaymentConfig = {
        payerBanks: ['ICICI', 'HDFC'],
        cardType: ['CC', 'DC'],
        isBankMandatory: null,
        isCardTypeMandatory: null
      };
      const action = new actions.LoadChequePayerBanksSuccess(payload);
      const result: PaymentState = paymentsReducer(testState, action);
      expect(result.isLoading).toBeFalsy();
      expect(result.chequePayerBanks).toEqual(payload.payerBanks);
    });

    it('LOAD_CHEQUE_PAYER_BANKS_FAILURE action', () => {
      testState = {
        ...testState,
        isLoading: true,
        error: null
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.LoadChequePayerBanksFailure(payload);
      const result: PaymentState = paymentsReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.error).toBe(payload);
    });
  });

  describe('Actions should Load Payee Banks', () => {
    it('LOAD_PAYEE_BANKS action', () => {
      testState = {
        ...testState,
        isLoading: false
      };

      const action = new actions.LoadPayeeBanks();
      const result: PaymentState = paymentsReducer(testState, action);

      expect(result.isLoading).toBeTruthy();
    });

    it('LOAD_PAYEE_BANKS_SUCCESS action', () => {
      testState = {
        ...testState,
        isLoading: true,
        payeeBanks: null
      };
      const payload = ['ICICI', 'HDFC'];

      const action = new actions.LoadPayeeBanksSuccess(payload);
      const result: PaymentState = paymentsReducer(testState, action);
      expect(result.isLoading).toBeFalsy();
      expect(result.payeeBanks).toEqual(payload);
    });

    it('LOAD_PAYEE_BANKS_FAILURE action', () => {
      testState = {
        ...testState,
        isLoading: true,
        error: null
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.LoadPayeeBanksFailure(payload);
      const result: PaymentState = paymentsReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.error).toBe(payload);
    });
  });

  describe('Actions should Load Payment Details', () => {
    it('LOAD_PAYMENT_DETAILS action', () => {
      testState = {
        ...testState,
        isLoading: false
      };

      const payload: LoadPaymentDetailsPayload = {
        transactionType: TransactionTypeEnum.CM,
        subTransactionType: SubTransactionTypeEnum.NEW_CM,
        transactionId: '456'
      };
      const action = new actions.LoadPaymentDetails(payload);
      const result: PaymentState = paymentsReducer(testState, action);

      expect(result.isLoading).toBeTruthy();
    });

    it('LOAD_PAYMENT_DETAILS_SUCCESS action', () => {
      testState = {
        ...testState,
        isLoading: true,
        paymentDetails: paymentDetailsAdapter.getInitialState()
      };
      const payload = [paymentDetails];

      const action = new actions.LoadPaymentDetailsSuccess(payload);
      const result: PaymentState = paymentsReducer(testState, action);
      expect(result.isLoading).toBeFalsy();
      expect(result.paymentDetails.entities[payload[0].id]).toEqual(payload[0]);
    });

    it('LOAD_PAYMENT_DETAILS_FAILURE action', () => {
      testState = {
        ...testState,
        isLoading: true,
        error: null
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.LoadPaymentDetailsFailure(payload);
      const result: PaymentState = paymentsReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.error).toBe(payload);
    });
  });

  describe('Actions should Load CM Request Payment Details', () => {
    it('LOAD_CM_REQUEST_PAYMENT_DETAILS action', () => {
      testState = {
        ...testState,
        isLoading: false
      };

      const payload: CmRequestDetailsPayload = {
        processId: 'IND124',
        taskId: '123',
        taskName: 'CM',
        workFlowType: 'Manual',
        userType: true
      };
      const action = new actions.LoadCMRequestPaymentDetails(payload);
      const result: PaymentState = paymentsReducer(testState, action);

      expect(result.isLoading).toBeTruthy();
    });

    it('LOAD_CM_REQUEST_PAYMENT_DETAILS_SUCCESS action', () => {
      testState = {
        ...testState,
        isLoading: true,
        paymentDetails: paymentDetailsAdapter.getInitialState()
      };
      const payload = [paymentDetails];

      const action = new actions.LoadCMRequestPaymentDetailsSuccess(payload);
      const result: PaymentState = paymentsReducer(testState, action);
      expect(result.isLoading).toBeFalsy();
      expect(result.paymentDetails.entities[payload[0].id]).toEqual(payload[0]);
    });

    it('LOAD_CM_REQUEST_PAYMENT_DETAILS_FAILURE action', () => {
      testState = {
        ...testState,
        isLoading: true,
        error: null
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.LoadCMRequestPaymentDetailsFailure(payload);
      const result: PaymentState = paymentsReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.error).toBe(payload);
    });
  });

  describe('Actions should Load Credit Note Details', () => {
    it('LOAD_CREDIT_NOTE_DETAILS action', () => {
      testState = {
        ...testState,
        isLoading: false
      };

      const payload: LoadPaymentDetailsPayload = {
        transactionType: TransactionTypeEnum.CM,
        subTransactionType: SubTransactionTypeEnum.NEW_CM,
        transactionId: '456'
      };

      const action = new actions.LoadCreditNoteDetails(payload);
      const result: PaymentState = paymentsReducer(testState, action);

      expect(result.isLoading).toBeTruthy();
    });

    it('LOAD_CREDIT_NOTE_DETAILS_SUCCESS action', () => {
      testState = {
        ...testState,
        isLoading: true,
        cnDetails: null
      };
      const payload: CNListResponsePayload[] = [
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
      ];

      const action = new actions.LoadCreditNoteDetailsSuccess(payload);
      const result: PaymentState = paymentsReducer(testState, action);
      expect(result.isLoading).toBeFalsy();
      expect(result.cnDetails).toEqual(payload);
    });

    it('LOAD_CREDIT_NOTE_DETAILS_FAILURE action', () => {
      testState = {
        ...testState,
        isLoading: true,
        error: null
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.LoadCreditNoteDetailsFailure(payload);
      const result: PaymentState = paymentsReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.error).toBe(payload);
    });
  });

  describe('Actions should Clear Payment Details', () => {
    it('CLEAR_PAYMENT_DETAILS action', () => {
      testState = {
        ...testState,
        paymentDetails: paymentDetailsAdapter.setOne(
          paymentDetails,
          initialState.paymentDetails
        )
      };

      const action = new actions.ClearPaymentDetails();
      const result: PaymentState = paymentsReducer(testState, action);

      expect(result.paymentDetails).toEqual(
        paymentDetailsAdapter.getInitialState()
      );
    });
  });

  describe('Actions should Start Airpay Int Payment', () => {
    it('START_AIRPAY_INT_PAYMENT action', () => {
      testState = {
        ...testState,
        isLoading: false
      };
      const payload: PaymentPayload = {
        transactionType: TransactionTypeEnum.CM,
        subTransactionType: SubTransactionTypeEnum.NEW_CM,
        transactionId: '122',
        paymentDetails: new AirpayPayment(PaymentGroupEnum.REGULAR, {
          instrumentDate: moment(),
          amount: 1000,
          reference1: 'Ref 1',
          reference2: 'Ref 2',
          reference3: 'Ref 3',
          otherDetails: null
        })
      };

      const action = new actions.StartAirpayIntPayment(payload);
      const result: PaymentState = paymentsReducer(testState, action);

      expect(result.isLoading).toBeTruthy();
    });

    it('START_AIRPAY_INT_PAYMENT_SUCCESS action', () => {
      testState = {
        ...testState,
        isLoading: true,
        airpaySendLinkResponse: paymentDetailsAdapter.getInitialState(),
        paymentDetails: paymentDetailsAdapter.getInitialState()
      };
      const payload = paymentDetails;

      const action = new actions.StartAirpayIntPaymentSuccess(payload);
      const result: PaymentState = paymentsReducer(testState, action);
      expect(result.isLoading).toBeFalsy();
      expect(result.airpaySendLinkResponse.entities[payload.id]).toEqual(
        payload
      );
      expect(result.paymentDetails.entities[payload.id]).toEqual(payload);
    });

    it('START_AIRPAY_INT_PAYMENT_FAILURE action', () => {
      testState = {
        ...testState,
        isLoading: true,
        error: null
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.StartAirpayIntPaymentFailure(payload);
      const result: PaymentState = paymentsReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.error).toBe(payload);
    });
  });

  describe('Actions should Update Airpay Int Payment', () => {
    it('UPDATE_INT_PAYMENT', () => {
      testState = {
        ...testState,
        isLoading: false
      };
      const payload: ResendPaymentLinkPayload = {
        transactionType: TransactionTypeEnum.CM,
        subTransactionType: SubTransactionTypeEnum.NEW_CM,
        status: PaymentStatusEnum.OPEN,
        paymentDetails: {
          paymentId: '123',
          details: {
            amount: 1000
          }
        }
      };
      const action = new actions.UpdateIntPayment(
        payload.paymentDetails.paymentId
      );
      const result: PaymentState = paymentsReducer(testState, action);

      expect(result.isLoading).toBeTruthy();
    });

    it('UPDATE_INT_PAYMENT_SUCCESS action', () => {
      testState = {
        ...testState,
        isLoading: true
      };
      const payload = null;

      const action = new actions.UpdateIntPaymentSuccess(payload);
      const result: PaymentState = paymentsReducer(testState, action);
      expect(result.isLoading).toBeFalsy();
    });

    it('UPDATE_INT_PAYMENT_FAILURE action', () => {
      testState = {
        ...testState,
        isLoading: true,
        error: null
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.UpdateIntPaymentFailure(payload);
      const result: PaymentState = paymentsReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.error).toBe(payload);
    });
  });

  describe('Actions should Update Airpay Int Payment status', () => {
    it('UPDATE_AIRPAY_INT_PAYMENT_STATUS action', () => {
      testState = {
        ...testState,
        isLoading: true,
        airpaySendLinkResponse: paymentDetailsAdapter.setOne(
          paymentDetails,
          initialState.airpaySendLinkResponse
        ),

        paymentDetails: paymentDetailsAdapter.setOne(
          paymentDetails,
          initialState.paymentDetails
        )
      };
      const payload = { ...paymentDetails, amount: 100 };

      const action = new actions.UpdateAirpayIntPaymentStatus(payload);
      const result: PaymentState = paymentsReducer(testState, action);
      expect(result.isLoading).toBeFalsy();
      expect(result.airpaySendLinkResponse.entities[payload.id]).toEqual(
        payload
      );
      expect(result.paymentDetails.entities[payload.id]).toEqual(payload);
    });
  });

  describe('Actions should Delete Payment', () => {
    it('DELETE_PAYMENT action', () => {
      testState = {
        ...testState,
        isLoading: false
      };
      const payload: DeletePaymentPayload = {
        transactionType: TransactionTypeEnum.CM,
        subTransactionType: SubTransactionTypeEnum.NEW_CM,
        paymentId: '122'
      };

      const action = new actions.DeletePayment(payload);
      const result: PaymentState = paymentsReducer(testState, action);

      expect(result.isLoading).toBeTruthy();
    });

    it('DELETE_PAYMENT_SUCCESS action', () => {
      testState = {
        ...testState,
        isLoading: true,
        paymentDetails: paymentDetailsAdapter.setOne(
          paymentDetails,
          initialState.paymentDetails
        ),

        loadMaxCashLimit: {
          load: false
        }
      };
      const payload = paymentDetails.id;

      const action = new actions.DeletePaymentSuccess(payload);
      const result: PaymentState = paymentsReducer(testState, action);
      expect(result.isLoading).toBeFalsy();
      expect(result.loadMaxCashLimit.load).toBeTruthy();
      expect(result.paymentDetails.entities[payload]).not.toBeDefined();
    });

    it('DELETE_PAYMENT_FAILURE action', () => {
      testState = {
        ...testState,
        isLoading: true,
        error: null
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.DeletePaymentFailure(payload);
      const result: PaymentState = paymentsReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.error).toBe(payload);
    });
  });

  describe('Actions should Remove GV', () => {
    it('REMOVE_GV action', () => {
      const gvData = {
        serialNo: 1233,
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
      testState = {
        ...testState,
        isLoading: false,
        GVDetails: gvAdapter.setAll([gvData], testState.GVDetails)
      };
      const payload = '' + gvData.serialNo;

      const action = new actions.RemoveGV(payload);
      const result: PaymentState = paymentsReducer(testState, action);

      expect(result.GVDetails.entities[payload]).not.toBeDefined();
    });
  });

  describe('Actions should Load RSO List', () => {
    it('LOAD_RSO_LIST action', () => {
      testState = {
        ...testState,
        isLoading: false,
        rsoList: [
          {
            empName: 'EMP 1',
            employeeCode: 'EMP 1',
            locationCode: 'URB',
            mobileNo: '9920022112',
            isLoginActive: false
          }
        ]
      };

      const action = new actions.LoadRSOList();
      const result: PaymentState = paymentsReducer(testState, action);

      expect(result.isLoading).toBeTruthy();
      expect(result.rsoList).toEqual([]);
    });

    it('LOAD_RSO_LIST_SUCCESS action', () => {
      testState = {
        ...testState,
        isLoading: true,
        rsoList: []
      };
      const payload: StoreUser[] = [
        {
          empName: 'EMP 1',
          employeeCode: 'EMP 1',
          locationCode: 'URB',
          mobileNo: '9920022112',
          isLoginActive: false
        }
      ];
      const action = new actions.LoadRSOListSuccess(payload);
      const result: PaymentState = paymentsReducer(testState, action);
      expect(result.isLoading).toBeFalsy();
      expect(result.rsoList).toEqual(payload);
    });

    it('LOAD_RSO_LIST_FAILURE action', () => {
      testState = {
        ...testState,
        isLoading: true,
        error: null
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.LoadRSOListFailure(payload);
      const result: PaymentState = paymentsReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.error).toBe(payload);
    });
  });

  //
  describe('Actions should Reset Data', () => {
    it('RESET_GHS_eVOUCHER action', () => {
      testState = {
        ...testState,
        isLoading: false,
        GHSeVoucherDetails: {
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
        }
      };

      const action = new actions.ResetGHSeVoucher();
      const result: PaymentState = paymentsReducer(testState, action);
      expect(result.isLoading).toBeFalsy();
      expect(result.GHSeVoucherDetails).toBeNull();
    });

    it('RESET_INVOKED_CREDIT_NOTE action', () => {
      const cnData: CNListResponse = {
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

      testState = {
        ...testState,
        isLoading: false,
        invokedCN: cnData,
        isCnOtpGenerated: false
      };

      const action = new actions.ResetInvokedCreditNote();
      const result: PaymentState = paymentsReducer(testState, action);
      expect(result.isLoading).toBeFalsy();
      expect(result.invokedCN).toBeNull();
      expect(result.isCnOtpGenerated).toBeNull();
    });

    it('RESET_CREDIT_NOTE_LIST action', () => {
      const cnData: CNListResponse = {
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

      testState = {
        ...testState,
        isLoading: false,
        creditNoteList: cnData,
        thirdPartyCnList: cnData,
        isCnOtpGenerated: false
      };

      const action = new actions.ResetCreditNoteList();
      const result: PaymentState = paymentsReducer(testState, action);
      expect(result.isLoading).toBeFalsy();
      expect(result.creditNoteList).toBeNull();
      expect(result.thirdPartyCnList).toBeNull();
      expect(result.isCnOtpGenerated).toBeNull();
    });

    it('RESET_FAILED_GV action', () => {
      testState = {
        ...testState,
        isLoading: false,
        failedGV: [
          {
            transactionType: TransactionTypeEnum.CM,
            subTransactionType: SubTransactionTypeEnum.NEW_CM,
            transactionId: '122',
            paymentDetails: new ChequePayment(PaymentGroupEnum.REGULAR, {
              instrumentNo: '123',
              instrumentDate: moment(),
              amount: 1000,
              bankName: 'BANK'
            })
          }
        ]
      };

      const action = new actions.ResetFailedGV();
      const result: PaymentState = paymentsReducer(testState, action);
      expect(result.isLoading).toBeFalsy();
      expect(result.failedGV).toEqual([]);
    });

    it('RESET_QCGC action', () => {
      testState = {
        ...testState,
        isLoading: false,
        failedGV: [
          {
            transactionType: TransactionTypeEnum.CM,
            subTransactionType: SubTransactionTypeEnum.NEW_CM,
            transactionId: '122',
            paymentDetails: new ChequePayment(PaymentGroupEnum.REGULAR, {
              instrumentNo: '123',
              instrumentDate: moment(),
              amount: 1000,
              bankName: 'BANK'
            })
          }
        ],
        QCGCDetails: {
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
        },
        GVDetails: gvAdapter.setAll(
          [
            {
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
            }
          ],
          testState.GVDetails
        )
      };

      const action = new actions.ResetQCGC();
      const result: PaymentState = paymentsReducer(testState, action);
      expect(result.isLoading).toBeFalsy();
      expect(result.QCGCDetails).toBeNull();
      expect(result.GVDetails).toEqual(gvAdapter.getInitialState());
      expect(result.failedGV).toEqual([]);
    });

    it('RESET_CASH_PAYMENT_AMOUNT action', () => {
      testState = {
        ...testState,
        isLoading: false,
        paymentDetails: paymentDetailsAdapter.setOne(
          paymentDetails,
          initialState.paymentDetails
        )
      };

      const payload = {
        paymentId: paymentDetails.id
      };
      const action = new actions.ResetCashPaymentAmount(payload);
      const result: PaymentState = paymentsReducer(testState, action);
      expect(result.isLoading).toBeFalsy();
    });
  });

  describe('Actions should Load Open Airpay Payment Details', () => {
    it('LOAD_OPEN_AIRPAY_PAYMENT_DETAILS action', () => {
      testState = {
        ...testState,
        isLoading: false,
        airpayOpenPaymentsDetails: paymentDetailsAdapter.setOne(
          paymentDetails,
          initialState.paymentDetails
        )
      };
      const payload: LoadPaymentDetailsPayload = {
        transactionType: TransactionTypeEnum.CM,
        subTransactionType: SubTransactionTypeEnum.NEW_CM,
        transactionId: '456'
      };

      const action = new actions.LoadOpenAirpayPaymentDetails(payload);
      const result: PaymentState = paymentsReducer(testState, action);

      expect(result.isLoading).toBeTruthy();
      expect(result.airpayOpenPaymentsDetails).toEqual(
        paymentDetailsAdapter.getInitialState()
      );
    });

    it('LOAD_OPEN_AIRPAY_PAYMENT_DETAILS_SUCCESS action', () => {
      testState = {
        ...testState,
        isLoading: true,
        airpayOpenPaymentsDetails: paymentDetailsAdapter.getInitialState()
      };
      const payload = [paymentDetails];

      const action = new actions.LoadOpenAirpayPaymentDetailsSuccess(payload);
      const result: PaymentState = paymentsReducer(testState, action);
      expect(result.isLoading).toBeFalsy();
      expect(result.airpayOpenPaymentsDetails.entities[payload[0].id]).toEqual(
        payload[0]
      );
    });

    it('LOAD_OPEN_AIRPAY_PAYMENT_DETAILS_FAILURE action', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      testState = {
        ...testState,
        isLoading: false,
        error: payload
      };

      const action = new actions.LoadOpenAirpayPaymentDetailsFailure(payload);
      const result: PaymentState = paymentsReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.error).toBe(payload);
    });
  });

  describe('Actions should Add GV Payment', () => {
    it('ADD_GV_PAYMENT action', () => {
      testState = {
        ...testState,
        isLoading: false
      };

      const payload: PaymentPayload = {
        transactionType: TransactionTypeEnum.CM,
        subTransactionType: SubTransactionTypeEnum.NEW_CM,
        transactionId: '122',
        paymentDetails: new GiftVoucher(PaymentGroupEnum.REGULAR, {
          instrumentNo: 'TEST',
          amount: 1000,
          instrumentDate: moment().format(),

          instrumentType: 'CARD '
        })
      };

      const action = new actions.AddGVPayment(payload);

      const result: PaymentState = paymentsReducer(testState, action);

      expect(result.isLoading).toBeTruthy();
    });

    it('ADD_GV_PAYMENT_SUCCESS action', () => {
      testState = {
        ...testState,
        isLoading: true,
        paymentDetails: paymentDetailsAdapter.getInitialState(),
        loadMaxCashLimit: {
          load: true
        }
      };

      const payload = paymentDetails;

      const action = new actions.AddGVPaymentSuccess(payload);

      const result: PaymentState = paymentsReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.loadMaxCashLimit.load).toBeTruthy();
      expect(result.paymentDetails.entities[payload.id]).toBe(payload);
    });

    it('ADD_GV_PAYMENT_FAILURE action', () => {
      const gvData = {
        transactionType: TransactionTypeEnum.CM,
        subTransactionType: SubTransactionTypeEnum.NEW_CM,
        transactionId: '122',
        paymentDetails: new ChequePayment(PaymentGroupEnum.REGULAR, {
          instrumentNo: '123',
          instrumentDate: moment(),
          amount: 1000,
          bankName: 'BANK'
        })
      };
      testState = {
        ...testState,
        isLoading: true,
        failedGV: [gvData]
      };

      const payload = {
        transactionType: TransactionTypeEnum.CM,
        subTransactionType: SubTransactionTypeEnum.NEW_CM,
        transactionId: '333',
        paymentDetails: new ChequePayment(PaymentGroupEnum.REGULAR, {
          instrumentNo: '123',
          instrumentDate: moment(),
          amount: 1000,
          bankName: 'BANK'
        })
      };

      const action = new actions.AddGVPaymentFailure(payload);

      const result: PaymentState = paymentsReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.failedGV).toEqual([gvData, payload]);
    });
  });

  describe('Actions should Get GHS eVoucher Balance', () => {
    it('GET_GHS_eVOUCHER_BALANCE action', () => {
      const ghseVoucherDetails: GHSeVoucherDetails = {
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
      testState = {
        ...testState,
        isLoading: false,
        GHSeVoucherDetails: ghseVoucherDetails
      };

      const payload = {
        cardType: GiftCardTxnEnum.CM,
        cardNumber: '123',
        otpRequired: false
      };
      const action = new actions.GetGHSeVoucherBalance(payload);

      const result: PaymentState = paymentsReducer(testState, action);

      expect(result.isLoading).toBeTruthy();
      expect(result.GHSeVoucherDetails).toBeNull();
    });

    it('GET_GHS_eVOUCHER_BALANCE_SUCCESS action', () => {
      testState = {
        ...testState,
        isLoading: true,
        GHSeVoucherDetails: null
      };

      const payload: GHSeVoucherDetails = {
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
      const action = new actions.GetGHSeVoucherBalanceSuccess(payload);

      const result: PaymentState = paymentsReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.GHSeVoucherDetails).toEqual(payload);
    });

    it('GET_GHS_eVOUCHER_BALANCE_FAILURE action', () => {
      const gvData = {
        transactionType: TransactionTypeEnum.CM,
        subTransactionType: SubTransactionTypeEnum.NEW_CM,
        transactionId: '122',
        paymentDetails: new ChequePayment(PaymentGroupEnum.REGULAR, {
          instrumentNo: '123',
          instrumentDate: moment(),
          amount: 1000,
          bankName: 'BANK'
        })
      };
      testState = {
        ...testState,
        isLoading: true,
        failedGV: [gvData]
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.GetGHSeVoucherBalanceFailure(payload);

      const result: PaymentState = paymentsReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.error).toEqual(payload);
    });
  });

  describe('Actions should Get QCGC Balance', () => {
    it('GET_QCGC_BALANCE action', () => {
      testState = {
        ...testState,
        isLoading: false,
        QCGCDetails: {
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
        }
      };

      const payload = {
        cardType: GiftCardTxnEnum.CM,
        cardNumber: '123',
        otpRequired: false
      };
      const action = new actions.GetQCGCBalance(payload);

      const result: PaymentState = paymentsReducer(testState, action);

      expect(result.isLoading).toBeTruthy();
      expect(result.QCGCDetails).toBeNull();
    });

    it('GET_QCGC_BALANCE_SUCCESS action', () => {
      testState = {
        ...testState,
        isLoading: true,
        QCGCDetails: null
      };

      const payload: QCGCCardDetails = {
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

      const action = new actions.GetQCGCBalanceSuccess(payload);

      const result: PaymentState = paymentsReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.QCGCDetails).toEqual(payload);
    });

    it('GET_QCGC_BALANCE_FAILURE action', () => {
      const gvData = {
        transactionType: TransactionTypeEnum.CM,
        subTransactionType: SubTransactionTypeEnum.NEW_CM,
        transactionId: '122',
        paymentDetails: new ChequePayment(PaymentGroupEnum.REGULAR, {
          instrumentNo: '123',
          instrumentDate: moment(),
          amount: 1000,
          bankName: 'BANK'
        })
      };
      testState = {
        ...testState,
        isLoading: true,
        failedGV: [gvData]
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.GetQCGCBalanceFailure(payload);

      const result: PaymentState = paymentsReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.error).toEqual(payload);
    });
  });

  describe('Actions should Unipay Host Configuration', () => {
    it('LOAD_UNIPAY_HOST_CONFIGURATION action', () => {
      testState = {
        ...testState,
        isLoading: false
      };

      const action = new actions.UnipayHostConfiguration();

      const result: PaymentState = paymentsReducer(testState, action);

      expect(result.isLoading).toBeTruthy();
    });

    it('LOAD_UNIPAY_HOST_CONFIGURATION_SUCCESS action', () => {
      testState = {
        ...testState,
        isLoading: true,
        enableUnipay: null
      };

      const payload = ['true'];

      const action = new actions.UnipayHostConfigurationSuccess(payload);

      const result: PaymentState = paymentsReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.enableUnipay).toEqual(payload);
    });

    it('LOAD_UNIPAY_HOST_CONFIGURATION_FAILURE action', () => {
      const gvData = {
        transactionType: TransactionTypeEnum.CM,
        subTransactionType: SubTransactionTypeEnum.NEW_CM,
        transactionId: '122',
        paymentDetails: new ChequePayment(PaymentGroupEnum.REGULAR, {
          instrumentNo: '123',
          instrumentDate: moment(),
          amount: 1000,
          bankName: 'BANK'
        })
      };
      testState = {
        ...testState,
        isLoading: true,
        failedGV: [gvData]
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.UnipayHostConfigurationFailure(payload);

      const result: PaymentState = paymentsReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.error).toEqual(payload);
    });
  });

  describe('Actions should Confirm Payment', () => {
    it('CONFIRM_PAYMENT action', () => {
      testState = {
        ...testState,
        isLoading: false,
        currentConfirmedPayment: paymentDetails
      };

      const payload: EditCashPaymentPayload = {
        transactionType: TransactionTypeEnum.CM,
        subTransactionType: SubTransactionTypeEnum.NEW_CM,
        paymentDetails: {
          paymentId: '123',
          paymentGroup: PaymentGroupEnum.REGULAR,
          details: {
            amount: 1000
          }
        }
      };

      const action = new actions.ConfirmPayment(payload);

      const result: PaymentState = paymentsReducer(testState, action);

      expect(result.isLoading).toBeTruthy();
      expect(result.currentConfirmedPayment).toBeNull();
    });

    it('CONFIRM_PAYMENT_SUCCESS action', () => {
      testState = {
        ...testState,
        isLoading: true,
        currentConfirmedPayment: null,
        paymentDetails: paymentDetailsAdapter.setOne(
          paymentDetails,
          initialState.paymentDetails
        )
      };

      const payload = paymentDetails;

      const action = new actions.ConfirmPaymentSuccess(payload);

      const result: PaymentState = paymentsReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.currentConfirmedPayment).toEqual(payload);
      expect(result.paymentDetails.entities[payload.id]).toEqual(payload);
    });

    it('CONFIRM_PAYMENT_FAILURE action', () => {
      testState = {
        ...testState,
        isLoading: true,
        error: null,
        currentConfirmedPayment: paymentDetails
      };

      const payload = {
        paymentId: '123',
        error: CustomErrorAdaptor.fromJson(Error('Some Error'))
      };

      const action = new actions.ConfirmPaymentFailure(payload);

      const result: PaymentState = paymentsReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.error).toEqual(payload.error);
      expect(result.currentConfirmedPayment).toBeNull();
    });
  });

  describe('Actions should Validate Payment', () => {
    it('VALIDATE_PAYMENT action', () => {
      testState = {
        ...testState,
        isLoading: false
      };

      const action = new actions.ValidatePayment(null);

      const result: PaymentState = paymentsReducer(testState, action);

      expect(result.isLoading).toBeTruthy();
    });

    it('VALIDATE_PAYMENT_SUCCESS action', () => {
      const data = {
        ...paymentDetails,
        paymentCode: PaymentModeEnum.LINKED_CN
      };
      testState = {
        ...testState,
        isLoading: true,
        currentConfirmedPayment: null,
        paymentDetails: paymentDetailsAdapter.setOne(
          data,
          initialState.paymentDetails
        )
      };

      const payload = { ...data };

      const action = new actions.ValidatePaymentSuccess(payload);

      const result: PaymentState = paymentsReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.currentConfirmedPayment).toEqual(payload);
      expect(result.paymentDetails.entities[payload.id]).toEqual(payload);
    });

    it('VALIDATE_PAYMENT_FAILURE action', () => {
      testState = {
        ...testState,
        isLoading: true,
        error: null
      };

      const payload = CustomErrorAdaptor.fromJson(Error('Some Error'));

      const action = new actions.ValidatePaymentFailure(payload);

      const result: PaymentState = paymentsReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.error).toEqual(payload);
    });
  });
  describe('Actions should Edit Cash Payment Success', () => {
    it('EDIT_CASH_PAYMENT action', () => {
      testState = {
        ...testState,
        isLoading: false
      };

      const action = new actions.EditCashPayment(null);

      const result: PaymentState = paymentsReducer(testState, action);

      expect(result.isLoading).toBeTruthy();
    });

    it('EDIT_CASH_PAYMENT_SUCCESS action', () => {
      testState = {
        ...testState,
        isLoading: true,
        loadMaxCashLimit: {
          load: true
        },
        currentConfirmedPayment: null,
        paymentDetails: paymentDetailsAdapter.setOne(
          paymentDetails,
          initialState.paymentDetails
        )
      };

      const payload = { ...paymentDetails, amount: 1000 };

      const action = new actions.EditCashPaymentSuccess(payload);

      const result: PaymentState = paymentsReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.currentConfirmedPayment).toEqual(payload);
      expect(result.paymentDetails.entities[payload.id]).toEqual(payload);
    });

    it('EDIT_CASH_PAYMENT_FAILURE action', () => {
      testState = {
        ...testState,
        isLoading: true,
        error: null,
        paymentDetails: paymentDetailsAdapter.setOne(
          paymentDetails,
          initialState.paymentDetails
        )
      };

      const payload = {
        paymentId: paymentDetails.id,
        error: CustomErrorAdaptor.fromJson(Error('Some Error'))
      };
      const action = new actions.EditCashPaymentFailure(payload);

      const result: PaymentState = paymentsReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.error).toEqual(payload.error);
    });
  });

  describe('Actions should check add credit note payment', () => {
    it('ADD_CREDIT_NOTE_PAYMENT action', () => {
      testState = {
        ...testState,
        isLoading: false
      };
      const payload = {
        transactionType: TransactionTypeEnum.CM,
        subTransactionType: SubTransactionTypeEnum.NEW_CM,
        transactionId: '122',
        paymentDetails: new CreditNotePayment(PaymentGroupEnum.REGULAR, {
          amount: 1000,
          instrumentType: 'BILL_CANCELLATION',
          instrumentNo: '49',
          instrumentDate: moment().format(),
          reference3: 'REF3'
        })
      };

      const action = new actions.AddCreditNotePayment(payload);

      const result: PaymentState = paymentsReducer(testState, action);

      expect(result.isLoading).toBeTruthy();
    });

    it('ADD_CREDIT_NOTE_PAYMENT_SUCCESS action', () => {
      testState = {
        ...testState,
        isLoading: true,
        paymentDetails: paymentDetailsAdapter.getInitialState()
      };

      const payload = paymentDetails;

      const action = new actions.AddCreditNotePaymentSuccess(payload);

      const result: PaymentState = paymentsReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.paymentDetails.entities[payload.id]).toBe(payload);
    });

    it('ADD_CREDIT_NOTE_PAYMENT_FAILURE action', () => {
      testState = {
        ...testState,
        isLoading: true,
        error: CustomErrorAdaptor.fromJson(new Error('Some Old Error'))
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.AddCreditNotePaymentFailure(payload);

      const result: PaymentState = paymentsReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.error).toBe(payload);
    });
  });
  describe('Actions should Start Razorpay Payment', () => {
    it('START_RAZORPAY_PAYMENT action', () => {
      testState = {
        ...testState,
        isLoading: false,
        razorpaySendLinkResponse: paymentDetailsAdapter.setOne(
          paymentDetails,
          initialState.paymentDetails
        )
      };
      const payload: PaymentPayload = {
        transactionType: TransactionTypeEnum.CM,
        subTransactionType: SubTransactionTypeEnum.NEW_CM,
        transactionId: '122',
        paymentDetails: new AirpayPayment(PaymentGroupEnum.REGULAR, {
          instrumentDate: moment(),
          amount: 1000,
          reference1: 'Ref 1',
          reference2: 'Ref 2',
          reference3: 'Ref 3',
          otherDetails: null
        })
      };

      const action = new actions.StartRazorpayPayment(payload);
      const result: PaymentState = paymentsReducer(testState, action);

      expect(result.isLoading).toBeTruthy();
      expect(result.razorpaySendLinkResponse).toEqual(
        paymentDetailsAdapter.getInitialState()
      );
    });

    it('START_RAZORPAY_PAYMENT_SUCCESS action', () => {
      testState = {
        ...testState,
        isLoading: true,
        paymentDetails: paymentDetailsAdapter.getInitialState()
      };
      const payload = paymentDetails;

      const action = new actions.StartRazorpayPaymentSuccess(payload);
      const result: PaymentState = paymentsReducer(testState, action);
      expect(result.isLoading).toBeFalsy();
      expect(result.paymentDetails.entities[payload.id]).toEqual(payload);
    });

    it('START_RAZORPAY_PAYMENT_FAILURE action', () => {
      testState = {
        ...testState,
        isLoading: true,
        error: null
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.StartRazorpayPaymentFailure(payload);
      const result: PaymentState = paymentsReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.error).toBe(payload);
    });
  });

  describe('Actions should Update Razorpay Payment', () => {
    it('UPDATE_RAZORPAY_PAYMENT action', () => {
      testState = {
        ...testState,
        isLoading: false,
        razorpaySendLinkResponse: paymentDetailsAdapter.setOne(
          paymentDetails,
          initialState.paymentDetails
        )
      };
      const payload: ResendPaymentLinkPayload = {
        transactionType: TransactionTypeEnum.CM,
        subTransactionType: SubTransactionTypeEnum.NEW_CM,
        status: PaymentStatusEnum.OPEN,
        paymentDetails: {
          paymentId: '123',
          details: {
            amount: 1000
          }
        }
      };
      const action = new actions.UpdateRazorpayPayment(payload);
      const result: PaymentState = paymentsReducer(testState, action);

      expect(result.isLoading).toBeTruthy();
      expect(result.razorpaySendLinkResponse).toEqual(
        paymentDetailsAdapter.getInitialState()
      );
    });

    it('UPDATE_RAZORPAY_PAYMENT_SUCCESS action', () => {
      testState = {
        ...testState,
        isLoading: true,
        razorpaySendLinkResponse: paymentDetailsAdapter.getInitialState()
      };
      const payload = paymentDetails;

      const action = new actions.UpdateRazorpayPaymentSuccess(payload);
      const result: PaymentState = paymentsReducer(testState, action);
      expect(result.isLoading).toBeFalsy();
      expect(result.razorpaySendLinkResponse.entities[payload.id]).toEqual(
        payload
      );
    });

    it('UPDATE_RAZORPAY_PAYMENT_FAILURE action', () => {
      testState = {
        ...testState,
        isLoading: true,
        error: null
      };

      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.UpdateRazorpayPaymentFailure(payload);
      const result: PaymentState = paymentsReducer(testState, action);

      expect(result.isLoading).toBeFalsy();
      expect(result.error).toBe(payload);
    });
  });

  describe('Actions should Update Razorpay Payment status', () => {
    it('UPDATE_RAZORPAY_PAYMENT_STATUS action', () => {
      testState = {
        ...testState,
        isLoading: true,
        razorpaySendLinkResponse: paymentDetailsAdapter.setOne(
          paymentDetails,
          initialState.razorpaySendLinkResponse
        ),

        paymentDetails: paymentDetailsAdapter.setOne(
          paymentDetails,
          initialState.paymentDetails
        )
      };
      const payload = { ...paymentDetails, amount: 100 };

      const action = new actions.UpdateRazorpayPaymentStatus(payload);
      const result: PaymentState = paymentsReducer(testState, action);
      expect(result.isLoading).toBeFalsy();
      expect(result.razorpaySendLinkResponse.entities[payload.id]).toEqual(
        payload
      );
      expect(result.paymentDetails.entities[payload.id]).toEqual(payload);
    });
  });
});
