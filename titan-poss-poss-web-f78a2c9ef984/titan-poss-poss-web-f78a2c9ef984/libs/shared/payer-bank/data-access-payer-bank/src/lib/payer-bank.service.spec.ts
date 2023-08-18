import { PayerBankService } from './payer-bank.service';

import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import {
  FileResponse,
  PayerBankMasterResponse,
  PayerBanksPayload
} from '@poss-web/shared/models';
import { TestBed } from '@angular/core/testing';
import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { PayerBankSelectors } from './+state/payer-bank.selector';
import { PayerBankAdaptor } from '@poss-web/shared/util-adaptors';
import {
  getFileUploadCommonUrl,
  loadPayerBanksUrl,
  searchPayerBankUrl
} from '@poss-web/shared/util-api-service';
describe('PayerBankService', () => {
  let httpTestingController: HttpTestingController;
  const apiUrl = 'http://localhost:3000';
  let payerBankService: PayerBankService;
  const payerBanksListing: PayerBankMasterResponse = {
    payerBanks: [
      {
        bankName: 'AXIS',
        isActive: true
      }
    ],
    totalElements: 1
  };
  const fileResponse: FileResponse = {
    totalCount: 2,
    successCount: 2,
    failureCount: 2,
    errorLogId: 12,
    hasError: true
  };
  const payload: PayerBanksPayload = {
    pageIndex: 10,
    pageSize: 10
  };
  const dummyPayerBanks = {
    results: payerBanksListing.payerBanks,
    pageIndex: 0,
    pageSize: 1,
    totalElements: 10
  };
  const dummyFileUploadResponse = {
    records: {
      totalCount: 1,
      successCount: 1,
      failureCount: 1,
      errorLogId: '1',
      hasError: true
    }
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        PayerBankService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    payerBankService = TestBed.inject(PayerBankService);
  });
  it('should be created', () => {
    expect(PayerBankService).toBeTruthy();
  });
  describe('loadPayerBanks', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(PayerBankAdaptor, 'getPayerBanks').and.returnValue({});
      const pageIndex = 0;
      const pageSize = 10;
      const { path, params } = loadPayerBanksUrl(pageIndex, pageSize);

      payerBankService
        .loadPayerBanks({ pageIndex: pageIndex, pageSize: pageSize })
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('page')).toEqual(pageIndex.toString());
      expect(request.request.params.get('size')).toEqual(pageSize.toString());
      expect(request.request.params.get('sort')).toEqual('createdDate,desc');
      request.flush({});
    });
    it('should call PayerBankAdaptor getPayerBanks method with correct  parameters', () => {
      spyOn(PayerBankAdaptor, 'getPayerBanks').and.returnValue({});
      const pageIndex = 0;
      const pageSize = 10;

      const path = loadPayerBanksUrl(pageIndex, pageSize).path;

      payerBankService
        .loadPayerBanks({ pageIndex: pageIndex, pageSize: pageSize })
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush(dummyPayerBanks);
      expect(PayerBankAdaptor.getPayerBanks).toHaveBeenCalledWith(
        dummyPayerBanks
      );
    });
    it('should return data mapped by adaptors', () => {
      spyOn(PayerBankAdaptor, 'getPayerBanks').and.returnValue(
        payerBanksListing
      );
      const pageIndex = 0;
      const pageSize = 10;

      const path = loadPayerBanksUrl(pageIndex, pageSize).path;

      payerBankService
        .loadPayerBanks({ pageIndex: pageIndex, pageSize: pageSize })
        .subscribe(data => {
          expect(data).toEqual(payerBanksListing);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });
  describe('UploaFile', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(PayerBankAdaptor, 'getFileResponse').and.returnValue({});

      const { path, params } = getFileUploadCommonUrl('PAYER_BANK');

      payerBankService.fileUpload(null).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('fileGroup')).toEqual('PAYER_BANK');

      request.flush({});
    });
    it('should return data mapped by adaptors', () => {
      spyOn(PayerBankAdaptor, 'getFileResponse').and.returnValue(
        dummyFileUploadResponse
      );

      const path = getFileUploadCommonUrl('PAYER_BANK').path;

      payerBankService.fileUpload(null).subscribe(data => {
        expect(data).toEqual(dummyFileUploadResponse);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });

    it('should return data mapped by adaptors', () => {
      spyOn(PayerBankAdaptor, 'getFileResponse').and.returnValue(fileResponse);

      const path = getFileUploadCommonUrl('PAYER_BANK').path;

      payerBankService.fileUpload(null).subscribe(data => {
        expect(data).toEqual(fileResponse);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });
  describe('searchPayerBank', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(PayerBankAdaptor, 'getSearchResult').and.returnValue({});

      const { path, params } = searchPayerBankUrl('Axis');

      payerBankService.searchPayerBanks('Axis').subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('bankName')).toEqual('Axis');

      request.flush({});
    });
    it('should call PayerBankAdaptor getSearchResult method with correct  parameters', () => {
      spyOn(PayerBankAdaptor, 'getSearchResult').and.returnValue({});

      const path = searchPayerBankUrl('Axis').path;

      payerBankService.searchPayerBanks('Axis').subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush(dummyPayerBanks);
      expect(PayerBankAdaptor.getSearchResult).toHaveBeenCalledWith(
        dummyPayerBanks
      );
    });
    it('should return data mapped by adaptors', () => {
      spyOn(PayerBankAdaptor, 'getSearchResult').and.returnValue(
        payerBanksListing.payerBanks
      );

      const path = searchPayerBankUrl('Axis').path;

      payerBankService.searchPayerBanks('Axis').subscribe(data => {
        expect(data).toEqual(payerBanksListing.payerBanks);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });
});
