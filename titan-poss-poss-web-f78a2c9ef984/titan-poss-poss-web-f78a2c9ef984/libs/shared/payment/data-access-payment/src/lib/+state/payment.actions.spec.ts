import {
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
  UpdateAirpayIntPaymentStatus,
  StartUnipayPayment,
  StartUnipayPaymentSuccess,
  StartUnipayPaymentFailure,
  ResetTrasactionID,
  DeletePaymentFailure,
  DeletePaymentSuccess,
  DeletePayment,
  EditCashPayment,
  EditCashPaymentFailure,
  EditCashPaymentSuccess,
  ResetCashPaymentAmount,
  ClearPaymentDetails,
  UpdateUnipayPayment,
  UpdateUnipayPaymentFailure,
  UpdateUnipayPaymentSuccess,
  VoidUnipayPayment,
  VoidUnipayPaymentFailure,
  VoidUnipayPaymentSuccess,
  GetQCGCBalanceSuccess,
  GetQCGCBalanceFailure,
  GetQCGCBalance,
  ResetPayment,
  ResetGHSeVoucher,
  UnipayHostConfiguration,
  UnipayHostConfigurationFailure,
  UnipayHostConfigurationSuccess,
  ResetQCGC,
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
  ResetCreditNoteList,
  AddCreditNotePayment,
  AddCreditNotePaymentSuccess,
  AddCreditNotePaymentFailure,
  StartRazorpayPayment,
  StartRazorpayPaymentSuccess,
  StartRazorpayPaymentFailure,
  UpdateRazorpayPayment,
  UpdateRazorpayPaymentSuccess,
  UpdateRazorpayPaymentFailure,
  UpdateRazorpayPaymentStatus,
  ValidateRazorpayPayment,
  ValidateRazorpayPaymentSuccess,
  ValidateRazorpayPaymentFailure,
  GetDigiBalance,
  GetDigiBalanceFailure,
  GetDigiBalanceSuccess
} from './payment.actions';
// Actions are not containing any business logic so this provides less value to
// test. They are only used to trigger a reducer or an effect, which is already
// covered by type-safety by using Typescript. You might anyway want to write tests
// for your action dispatchers for the sake of enforcing a specific coverage level
// and “double checking” that the right action is being dispatched.

import {
  CustomErrors,
  TransactionTypeEnum,
  AllowedPaymentsResponse,
  PaymentModeEnum,
  PaymentGroupEnum,
  LoadMaxCashLimitPayload,
  SubTransactionTypeEnum,
  EditCashPaymentPayload,
  PaymentDetails,
  LoadPaymentDetailsPayload,
  PaymentConfig,
  PaymentPayload,
  ChequePayment,
  CashPayment,
  CardPayment,
  UniPayPayment,
  EncirclePointsPayment,
  QCGC,
  ROPayment,
  ROManualPayment,
  WalletPayment,
  AirpayPayment,
  PaymentRequest,
  IntegratedPaymentRequestPayload,
  PaymentStatusEnum,
  ValidatePaymentPayload,
  RtgsPayment,
  UniPayRequest,
  UniPayResponse,
  OtherDetailsForUnipay,
  DeletePaymentPayload,
  UpdateUnipayPaylaod,
  QCGCCardDetails,
  QCGCGetBalancePayload,
  GiftCardTxnEnum,
  StoreUser,
  CmRequestDetailsPayload,
  BankLoanPayment,
  GHSeVoucher,
  GHSeVoucherDetails,
  CNListRequestPayload,
  CNListResponse,
  CreditNotePayment,
  RazorPayPayment,
  ResendPaymentLinkPayload,
  DigiGetBalancePayload,
  DigiGoldDetails,
  CashLimitDetails
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  LoadEncireclePoints,
  PaymentActionTypes,
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
  LoadPaymentDetails,
  LoadPaymentDetailsSuccess,
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
  AddCashPayment
} from './payment.actions';
import * as moment from 'moment';

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

