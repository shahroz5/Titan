import {
  CNListResponse,
  CNListResponsePayload,
  CustomErrors,
  GvStatusList,
  OtherDetailsForUnipay,
  PaymentDetails,
  PaymentGroupEnum,
  PaymentModeEnum,
  PaymentPayload,
  StoreUser,
  SubTransactionTypeEnum,
  TransactionTypeEnum,
  UniPayPayment,
  UnipayTransactionDetails
} from '@poss-web/shared/models';
import * as moment from 'moment';
import { gvAdapter, paymentDetailsAdapter } from './payment.entity';
import { initialState } from './payment.reducer';
import { PaymentSelectors } from './payment.selectors';
import { PaymentState } from './payment.state';

describe('Testing Payment related Selectors', () => {
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

  const gvStatusList: GvStatusList[] = [
    {
      serialNo: 1111,
      newlyAdded: true,
      giftCode: 'Code',
      regionCode: 'Region',
      denomination: 2,
      quantity: 2,
      totalValue: 100,
      status: 'NEW',
      mfgDate: 2021,
      locationCode: 1,
      validityDays: 10,
      activationDate: 21,
      validFrom: null,
      validTill: null,
      giftDetails: null,
      remarks: 'A',
      excludes: [],
      indentNo: 1,
      extendCount: 2
    }
  ];

  const paymentDetails: PaymentDetails = {
    amount: 100,
    id: 'WQ1223',
    paymentCode: PaymentModeEnum.CASH,
    paymentGroup: PaymentGroupEnum.REGULAR,
    instrumentDate: moment(),
    instrumentNo: '123',
    instrumentType: 'TYPE',
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

  const walletPaymentDetails: PaymentDetails = {
    amount: 100,
    id: 'WQ1223',
    paymentCode: PaymentModeEnum.WALLET,
    paymentGroup: PaymentGroupEnum.REGULAR,
    instrumentDate: moment(),
    instrumentNo: 'PHONEPE',
    instrumentType: 'PHONEPE',
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

  const bankLoanPaymentDetails: PaymentDetails = {
    amount: 100,
    id: 'WQ1223',
    paymentCode: PaymentModeEnum.BANK_LOAN,
    paymentGroup: PaymentGroupEnum.REGULAR,
    instrumentDate: moment(),
    instrumentNo: 'BANK LOAN 1',
    instrumentType: 'BANK LOAN 1',
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

  const encireclePaymentDetails: PaymentDetails = {
    amount: 100,
    id: 'WQ1223',
    paymentCode: PaymentModeEnum.ENCIRCLE,
    paymentGroup: PaymentGroupEnum.REGULAR,
    instrumentDate: moment(),
    instrumentNo: '123',
    instrumentType: 'TYPE',
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

  const airpayPaymentDetails: PaymentDetails = {
    amount: 100,
    id: 'WQ1223',
    paymentCode: PaymentModeEnum.AIRPAY,
    paymentGroup: PaymentGroupEnum.REGULAR,
    instrumentDate: moment(),
    instrumentNo: '123',
    instrumentType: 'TYPE',
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
  const razorpayPaymentDetails: PaymentDetails = {
    amount: 100,
    id: 'WQ1223',
    paymentCode: PaymentModeEnum.AIRPAY,
    paymentGroup: PaymentGroupEnum.REGULAR,
    instrumentDate: moment(),
    instrumentNo: '123',
    instrumentType: 'TYPE',
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

  const ddPaymentDetails: PaymentDetails = {
    amount: 100,
    id: 'WQ1223',
    paymentCode: PaymentModeEnum.DD,
    paymentGroup: PaymentGroupEnum.REGULAR,
    instrumentDate: moment(),
    instrumentNo: '123',
    instrumentType: 'TYPE',
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

  const chequePaymentDetails: PaymentDetails = {
    amount: 100,
    id: 'WQ1223',
    paymentCode: PaymentModeEnum.CHEQUE,
    paymentGroup: PaymentGroupEnum.REGULAR,
    instrumentDate: moment(),
    instrumentNo: '123',
    instrumentType: 'TYPE',
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

  const cashPaymentDetails: PaymentDetails = {
    amount: 100,
    id: 'WQ1223',
    paymentCode: PaymentModeEnum.CASH,
    paymentGroup: PaymentGroupEnum.REGULAR,
    instrumentDate: moment(),
    instrumentNo: '123',
    instrumentType: 'CASH',
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

  const cnPaymentDetails: PaymentDetails = {
    amount: 100,
    id: 'WQ1223',
    paymentCode: PaymentModeEnum.CREDIT_NOTE,
    paymentGroup: PaymentGroupEnum.REGULAR,
    instrumentDate: moment(),
    instrumentNo: '123',
    instrumentType: 'TYPE',
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

  it('Should return the error', () => {
    const error: CustomErrors = {
      code: 'ERR_1',
      message: 'Error',
      traceId: 'TraceID',
      timeStamp: '122131',
      error: null
    };
    const state: PaymentState = {
      ...initialState,
      error: error
    };
    expect(PaymentSelectors.selectError.projector(state)).toEqual(error);
  });

  it('Should return enable status of Unipay', () => {
    const isEnabled = ['true'];
    const state: PaymentState = {
      ...initialState,
      enableUnipay: isEnabled
    };
    expect(PaymentSelectors.selectUnipayEnabled.projector(state)).toEqual(
      isEnabled
    );
  });

  it('Should return loading status ', () => {
    const isLoading = true;
    const state: PaymentState = {
      ...initialState,
      isLoading: isLoading
    };
    expect(PaymentSelectors.selectIsLoading.projector(state)).toEqual(
      isLoading
    );
  });

  it('Should return success status of cheque/dd payment ', () => {
    const isSucess = true;
    const state: PaymentState = {
      ...initialState,
      isChequeDDPaymentSuccess: isSucess
    };
    expect(
      PaymentSelectors.selectIsChequeDDPaymentSuccess.projector(state)
    ).toEqual(isSucess);
  });

  it('Should return encircle Points from state ', () => {
    const encirclePoints = 10;
    const state: PaymentState = {
      ...initialState,
      encirclePoints: encirclePoints
    };
    expect(PaymentSelectors.selectEncirclePoints.projector(state)).toEqual(
      encirclePoints
    );
  });

  it('Should return max cash limit ', () => {
    const maxCashLimit = 1234;
    const state: PaymentState = {
      ...initialState,
      maxCashLimit: maxCashLimit
    };
    expect(PaymentSelectors.selectMaxCashLimit.projector(state)).toEqual(
      maxCashLimit
    );
  });

  it('Should return confirmed payment details ', () => {
    const state: PaymentState = {
      ...initialState,
      currentConfirmedPayment: paymentDetails
    };
    expect(PaymentSelectors.selectConfirmedPayment.projector(state)).toEqual(
      paymentDetails
    );
  });

  it('Should return list of allowed payments ', () => {
    const allowedPayments = new Map<PaymentModeEnum, PaymentGroupEnum>().set(
      PaymentModeEnum.CASH,
      PaymentGroupEnum.REGULAR
    );
    const state: PaymentState = {
      ...initialState,
      allowedPayments: allowedPayments
    };
    expect(PaymentSelectors.selectAllowedPayments.projector(state)).toEqual(
      allowedPayments
    );
  });

  it('Should return list of banks for DD payment', () => {
    const ddPayerBanks = ['BANK  1', 'BANK  2'];
    const state: PaymentState = {
      ...initialState,
      ddPayerBanks: ddPayerBanks
    };
    expect(PaymentSelectors.selectDDPayerBanks.projector(state)).toEqual(
      ddPayerBanks
    );
  });

  it('Should return list of banks for Cheque payment', () => {
    const chequePayerBanks = ['BANK  1', 'BANK  2'];
    const state: PaymentState = {
      ...initialState,
      chequePayerBanks: chequePayerBanks
    };
    expect(PaymentSelectors.selectChequePayerBanks.projector(state)).toEqual(
      chequePayerBanks
    );
  });

  it('Should return list of banks for Cheque payment', () => {
    const chequePayerBanks = ['BANK  1', 'BANK  2'];
    const state: PaymentState = {
      ...initialState,
      chequePayerBanks: chequePayerBanks
    };
    expect(PaymentSelectors.selectChequePayerBanks.projector(state)).toEqual(
      chequePayerBanks
    );
  });

  it('Should return card config', () => {
    const cardConfig = {
      payerBanks: ['ICICI', 'HDFC'],
      cardType: ['CC', 'DC'],
      isBankMandatory: null,
      isCardTypeMandatory: null
    };
    const state: PaymentState = {
      ...initialState,
      cardConfig: cardConfig
    };
    expect(PaymentSelectors.selectCardConfig.projector(state)).toEqual(
      cardConfig
    );
  });

  it('Should return list of Wallets', () => {
    const wallets = ['Wallets 1', 'Wallets 2'];
    const state: PaymentState = {
      ...initialState,
      wallets: wallets
    };
    expect(PaymentSelectors.selectWallets.projector(state)).toEqual(wallets);
  });

  it('Should return list of Sub Bank for loan', () => {
    const subBankLoans = ['BANK  1', 'BANK  2'];
    const state: PaymentState = {
      ...initialState,
      subBankLoans: subBankLoans
    };
    expect(PaymentSelectors.selectSubBankLoans.projector(state)).toEqual(
      subBankLoans
    );
  });

  it('Should return PaymentFieldNames', () => {
    const paymentFieldNames = ['Field 1', 'Field 2'];
    const state: PaymentState = {
      ...initialState,
      paymentFieldNames: paymentFieldNames
    };
    expect(PaymentSelectors.selectPaymentFieldNames.projector(state)).toEqual(
      paymentFieldNames
    );
  });

  it('Should return Credit Note Details', () => {
    const cnDetails: CNListResponsePayload[] = [
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
    const state: PaymentState = {
      ...initialState,
      cnDetails: cnDetails
    };
    expect(PaymentSelectors.selectCNDetails.projector(state)).toEqual(
      cnDetails
    );
  });

  it('Should return list of payeebanks', () => {
    const payeeBanks = ['BANK  1', 'BANK  2'];
    const state: PaymentState = {
      ...initialState,
      payeeBanks: payeeBanks
    };
    expect(PaymentSelectors.selectPayeeBanks.projector(state)).toEqual(
      payeeBanks
    );
  });

  it('Should return payments entity', () => {
    const paymentDetailsData = [paymentDetails];
    const paymentDetailsDataEntity = paymentDetailsAdapter.setAll(
      paymentDetailsData,
      {
        ...paymentDetailsAdapter.getInitialState()
      }
    );
    const state: PaymentState = {
      ...initialState,
      paymentDetails: paymentDetailsDataEntity
    };

    expect(PaymentSelectors.paymentDetails.projector(state)).toEqual(
      paymentDetailsDataEntity
    );
  });

  it('Should return list of payments done', () => {
    const paymentDetailsData = [paymentDetails];
    const paymentDetailsDataEntity = paymentDetailsAdapter.setAll(
      paymentDetailsData,
      {
        ...paymentDetailsAdapter.getInitialState()
      }
    );

    expect(
      PaymentSelectors.selectPaymentDetails.projector(paymentDetailsDataEntity)
    ).toEqual(paymentDetailsData);
  });

  it('Should return total amount paid', () => {
    const paymentDetailsData = [paymentDetails];
    const totalAmountPaid = paymentDetailsData
      .map(payment => payment.amount)
      .reduce((amount1, amount2) => amount1 + amount2, 0);

    expect(
      PaymentSelectors.selectTotalPaidAmount.projector(paymentDetailsData)
    ).toEqual(totalAmountPaid);
  });

  it('Should return  true if Encirecle payment is added', () => {
    const isAdded = true;
    const paymentDetailsData = [encireclePaymentDetails];

    expect(
      PaymentSelectors.selectIsEncirclePaymentAdded.projector(
        paymentDetailsData
      )
    ).toEqual(isAdded);
  });

  it('Should return  false if Encirecle payment is not added', () => {
    const isAdded = false;
    const paymentDetailsData = [paymentDetails];

    expect(
      PaymentSelectors.selectIsEncirclePaymentAdded.projector(
        paymentDetailsData
      )
    ).toEqual(isAdded);
  });

  it('Should return  true if DD payment is added', () => {
    const isAdded = true;
    const paymentDetailsData = [ddPaymentDetails];

    expect(
      PaymentSelectors.selectIsDDAdded.projector(paymentDetailsData)
    ).toEqual(isAdded);
  });

  it('Should return  false if DD payment is not added', () => {
    const isAdded = false;
    const paymentDetailsData = [paymentDetails];

    expect(
      PaymentSelectors.selectIsDDAdded.projector(paymentDetailsData)
    ).toEqual(isAdded);
  });

  it('Should return  true if Cheque payment is added', () => {
    const isAdded = true;
    const paymentDetailsData = [chequePaymentDetails];

    expect(
      PaymentSelectors.selectIsChequeAdded.projector(paymentDetailsData)
    ).toEqual(isAdded);
  });

  it('Should return  false if Cheque payment is not added', () => {
    const isAdded = false;
    const paymentDetailsData = [paymentDetails];

    expect(
      PaymentSelectors.selectIsChequeAdded.projector(paymentDetailsData)
    ).toEqual(isAdded);
  });

  it('Should return  true if CN payment is added', () => {
    const isAdded = true;
    const paymentDetailsData = [cnPaymentDetails];

    expect(
      PaymentSelectors.selectIsCreditNoteAdded.projector(paymentDetailsData)
    ).toEqual(isAdded);
  });

  it('Should return  false if CN payment is not added', () => {
    const isAdded = false;
    const paymentDetailsData = [paymentDetails];

    expect(
      PaymentSelectors.selectIsCreditNoteAdded.projector(paymentDetailsData)
    ).toEqual(isAdded);
  });

  it('Should return  true if Customer Specific Payments are added', () => {
    const isAdded = true;
    let paymentDetailsData = [cashPaymentDetails];
    const customerSpecificPayments = [PaymentModeEnum.CASH];

    expect(
      PaymentSelectors.selectHasCustomerSpecificPayments.projector(
        paymentDetailsData,
        customerSpecificPayments,
        [],
        []
      )
    ).toEqual(isAdded);

    paymentDetailsData = [walletPaymentDetails];
    const customerSpecificWalletPayments = ['PHONEPE'];

    expect(
      PaymentSelectors.selectHasCustomerSpecificPayments.projector(
        paymentDetailsData,
        [],
        customerSpecificWalletPayments,
        []
      )
    ).toEqual(isAdded);

    paymentDetailsData = [bankLoanPaymentDetails];
    const customerSpecificBankLoanPayments = ['BANK LOAN 1'];

    expect(
      PaymentSelectors.selectHasCustomerSpecificPayments.projector(
        paymentDetailsData,
        [],
        [],
        customerSpecificBankLoanPayments
      )
    ).toEqual(isAdded);
  });

  it('Should return  false if if Customer Specific Payments are not added', () => {
    const isAdded = false;
    const paymentDetailsData = [ddPaymentDetails];
    const customerSpecificPayments = [PaymentModeEnum.CASH];

    expect(
      PaymentSelectors.selectHasCustomerSpecificPayments.projector(
        paymentDetailsData,
        customerSpecificPayments,
        [],
        []
      )
    ).toEqual(isAdded);
  });

  it('Should return status to load max cash limit ', () => {
    const load = { load: true };
    const state: PaymentState = {
      ...initialState,
      loadMaxCashLimit: load
    };
    expect(PaymentSelectors.selectLoadMaxCashLimit.projector(state)).toEqual(
      load
    );
  });

  it('Should return customer specific payments ', () => {
    const customerSpecificPayments = [PaymentModeEnum.CASH];

    const state: PaymentState = {
      ...initialState,
      customerSpecificPayments: customerSpecificPayments
    };
    expect(
      PaymentSelectors.selectCustomerSpecificPayments.projector(state)
    ).toEqual(customerSpecificPayments);
  });

  it('Should return customer specific Bank loan payments ', () => {
    const customerSpecificBankLoanPayments = ['BANK LOAN 1'];

    const state: PaymentState = {
      ...initialState,
      customerSpecificBankLoanPayments: customerSpecificBankLoanPayments
    };
    expect(
      PaymentSelectors.selectcustomerSpecificBankLoanPayments.projector(state)
    ).toEqual(customerSpecificBankLoanPayments);
  });

  it('Should return customer specific wallet payments ', () => {
    const customerSpecificWalletPayments = ['PHONEPE'];

    const state: PaymentState = {
      ...initialState,
      customerSpecificWalletPayments: customerSpecificWalletPayments
    };
    expect(
      PaymentSelectors.selectCustomerSpecificWalletPayments.projector(state)
    ).toEqual(customerSpecificWalletPayments);
  });

  it('Should return RO payment status ', () => {
    const roPaymentStatus = { isSuccess: true, transactionId: 'ID' };

    const state: PaymentState = {
      ...initialState,
      roPaymentStatus: roPaymentStatus
    };
    expect(PaymentSelectors.selectPaymentStatus.projector(state)).toEqual(
      roPaymentStatus
    );
  });

  it('Should return List of RSO ', () => {
    const rsoList: StoreUser[] = [
      {
        empName: 'NAME',
        employeeCode: 'CODE',
        mobileNo: '990099009',
        locationCode: 'CPD',
        isLoginActive: false
      }
    ];

    const state: PaymentState = {
      ...initialState,
      rsoList: rsoList
    };
    expect(PaymentSelectors.selectRsoList.projector(state)).toEqual(rsoList);
  });

  it('Should return third party credit note list ', () => {
    const thirdPartyCnList = cnTypeList;
    const state: PaymentState = {
      ...initialState,
      thirdPartyCnList: thirdPartyCnList
    };
    expect(PaymentSelectors.selectThirdPartyCnList.projector(state)).toEqual(
      thirdPartyCnList
    );
  });

  it('Should return invoked credit note  ', () => {
    const invokedCN = cnTypeList;
    const state: PaymentState = {
      ...initialState,
      invokedCN: invokedCN
    };
    expect(PaymentSelectors.selectInvokedCreditNote.projector(state)).toEqual(
      invokedCN
    );
  });

  it('Should return Unipay Transaction ', () => {
    const unipayTransactionDetails: UnipayTransactionDetails = {
      id: 'ID',
      amount: 100
    };
    const state: PaymentState = {
      ...initialState,
      unipayTransactionDetails: unipayTransactionDetails
    };
    expect(PaymentSelectors.getUnipayTransactionId.projector(state)).toEqual(
      unipayTransactionDetails
    );
  });

  it('Should return Unipay Transaction ', () => {
    const unipayPaymentDetails: OtherDetailsForUnipay = {
      url: 'URL',
      request: 'request',
      response: 'response',
      httpStatus: 200,
      transactionStatus: true,
      cardNumber: '123',
      referenceNumber: 'REF 1'
    };
    const state: PaymentState = {
      ...initialState,
      unipayPaymentDetails: unipayPaymentDetails
    };
    expect(PaymentSelectors.getUnipayResponse.projector(state)).toEqual(
      unipayPaymentDetails
    );
  });

  it('Should return failed GV Status', () => {
    const failedGV: PaymentPayload[] = [
      {
        transactionType: TransactionTypeEnum.CM,
        subTransactionType: SubTransactionTypeEnum.NEW_CM,
        transactionId: '122',
        paymentDetails: new UniPayPayment(PaymentGroupEnum.REGULAR, {
          amount: 1000
        })
      }
    ];
    const state: PaymentState = {
      ...initialState,
      failedGV: failedGV
    };
    expect(PaymentSelectors.getFailedGV.projector(state)).toEqual(failedGV);
  });

  it('Should return Unipay Transaction ', () => {
    const unipayVoidPaymentDetails = {
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
    const state: PaymentState = {
      ...initialState,
      unipayVoidPaymentDetails: unipayVoidPaymentDetails
    };
    expect(PaymentSelectors.getUnipayVoidResponse.projector(state)).toEqual(
      unipayVoidPaymentDetails
    );
  });

  it('Should return QCGC Details', () => {
    const QCGCDetails = {
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
    const state: PaymentState = {
      ...initialState,
      QCGCDetails: QCGCDetails
    };
    expect(PaymentSelectors.getQCGCBalance.projector(state)).toEqual(
      QCGCDetails
    );
  });

  it('Should return RO Payment Request', () => {
    const roPaymentRequest = {
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
    const state: PaymentState = {
      ...initialState,
      roPaymentRequest: roPaymentRequest
    };
    expect(PaymentSelectors.selectRoPaymentRequest.projector(state)).toEqual(
      roPaymentRequest
    );
  });

  it('Should return Status of OTP Generated', () => {
    const isCnOtpGenerated = true;
    const state: PaymentState = {
      ...initialState,
      isCnOtpGenerated: isCnOtpGenerated
    };
    expect(PaymentSelectors.selectIsOtpGenerated.projector(state)).toEqual(
      isCnOtpGenerated
    );
  });

  it('Should return payments entity', () => {
    const paymentDetailsData = [paymentDetails];
    const paymentDetailsDataEntity = paymentDetailsAdapter.setAll(
      paymentDetailsData,
      {
        ...paymentDetailsAdapter.getInitialState()
      }
    );
    const state: PaymentState = {
      ...initialState,
      paymentDetails: paymentDetailsDataEntity
    };

    expect(PaymentSelectors.paymentDetails.projector(state)).toEqual(
      paymentDetailsDataEntity
    );
  });

  it('Should return Airpay Response Entity', () => {
    const airpaySendLinkResponse = [airpayPaymentDetails];

    const airpaySendLinkResponseEntity = paymentDetailsAdapter.setAll(
      airpaySendLinkResponse,
      {
        ...paymentDetailsAdapter.getInitialState()
      }
    );
    const state: PaymentState = {
      ...initialState,
      airpaySendLinkResponse: airpaySendLinkResponseEntity
    };

    expect(PaymentSelectors.airpaySendLinkResponse.projector(state)).toEqual(
      airpaySendLinkResponseEntity
    );
  });

  it('Should return Airpay Response ', () => {
    const airpaySendLinkResponse = [airpayPaymentDetails];

    const airpaySendLinkResponseEntity = paymentDetailsAdapter.setAll(
      airpaySendLinkResponse,
      {
        ...paymentDetailsAdapter.getInitialState()
      }
    );

    expect(
      PaymentSelectors.selectAirpaySendLinkResponse.projector(
        airpaySendLinkResponseEntity
      )
    ).toEqual(airpaySendLinkResponse);
  });

  it('Should return Open Airpay payment Entity', () => {
    const airpayOpenPayments = [airpayPaymentDetails];

    const airpayOpenPaymentsEntity = paymentDetailsAdapter.setAll(
      airpayOpenPayments,
      {
        ...paymentDetailsAdapter.getInitialState()
      }
    );
    const state: PaymentState = {
      ...initialState,
      airpayOpenPaymentsDetails: airpayOpenPaymentsEntity
    };

    expect(PaymentSelectors.openAirpayPaymentDetails.projector(state)).toEqual(
      airpayOpenPaymentsEntity
    );
  });

  it('Should return  Open Airpay payment ', () => {
    const airpayOpenPayments = [airpayPaymentDetails];

    const airpayOpenPaymentsEntity = paymentDetailsAdapter.setAll(
      airpayOpenPayments,
      {
        ...paymentDetailsAdapter.getInitialState()
      }
    );

    expect(
      PaymentSelectors.selectOpenAirpayPaymentDetails.projector(
        airpayOpenPaymentsEntity
      )
    ).toEqual(airpayOpenPayments);
  });

  it('Should return GV Balance List  Entity', () => {
    const gvBalanceList = gvStatusList;

    const gvBalanceListEntity = gvAdapter.setAll(gvBalanceList, {
      ...gvAdapter.getInitialState()
    });
    const state: PaymentState = {
      ...initialState,
      GVDetails: gvBalanceListEntity
    };

    expect(PaymentSelectors.getGVBalanceList.projector(state)).toEqual(
      gvBalanceListEntity
    );
  });

  it('Should return  GV Balance List ', () => {
    const gvBalanceList = gvStatusList;

    const gvBalanceListEntity = gvAdapter.setAll(gvBalanceList, {
      ...gvAdapter.getInitialState()
    });

    expect(
      PaymentSelectors.getGVBalance.projector(gvBalanceListEntity)
    ).toEqual(gvBalanceList);
  });

  it('Should return GHS eVoucher Balance', () => {
    const GHSeVoucherDetails = {
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
    const state: PaymentState = {
      ...initialState,
      GHSeVoucherDetails: GHSeVoucherDetails
    };
    expect(PaymentSelectors.getGHSeVoucherBalance.projector(state)).toEqual(
      GHSeVoucherDetails
    );
  });

  it('Should return  credit note list ', () => {
    const state: PaymentState = {
      ...initialState,
      creditNoteList: cnTypeList
    };
    expect(PaymentSelectors.selectCnList.projector(state)).toEqual(cnTypeList);
  });
  it('Should return Razorpay Response Entity', () => {
    const razorpaySendLinkResponse = [razorpayPaymentDetails];

    const razorpaySendLinkResponseEntity = paymentDetailsAdapter.setAll(
      razorpaySendLinkResponse,
      {
        ...paymentDetailsAdapter.getInitialState()
      }
    );
    const state: PaymentState = {
      ...initialState,
      razorpaySendLinkResponse: razorpaySendLinkResponseEntity
    };

    expect(PaymentSelectors.razorpaySendLinkResponse.projector(state)).toEqual(
      razorpaySendLinkResponseEntity
    );
  });

  it('Should return Razorpay Response ', () => {
    const razorpaySendLinkResponse = [razorpayPaymentDetails];

    const razorpaySendLinkResponseEntity = paymentDetailsAdapter.setAll(
      razorpaySendLinkResponse,
      {
        ...paymentDetailsAdapter.getInitialState()
      }
    );

    expect(
      PaymentSelectors.selectRazorpaySendLinkResponse.projector(
        razorpaySendLinkResponseEntity
      )
    ).toEqual(razorpaySendLinkResponse);
  });
});
