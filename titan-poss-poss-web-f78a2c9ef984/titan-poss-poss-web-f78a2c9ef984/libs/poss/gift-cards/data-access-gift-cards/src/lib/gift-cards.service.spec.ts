import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { GiftCardsService } from './gift-cards.service';
import { GiftCardsAdaptor } from '@poss-web/shared/util-adaptors';
import {
  getCashMemoGiftItemEndPointUrl,
  getCashMemoEndPointUrl,
  getCashMemoCancelEndPoint
} from '@poss-web/shared/util-api-service';
import {
  AddGiftCardItemPayload,
  CancellableCashMemoData,
  CancellationReasonsEnum,
  CashMemoMinimalDetail,
  GcCashMemoCancelRequestBody,
  GcCashMemoCancelResponse,
  PartiallyUpdateGiftDetailsPayload
} from '@poss-web/shared/models';

describe('GiftCardsService', () => {
  let httpTestingController: HttpTestingController;
  let giftCardsService: GiftCardsService;
  let getGiftCardsAdaptorSpy: GiftCardsAdaptor;
  const apiUrl = 'http://localhost:3000';

  beforeEach(() => {
    getGiftCardsAdaptorSpy = jasmine.createSpyObj([
      'getCpgGroupDescription',
      'getCreatedGiftCardCmDetails',
      'getPartiallyUpdatedGiftCardCm',
      'getAddedGiftCardItemResponse',
      'getGiftCardItemResponse',
      'getDeletedGiftCardItemResponse',
      'getUpdatedGcCashMemoResponse'
    ]);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        GiftCardsService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    giftCardsService = TestBed.inject(GiftCardsService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(giftCardsService).toBeTruthy();
  });

  it('createGiftCardCashMemo - should create gift card cash memo', () => {
    const mockCreatedGiftCardCmDetails = {
      id: 'ae2dfee2-9fc7-483c-9cdd-89d6803ea825',
      status: 'OPEN',
      docNo: 413
    };
    spyOn(GiftCardsAdaptor, 'getCreatedGiftCardCmDetails').and.returnValue(
      mockCreatedGiftCardCmDetails
    );
    const apiPath = getCashMemoEndPointUrl('CM', 'GIFT_SALE');
    giftCardsService.createGiftCardCashMemo().subscribe();

    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath.path;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('POST');
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });

  it('partiallyUpdateGiftCardCashMemo - should partially update gift card cash memo', () => {
    const mockPartiallyUpdatedGiftCardCm = {
      customerId: 624,
      paidValue: 0.0,
      id: 'AE2DFEE2-9FC7-483C-9CDD-89D6803EA825',
      status: 'OPEN',
      docNo: 413,
      docDate: 1597948200000,
      employeeCode: 'rso.urb.2',
      txnType: 'CM',
      subTxnType: 'GIFT_SALE'
    };
    spyOn(GiftCardsAdaptor, 'getPartiallyUpdatedGiftCardCm').and.returnValue(
      mockPartiallyUpdatedGiftCardCm
    );
    const apiPath = getCashMemoEndPointUrl('CM', 'GIFT_SALE');
    const requestBody = {
      customerId: 625
    };

    giftCardsService.partiallyUpdateGcCashMemo('', requestBody).subscribe();

    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath.path;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('PATCH');
    expect(request.request.body).toBe(JSON.stringify(requestBody));
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });

  it('addGiftCardItem - should add gift card item', () => {
    const mockAddGiftCardItemResponse = {
      customerId: 624,
      totalQuantity: 1,
      totalWeight: 0,
      totalValue: 24222.0,
      totalTax: 0.0,
      finalValue: 24222.0,
      totalDiscount: 0,
      paidValue: 0.0,
      id: '44BC9734-2003-48DF-89E3-10306B5FAA1F',
      status: 'OPEN',
      docNo: 417,
      docDate: 1597948200000,
      employeeCode: 'rso.urb.2',
      txnType: 'CM',
      subTxnType: 'GIFT_SALE',
      giftDetailsDto: {
        itemId: '5405fefd-41bc-41c5-b264-5442e4b90663',
        instrumentNo: '8877661190000040',
        vendorCode: 'QC_GC',
        binCode: 'QCGC',
        giftType: 'CARD',
        rowId: 1,
        totalValue: 24222,
        finalValue: 24222,
        totalTax: 0,
        taxDetails: null
      }
    };

    spyOn(GiftCardsAdaptor, 'getAddedGiftCardItemResponse').and.returnValue(
      mockAddGiftCardItemResponse
    );
    const apiPath = getCashMemoGiftItemEndPointUrl(
      'CM',
      'GIFT_SALE',
      '123456',
      null,
      'CARD',
      'QC_GC'
    );
    const requestBody: AddGiftCardItemPayload = {
      finalValue: 1000,
      instrumentNo: '',
      rowId: 1,
      totalTax: 0,
      totalValue: 1000
    };
    giftCardsService.addGiftCardItem('123456', requestBody).subscribe();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath.path;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('POST');
    expect(request.request.body).toBe(JSON.stringify(requestBody));
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });

  it('getAddedGiftCardItem - should get added gift card item', () => {
    const getGiftCardItemResponse = {
      itemId: '5405fefd-41bc-41c5-b264-5442e4b90663',
      instrumentNo: '8877661190000040',
      vendorCode: 'QC_GC',
      binCode: 'QCGC',
      giftType: 'CARD',
      rowId: 1,
      totalValue: 24222,
      finalValue: 24222,
      totalTax: 0
    };
    spyOn(GiftCardsAdaptor, 'getGiftCardItemResponse').and.returnValue(
      getGiftCardItemResponse
    );
    const apiPath = getCashMemoGiftItemEndPointUrl(
      'CM',
      'GIFT_SALE',
      '123456',
      '654321'
    );
    giftCardsService
      .getAddedGiftCardItem('123456', '654321')
      .subscribe(response => {
        console.log('Response :', response);
      });
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath.path;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('GET');
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });

  it('deleteAddedGiftCardItem - should delete gift card item', () => {
    const deleteGiftCardItemResponse = {
      customerId: 624,
      totalQuantity: 1,
      totalWeight: 0,
      totalValue: 24222.0,
      totalTax: 0.0,
      finalValue: 24222.0,
      totalDiscount: 0,
      paidValue: 0.0,
      id: '44BC9734-2003-48DF-89E3-10306B5FAA1F',
      status: 'OPEN',
      docNo: 417,
      docDate: 1597948200000,
      employeeCode: 'rso.urb.2',
      txnType: 'CM',
      subTxnType: 'GIFT_SALE'
    };
    spyOn(GiftCardsAdaptor, 'getDeletedGiftCardItemResponse').and.returnValue(
      deleteGiftCardItemResponse
    );
    const apiPath = getCashMemoGiftItemEndPointUrl(
      'CM',
      'GIFT_SALE',
      '123456',
      '654321'
    );
    giftCardsService.deleteAddedGiftCardItem('123456', '654321').subscribe();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath.path;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('DELETE');
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });

  it('PartiallyUpdateGiftCardItem - should partially uodate gift card item', () => {
    const mockAddGiftCardItemResponse = {
      customerId: 624,
      totalQuantity: 1,
      totalWeight: 0,
      totalValue: 24222.0,
      totalTax: 0.0,
      finalValue: 24222.0,
      totalDiscount: 0,
      paidValue: 0.0,
      id: '44BC9734-2003-48DF-89E3-10306B5FAA1F',
      status: 'OPEN',
      docNo: 417,
      docDate: 1597948200000,
      employeeCode: 'rso.urb.2',
      txnType: 'CM',
      subTxnType: 'GIFT_SALE',
      giftDetailsDto: {
        itemId: '5405fefd-41bc-41c5-b264-5442e4b90663',
        instrumentNo: '8877661190000040',
        vendorCode: 'QC_GC',
        binCode: 'QCGC',
        giftType: 'CARD',
        rowId: 1,
        totalValue: 24222,
        finalValue: 24222,
        totalTax: 0,
        taxDetails: null
      }
    };

    spyOn(GiftCardsAdaptor, 'getAddedGiftCardItemResponse').and.returnValue(
      mockAddGiftCardItemResponse
    );
    const apiPath = getCashMemoGiftItemEndPointUrl(
      'CM',
      'GIFT_SALE',
      '123456',
      '654321'
    );
    const requestBody: PartiallyUpdateGiftDetailsPayload = {
      finalValue: 1000,
      totalTax: 0,
      totalValue: 1000
    };

    giftCardsService
      .partiallyUpdateGiftCardItem('123456', '654321', requestBody)
      .subscribe();

    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath.path;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('PATCH');
    expect(request.request.body).toBe(JSON.stringify(requestBody));
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });

  it('updateGcCashMemo - should update gc cash memo', () => {
    const mockUpdateGcCashMemoResponse = {
      customerId: 625,
      docDate: '2020-08-21T15:01:17.019Z',
      docNo: 0,
      employeeCode: 'string',
      finalValue: 0,
      id: 'string',
      paidValue: 0,
      remarks: 'string',
      status: 'string',
      subTxnType: 'string',
      totalDiscount: 0,
      totalQuantity: 0,
      totalTax: 0,
      totalValue: 0,
      txnType: 'string'
    };
    spyOn(GiftCardsAdaptor, 'getUpdatedGcCashMemoResponse').and.returnValue(
      mockUpdateGcCashMemoResponse
    );
    const apiPath = getCashMemoEndPointUrl(
      'CM',
      'GIFT_SALE',
      '123456',
      'CONFIRMED'
    );
    const requestDetails = {
      customerId: 625,
      finalValue: 22300,
      remarks: 'Test remark',
      totalDiscount: 0,
      totalQuantity: 1,
      totalTax: 0,
      totalValue: 22300,
      paidValue: 22300,
      totalWeight: 0
    };
    giftCardsService.updateGcCashMemo('123456', requestDetails).subscribe();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath.path;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('PUT');
    expect(request.request.body).toBe(JSON.stringify(requestDetails));
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });

  it('getCashMemoBillsAvailableForCancellation - should get cash memos available for cancellation', () => {
    const cancellableCmListResponse: CancellableCashMemoData[] = [
      {
        customerName: 'string',
        refDocDate: 'string',
        refDocNo: 0,
        refTxnId: 'string',
        refTxnTime: 'string',
        subTxnType: 'string'
      }
    ];
    spyOn(GiftCardsAdaptor, 'getCancellableGcCashMemo').and.returnValue(
      cancellableCmListResponse
    );
    const apiPath = getCashMemoCancelEndPoint(
      'CMCAN',
      'GIFT_SALE',
      '9449275231'
    );
    giftCardsService
      .getCashMemoBillsAvailableForCancellation('9449275231')
      .subscribe(response => {
        console.log('Response :', response);
      });
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath.path;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('GET');
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });

  it('getGcCashMemoById - should get cash memo detail by id', () => {
    const gcCmDetailResponse: CashMemoMinimalDetail = {
      customerId: 0,
      itemIdList: [],
      id: 'string',
      docNo: 0,
      totalQuantity: 0,
      totalTax: 0,
      confirmedTime: 0,
      totalValue: 0
    };
    spyOn(GiftCardsAdaptor, 'getGcCashMemoMinimalData').and.returnValue(
      gcCmDetailResponse
    );
    const apiPath = getCashMemoEndPointUrl('CM', 'GIFT_SALE', '123456');
    giftCardsService.getGcCashMemoById('123456').subscribe(response => {
      console.log('Response :', response);
    });
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath.path;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('GET');
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });

  it('cancelGcCashMemo - should cancel Gc cash memo', () => {
    const gcCmCancelesponse: GcCashMemoCancelResponse = {
      cndocNos: [],
      docNo: 0,
      id: 'string'
    };
    const mockRequestBody: GcCashMemoCancelRequestBody = {
      cancelType: 'string',
      reasonForCancellation: 'string',
      refTxnId: 'string',
      remarks: 'string',
      employeeCode: 'string'
    };
    spyOn(GiftCardsAdaptor, 'getGcCashMemoCancelResponse').and.returnValue(
      gcCmCancelesponse
    );
    const apiPath = getCashMemoCancelEndPoint('CMCAN', 'GIFT_SALE');
    giftCardsService.cancelGcCashMemo(mockRequestBody).subscribe(response => {
      console.log('Response :', response);
    });
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath.path;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('POST');
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });

  it('getGcCancellationReasons should list cancellation reasons', () => {
    const cancellationReasons = [
      CancellationReasonsEnum.REASON_1,
      CancellationReasonsEnum.REASON_2,
      CancellationReasonsEnum.REASON_3
    ];
    giftCardsService.getGcCancellationReasons().subscribe(reasons => {
      expect(reasons.length).toBe(cancellationReasons.length);
    });
  });
});
