import {
  FileDownloadUrlFailure,
  FileDownloadUrlSuccess,
  FileDownloadUrl,
  FileUploadList,
  FileUploadListSuccess,
  FileUploadListFailure,
  ClearCmRequestProductDetails,
  SetDropownValues
} from './cm-request.actions';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { cmRequestReducer, initialState } from './cm-request.reducer';
import { CmRequestState } from './cm-request.state';
import {
  AdvanceBookingDetailsResponse,
  ApprovalRequest,
  CashMemoDetailsRequestPayload,
  CashMemoItemDetails,
  CashMemoItemDetailsRequestPayload,
  CmApprovalRequestPayload,
  CmRequestDetails,
  CmRequestDetailsPayload,
  CmRequestList,
  CmRequestListPayload,
  FileUploadDownloadPayload,
  FileUploadLists,
  StatusTypesEnum,
  TransactionTypeEnum
} from '@poss-web/shared/models';
import * as moment from 'moment';
import {
  ClearCmRequestDetails,
  ClearCmRequestList,
  CmApprovalRequest,
  CmApprovalRequestFailure,
  CmApprovalRequestSuccess,
  ConfirmManualCM,
  ConfirmManualCMFailure,
  ConfirmManualCMSuccess,
  LoadCmProductDetails,
  LoadCmProductDetailsFailure,
  LoadCmProductDetailsSuccess,
  LoadCmProductList,
  LoadCmProductListFailure,
  LoadCmProductListSuccess,
  LoadCmRequestDetails,
  LoadCmRequestDetailsFailure,
  LoadCmRequestDetailsSuccess,
  LoadCmRequestList,
  LoadCmRequestListFailure,
  LoadCmRequestListSuccess
} from './cm-request.actions';

