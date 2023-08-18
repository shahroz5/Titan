import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
  BcTypesEnum,
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
  BillCancellationRequestsAdaptor,
  BillCancellationRequestsHelper,
  CashMemoAdaptor
} from '@poss-web/shared/util-adaptors';
import {
  confirmBillCancelUrl,
  directCancelBillCancelUrl,
  getBillCancellationHistoryDetailsUrl,
  getCancelTypeEndPointUrl,
  getCashMemoEndPointUrl,
  getCashMemoItemEndPointUrl,
  getCmBillListEndpointUrl
} from '@poss-web/shared/util-api-service';
import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import * as moment from 'moment';
import { CancelTypePayload } from './+state/bill-cancel.actions';
import { BillCancelService } from './bill-cancel.service';

describe('billCancelService ', () => {
  let httpTestingController: HttpTestingController;
  let billCancelService: BillCancelService;
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
      isUcp: false,
      netWeight: 3,
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
        preDiscountValue: 12441.45,
        makingChargePercentage: 26.5,
        makingChargePct: 5,
        makingChargePgram: 6,
        wastagePct: 7,
        isDynamicPricing: true
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
    customerId: 1,
    cancelTxnId: 1,
    discountDetails: 0,
    docDate: moment(12345678),
    docNo: 1,
    employeeCode: 'code',
    finalValue: 123,
    firstHoldTime: moment(1610012299519),
    fiscalYear: 2015,
    focDetails: {},
    id: '2',
    taxDetails: {
      cess: {
        cessCode: 'cess code',
        cessOnTax: false,
        cessPercentage: 3,
        cessValue: 3400
      },
      data: {
        taxCode: 'CGST',
        taxPercentage: 1.5,
        taxValue: 437.47
      },
      taxClass: 'TC72',
      taxType: 'ITEMCHARGES'
    },
    lastHoldTime: moment(),
    metalRateList: {},
    occasion: 'Wedding',
    txnType: 'MANUAL_GRF',
    otherChargesList: {},
    paidValue: 721,
    refTxnId: null,
    refTxnType: '',
    remarks: 'APPROVING IT',
    roundingVariance: 1,
    status: StatusTypesEnum.APPROVED,
    subTxnType: 'SUB_TXN',
    totalDiscount: 1,
    totalQuantity: 12,
    totalTax: 1800.6,
    totalValue: 826133,
    totalWeight: 269.728,
    txnTime: moment(161111093),
    customerDocDetails: null,
    refSubTxnType: 'MANUAL_AB',
    hallmarkCharges: 0,
    hallmarkDiscount: 0,
    refDocNo: 0,
    refFiscalYear: 0,
    cancelRemarks: ''
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

  const bcHistoryDetails = {
    customerName: 'test',
    createdDate: '11-11-1999',
    createdBy: 'cpd',
    docNo: 1,
    docDate: '11-11-1999',
    fiscalYear: 2020,
    netAmount: 111,
    cancelReason: 'cancel',
    cancellationType: 'cpd',
    page: 1,
    size: 10,
    cmId: 123
  };

  const cancelTypePayload: CancelTypePayload = {
    refTxnId: '78B06AC4-1EEE-4901-ACAB-4C1C0C5F3A28',
    subTxnType: 'NEW_CM',
    txnType: 'CM'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        BillCancelService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    billCancelService = TestBed.inject(BillCancelService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(billCancelService).toBeTruthy();
  });

  describe('confirm', () => {
    it('should call POST api method with correct url and params', () => {
      spyOn(
        BillCancellationRequestsAdaptor,
        'getConfirmResFromJson'
      ).and.returnValue({});

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

    it('should call BillCancellationRequestsAdaptor adaptor method with correct arguments', () => {
      spyOn(
        BillCancellationRequestsAdaptor,
        'getConfirmResFromJson'
      ).and.returnValue({});

      const path = confirmBillCancelUrl({
        body: billCancelPayload,
        subTxnType: BcTypesEnum.CASH_MEMO
      }).path;

      billCancelService
        .confirm({ body: billCancelPayload, subTxnType: BcTypesEnum.CASH_MEMO })
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(confirmResponse);
      expect(
        BillCancellationRequestsAdaptor.getConfirmResFromJson
      ).toHaveBeenCalledWith(confirmResponse);
    });

    it('should retun data mapped by BillCancellationRequestsAdaptor adaptor', () => {
      spyOn(
        BillCancellationRequestsAdaptor,
        'getConfirmResFromJson'
      ).and.returnValue(confirmResponse);

      const path = confirmBillCancelUrl({
        body: billCancelPayload,
        subTxnType: BcTypesEnum.CASH_MEMO
      }).path;

      billCancelService
        .confirm({ body: billCancelPayload, subTxnType: BcTypesEnum.CASH_MEMO })
        .subscribe(data => {
          expect(data).toEqual(confirmResponse);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush({});
    });
  });

  describe('cancel', () => {
    it('should call POST api method with correct url and params', () => {
      spyOn(
        BillCancellationRequestsAdaptor,
        'getCancelResFromJson'
      ).and.returnValue({});

      const { path, params } = directCancelBillCancelUrl({
        body: billCancelPayload,
        subTxnType: BcTypesEnum.CASH_MEMO
      });

      billCancelService
        .cancel({ body: billCancelPayload, subTxnType: BcTypesEnum.CASH_MEMO })
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

    it('should call BillCancellationRequestsAdaptor adaptor method with correct arguments', () => {
      spyOn(
        BillCancellationRequestsAdaptor,
        'getCancelResFromJson'
      ).and.returnValue({});

      const path = directCancelBillCancelUrl({
        body: billCancelPayload,
        subTxnType: BcTypesEnum.CASH_MEMO
      }).path;

      billCancelService
        .cancel({ body: billCancelPayload, subTxnType: BcTypesEnum.CASH_MEMO })
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(cancelResponse);
      expect(
        BillCancellationRequestsAdaptor.getCancelResFromJson
      ).toHaveBeenCalledWith(cancelResponse);
    });

    it('should retun data mapped by BillCancellationRequestsAdaptor adaptor', () => {
      spyOn(
        BillCancellationRequestsAdaptor,
        'getCancelResFromJson'
      ).and.returnValue(cancelResponse);

      const path = directCancelBillCancelUrl({
        body: billCancelPayload,
        subTxnType: BcTypesEnum.CASH_MEMO
      }).path;

      billCancelService
        .cancel({ body: billCancelPayload, subTxnType: BcTypesEnum.CASH_MEMO })
        .subscribe(data => {
          expect(data).toEqual(cancelResponse);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
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

  describe('getCmBillList', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(BillCancellationRequestsHelper, 'getCmBillList').and.returnValue(
        {}
      );

      const { path, params } = getCmBillListEndpointUrl(
        'CM',
        'NEW_CM',
        0,
        10,
        'TESTCUSTOMER',
        56,
        'docDate, DESC'
      );

      billCancelService.getCmBillList(cmBillListPayload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.params.get('subTxnType')).toEqual('NEW_CM');

      request.flush({});
    });

    it('should call BillCancellationRequestsHelper method with correct arguments', () => {
      spyOn(BillCancellationRequestsHelper, 'getCmBillList').and.returnValue(
        {}
      );

      const path = getCmBillListEndpointUrl(
        'CM',
        'NEW_CM',
        0,
        10,
        'TESTCUSTOMER',
        56,
        'docDate, DESC'
      ).path;

      billCancelService.getCmBillList(cmBillListPayload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(cmBillList);
      expect(BillCancellationRequestsHelper.getCmBillList).toHaveBeenCalledWith(
        cmBillList
      );
    });

    it('should retun data mapped by BillCancellationRequestsHelper adaptor', () => {
      spyOn(BillCancellationRequestsHelper, 'getCmBillList').and.returnValue(
        cmBillList
      );

      const path = getCmBillListEndpointUrl(
        'CM',
        'NEW_CM',
        0,
        10,
        'TESTCUSTOMER',
        56,
        'docDate, DESC'
      ).path;

      billCancelService.getCmBillList(cmBillListPayload).subscribe(data => {
        expect(data).toEqual(cmBillList);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush({});
    });
  });

  describe('CancelType', () => {
    it('should call GET api method with correct url and params', () => {
      const { path, params } = getCancelTypeEndPointUrl(
        cancelTypePayload.refTxnId,
        cancelTypePayload.subTxnType,
        cancelTypePayload.txnType
      );

      billCancelService
        .CancelType(
          cancelTypePayload.refTxnId,
          cancelTypePayload.subTxnType,
          cancelTypePayload.txnType
        )
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.params.get('subTxnType')).toEqual('NEW_CM');

      request.flush({});
    });
  });

  describe('getCmBillList', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(BillCancellationRequestsHelper, 'getCmBillList').and.returnValue(
        {}
      );

      const { path, params } = getCmBillListEndpointUrl(
        'CM',
        'NEW_CM',
        0,
        10,
        'TESTCUSTOMER',
        56,
        'docDate, DESC'
      );

      billCancelService.getCmBillList(cmBillListPayload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.params.get('subTxnType')).toEqual('NEW_CM');

      request.flush({});
    });

    it('should call BillCancellationRequestsHelper method with correct arguments', () => {
      spyOn(BillCancellationRequestsHelper, 'getCmBillList').and.returnValue(
        {}
      );

      const path = getCmBillListEndpointUrl(
        'CM',
        'NEW_CM',
        0,
        10,
        'TESTCUSTOMER',
        56,
        'docDate, DESC'
      ).path;

      billCancelService.getCmBillList(cmBillListPayload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(cmBillList);
      expect(BillCancellationRequestsHelper.getCmBillList).toHaveBeenCalledWith(
        cmBillList
      );
    });
  });

  describe('getBCHistoryList', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(BillCancellationRequestsHelper, 'getBcList').and.returnValue({});

      const { path, params } = getBillCancellationHistoryDetailsUrl(
        'CASH_MEMO',
        'CMCAN',
        null,
        null,
        1,
        10
      );

      billCancelService.getHistoryItems(bcHistoryDetails).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });

    it('should retun data mapped by BillCancellationHistoryHelper adaptor', () => {
      spyOn(BillCancellationRequestsHelper, 'getBcList').and.returnValue(
        bcHistoryDetails
      );

      const path = getBillCancellationHistoryDetailsUrl(
        'CASH_MEMO',
        'CMCAN',
        null,
        null,
        1,
        10
      ).path;

      billCancelService.getHistoryItems(bcHistoryDetails).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush({});
    });
  });
});
