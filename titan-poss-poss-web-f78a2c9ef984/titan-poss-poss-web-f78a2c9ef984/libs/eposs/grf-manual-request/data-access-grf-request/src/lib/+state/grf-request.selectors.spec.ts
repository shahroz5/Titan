import {
  AdvanceBookingDetailsResponse,
  ApprovalRequest,
  CashMemoItemDetails,
  GRFRequestList,
  CustomerInfo,
  CustomErrors,
  FileUploadLists,
  ManualBillDetails,
  StatusTypesEnum
} from '@poss-web/shared/models';
import { CmRequestState } from './grf-request.state';
import { initialState } from './grf-request.reducer';
import * as selectors from './grf-request.selectors';
import * as moment from 'moment';
import { cmRequestListAdapter, itemDetailsAdapter } from './grf-request.entity';

describe('Manual Cash Memo Request Selector Testing Suite', () => {
  const grfRequestList: GRFRequestList[] = [
    {
      approvalStatus: 'PENDING',
      approvedBy: null,
      approvedDate: null,
      approverRemarks: null,
      docDate: moment(1625582616979),
      docNo: 23,
      fiscalYear: 2020,
      headerData: { type: 'MANUAL_BILL_HEADER' },
      locationCode: 'CPD',
      processId: '8BDAA81B-DE68-11EB-BBE7-00155DDE1995',
      requestedBy: 'cashiercpd',
      requestedDate: moment(1625582616979),
      requestorRemarks: 'remarks',
      taskId: '8be44538-de68-11eb-bbe7-00155dde1995',
      taskName: 'REQUEST_APPROVER_L1',
      workflowType: 'MANUAL_BILL'
    }
  ];

  const cashMemoDetailsResponse: AdvanceBookingDetailsResponse = {
    activationDetails: {},
    cancellationDetails: {},
    confirmedTime: moment(),
    customerId: 1,
    discountDetails: 0,
    docDate: moment(),
    docNo: 1,
    employeeCode: '',
    finalValue: 123,
    firstHoldTime: moment(),
    fiscalYear: 2015,
    focDetails: {},
    id: '',
    isBestRate: true,
    isFrozenRate: true,
    lastHoldTime: moment(),
    metalRateList: {},
    minValue: 1,
    occasion: '',
    txnType: '',
    otherChargesList: {},
    paidValue: 1,
    refTxnId: '',
    refTxnType: '',
    remarks: '',
    roundingVariance: 1,
    status: StatusTypesEnum.APPROVED,
    subTxnType: '',
    taxDetails: {
      taxes: [
        {
          taxType: 'ITEMCHARGES',
          taxClass: 'TC72',
          data: {
            SGST: { taxCode: 'SGST', taxPercentage: 1.5, taxValue: 437.42 },
            CGST: { taxCode: 'CGST', taxPercentage: 1.5, taxValue: 437.42 }
          },
          cess: {}
        }
      ]
    },
    totalDiscount: 1,
    totalQuantity: 1,
    totalTax: 1,
    totalValue: 1,
    totalWeight: 1,
    txnTime: moment(),
    customerDocDetails: null,
    refSubTxnType: 'MANUAL_AB',
    cancelTxnId: 0,
    isRivaah: false,
    isFrozenAmount: 0,
    hallmarkCharges: 0,
    hallmarkDiscount: 0,
    refDocNo: 0,
    refFiscalYear: 0,
    cancelRemarks: '',
    minPaymentDetails: {}
  };



  const approvalRequest: ApprovalRequest = {
    approverRemarks: 'test',
    approverRoleCode: 'A1',
    approverUserName: 'Approver1',
    level: 1,
    processId: '8BDAA81B-DE68-11EB-BBE7-00155DDE1995',
    taskId: '8CDAA81B-DE68-11EB-BBE7-00155DDE1995',
    requestorUserName: 'Requestor1',
    taskStatus: 'APPROVED',
    totalApproverLevels: 3
  };

  const fileUploadListRes: FileUploadLists[] = [
    {
      id: '1234567',
      name: 'file1'
    }
  ];

  const fileDownloadRes = 'http://downloadedurl.com';



  const customerInfo: CustomerInfo = {
    customerId: '36',
    title: null,
    customerName: 'Test Customer',
    customerType: 'REGULAR',
    ulpId: '700001982839',
    mobileNumber: '9945500787',
    emailId: 'test@gmail.com',
    instiTaxNo: null,
    custTaxNo: null,
    passportId: null,
    customerDetails: {
      type: 'REGULAR',
      data: {
        addressLines: ['123', 'M.G Road', 'Utility Building', 'Shantinagar'],
        pinCode: '560010',
        city: 'Bangalore North',
        state: null,
        country: null,
        zone: null,
        catchmentName: null,
        birthday: null,
        spouseBirthday: null,
        anniversary: null,
        canSendSMS: true,
        altContactNo: null,
        idProof: null,
        idNumber: null,
        isHardCopySubmitted: false
      }
    },
    isActive: true,
    isInstiTaxNoVerified: null,
    iscustTaxNoVerified: null,
    pointBalance: 0.0,
    currentTier: 'Encircle Silver',
    enrollmentDate: moment(1603996200000),
    isMemberBlocked: false,
    isPulseCustomer: false,
    loyaltyDetails: {
      type: 'LOYALTY',
      data: {
        birthday: null,
        birthdayDiscount: 'DNU',
        birthdayValdityPeriod: '',
        spouseBirthday: null,
        spouseBirthdayDiscount: 'DNU',
        spouseBirthdayValidityPeriod: '',
        anniversary: null,
        anniversaryDiscount: 'N',
        anniversaryValidityPeriod: '',
        child1BirthdayDiscount: 'DNU',
        child1BirthdayValidityPeriod: '',
        child2BirthdayDiscount: 'DNU',
        child2BirthdayValidityPeriod: ''
      }
    }
  };

  const headerDetails: ManualBillDetails = {
    approvedBy: 'cashier',
    frozenRateDate: null,
    isFrozenRate: null,
    manualBillDate: 1607538600000,
    manualBillNo: '15',
    manualBillValue: 95920,
    metalRates: {
      J: { metalTypeCode: null, totalMetalWeight: 0, ratePerUnit: 5215 }
    },
    password: null,
    processId: null,
    remarks: 'test',
    requestNo: null,
    requestStatus: null,
    validationType: 'REQUEST_APPROVAL',
    performedBy: null
  };

  describe('Testing Manual Cash Memo Request Related selectors', () => {
    const grfRequestListEntity = cmRequestListAdapter.setAll(grfRequestList, {
      ...cmRequestListAdapter.getInitialState()
    });



    it('Should return grfRequestList Entity', () => {
      const state: CmRequestState = {
        ...initialState,
        cmRequestList: grfRequestListEntity
      };
      expect(selectors.cmRequestList.projector(state)).toEqual(
        grfRequestListEntity
      );
    });

    it('Should return selectGrfRequestList', () => {
      expect(
        selectors.cmRequestSelectors.selectGrfRequestList.projector(
          grfRequestListEntity
        )
      ).toEqual(grfRequestList);
    });



    it('should return selectGrfProductList selector', () => {
      const state: CmRequestState = {
        ...initialState,
        productList: cashMemoDetailsResponse
      };
      expect(
        selectors.cmRequestSelectors.selectGrfProductList.projector(state)
      ).toEqual(cashMemoDetailsResponse);
    });





    it('should return selectGrfCustomerDetails selector', () => {
      const state: CmRequestState = {
        ...initialState,
        customerDetails: customerInfo
      };
      expect(
        selectors.cmRequestSelectors.selectGrfCustomerDetails.projector(state)
      ).toEqual(customerInfo);
    });

    it('should return selectGrfHeaderDetails selector', () => {
      const state: CmRequestState = {
        ...initialState,
        headerDetails: headerDetails
      };
      expect(
        selectors.cmRequestSelectors.selectGrfHeaderDetails.projector(state)
      ).toEqual(headerDetails);
    });

    it('should return selectUpdateCashMemoResponse selector', () => {
      const state: CmRequestState = {
        ...initialState,
        updateCashMemoResponse: cashMemoDetailsResponse
      };
      expect(
        selectors.cmRequestSelectors.selectUpdateCashMemoResponse.projector(
          state
        )
      ).toEqual(cashMemoDetailsResponse);
    });


    it('Should return hasError selector', () => {
      const error: CustomErrors = {
        code: 'ERR_1',
        message: 'Error',
        traceId: 'TraceID',
        timeStamp: '122131',
        error: null
      };
      const state: CmRequestState = {
        ...initialState,
        hasError: error
      };
      expect(
        selectors.cmRequestSelectors.selectHasError.projector(state)
      ).toEqual(error);
    });

    it('should return isLoading selector', () => {
      const state: CmRequestState = {
        ...initialState,
        isLoading: true
      };
      expect(
        selectors.cmRequestSelectors.selectIsLoading.projector(state)
      ).toEqual(true);
    });
  });
});




