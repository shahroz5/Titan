import {
  AdvanceBookingDetailsResponse,
  ApprovalRequest,
  CashMemoItemDetails,
  CmRequestDetails,
  CmRequestList,
  CustomerInfo,
  CustomErrors,
  FileUploadLists,
  ManualBillDetails,
  StatusTypesEnum
} from '@poss-web/shared/models';
import { CmRequestState } from './cm-request.state';
import { initialState } from './cm-request.reducer';
import * as selectors from './cm-request.selectors';
import * as moment from 'moment';
import { cmRequestListAdapter, itemDetailsAdapter } from './cm-request.entity';

describe('Manual Cash Memo Request Selector Testing Suite', () => {
  const cmRequestList: CmRequestList[] = [
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
    cancelTxnId: 1,
    isFrozenAmount: 0,
    isRivaah: false,
    refDocNo: 1,
    refFiscalYear: 2022,
    hallmarkCharges: 350,
    hallmarkDiscount: 350,
    minPaymentDetails: {},
    cancelRemarks: ''
  };

  const cashMemoItemDetails: CashMemoItemDetails[] = [
    {
      binCode: '18 COIN',
      discountDetails: null,
      employeeCode: null,
      finalValue: 34170.12,
      inventoryId: 'FF472F1A-B663-4061-8D5C-4BD9CE4983F6',
      inventoryWeightDetails: {
        type: 'WEIGHT_DETAILS',
        data: {
          diamondWeight: 0,
          goldWeight: 8.104,
          materialWeight: 0,
          platinumWeight: 0,
          silverWeight: 0,
          stoneWeight: 0.078
        }
      },
      itemCode: '500452VQAA1A11',
      itemDetails: { type: 'ITEM_DETAILS', data: {} },
      itemId: 'C5B8634F-5739-4E42-AFAE-A8F26F764D1A',
      itemInStock: true,
      lotNumber: '2JA005208',
      measuredWeightDetails: {
        type: 'WEIGHT_DETAILS',
        data: {
          diamondWeight: 0,
          goldWeight: 8.104,
          materialWeight: 0,
          platinumWeight: 0,
          silverWeight: 0,
          stoneWeight: 0.078
        }
      },
      priceDetails: {
        netWeight: 8.104,
        isUcp: false,
        metalPriceDetails: {
          preDiscountValue: 23657.76,
          metalPrices: [
            {
              karat: 18,
              metalTypeCode: 'J',
              metalValue: 23657.76,
              netWeight: 8.104,
              purity: 75,
              ratePerUnit: 2919.27,
              type: 'Gold',
              weightUnit: 'gms'
            }
          ]
        },
        makingChargeDetails: {
          isDynamicPricing: true,
          makingChargePct: null,
          makingChargePercentage: 24.92,
          makingChargePgram: null,
          preDiscountValue: 6617.98,
          wastagePct: null
        },
        stonePriceDetails: {
          numberOfStones: 13,
          preDiscountValue: 2899.14,
          stoneWeight: 0.39,
          stoneWeightForView: 0.078,
          weightUnit: 'carat',
          weightUnitForView: 'gms'
        },
        itemHallmarkDetails: {
          hallmarkGstPct: 12,
          hallmarkingCharges: 120,
          hmQuantity: 1,
          isFOCForHallmarkingCharges: true,
          isHallmarked: true
        }
      },
      productCategoryCode: 'V',
      productGroupCode: '78',
      reason: null,
      refTxnId: null,
      refTxnType: null,
      remarks: null,
      rowId: 1,
      taxDetails: {
        taxType: 'ITEMCHARGES',
        taxClass: 'TC78',
        cess: {
          cessCode: 'ABC',
          cessOnTax: true,
          cessPercentage: 3,
          cessValue: 3400
        },
        data: {
          taxCode: 'CGST',
          taxPercentage: 1.5,
          taxValue: 497.62
        }
      },
      totalDiscount: 0,
      totalQuantity: 1,
      totalTax: 995.24,
      totalValue: 33174.88,
      totalWeight: 8.182,
      unitValue: 33174.88,
      unitWeight: 8.182,
      focDetails: {},
      isFoc: false,
      refSubTxnType: 'NEW_AB',
      hallmarkCharges: 350,
      hallmarkDiscount: 350
    }
  ];

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

  const cmRequestDetails: CmRequestDetails = {
    approvalLevel: 1,
    approvalStatus: 'APPROVED',
    approvedData: null,
    docNo: 89,
    headerData: null,
    locationCode: 'CPD',
    processId: '8BDAA81B-DE68-11EB-BBE7-00155DDE1995',
    requestorRemarks: 'testing',
    requestorUserName: 'Requestor1'
  };

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
    manualBillDate: moment(1607538600000).valueOf(),
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
    const cmRequestListEntity = cmRequestListAdapter.setAll(cmRequestList, {
      ...cmRequestListAdapter.getInitialState()
    });

    const itemDetailsEntity = itemDetailsAdapter.setAll(cashMemoItemDetails, {
      ...itemDetailsAdapter.getInitialState()
    });

    it('Should return cmRequestList Entity', () => {
      const state: CmRequestState = {
        ...initialState,
        cmRequestList: cmRequestListEntity
      };
      expect(selectors.cmRequestList.projector(state)).toEqual(
        cmRequestListEntity
      );
    });

    it('Should return selectCmRequestList', () => {
      expect(
        selectors.cmRequestSelectors.selectCmRequestList.projector(
          cmRequestListEntity
        )
      ).toEqual(cmRequestList);
    });

    it('should return selectCmRequestDetails selector', () => {
      const state: CmRequestState = {
        ...initialState,
        cmRequestDetails: cmRequestDetails
      };
      expect(
        selectors.cmRequestSelectors.selectCmRequestDetails.projector(state)
      ).toEqual(cmRequestDetails);
    });

    it('should return selectCmApprovalRequest selector', () => {
      const state: CmRequestState = {
        ...initialState,
        cmApprovalRequest: approvalRequest
      };
      expect(
        selectors.cmRequestSelectors.selectCmApprovalRequest.projector(state)
      ).toEqual(approvalRequest);
    });

    it('should return selectCmProductList selector', () => {
      const state: CmRequestState = {
        ...initialState,
        productList: cashMemoDetailsResponse
      };
      expect(
        selectors.cmRequestSelectors.selectCmProductList.projector(state)
      ).toEqual(cashMemoDetailsResponse);
    });

    it('Should return productDetails Entity', () => {
      const state: CmRequestState = {
        ...initialState,
        productDetails: itemDetailsEntity
      };
      expect(selectors.productDetails.projector(state)).toEqual(
        itemDetailsEntity
      );
    });

    it('Should return selectCmProductDetails', () => {
      expect(
        selectors.cmRequestSelectors.selectCmProductDetails.projector(
          itemDetailsEntity
        )
      ).toEqual(cashMemoItemDetails);
    });

    it('should return selectCmCustomerDetails selector', () => {
      const state: CmRequestState = {
        ...initialState,
        customerDetails: customerInfo
      };
      expect(
        selectors.cmRequestSelectors.selectCmCustomerDetails.projector(state)
      ).toEqual(customerInfo);
    });

    it('should return selectCmHeaderDetails selector', () => {
      const state: CmRequestState = {
        ...initialState,
        headerDetails: headerDetails
      };
      expect(
        selectors.cmRequestSelectors.selectCmHeaderDetails.projector(state)
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

    it('should return selectFileUploadListRes selector', () => {
      const state: CmRequestState = {
        ...initialState,
        uploadFileListResponse: fileUploadListRes
      };
      expect(
        selectors.cmRequestSelectors.selectFileUploadListRes.projector(state)
      ).toEqual(fileUploadListRes);
    });

    it('should return selectFileDownloadUrl selector', () => {
      const state: CmRequestState = {
        ...initialState,
        downloadFileUrl: fileDownloadRes
      };
      expect(
        selectors.cmRequestSelectors.selectFileDownloadUrl.projector(state)
      ).toEqual(fileDownloadRes);
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

    it('should return dropDownValues selector', () => {
      const state: CmRequestState = {
        ...initialState,
        requestStausDropDownValues: StatusTypesEnum.APPROVED
      };
      expect(
        selectors.cmRequestSelectors.dropDownValues.projector(state)
      ).toEqual(StatusTypesEnum.APPROVED);
    });
  });
});
