import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
  BcTypesEnum,
  BillCancellation,
  BillCancellationRequests,
  BillCancelPayload,
  CancelResponse,
  CashMemoDetailsResponse,
  CashMemoItemDetails,
  CmBillList,
  CmBillListPayload,
  ConfirmResponse,
  StatusTypesEnum
} from '@poss-web/shared/models';
import {
  BillCancellationRequestsHelper,
  CashMemoAdaptor
} from '@poss-web/shared/util-adaptors';
import {
  cancelBillCancelUrl,
  confirmBillCancelUrl,
  deleteBillCancelUrl,
  getBillCancellationRequestUrl,
  getBillCountUrl,
  getCashMemoEndPointUrl,
  getCashMemoItemEndPointUrl,
  getWorkFlowProcessDetailsUrl,
  putBillCancellationUrl
} from '@poss-web/shared/util-api-service';
import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import * as moment from 'moment';
import {
  ApprovePayload,
  BillCancellationRequestsListPayload,
  BillCancelListPayload
} from './+state/bill-cancellation-requests.actions';
import { BillCancellationRequestsService } from './bill-cancellation-requests.service';

describe('billCancelService ', () => {
  let httpTestingController: HttpTestingController;
  let billCancelService: BillCancellationRequestsService;
  const apiUrl = 'http://localhost:3000';

  const CmItemDetailsResponse: CashMemoItemDetails = {
    itemCode: '503820DCEABAP1',
    lotNumber: '2EA000011',
    // inventoryWeight: 12.081
    unitWeight: 12.081,
    totalWeight: 12.05,
    totalQuantity: 1,
    inventoryId: 'AAB96E94-3AF9-4ADD-A6FC-0044417CDD67',
    unitValue: 60002.3,
    totalValue: 60002.3,
    totalDiscount: 0.0,
    finalValue: 61802.36,
    totalTax: 1800.06,
    employeeCode: 'rsocpd',
    remarks: 'asd',
    reason: null,
    itemId: '741B3399-ED98-44D8-B25D-BBDADCA2F1D2',
    binCode: 'ZEROBIN',
    rowId: 1,
    refTxnId: null,
    refTxnType: null,
    inventoryWeightDetails: {
      type: 'WEIGHT_DETAILS',
      data: {
        goldWeight: 12.081,
        platinumWeight: 0,
        silverWeight: 0,
        stoneWeight: 0.53,
        materialWeight: 0,
        diamondWeight: 0.0
      }
    },
    measuredWeightDetails: {
      type: 'WEIGHT_DETAILS',
      data: {
        silverWeight: 0.0,
        stoneWeight: 0,
        materialWeight: 0,
        goldWeight: 0.0,
        diamondWeight: 0,
        platinumWeight: 0.0
      }
    },
    priceDetails: {
      isUcp: true,
      netWeight: 67,
      metalPriceDetails: {
        preDiscountValue: 46948.85,
        metalPrices: [
          {
            weightUnit: 'gms',
            netWeight: 12.05,
            metalValue: 46948.85,
            type: 'Gold',
            ratePerUnit: 3896.17,
            karat: 18.0,
            purity: 75.0,
            metalTypeCode: 'J'
          }
        ]
      },
      stonePriceDetails: {
        preDiscountValue: 612.0,
        weightUnit: null,
        stoneWeight: null,
        numberOfStones: null,
        stoneWeightForView: null,
        weightUnitForView: null
      },
      makingChargeDetails: {
        makingChargePct: 5,
        makingChargePgram: 6,
        wastagePct: 7,
        isDynamicPricing: true,
        preDiscountValue: 12441.45,
        makingChargePercentage: 26.5
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
      taxClass: 'TC75',
      data: { taxCode: 'CGST', taxPercentage: 1.5, taxValue: 900.03 },
      cess: null
    },
    productGroupCode: '75',
    productCategoryCode: 'D',
    discountDetails: null,
    focDetails: {},
    isFoc: true,
    itemInStock: true,
    refSubTxnType: 'NEW_AB',
    hallmarkCharges: 350,
    hallmarkDiscount: 350
  };

  const billCancelPayload: BillCancelPayload = {
    cancelType: 'CANCEL_WITH_CN',
    employeeCode: 'rso',
    reasonForCancellation: 'test',
    refTxnId: '78B06AC4-1EEE-4901-ACAB-4C1C0C5F3A28',
    remarks: 'test'
  };

  const cancelResponse: CancelResponse = {
    cndocNos: [234, 235],
    docNo: 12,
    id: '78B06AC4-1EEE-4901-ACAB-4C1C0C5F3A28'
  };

  const confirmResponse: ConfirmResponse = {
    docNo: 12,
    id: '78B06AC4-1EEE-4901-ACAB-4C1C0C5F3A28',
    requestNo: '90'
  };

  const cashMemoDetailsResponse: CashMemoDetailsResponse = {
    customerId: 6,
    occasion: 'Wedding/Marriage',
    totalQuantity: 1,
    totalWeight: 12.05,
    totalValue: 60002.3,
    totalTax: 1800.06,
    finalValue: 61802.0,
    totalDiscount: 0.0,
    paidValue: 61802.0,
    remarks: 'Remarks',
    // otherCharges: null,
    otherChargesList: null,
    metalRateList: {
      metalRates: {
        J: {
          metalTypeCode: 'J',
          purity: 91.62,
          ratePerUnit: 4762,
          currency: 'INR',
          applicableDate: 1611081000000,
          karat: 22.0
        },
        L: {
          metalTypeCode: 'L',
          purity: 95.0,
          ratePerUnit: 3473,
          currency: 'INR',
          applicableDate: 1611081000000,
          karat: 0.0
        }
      }
    },
    id: '78B06AC4-1EEE-4901-ACAB-4C1C0C5F3A28',
    status: StatusTypesEnum.CONFIRMED,
    refTxnId: null,
    refTxnType: null,
    docNo: 54,
    docDate: moment(1611081000000),
    fiscalYear: 2020,
    firstHoldTime: moment(1610012299519),
    lastHoldTime: moment(1610012299519),
    roundingVariance: -0.36,
    employeeCode: 'cashiercpd',
    txnType: 'CM',
    subTxnType: 'NEW_CM',
    // confirmedTime: moment(1611110936440),
    manualBillDetails: null,
    taxDetails: {
      // taxes: [
      //   {
      //     taxType: 'ITEMCHARGES',
      //     taxClass: 'TC75',
      //     data: [
      //       { taxCode: 'CGST', taxPercentage: 1.5, taxValue: 900.03 },
      //       { taxCode: 'SGST', taxPercentage: 1.5, taxValue: 900.03 }
      //     ],
      //     cess: []
      //   }
      // ]
      taxType: 'ITEMCHARGES',
      taxClass: 'TC75',
      data: { taxCode: 'CGST', taxPercentage: 1.5, taxValue: 900.03 },
      cess: null
    },
    // currencyCode: 'INR',
    // weightUnit: 'gms',
    // manualBillId: null,
    discountDetails: null,
    itemIdList: ['741B3399-ED98-44D8-B25D-BBDADCA2F1D2'],
    focDetails: null,
    txnTime: null,
    refSubTxnType: 'NEW_AB',
    customerDocDetails: null,
    cancelTxnId: 1,
    refDocNo: 1,
    refFiscalYear: 2022,
    hallmarkCharges: 350,
    hallmarkDiscount: 350
  };

  const cmBillListPayload: CmBillListPayload = {
    subTxnType: 'NEW_CM',
    txnType: 'CM',
    sort: 'docDate, DESC',
    pageIndex: 0,
    pageSize: 10,
    customerName: 'TESTCUSTOMER',
    refDocNo: 56
  };

  const cmBillList: CmBillList[] = [
    {
      currencyCode: 'INR',
      customerName: 'SREENIVAS',
      refDocDate: moment(1611081000000),
      refDocNo: 54,
      refTxnId: '78B06AC4-1EEE-4901-ACAB-4C1C0C5F3A28',
      refTxnTime: moment(1611110936440),
      subTxnType: 'NEW_CM',
      totalValue: 60002.3,
      txnType: 'CM',
      totalElements: 10
    }
  ];

  const billCancellationRequestsListPayload: BillCancellationRequestsListPayload = {
    approvalStatus: 'PENDING',
    workflowType: 'BILL_CANCELLATION',
    body: {}
  };

  const billCancellation: BillCancellation = {
    approvedBy: null,
    approvedDate: null,
    approverRemarks: null,
    docNo: 8,
    fiscalYear: 2022,
    headerData: {},
    processId: 'F17D8C04-CD05-11EC-9F7B-00155DB7A401',
    requestedBy: 'cashiercpd',
    requestedDate: 1651818595489,
    requestorRemarks: null,
    workflowType: 'BILL_CANCELLATION',
    invoiceNo: 2,
    docDate: moment(1651818595489),
    customerName: '353',
    totalAmount: 10000,
    locationCode: 'CPD',
    taskId: '1',
    taskName: null
  };

  const billCancellationRequests: BillCancellationRequests = {
    results: [billCancellation],
    count: 1
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        BillCancellationRequestsService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    billCancelService = TestBed.inject(BillCancellationRequestsService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(billCancelService).toBeTruthy();
  });

  describe('confirm', () => {
    it('should call POST api method with correct url and params', () => {
      const { path, params } = confirmBillCancelUrl({
        body: billCancelPayload,
        subTxnType: BcTypesEnum.CASH_MEMO
      });

      billCancelService
        .confirm({ body: billCancelPayload, subTxnType: BcTypesEnum.CASH_MEMO })
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.params.get('txnType')).toEqual('CMCAN');

      request.flush({});
    });
  });

  describe('cancel', () => {
    it('should call PUT api method with correct url and params', () => {
      const dumbId = {
        id: '454',
        subTxnType: BcTypesEnum.CASH_MEMO
      };
      const { path, params } = cancelBillCancelUrl({
        id: '454',
        subTxnType: BcTypesEnum.CASH_MEMO
      });

      billCancelService.cancel(dumbId).subscribe();

      const request = httpTestingController.expectOne(req => {
        console.log(req, req.url, apiUrl, path, 'pathh');
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PUT');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.toString()).toEqual(params.toString());

      request.flush({});
    });
  });

  describe('delete', () => {
    it('should call DELETE api method with correct url and params', () => {
      const dumbId = {
        id: '454',
        subTxnType: BcTypesEnum.CASH_MEMO
      };
      const { path, params } = deleteBillCancelUrl({
        id: '454',
        subTxnType: BcTypesEnum.CASH_MEMO
      });

      billCancelService.delete(dumbId).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('DELETE');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.toString()).toEqual(params.toString());

      request.flush({});
    });
  });

  describe('selectedData', () => {
    it('should call GET api method with correct url and params', () => {
      const dumbId = {
        id: '454',
        subTxnType: BcTypesEnum.CASH_MEMO
      };
      const { path, params } = getWorkFlowProcessDetailsUrl({
        id: '454',
        subTxnType: BcTypesEnum.CASH_MEMO
      });

      billCancelService.selectedData(dumbId).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.toString()).toEqual(params.toString());

      request.flush({});
    });
  });

  describe('viewCashMemo', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(CashMemoAdaptor, 'cashMemoDetailsResponseFromJson').and.returnValue(
        {}
      );

      const { path, params } = getCashMemoEndPointUrl(
        'CM',
        'NEW_CM',
        '78B06AC4-1EEE-4901-ACAB-4C1C0C5F3A28'
      );

      billCancelService
        .viewCashMemo('78B06AC4-1EEE-4901-ACAB-4C1C0C5F3A28', 'CM', 'NEW_CM')
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.params.get('txnType')).toEqual('CM');

      request.flush({});
    });

    it('should call CashMemoAdaptor adaptor method with correct arguments', () => {
      spyOn(CashMemoAdaptor, 'cashMemoDetailsResponseFromJson').and.returnValue(
        {}
      );

      const path = getCashMemoEndPointUrl(
        'CM',
        'NEW_CM',
        '78B06AC4-1EEE-4901-ACAB-4C1C0C5F3A28'
      ).path;

      billCancelService
        .viewCashMemo('78B06AC4-1EEE-4901-ACAB-4C1C0C5F3A28', 'CM', 'NEW_CM')
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(cashMemoDetailsResponse);
      expect(
        CashMemoAdaptor.cashMemoDetailsResponseFromJson
      ).toHaveBeenCalledWith(cashMemoDetailsResponse);
    });

    it('should retun data mapped by CashMemoAdaptor adaptor', () => {
      spyOn(CashMemoAdaptor, 'cashMemoDetailsResponseFromJson').and.returnValue(
        cashMemoDetailsResponse
      );

      const path = getCashMemoEndPointUrl(
        'CM',
        'NEW_CM',
        '78B06AC4-1EEE-4901-ACAB-4C1C0C5F3A28'
      ).path;

      billCancelService
        .viewCashMemo('78B06AC4-1EEE-4901-ACAB-4C1C0C5F3A28', 'CM', 'NEW_CM')
        .subscribe(data => {
          expect(data).toEqual(cashMemoDetailsResponse);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush({});
    });
  });

  describe('getItemFromCashMemo', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(CashMemoAdaptor, 'cashMemoItemDetailsFromJson').and.returnValue({});

      const { path, params } = getCashMemoItemEndPointUrl(
        '78B06AC4-1EEE-4901-ACAB-4C1C0C5F3A28',
        'CM',
        'NEW_CM',
        '741B3399-ED98-44D8-B25D-BBDADCA2F1D2'
      );

      billCancelService
        .getItemFromCashMemo(
          '78B06AC4-1EEE-4901-ACAB-4C1C0C5F3A28',
          '741B3399-ED98-44D8-B25D-BBDADCA2F1D2',
          'CM',
          'NEW_CM'
        )
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.params.get('txnType')).toEqual('CM');

      request.flush({});
    });

    it('should call CashMemoAdaptor adaptor method with correct arguments', () => {
      spyOn(CashMemoAdaptor, 'cashMemoItemDetailsFromJson').and.returnValue({});

      const path = getCashMemoItemEndPointUrl(
        '78B06AC4-1EEE-4901-ACAB-4C1C0C5F3A28',
        'CM',
        'NEW_CM',
        '741B3399-ED98-44D8-B25D-BBDADCA2F1D2'
      ).path;

      billCancelService
        .getItemFromCashMemo(
          '78B06AC4-1EEE-4901-ACAB-4C1C0C5F3A28',
          '741B3399-ED98-44D8-B25D-BBDADCA2F1D2',
          'CM',
          'NEW_CM'
        )
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(CmItemDetailsResponse);
      expect(CashMemoAdaptor.cashMemoItemDetailsFromJson).toHaveBeenCalledWith(
        CmItemDetailsResponse
      );
    });

    it('should retun data mapped by CashMemoAdaptor adaptor', () => {
      spyOn(CashMemoAdaptor, 'cashMemoItemDetailsFromJson').and.returnValue(
        CmItemDetailsResponse
      );

      const path = getCashMemoItemEndPointUrl(
        '78B06AC4-1EEE-4901-ACAB-4C1C0C5F3A28',
        'CM',
        'NEW_CM',
        '741B3399-ED98-44D8-B25D-BBDADCA2F1D2'
      ).path;

      billCancelService
        .getItemFromCashMemo(
          '78B06AC4-1EEE-4901-ACAB-4C1C0C5F3A28',
          '741B3399-ED98-44D8-B25D-BBDADCA2F1D2',
          'CM',
          'NEW_CM'
        )
        .subscribe(data => {
          expect(data).toEqual(CmItemDetailsResponse);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush({});
    });
  });

  describe('putBillCancellation', () => {
    const approvePayload: ApprovePayload = {
      approved: 'true',
      body: {
        approvedData: {
          data: {},
          type: null
        },
        approverRemarks: 'test'
      },
      processId: 'p1',
      taskId: 't1',
      taskName: 'testName'
    };

    const billCancelListPayload: BillCancelListPayload = {
      httpMethod: 'PUT',
      relativeUrl: 'http://test.com',
      reqBody: {},
      requestParams: {
        workflowType: 'BILL_CANCELLATION',
        approvalStatus: 'PENDING'
      }
    };
    it('should call PUT api method with correct url and params', () => {
      const { path, params } = putBillCancellationUrl(approvePayload);

      billCancelService.putBillCancellation(approvePayload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PUT');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
  });

  describe('getloadBillRequest', () => {
    it('should call POST api method with correct url and params', () => {
      spyOn(BillCancellationRequestsHelper, 'getBills').and.returnValue({});
      const { path, params } = getBillCancellationRequestUrl(
        billCancellationRequestsListPayload
      );

      billCancelService
        .getloadBillRequest(billCancellationRequestsListPayload)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.toString()).toEqual(params.toString());

      request.flush({});
    });
  });

  // describe('getloadBillRequestStatus', () => {
  //   const billCancelListPayload: BillCancelListPayload = {
  //     httpMethod: 'GET',
  //     relativeUrl: 'http://test.com',
  //     reqBody: {},
  //     requestParams: {
  //       workflowType: 'BILL_CANCELLATION',
  //       approvalStatus: 'PENDING',
  //       page: 0,
  //       size: 10
  //     }
  //   }
  //   it('should call POST api method with correct url and params', () => {
  //     const { path, params } = getWorkFlowProcessUrl(billCancelListPayload.requestParams);

  //     billCancelService.getloadBillRequestStatus(billCancelListPayload).subscribe();

  //     const request = httpTestingController.expectOne(req => {
  //       return req.url === apiUrl + path;
  //     });
  //     expect(request.cancelled).toBeFalsy();
  //     // expect(request.request.method).toEqual('POST');
  //     // expect(request.request.responseType).toEqual('json');
  //     // expect(request.request.params.toString()).toEqual(params.toString());

  //     request.flush({});
  //   });
  // });

  describe('getloadBillRequestCount', () => {
    const billCancellationRequestsListPayload: BillCancellationRequestsListPayload = {
      approvalStatus: 'PENDING',
      workflowType: 'BILL_CANCELLATION',
      body: {}
    };
    it('should call get api method with correct url and params', () => {
      const { path, params } = getBillCountUrl(
        billCancellationRequestsListPayload
      );

      billCancelService
        .getloadBillRequestCount(billCancellationRequestsListPayload)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.toString()).toEqual(params.toString());

      request.flush({});
    });
  });
});
