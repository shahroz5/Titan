import { initialState } from './payment.reducer';

import { Store } from '@ngrx/store';
import { TestBed } from '@angular/core/testing';
import { PaymentFacade } from './payment.facade';
import { provideMockStore } from '@ngrx/store/testing';
import { PaymentState } from './payment.state';
import {
  ClearPaymentDetails,
  DeletePayment,
  GetCreditNoteList,
  GetGHSeVoucherBalance,
  GetQCGCBalance,
  LoadAllowedPayments,
  LoadCreditNoteDetails,
  LoadPaymentDetails,
  ResetCreditNoteList,
  StartUnipayPayment,
  VoidUnipayPayment,
  UpdateUnipayPayment,
  ResetTrasactionID,
  ResetFailedGV,
  AddChequeDDPayment,
  AddCashPayment,
  AddCardPayment,
  AddROPayment,
  AddManualPayment,
  SendPaymentRequest,
  AddEncirclePointsPayment,
  GetGVBalance,
  AddQCGCPayment,
  RemoveGV,
  AddGVPayment,
  AddGHSeVoucherPayment,
  AddUnipayPayment,
  EditCashPayment,
  ResetQCGC,
  ResetInvokedCreditNote,
  ResetGHSeVoucher,
  AddWalletPayment,
  AddCreditNotePayment,
  AddBankLoanPayment,
  AddAirpayPayment,
  AddRtgsPayment,
  LoadMaxCashLimit,
  ResetCashPaymentAmount,
  ResetPayment,
  UnipayHostConfiguration,
  StartAirpayIntPayment,
  UpdateIntPayment,
  ValidateIntPayment,
  ValidatePayment,
  LoadOpenAirpayPaymentDetails,
  UpdateAirpayIntPaymentStatus,
  ConfirmPayment,
  LoadRSOList,
  LoadROPaymentRequestStatus,
  LoadEncireclePoints,
  LoadCMRequestPaymentDetails,
  GetThirdPartyCNList,
  GetInvokedCreditNote,
  GenerateOtpForCn,
  StartRazorpayPayment,
  UpdateRazorpayPayment,
  ValidateRazorpayPayment,
  UpdateRazorpayPaymentStatus
} from './payment.actions';
import {
  GVPaymentPayload,
  CardPayment,
  CashPayment,
  ChequePayment,
  CNListRequestPayload,
  DeletePaymentPayload,
  EncirclePointsPayment,
  GiftCardTxnEnum,
  GVStatusListingPayload,
  LoadPaymentDetailsPayload,
  PaymentGroupEnum,
  PaymentPayload,
  PaymentStatusEnum,
  QCGC,
  QCGCGetBalancePayload,
  ROManualPayment,
  ROPayment,
  IntegratedPaymentRequestPayload,
  SubTransactionTypeEnum,
  TransactionTypeEnum,
  UniPayRequest,
  UpdateUnipayPaylaod,
  GiftVoucher,
  GHSeVoucher,
  UniPayPayment,
  EditCashPaymentPayload,
  WalletPayment,
  CreditNotePayment,
  BankLoanPayment,
  AirpayPayment,
  RtgsPayment,
  LoadMaxCashLimitPayload,
  PaymentModeEnum,
  ResendPaymentLinkPayload,
  ValidatePaymentPayload,
  PaymentDetails,
  CmRequestDetailsPayload,
  ThirdPartyCNRequestPayload,
  InvokeCNRequestPayload,
  GenerateOtpPayload,
  RazorPayPayment
} from '@poss-web/shared/models';
import * as moment from 'moment';

