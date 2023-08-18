import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import * as moment from 'moment';
import { GepService } from './gep.service';
import {
  GepAdaptor,
  GepHelper,
  TransactionTypeMasterAdaptor
} from '@poss-web/shared/util-adaptors';
import { ABRequestStatusList, AdvanceHistoryItemsRequestPayload, GEPSearchResponse, TransactionTypeEnum } from '@poss-web/shared/models';
import {
  metalTypeUrl,
  postGepUrl,
  itemTypeUrl,
  getGepInitUrl,
  metalUrl,
  postTotalBreakUpUrl,
  deleteGepUrl,
  holdConfirmUrl,
  postRsoUrl,
  putGepItemUrl,
  updatePriceUrl,
  getGepItemUrl,
  getCancelUrl,
  getOnHoldUrl,
  getOnHoldCountUrl,
  saveCancelUrl,
  deleteGEPUrl,
  uploadPreDeclarationFormUrl,
  getGEPHistoryEndPointUrl,
  getGoodExchangeUrl
} from '@poss-web/shared/util-api-service';

describe('gepService ', () => {
  let httpTestingController: HttpTestingController;
  let gepService: GepService;
  const apiUrl = 'http://localhost:3000';

  
  const  gepSearchResponse : GEPSearchResponse = {GEPList:[],totalElements:8};

  const advanceHistoryItemsRequestPayload:AdvanceHistoryItemsRequestPayload={docNo:4}

  const aBRequestStatusList: ABRequestStatusList = {
    pageNumber: 0,
    pageSize: 8,
    response: {},
    results: [],
    totalElements: 8,
    totalPages: 1
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        GepService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    gepService = TestBed.inject(GepService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(gepService).toBeTruthy();
  });

  describe('getGepInit', () => {
    it('should call Post api method with correct url and params', () => {
      const subTxnType = 'NEW_GEP';
      const payload = {
        data: {},
        subTxnType: subTxnType
      };
      const { path, params } = getGepInitUrl(subTxnType);

      gepService.getGepInit(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');

      request.flush({});
    });
  });

  describe(' postGepResponse', () => {
    it('should call Post api method with correct url and params', () => {
      spyOn(GepAdaptor, 'gepfromJson').and.returnValue({});
      const subTxnType = 'NEW_GEP';
      const id = '456789-YU-456789';
      const payload = {
        data: {},
        subTxnType: subTxnType,
        id: id
      };
      const { path, params } = postGepUrl(subTxnType, id);

      gepService.postGepResponse(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');

      request.flush({});
    });
  });

  describe(' metaltype', () => {
    it('should call Get api method with correct url and params', () => {
      const { path, params } = metalTypeUrl('METAL');

      gepService.metalType('METAL').subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');

      request.flush({});
    });
  });

  describe(' itemType', () => {
    it('should call Get api method with correct url and params', () => {
      const url = itemTypeUrl('item-types');

      gepService.itemType('item-types').subscribe();

      const request = httpTestingController.expectOne(req => {
        console.log(req.method, apiUrl, url);
        return req.url === apiUrl + url;
      });
      expect(request.cancelled).toBeFalsy();

      request.flush({});
    });
  });

  describe(' metalPrice', () => {
    it('should call GEt api method with correct url and params', () => {
      const url = metalUrl({});

      gepService.metalPrice({}).subscribe();

      const request = httpTestingController.expectOne(req => {
        console.log(req.url, apiUrl, url);
        return req.method === 'GET';
      });
      expect(request.cancelled).toBeFalsy();

      request.flush({});
    });
  });

  describe(' delete', () => {
    it('should call delete api method with correct url and params', () => {
      const id = '456789-YU-456789';
      const payload = {
        id: 'FGYHJKL-67890',
        status: 'APPROVED',
        itemId: 'TYUIOP-56789',
        subTxnType: 'NEW_GEP'
      };
      const { path, params } = deleteGepUrl(payload);

      gepService.delete(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('DELETE');

      request.flush({});
    });
  });

  describe(' postGepItemdetails', () => {
    it('should call get api method with correct url and params', () => {
      spyOn(GepAdaptor, 'onHoldfromJson').and.returnValue({});
      const subTxnType = 'NEW_GEP';
      const id = '456789-YU-456789';
      const payload = {
        data: {},
        itemId: '234567890',
        status: 'confirm',
        subTxnType: subTxnType,
        id: id
      };
      const { path, params } = deleteGepUrl(payload);

      gepService.getGepItemDetails(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        console.log(req.url, apiUrl, path);
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');

      request.flush({});
    });
  });

  describe(' holdConfirm', () => {
    it('should call get api method with correct url and params', () => {
      const subTxnType = 'NEW_GEP';
      const id = '456789-YU-456789';
      const payload = {
        data: {},
        itemId: '234567890',
        status: 'confirm',
        subTxnType: subTxnType,
        id: id
      };
      const { path, params } = holdConfirmUrl(payload);

      gepService.holdConfirm(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        console.log(req.url, apiUrl, path);
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PUT');

      request.flush({});
    });
  });

  describe(' PUTGEPitem', () => {
    it('should call put api method with correct url and params', () => {
      spyOn(GepAdaptor, 'gepfromJson').and.returnValue({});
      const subTxnType = 'NEW_GEP';
      const id = '456789-YU-456789';
      const payload = {
        data: {},
        itemId: '234567890',
        status: 'confirm',
        subTxnType: subTxnType,
        id: id
      };
      const { path, params } = putGepItemUrl(payload);

      gepService.putGepItem(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        console.log(req.url, apiUrl, path);
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PUT');

      request.flush({});
    });
  });

  describe(' PatchRso', () => {
    it('should call patch api method with correct url and params', () => {
      const subTxnType = 'NEW_GEP';
      const id = '456789-YU-456789';
      const payload = {
        data: {},
        itemId: '234567890',
        status: 'confirm',
        subTxnType: subTxnType,
        id: id
      };
      const { path, params } = postRsoUrl(subTxnType, id);

      gepService.patchRso(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        console.log(req.url, apiUrl, path);
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');

      request.flush({});
    });
  });

  describe(' updatePrice', () => {
    it('should call patch api method with correct url and params', () => {
      const subTxnType = 'NEW_GEP';
      const id = '456789-YU-456789';
      const payload = {
        data: {},
        itemId: '234567890',
        status: 'confirm',
        subTxnType: subTxnType,
        id: id
      };
      const { path, params } = updatePriceUrl(payload);

      gepService.updatePrice(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        console.log(req.url, apiUrl, path);
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');

      request.flush({});
    });
  });

  describe(' getGepItem', () => {
    it('should call get api method with correct url and params', () => {
      const subTxnType = 'NEW_GEP';
      const id = '456789-YU-456789';
      const payload = {
        data: {},
        itemId: '234567890',
        status: 'confirm',
        subTxnType: subTxnType,
        id: id
      };
      const { path, params } = getGepItemUrl(payload);

      gepService.getGepItem(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        console.log(req.url, apiUrl, path);
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');

      request.flush({});
    });
  });

  describe(' LOADCANCEL', () => {
    it('should call get api method with correct url and params', () => {
      spyOn(GepHelper, 'getcancelGeps').and.returnValue({});
      const subTxnType = 'NEW_GEP';
      const id = '456789-YU-456789';
      const payload = {
        data: {},
        itemId: '234567890',
        status: 'confirm',
        subTxnType: subTxnType,
        id: id
      };
      const { path, params } = getCancelUrl(payload);

      gepService.loadCancel(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        console.log(req.url, apiUrl, path);
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');

      request.flush({});
    });
  });

  describe(' LOADONHOLD', () => {
    it('should call get api method with correct url and params', () => {
      const subTxnType = 'NEW_GEP';
      const id = '456789-YU-456789';
      const payload = {
        data: {},
        itemId: '234567890',
        status: 'confirm',
        subTxnType: subTxnType,
        id: id
      };
      const { path, params } = getOnHoldUrl(payload);

      gepService.loadOnHold(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        console.log(req.url, apiUrl, path);
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');

      request.flush({});
    });
  });

  describe(' COUNTGEP', () => {
    it('should call get api method with correct url and params', () => {
      const subTxnType = 'NEW_GEP';
      const id = '456789-YU-456789';
      const payload = {
        data: {},
        itemId: '234567890',
        status: 'confirm',
        subTxnType: subTxnType,
        id: id
      };
      const { path, params } = getOnHoldCountUrl(payload);

      gepService.countGep(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        console.log(req.url, apiUrl, path);
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');

      request.flush({});
    });
  });

  describe(' saveCancel', () => {
    it('should call get api method with correct url and params', () => {
      const subTxnType = 'NEW_GEP';
      const id = '456789-YU-456789';
      const payload = {
        data: {},
        itemId: '234567890',
        status: 'confirm',
        subTxnType: subTxnType,
        id: id
      };
      const { path, params } = saveCancelUrl(payload);

      gepService.saveCancel(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        console.log(req.url, apiUrl, path);
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');

      request.flush({});
    });
  });

  describe(' deleteGEP', () => {
    it('should call delete api method with correct url and params', () => {
      const subTxnType = 'NEW_GEP';
      const id = '456789-YU-456789';
      const payload = {
        data: {},
        itemId: '234567890',
        status: 'confirm',
        subTxnType: subTxnType,
        id: id
      };
      const { path, params } = deleteGEPUrl(payload);

      gepService.deleteGep(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        console.log(req.url, apiUrl, path);
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('DELETE');

      request.flush({});
    });
  });

  // describe('upload', () => {
  //   it('should call upload api method with correct url and params', () => {
  //     const subTxnType = 'NEW_GEP';
  //     const id = '456789-YU-456789';
  //     const payload = {
  //       customerId: 123,
  //       file: null,
  //       id: id,
  //       txnType: TransactionTypeEnum.GEP
  //     };
  //     const url = uploadPreDeclarationFormUrl(payload);

  //     gepService.upload(payload).subscribe();

  //     const request = httpTestingController.expectOne(req => {
  //       console.log(req.url, apiUrl);
  //       return req.url === apiUrl + url;
  //     });
  //     expect(request.cancelled).toBeFalsy();
  //     expect(request.request.method).toEqual('POST');

  //     request.flush({});
  //   });
  // });

  describe('postTotalBreakUp', () => {
    it('should call total value api method with correct url and params', () => {
      const subTxnType = 'NEW_GEP';
      const id = '456789-YU-456789';
      const payload = {
        itemType: 'J',
        measuredPurity: 67,
        measuredWeight: 56,
        metalType: 'GOLD',
        standardPrice: []
      };
      const url = postTotalBreakUpUrl();

      gepService.postTotalBreakUp(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        console.log(req.url, apiUrl);
        return req.url === apiUrl + url;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');

      request.flush({});
    });
  });

  describe('getHistoryItems', () => {

    it('should call GET api method with correct url', () => {
      spyOn(GepHelper, 'getHistoryDetails').and.returnValue({});
      const path = getGEPHistoryEndPointUrl("subTxnType", "txnType", "searchField", "searchType", "status", 0, 0
      )
      
      gepService.getHistoryItems(advanceHistoryItemsRequestPayload,'searchField','searchType',"status", 0, 0, "txnType", "subTxnType").subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });

    it('should call  GepHelper method with correct arguments', () => {
      spyOn(GepHelper, 'getHistoryDetails').and.returnValue({});
      const path = getGEPHistoryEndPointUrl("subTxnType", "txnType", "searchField", "searchType", "status", 0, 0
    )
    
    gepService.getHistoryItems(advanceHistoryItemsRequestPayload,'searchField','searchType',"status", 0, 0, "txnType", "subTxnType").subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush(aBRequestStatusList);
      expect(GepHelper.getHistoryDetails).toHaveBeenCalledWith(
        aBRequestStatusList
      );
    });

    it('should retun data mapped by GEPHelper', () => {
      spyOn(GepHelper, 'getHistoryDetails').and.returnValue(gepSearchResponse);
      const path = getGEPHistoryEndPointUrl("subTxnType", "txnType", "searchField", "searchType", "status", 0, 0
    )
    gepService.getHistoryItems(advanceHistoryItemsRequestPayload,'searchField','searchType',"status", 0, 0, "txnType", "subTxnType").subscribe(data => {
 
        expect(data).toEqual(gepSearchResponse);
      });

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path.path
      );
      request.flush({});
    });
  });

  describe('getGEPTransactionDetails', () => {

    it('should call GET api method with correct url', () => {
      spyOn(GepHelper, 'getHistoryDetails').and.returnValue({});

      const urlObject = getGoodExchangeUrl(
        "id",
        "subTxnType",
        TransactionTypeEnum.GEP,
      );

      const viewGEPTransactionUrl = urlObject.path;
      const params = urlObject.params;
      
      gepService.getGEPTransactionDetails("id", "subTxnType",).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + viewGEPTransactionUrl;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });
  });
});
