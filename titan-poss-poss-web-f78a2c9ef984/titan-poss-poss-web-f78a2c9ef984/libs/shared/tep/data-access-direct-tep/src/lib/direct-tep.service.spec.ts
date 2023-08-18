import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { TepService } from './direct-tep.service';
import {
  BillCancellationRequestsAdaptor,
  CtAcceptAdvanceAdaptor
} from '@poss-web/shared/util-adaptors';
import {
  getAcceptAdvanceEndPointUrl,
  getInititateTepEndpointUrl,
  getTepCashMemoDetailsUrl,
  updateOpenTepTransactionEndPointUrl,
  getTepItemConfigUrl,
  addTepItemToGridEndPointUrl,
  getTepPriceDetailsEndPointUrl,
  updateTepItemInGridEndPointUrl,
  confirmOrHoldTepEndPointUrl,
  deleteTepItemEndPointUrl,
  getTepItemCodeEndPointUrl,
  getTepTransactionUrl,
  getTepItemEndPointUrl,
  getLocationStoresUrl,
  getTaxDetailsEndPointUrl,
  getAvailableDiscountsEndPointUrl,
  createCutPieceTepStockManagementUrl,
  updateTepTransactionPriceDetailsEndPointUrl,
  patchCutPieceTepStockManagementUrl,
  patchCutPieceTepItemInStockManagementUrl,
  addCutPieceTepItemInStockManagementUrl,
  confirmCutPieceTepItemInStockManagementUrl,
  confirmRequestTepEndPointUrl,
  getWorkFlowProcessByIdUrl,
  directCancelTEPUrl,
  getWorkFlowProcessDetailsUrl,
  tepUploadUrl,
  tepDownloadUrl,
  getReasonsEndPointUrl,
  getCutPieceTepTransactionUrl,
  deletCutPieceTepItemEndPointUrl
} from '@poss-web/shared/util-api-service';
import {
  AddTepItemRequestPayload,
  ConfirmOrHoldTepRequestPayload,
  CreateOpenTepTransactionResponse,
  CreateTepTypesEnum,
  FileUploadDownloadPayload,
  GetTepItemConfiguratonResponse,
  GetTepPriceDetailsRequestPayload,
  TepStatusEnum,
  TepTxnTypesEnum,
  TransactionTypeEnum,
  UpdateTepItemRequestPayload,
  workflowPayload
} from '@poss-web/shared/models';
import { of } from 'rxjs';
import { CreateOpenCutPieceTepTransaction } from './+state/direct-tep.actions';

