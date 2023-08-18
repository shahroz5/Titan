import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { InventoryHomeService } from './inventory-home.service';
import {
  getStockTransferNoteCountEndpointUrl,
  getReceiveInvoiceEndpointUrl,
  getIssueSTNCountEndpointUrl
} from '@poss-web/shared/util-api-service';
import { InventoryHomeAdaptor } from '@poss-web/shared/util-adaptors';
import {
  LoadSTNCountPayload,
  LoadReceiveInvoicePayload,
  LoadIssueSTNCountsPayload
} from '@poss-web/shared/models';

describe('InventoryHomeService', () => {
  let httpTestingController: HttpTestingController;
  let inventoryHomeService: InventoryHomeService;
  const APIUrl = 'http://localhost:3000';

  const STNCountResponse: LoadSTNCountPayload = {
    pendingFactorySTNCount: 10,
    pendingBoutiqueSTNCount: 20,
    pendingMerchandiseSTNcount: 30
  };

  const receiveInvoiceResponse: LoadReceiveInvoicePayload = {
    pendingCFASTNCount: 15
  };

  const issueCountResponse: LoadIssueSTNCountsPayload = {
    pendingIssueBTQ_BTQ_STNCount: 5,
    pendingIssueBTQ_FAC_STNCount: 15,
    pendingIssueBTQ_MER_STNCount: 25
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        InventoryHomeService,
        {
          provide: POSS_WEB_API_URL,
          useValue: APIUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    inventoryHomeService = TestBed.inject(InventoryHomeService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(InventoryHomeService).toBeTruthy();
  });

  describe('getSTNCount', () => {
    it('should call GET API method', () => {
      spyOn(InventoryHomeAdaptor, 'STNCountFromJson').and.returnValue({});
      const path = getStockTransferNoteCountEndpointUrl();

      inventoryHomeService.getSTNCount().subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === APIUrl + path;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.url).toBe(APIUrl + path);
      request.flush({});
    });

    it('should call requests helper method', () => {
      spyOn(InventoryHomeAdaptor, 'STNCountFromJson').and.returnValue({});
      const path = getStockTransferNoteCountEndpointUrl();

      inventoryHomeService.getSTNCount().subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === APIUrl + path;
      });
      request.flush(STNCountResponse);
      expect(InventoryHomeAdaptor.STNCountFromJson).toHaveBeenCalledWith(
        STNCountResponse
      );
    });

    it('should return mapped data', () => {
      spyOn(InventoryHomeAdaptor, 'STNCountFromJson').and.returnValue(
        STNCountResponse
      );
      const path = getStockTransferNoteCountEndpointUrl();

      inventoryHomeService.getSTNCount().subscribe(data => {
        expect(data).toEqual(STNCountResponse);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === APIUrl + path;
      });
      request.flush({});
    });
  });

  describe('getReceiveInvoice', () => {
    it('should call GET API method', () => {
      spyOn(InventoryHomeAdaptor, 'ReceiveInvoiceFromJson').and.returnValue({});
      const path = getReceiveInvoiceEndpointUrl();

      inventoryHomeService.getReceiveInvoice().subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === APIUrl + path;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.url).toBe(APIUrl + path);
      request.flush({});
    });

    it('should call requests helper method', () => {
      spyOn(InventoryHomeAdaptor, 'ReceiveInvoiceFromJson').and.returnValue({});
      const path = getReceiveInvoiceEndpointUrl();

      inventoryHomeService.getReceiveInvoice().subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === APIUrl + path;
      });
      request.flush(receiveInvoiceResponse);
      expect(InventoryHomeAdaptor.ReceiveInvoiceFromJson).toHaveBeenCalledWith(
        receiveInvoiceResponse
      );
    });

    it('should return mapped data', () => {
      spyOn(InventoryHomeAdaptor, 'ReceiveInvoiceFromJson').and.returnValue(
        receiveInvoiceResponse
      );
      const path = getReceiveInvoiceEndpointUrl();

      inventoryHomeService.getReceiveInvoice().subscribe(data => {
        expect(data).toEqual(receiveInvoiceResponse);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === APIUrl + path;
      });
      request.flush({});
    });
  });

  describe('getIssueCount', () => {
    it('should call GET API method', () => {
      spyOn(InventoryHomeAdaptor, 'IssueSTNCountFromJson').and.returnValue({});
      const { path } = getIssueSTNCountEndpointUrl();

      inventoryHomeService.getIssueCount().subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === APIUrl + path;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.url).toBe(APIUrl + path);
      request.flush({});
    });

    it('should call requests helper method', () => {
      spyOn(InventoryHomeAdaptor, 'IssueSTNCountFromJson').and.returnValue({});
      const { path } = getIssueSTNCountEndpointUrl();

      inventoryHomeService.getIssueCount().subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === APIUrl + path;
      });
      request.flush(issueCountResponse);
      expect(InventoryHomeAdaptor.IssueSTNCountFromJson).toHaveBeenCalledWith(
        issueCountResponse
      );
    });

    it('should return mapped data', () => {
      spyOn(InventoryHomeAdaptor, 'IssueSTNCountFromJson').and.returnValue(
        issueCountResponse
      );
      const { path } = getIssueSTNCountEndpointUrl();

      inventoryHomeService.getIssueCount().subscribe(data => {
        expect(data).toEqual(issueCountResponse);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === APIUrl + path;
      });
      request.flush({});
    });
  });
});
