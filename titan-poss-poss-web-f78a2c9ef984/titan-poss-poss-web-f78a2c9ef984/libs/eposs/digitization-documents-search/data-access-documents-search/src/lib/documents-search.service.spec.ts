import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { DocumentsSearchService } from './documents-search.service';
import {
  documentsSearchEndPointUrl,
  getDownloadDocFromEpossUrl
} from '@poss-web/shared/util-api-service';

describe('DocumentsSearchService', () => {
  let httpTestingController: HttpTestingController;
  let documentsSearchService: DocumentsSearchService;
  const apiUrl = 'http://localhost:3000';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        DocumentsSearchService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    documentsSearchService = TestBed.inject(DocumentsSearchService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(documentsSearchService).toBeTruthy();
  });

  it('getInvoiceList - should get Invoice List', () => {
    const apiPath = documentsSearchEndPointUrl('CM', 1, 10);
    documentsSearchService
      .getInvoiceList(
        {
          docNo: 123
        },
        'CM',
        1,
        10
      )
      .subscribe();

    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath.path;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('POST');
    expect(request.request.responseType).toEqual('json');
    request.flush({});
  });

  it('getDocumentDownloadResponse - should document download response', () => {
    const apiPath = getDownloadDocFromEpossUrl('123', 'CPD');
    spyOn(documentsSearchService, 'downloadPdfFile').and.returnValue(null);
    documentsSearchService
      .getDocumentDownloadResponse({
        id: '123',
        locationCode: 'CPD'
      })
      .subscribe();

    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + apiPath.path;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('GET');
    request.flush(new Blob());
  });
});