describe('Payment Action Testing Suite', () => {
  describe('Load Encirecle Points Action Test Cases', () => {
    it('should check correct type is used for  LoadEncireclePoints action ', () => {
      const payload = '123';
      const action = new LoadEncireclePoints(payload);

      expect(action.type).toEqual(PaymentActionTypes.LOAD_ENCIRECLE_POINTS);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  LoadEncireclePointsSuccess action ', () => {
      const payload = 100;
      const action = new LoadEncireclePointsSuccess(payload);

      expect(action.type).toEqual(
        PaymentActionTypes.LOAD_ENCIRECLE_POINTS_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  LoadEncireclePointsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadEncireclePointsFailure(payload);

      expect(action.type).toEqual(
        PaymentActionTypes.LOAD_ENCIRECLE_POINTS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
  describe('Load Allowed Payments Action Test Cases', () => {
    it('should check correct type is used for  LoadEncireclePoints action ', () => {
      const payload = TransactionTypeEnum.CM;
      const action = new LoadAllowedPayments(payload);

      expect(action.type).toEqual(PaymentActionTypes.LOAD_ALLOWED_PAYMENTS);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  LoadAllowedPaymentsSuccess action ', () => {
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

      const action = new LoadAllowedPaymentsSuccess(payload);

      expect(action.type).toEqual(
        PaymentActionTypes.LOAD_ALLOWED_PAYMENTS_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  LoadAllowedPaymentsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadAllowedPaymentsFailure(payload);

      expect(action.type).toEqual(
        PaymentActionTypes.LOAD_ALLOWED_PAYMENTS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('Load Max Cash Limit Action Test Cases', () => {
    it('should check correct type is used for  LoadEncireclePoints action ', () => {
      const payload: LoadMaxCashLimitPayload = {
        transactionType: TransactionTypeEnum.CM,
        subTransactionType: SubTransactionTypeEnum.NEW_CM,
        customerId: '123',
        transactionId: '456',
        paymentCode: PaymentModeEnum.CASH,
        paymentGroup: PaymentGroupEnum.REGULAR
      };
      const action = new LoadMaxCashLimit(payload);

      expect(action.type).toEqual(PaymentActionTypes.LOAD_MAX_CASH_LIMIT);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  LoadMaxCashLimitSuccess action ', () => {
      const payload: CashLimitDetails = {
        amountDue: 1000,
        eligibleAmount: 2000,
        pmlaEligibleAmount: 0,
        totalAmount: 3
      };

      const action = new LoadMaxCashLimitSuccess(payload);

      expect(action.type).toEqual(
        PaymentActionTypes.LOAD_MAX_CASH_LIMIT_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  LoadMaxCashLimitFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadMaxCashLimitFailure(payload);

      expect(action.type).toEqual(
        PaymentActionTypes.LOAD_MAX_CASH_LIMIT_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('ConfirmPayment Action Test Cases', () => {
    it('should check correct type is used for  ConfirmPayment action ', () => {
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
      const action = new ConfirmPayment(payload);

      expect(action.type).toEqual(PaymentActionTypes.CONFIRM_PAYMENT);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  ConfirmPaymentSuccess action ', () => {
      const payload = paymentDetails;

      const action = new ConfirmPaymentSuccess(payload);

      expect(action.type).toEqual(PaymentActionTypes.CONFIRM_PAYMENT_SUCCESS);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  ConfirmPaymentFailure action ', () => {
      const payload = {
        paymentId: '123',
        error: CustomErrorAdaptor.fromJson(Error('Some Error'))
      };
      const action = new ConfirmPaymentFailure(payload);

      expect(action.type).toEqual(PaymentActionTypes.CONFIRM_PAYMENT_FAILURE);
      expect(action.payload).toEqual(payload);
    });
  });

  describe('Load Payment Details Action Test Cases', () => {
    it('should check correct type is used for  LoadPaymentDetails action ', () => {
      const payload: LoadPaymentDetailsPayload = {
        transactionType: TransactionTypeEnum.CM,
        subTransactionType: SubTransactionTypeEnum.NEW_CM,
        transactionId: '456'
      };
      const action = new LoadPaymentDetails(payload);

      expect(action.type).toEqual(PaymentActionTypes.LOAD_PAYMENT_DETAILS);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  LoadPaymentDetailsSuccess action ', () => {
      const payload = [paymentDetails];

      const action = new LoadPaymentDetailsSuccess(payload);

      expect(action.type).toEqual(
        PaymentActionTypes.LOAD_PAYMENT_DETAILS_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  LoadPaymentDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadPaymentDetailsFailure(payload);

      expect(action.type).toEqual(
        PaymentActionTypes.LOAD_PAYMENT_DETAILS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('Load Card PayerBanks Action Test Cases', () => {
    it('should check correct type is used for  LoadPaymentDetails action ', () => {
      const action = new LoadCardPayerBanks();

      expect(action.type).toEqual(PaymentActionTypes.LOAD_CARD_PAYER_BANKS);
    });
    it('should check correct type is used for  LoadCardPayerBanksSuccess action ', () => {
      const payload: PaymentConfig = {
        payerBanks: ['ICICI', 'HDFC'],
        cardType: ['CC', 'DC'],
        isBankMandatory: null,
        isCardTypeMandatory: null
      };

      const action = new LoadCardPayerBanksSuccess(payload);

      expect(action.type).toEqual(
        PaymentActionTypes.LOAD_CARD_PAYER_BANKS_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  LoadCardPayerBanksFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadCardPayerBanksFailure(payload);

      expect(action.type).toEqual(
        PaymentActionTypes.LOAD_CARD_PAYER_BANKS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('Load DD Payer Banks Action Test Cases', () => {
    it('should check correct type is used for  LoadPaymentDetails action ', () => {
      const action = new LoadDDPayerBanks();

      expect(action.type).toEqual(PaymentActionTypes.LOAD_DD_PAYER_BANKS);
    });
    it('should check correct type is used for  LoadDDPayerBanksSuccess action ', () => {
      const payload: PaymentConfig = {
        payerBanks: ['ICICI', 'HDFC'],
        cardType: ['CC', 'DC'],
        isBankMandatory: null,
        isCardTypeMandatory: null
      };

      const action = new LoadDDPayerBanksSuccess(payload);

      expect(action.type).toEqual(
        PaymentActionTypes.LOAD_DD_PAYER_BANKS_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  LoadDDPayerBanksFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadDDPayerBanksFailure(payload);

      expect(action.type).toEqual(
        PaymentActionTypes.LOAD_DD_PAYER_BANKS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('Load Cheque Payer Banks Action Test Cases', () => {
    it('should check correct type is used for  LoadChequePayerBanks action ', () => {
      const action = new LoadChequePayerBanks();

      expect(action.type).toEqual(PaymentActionTypes.LOAD_CHEQUE_PAYER_BANKS);
    });
    it('should check correct type is used for  LoadChequePayerBanksSuccess action ', () => {
      const payload: PaymentConfig = {
        payerBanks: ['ICICI', 'HDFC'],
        cardType: ['CC', 'DC'],
        isBankMandatory: null,
        isCardTypeMandatory: null
      };

      const action = new LoadChequePayerBanksSuccess(payload);

      expect(action.type).toEqual(
        PaymentActionTypes.LOAD_CHEQUE_PAYER_BANKS_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  LoadChequePayerBanksFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadChequePayerBanksFailure(payload);

      expect(action.type).toEqual(
        PaymentActionTypes.LOAD_CHEQUE_PAYER_BANKS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('Load Payee Banks Action Test Cases', () => {
    it('should check correct type is used for  LoadPayeeBanks action ', () => {
      const action = new LoadPayeeBanks();

      expect(action.type).toEqual(PaymentActionTypes.LOAD_PAYEE_BANKS);
    });
    it('should check correct type is used for  LoadPayeeBanksSuccess action ', () => {
      const payload = ['ICICI', 'HDFC'];

      const action = new LoadPayeeBanksSuccess(payload);

      expect(action.type).toEqual(PaymentActionTypes.LOAD_PAYEE_BANKS_SUCCESS);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  LoadPayeeBanksFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadPayeeBanksFailure(payload);

      expect(action.type).toEqual(PaymentActionTypes.LOAD_PAYEE_BANKS_FAILURE);
      expect(action.payload).toEqual(payload);
    });
  });

  describe('Add Cheque and DD Payment Action Test Cases', () => {
    it('should check correct type is used for  AddChequeDDPayment action ', () => {
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

      expect(action.type).toEqual(PaymentActionTypes.ADD_CHEQUE_DD_PAYMENT);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  AddChequeDDPaymentSuccess action ', () => {
      const payload = paymentDetails;

      const action = new AddChequeDDPaymentSuccess(payload);

      expect(action.type).toEqual(
        PaymentActionTypes.ADD_CHEQUE_DD_PAYMENT_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  AddChequeDDPaymentFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new AddChequeDDPaymentFailure(payload);

      expect(action.type).toEqual(
        PaymentActionTypes.ADD_CHEQUE_DD_PAYMENT_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('Add Cash Payment Action Test Cases', () => {
    it('should check correct type is used for  AddCashPayment action ', () => {
      const payload: PaymentPayload = {
        transactionType: TransactionTypeEnum.CM,
        subTransactionType: SubTransactionTypeEnum.NEW_CM,
        transactionId: '122',
        paymentDetails: new CashPayment(PaymentGroupEnum.REGULAR, {
          amount: 1000
        })
      };

      const action = new AddCashPayment(payload);

      expect(action.type).toEqual(PaymentActionTypes.ADD_CASH_PAYMENT);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  AddCashPaymentSuccess action ', () => {
      const payload = paymentDetails;

      const action = new AddCashPaymentSuccess(payload);

      expect(action.type).toEqual(PaymentActionTypes.ADD_CASH_PAYMENT_SUCCESS);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  AddCashPaymentFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new AddCashPaymentFailure(payload);

      expect(action.type).toEqual(PaymentActionTypes.ADD_CASH_PAYMENT_FAILURE);
      expect(action.payload).toEqual(payload);
    });
  });

  describe('Add Card Payment Action Test Cases', () => {
    it('should check correct type is used for  AddCardPayment action ', () => {
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

      expect(action.type).toEqual(PaymentActionTypes.ADD_CARD_PAYMENT);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  AddCardPaymentSuccess action ', () => {
      const payload = paymentDetails;

      const action = new AddCardPaymentSuccess(payload);

      expect(action.type).toEqual(PaymentActionTypes.ADD_CARD_PAYMENT_SUCCESS);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  AddCardPaymentFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new AddCardPaymentFailure(payload);

      expect(action.type).toEqual(PaymentActionTypes.ADD_CARD_PAYMENT_FAILURE);
      expect(action.payload).toEqual(payload);
    });
  });

  describe('Add Unipay Payment Action Test Cases', () => {
    it('should check correct type is used for  AddUnipayPayment action ', () => {
      const payload: PaymentPayload = {
        transactionType: TransactionTypeEnum.CM,
        subTransactionType: SubTransactionTypeEnum.NEW_CM,
        transactionId: '122',
        paymentDetails: new UniPayPayment(PaymentGroupEnum.REGULAR, {
          amount: 1000
        })
      };

      const action = new AddUnipayPayment(payload);

      expect(action.type).toEqual(PaymentActionTypes.ADD_UNIPAY_PAYMENT);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  AddUnipayPaymentSuccess action ', () => {
      const uniPayPaymentDetails = {
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

      const payload = uniPayPaymentDetails;

      const action = new AddUnipayPaymentSuccess(payload);

      expect(action.type).toEqual(
        PaymentActionTypes.ADD_UNIPAY_PAYMENT_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  AddUnipayPaymentFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new AddUnipayPaymentFailure(payload);

      expect(action.type).toEqual(
        PaymentActionTypes.ADD_UNIPAY_PAYMENT_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('Add Encircle Payment Action Test Cases', () => {
    it('should check correct type is used for  AddEncirclePointsPayment action ', () => {
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

      expect(action.type).toEqual(
        PaymentActionTypes.ADD_ENCIRCLE_POINTS_PAYMENT
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  AddEncirclePointsPaymentSuccess action ', () => {
      const payload = paymentDetails;

      const action = new AddEncirclePointsPaymentSuccess(payload);

      expect(action.type).toEqual(
        PaymentActionTypes.ADD_ENCIRCLE_POINTS_PAYMENT_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  AddEncirclePointsPaymentFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new AddEncirclePointsPaymentFailure(payload);

      expect(action.type).toEqual(
        PaymentActionTypes.ADD_ENCIRCLE_POINTS_PAYMENT_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('Add QCGC Payment Action Test Cases', () => {
    it('should check correct type is used for  AddQCGCPayment action ', () => {
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

      expect(action.type).toEqual(PaymentActionTypes.ADD_QCGC_PAYMENT);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  AddQCGCPaymentSuccess action ', () => {
      const payload = paymentDetails;

      const action = new AddQCGCPaymentSuccess(payload);

      expect(action.type).toEqual(PaymentActionTypes.ADD_QCGC_PAYMENT_SUCCESS);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  AddQCGCPaymentFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new AddQCGCPaymentFailure(payload);

      expect(action.type).toEqual(PaymentActionTypes.ADD_QCGC_PAYMENT_FAILURE);
      expect(action.payload).toEqual(payload);
    });
  });

  describe('Add RO Payment Action Test Cases', () => {
    it('should check correct type is used for  AddROPayment action ', () => {
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

      expect(action.type).toEqual(PaymentActionTypes.ADD_RO_PAYMENT);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  AddROPaymentSuccess action ', () => {
      const payload = paymentDetails;

      const action = new AddROPaymentSuccess(payload);

      expect(action.type).toEqual(PaymentActionTypes.ADD_RO_PAYMENT_SUCCESS);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  AddROPaymentFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new AddROPaymentFailure(payload);

      expect(action.type).toEqual(PaymentActionTypes.ADD_RO_PAYMENT_FAILURE);
      expect(action.payload).toEqual(payload);
    });
  });

  describe('Add RO Manual Payment Action Test Cases', () => {
    it('should check correct type is used for  AddROManualPayment action ', () => {
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

      expect(action.type).toEqual(PaymentActionTypes.ADD_MANUAL_PAYMENT);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  AddROManualPaymentSuccess action ', () => {
      const payload = paymentDetails;

      const action = new AddManualPaymentSuccess(payload);

      expect(action.type).toEqual(
        PaymentActionTypes.ADD_MANUAL_PAYMENT_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  AddROManualPaymentFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new AddManualPaymentFailure(payload);

      expect(action.type).toEqual(
        PaymentActionTypes.ADD_MANUAL_PAYMENT_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('Add Wallet Payment Action Test Cases', () => {
    it('should check correct type is used for  AddWalletPayment action ', () => {
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

      expect(action.type).toEqual(PaymentActionTypes.ADD_WALLET_PAYMENT);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  AddWalletPaymentSuccess action ', () => {
      const payload = paymentDetails;

      const action = new AddWalletPaymentSuccess(payload);

      expect(action.type).toEqual(
        PaymentActionTypes.ADD_WALLET_PAYMENT_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  AddWalletPaymentFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new AddWalletPaymentFailure(payload);

      expect(action.type).toEqual(
        PaymentActionTypes.ADD_WALLET_PAYMENT_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('Add Airpay Payment Action Test Cases', () => {
    it('should check correct type is used for  AddAirpayPayment action ', () => {
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

      expect(action.type).toEqual(PaymentActionTypes.ADD_AIRPAY_PAYMENT);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  AddAirpayPaymentSuccess action ', () => {
      const payload = paymentDetails;

      const action = new AddAirpayPaymentSuccess(payload);

      expect(action.type).toEqual(
        PaymentActionTypes.ADD_AIRPAY_PAYMENT_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  AddAirpayPaymentFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new AddAirpayPaymentFailure(payload);

      expect(action.type).toEqual(
        PaymentActionTypes.ADD_AIRPAY_PAYMENT_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('Send RO Payment Request Action Test Cases', () => {
    it('should check correct type is used for  SendROPaymentRequest action ', () => {
      const payload: IntegratedPaymentRequestPayload = {
        amount: 100,
        customerId: '22',
        paymentCode: 'RO',
        requestedReason: 'TEST'
      };

      const action = new SendPaymentRequest(payload);

      expect(action.type).toEqual(PaymentActionTypes.SEND_PAYMENT_REQUEST);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  SendROPaymentRequestSuccess action ', () => {
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

      const action = new SendPaymentRequestSuccess(payload);

      expect(action.type).toEqual(
        PaymentActionTypes.SEND_PAYMENT_REQUEST_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  SendROPaymentRequestFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SendPaymentRequestFailure(payload);

      expect(action.type).toEqual(
        PaymentActionTypes.SEND_PAYMENT_REQUEST_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('Start Airpay Int Payment Action Test Cases', () => {
    it('should check correct type is used for  StartAirpayIntPayment action ', () => {
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

      expect(action.type).toEqual(PaymentActionTypes.START_AIRPAY_INT_PAYMENT);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  StartAirpayIntPaymentSuccess action ', () => {
      const payload = paymentDetails;

      const action = new StartAirpayIntPaymentSuccess(payload);

      expect(action.type).toEqual(
        PaymentActionTypes.START_AIRPAY_INT_PAYMENT_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  StartAirpayIntPaymentFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new StartAirpayIntPaymentFailure(payload);

      expect(action.type).toEqual(
        PaymentActionTypes.START_AIRPAY_INT_PAYMENT_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('Update Airpay Int Payment Action Test Cases', () => {
    it('should check correct type is used for  UpdateAirpayIntPayment action ', () => {
      const payload = 'ABC';
      const action = new UpdateIntPayment(payload);

      expect(action.type).toEqual(PaymentActionTypes.UPDATE_INT_PAYMENT);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  UpdateAirpayIntPaymentSuccess action ', () => {
      const payload: PaymentRequest = null;

      const action = new UpdateIntPaymentSuccess(payload);

      expect(action.type).toEqual(
        PaymentActionTypes.UPDATE_INT_PAYMENT_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  UpdateAirpayIntPaymentFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new UpdateIntPaymentFailure(payload);

      expect(action.type).toEqual(
        PaymentActionTypes.UPDATE_INT_PAYMENT_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });

    it('should check correct type is used for  UpdateAirpayIntPaymentStatus action ', () => {
      const payload = paymentDetails;

      const action = new UpdateAirpayIntPaymentStatus(payload);

      expect(action.type).toEqual(
        PaymentActionTypes.UPDATE_AIRPAY_INT_PAYMENT_STATUS
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('Validate Airpay Int Payment Action Test Cases', () => {
    it('should check correct type is used for  ValidateAirpayIntPayment action ', () => {
      const payload = 'ASDEF';
      const action = new ValidateIntPayment(payload);

      expect(action.type).toEqual(PaymentActionTypes.VALIDATE_INT_PAYMENT);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  ValidateAirpayIntPaymentSuccess action ', () => {
      const payload: PaymentRequest = null;

      const action = new ValidateIntPaymentSuccess(payload);

      expect(action.type).toEqual(
        PaymentActionTypes.VALIDATE_INT_PAYMENT_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  ValidateAirpayIntPaymentFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new ValidateIntPaymentFailure(payload);

      expect(action.type).toEqual(
        PaymentActionTypes.VALIDATE_INT_PAYMENT_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('Load Airapy Payment Details Action Test Cases', () => {
    it('should check correct type is used for  LoadOpenAirpayPaymentDetails action ', () => {
      const payload: LoadPaymentDetailsPayload = {
        transactionType: TransactionTypeEnum.CM,
        subTransactionType: SubTransactionTypeEnum.NEW_CM,
        transactionId: '456'
      };
      const action = new LoadOpenAirpayPaymentDetails(payload);

      expect(action.type).toEqual(
        PaymentActionTypes.LOAD_OPEN_AIRPAY_PAYMENT_DETAILS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  LoadOpenAirpayPaymentDetailsSuccess action ', () => {
      const payload = [paymentDetails];

      const action = new LoadOpenAirpayPaymentDetailsSuccess(payload);

      expect(action.type).toEqual(
        PaymentActionTypes.LOAD_OPEN_AIRPAY_PAYMENT_DETAILS_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  LoadOpenAirpayPaymentDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadOpenAirpayPaymentDetailsFailure(payload);

      expect(action.type).toEqual(
        PaymentActionTypes.LOAD_OPEN_AIRPAY_PAYMENT_DETAILS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('Load RO Payment Request status Action Test Cases', () => {
    it('should check correct type is used for  LoadROPaymentRequestStatus action ', () => {
      const payload = '123';

      const action = new LoadROPaymentRequestStatus(payload);

      expect(action.type).toEqual(
        PaymentActionTypes.LOAD_RO_PAYMENT_REQUEST_STATUS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  LoadROPaymentRequestStatusSuccess action ', () => {
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

      const action = new LoadROPaymentRequestStatusSuccess(payload);

      expect(action.type).toEqual(
        PaymentActionTypes.LOAD_RO_PAYMENT_REQUEST_STATUS_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  LoadROPaymentRequestStatusFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadROPaymentRequestStatusFailure(payload);

      expect(action.type).toEqual(
        PaymentActionTypes.LOAD_RO_PAYMENT_REQUEST_STATUS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('Add RTGS Payment Action Test Cases', () => {
    it('should check correct type is used for  AddRtgsPayment action ', () => {
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

      expect(action.type).toEqual(PaymentActionTypes.ADD_RTGS_PAYMENT);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  AddRtgsPaymentSuccess action ', () => {
      const payload = paymentDetails;

      const action = new AddRtgsPaymentSuccess(payload);

      expect(action.type).toEqual(PaymentActionTypes.ADD_RTGS_PAYMENT_SUCCESS);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  AddRtgsPaymentFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new AddRtgsPaymentFailure(payload);

      expect(action.type).toEqual(PaymentActionTypes.ADD_RTGS_PAYMENT_FAILURE);
      expect(action.payload).toEqual(payload);
    });
  });

  describe('Start Unipay Payment Action Test Cases', () => {
    it('should check correct type is used for  StartUnipayPayment action ', () => {
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

      expect(action.type).toEqual(PaymentActionTypes.START_UNIPAY_PAYMENT);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  StartUnipayPaymentSuccess action ', () => {
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

      const action = new StartUnipayPaymentSuccess(payload);

      expect(action.type).toEqual(
        PaymentActionTypes.START_UNIPAY_PAYMENT_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  StartUnipayPaymentFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new StartUnipayPaymentFailure(payload);

      expect(action.type).toEqual(
        PaymentActionTypes.START_UNIPAY_PAYMENT_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('Delete Payment Action Test Cases', () => {
    it('should check correct type is used for  DeletePayment action ', () => {
      const payload: DeletePaymentPayload = {
        transactionType: TransactionTypeEnum.CM,
        subTransactionType: SubTransactionTypeEnum.NEW_CM,
        paymentId: '122'
      };

      const action = new DeletePayment(payload);

      expect(action.type).toEqual(PaymentActionTypes.DELETE_PAYMENT);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  DeletePaymentSuccess action ', () => {
      const payload = '123';

      const action = new DeletePaymentSuccess(payload);

      expect(action.type).toEqual(PaymentActionTypes.DELETE_PAYMENT_SUCCESS);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  DeletePaymentFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new DeletePaymentFailure(payload);

      expect(action.type).toEqual(PaymentActionTypes.DELETE_PAYMENT_FAILURE);
      expect(action.payload).toEqual(payload);
    });
  });

  describe('Edit Payment Action Test Cases', () => {
    it('should check correct type is used for  EditCashPayment action ', () => {
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

      expect(action.type).toEqual(PaymentActionTypes.EDIT_CASH_PAYMENT);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  EditCashPaymentSuccess action ', () => {
      const payload = paymentDetails;

      const action = new EditCashPaymentSuccess(payload);

      expect(action.type).toEqual(PaymentActionTypes.EDIT_CASH_PAYMENT_SUCCESS);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  EditCashPaymentFailure action ', () => {
      const payload = {
        paymentId: '123',
        error: CustomErrorAdaptor.fromJson(Error('Some Error'))
      };
      const action = new EditCashPaymentFailure(payload);

      expect(action.type).toEqual(PaymentActionTypes.EDIT_CASH_PAYMENT_FAILURE);
      expect(action.payload).toEqual(payload);
    });
  });

  describe('Update Unipay Payment  Action Test Cases', () => {
    it('should check correct type is used for  UpdateUnipayPayment action ', () => {
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

      expect(action.type).toEqual(PaymentActionTypes.UPDATE_UNIPAY_PAYMENT);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  UpdateUnipayPaymentSuccess action ', () => {
      const payload = paymentDetails;

      const action = new UpdateUnipayPaymentSuccess(payload);

      expect(action.type).toEqual(
        PaymentActionTypes.UPDATE_UNIPAY_PAYMENT_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  UpdateUnipayPaymentFailure action ', () => {
      const payload = CustomErrorAdaptor.fromJson(Error('Some Error'));

      const action = new UpdateUnipayPaymentFailure(payload);

      expect(action.type).toEqual(
        PaymentActionTypes.UPDATE_UNIPAY_PAYMENT_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('Void Unipay Payment  Action Test Cases', () => {
    it('should check correct type is used for  VoidUnipayPayment action ', () => {
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

      const action = new VoidUnipayPayment(payload);

      expect(action.type).toEqual(PaymentActionTypes.VOID_UNIPAY_PAYMENT);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  VoidUnipayPaymentSuccess action ', () => {
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

      const action = new VoidUnipayPaymentSuccess(payload);

      expect(action.type).toEqual(
        PaymentActionTypes.VOID_UNIPAY_PAYMENT_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  VoidUnipayPaymentFailure action ', () => {
      const payload = CustomErrorAdaptor.fromJson(Error('Some Error'));

      const action = new VoidUnipayPaymentFailure(payload);

      expect(action.type).toEqual(
        PaymentActionTypes.VOID_UNIPAY_PAYMENT_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('GetQCGCBalance  Action Test Cases', () => {
    it('should check correct type is used for  GetQCGCBalance action ', () => {
      const payload: QCGCGetBalancePayload = {
        cardType: GiftCardTxnEnum.CM,
        cardNumber: '1234'
      };

      const action = new GetQCGCBalance(payload);

      expect(action.type).toEqual(PaymentActionTypes.GET_QCGC_BALANCE);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  GetQCGCBalanceSuccess action ', () => {
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

      const action = new GetQCGCBalanceSuccess(payload);

      expect(action.type).toEqual(PaymentActionTypes.GET_QCGC_BALANCE_SUCCESS);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  GetQCGCBalanceFailure action ', () => {
      const payload = CustomErrorAdaptor.fromJson(Error('Some Error'));

      const action = new GetQCGCBalanceFailure(payload);

      expect(action.type).toEqual(PaymentActionTypes.GET_QCGC_BALANCE_FAILURE);
      expect(action.payload).toEqual(payload);
    });
  });

  describe('GetDigiBalance  Action Test Cases', () => {
    it('should check correct type is used for  GetDigiBalance action ', () => {
      const payload: DigiGetBalancePayload = {
        mobileNo: '',
        transactionId: '',
        vendorCode: ''
      };

      const action = new GetDigiBalance(payload);

      expect(action.type).toEqual(PaymentActionTypes.GET_DIGI_BALANCE);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  GetDigiBalanceSuccess action ', () => {
      const payload: DigiGoldDetails = {
        mobileNo: '',
        nonTanishqGoldBalanceInGrams: 10,
        referenceId: '',
        tanishqGoldBalanceInGrams: 10
      };

      const action = new GetDigiBalanceSuccess(payload);

      expect(action.type).toEqual(PaymentActionTypes.GET_DIGI_BALANCE_SUCCESS);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  GetDigiBalanceFailure action ', () => {
      const payload = CustomErrorAdaptor.fromJson(Error('Some Error'));

      const action = new GetDigiBalanceFailure(payload);

      expect(action.type).toEqual(PaymentActionTypes.GET_DIGI_BALANCE_FAILURE);
      expect(action.payload).toEqual(payload);
    });
  });
  describe('Unipay Host Configuration  Action Test Cases', () => {
    it('should check correct type is used for  UnipayHostConfiguration action ', () => {
      const action = new UnipayHostConfiguration();

      expect(action.type).toEqual(
        PaymentActionTypes.LOAD_UNIPAY_HOST_CONFIGURATION
      );
    });
    it('should check correct type is used for  UnipayHostConfigurationSuccess action ', () => {
      const payload = ['TEST DATA'];

      const action = new UnipayHostConfigurationSuccess(payload);

      expect(action.type).toEqual(
        PaymentActionTypes.LOAD_UNIPAY_HOST_CONFIGURATION_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  UnipayHostConfigurationFailure action ', () => {
      const payload = CustomErrorAdaptor.fromJson(Error('Some Error'));

      const action = new UnipayHostConfigurationFailure(payload);

      expect(action.type).toEqual(
        PaymentActionTypes.LOAD_UNIPAY_HOST_CONFIGURATION_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('Load RSO List Action Test Cases', () => {
    it('should check correct type is used for  LoadRSOList action ', () => {
      const action = new LoadRSOList();

      expect(action.type).toEqual(PaymentActionTypes.LOAD_RSO_LIST);
    });
    it('should check correct type is used for  LoadRSOListSuccess action ', () => {
      const payload: StoreUser[] = [
        {
          empName: 'EMP 1',
          employeeCode: 'EMP 1',
          locationCode: 'URB',
          mobileNo: '9920022112',
          isLoginActive: false
        }
      ];

      const action = new LoadRSOListSuccess(payload);

      expect(action.type).toEqual(PaymentActionTypes.LOAD_RSO_LIST_SUCCESS);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  LoadRSOListFailure action ', () => {
      const payload = CustomErrorAdaptor.fromJson(Error('Some Error'));

      const action = new LoadRSOListFailure(payload);

      expect(action.type).toEqual(PaymentActionTypes.LOAD_RSO_LIST_FAILURE);
      expect(action.payload).toEqual(payload);
    });
  });

  describe('Load CM Request Payment Details Action Test Cases', () => {
    it('should check correct type is used for  LoadCMRequestPaymentDetails action ', () => {
      const payload: CmRequestDetailsPayload = {
        processId: 'IND124',
        taskId: '123',
        taskName: 'CM',
        workFlowType: 'Manual',
        userType: true
      };
      const action = new LoadCMRequestPaymentDetails(payload);

      expect(action.type).toEqual(
        PaymentActionTypes.LOAD_CM_REQUEST_PAYMENT_DETAILS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  LoadCMRequestPaymentDetailsSuccess action ', () => {
      const payload = [paymentDetails];

      const action = new LoadCMRequestPaymentDetailsSuccess(payload);

      expect(action.type).toEqual(
        PaymentActionTypes.LOAD_CM_REQUEST_PAYMENT_DETAILS_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  LoadCMRequestPaymentDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadCMRequestPaymentDetailsFailure(payload);

      expect(action.type).toEqual(
        PaymentActionTypes.LOAD_CM_REQUEST_PAYMENT_DETAILS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('Add Bank Payment Action Test Cases', () => {
    it('should check correct type is used for  AddBankLoanPayment action ', () => {
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

      expect(action.type).toEqual(PaymentActionTypes.ADD_BANK_LOAN_PAYMENT);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  AddRtgsPaymentSuccess action ', () => {
      const payload = paymentDetails;

      const action = new AddBankLoanPaymentSuccess(payload);

      expect(action.type).toEqual(
        PaymentActionTypes.ADD_BANK_LOAN_PAYMENT_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  AddBankLoanPaymentFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new AddBankLoanPaymentFailure(payload);

      expect(action.type).toEqual(
        PaymentActionTypes.ADD_BANK_LOAN_PAYMENT_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('Add GHS eVoucher Payment Action Test Cases', () => {
    it('should check correct type is used for  AddGHSeVoucherPayment action ', () => {
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

      expect(action.type).toEqual(PaymentActionTypes.ADD_GHS_eVOUCHER_PAYMENT);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  AddGHSeVoucherPaymentSuccess action ', () => {
      const payload = paymentDetails;

      const action = new AddGHSeVoucherPaymentSuccess(payload);

      expect(action.type).toEqual(
        PaymentActionTypes.ADD_GHS_eVOUCHER_PAYMENT_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  AddGHSeVoucherPaymentFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new AddGHSeVoucherPaymentFailure(payload);

      expect(action.type).toEqual(
        PaymentActionTypes.ADD_GHS_eVOUCHER_PAYMENT_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('Get GHS eVoucher Balance Action Test Cases', () => {
    it('should check correct type is used for  GetGHSeVoucherBalance action ', () => {
      const payload = {
        cardType: GiftCardTxnEnum.CM,
        cardNumber: '123',
        otpRequired: false
      };

      const action = new GetGHSeVoucherBalance(payload);

      expect(action.type).toEqual(PaymentActionTypes.GET_GHS_eVOUCHER_BALANCE);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  GetGHSeVoucherBalanceSuccess action ', () => {
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
      const action = new GetGHSeVoucherBalanceSuccess(payload);

      expect(action.type).toEqual(
        PaymentActionTypes.GET_GHS_eVOUCHER_BALANCE_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  GetGHSeVoucherBalanceFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new GetGHSeVoucherBalanceFailure(payload);

      expect(action.type).toEqual(
        PaymentActionTypes.GET_GHS_eVOUCHER_BALANCE_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  it('should check correct type is used for  ResetTrasactionID action ', () => {
    const action = new ResetTrasactionID();

    expect(action.type).toEqual(PaymentActionTypes.RESET_TRANSACTION_ID);
  });

  it('should check correct type is used for  ClearPaymentDetails action ', () => {
    const action = new ClearPaymentDetails();

    expect(action.type).toEqual(PaymentActionTypes.CLEAR_PAYMENT_DETAILS);
  });

  it('should check correct type is used for  ResetCashPaymentAmount action ', () => {
    const payload = {
      paymentId: '123'
    };
    const action = new ResetCashPaymentAmount(payload);
    expect(action.payload).toEqual(payload);

    expect(action.type).toEqual(PaymentActionTypes.RESET_CASH_PAYMENT_AMOUNT);
  });

  it('should check correct type is used for  ResetGHSeVoucher action ', () => {
    const action = new ResetGHSeVoucher();

    expect(action.type).toEqual(PaymentActionTypes.RESET_GHS_eVOUCHER);
  });

  it('should check correct type is used for  ResetPayment action ', () => {
    const action = new ResetPayment();

    expect(action.type).toEqual(PaymentActionTypes.RESET_PAYMENT);
  });

  it('should check correct type is used for  ResetQCGC action ', () => {
    const action = new ResetQCGC();

    expect(action.type).toEqual(PaymentActionTypes.RESET_QCGC);
  });
  describe('Load Credit Note List Action Test Cases', () => {
    it('should check correct type is used for  GetCreditNoteList action ', () => {
      const payload: CNListRequestPayload = {
        customerId: 344,
        isPageable: false,
        locationCode: 'URB'
      };
      const action = new GetCreditNoteList(payload);

      expect(action.type).toEqual(PaymentActionTypes.GET_CREDIT_NOTE_LIST);
    });
    it('should check correct type is used for  GetCreditNoteListSuccess action ', () => {
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

      const action = new GetCreditNoteListSuccess(cnTypeList);

      expect(action.type).toEqual(
        PaymentActionTypes.GET_CREDIT_NOTE_LIST_SUCCESS
      );
      expect(action.payload).toEqual(cnTypeList);
    });
    it('should check correct type is used for  GetCreditNoteListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new GetCreditNoteListFailure(payload);

      expect(action.type).toEqual(
        PaymentActionTypes.GET_CREDIT_NOTE_LIST_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  ResetCreditNoteList action ', () => {
      const action = new ResetCreditNoteList();

      expect(action.type).toEqual(PaymentActionTypes.RESET_CREDIT_NOTE_LIST);
    });
  });

  describe('Add Credit Note Payment Action Test Cases', () => {
    it('should check correct type is used for  AddCreditNotePayment action ', () => {
      const payload = {
        transactionType: TransactionTypeEnum.CM,
        subTransactionType: SubTransactionTypeEnum.NEW_CM,
        transactionId: '122',
        paymentDetails: new CreditNotePayment(PaymentGroupEnum.REGULAR, {
          amount: 1000,
          instrumentType: 'BILL_CANCELLATION',
          instrumentNo: '49',
          instrumentDate: moment().format(),
          reference3: 'REF 3'
        })
      };

      const action = new AddCreditNotePayment(payload);

      expect(action.type).toEqual(PaymentActionTypes.ADD_CREDIT_NOTE_PAYMENT);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  AddCreditNotePaymentSuccess action ', () => {
      const payload = paymentDetails;

      const action = new AddCreditNotePaymentSuccess(payload);

      expect(action.type).toEqual(
        PaymentActionTypes.ADD_CREDIT_NOTE_PAYMENT_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  AddCreditNotePaymentFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new AddCreditNotePaymentFailure(payload);

      expect(action.type).toEqual(
        PaymentActionTypes.ADD_CREDIT_NOTE_PAYMENT_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('Start Razorpay Payment Action Test Cases', () => {
    it('should check correct type is used for  StartRazorpayPayment action ', () => {
      const payload: PaymentPayload = {
        transactionType: TransactionTypeEnum.CM,
        subTransactionType: SubTransactionTypeEnum.NEW_CM,
        transactionId: '122',
        paymentDetails: new RazorPayPayment(PaymentGroupEnum.REGULAR, {
          instrumentDate: moment(),
          amount: 1000,
          reference1: '125454',
          reference2: '2000',
          reference3: '',
          otherDetails: null
        })
      };
      const action = new StartRazorpayPayment(payload);

      expect(action.type).toEqual(PaymentActionTypes.START_RAZORPAY_PAYMENT);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  StartRazorpayPaymentSuccess action ', () => {
      const payload = paymentDetails;

      const action = new StartRazorpayPaymentSuccess(payload);

      expect(action.type).toEqual(
        PaymentActionTypes.START_RAZORPAY_PAYMENT_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  StartRazorpayPaymentFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new StartRazorpayPaymentFailure(payload);

      expect(action.type).toEqual(
        PaymentActionTypes.START_RAZORPAY_PAYMENT_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('Update Razorpay Payment Action Test Cases', () => {
    it('should check correct type is used for  UpdateRazorpayPayment action ', () => {
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
      const action = new UpdateRazorpayPayment(payload);

      expect(action.type).toEqual(PaymentActionTypes.UPDATE_RAZORPAY_PAYMENT);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  UpdateRazorpayPaymentSuccess action ', () => {
      const payload = paymentDetails;

      const action = new UpdateRazorpayPaymentSuccess(payload);

      expect(action.type).toEqual(
        PaymentActionTypes.UPDATE_RAZORPAY_PAYMENT_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  UpdateRazorpayPaymentFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new UpdateRazorpayPaymentFailure(payload);

      expect(action.type).toEqual(
        PaymentActionTypes.UPDATE_RAZORPAY_PAYMENT_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });

    it('should check correct type is used for  UpdateRazorpayPaymentStatus action ', () => {
      const payload = paymentDetails;

      const action = new UpdateRazorpayPaymentStatus(payload);

      expect(action.type).toEqual(
        PaymentActionTypes.UPDATE_RAZORPAY_PAYMENT_STATUS
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('Validate Razorpay Payment Action Test Cases', () => {
    it('should check correct type is used for  ValidateRazorpayPayment action ', () => {
      const payload: ValidatePaymentPayload = {
        transactionType: TransactionTypeEnum.CM,
        subTransactionType: SubTransactionTypeEnum.NEW_CM,
        paymentId: '123'
      };
      const action = new ValidateRazorpayPayment(payload);

      expect(action.type).toEqual(PaymentActionTypes.VALIDATE_RAZORPAY_PAYMENT);
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  ValidateRazorpayPaymentSuccess action ', () => {
      const payload = paymentDetails;

      const action = new ValidateRazorpayPaymentSuccess(payload);

      expect(action.type).toEqual(
        PaymentActionTypes.VALIDATE_RAZORPAY_PAYMENT_SUCCESS
      );
      expect(action.payload).toEqual(payload);
    });
    it('should check correct type is used for  ValidateRazorpayPaymentFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new ValidateRazorpayPaymentFailure(payload);

      expect(action.type).toEqual(
        PaymentActionTypes.VALIDATE_RAZORPAY_PAYMENT_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
});
