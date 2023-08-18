import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
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
  StatusTypesEnum,
  TransactionTypeEnum,
  WorkflowTypeEnum
} from '@poss-web/shared/models';
import {
  getCashMemoEndPointUrl,
  manualBillListUrl,
  downloadManualBillUrl,
  getCmRequestListUrl,
  getCmRequestDetailsUrl,
  getCashMemoItemEndPointUrl,
  getCmApprovalRequestUrl,
  getWorkFlowProcessUrl,
  getWorkFlowProcessDetailsUrl
} from '@poss-web/shared/util-api-service';
import {
  CashMemoAdaptor,
  CmRequestAdaptor,
  CmRequestHelper
} from '@poss-web/shared/util-adaptors';
import * as moment from 'moment';
import { CmRequestService } from './cm-request.service';

const cmRequestListCorpPayload: CmRequestListPayload = {
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

const cmRequestListBtqPayload: CmRequestListPayload = {
  approvalStatus: 'PENDING',
  appliedFilters: {
    dateRangeType: 'CUSTOM',
    endDate: moment(1625509800000).valueOf(),
    startDate: moment(1625509800000).valueOf()
  },
  pageIndex: 0,
  pageSize: 10,
  workflowType: 'MANUAL_BILL',
  userType: false
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

const cashMemoItemDetails: CashMemoItemDetails = {
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
};
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

const fileDownloadReq = { id: '1234567', locationCode: 'CPD' };

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
              SGST: { taxCode: 'SGST', taxPercentage: 1.5, taxValue: 1038.59 },
              CGST: { taxCode: 'CGST', taxPercentage: 1.5, taxValue: 1038.59 }
            },
            cess: {}
          },
          {
            taxType: 'ITEMCHARGES',
            taxClass: 'TC73',
            data: {
              SGST: { taxCode: 'SGST', taxPercentage: 1.5, taxValue: 6026.33 },
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

describe('Manual Cash Memo Request Service', () => {
  let httpTestingController: HttpTestingController;
  let cmRequestService: CmRequestService;
  const apiUrl = 'http://localhost:3000';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CmRequestService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    cmRequestService = TestBed.inject(CmRequestService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(cmRequestService).toBeTruthy();
  });

  describe('getCmRequestList - Corp', () => {
    it('should call POST api method with correct url', () => {
      spyOn(CmRequestHelper, 'getCmRequestList').and.returnValue({});
      const path = getCmRequestListUrl(
        cmRequestListCorpPayload.approvalStatus,
        cmRequestListCorpPayload.pageIndex,
        cmRequestListCorpPayload.pageSize,
        cmRequestListCorpPayload.workflowType
      ).path;
      cmRequestService
        .getCmRequestList(
          cmRequestListCorpPayload.approvalStatus,
          cmRequestListCorpPayload.appliedFilters,
          cmRequestListCorpPayload.pageIndex,
          cmRequestListCorpPayload.pageSize,
          cmRequestListCorpPayload.workflowType,
          cmRequestListCorpPayload.userType
        )
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });
    it('should call  CmRequestHelper method with correct arguments', () => {
      spyOn(CmRequestHelper, 'getCmRequestList').and.returnValue({});
      const path = getCmRequestListUrl(
        cmRequestListCorpPayload.approvalStatus,
        cmRequestListCorpPayload.pageIndex,
        cmRequestListCorpPayload.pageSize,
        cmRequestListCorpPayload.workflowType
      ).path;
      cmRequestService
        .getCmRequestList(
          cmRequestListCorpPayload.approvalStatus,
          cmRequestListCorpPayload.appliedFilters,
          cmRequestListCorpPayload.pageIndex,
          cmRequestListCorpPayload.pageSize,
          cmRequestListCorpPayload.workflowType,
          cmRequestListCorpPayload.userType
        )
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush(cmRequestList);
      expect(CmRequestHelper.getCmRequestList).toHaveBeenCalledWith(
        cmRequestList
      );
    });

    it('should retun data mapped by CmRequestHelper', () => {
      spyOn(CmRequestHelper, 'getCmRequestList').and.returnValue(cmRequestList);
      const path = getCmRequestListUrl(
        cmRequestListCorpPayload.approvalStatus,
        cmRequestListCorpPayload.pageIndex,
        cmRequestListCorpPayload.pageSize,
        cmRequestListCorpPayload.workflowType
      ).path;
      cmRequestService
        .getCmRequestList(
          cmRequestListCorpPayload.approvalStatus,
          cmRequestListCorpPayload.appliedFilters,
          cmRequestListCorpPayload.pageIndex,
          cmRequestListCorpPayload.pageSize,
          cmRequestListCorpPayload.workflowType,
          cmRequestListCorpPayload.userType
        )
        .subscribe(data => {
          expect(data).toEqual(cmRequestList);
        });

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path
      );
      request.flush({});
    });
  });

  describe('getCmRequestList - Btq', () => {
    it('should call POST api method with correct url', () => {
      spyOn(CmRequestHelper, 'getCmRequestList').and.returnValue({});
      const reqBody = cmRequestListBtqPayload.appliedFilters;
      const requestParams = {
        workflowType: WorkflowTypeEnum.MANUAL_BILL,
        approvalStatus: cmRequestListBtqPayload.approvalStatus,
        size: cmRequestListBtqPayload.pageSize,
        page: cmRequestListBtqPayload.pageIndex
      };
      const path = getWorkFlowProcessUrl(requestParams).path;
      cmRequestService
        .getCmRequestList(
          cmRequestListBtqPayload.approvalStatus,
          cmRequestListBtqPayload.appliedFilters,
          cmRequestListBtqPayload.pageIndex,
          cmRequestListBtqPayload.pageSize,
          cmRequestListBtqPayload.workflowType,
          cmRequestListBtqPayload.userType
        )
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });
    it('should call  CmRequestHelper method with correct arguments', () => {
      spyOn(CmRequestHelper, 'getCmRequestList').and.returnValue({});
      const reqBody = cmRequestListBtqPayload.appliedFilters;
      const requestParams = {
        workflowType: WorkflowTypeEnum.MANUAL_BILL,
        approvalStatus: cmRequestListBtqPayload.approvalStatus,
        size: cmRequestListBtqPayload.pageSize,
        page: cmRequestListBtqPayload.pageIndex
      };
      const path = getWorkFlowProcessUrl(requestParams).path;
      cmRequestService
        .getCmRequestList(
          cmRequestListBtqPayload.approvalStatus,
          cmRequestListBtqPayload.appliedFilters,
          cmRequestListBtqPayload.pageIndex,
          cmRequestListBtqPayload.pageSize,
          cmRequestListBtqPayload.workflowType,
          cmRequestListBtqPayload.userType
        )
        .subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush(cmRequestList);
      expect(CmRequestHelper.getCmRequestList).toHaveBeenCalledWith(
        cmRequestList
      );
    });

    it('should retun data mapped by CmRequestHelper', () => {
      spyOn(CmRequestHelper, 'getCmRequestList').and.returnValue(cmRequestList);
      const reqBody = cmRequestListBtqPayload.appliedFilters;
      const requestParams = {
        workflowType: WorkflowTypeEnum.MANUAL_BILL,
        approvalStatus: cmRequestListBtqPayload.approvalStatus,
        size: cmRequestListBtqPayload.pageSize,
        page: cmRequestListBtqPayload.pageIndex
      };
      const path = getWorkFlowProcessUrl(requestParams).path;
      cmRequestService
        .getCmRequestList(
          cmRequestListBtqPayload.approvalStatus,
          cmRequestListBtqPayload.appliedFilters,
          cmRequestListBtqPayload.pageIndex,
          cmRequestListBtqPayload.pageSize,
          cmRequestListBtqPayload.workflowType,
          cmRequestListBtqPayload.userType
        )
        .subscribe(data => {
          expect(data).toEqual(cmRequestList);
        });

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path
      );
      request.flush({});
    });
  });

  describe('getCmRequestDetails - Corp', () => {
    it('should call GET api method with correct url', () => {
      spyOn(CmRequestAdaptor, 'getUserType').and.returnValue({});
      spyOn(CmRequestAdaptor, 'getCmRequestDetailsFromJson').and.returnValue(
        {}
      );
      const path = getCmRequestDetailsUrl(
        cmRequestDetailsCorpPayload.processId,
        cmRequestDetailsCorpPayload.taskId,
        cmRequestDetailsCorpPayload.taskName,
        cmRequestDetailsCorpPayload.workFlowType
      ).path;
      cmRequestService
        .getCmRequestDetails(
          cmRequestDetailsCorpPayload.processId,
          cmRequestDetailsCorpPayload.taskId,
          cmRequestDetailsCorpPayload.taskName,
          cmRequestDetailsCorpPayload.workFlowType,
          cmRequestDetailsCorpPayload.userType
        )
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });
    it('should call  CmRequestAdaptor method with correct arguments', () => {
      spyOn(CmRequestAdaptor, 'getUserType').and.returnValue({});
      spyOn(CmRequestAdaptor, 'getCmRequestDetailsFromJson').and.returnValue(
        {}
      );
      const path = getCmRequestDetailsUrl(
        cmRequestDetailsCorpPayload.processId,
        cmRequestDetailsCorpPayload.taskId,
        cmRequestDetailsCorpPayload.taskName,
        cmRequestDetailsCorpPayload.workFlowType
      ).path;
      cmRequestService
        .getCmRequestDetails(
          cmRequestDetailsCorpPayload.processId,
          cmRequestDetailsCorpPayload.taskId,
          cmRequestDetailsCorpPayload.taskName,
          cmRequestDetailsCorpPayload.workFlowType,
          cmRequestDetailsCorpPayload.userType
        )
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush(cmRequestDetails);
      expect(CmRequestAdaptor.getCmRequestDetailsFromJson).toHaveBeenCalledWith(
        cmRequestDetails
      );
    });

    it('should retun data mapped by CmRequestAdaptor', () => {
      spyOn(CmRequestAdaptor, 'getCmRequestDetailsFromJson').and.returnValue(
        cmRequestDetails
      );
      spyOn(CmRequestAdaptor, 'getUserType').and.returnValue({
        data: cmRequestDetails,
        userType: true
      });
      const path = getCmRequestDetailsUrl(
        cmRequestDetailsCorpPayload.processId,
        cmRequestDetailsCorpPayload.taskId,
        cmRequestDetailsCorpPayload.taskName,
        cmRequestDetailsCorpPayload.workFlowType
      ).path;
      cmRequestService
        .getCmRequestDetails(
          cmRequestDetailsCorpPayload.processId,
          cmRequestDetailsCorpPayload.taskId,
          cmRequestDetailsCorpPayload.taskName,
          cmRequestDetailsCorpPayload.workFlowType,
          cmRequestDetailsCorpPayload.userType
        )
        .subscribe(data => {
          expect(data).toEqual({
            data: cmRequestDetails,
            userType: true
          });
        });

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path
      );
      request.flush({});
    });
  });

  describe('getCmRequestDetails - Btq', () => {
    it('should call GET api method with correct url', () => {
      spyOn(CmRequestAdaptor, 'getUserType').and.returnValue({});
      spyOn(CmRequestAdaptor, 'getCmRequestDetailsFromJson').and.returnValue(
        {}
      );
      const requestParams = {
        workflowType: WorkflowTypeEnum.MANUAL_BILL,
        processId: cmRequestDetailsBtqPayload.processId
      };
      const path = getWorkFlowProcessDetailsUrl(requestParams).path;
      cmRequestService
        .getCmRequestDetails(
          cmRequestDetailsBtqPayload.processId,
          cmRequestDetailsBtqPayload.taskId,
          cmRequestDetailsBtqPayload.taskName,
          cmRequestDetailsBtqPayload.workFlowType,
          cmRequestDetailsBtqPayload.userType
        )
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });
    it('should call  CmRequestAdaptor method with correct arguments', () => {
      spyOn(CmRequestAdaptor, 'getUserType').and.returnValue({});
      spyOn(CmRequestAdaptor, 'getCmRequestDetailsFromJson').and.returnValue(
        {}
      );
      const requestParams = {
        workflowType: WorkflowTypeEnum.MANUAL_BILL,
        processId: cmRequestDetailsBtqPayload.processId
      };
      const path = getWorkFlowProcessDetailsUrl(requestParams).path;
      cmRequestService
        .getCmRequestDetails(
          cmRequestDetailsBtqPayload.processId,
          cmRequestDetailsBtqPayload.taskId,
          cmRequestDetailsBtqPayload.taskName,
          cmRequestDetailsBtqPayload.workFlowType,
          cmRequestDetailsBtqPayload.userType
        )
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush(cmRequestDetails);
      expect(CmRequestAdaptor.getCmRequestDetailsFromJson).toHaveBeenCalledWith(
        cmRequestDetails
      );
    });

    it('should retun data mapped by CmRequestAdaptor', () => {
      spyOn(CmRequestAdaptor, 'getCmRequestDetailsFromJson').and.returnValue(
        cmRequestDetails
      );
      spyOn(CmRequestAdaptor, 'getUserType').and.returnValue({
        data: cmRequestDetails,
        userType: true
      });
      const requestParams = {
        workflowType: WorkflowTypeEnum.MANUAL_BILL,
        processId: cmRequestDetailsBtqPayload.processId
      };
      const path = getWorkFlowProcessDetailsUrl(requestParams).path;
      cmRequestService
        .getCmRequestDetails(
          cmRequestDetailsBtqPayload.processId,
          cmRequestDetailsBtqPayload.taskId,
          cmRequestDetailsBtqPayload.taskName,
          cmRequestDetailsBtqPayload.workFlowType,
          cmRequestDetailsBtqPayload.userType
        )
        .subscribe(data => {
          expect(data).toEqual({
            data: cmRequestDetails,
            userType: true
          });
        });

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path
      );
      request.flush({});
    });
  });

  describe('getCmProductList', () => {
    it('should call GET api method with correct url', () => {
      spyOn(CashMemoAdaptor, 'cashMemoDetailsResponseFromJson').and.returnValue(
        {}
      );
      const path = getCashMemoEndPointUrl(
        cashMemoDetailsRequestPayload.txnType,
        cashMemoDetailsRequestPayload.subTxnType,
        cashMemoDetailsRequestPayload.id
      ).path;
      cmRequestService
        .getCmProductList(
          cashMemoDetailsRequestPayload.id,
          cashMemoDetailsRequestPayload.txnType,
          cashMemoDetailsRequestPayload.subTxnType
        )
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });
    it('should call  CashMemoAdaptor method with correct arguments', () => {
      spyOn(CashMemoAdaptor, 'cashMemoDetailsResponseFromJson').and.returnValue(
        {}
      );
      const path = getCashMemoEndPointUrl(
        cashMemoDetailsRequestPayload.txnType,
        cashMemoDetailsRequestPayload.subTxnType,
        cashMemoDetailsRequestPayload.id
      ).path;
      cmRequestService
        .getCmProductList(
          cashMemoDetailsRequestPayload.id,
          cashMemoDetailsRequestPayload.txnType,
          cashMemoDetailsRequestPayload.subTxnType
        )
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush(cashMemoDetailsResponse);
      expect(
        CashMemoAdaptor.cashMemoDetailsResponseFromJson
      ).toHaveBeenCalledWith(cashMemoDetailsResponse);
    });

    it('should retun data mapped by CashMemoAdaptor', () => {
      spyOn(CashMemoAdaptor, 'cashMemoDetailsResponseFromJson').and.returnValue(
        cashMemoDetailsResponse
      );

      const path = getCashMemoEndPointUrl(
        cashMemoDetailsRequestPayload.txnType,
        cashMemoDetailsRequestPayload.subTxnType,
        cashMemoDetailsRequestPayload.id
      ).path;
      cmRequestService
        .getCmProductList(
          cashMemoDetailsRequestPayload.id,
          cashMemoDetailsRequestPayload.txnType,
          cashMemoDetailsRequestPayload.subTxnType
        )
        .subscribe(data => {
          expect(data).toEqual(cashMemoDetailsResponse);
        });

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path
      );
      request.flush({});
    });
  });

  describe('getCmProductDetails', () => {
    it('should call GET api method with correct url', () => {
      spyOn(CashMemoAdaptor, 'cashMemoItemDetailsFromJson').and.returnValue({});
      const path = getCashMemoItemEndPointUrl(
        cashMemoItemDetailsRequestPayload.id,
        cashMemoItemDetailsRequestPayload.txnType,
        cashMemoItemDetailsRequestPayload.subTxnType,
        cashMemoItemDetailsRequestPayload.itemId
      ).path;
      cmRequestService
        .getCmProductDetails(
          cashMemoItemDetailsRequestPayload.id,
          cashMemoItemDetailsRequestPayload.itemId,
          cashMemoItemDetailsRequestPayload.txnType,
          cashMemoItemDetailsRequestPayload.subTxnType
        )
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });
    it('should call  CashMemoAdaptor method with correct arguments', () => {
      spyOn(CashMemoAdaptor, 'cashMemoItemDetailsFromJson').and.returnValue({});
      const path = getCashMemoItemEndPointUrl(
        cashMemoItemDetailsRequestPayload.id,
        cashMemoItemDetailsRequestPayload.txnType,
        cashMemoItemDetailsRequestPayload.subTxnType,
        cashMemoItemDetailsRequestPayload.itemId
      ).path;
      cmRequestService
        .getCmProductDetails(
          cashMemoItemDetailsRequestPayload.id,
          cashMemoItemDetailsRequestPayload.itemId,
          cashMemoItemDetailsRequestPayload.txnType,
          cashMemoItemDetailsRequestPayload.subTxnType
        )
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush(cashMemoItemDetails);
      expect(CashMemoAdaptor.cashMemoItemDetailsFromJson).toHaveBeenCalledWith(
        cashMemoItemDetails
      );
    });

    it('should retun data mapped by CashMemoAdaptor', () => {
      spyOn(CashMemoAdaptor, 'cashMemoItemDetailsFromJson').and.returnValue(
        cashMemoItemDetails
      );

      const path = getCashMemoItemEndPointUrl(
        cashMemoItemDetailsRequestPayload.id,
        cashMemoItemDetailsRequestPayload.txnType,
        cashMemoItemDetailsRequestPayload.subTxnType,
        cashMemoItemDetailsRequestPayload.itemId
      ).path;
      cmRequestService
        .getCmProductDetails(
          cashMemoItemDetailsRequestPayload.id,
          cashMemoItemDetailsRequestPayload.itemId,
          cashMemoItemDetailsRequestPayload.txnType,
          cashMemoItemDetailsRequestPayload.subTxnType
        )
        .subscribe(data => {
          expect(data).toEqual(cashMemoItemDetails);
        });

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path
      );
      request.flush({});
    });
  });

  describe('getCmApprovalRequest', () => {
    it('should call PUT api method with correct url', () => {
      spyOn(CmRequestAdaptor, 'getCmApprovalRequestFromJson').and.returnValue(
        {}
      );
      const path = getCmApprovalRequestUrl(
        cmApprovalRequestPayload.isApprove,
        cmApprovalRequestPayload.processId,
        cmApprovalRequestPayload.taskId,
        cmApprovalRequestPayload.taskName
      ).path;
      cmRequestService
        .getCmApprovalRequest(
          cmApprovalRequestPayload.isApprove,
          cmApprovalRequestPayload.requestBody,
          cmApprovalRequestPayload.processId,
          cmApprovalRequestPayload.taskId,
          cmApprovalRequestPayload.taskName
        )
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PUT');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });
    it('should call  CashMemoAdaptor method with correct arguments', () => {
      spyOn(CmRequestAdaptor, 'getCmApprovalRequestFromJson').and.returnValue(
        {}
      );
      const path = getCmApprovalRequestUrl(
        cmApprovalRequestPayload.isApprove,
        cmApprovalRequestPayload.processId,
        cmApprovalRequestPayload.taskId,
        cmApprovalRequestPayload.taskName
      ).path;
      cmRequestService
        .getCmApprovalRequest(
          cmApprovalRequestPayload.isApprove,
          cmApprovalRequestPayload.requestBody,
          cmApprovalRequestPayload.processId,
          cmApprovalRequestPayload.taskId,
          cmApprovalRequestPayload.taskName
        )
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush(approvalRequest);
      expect(
        CmRequestAdaptor.getCmApprovalRequestFromJson
      ).toHaveBeenCalledWith(approvalRequest);
    });

    it('should retun data mapped by CashMemoAdaptor', () => {
      spyOn(CmRequestAdaptor, 'getCmApprovalRequestFromJson').and.returnValue(
        approvalRequest
      );

      const path = getCmApprovalRequestUrl(
        cmApprovalRequestPayload.isApprove,
        cmApprovalRequestPayload.processId,
        cmApprovalRequestPayload.taskId,
        cmApprovalRequestPayload.taskName
      ).path;
      cmRequestService
        .getCmApprovalRequest(
          cmApprovalRequestPayload.isApprove,
          cmApprovalRequestPayload.requestBody,
          cmApprovalRequestPayload.processId,
          cmApprovalRequestPayload.taskId,
          cmApprovalRequestPayload.taskName
        )
        .subscribe(data => {
          expect(data).toEqual(approvalRequest);
        });

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path
      );
      request.flush({});
    });
  });

  describe('uploadFileList', () => {
    it('should call GET api method with correct url', () => {
      const path = manualBillListUrl(fileUploadDownloadPayload);
      cmRequestService.uploadFileList(fileUploadDownloadPayload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });
  });

  describe('downloadFile', () => {
    it('should call GET api method with correct url', () => {
      const path = downloadManualBillUrl(fileDownloadReq);
      cmRequestService.downloadFile(fileDownloadReq).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });
  });
});