describe('Manual Cash Memo Request Reducer Testing Suite', () => {
  const testState = initialState;

  const cmRequestListPayload: CmRequestListPayload = {
    approvalStatus: 'PENDING',
    appliedFilters: {
      dateRangeType: 'CUSTOM',
      endDate: moment(1625509800000).valueOf(),
      startDate: moment(1625509800000).valueOf()
    },
    pageIndex: 0,
    pageSize: 10,
    workflowType: 'MANUAL_BILL',
    userType: true
  };

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

  const cmRequestDetailsCorpPayload: CmRequestDetailsPayload = {
    processId: '8BDAA81B-DE68-11EB-BBE7-00155DDE1995',
    taskName: 'REQUEST_APPROVER_L1',
    workFlowType: 'MANUAL_BILL',
    userType: true
  };

  const cmRequestDetailsBtqPayload: CmRequestDetailsPayload = {
    processId: '8BDAA81B-DE68-11EB-BBE7-00155DDE1995',
    taskName: 'REQUEST_APPROVER_L1',
    workFlowType: 'MANUAL_BILL',
    userType: false
  };

  const cashMemoDetailsRequestPayload: CashMemoDetailsRequestPayload = {
    subTxnType: 'MANUAL_CM',
    txnType: 'CM'
  };

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

  const cashMemoItemDetailsRequestPayload: CashMemoItemDetailsRequestPayload = {
    id: '4D619FB5-45A3-423B-AE48-33C273633300',
    txnType: 'CM',
    subTxnType: 'NEW_CM'
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

  const cmApprovalRequestPayload: CmApprovalRequestPayload = {
    isApprove: true,
    requestBody: {},
    processId: '8BDAA81B-DE68-11EB-BBE7-00155DDE1995',
    taskName: 'REQUEST_APPROVER_L1',
    taskId: '8CDAA81B-DE68-11EB-BBE7-00155DDE1995'
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
  const fileUploadDownloadPayload: FileUploadDownloadPayload = {
    txnType: TransactionTypeEnum.CM,
    id: '3A0E5E55-1830-4392-98E6-94D16766B6B2'
  };

  const fileUploadListRes: FileUploadLists[] = [
    {
      id: '1234567',
      name: 'file1'
    }
  ];

  const fileDownloadReq = { id: '1234567', locationCode: 'CPD' };
  const fileDownloadRes = 'http://downloadedurl.com';

  const cmRequestDetails: CmRequestDetails = {
    taskId: '8be44538-de68-11eb-bbe7-00155dde1995',
    processId: '8BDAA81B-DE68-11EB-BBE7-00155DDE1995',
    taskName: 'REQUEST_APPROVER_L1',
    requestorUserName: 'cashiercpd',
    requestorRemarks: 'remarks',
    docNo: 23,
    locationCode: 'CPD',
    approvalStatus: 'PENDING',
    approvalLevel: 1,
    approvedData: {
      // type: 'MANUAL_BILL_DETAILS',
      data: {
        itemList: [
          {
            itemCode: '502015HZLAAB40',
            lotNumber: '2BA607549',
            totalWeight: 1.777,
            totalQuantity: 1.0,
            inventoryId: '32EDDE9C-8630-46B5-8CC7-39ED61F2067C',
            unitValue: 69239.66,
            totalValue: 69239.66,
            totalDiscount: 0.0,
            finalValue: 71316.84,
            totalTax: 2077.18,
            employeeCode: 'rsocpd7',
            remarks: null,
            reason: null,
            itemId: '57641C7E-4FC9-42CF-A517-DEA95E07394D',
            binCode: 'GROUND FLOOR',
            rowId: 1.0,
            refTxnId: null,
            refTxnType: null,
            inventoryWeightDetails: {
              type: 'WEIGHT_DETAILS',
              data: {
                goldWeight: 1.393,
                platinumWeight: 0.0,
                silverWeight: 0.0,
                stoneWeight: 0.384,
                materialWeight: 0.0,
                diamondWeight: 0.0
              }
            },
            measuredWeightDetails: {
              type: 'WEIGHT_DETAILS',
              data: {
                goldWeight: 1.393,
                platinumWeight: 0.0,
                silverWeight: 0.0,
                stoneWeight: 0.384,
                materialWeight: 0.0,
                diamondWeight: 0.0
              }
            },
            priceDetails: {
              netWeight: 1.393,
              isUcp: false,
              metalPriceDetails: {
                preDiscountValue: 53491.84,
                metalPrices: [
                  {
                    weightUnit: 'gms',
                    netWeight: 1.393,
                    metalValue: 53491.84,
                    type: 'Gold',
                    ratePerUnit: 38400.46,
                    karat: 18.0,
                    purity: 75.0,
                    metalTypeCode: 'J'
                  }
                ]
              },
              stonePriceDetails: {
                preDiscountValue: 3840.0,
                weightUnit: 'carat',
                stoneWeight: 1.92,
                numberOfStones: 14.0,
                stoneWeightForView: 12,
                weightUnitForView: 'gms'
              },
              makingChargeDetails: {
                preDiscountValue: 11907.82,
                isDynamicPricing: true,
                makingChargePercentage: 20.77,
                makingChargePgram: null,
                wastagePct: null,
                makingChargePct: null
              },
              itemHallmarkDetails: {
                hallmarkGstPct: 12,
                hallmarkingCharges: 120,
                hmQuantity: 1,
                isFOCForHallmarkingCharges: true,
                isHallmarked: true
              }
            },
            taxDetails: {
              taxType: 'ITEMCHARGES',
              taxClass: 'TC78',
              data: {
                taxCode: 'CGST',
                taxPercentage: 1.5,
                taxValue: 1038.59
              },
              cess: {
                cessCode: 'C1',
                cessOnTax: true,
                cessPercentage: 3,
                cessValue: 3000
              }
            },
            productGroupCode: '78',
            productCategoryCode: 'H',
            discountDetails: null,
            itemInStock: true,
            itemDetails: {
              type: 'ITEM_DETAILS',
              data: {
                '32EDDE9C-8630-46B5-8CC7-39ED61F2067C': {
                  inventoryId: '32EDDE9C-8630-46B5-8CC7-39ED61F2067C',
                  binGroupCode: 'STN',
                  lotNumber: '2BA607549',
                  binCode: 'GROUND FLOOR',
                  quantity: 1.0,
                  mfgDate: 1.555353e12,
                  stockInwardDate: null
                }
              }
            },
            unitWeight: 1.777,
            focDetails: {},
            isFoc: false,
            refSubTxnType: 'MANUAL_AB',
            hallmarkCharges: 350,
            hallmarkDiscount: 350
          }
        ],
        paymentList: [],
        discountList: []
      }
    },
    headerData: {
      type: 'MANUAL_BILL_HEADER',
      data: {
        customerId: 73.0,
        occasion: null,
        totalQuantity: 2.0,
        totalWeight: 9.777,
        totalValue: 470994.7,
        totalTax: 14129.84,
        finalValue: 485125.0,
        totalDiscount: 0.0,
        paidValue: 0.0,
        remarks: 'remarks',
        otherCharges: null,
        metalRateList: {
          metalRates: {
            J: {
              metalTypeCode: 'J',
              purity: 91.6666667,
              ratePerUnit: 46934.0,
              currency: 'INR',
              applicableDate: 1.6255098e12,
              karat: 22.0
            }
          }
        },
        id: '55AD5BBE-8229-4082-BC1B-38DD4C8BF0F0',
        status: 'OPEN',
        refTxnId: null,
        refTxnType: null,
        docNo: 2020.0,
        docDate: 1.6255098e12,
        fiscalYear: 2020.0,
        firstHoldTime: null,
        lastHoldTime: null,
        roundingVariance: 0.46,
        employeeCode: 'cashiercpd',
        txnType: 'CM',
        subTxnType: 'MANUAL_CM',
        confirmedTime: null,
        manualBillDetails: {
          manualBillDetails: {
            manualBillDate: 1.6255098e12,
            manualBillNo: '908',
            manualBillValue: 485125.0,
            remarks: 'test',
            approvedBy: 'vidya',
            password: null,
            metalRates: {
              J: {
                metalTypeCode: 'J',
                totalMetalWeight: 0.0,
                ratePerUnit: 46934.0
              }
            },
            isFrozenRate: null,
            frozenRateDate: null,
            processId: null,
            requestStatus: null,
            requestNo: null,
            requestedDate: null,
            requestType: null
          },
          validationType: 'REQUEST_APPROVAL'
        },
        taxDetails: {
          taxes: [
            {
              taxType: 'ITEMCHARGES',
              taxClass: 'TC78',
              data: {
                SGST: {
                  taxCode: 'SGST',
                  taxPercentage: 1.5,
                  taxValue: 1038.59
                },
                CGST: { taxCode: 'CGST', taxPercentage: 1.5, taxValue: 1038.59 }
              },
              cess: {}
            },
            {
              taxType: 'ITEMCHARGES',
              taxClass: 'TC73',
              data: {
                SGST: {
                  taxCode: 'SGST',
                  taxPercentage: 1.5,
                  taxValue: 6026.33
                },
                CGST: { taxCode: 'CGST', taxPercentage: 1.5, taxValue: 6026.33 }
              },
              cess: {}
            }
          ]
        },
        currencyCode: 'INR',
        weightUnit: 'gms',
        manualBillId: 'CPD_2021-07-06_CM_908',
        discountTxnDetails: null,
        locationCode: 'CPD',
        invokeTime: null,
        invokeCount: null,
        creditNotes: null,
        customerDocDetails: null,
        refSubTxnType: null,
        title: null,
        customerName: 'Vidhya',
        customerType: 'REGULAR',
        ulpId: '700001887822',
        mobileNumber: '9526999255',
        instiTaxNo: null,
        custTaxNo: 'BPBZ1044Z',
        passportId: null,
        pointBalance: 0.0,
        currentTier: 'Encircle Silver',
        enrollmentDate: 1.6039098e12,
        isMemberBlocked: false,
        isPulseCustomer: false
      }
    },
    approvedDate: null
  };

  it('should return the initial state', () => {
    const action: any = {};
    const state: CmRequestState = cmRequestReducer(undefined, action);

    expect(state).toBe(testState);
  });

  describe('Testing LoadCmRequestList Functionality', () => {
    it('LoadCmRequestList should be called', () => {
      const action = new LoadCmRequestList(cmRequestListPayload);
      const result: CmRequestState = cmRequestReducer(initialState, action);
      expect(result.isLoading).toEqual(true);
      expect(result.hasError).toEqual(null);
    });
    it('LoadCmRequestListSuccess should be called', () => {
      const action = new LoadCmRequestListSuccess(cmRequestList);
      const result: CmRequestState = cmRequestReducer(initialState, action);
      expect(result.isLoading).toEqual(false);
      expect(result.hasError).toEqual(null);
      expect(result.cmRequestList).toBeTruthy();
    });
    it('LoadCmRequestListFailure should be called', () => {
      const action = new LoadCmRequestListFailure(
        CustomErrorAdaptor.fromJson(Error('Some Error'))
      );

      const result: CmRequestState = cmRequestReducer(initialState, action);
      expect(result.isLoading).toEqual(false);
      expect(result.hasError.message).toEqual('Some Error');
    });
  });

  describe('Testing LoadCmRequestDetails - Corp Functionality', () => {
    it('LoadCmRequestDetails should be called', () => {
      const action = new LoadCmRequestDetails(cmRequestDetailsCorpPayload);
      const result: CmRequestState = cmRequestReducer(initialState, action);
      expect(result.isLoading).toEqual(true);
      expect(result.hasError).toEqual(null);
    });

    it('LoadCmRequestDetailsSuccess should be called', () => {
      const action = new LoadCmRequestDetailsSuccess({
        data: cmRequestDetails,
        userType: cmRequestDetailsCorpPayload.userType
      });
      const result: CmRequestState = cmRequestReducer(initialState, action);
      expect(result.isLoading).toEqual(false);
      expect(result.hasError).toEqual(null);
      expect(result.cmRequestDetails).toEqual(cmRequestDetails);
      expect(result.headerDetails).toEqual(
        cmRequestDetails.headerData.data.manualBillDetails.manualBillDetails
      );
      expect(result.customerDetails).toEqual(cmRequestDetails.headerData.data);
      expect(result.productDetails).toBeTruthy();
    });
    it('LoadCmRequestDetailsFailure should be called', () => {
      const action = new LoadCmRequestDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('Some Error'))
      );

      const result: CmRequestState = cmRequestReducer(initialState, action);
      expect(result.isLoading).toEqual(false);
      expect(result.hasError.message).toEqual('Some Error');
    });
  });

  describe('Testing LoadCmRequestDetails - Btq Functionality', () => {
    it('LoadCmRequestDetails should be called', () => {
      const action = new LoadCmRequestDetails(cmRequestDetailsBtqPayload);
      const result: CmRequestState = cmRequestReducer(initialState, action);
      expect(result.isLoading).toEqual(true);
      expect(result.hasError).toEqual(null);
    });

    it('LoadCmRequestDetailsSuccess should be called', () => {
      const action = new LoadCmRequestDetailsSuccess({
        data: cmRequestDetails,
        userType: cmRequestDetailsBtqPayload.userType
      });
      const result: CmRequestState = cmRequestReducer(initialState, action);
      expect(result.isLoading).toEqual(false);
      expect(result.hasError).toEqual(null);
      expect(result.cmRequestDetails).toEqual(cmRequestDetails);
      expect(result.headerDetails).toEqual(
        cmRequestDetails.headerData.data.manualBillDetails.manualBillDetails
      );
      expect(result.customerDetails).toEqual(cmRequestDetails.headerData.data);
    });
    it('LoadCmRequestDetailsFailure should be called', () => {
      const action = new LoadCmRequestDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('Some Error'))
      );

      const result: CmRequestState = cmRequestReducer(initialState, action);
      expect(result.isLoading).toEqual(false);
      expect(result.hasError.message).toEqual('Some Error');
    });
  });

  describe('Testing LoadCmProductList Functionality', () => {
    it('LoadCmProductList should be called', () => {
      const action = new LoadCmProductList(cashMemoDetailsRequestPayload);
      const result: CmRequestState = cmRequestReducer(initialState, action);
      expect(result.isLoading).toEqual(true);
      expect(result.hasError).toEqual(null);
    });

    it('LoadCmProductListSuccess should be called', () => {
      const action = new LoadCmProductListSuccess(cashMemoDetailsResponse);
      const result: CmRequestState = cmRequestReducer(initialState, action);
      expect(result.isLoading).toEqual(false);
      expect(result.hasError).toEqual(null);
      expect(result.productList).toBeTruthy();
    });
    it('LoadCmProductListFailure should be called', () => {
      const action = new LoadCmProductListFailure(
        CustomErrorAdaptor.fromJson(Error('Some Error'))
      );

      const result: CmRequestState = cmRequestReducer(initialState, action);
      expect(result.isLoading).toEqual(false);
      expect(result.hasError.message).toEqual('Some Error');
    });
  });

  describe('Testing LoadCmProductDetails Functionality', () => {
    it('LoadCmProductDetails should be called', () => {
      const action = new LoadCmProductDetails(
        cashMemoItemDetailsRequestPayload
      );
      const result: CmRequestState = cmRequestReducer(initialState, action);
      expect(result.isLoading).toEqual(true);
      expect(result.hasError).toEqual(null);
    });

    it('LoadCmProductDetailsSuccess should be called', () => {
      const action = new LoadCmProductDetailsSuccess(cashMemoItemDetails);
      const result: CmRequestState = cmRequestReducer(initialState, action);
      expect(result.isLoading).toEqual(false);
      expect(result.hasError).toEqual(null);
      expect(result.productDetails).toBeTruthy();
    });
    it('LoadCmProductDetailsFailure should be called', () => {
      const action = new LoadCmProductDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('Some Error'))
      );

      const result: CmRequestState = cmRequestReducer(initialState, action);
      expect(result.isLoading).toEqual(false);
      expect(result.hasError.message).toEqual('Some Error');
    });
  });

  describe('Testing CmApprovalRequest Functionality', () => {
    it('CmApprovalRequest should be called', () => {
      const action = new CmApprovalRequest(cmApprovalRequestPayload);
      const result: CmRequestState = cmRequestReducer(initialState, action);
      expect(result.isLoading).toEqual(true);
      expect(result.hasError).toEqual(null);
    });

    it('CmApprovalRequestSuccess should be called', () => {
      const action = new CmApprovalRequestSuccess(approvalRequest);
      const result: CmRequestState = cmRequestReducer(initialState, action);
      expect(result.isLoading).toEqual(false);
      expect(result.hasError).toEqual(null);
      expect(result.cmApprovalRequest).toBeTruthy();
    });
    it('CmApprovalRequestFailure should be called', () => {
      const action = new CmApprovalRequestFailure(
        CustomErrorAdaptor.fromJson(Error('Some Error'))
      );

      const result: CmRequestState = cmRequestReducer(initialState, action);
      expect(result.isLoading).toEqual(false);
      expect(result.hasError.message).toEqual('Some Error');
    });
  });

  describe('Testing ConfirmManualCM Functionality', () => {
    it('ConfirmManualCM should be called', () => {
      const action = new ConfirmManualCM(cashMemoDetailsRequestPayload);
      const result: CmRequestState = cmRequestReducer(initialState, action);
      expect(result.isLoading).toEqual(true);
      expect(result.hasError).toEqual(null);
    });

    it('ConfirmManualCMSuccess should be called', () => {
      const action = new ConfirmManualCMSuccess(cashMemoDetailsResponse);
      const result: CmRequestState = cmRequestReducer(initialState, action);
      expect(result.isLoading).toEqual(false);
      expect(result.hasError).toEqual(null);
      expect(result.updateCashMemoResponse).toBeTruthy();
    });
    it('ConfirmManualCMFailure should be called', () => {
      const action = new ConfirmManualCMFailure(
        CustomErrorAdaptor.fromJson(Error('Some Error'))
      );

      const result: CmRequestState = cmRequestReducer(initialState, action);
      expect(result.isLoading).toEqual(false);
      expect(result.hasError.message).toEqual('Some Error');
    });
  });

  describe('Testing FileUploadList Functionality', () => {
    it('FileUploadList should be called', () => {
      const action = new FileUploadList(fileUploadDownloadPayload);
      const result: CmRequestState = cmRequestReducer(initialState, action);
      expect(result.isLoading).toEqual(true);
      expect(result.hasError).toEqual(null);
    });

    it('FileUploadListSuccess should be called', () => {
      const action = new FileUploadListSuccess(fileUploadListRes);
      const result: CmRequestState = cmRequestReducer(initialState, action);
      expect(result.isLoading).toEqual(false);
      expect(result.hasError).toEqual(null);
      expect(result.uploadFileListResponse).toBeTruthy();
    });
    it('FileUploadListFailure should be called', () => {
      const action = new FileUploadListFailure(
        CustomErrorAdaptor.fromJson(Error('Some Error'))
      );

      const result: CmRequestState = cmRequestReducer(initialState, action);
      expect(result.isLoading).toEqual(false);
      expect(result.hasError.message).toEqual('Some Error');
    });
  });

  describe('Testing FileDownloadUrl Functionality', () => {
    it('FileDownloadUrl should be called', () => {
      const action = new FileDownloadUrl(fileDownloadReq);
      const result: CmRequestState = cmRequestReducer(initialState, action);
      expect(result.isLoading).toEqual(true);
      expect(result.hasError).toEqual(null);
    });

    it('FileDownloadUrlSuccess should be called', () => {
      const action = new FileDownloadUrlSuccess(fileDownloadRes);
      const result: CmRequestState = cmRequestReducer(initialState, action);
      expect(result.isLoading).toEqual(false);
      expect(result.hasError).toEqual(null);
      expect(result.downloadFileUrl).toBeTruthy();
    });
    it('FileDownloadUrlFailure should be called', () => {
      const action = new FileDownloadUrlFailure(
        CustomErrorAdaptor.fromJson(Error('Some Error'))
      );

      const result: CmRequestState = cmRequestReducer(initialState, action);
      expect(result.isLoading).toEqual(false);
      expect(result.hasError.message).toEqual('Some Error');
    });
  });

  describe('Testing Reset Functionality', () => {
    it('ClearCmRequestList should be called', () => {
      const action = new ClearCmRequestList();
      const result: CmRequestState = cmRequestReducer(initialState, action);
      expect(result.isLoading).toEqual(false);
      expect(result.hasError).toEqual(null);
    });

    it('ClearCmRequestDetails should be called', () => {
      const action = new ClearCmRequestDetails();
      const result: CmRequestState = cmRequestReducer(initialState, action);
      expect(result.isLoading).toEqual(false);
      expect(result.hasError).toEqual(null);
    });

    it('ClearCmRequestProductDetails should be called', () => {
      const action = new ClearCmRequestProductDetails();
      const result: CmRequestState = cmRequestReducer(initialState, action);
      expect(result.isLoading).toEqual(false);
      expect(result.hasError).toEqual(null);
    });
  });

  describe('Testing Set Functionality', () => {
    it('SetDropownValues should be called', () => {
      const action = new SetDropownValues(StatusTypesEnum.APPROVED);
      const result: CmRequestState = cmRequestReducer(initialState, action);
      expect(result.requestStausDropDownValues).toEqual(StatusTypesEnum.APPROVED);
    });
  });
});