describe('TepService', () => {
  let httpTestingController: HttpTestingController;
  let tepService: TepService;
  // let ctAcceptAdvanceAdaptorSpy: CtAcceptAdvanceAdaptor;
  const apiUrl = 'http://localhost:3000';

  beforeEach(() => {
    // ctAcceptAdvanceAdaptorSpy = jasmine.createSpyObj([
    //     'getInitiateAdvanceResponse',
    //     'getUpdateAdvanceTransactionResponse'
    // ]);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        TepService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    tepService = TestBed.inject(TepService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(tepService).toBeTruthy();
  });

  it('initiateTepOpenTransaction - should initiate TEP and create open state with transaction id', () => {
    const mockInitiateTepResponse: CreateOpenTepTransactionResponse = {
      docNo: 62,
      id: '',
      status: '',
      subTxnType: '',
      txnType: ''
    };
    const apiPath = getInititateTepEndpointUrl(
      TepTxnTypesEnum.TEP,
      TepTxnTypesEnum.NEW_TEP
    );
    tepService
      .initiateTepOpenTransaction(TepTxnTypesEnum.NEW_TEP, null)
      .subscribe
      //       response => {
      //     expect(response).toBe(mockInitiateTepResponse);
      //   }
      ();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath.path;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('POST');
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });

  //   it('getTepCashMemoItemsList - should get Tep Cash Memo Items List', () => {
  //     // const mockInitiateTepResponse: CreateOpenTepTransactionResponse = {
  //     //   docNo: 62,
  //     //   id: '',
  //     //   status: '',
  //     //   subTxnType: '',
  //     //   txnType: ''
  //     // };
  //     // spyOn(tepService, 'getTepItemConfiguration').and.returnValue(
  //     //   of({ isCMMandatory: true })
  //     // );
  //     const apiPath = getTepCashMemoDetailsUrl(
  //       'CPD',
  //       '54',
  //       '2020',
  //       TepTxnTypesEnum.NEW_TEP,
  //       TepTxnTypesEnum.TEP
  //     );
  //     tepService
  //       .getTepCashMemoItemsList(
  //         'CPD',
  //         '54',
  //         '2020',
  //         TepTxnTypesEnum.NEW_TEP,
  //         '8554556789'
  //       )
  //       .subscribe
  //       //       response => {
  //       //     expect(response).toBe(mockInitiateTepResponse);
  //       //   }
  //       ();
  //     // expect(tepService.getTepItemConfiguration).toHaveBeenCalled();
  //     const request = httpTestingController.expectOne(req => {
  //       return req.url === apiUrl + apiPath.path;
  //     });
  //     expect(request.cancelled).toBeFalsy();
  //     expect(request.request.method).toEqual('GET');
  //     expect(request.request.responseType).toEqual('json');
  //     request.flush({});
  //   });

  it('updateTepOpenTransaction - should partially update TEP transaction id', () => {
    const apiPath = updateOpenTepTransactionEndPointUrl(
      '1234-abcd-1234-dcba',
      TepTxnTypesEnum.NEW_TEP,
      TepTxnTypesEnum.TEP
    );
    tepService
      .updateTepOpenTransaction(
        '1234-abcd-1234-dcba',
        TepTxnTypesEnum.NEW_TEP,
        {}
      )
      .subscribe
      //       response => {
      //     expect(response).toBe(mockInitiateTepResponse);
      //   }
      ();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath.path;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('PATCH');
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });

  it('getTepItemConfiguration - should get Tep Item configuration', () => {
    const apiPath = getTepItemConfigUrl(
      '503017FVXRAA00',
      CreateTepTypesEnum.REGULAR_TEP,
      false,
      '8553001721'
    );
    tepService
      .getTepItemConfiguration(
        '503017FVXRAA00',
        CreateTepTypesEnum.REGULAR_TEP,
        false,
        '8553001721'
      )
      .subscribe
      //       response => {
      //     expect(response).toBe(mockInitiateTepResponse);
      //   }
      ();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath.path;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('GET');
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });

  it('addTepItem - should add Tep Item', () => {
    const apiPath = addTepItemToGridEndPointUrl(
      '1234-abcd',
      TepTxnTypesEnum.NEW_TEP,
      CreateTepTypesEnum.REGULAR_TEP
    );

    const payload: AddTepItemRequestPayload = {
      finalValue: 1000,
      itemCode: '',
      totalValue: 1000,
      quantity: 1
    };
    tepService
      .addTepItem('1234-abcd', TepTxnTypesEnum.NEW_TEP, payload)
      .subscribe
      //       response => {
      //     expect(response).toBe(mockInitiateTepResponse);
      //   }
      ();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath.path;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('POST');
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });

  // it('getTepItemPriceDetails - should get Tep Item Price Details', () => {
  //   const apiPath = getTepPriceDetailsEndPointUrl();

  //   const payload: GetTepPriceDetailsRequestPayload = {
  //     itemCode: '',
  //     standardPrice: null,
  //     tepType: ''
  //   };
  //   tepService
  //     .getTepItemPriceDetails(payload)
  //     .subscribe
  //     //       response => {
  //     //     expect(response).toBe(mockInitiateTepResponse);
  //     //   }
  //     ();
  //   const request = httpTestingController.expectOne(req => {
  //     return req.url === apiUrl + apiPath;
  //   });
  //   expect(request.cancelled).toBeFalsy();
  //   expect(request.request.method).toEqual('POST');
  //   expect(request.request.responseType).toEqual('json');
  //   request.flush({});
  // });

  it('updateTepItemInGrid - should update Tep Item', () => {
    const apiPath = updateTepItemInGridEndPointUrl(
      '1234-abcd',
      '8907-1234-abcd',
      TepTxnTypesEnum.NEW_TEP,
      TepTxnTypesEnum.TEP
    );

    const payload: UpdateTepItemRequestPayload = {
      finalValue: 1000,
      isSaleable: true,
      quantity: 1,
      stonesDetails: [],
      totalValue: 1000,
      totalWeight: 0.345,
      unitValue: 1000,
      unitWeight: 0.345
    };
    tepService
      .updateTepItemInGrid(
        '1234-abcd',
        '8907-1234-abcd',
        TepTxnTypesEnum.NEW_TEP,
        payload
      )
      .subscribe
      //       response => {
      //     expect(response).toBe(mockInitiateTepResponse);
      //   }
      ();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath.path;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('PUT');
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });

  it('confirmOrHoldTep - should confirm or hold Tep Item', () => {
    const apiPath = confirmOrHoldTepEndPointUrl(
      '1234-abcd',
      TepStatusEnum.CONFIRMED,
      TepTxnTypesEnum.NEW_TEP,
      TepTxnTypesEnum.TEP
    );

    const payload: ConfirmOrHoldTepRequestPayload = {
      customerId: 624,
      employeeCode: 'cashiercpd',
      exchangeDetails: {
        data: {},
        type: ''
      },
      isRefund: false,
      paymentType: 'CN',
      metalRateList: {
        metalRates: null
      },
      refundDetails: {
        data: null,
        type: ''
      },
      reason: '',
      remarks: '',
      totalQuantity: 1,
      totalTax: 290,
      totalValue: 1200,
      totalWeight: 0.679
    };
    tepService
      .confirmOrHoldTep(
        '1234-abcd',
        TepStatusEnum.CONFIRMED,
        TepTxnTypesEnum.NEW_TEP,
        payload
      )
      .subscribe
      //       response => {
      //     expect(response).toBe(mockInitiateTepResponse);
      //   }
      ();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath.path;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('PUT');
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });

  it('deleteTepItem - should delete TEP item', () => {
    const apiPath = deleteTepItemEndPointUrl(
      '1234-abcd',
      '1234-abcd-dcba',
      TepTxnTypesEnum.NEW_TEP,
      TepTxnTypesEnum.TEP
    );

    tepService
      .deleteTepItem('1234-abcd', '1234-abcd-dcba', TepTxnTypesEnum.NEW_TEP)
      .subscribe
      //       response => {
      //     expect(response).toBe(mockInitiateTepResponse);
      //   }
      ();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath.path;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('DELETE');
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });

  it('deleteTepItem - should delete TEP item 2', () => {
    const apiPath = deletCutPieceTepItemEndPointUrl(
      '1234-abcd',
      '1234-abcd-dcba',
      CreateTepTypesEnum.CUT_PIECE_TEP,
      TepTxnTypesEnum.TEP
    );

    tepService
      .deleteTepItem('1234-abcd', '1234-abcd-dcba', CreateTepTypesEnum.CUT_PIECE_TEP)
      .subscribe
      //       response => {
      //     expect(response).toBe(mockInitiateTepResponse);
      //   }
      ();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath.path;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('DELETE');
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });

  it('getTepItemCodeDetails - should get TEP item code', () => {
    const apiPath = getTepItemCodeEndPointUrl();

    tepService
      .getTepItemCodeDetails('503017FVXRAA00')
      .subscribe
      //       response => {
      //     expect(response).toBe(mockInitiateTepResponse);
      //   }
      ();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('POST');
    expect(request.request.responseType).toEqual('json');
    request.flush({results: [{productGroupCode : 'abc'}]});
  });

  it('getTepItemCodeDetails - should get TEP item code 2', () => {
    const apiPath = getTepItemCodeEndPointUrl();

    tepService
      .getTepItemCodeDetails('503017FVXRAA00')
      .subscribe
      //       response => {
      //     expect(response).toBe(mockInitiateTepResponse);
      //   }
      ();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('POST');
    expect(request.request.responseType).toEqual('json');
    request.flush({results: [{productGroupCodeType : 'abc'}]});
  });

  it('getTepTransactionDetails - should get TEP transaction details', () => {
    const apiPath = getTepTransactionUrl(
      'abcd-1234',
      TepTxnTypesEnum.NEW_TEP,
      TepTxnTypesEnum.TEP
    );

    tepService
      .getTepTransactionDetails('abcd-1234', TepTxnTypesEnum.NEW_TEP)
      .subscribe
      //       response => {
      //     expect(response).toBe(mockInitiateTepResponse);
      //   }
      ();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath.path;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('GET');
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });

  it('getTepTransactionDetails - should get Cut piece TEP transaction details', () => {
    const apiPath = getCutPieceTepTransactionUrl(
      'abcd-1234',
      CreateTepTypesEnum.CUT_PIECE_TEP,
      TepTxnTypesEnum.NEW_TEP,
    );

    tepService
      .getTepTransactionDetails('abcd-1234', CreateTepTypesEnum.CUT_PIECE_TEP)
      .subscribe
      //       response => {
      //     expect(response).toBe(mockInitiateTepResponse);
      //   }
      ();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath.path;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('GET');
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });

  it('deleteTepTransactionDetails - should delete TEP transaction details', () => {
    const apiPath = getTepTransactionUrl(
      'abcd-1234',
      TepTxnTypesEnum.NEW_TEP,
      TepTxnTypesEnum.TEP
    );

    tepService
      .deleteTepTransactionDetails('abcd-1234', TepTxnTypesEnum.NEW_TEP)
      .subscribe
      //       response => {
      //     expect(response).toBe(mockInitiateTepResponse);
      //   }
      ();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath.path;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('DELETE');
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });

  it('getTepItemDetails - should get TEP item details', () => {
    const apiPath1 = getTepItemEndPointUrl(
      'abcd-1234',
      'abcd-1234-dcba',
      CreateTepTypesEnum.CUT_PIECE_TEP,
      TepTxnTypesEnum.TEP
    );

    tepService
      .getTepItemDetails(
        'abcd-1234',
        'abcd-1234-dcba',
        CreateTepTypesEnum.CUT_PIECE_TEP,
        CreateTepTypesEnum.CUT_PIECE_TEP,
        '8553556789'
      )
      .subscribe
      //       response => {
      //     expect(response).toBe(mockInitiateTepResponse);
      //   }
      ();
    const request1 = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath1.path;
    });
    expect(request1.cancelled).toBeFalsy();
    expect(request1.request.method).toEqual('GET');
    expect(request1.request.responseType).toEqual('json');
    request1.flush({});

    // const apiPath2 = getTepItemEndPointUrl(
    //   'abcd-1234',
    //   'abcd-1234-dcba',
    //   CreateTepTypesEnum.CUT_PIECE_TEP,
    //   TepTxnTypesEnum.TEP
    // );

    // tepService
    //   .getTepItemDetails(
    //     'abcd-1234',
    //     'abcd-1234-dcba',
    //     CreateTepTypesEnum.CUT_PIECE_TEP,
    //     TepTxnTypesEnum.TEP,
    //     '8553556789'
    //   )
    //   .subscribe
    //   //       response => {
    //   //     expect(response).toBe(mockInitiateTepResponse);
    //   //   }
    //   ();
    // const request2 = httpTestingController.expectOne(req => {
    //   return req.url === apiUrl + apiPath2.path;
    // });
    // expect(request2.cancelled).toBeFalsy();
    // expect(request2.request.method).toEqual('GET');
    // expect(request2.request.responseType).toEqual('json');
    // request2.flush({});
  });

  it('getGoldPlusLocationDetails - should get Gold Plus Location Details', () => {
    const apiPath = getLocationStoresUrl(false);
    // const requestPayload = {
    //   brandCodes: ['GoldPlus']
    // };
    tepService
      .getGoldPlusLocationDetails()
      .subscribe
      //       response => {
      //     expect(response).toBe(mockInitiateTepResponse);
      //   }
      ();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath.path;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('POST');
    expect(request.request.responseType).toEqual('json');
    request.flush({results : [ {data: ''}]});
  });

  it('getGoldPlusLocationDetails - should get Gold Plus Location Details 2', () => {
    const apiPath = getLocationStoresUrl(false);
    // const requestPayload = {
    //   brandCodes: ['GoldPlus']
    // };
    tepService
      .getGoldPlusLocationDetails()
      .subscribe
      //       response => {
      //     expect(response).toBe(mockInitiateTepResponse);
      //   }
      ();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath.path;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('POST');
    expect(request.request.responseType).toEqual('json');
    request.flush({results : [ ]});
  });

  it('getTaxDetails - should get Tax Details', () => {
    const apiPath = getTaxDetailsEndPointUrl(123, '57111C04566', 'TEP', 'CPD');

    tepService.getTaxDetails(123, '57111C04566', 'TEP', 'CPD').subscribe();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath.path;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('GET');
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });

  it('getAvailableDiscounts - should get Available Discounts', () => {
    const requestPayload = {
      id: '123',
      subTxnType: 'NEW_TEP',
      txnType: 'TEP'
    };
    const apiPath = getAvailableDiscountsEndPointUrl(requestPayload);

    tepService.getAvailableDiscounts(requestPayload).subscribe();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath.path;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('GET');
    expect(request.request.responseType).toEqual('json');
    request.flush({results:[{data: 'abc'}]});
  });

  it('getAvailableDiscounts - should get Available Discounts 2', () => {
    const requestPayload = {
      id: '123',
      subTxnType: 'NEW_TEP',
      txnType: 'TEP'
    };
    const apiPath = getAvailableDiscountsEndPointUrl(requestPayload);

    tepService.getAvailableDiscounts(requestPayload).subscribe();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath.path;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('GET');
    expect(request.request.responseType).toEqual('json');
    request.flush({results:[]});
  });

  it('createOpenCutPieceTepTransaction - should create open cut piece TEP transaction', () => {
    const apiPath = createCutPieceTepStockManagementUrl();
    tepService.createOpenCutPieceTepTransaction().subscribe();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath.path;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('POST');
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });

  it('updateTepTransactionPriceDetails - should update TEP transaction Price Details', () => {
    const apiPath = updateTepTransactionPriceDetailsEndPointUrl(
      '123',
      'NEW_TEP',
      'TEP'
    );
    tepService.updateTepTransactionPriceDetails('123', 'NEW_TEP').subscribe();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath.path;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('PATCH');
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });

  it('patchCutPieceTepTransaction - SHould patch cut piece TEP transaction Price Details', () => {
    const apiPath = patchCutPieceTepStockManagementUrl('123');
    tepService
      .patchCutPieceTepTransaction('123', { employeeCode: 'cashiercpd' })
      .subscribe();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath.path;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('PATCH');
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });

  it('patchCutPieceTepTransactionItem - SHould patch cut piece TEP Item', () => {
    const apiPath = patchCutPieceTepItemInStockManagementUrl('123', 'abc');
    tepService
      .patchCutPieceTepTransactionItem('123', 'abc', { measuredWeight: 1.23 })
      .subscribe();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath.path;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('PATCH');
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });

  it('addCutPieceTepTransactionItem - Should add cut piece TEP Transaction Item', () => {
    const requestPayload = {
      inventoryId: '123',
      itemCode: '57C47890001',
      lotNumber: '',
      measuredWeight: 1.23
    };
    const apiPath = addCutPieceTepItemInStockManagementUrl('123');
    tepService.addCutPieceTepTransactionItem('123', requestPayload).subscribe();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath.path;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('POST');
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });

  it('confirmCutPieceTepTransactionItem - Should confirm cut piece TEP Transaction Item', () => {
    const requestPayload = {
      employeeCode: 'cashiercpd',
      remarks: '',
      totalQuantity: 1,
      totalValue: 10456,
      totalWeight: 2.34
    };
    const apiPath = confirmCutPieceTepItemInStockManagementUrl('123');
    tepService
      .confirmCutPieceTepTransactionItem('123', requestPayload)
      .subscribe();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath.path;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('PUT');
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });

  it('confirmRequestTep - Should confirm request TEP', () => {
    const apiPath = confirmRequestTepEndPointUrl(
      '123',
      'CONFIRMED',
      'NEW_TEP',
      'TEP'
    );
    tepService
      .confirmRequestTep('123', 'CONFIRMED', 'NEW_TEP', null)
      .subscribe();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath.path;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('PUT');
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });

  it('cancel - Should cancel TEP', () => {
    const apiPath = getWorkFlowProcessByIdUrl('123', 'REQUEST_APPROVAL');
    tepService.cancel('123', 'REQUEST_APPROVAL').subscribe();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath.path;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('PATCH');
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });

  it('cancelTEP - Should cancel TEP', () => {
    spyOn(
      BillCancellationRequestsAdaptor,
      'getCancelResFromJson'
    ).and.returnValue(null);
    const requestPayload = {
      employeeCode: 'cashiercpd',
      reasonForCancellation: 'Reason2',
      refTxnId: '123',
      remarks: 'remarks'
    };
    const apiPath = directCancelTEPUrl();
    tepService.cancelTEP(requestPayload).subscribe();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath.path;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('POST');
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });

  it('loadWorkflowDeatils - Load Workflow Details', () => {
    const requestPayload: workflowPayload = {
      processId: '123',
      workflowType: null
    };
    const apiPath = getWorkFlowProcessDetailsUrl(requestPayload);
    tepService.loadWorkflowDeatils(requestPayload).subscribe();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath.path;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('GET');
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });

  it('getTepCashMemoItemsList - Get TEP CashMemo Items List', () => {
    const apiPath = getTepCashMemoDetailsUrl(
      'CPD',
      '123',
      '2021',
      'NEW_TEP',
      'TEP'
    );
    tepService
      .getTepCashMemoItemsList('CPD', '123', '2021', 'NEW_TEP', '8553001721')
      .subscribe();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath.path;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('GET');
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });

  it('uploadFile - Upload File', () => {
    const payload: FileUploadDownloadPayload = {
      txnType: TransactionTypeEnum.TEP,
      id: '123'
    };
    const apiPath = tepUploadUrl(payload);
    tepService.uploadFile(payload).subscribe();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('POST');
    expect(request.request.responseType).toEqual('text');
    request.flush({});
  });

  it('downloadFile - Download File', () => {
    const payload: FileUploadDownloadPayload = {
      txnType: TransactionTypeEnum.TEP,
      id: '123'
    };
    const apiPath = tepDownloadUrl(payload);
    tepService.downloadFile(payload).subscribe();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('GET');
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });

  it('getFullValueTepReasons - Get Full Value TEP Reasons', () => {
    const apiPath = getReasonsEndPointUrl('FULL_VALUE_TEP_REASON');
    tepService.getFullValueTepReasons().subscribe();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('GET');
    expect(request.request.responseType).toEqual('json');
    request.flush({results: [{value: 'av'}]});
  });
  it('getFullValueTepReasons - Get Full Value TEP Reasons 2', () => {
    const apiPath = getReasonsEndPointUrl('FULL_VALUE_TEP_REASON');
    tepService.getFullValueTepReasons().subscribe();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('GET');
    expect(request.request.responseType).toEqual('json');
    request.flush({results: []});
  });
});
