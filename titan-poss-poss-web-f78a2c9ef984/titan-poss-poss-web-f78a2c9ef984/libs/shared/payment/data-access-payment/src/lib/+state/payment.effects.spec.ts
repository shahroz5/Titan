import { TestBed } from '@angular/core/testing';
import { DataPersistence } from '@nrwl/angular';
import { Observable } from 'rxjs';
import { PaymentService } from '../payment.service';
import { PaymentEffects } from './payment.effects';
import { PaymentFeatureKey, initialState } from './payment.reducer';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import {
  CardPayment,
  CashPayment,
  ChequePayment,
  CNListRequestPayload,
  CNListResponse,
  CNListResponsePayload,
  CreditNotePayment,
  DeletePaymentPayload,
  EditCashPaymentPayload,
  EncirclePointsPayment,
  GiftVoucher,
  GVStatusListingPayload,
  GVStatusUpdateList,
  LoadMaxCashLimitPayload,
  OtherDetailsForUnipay,
  PaymentConfig,
  PaymentDetails,
  PaymentGroupEnum,
  PaymentModeEnum,
  PaymentPayload,
  PaymentStatusEnum,
  QCGC,
  QCGCGetBalancePayload,
  ROManualPayment,
  ROPayment,
  PaymentRequest,
  IntegratedPaymentRequestPayload,
  StoreUser,
  SubTransactionTypeEnum,
  TransactionTypeEnum,
  UniPayPayment,
  UniPayRequest,
  UpdateUnipayPaylaod,
  GiftCardTxnEnum,
  QCGCCardDetails,
  GHSeVoucherDetails,
  WalletPayment,
  BankLoanPayment,
  RtgsPayment,
  AirpayPayment,
  ResendPaymentLinkPayload,
  ValidatePaymentPayload,
  CmRequestDetailsPayload,
  GHSeVoucher,
  ThirdPartyCNRequestPayload,
  InvokeCNRequestPayload,
  LoadPaymentDetailsPayload,
  AllowedPaymentsResponse,
  GenerateOtpPayload,
  RazorPayPayment,
  CashLimitDetails
} from '@poss-web/shared/models';
import * as moment from 'moment';
import {
  LoadEncireclePoints,
  LoadEncireclePointsFailure,
  LoadEncireclePointsSuccess,
  LoadAllowedPayments,
  LoadAllowedPaymentsSuccess,
  LoadAllowedPaymentsFailure,
  LoadMaxCashLimitFailure,
  LoadMaxCashLimitSuccess,
  LoadMaxCashLimit,
  ConfirmPayment,
  ConfirmPaymentSuccess,
  ConfirmPaymentFailure,
  LoadPaymentDetailsFailure,
  LoadCardPayerBanks,
  LoadCardPayerBanksSuccess,
  LoadCardPayerBanksFailure,
  LoadDDPayerBanks,
  LoadDDPayerBanksSuccess,
  LoadDDPayerBanksFailure,
  LoadChequePayerBanks,
  LoadChequePayerBanksSuccess,
  LoadChequePayerBanksFailure,
  LoadPayeeBanks,
  LoadPayeeBanksSuccess,
  LoadPayeeBanksFailure,
  AddChequeDDPayment,
  AddChequeDDPaymentSuccess,
  AddChequeDDPaymentFailure,
  AddCashPayment,
  AddCashPaymentSuccess,
  AddCashPaymentFailure,
  AddCardPayment,
  AddCardPaymentSuccess,
  AddCardPaymentFailure,
  AddUnipayPaymentFailure,
  AddUnipayPaymentSuccess,
  AddUnipayPayment,
  AddEncirclePointsPaymentFailure,
  AddEncirclePointsPayment,
  AddEncirclePointsPaymentSuccess,
  AddQCGCPayment,
  AddQCGCPaymentSuccess,
  AddQCGCPaymentFailure,
  AddROPayment,
  AddManualPaymentSuccess,
  AddROPaymentFailure,
  AddROPaymentSuccess,
  AddManualPaymentFailure,
  AddManualPayment,
  AddWalletPayment,
  AddWalletPaymentSuccess,
  AddWalletPaymentFailure,
  AddAirpayPayment,
  AddAirpayPaymentSuccess,
  AddAirpayPaymentFailure,
  SendPaymentRequest,
  SendPaymentRequestSuccess,
  SendPaymentRequestFailure,
  StartAirpayIntPayment,
  StartAirpayIntPaymentFailure,
  StartAirpayIntPaymentSuccess,
  UpdateIntPaymentFailure,
  UpdateIntPaymentSuccess,
  UpdateIntPayment,
  ValidateIntPayment,
  ValidateIntPaymentSuccess,
  ValidateIntPaymentFailure,
  LoadOpenAirpayPaymentDetails,
  LoadOpenAirpayPaymentDetailsSuccess,
  LoadOpenAirpayPaymentDetailsFailure,
  LoadROPaymentRequestStatusSuccess,
  LoadROPaymentRequestStatusFailure,
  LoadROPaymentRequestStatus,
  AddRtgsPaymentFailure,
  AddRtgsPaymentSuccess,
  AddRtgsPayment,
  StartUnipayPayment,
  StartUnipayPaymentSuccess,
  StartUnipayPaymentFailure,
  DeletePaymentFailure,
  DeletePaymentSuccess,
  DeletePayment,
  EditCashPayment,
  EditCashPaymentFailure,
  EditCashPaymentSuccess,
  UpdateUnipayPayment,
  UpdateUnipayPaymentFailure,
  UpdateUnipayPaymentSuccess,
  GetQCGCBalanceSuccess,
  GetQCGCBalanceFailure,
  GetQCGCBalance,
  UnipayHostConfiguration,
  UnipayHostConfigurationSuccess,
  LoadRSOList,
  LoadRSOListSuccess,
  LoadRSOListFailure,
  LoadCMRequestPaymentDetailsFailure,
  LoadCMRequestPaymentDetailsSuccess,
  LoadCMRequestPaymentDetails,
  AddBankLoanPaymentFailure,
  AddBankLoanPaymentSuccess,
  AddBankLoanPayment,
  AddGHSeVoucherPayment,
  AddGHSeVoucherPaymentFailure,
  AddGHSeVoucherPaymentSuccess,
  GetGHSeVoucherBalanceSuccess,
  GetGHSeVoucherBalanceFailure,
  GetGHSeVoucherBalance,
  GetCreditNoteList,
  GetCreditNoteListSuccess,
  GetCreditNoteListFailure,
  AddCreditNotePayment,
  AddCreditNotePaymentSuccess,
  AddCreditNotePaymentFailure,
  LoadPaymentDetails,
  LoadPaymentDetailsSuccess,
  LoadCreditNoteDetails,
  LoadCreditNoteDetailsSuccess,
  LoadCreditNoteDetailsFailure,
  GetGVBalance,
  GetGVBalanceSuccess,
  GetGVBalanceFailure,
  AddGVPayment,
  AddGVPaymentFailure,
  AddGVPaymentSuccess,
  ValidatePayment,
  ValidatePaymentSuccess,
  ValidatePaymentFailure,
  GetThirdPartyCNList,
  GetThirdPartyCNListSuccess,
  GetThirdPartyCNListFailure,
  GenerateOtpForCn,
  GenerateOtpForCnSuccess,
  GenerateOtpForCnFailure,
  GetInvokedCreditNote,
  GetInvokedCreditNoteSuccess,
  GetInvokedCreditNoteFailure,
  StartRazorpayPayment,
  StartRazorpayPaymentSuccess,
  StartRazorpayPaymentFailure,
  UpdateRazorpayPayment,
  UpdateRazorpayPaymentSuccess,
  UpdateRazorpayPaymentFailure,
  ValidateRazorpayPayment,
  ValidateRazorpayPaymentSuccess,
  ValidateRazorpayPaymentFailure,
  UnipayHostConfigurationFailure
} from './payment.actions';
import { hot, cold } from 'jasmine-marbles';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { UnipayService } from '../unipay.service';
import { StoreUserDataService } from '@poss-web/shared/masters/data-access-masters';