describe('Payment facade Testing Suite Facade  ', () => {
  let paymentFacade: PaymentFacade;

  let store: Store<PaymentState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), PaymentFacade]
    });

    paymentFacade = TestBed.inject(PaymentFacade);
    store = TestBed.inject(Store);
    spyOn(store, 'dispatch').and.returnValue({});
  });

  describe('Dispatch Actions  ', () => {
    it('should call loadCreditNoteList action  ', () => {
      const payload: CNListRequestPayload = {
        customerId: 344,
        isPageable: false,
        locationCode: 'URB'
      };

      const action = new GetCreditNoteList(payload);
      paymentFacade.loadCreditNoteList(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call GetThirdPartyCNList action  ', () => {
      const payload: ThirdPartyCNRequestPayload = {
        customerIds: ['123'],
        isPageable: false,
        locationCode: 'URB'
      };

      const action = new GetThirdPartyCNList(payload);
      paymentFacade.loadThirdPartyCnList(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call GetInvokedCreditNote action  ', () => {
      const payload: InvokeCNRequestPayload = {
        cnNumber: 123,
        fiscalYear: 2021,
        locationCode: 'URB'
      };

      const action = new GetInvokedCreditNote(payload);
      paymentFacade.loadInvokedCreditNote(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call GenerateOtpForCn action ', () => {
      const payload: GenerateOtpPayload = {
        id: 'TEST ID',
        otpType: 'NEW'
      };
      const action = new GenerateOtpForCn(payload);
      paymentFacade.loadIsOtpGenerated(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call ResetCreditNoteList action  ', () => {
      const action = new ResetCreditNoteList();
      paymentFacade.resetCreditNoteList();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LoadAllowedPayments action  ', () => {
      const payload = TransactionTypeEnum.CM;
      const action = new LoadAllowedPayments(payload);
      paymentFacade.loadAllowedPayments(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LoadPaymentDetails action  ', () => {
      const payload: LoadPaymentDetailsPayload = {
        transactionId: '123',
        transactionType: TransactionTypeEnum.CM,
        subTransactionType: SubTransactionTypeEnum.MANUAL_AB
      };
      const action = new LoadPaymentDetails(payload);
      paymentFacade.loadPaymentDetails(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LoadCreditNoteDetails action  ', () => {
      const payload: LoadPaymentDetailsPayload = {
        transactionId: '123',
        transactionType: TransactionTypeEnum.CM,
        subTransactionType: SubTransactionTypeEnum.MANUAL_AB
      };
      const action = new LoadCreditNoteDetails(payload);
      paymentFacade.loadCreditNoteDetails(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call ClearPaymentDetails action  ', () => {
      const action = new ClearPaymentDetails();
      paymentFacade.clearPaymentDetails();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call DeletePayment action  ', () => {
      const payload: DeletePaymentPayload = {
        paymentId: '123',
        transactionType: TransactionTypeEnum.CM,
        subTransactionType: SubTransactionTypeEnum.MANUAL_AB
      };
      const action = new DeletePayment(payload);
      paymentFacade.deletePayment(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call VoidUnipayPayment action  ', () => {
      const payload: UniPayRequest = {
        txnType: 12,
        txnMode: 1,
        txnId: 'ID',
        txnAmount: 100,
        date: null,
        BankInvoiceNumber: 123,
        transactionType: TransactionTypeEnum.CM,
        subTransactionType: SubTransactionTypeEnum.MANUAL_AB
      };
      const action = new VoidUnipayPayment(payload);
      paymentFacade.voidUnipayPayment(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call GetQCGCBalance action  ', () => {
      const payload: QCGCGetBalancePayload = {
        cardType: GiftCardTxnEnum.CM,
        cardNumber: '123',
        otpRequired: true
      };
      const action = new GetQCGCBalance(payload);
      paymentFacade.getQCGCBalance(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call GetGHSeVoucherBalance action  ', () => {
      const payload: QCGCGetBalancePayload = {
        cardType: GiftCardTxnEnum.CM,
        cardNumber: '123',
        otpRequired: true
      };
      const action = new GetGHSeVoucherBalance(payload);
      paymentFacade.getGHSeVoucherBalance(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call StartUnipayPayment action  ', () => {
      const payload: UniPayRequest = {
        txnType: 12,
        txnMode: 1,
        txnId: 'ID',
        txnAmount: 100,
        date: null,
        BankInvoiceNumber: 123,
        transactionType: TransactionTypeEnum.CM,
        subTransactionType: SubTransactionTypeEnum.MANUAL_AB
      };
      const action = new StartUnipayPayment(payload);
      paymentFacade.startUnipayPayment(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call UpdateUniPayPayment action  ', () => {
      const payload: UpdateUnipayPaylaod = {
        status: PaymentStatusEnum.COMPLETED,
        transactionId: '123',
        transactionType: TransactionTypeEnum.CM,
        subTransactionType: SubTransactionTypeEnum.MANUAL_CM,
        updateUnipayPlayload: null
      };
      const action = new UpdateUnipayPayment(payload);
      paymentFacade.updateUniPayPayment(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call ResetTrasactionID action  ', () => {
      const action = new ResetTrasactionID();
      paymentFacade.resetData();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call ResetFailedGV action  ', () => {
      const action = new ResetFailedGV();
      paymentFacade.resetFailedGV();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call AddChequeDDPayment action  ', () => {
      const payload: PaymentPayload = {
        transactionType: TransactionTypeEnum.CM,
        subTransactionType: SubTransactionTypeEnum.NEW_CM,
        transactionId: '122',
        paymentDetails: new ChequePayment(PaymentGroupEnum.REGULAR, {
          instrumentNo: '123',
          instrumentDate: null,
          amount: 1000,
          bankName: 'BANK'
        })
      };
      const action = new AddChequeDDPayment(payload);
      paymentFacade.addChequeDDPayment(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call AddCashPayment action  ', () => {
      const payload: PaymentPayload = {
        transactionType: TransactionTypeEnum.CM,
        subTransactionType: SubTransactionTypeEnum.NEW_CM,
        transactionId: '122',
        paymentDetails: new CashPayment(PaymentGroupEnum.REGULAR, {
          amount: 1000
        })
      };
      const action = new AddCashPayment(payload);
      paymentFacade.addCashPayment(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call AddCardPayment action  ', () => {
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
      paymentFacade.addCardPayment(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call AddROPayment action  ', () => {
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
      paymentFacade.addROPayment(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call AddROManualPayment action  ', () => {
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
      paymentFacade.addManualPayment(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call SendROPaymentRequest action  ', () => {
      const payload: IntegratedPaymentRequestPayload = {
        amount: 100,
        customerId: '22',
        paymentCode: 'RO',
        requestedReason: 'TEST'
      };

      const action = new SendPaymentRequest(payload);
      paymentFacade.sendIntegratedPaymentRequest(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call AddEncirclePointsPayment action  ', () => {
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
      paymentFacade.addEncirclePointsPayment(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LoadGVBalance action  ', () => {
      const payload: GVStatusListingPayload = {
        pageIndex: 10,
        pageSize: 12,
        serialNo: '10'
      };

      const action = new GetGVBalance(payload);
      paymentFacade.loadGVBalance(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call removeGV action  ', () => {
      const payload = '124';

      const action = new RemoveGV(payload);
      paymentFacade.removeGV(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call AddQCGCPayment action  ', () => {
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
      paymentFacade.addQCGCPayment(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call AddGVPayment action  ', () => {
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
      paymentFacade.addGVPayment(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call AddGHSeVoucherPayment action  ', () => {
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
      paymentFacade.addGHSeVoucherPayment(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call AddUnipayPayment action  ', () => {
      const payload: PaymentPayload = {
        transactionType: TransactionTypeEnum.CM,
        subTransactionType: SubTransactionTypeEnum.NEW_CM,
        transactionId: '122',
        paymentDetails: new UniPayPayment(PaymentGroupEnum.REGULAR, {
          amount: 1000
        })
      };

      const action = new AddUnipayPayment(payload);
      paymentFacade.addUnipayPayment(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call EditCashPayment action  ', () => {
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
      paymentFacade.editCashPayment(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call ResetQCGC action  ', () => {
      const action = new ResetQCGC();
      paymentFacade.resetQCGC();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call ResetCreditNoteList action  ', () => {
      const action = new ResetCreditNoteList();
      paymentFacade.resetCreditNoteList();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call ResetInvokedCreditNote action  ', () => {
      const action = new ResetInvokedCreditNote();
      paymentFacade.resetInvokedCreditNote();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call ResetGHSeVoucher action  ', () => {
      const action = new ResetGHSeVoucher();
      paymentFacade.resetGHSeVoucher();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call AddWalletPayment action  ', () => {
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
      paymentFacade.addWalletPayment(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call AddWalletPayment action  ', () => {
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
      paymentFacade.addWalletPayment(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call AddCreditNotePayment action  ', () => {
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
      paymentFacade.addCreditNotePayment(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call AddBankLoanPayment action  ', () => {
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
      paymentFacade.addBankLoanPayment(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call AddAirpayPayment action  ', () => {
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
      paymentFacade.addAirpayPayment(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call AddRtgsPayment action  ', () => {
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
      paymentFacade.addRtgsPayment(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LoadMaxCashLimit action  ', () => {
      const payload: LoadMaxCashLimitPayload = {
        transactionType: TransactionTypeEnum.CM,
        subTransactionType: SubTransactionTypeEnum.NEW_CM,
        customerId: '123',
        transactionId: '456',
        paymentCode: PaymentModeEnum.CASH,
        paymentGroup: PaymentGroupEnum.REGULAR
      };

      const action = new LoadMaxCashLimit(payload);
      paymentFacade.loadMaxCashLimit(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call ResetCashPaymentAmount action  ', () => {
      const payload = {
        paymentId: '123'
      };

      const action = new ResetCashPaymentAmount(payload);
      paymentFacade.resetCashPaymentAmount(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call loadUnipayHostConfiguration action  ', () => {
      const action = new UnipayHostConfiguration();
      paymentFacade.loadUnipayHostConfiguration();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call resetPayment action  ', () => {
      const action = new ResetPayment();
      paymentFacade.resetPayment();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call StartAirpayIntPayment action  ', () => {
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
      paymentFacade.startAirpayIntPayment(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call UpdateAirpayPayment action  ', () => {
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
      paymentFacade.updateintegratedPaymentRequest(
        payload.paymentDetails.paymentId
      );
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call ValidateAirpayPayment action  ', () => {
      const payload: ValidatePaymentPayload = {
        transactionType: TransactionTypeEnum.CM,
        subTransactionType: SubTransactionTypeEnum.NEW_CM,
        paymentId: '123'
      };

      const action = new ValidateIntPayment(payload.paymentId);
      paymentFacade.validateIntegratedPaymentRequest(payload.paymentId);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call validateEncirclePayment action  ', () => {
      const payload: ValidatePaymentPayload = {
        transactionType: TransactionTypeEnum.CM,
        subTransactionType: SubTransactionTypeEnum.NEW_CM,
        paymentId: '123'
      };

      const action = new ValidatePayment(payload);
      paymentFacade.validateEncirclePayment(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call loadAirpayOpenPayments action  ', () => {
      const payload: LoadPaymentDetailsPayload = {
        transactionType: TransactionTypeEnum.CM,
        subTransactionType: SubTransactionTypeEnum.NEW_CM,
        transactionId: '456'
      };

      const action = new LoadOpenAirpayPaymentDetails(payload);
      paymentFacade.loadAirpayOpenPayments(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call updateAirpayPaymentStatus action  ', () => {
      const payload: PaymentDetails = {
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

      const action = new UpdateAirpayIntPaymentStatus(payload);
      paymentFacade.updateAirpayPaymentStatus(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call confirmPayment action  ', () => {
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
      paymentFacade.confirmPayment(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LoadRSOList action  ', () => {
      const action = new LoadRSOList();
      paymentFacade.loadRSOList();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LoadROPaymentRequestStatus action  ', () => {
      const payload = 'test';
      const action = new LoadROPaymentRequestStatus(payload);
      paymentFacade.loadROPaymentRequestStatus(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call loadEncireclePoints action  ', () => {
      const payload = 'test';
      const action = new LoadEncireclePoints(payload);
      paymentFacade.loadEncireclePoints(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call loadCMPaymentDetails action  ', () => {
      const payload: CmRequestDetailsPayload = {
        processId: 'IND124',
        taskId: '123',
        taskName: 'CM',
        workFlowType: 'Manual',
        userType: true
      };
      const action = new LoadCMRequestPaymentDetails(payload);
      paymentFacade.loadCMPaymentDetails(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call StartRazorpayPayment action  ', () => {
      const payload: PaymentPayload = {
        transactionType: TransactionTypeEnum.CM,
        subTransactionType: SubTransactionTypeEnum.NEW_CM,
        transactionId: '122',
        paymentDetails: new RazorPayPayment(PaymentGroupEnum.REGULAR, {
          instrumentDate: moment(),
          amount: 1000,
          reference1: '353',
          reference2: 'SSGG',
          reference3: '',
          otherDetails: null
        })
      };

      const action = new StartRazorpayPayment(payload);
      paymentFacade.startRazorpayPayment(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call UpdateRazorpayPayment action  ', () => {
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
      paymentFacade.updateRazorpayPayment(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call ValidateRazorpayPayment action  ', () => {
      const payload: ValidatePaymentPayload = {
        transactionType: TransactionTypeEnum.CM,
        subTransactionType: SubTransactionTypeEnum.NEW_CM,
        paymentId: '123'
      };

      const action = new ValidateRazorpayPayment(payload);
      paymentFacade.validateRazorpayPayment(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call updateRazorpayPaymentStatus action  ', () => {
      const payload: PaymentDetails = {
        amount: 100,
        id: 'WQ1223',
        paymentCode: PaymentModeEnum.RAZOR_PAY,
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

      const action = new UpdateRazorpayPaymentStatus(payload);
      paymentFacade.updateRazorpayPaymentStatus(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
  });

  describe('Access Selector selector ', () => {
    it('should access credit Note List selector selector ', () => {
      expect(paymentFacade.getCreditNoteList()).toEqual(
        paymentFacade['creditNoteList$']
      );
    });

    it('should access Otp Generated For Cn selector selector ', () => {
      expect(paymentFacade.getGeneratedOtpForCn()).toEqual(
        paymentFacade['isOtpGeneratedForCn$']
      );
    });

    it('should access encircle points selector selector ', () => {
      expect(paymentFacade.getEncirclePoints()).toEqual(
        paymentFacade['encirclePoints$']
      );
    });

    it('should access failed GV selector ', () => {
      expect(paymentFacade.failedGV()).toEqual(paymentFacade['failedGV$']);
    });

    it('should access credit Note Details selector ', () => {
      expect(paymentFacade.getCNDetails()).toEqual(
        paymentFacade['creditNoteDetails$']
      );
    });

    it('should access is Cheque Added selector ', () => {
      expect(paymentFacade.getIsChequeAdded()).toEqual(
        paymentFacade['isChequeAdded$']
      );
    });

    it('should access is DD Added selector ', () => {
      expect(paymentFacade.getIsDDAdded()).toEqual(paymentFacade['isDDAdded$']);
    });

    it('should access isCreditNoteAdded selector ', () => {
      expect(paymentFacade.getIsCreditNoteAdded()).toEqual(
        paymentFacade['isCreditNoteAdded$']
      );
    });

    it('should access ro Payment Status selector ', () => {
      expect(paymentFacade.getIntegratedPaymentRequestStatus()).toEqual(
        paymentFacade['paymentRequestStatus$']
      );
    });

    it('should access  rso List selector ', () => {
      expect(paymentFacade.getRsoList()).toEqual(paymentFacade['rsoList$']);
    });

    it('should access error selector ', () => {
      expect(paymentFacade.getError()).toEqual(paymentFacade['error$']);
    });

    it('should access isLoading  selector ', () => {
      expect(paymentFacade.getIsLoading()).toEqual(paymentFacade['isLoading$']);
    });

    it('should access Cheque DD Payment Success selector ', () => {
      expect(paymentFacade.getIsChequeDDPaymentSuccess()).toEqual(
        paymentFacade['isChequeDDPaymentSuccess$']
      );
    });

    it('should access allowed Payments selector ', () => {
      expect(paymentFacade.getAllowedPayments()).toEqual(
        paymentFacade['allowedPayments$']
      );
    });

    it('should access dd PayerBanks selector ', () => {
      expect(paymentFacade.getDDPayerBanks()).toEqual(
        paymentFacade['ddPayerBanks$']
      );
    });

    it('should access Currrent Confirmed Payment selector ', () => {
      expect(paymentFacade.getCurrentConfirmedPayment()).toEqual(
        paymentFacade['selectCurrrentConfirmedPayment$']
      );
    });

    it('should access cheque PayerBanks selector ', () => {
      expect(paymentFacade.getChequePayerBanks()).toEqual(
        paymentFacade['chequePayerBanks$']
      );
    });

    it('should access card Config selector ', () => {
      expect(paymentFacade.getCardConfig()).toEqual(
        paymentFacade['cardConfig$']
      );
    });

    it('should access wallets selector ', () => {
      expect(paymentFacade.getWallets()).toEqual(paymentFacade['wallets$']);
    });

    it('should access sub Bank Loans selector ', () => {
      expect(paymentFacade.getSubBankLoans()).toEqual(
        paymentFacade['subBankLoans$']
      );
    });

    it('should access payment Field Names selector ', () => {
      expect(paymentFacade.getPaymentFieldNames()).toEqual(
        paymentFacade['paymentFieldNames$']
      );
    });

    it('should access  MaxCash Limit selector ', () => {
      expect(paymentFacade.getMaxCashLimit()).toEqual(
        paymentFacade['selectMaxCashLimit$']
      );
    });

    it('should access customer Specific Payments selector ', () => {
      expect(paymentFacade.getCustomerSpecificPayments()).toEqual(
        paymentFacade['customerSpecificPayments$']
      );
    });

    it('should access customer Specific Wallet Payments selector ', () => {
      expect(paymentFacade.getCustomerSpecificWalletPayments()).toEqual(
        paymentFacade['customerSpecificWalletPayments$']
      );
    });

    it('should access customer Specific Bank Loan Payments selector ', () => {
      expect(paymentFacade.getCustomerSpecificBankLoanPayments()).toEqual(
        paymentFacade['customerSpecificBankLoanPayments$']
      );
    });

    it('should access unipay transaction Id selector ', () => {
      expect(paymentFacade.getUnipayTransactionID()).toEqual(
        paymentFacade['unipaytransactionId$']
      );
    });

    it('should access Unipay Response Detials selector ', () => {
      expect(paymentFacade.getUnipayResponse()).toEqual(
        paymentFacade['getUnipayResponseDetials$']
      );
    });

    it('should access Unipay Void Response Detials selector ', () => {
      expect(paymentFacade.getUnipayVoidResponse()).toEqual(
        paymentFacade['getUnipayVoidResponseDetials$']
      );
    });

    it('should access payee banks selector ', () => {
      expect(paymentFacade.getPayeeBanks()).toEqual(
        paymentFacade['payeeBanks$']
      );
    });

    it('should access QCGC Details selector ', () => {
      expect(paymentFacade.getQCGCBalanceDetails()).toEqual(
        paymentFacade['getQCGCDetails$']
      );
    });

    it('should access  GV Details selector ', () => {
      expect(paymentFacade.getGVBalanceDetails()).toEqual(
        paymentFacade['getGVDetails$']
      );
    });

    it('should access GHS eVoucher Details selector ', () => {
      expect(paymentFacade.getGHSeVoucherBalanceDetails()).toEqual(
        paymentFacade['getGHSeVoucherDetails$']
      );
    });

    it('should access payment details selector ', () => {
      expect(paymentFacade.getPaymentDetails()).toEqual(
        paymentFacade['paymentDetails$']
      );
    });

    it('should access load Max Cash Limit selector ', () => {
      expect(paymentFacade.getLoadMaxCashLimit()).toEqual(
        paymentFacade['loadMaxCashLimit$']
      );
    });

    it('should access total paid amount selector ', () => {
      expect(paymentFacade.getTotalPaidAmount()).toEqual(
        paymentFacade['totalPaidAmount$']
      );
    });

    it('should access is Unipay Enabled selector ', () => {
      expect(paymentFacade.getIsHostConfigEnabled()).toEqual(
        paymentFacade['isUnipayEnabled$']
      );
    });

    it('should access has Customer Specific Payments selector ', () => {
      expect(paymentFacade.getHasCustomerSpecificPayments()).toEqual(
        paymentFacade['hasCustomerSpecificPayments$']
      );
    });

    it('should access is Encircle Payment Added selector ', () => {
      expect(paymentFacade.getIsEncirclePaymentAdded()).toEqual(
        paymentFacade['isEncirclePaymentAdded$']
      );
    });

    it('should access Airpay Send Link Response selector ', () => {
      expect(paymentFacade.getAirpaySendLinkResponse()).toEqual(
        paymentFacade['getAirpaySendLinkResponse$']
      );
    });

    it('should access Airpay Open Payments selector ', () => {
      expect(paymentFacade.getAirpayOpenPayementDetails()).toEqual(
        paymentFacade['getAirpayOpenPayments$']
      );
    });

    it('should access credit note list selector ', () => {
      expect(paymentFacade.getCreditNoteList()).toEqual(
        paymentFacade['creditNoteList$']
      );
    });

    it('should access third party CN list selector ', () => {
      expect(paymentFacade.getThirdPartyCnList()).toEqual(
        paymentFacade['thirdPartyCNList$']
      );
    });

    it('should access invoked credit note selector ', () => {
      expect(paymentFacade.getInvokedCreditNote()).toEqual(
        paymentFacade['invokedCreditNote$']
      );
    });

    it('should access ro Payment Request selector ', () => {
      expect(paymentFacade.getRoPaymentRequest()).toEqual(
        paymentFacade['roPaymentRequest$']
      );
    });
    it('should access Razorpay Send Link Response selector ', () => {
      expect(paymentFacade.getRazorpaySendLinkResponse()).toEqual(
        paymentFacade['getRazorSendLinkResponse$']
      );
    });
  });
});