describe('Payment Common Effect Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: PaymentEffects;

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

  const paymentServiceSpy = jasmine.createSpyObj<PaymentService>([
    'loadCreditNoteList',
    'addPayment',
    'loadPaymentDetails',
    'loadCreditNoteDetails',
    'confirmPayment',
    'loadPayeeBanks',
    'getGVBalance',
    'loadPayerBanks',
    'loadEncirclePoints',
    'loadPayerBanks',
    'addManualPayment',
    'sendROPaymentRquest',
    'deletePayment',
    'getROPaymentRequestStatus',
    'editPayment',
    'getMaxCashLimit',
    'getQCGCBalance',
    'getGHSeVoucherCustomerBalance',
    'resendPaymentLink',
    'validatePayment',
    'loadCMRequestPaymentDetails',
    'getThirdPartyCnList',
    'generateOTPForCN',
    'invokeCN',
    'getAllowedPayments',
    'validateIntegratedPayment'
  ]);
  const unipayServiceSpy = jasmine.createSpyObj<UnipayService>([
    'getUnipayConfiguration',
    'startUnipayPayment',
    'updateUniPayment'
  ]);
  const storeUserDataServiceSpy = jasmine.createSpyObj<StoreUserDataService>([
    'getStoreUsers'
  ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PaymentEffects,
        DataPersistence,
        provideMockStore({
          initialState: {
            [PaymentFeatureKey]: initialState
          }
        }),
        provideMockActions(() => actions$),

        {
          provide: PaymentService,
          useValue: paymentServiceSpy
        },
        {
          provide: UnipayService,
          useValue: unipayServiceSpy
        },
        {
          provide: StoreUserDataService,
          useValue: storeUserDataServiceSpy
        }
      ]
    });

    effect = TestBed.inject(PaymentEffects);
  });

  describe('GetCreditNoteList', () => {
    it('should return a Credit Note List', () => {
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
      const payload: CNListRequestPayload = {
        customerId: 344,
        isPageable: false,
        locationCode: 'URB'
      };

      const action = new GetCreditNoteList(payload);
      const outcome = new GetCreditNoteListSuccess(cnTypeList);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: cnTypeList });
      paymentServiceSpy.loadCreditNoteList.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.getCreditNoteList$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
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
      const payload: CNListRequestPayload = {
        customerId: 344,
        isPageable: false,
        locationCode: 'URB'
      };

      const action = new GetCreditNoteList(payload);
      const error = new Error('some error');
      const outcome = new GetCreditNoteListFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      paymentServiceSpy.loadCreditNoteList.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.getCreditNoteList$).toBeObservable(expected);
    });
  });
  describe('AddCreditNotePayment', () => {
    it('should return a Payment Details', () => {
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

      const action = new AddCreditNotePayment(payload);
      const outcome = new AddCreditNotePaymentSuccess(paymentDetails);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: paymentDetails });
      paymentServiceSpy.addPayment.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.addCreditNotePayment$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
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

      const action = new AddCreditNotePayment(payload);
      const error = new Error('some error');
      const outcome = new AddCreditNotePaymentFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      paymentServiceSpy.addPayment.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.addCreditNotePayment$).toBeObservable(expected);
    });
  });

  describe('LoadPaymentDetails', () => {
    it('should return a Payment Details', () => {
      const data = [paymentDetails];
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

      const action = new LoadPaymentDetails(payload);
      const outcome = new LoadPaymentDetailsSuccess(data);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: data });
      paymentServiceSpy.loadPaymentDetails.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.loadPaymentDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
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

      const action = new LoadPaymentDetails(payload);
      const error = new Error('some error');
      const outcome = new LoadPaymentDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      paymentServiceSpy.loadPaymentDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadPaymentDetails$).toBeObservable(expected);
    });
  });

  describe('LoadCreditNoteDetails', () => {
    it('should return a Credit note Details', () => {
      const data: CNListResponsePayload[] = [
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

      const action = new LoadCreditNoteDetails(payload);
      const outcome = new LoadCreditNoteDetailsSuccess(data);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: data });
      paymentServiceSpy.loadCreditNoteDetails.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.loadCreditNoteDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
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

      const action = new LoadCreditNoteDetails(payload);
      const error = new Error('some error');
      const outcome = new LoadCreditNoteDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      paymentServiceSpy.loadCreditNoteDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadCreditNoteDetails$).toBeObservable(expected);
    });
  });

  describe('ConfirmPayment', () => {
    it('should return a confirm payment', () => {
      const data = paymentDetails;
      const payload = {
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

      const action = new ConfirmPayment(payload);
      const outcome = new ConfirmPaymentSuccess(data);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: data });
      paymentServiceSpy.confirmPayment.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.confirmPayment$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const data = paymentDetails;
      const payload = {
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
      const action = new ConfirmPayment(payload);
      const error = new Error('some error');
      const outcome = new ConfirmPaymentFailure({
        error: CustomErrorAdaptor.fromJson(error),
        paymentId: '123'
      });
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      paymentServiceSpy.confirmPayment.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.confirmPayment$).toBeObservable(expected);
    });
  });

  describe('LoadRSOList', () => {
    it('should return RSO LIST', () => {
      const data: StoreUser[] = [
        {
          empName: 'EMP 1',
          employeeCode: 'EMP 1',
          locationCode: 'URB',
          mobileNo: '9920022112',
          isLoginActive: false
        }
      ];

      const action = new LoadRSOList();
      const outcome = new LoadRSOListSuccess(data);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: data });
      storeUserDataServiceSpy.getStoreUsers.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.loadRSOList$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadRSOList();
      const error = new Error('some error');
      const outcome = new LoadRSOListFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      storeUserDataServiceSpy.getStoreUsers.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadRSOList$).toBeObservable(expected);
    });
  });

  describe('LoadPayeeBanks', () => {
    it('should return Payee Banks', () => {
      const data = ['ICICI', 'HDFC'];

      const action = new LoadPayeeBanks();
      const outcome = new LoadPayeeBanksSuccess(data);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: data });
      paymentServiceSpy.loadPayeeBanks.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.loadPayeeBanks$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadPayeeBanks();
      const error = new Error('some error');
      const outcome = new LoadPayeeBanksFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      paymentServiceSpy.loadPayeeBanks.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadPayeeBanks$).toBeObservable(expected);
    });
  });

  describe('GetAccessList', () => {
    it('should return Access List', () => {
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

      const payload: GVStatusListingPayload = {
        pageIndex: 10,
        pageSize: 12,
        serialNo: '10'
      };

      const action = new GetGVBalance(payload);
      const outcome = new GetGVBalanceSuccess(data);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: data });
      paymentServiceSpy.getGVBalance.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.getGVBalance$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: GVStatusListingPayload = {
        pageIndex: 10,
        pageSize: 12,
        serialNo: '10'
      };
      const action = new GetGVBalance(payload);
      const error = new Error('some error');
      const outcome = new GetGVBalanceFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      paymentServiceSpy.getGVBalance.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.getGVBalance$).toBeObservable(expected);
    });
  });

  describe('LoadCardPayerBanks', () => {
    it('should return Card PayerBanks', () => {
      const data: PaymentConfig = {
        payerBanks: ['ICICI', 'HDFC'],
        cardType: ['CC', 'DC'],
        isBankMandatory: null,
        isCardTypeMandatory: null
      };

      const action = new LoadCardPayerBanks();
      const outcome = new LoadCardPayerBanksSuccess(data);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: data });
      paymentServiceSpy.loadPayerBanks.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.loadCardPayerBanks$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadCardPayerBanks();
      const error = new Error('some error');
      const outcome = new LoadCardPayerBanksFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      paymentServiceSpy.loadPayerBanks.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadCardPayerBanks$).toBeObservable(expected);
    });
  });
  describe('LoadEncireclePoints', () => {
    it('should return Encirecle Points ', () => {
      const data = 100;
      const payload = '123';

      const action = new LoadEncireclePoints(payload);
      const outcome = new LoadEncireclePointsSuccess(data);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: data });
      paymentServiceSpy.loadEncirclePoints.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.loadEncireclePoints$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload = '123';

      const action = new LoadEncireclePoints(payload);
      const error = new Error('some error');
      const outcome = new LoadEncireclePointsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      paymentServiceSpy.loadEncirclePoints.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadEncireclePoints$).toBeObservable(expected);
    });
  });
  describe('UnipayHostConfiguration', () => {
    it('should return Unipay Configuration ', () => {
      const data = ['Data'];

      const action = new UnipayHostConfiguration();
      const outcome = new UnipayHostConfigurationSuccess(data);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: data });
      unipayServiceSpy.getUnipayConfiguration.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.loadUnipayConfiguration$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new UnipayHostConfiguration();
      const error = new Error('some error');
      const outcome = new UnipayHostConfigurationFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      unipayServiceSpy.getUnipayConfiguration.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadUnipayConfiguration$).toBeObservable(expected);
    });
  });

  describe('LoadDDPayerBanks', () => {
    it('should return DD payer Banks  ', () => {
      const data: PaymentConfig = {
        payerBanks: ['ICICI', 'HDFC'],
        cardType: ['CC', 'DC'],
        isBankMandatory: null,
        isCardTypeMandatory: null
      };

      const action = new LoadDDPayerBanks();
      const outcome = new LoadDDPayerBanksSuccess(data);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: data });
      paymentServiceSpy.loadPayerBanks.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.loadDDPayerBanks$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadDDPayerBanks();
      const error = new Error('some error');
      const outcome = new LoadDDPayerBanksFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      paymentServiceSpy.loadPayerBanks.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadDDPayerBanks$).toBeObservable(expected);
    });
  });

  describe('LoadChequePayerBanks', () => {
    it('should return Cheque payer Banks  ', () => {
      const data: PaymentConfig = {
        payerBanks: ['ICICI', 'HDFC'],
        cardType: ['CC', 'DC'],
        isBankMandatory: null,
        isCardTypeMandatory: null
      };

      const action = new LoadChequePayerBanks();
      const outcome = new LoadChequePayerBanksSuccess(data);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: data });
      paymentServiceSpy.loadPayerBanks.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.loadChequePayerBanks$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadChequePayerBanks();
      const error = new Error('some error');
      const outcome = new LoadChequePayerBanksFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      paymentServiceSpy.loadPayerBanks.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadChequePayerBanks$).toBeObservable(expected);
    });
  });

  describe('AddCashPayment', () => {
    it('should add cash payment  ', () => {
      const data = paymentDetails;
      const payload: PaymentPayload = {
        transactionType: TransactionTypeEnum.CM,
        subTransactionType: SubTransactionTypeEnum.NEW_CM,
        transactionId: '122',
        paymentDetails: new CashPayment(PaymentGroupEnum.REGULAR, {
          amount: 1000
        })
      };

      const action = new AddCashPayment(payload);
      const outcome = new AddCashPaymentSuccess(data);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: data });
      paymentServiceSpy.addPayment.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.addCashPayment$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: PaymentPayload = {
        transactionType: TransactionTypeEnum.CM,
        subTransactionType: SubTransactionTypeEnum.NEW_CM,
        transactionId: '122',
        paymentDetails: new CashPayment(PaymentGroupEnum.REGULAR, {
          amount: 1000
        })
      };
      const action = new AddCashPayment(payload);
      const error = new Error('some error');
      const outcome = new AddCashPaymentFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      paymentServiceSpy.addPayment.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.addCashPayment$).toBeObservable(expected);
    });
  });

  describe('AddROPayment', () => {
    it('should add RO payment  ', () => {
      const data = paymentDetails;
      const payload: PaymentPayload = {
        transactionType: TransactionTypeEnum.CM,
        subTransactionType: SubTransactionTypeEnum.NEW_CM,
        transactionId: '122',
        paymentDetails: new ROPayment(PaymentGroupEnum.REGULAR, {
          instrumentDate: moment().format(),
          amount: 1000,
          reference1: 'Ref 1',
          remarks: 'Remarks ',
          bankName: 'Bank 1',
          reference2: 'Ref 2'
        })
      };

      const action = new AddROPayment(payload);
      const outcome = new AddROPaymentSuccess(data);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: data });
      paymentServiceSpy.addPayment.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.addROPayments$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: PaymentPayload = {
        transactionType: TransactionTypeEnum.CM,
        subTransactionType: SubTransactionTypeEnum.NEW_CM,
        transactionId: '122',
        paymentDetails: new ROPayment(PaymentGroupEnum.REGULAR, {
          instrumentDate: moment().format(),
          amount: 1000,
          reference1: 'Ref 1',
          remarks: 'Remarks ',
          bankName: 'Bank 1',
          reference2: 'Ref 2'
        })
      };
      const action = new AddROPayment(payload);
      const error = new Error('some error');
      const outcome = new AddROPaymentFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      paymentServiceSpy.addPayment.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.addROPayments$).toBeObservable(expected);
    });
  });

  describe('AddROManualPayments', () => {
    it('should add RO Manual payment  ', () => {
      const data = paymentDetails;
      const payload: PaymentPayload = {
        transactionType: TransactionTypeEnum.CM,
        subTransactionType: SubTransactionTypeEnum.NEW_CM,
        transactionId: '122',
        paymentDetails: new ROManualPayment(PaymentGroupEnum.REGULAR, {
          amount: 1000,
          approvedBy: 'RSO',
          customerId: '123',
          paymentCode: 'RO',
          requestedReason: 'Reason',
          instrumentDate: moment().format()
        })
      };

      const action = new AddManualPayment(payload);
      const outcome = new AddManualPaymentSuccess(data);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: data });
      paymentServiceSpy.addManualPayment.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.addROManualPayments$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: PaymentPayload = {
        transactionType: TransactionTypeEnum.CM,
        subTransactionType: SubTransactionTypeEnum.NEW_CM,
        transactionId: '122',
        paymentDetails: new ROManualPayment(PaymentGroupEnum.REGULAR, {
          amount: 1000,
          approvedBy: 'RSO',
          customerId: '123',
          paymentCode: 'RO',
          requestedReason: 'Reason',
          instrumentDate: moment().format()
        })
      };
      const action = new AddManualPayment(payload);
      const error = new Error('some error');
      const outcome = new AddManualPaymentFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      paymentServiceSpy.addManualPayment.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.addROManualPayments$).toBeObservable(expected);
    });
  });

  describe('AddChequeDDPayment', () => {
    it('should add cheque or dd payment  ', () => {
      const data = paymentDetails;
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

      const action = new AddChequeDDPayment(payload);
      const outcome = new AddChequeDDPaymentSuccess(data);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: data });
      paymentServiceSpy.addPayment.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.addChequeDDPayment$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
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

      const action = new AddChequeDDPayment(payload);
      const error = new Error('some error');
      const outcome = new AddChequeDDPaymentFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      paymentServiceSpy.addPayment.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.addChequeDDPayment$).toBeObservable(expected);
    });
  });

  describe('SendROPaymentRequest', () => {
    it('should add card payment  ', () => {
      const data: PaymentRequest = {
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
      const payload: IntegratedPaymentRequestPayload = {
        amount: 100,
        customerId: '22',
        paymentCode: 'RO',
        requestedReason: 'TEST'
      };

      const action = new SendPaymentRequest(payload);
      const outcome = new SendPaymentRequestSuccess(data);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: data });
      paymentServiceSpy.sendROPaymentRquest.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.sendPaymentRequest$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: IntegratedPaymentRequestPayload = {
        amount: 100,
        customerId: '22',
        paymentCode: 'RO',
        requestedReason: 'TEST'
      };

      const action = new SendPaymentRequest(payload);
      const error = new Error('some error');
      const outcome = new SendPaymentRequestFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      paymentServiceSpy.sendROPaymentRquest.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.sendPaymentRequest$).toBeObservable(expected);
    });
  });

  describe('AddCardPayment', () => {
    it('should add card payment  ', () => {
      const data = paymentDetails;
      const payload: PaymentPayload = {
        transactionType: TransactionTypeEnum.CM,
        subTransactionType: SubTransactionTypeEnum.NEW_CM,
        transactionId: '122',
        paymentDetails: new CardPayment(PaymentGroupEnum.REGULAR, {
          instrumentDate: moment().format(),
          amount: 1000,
          instrumentType: 'CC',
          bankName: 'BANK',
          reference1: 'REF1'
        })
      };

      const action = new AddCardPayment(payload);
      const outcome = new AddCardPaymentSuccess(data);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: data });
      paymentServiceSpy.addPayment.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.addCardPayment$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: PaymentPayload = {
        transactionType: TransactionTypeEnum.CM,
        subTransactionType: SubTransactionTypeEnum.NEW_CM,
        transactionId: '122',
        paymentDetails: new CardPayment(PaymentGroupEnum.REGULAR, {
          instrumentDate: moment().format(),
          amount: 1000,
          instrumentType: 'CC',
          bankName: 'BANK',
          reference1: 'REF1'
        })
      };

      const action = new AddCardPayment(payload);
      const error = new Error('some error');
      const outcome = new AddCardPaymentFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      paymentServiceSpy.addPayment.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.addCardPayment$).toBeObservable(expected);
    });
  });

  describe('AddEncirclePointsPayment', () => {
    it('should add Encircle payment  ', () => {
      const data = paymentDetails;
      const payload: PaymentPayload = {
        transactionType: TransactionTypeEnum.CM,
        subTransactionType: SubTransactionTypeEnum.NEW_CM,
        transactionId: '122',
        paymentDetails: new EncirclePointsPayment(PaymentGroupEnum.REGULAR, {
          instrumentDate: moment().format(),
          amount: 1000,
          instrumentNo: 'TEST'
        })
      };

      const action = new AddEncirclePointsPayment(payload);
      const outcome = new AddEncirclePointsPaymentSuccess(data);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: data });
      paymentServiceSpy.addPayment.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.addEncirclePointsPayment$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: PaymentPayload = {
        transactionType: TransactionTypeEnum.CM,
        subTransactionType: SubTransactionTypeEnum.NEW_CM,
        transactionId: '122',
        paymentDetails: new EncirclePointsPayment(PaymentGroupEnum.REGULAR, {
          instrumentDate: moment().format(),
          amount: 1000,
          instrumentNo: 'TEST'
        })
      };

      const action = new AddEncirclePointsPayment(payload);
      const error = new Error('some error');
      const outcome = new AddEncirclePointsPaymentFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      paymentServiceSpy.addPayment.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.addEncirclePointsPayment$).toBeObservable(expected);
    });
  });

  describe('AddQCGCPayment', () => {
    it('should add QCGC payment  ', () => {
      const data = paymentDetails;
      const payload: PaymentPayload = {
        transactionType: TransactionTypeEnum.CM,
        subTransactionType: SubTransactionTypeEnum.NEW_CM,
        transactionId: '122',
        paymentDetails: new QCGC(PaymentGroupEnum.REGULAR, {
          instrumentDate: moment().format(),
          amount: 1000,
          instrumentNo: 'TEST',
          reference1: 'Ref 1',
          instrumentType: 'CARD ',
          remarks: 'Remarks ',
          reference2: 'REF 2',
          bankName: 'BANK 1',
          otherDetails: null
        })
      };

      const action = new AddQCGCPayment(payload);
      const outcome = new AddQCGCPaymentSuccess(data);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: data });
      paymentServiceSpy.addPayment.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.addQCGCPayment$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: PaymentPayload = {
        transactionType: TransactionTypeEnum.CM,
        subTransactionType: SubTransactionTypeEnum.NEW_CM,
        transactionId: '122',
        paymentDetails: new EncirclePointsPayment(PaymentGroupEnum.REGULAR, {
          instrumentDate: moment().format(),
          amount: 1000,
          instrumentNo: 'TEST'
        })
      };

      const action = new AddQCGCPayment(payload);
      const error = new Error('some error');
      const outcome = new AddQCGCPaymentFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      paymentServiceSpy.addPayment.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.addQCGCPayment$).toBeObservable(expected);
    });
  });

  describe('AddGVPayment', () => {
    it('should add GV payment  ', () => {
      const data = paymentDetails;
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

      const action = new AddGVPayment(payload);
      const outcome = new AddGVPaymentSuccess(data);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: data });
      paymentServiceSpy.addPayment.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.addGVPayment$).toBeObservable(expected$);
    });

    xit('should fail and return an action with the error', () => {
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
      const error = payload;

      const action = new AddGVPayment(payload);
      const outcome = new AddGVPaymentFailure(error);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      paymentServiceSpy.addPayment.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.addGVPayment$).toBeObservable(expected);
    });
  });

  describe('AddUnipayPayment', () => {
    it('should add unipay payment  ', () => {
      const data = {
        amount: 100,
        id: 'WQ1223'
      };
      const payload: PaymentPayload = {
        transactionType: TransactionTypeEnum.CM,
        subTransactionType: SubTransactionTypeEnum.NEW_CM,
        transactionId: '122',
        paymentDetails: new UniPayPayment(PaymentGroupEnum.REGULAR, {
          amount: 1000
        })
      };
      const action = new AddUnipayPayment(payload);
      const outcome = new AddUnipayPaymentSuccess(data);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: data });
      paymentServiceSpy.addPayment.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.addUnipayPayment$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: PaymentPayload = {
        transactionType: TransactionTypeEnum.CM,
        subTransactionType: SubTransactionTypeEnum.NEW_CM,
        transactionId: '122',
        paymentDetails: new UniPayPayment(PaymentGroupEnum.REGULAR, {
          amount: 1000
        })
      };

      const action = new AddUnipayPayment(payload);
      const error = new Error('some error');
      const outcome = new AddUnipayPaymentFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      paymentServiceSpy.addPayment.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.addUnipayPayment$).toBeObservable(expected);
    });
  });

  describe('StartUnipayPayment', () => {
    it('should start unipayment   ', () => {
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
      const action = new StartUnipayPayment(payload);
      const outcome = new StartUnipayPaymentSuccess(data);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: data });
      unipayServiceSpy.startUnipayPayment.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.startUnipayPayment$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
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

      const action = new StartUnipayPayment(payload);
      const error = new Error('some error');
      const outcome = new StartUnipayPaymentFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      unipayServiceSpy.startUnipayPayment.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.startUnipayPayment$).toBeObservable(expected);
    });
  });

  describe('UpdateUnipayPayment', () => {
    it('should update uni payment   ', () => {
      const payload: UpdateUnipayPaylaod = {
        transactionType: TransactionTypeEnum.CM,
        subTransactionType: SubTransactionTypeEnum.NEW_CM,

        status: PaymentStatusEnum.OPEN,
        transactionId: '123',
        updateUnipayPlayload: {
          instrumentDate: moment(),
          instrumentNo: 123,
          instrumentType: 'Test Data',
          lineItemNo: 123,
          otherDetails: null,
          payeeBankName: 'Test Data',
          payerBankBranch: 'Test Data',
          payerBankName: 'Test Data',
          reference1: 'Test Data',
          reference2: 'Test Data',
          reference3: 'Test Data',
          remarks: 'Test Data',
          status: 'Test Data'
        }
      };

      const data = paymentDetails;
      const action = new UpdateUnipayPayment(payload);
      const outcome = new UpdateUnipayPaymentSuccess(data);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: data });
      unipayServiceSpy.updateUniPayment.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.updateUnipayPayment$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: UpdateUnipayPaylaod = {
        transactionType: TransactionTypeEnum.CM,
        subTransactionType: SubTransactionTypeEnum.NEW_CM,

        status: PaymentStatusEnum.OPEN,
        transactionId: '123',
        updateUnipayPlayload: {
          instrumentDate: moment(),
          instrumentNo: 123,
          instrumentType: 'Test Data',
          lineItemNo: 123,
          otherDetails: null,
          payeeBankName: 'Test Data',
          payerBankBranch: 'Test Data',
          payerBankName: 'Test Data',
          reference1: 'Test Data',
          reference2: 'Test Data',
          reference3: 'Test Data',
          remarks: 'Test Data',
          status: 'Test Data'
        }
      };

      const action = new UpdateUnipayPayment(payload);
      const error = new Error('some error');
      const outcome = new UpdateUnipayPaymentFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      unipayServiceSpy.updateUniPayment.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.updateUnipayPayment$).toBeObservable(expected);
    });
  });

  // describe('DeletePayment', () => {
  //   it('should delete payment', () => {
  //     const data = '123';
  //     const payload: DeletePaymentPayload = {
  //       transactionType: TransactionTypeEnum.CM,
  //       subTransactionType: SubTransactionTypeEnum.NEW_CM,
  //       paymentId: '123'
  //     };

  //     const action = new DeletePayment(payload);
  //     const outcome = new DeletePaymentSuccess(data);
  //     actions$ = cold('-a', { a: action });

  //     const response$ = cold('-b', { b: data });
  //     paymentServiceSpy.deletePayment.and.returnValue(response$);

  //     const expected$ = cold('--c', { c: outcome });

  //     expect(effect.deletePayment$).toBeObservable(expected$);
  //   });

  //   it('should fail and return an action with the error', () => {
  //     const payload: DeletePaymentPayload = {
  //       transactionType: TransactionTypeEnum.CM,
  //       subTransactionType: SubTransactionTypeEnum.NEW_CM,
  //       paymentId: '122'
  //     };

  //     const error = new Error('some error');

  //     const action = new DeletePayment(payload);
  //     const outcome = new DeletePaymentFailure(
  //       CustomErrorAdaptor.fromJson(error)
  //     );
  //     actions$ = hot('-a', { a: action });
  //     const response$ = cold('-#', {}, error);
  //     paymentServiceSpy.deletePayment.and.returnValue(response$);
  //     const expected = cold('--b', { b: outcome });
  //     expect(effect.deletePayment$).toBeObservable(expected);
  //   });
  // });

  describe('LoadROPaymentRequestStatus', () => {
    it('should return RO payment status', () => {
      const data: PaymentRequest = {
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
      const payload = '123';

      const action = new LoadROPaymentRequestStatus(payload);
      const outcome = new LoadROPaymentRequestStatusSuccess(data);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: data });
      paymentServiceSpy.getROPaymentRequestStatus.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.loadROPaymentRequestStatus$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload = '123';

      const error = new Error('some error');

      const action = new LoadROPaymentRequestStatus(payload);
      const outcome = new LoadROPaymentRequestStatusFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      paymentServiceSpy.getROPaymentRequestStatus.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadROPaymentRequestStatus$).toBeObservable(expected);
    });
  });

  describe('EditCashPayment', () => {
    it('should edit cash payment', () => {
      const data = paymentDetails;
      const payload: EditCashPaymentPayload = {
        transactionType: TransactionTypeEnum.CM,
        subTransactionType: SubTransactionTypeEnum.NEW_CM,
        paymentDetails: {
          paymentId: '123',
          paymentGroup: PaymentGroupEnum.REGULAR,
          details: {
            amount: 12
          }
        }
      };
      const action = new EditCashPayment(payload);
      const outcome = new EditCashPaymentSuccess(data);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: data });
      paymentServiceSpy.editPayment.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.editCashPayment$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: EditCashPaymentPayload = {
        transactionType: TransactionTypeEnum.CM,
        subTransactionType: SubTransactionTypeEnum.NEW_CM,
        paymentDetails: {
          paymentId: '123',
          paymentGroup: PaymentGroupEnum.REGULAR,
          details: {
            amount: 12
          }
        }
      };
      const errorData = Error('Some Error');
      const error = {
        paymentId: '123',
        error: CustomErrorAdaptor.fromJson(errorData)
      };

      const action = new EditCashPayment(payload);
      const outcome = new EditCashPaymentFailure(error);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, errorData);
      paymentServiceSpy.editPayment.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.editCashPayment$).toBeObservable(expected);
    });
  });

  describe('LoadMaxCashLimit', () => {
    it('should load cash max limit', () => {
      const data: CashLimitDetails = {
        amountDue: 1000,
        eligibleAmount: 2000,
        pmlaEligibleAmount: 0,
        totalAmount: 3
      };

      const payload: LoadMaxCashLimitPayload = {
        transactionType: TransactionTypeEnum.CM,
        subTransactionType: SubTransactionTypeEnum.NEW_CM,
        customerId: '123',
        transactionId: '456',
        paymentCode: PaymentModeEnum.CASH,
        paymentGroup: PaymentGroupEnum.REGULAR
      };
      const action = new LoadMaxCashLimit(payload);
      const outcome = new LoadMaxCashLimitSuccess(data);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: data });
      paymentServiceSpy.getMaxCashLimit.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.loadMaxCashLimit$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: LoadMaxCashLimitPayload = {
        transactionType: TransactionTypeEnum.CM,
        subTransactionType: SubTransactionTypeEnum.NEW_CM,
        customerId: '123',
        transactionId: '456',
        paymentCode: PaymentModeEnum.CASH,
        paymentGroup: PaymentGroupEnum.REGULAR
      };

      const action = new LoadMaxCashLimit(payload);
      const error = new Error('some error');
      const outcome = new LoadMaxCashLimitFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      paymentServiceSpy.getMaxCashLimit.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadMaxCashLimit$).toBeObservable(expected);
    });
  });

  describe('GetQCGCBalance', () => {
    it('should return QCGC balance', () => {
      const data: QCGCCardDetails = {
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
      const payload: QCGCGetBalancePayload = {
        cardType: GiftCardTxnEnum.CM,
        cardNumber: '1234'
      };

      const action = new GetQCGCBalance(payload);
      const outcome = new GetQCGCBalanceSuccess(data);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: data });
      paymentServiceSpy.getQCGCBalance.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.getQCGCBalance$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: QCGCGetBalancePayload = {
        cardType: GiftCardTxnEnum.CM,
        cardNumber: '1234'
      };
      const action = new GetQCGCBalance(payload);
      const error = new Error('some error');
      const outcome = new GetQCGCBalanceFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      paymentServiceSpy.getQCGCBalance.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.getQCGCBalance$).toBeObservable(expected);
    });
  });

  describe('GetGHSeVoucherCustomerBalance', () => {
    it('should return GHS eVoucher Customer`s Balance', () => {
      const data: GHSeVoucherDetails = {
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
      const payload = {
        cardType: GiftCardTxnEnum.CM,
        cardNumber: '123',
        otpRequired: false
      };

      const action = new GetGHSeVoucherBalance(payload);
      const outcome = new GetGHSeVoucherBalanceSuccess(data);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: data });
      paymentServiceSpy.getGHSeVoucherCustomerBalance.and.returnValue(
        response$
      );

      const expected$ = cold('--c', { c: outcome });

      expect(effect.getGHSeVoucherCustomerBalance$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload = {
        cardType: GiftCardTxnEnum.CM,
        cardNumber: '123',
        otpRequired: false
      };
      const action = new GetGHSeVoucherBalance(payload);
      const error = new Error('some error');
      const outcome = new GetGHSeVoucherBalanceFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      paymentServiceSpy.getGHSeVoucherCustomerBalance.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.getGHSeVoucherCustomerBalance$).toBeObservable(expected);
    });
  });

  describe('AddWalletPayment', () => {
    it('should add wallet payment', () => {
      const data = paymentDetails;
      const payload: PaymentPayload = {
        transactionType: TransactionTypeEnum.CM,
        subTransactionType: SubTransactionTypeEnum.NEW_CM,
        transactionId: '122',
        paymentDetails: new WalletPayment(PaymentGroupEnum.REGULAR, {
          instrumentDate: moment(),
          amount: 1000,
          reference1: 'Ref 1',
          instrumentType: 'Type',
          instrumentNo: '123',
          reference2: 'REF 2',
          reference3: 'REF 3'
        })
      };
      const action = new AddWalletPayment(payload);
      const outcome = new AddWalletPaymentSuccess(data);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: data });
      paymentServiceSpy.addPayment.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.addWalletPayment$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: PaymentPayload = {
        transactionType: TransactionTypeEnum.CM,
        subTransactionType: SubTransactionTypeEnum.NEW_CM,
        transactionId: '122',
        paymentDetails: new WalletPayment(PaymentGroupEnum.REGULAR, {
          instrumentDate: moment(),
          amount: 1000,
          reference1: 'Ref 1',
          instrumentType: 'Type',
          instrumentNo: '123',
          reference2: 'REF 2',
          reference3: 'REF 3'
        })
      };
      const action = new AddWalletPayment(payload);
      const error = new Error('some error');
      const outcome = new AddWalletPaymentFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      paymentServiceSpy.addPayment.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.addWalletPayment$).toBeObservable(expected);
    });
  });

  describe('AddBankLoanPayment', () => {
    it('should add Bank loan payment', () => {
      const data = paymentDetails;
      const payload = {
        transactionType: TransactionTypeEnum.CM,
        subTransactionType: SubTransactionTypeEnum.NEW_CM,
        transactionId: '122',
        paymentDetails: new BankLoanPayment(PaymentGroupEnum.REGULAR, {
          instrumentDate: moment(),
          amount: 1000,
          reference1: 'Ref 1',
          reference2: 'Ref 2',
          reference3: 'Ref 3'
        })
      };
      const action = new AddBankLoanPayment(payload);
      const outcome = new AddBankLoanPaymentSuccess(data);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: data });
      paymentServiceSpy.addPayment.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.addBankLoanPayment$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload = {
        transactionType: TransactionTypeEnum.CM,
        subTransactionType: SubTransactionTypeEnum.NEW_CM,
        transactionId: '122',
        paymentDetails: new BankLoanPayment(PaymentGroupEnum.REGULAR, {
          instrumentDate: moment(),
          amount: 1000,
          reference1: 'Ref 1',
          reference2: 'Ref 2',
          reference3: 'Ref 3'
        })
      };
      const action = new AddBankLoanPayment(payload);
      const error = new Error('some error');
      const outcome = new AddBankLoanPaymentFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      paymentServiceSpy.addPayment.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.addBankLoanPayment$).toBeObservable(expected);
    });
  });

  describe('AddRtgsPayment', () => {
    it('should add RTGS payment', () => {
      const data = paymentDetails;
      const payload: PaymentPayload = {
        transactionType: TransactionTypeEnum.CM,
        subTransactionType: SubTransactionTypeEnum.NEW_CM,
        transactionId: '122',
        paymentDetails: new RtgsPayment(PaymentGroupEnum.REGULAR, {
          instrumentDate: moment(),
          amount: 1000,
          reference1: 'Ref 1',
          reference2: 'REF 2',
          reference3: 'REF 3'
        })
      };
      const action = new AddRtgsPayment(payload);
      const outcome = new AddRtgsPaymentSuccess(data);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: data });
      paymentServiceSpy.addPayment.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.addRtgsPayment$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: PaymentPayload = {
        transactionType: TransactionTypeEnum.CM,
        subTransactionType: SubTransactionTypeEnum.NEW_CM,
        transactionId: '122',
        paymentDetails: new RtgsPayment(PaymentGroupEnum.REGULAR, {
          instrumentDate: moment(),
          amount: 1000,
          reference1: 'Ref 1',
          reference2: 'REF 2',
          reference3: 'REF 3'
        })
      };
      const action = new AddRtgsPayment(payload);
      const error = new Error('some error');
      const outcome = new AddRtgsPaymentFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      paymentServiceSpy.addPayment.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.addRtgsPayment$).toBeObservable(expected);
    });
  });

  describe('AddAirpayPayment', () => {
    it('should add airpay payment', () => {
      const data = paymentDetails;
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
      const action = new AddAirpayPayment(payload);
      const outcome = new AddAirpayPaymentSuccess(data);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: data });
      paymentServiceSpy.addPayment.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.addAirpayPayment$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
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
      const action = new AddAirpayPayment(payload);
      const error = new Error('some error');
      const outcome = new AddAirpayPaymentFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      paymentServiceSpy.addPayment.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.addAirpayPayment$).toBeObservable(expected);
    });
  });

  describe('StartAirpayIntPayment', () => {
    it('should start airpay payment', () => {
      const data = paymentDetails;
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
      const action = new StartAirpayIntPayment(payload);
      const outcome = new StartAirpayIntPaymentSuccess(data);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: data });
      paymentServiceSpy.addPayment.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.startAirpayIntPayment$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
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
      const action = new StartAirpayIntPayment(payload);
      const error = new Error('some error');
      const outcome = new StartAirpayIntPaymentFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      paymentServiceSpy.addPayment.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.startAirpayIntPayment$).toBeObservable(expected);
    });
  });

  describe('UpdateAirpayIntPayment', () => {
    it('should update airpay payment', () => {
      const data: PaymentRequest = null;
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
      const action = new UpdateIntPayment(payload.paymentDetails.paymentId);
      const outcome = new UpdateIntPaymentSuccess(data);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: data });
      paymentServiceSpy.resendPaymentLink.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.resendPaymentLink$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
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
      const action = new UpdateIntPayment('data');
      const error = new Error('some error');
      const outcome = new UpdateIntPaymentFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      paymentServiceSpy.resendPaymentLink.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.resendPaymentLink$).toBeObservable(expected);
    });
  });

  describe('ValidateAirpayIntPayment', () => {
    it('should validate airpay payment', () => {
      const data = null;
      const payload: ValidatePaymentPayload = {
        transactionType: TransactionTypeEnum.CM,
        subTransactionType: SubTransactionTypeEnum.NEW_CM,
        paymentId: '123'
      };
      const action = new ValidateIntPayment(payload.paymentId);
      const outcome = new ValidateIntPaymentSuccess(data);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: data });
      paymentServiceSpy.validateIntegratedPayment.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.ValidateIntegratedPayment$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: ValidatePaymentPayload = {
        transactionType: TransactionTypeEnum.CM,
        subTransactionType: SubTransactionTypeEnum.NEW_CM,
        paymentId: '123'
      };
      const action = new ValidateIntPayment(payload.paymentId);
      const error = new Error('some error');
      const outcome = new ValidateIntPaymentFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      paymentServiceSpy.validateIntegratedPayment.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.ValidateIntegratedPayment$).toBeObservable(expected);
    });
  });

  describe('ValidadteEncicrcle', () => {
    it('should validate encircle payment', () => {
      const data = paymentDetails;
      const payload: ValidatePaymentPayload = {
        transactionType: TransactionTypeEnum.CM,
        subTransactionType: SubTransactionTypeEnum.NEW_CM,
        paymentId: '123'
      };
      const action = new ValidatePayment(payload);
      const outcome = new ValidatePaymentSuccess(data);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: data });
      paymentServiceSpy.validatePayment.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.ValidadteEncicrcle$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: ValidatePaymentPayload = {
        transactionType: TransactionTypeEnum.CM,
        subTransactionType: SubTransactionTypeEnum.NEW_CM,
        paymentId: '123'
      };
      const action = new ValidatePayment(payload);
      const error = new Error('some error');
      const outcome = new ValidatePaymentFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      paymentServiceSpy.validatePayment.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.ValidadteEncicrcle$).toBeObservable(expected);
    });
  });

  describe('LoadCMRequestPaymentDetails', () => {
    it('should return CM Request Payment Details', () => {
      const data = [paymentDetails];
      const payload: CmRequestDetailsPayload = {
        processId: 'IND124',
        taskId: '123',
        taskName: 'CM',
        workFlowType: 'Manual',
        userType: true
      };
      const action = new LoadCMRequestPaymentDetails(payload);
      const outcome = new LoadCMRequestPaymentDetailsSuccess(data);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: data });
      paymentServiceSpy.loadCMRequestPaymentDetails.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.loadCMRequestPaymentDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: CmRequestDetailsPayload = {
        processId: 'IND124',
        taskId: '123',
        taskName: 'CM',
        workFlowType: 'Manual',
        userType: true
      };
      const action = new LoadCMRequestPaymentDetails(payload);
      const error = new Error('some error');
      const outcome = new LoadCMRequestPaymentDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      paymentServiceSpy.loadCMRequestPaymentDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadCMRequestPaymentDetails$).toBeObservable(expected);
    });
  });

  describe('AddGHSeVoucherPayment', () => {
    it('should add GHS eVoucher Payment', () => {
      const data = paymentDetails;
      const payload = {
        transactionType: TransactionTypeEnum.CM,
        subTransactionType: SubTransactionTypeEnum.NEW_CM,
        transactionId: '122',
        paymentDetails: new GHSeVoucher(PaymentGroupEnum.REGULAR, {
          instrumentDate: moment().format(),
          amount: 1000,
          reference1: 'Ref 1',
          instrumentType: 'Type',
          instrumentNo: 'Type',
          remarks: 'Remarkj',
          bankName: 'BANK'
        })
      };
      const action = new AddGHSeVoucherPayment(payload);
      const outcome = new AddGHSeVoucherPaymentSuccess(data);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: data });
      paymentServiceSpy.addPayment.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.addGHSeVoucherPayment$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload = {
        transactionType: TransactionTypeEnum.CM,
        subTransactionType: SubTransactionTypeEnum.NEW_CM,
        transactionId: '122',
        paymentDetails: new GHSeVoucher(PaymentGroupEnum.REGULAR, {
          instrumentDate: moment().format(),
          amount: 1000,
          reference1: 'Ref 1',
          instrumentType: 'Type',
          instrumentNo: 'Type',
          remarks: 'Remarkj',
          bankName: 'BANK'
        })
      };
      const action = new AddGHSeVoucherPayment(payload);
      const error = new Error('some error');
      const outcome = new AddGHSeVoucherPaymentFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      paymentServiceSpy.addPayment.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.addGHSeVoucherPayment$).toBeObservable(expected);
    });
  });

  describe('AddGHSeVoucherPayment', () => {
    it('should add GHS eVoucher Payment', () => {
      const data = paymentDetails;
      const payload = {
        transactionType: TransactionTypeEnum.CM,
        subTransactionType: SubTransactionTypeEnum.NEW_CM,
        transactionId: '122',
        paymentDetails: new GHSeVoucher(PaymentGroupEnum.REGULAR, {
          instrumentDate: moment().format(),
          amount: 1000,
          reference1: 'Ref 1',
          instrumentType: 'Type',
          instrumentNo: 'Type',
          remarks: 'Remarkj',
          bankName: 'BANK'
        })
      };
      const action = new AddGHSeVoucherPayment(payload);
      const outcome = new AddGHSeVoucherPaymentSuccess(data);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: data });
      paymentServiceSpy.addPayment.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.addGHSeVoucherPayment$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload = {
        transactionType: TransactionTypeEnum.CM,
        subTransactionType: SubTransactionTypeEnum.NEW_CM,
        transactionId: '122',
        paymentDetails: new GHSeVoucher(PaymentGroupEnum.REGULAR, {
          instrumentDate: moment().format(),
          amount: 1000,
          reference1: 'Ref 1',
          instrumentType: 'Type',
          instrumentNo: 'Type',
          remarks: 'Remarkj',
          bankName: 'BANK'
        })
      };
      const action = new AddGHSeVoucherPayment(payload);
      const error = new Error('some error');
      const outcome = new AddGHSeVoucherPaymentFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      paymentServiceSpy.addPayment.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.addGHSeVoucherPayment$).toBeObservable(expected);
    });
  });

  describe('GetThirdPartyCnList', () => {
    it('should return Third Party Cn List', () => {
      const data: CNListResponse = {
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
      const payload: ThirdPartyCNRequestPayload = {
        customerIds: ['123'],
        isPageable: false,
        locationCode: 'URB'
      };
      const action = new GetThirdPartyCNList(payload);
      const outcome = new GetThirdPartyCNListSuccess(data);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: data });
      paymentServiceSpy.getThirdPartyCnList.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.getThirdPartyCnList$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: ThirdPartyCNRequestPayload = {
        customerIds: ['123'],
        isPageable: false,
        locationCode: 'URB'
      };
      const action = new GetThirdPartyCNList(payload);
      const error = new Error('some error');
      const outcome = new GetThirdPartyCNListFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      paymentServiceSpy.getThirdPartyCnList.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.getThirdPartyCnList$).toBeObservable(expected);
    });
  });

  describe('GenerateOtpForCn', () => {
    it('should return Generated Otp For Cn', () => {
      const data = '1234';
      const payload: GenerateOtpPayload = {
        id: 'TEST ID',
        otpType: 'NEW'
      };

      const action = new GenerateOtpForCn(payload);
      const outcome = new GenerateOtpForCnSuccess();
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: data });
      paymentServiceSpy.generateOTPForCN.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.generateOtpForCn$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: GenerateOtpPayload = {
        id: 'TEST ID',
        otpType: 'NEW'
      };
      const action = new GenerateOtpForCn(payload);
      const error = new Error('some error');
      const outcome = new GenerateOtpForCnFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      paymentServiceSpy.generateOTPForCN.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.generateOtpForCn$).toBeObservable(expected);
    });
  });

  describe('GetInvokedCreditNote', () => {
    it('should return Get Invoked Credit Note', () => {
      const data: CNListResponse = {
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
      const payload: InvokeCNRequestPayload = {
        cnNumber: 123,
        fiscalYear: 2021,
        locationCode: 'URB'
      };
      const action = new GetInvokedCreditNote(payload);
      const outcome = new GetInvokedCreditNoteSuccess(data);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: data });
      paymentServiceSpy.invokeCN.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.getInvokedCreditNote$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: InvokeCNRequestPayload = {
        cnNumber: 123,
        fiscalYear: 2021,
        locationCode: 'URB'
      };
      const action = new GetInvokedCreditNote(payload);
      const error = new Error('some error');
      const outcome = new GetInvokedCreditNoteFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      paymentServiceSpy.invokeCN.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.getInvokedCreditNote$).toBeObservable(expected);
    });
  });

  describe('LoadOpenAirpayPaymentDetails', () => {
    it('should return Open Airpay Payment Details', () => {
      const openAirPayPayment = {
        ...paymentDetails,
        paymentCode: PaymentModeEnum.AIRPAY,
        status: 'OPEN'
      };
      const data = [paymentDetails, openAirPayPayment];

      const payload: LoadPaymentDetailsPayload = {
        transactionType: TransactionTypeEnum.CM,
        subTransactionType: SubTransactionTypeEnum.NEW_CM,
        transactionId: '456'
      };
      const action = new LoadOpenAirpayPaymentDetails(payload);
      const outcome = new LoadOpenAirpayPaymentDetailsSuccess([
        openAirPayPayment
      ]);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: data });
      paymentServiceSpy.loadPaymentDetails.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.loadOpenAirpayPaymentDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: LoadPaymentDetailsPayload = {
        transactionType: TransactionTypeEnum.CM,
        subTransactionType: SubTransactionTypeEnum.NEW_CM,
        transactionId: '456'
      };
      const action = new LoadOpenAirpayPaymentDetails(payload);
      const error = new Error('some error');
      const outcome = new LoadOpenAirpayPaymentDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      paymentServiceSpy.loadPaymentDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadOpenAirpayPaymentDetails$).toBeObservable(expected);
    });
  });

  describe('loadAllowedPayments', () => {
    it('should return allowed Payment ', () => {
      const data: AllowedPaymentsResponse = {
        allowedPayments: new Map<PaymentModeEnum, PaymentGroupEnum>()
          .set(PaymentModeEnum.CASH, PaymentGroupEnum.REGULAR)
          .set(PaymentModeEnum.CARD, PaymentGroupEnum.REGULAR)
          .set(PaymentModeEnum.DD, PaymentGroupEnum.REGULAR)

          .set(PaymentModeEnum.CHEQUE, PaymentGroupEnum.REGULAR)
          .set(PaymentModeEnum.BANK_LOAN, PaymentGroupEnum.REGULAR)
          .set(PaymentModeEnum.RO_PAYMENT, PaymentGroupEnum.REGULAR),
        wallets: ['GPAY', 'PHONEPE'],
        subBankLoans: ['BANK LOAN 1'],
        customerSpecificPayments: [PaymentModeEnum.CASH],
        customerSpecificWalletPayments: ['PHONEPE'],
        customerSpecificBankLoanPayments: ['BANK LOAN 1']
      };

      const payload = TransactionTypeEnum.CM;

      const action = new LoadAllowedPayments(payload);

      const outcome1 = new LoadAllowedPaymentsSuccess(data);
      const outcome2 = new LoadPayeeBanks();
      const outcome3 = new LoadCardPayerBanks();
      const outcome4 = new LoadDDPayerBanks();
      const outcome5 = new LoadChequePayerBanks();
      const outcome6 = new LoadRSOList();

      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: data });
      paymentServiceSpy.getAllowedPayments.and.returnValue(response$);

      const expected$ = cold('--(cdefgh)', {
        c: outcome1,
        d: outcome2,
        e: outcome3,
        f: outcome4,
        g: outcome5,
        h: outcome6
      });

      expect(effect.loadAllowedPayments$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload = TransactionTypeEnum.CM;

      const action = new LoadAllowedPayments(payload);
      const error = new Error('some error');
      const outcome = new LoadAllowedPaymentsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      paymentServiceSpy.getAllowedPayments.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadAllowedPayments$).toBeObservable(expected);
    });
  });
  describe('StartRazorpayPayment', () => {
    it('should start razorpay payment', () => {
      const data = paymentDetails;
      const payload: PaymentPayload = {
        transactionType: TransactionTypeEnum.CM,
        subTransactionType: SubTransactionTypeEnum.NEW_CM,
        transactionId: '122',
        paymentDetails: new RazorPayPayment(PaymentGroupEnum.REGULAR, {
          instrumentDate: moment(),
          amount: 1000,
          reference1: '234325246654744',
          reference2: '',
          reference3: '',
          otherDetails: null
        })
      };
      const action = new StartRazorpayPayment(payload);
      const outcome = new StartRazorpayPaymentSuccess(data);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: data });
      paymentServiceSpy.addPayment.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.startRazorpayPayment$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: PaymentPayload = {
        transactionType: TransactionTypeEnum.CM,
        subTransactionType: SubTransactionTypeEnum.NEW_CM,
        transactionId: '122',
        paymentDetails: new RazorPayPayment(PaymentGroupEnum.REGULAR, {
          instrumentDate: moment(),
          amount: 1000,
          reference1: '234325246654744',
          reference2: '',
          reference3: '',
          otherDetails: null
        })
      };
      const action = new StartRazorpayPayment(payload);
      const error = new Error('some error');
      const outcome = new StartRazorpayPaymentFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      paymentServiceSpy.addPayment.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.startRazorpayPayment$).toBeObservable(expected);
    });
  });

  describe('UpdateRazorpayPayment', () => {
    it('should update razorpay payment', () => {
      const data = null;
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
      const action = new UpdateIntPayment(payload.paymentDetails.paymentId);
      const outcome = new UpdateIntPaymentSuccess(data);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: data });
      paymentServiceSpy.resendPaymentLink.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.resendPaymentLink$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
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
      const action = new UpdateIntPayment(payload.paymentDetails.paymentId);
      const error = new Error('some error');
      const outcome = new UpdateIntPaymentFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      paymentServiceSpy.resendPaymentLink.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.resendPaymentLink$).toBeObservable(expected);
    });
  });

  describe('ValidateIntPayment', () => {
    it('should validate airpay payment', () => {
      const data = null;
      const payload: ValidatePaymentPayload = {
        transactionType: TransactionTypeEnum.CM,
        subTransactionType: SubTransactionTypeEnum.NEW_CM,
        paymentId: '123'
      };
      const action = new ValidateIntPayment(payload.paymentId);
      const outcome = new ValidateIntPaymentSuccess(data);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: data });
      paymentServiceSpy.validateIntegratedPayment.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.ValidateIntegratedPayment$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: ValidatePaymentPayload = {
        transactionType: TransactionTypeEnum.CM,
        subTransactionType: SubTransactionTypeEnum.NEW_CM,
        paymentId: '123'
      };
      const action = new ValidateIntPayment(payload.paymentId);
      const error = new Error('some error');
      const outcome = new ValidateIntPaymentFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      paymentServiceSpy.validateIntegratedPayment.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.ValidateIntegratedPayment$).toBeObservable(expected);
    });
  });
});
