import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { CnMasterService } from './cn-master.service';
import { CnMasterListResponse, PaginatePayload } from '@poss-web/shared/models';
import {
  getCnMasterDetailByCnTypeUrl,
  getCnMasterListUrl,
  getSearchCnMasterByCnTypeUrl
} from '@poss-web/shared/util-api-service';
import { CnMasterAdaptor } from '@poss-web/shared/util-adaptors';
import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';

describe('CnMasterService', () => {
  let httpTestingController: HttpTestingController;
  let cnMasterService: CnMasterService;
  const apiUrl = 'http://localhost:3000';

  const cnMasterListResponse: CnMasterListResponse = {
    cnMasterList: [
      {
        creditNoteType: 'Advance',
        description: 'advance booking description',
        isActive: true,
        IsAllowedForGHSGrammageAccount: false,
        IsAllowedforEghs: false
      },
      {
        creditNoteType: 'BillCancellation',
        description: 'BillCancellation',
        isActive: true,
        IsAllowedForGHSGrammageAccount: false,
        IsAllowedforEghs: false
      },
      {
        creditNoteType: 'CNIntBTQ',
        description: 'InterBoutique CN',
        isActive: true,
        IsAllowedForGHSGrammageAccount: false,
        IsAllowedforEghs: false
      }
    ],
    totalElements: 3
  };

  const cnMasterListApiResponse = {
    results: [
      {
        creditNoteType: 'Advance',
        description: 'advance booking description',
        configDetails: {
          data: {
            IsAllowedForGHSGrammageAccount: false,
            IsAllowedforEghs: false
          }
        },
        isActive: false
      },
      {
        creditNoteType: 'BillCancellation',
        description: 'BillCancellation',
        configDetails: {
          data: { IsAllowedForGHSGrammageAccount: true, IsAllowedforEghs: true }
        },
        isActive: true
      },
      {
        creditNoteType: 'CNIntBTQ',
        description: 'InterBoutique CN',
        configDetails: {
          data: {
            IsAllowedForGHSGrammageAccount: true,
            IsAllowedforEghs: false
          }
        },
        isActive: true
      },
      {
        creditNoteType: 'GEP',
        description: 'Gold Exchange',
        configDetails: {
          data: { IsAllowedForGHSGrammageAccount: true, IsAllowedforEghs: true }
        },
        isActive: true
      },
      {
        creditNoteType: 'GHS',
        description: 'Golden Harvest Scheme',
        configDetails: {
          data: { IsAllowedForGHSGrammageAccount: true, IsAllowedforEghs: true }
        },
        isActive: true
      },
      {
        creditNoteType: 'GRN',
        description: 'GRN',
        configDetails: {
          data: { IsAllowedForGHSGrammageAccount: true, IsAllowedforEghs: true }
        },
        isActive: true
      },
      {
        creditNoteType: 'TEP',
        description: 'TEP',
        configDetails: {
          data: { IsAllowedForGHSGrammageAccount: true, IsAllowedforEghs: true }
        },
        isActive: true
      }
    ],
    pageNumber: 0,
    pageSize: 10,
    totalPages: 1,
    totalElements: 7
  };

  const cnMasterDetailAPIresponse = {
    creditNoteType: 'BillCancellation',
    description: 'BillCancellation',
    configDetails: {
      data: { IsAllowedForGHSGrammageAccount: true, IsAllowedforEghs: true }
    },
    isActive: true
  };

  const cnMasterDetailResponse = {
    creditNoteType: 'GEP',
    description: 'GEP',
    isActive: true,
    IsAllowedForGHSGrammageAccount: false,
    IsAllowedforEghs: false
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CnMasterService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    cnMasterService = TestBed.inject(CnMasterService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(cnMasterService).toBeTruthy();
  });

  describe('getCnMasterList', () => {
    it('Credit Note Master List - should call GET api method with correct url and params', () => {
      spyOn(CnMasterAdaptor, 'getCnMasterList').and.returnValue({});
      const payload: PaginatePayload = {
        pageIndex: 0,
        pageSize: 10
      };
      const { path, params } = getCnMasterListUrl(
        payload.pageIndex,
        payload.pageSize
      );

      cnMasterService
        .getCnMasterList(payload.pageIndex, payload.pageSize)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });

    it('should call getCnMasterList adaptor method with correct arguments', () => {
      spyOn(CnMasterAdaptor, 'getCnMasterList').and.returnValue({});
      const payload: PaginatePayload = {
        pageIndex: 0,
        pageSize: 10
      };

      const { path, params } = getCnMasterListUrl(
        payload.pageIndex,
        payload.pageSize
      );

      cnMasterService
        .getCnMasterList(payload.pageIndex, payload.pageSize)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(cnMasterListApiResponse);
      expect(CnMasterAdaptor.getCnMasterList).toHaveBeenCalledWith(
        cnMasterListApiResponse
      );
    });

    it('should retun data mapped by getCnMasterList adaptor', () => {
      spyOn(CnMasterAdaptor, 'getCnMasterList').and.returnValue(
        cnMasterListResponse
      );
      const payload: PaginatePayload = {
        pageIndex: 0,
        pageSize: 10
      };

      const { path, params } = getCnMasterListUrl(
        payload.pageIndex,
        payload.pageSize
      );

      cnMasterService
        .getCnMasterList(payload.pageIndex, payload.pageSize)
        .subscribe(data => {
          expect(data.cnMasterList).toEqual(cnMasterListResponse.cnMasterList);
          expect(data.totalElements).toEqual(
            cnMasterListResponse.totalElements
          );
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush({});
    });
  });

  describe('searchCnMasterByCnType', () => {
    it('Search CN master by CN Type - should call GET api method with correct url and params', () => {
      spyOn(CnMasterAdaptor, 'getCnMasterList').and.returnValue({});
      const payload = 'GEP';
      const { path, params } = getSearchCnMasterByCnTypeUrl(payload);

      cnMasterService.searchCnMasterByCnType(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });

    it('should call getCnMasterList adaptor method with correct arguments', () => {
      spyOn(CnMasterAdaptor, 'getCnMasterList').and.returnValue({});
      const payload = 'GEP';

      const { path, params } = getSearchCnMasterByCnTypeUrl(payload);

      cnMasterService.searchCnMasterByCnType(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(cnMasterListApiResponse);
      expect(CnMasterAdaptor.getCnMasterList).toHaveBeenCalledWith(
        cnMasterListApiResponse
      );
    });

    it('should retun data mapped by CnMasterAdaptor adaptor', () => {
      spyOn(CnMasterAdaptor, 'getCnMasterList').and.returnValue(
        cnMasterListResponse
      );
      const payload = 'GEP';

      const { path, params } = getSearchCnMasterByCnTypeUrl(payload);

      cnMasterService.searchCnMasterByCnType(payload).subscribe(data => {
        expect(data.cnMasterList).toEqual(cnMasterListResponse.cnMasterList);
        expect(data.totalElements).toEqual(cnMasterListResponse.totalElements);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush({});
    });
  });

  describe('getCnMasterDetailByCnType', () => {
    it('CN master Detail by CN Type - should call GET api method with correct url and params', () => {
      spyOn(CnMasterAdaptor, 'getCnMasterDetail').and.returnValue({});
      const payload = 'GEP';
      const path = getCnMasterDetailByCnTypeUrl(payload);

      cnMasterService.getCnMasterDetailByCnType(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });

    it('should call getCnMasterDetail adaptor method with correct arguments', () => {
      spyOn(CnMasterAdaptor, 'getCnMasterDetail').and.returnValue({});
      const payload = 'GEP';

      const path = getCnMasterDetailByCnTypeUrl(payload);

      cnMasterService.getCnMasterDetailByCnType(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(cnMasterDetailAPIresponse);
      expect(CnMasterAdaptor.getCnMasterDetail).toHaveBeenCalledWith(
        cnMasterDetailAPIresponse
      );
    });

    it('should retun data mapped by getCnMasterDetail adaptor', () => {
      spyOn(CnMasterAdaptor, 'getCnMasterDetail').and.returnValue(
        cnMasterDetailResponse
      );
      const payload = 'GEP';

      const path = getCnMasterDetailByCnTypeUrl(payload);

      cnMasterService.getCnMasterDetailByCnType(payload).subscribe(data => {
        expect(data).toEqual(cnMasterDetailResponse);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush({});
    });
  });

  describe('updateCnMasterDetail', () => {
    it('Update CN master detail - should call UPDATE api method with correct url and params', () => {
      spyOn(CnMasterAdaptor, 'getCnMasterDetail').and.returnValue({});
      const payload = 'GEP';
      const path = getCnMasterDetailByCnTypeUrl(payload);

      cnMasterService
        .updateCnMasterDetail(payload, cnMasterDetailAPIresponse)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });

    it('should call getCnMasterDetail adaptor method with correct arguments', () => {
      spyOn(CnMasterAdaptor, 'getCnMasterDetail').and.returnValue({});
      const payload = 'GEP';

      const path = getCnMasterDetailByCnTypeUrl(payload);

      cnMasterService
        .updateCnMasterDetail(payload, cnMasterDetailAPIresponse)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(cnMasterDetailAPIresponse);
      expect(CnMasterAdaptor.getCnMasterDetail).toHaveBeenCalledWith(
        cnMasterDetailAPIresponse
      );
    });

    it('should retun data mapped by getCnMasterDetail adaptor', () => {
      spyOn(CnMasterAdaptor, 'getCnMasterDetail').and.returnValue(
        cnMasterDetailResponse
      );
      const payload = 'GEP';

      const path = getCnMasterDetailByCnTypeUrl(payload);

      cnMasterService
        .updateCnMasterDetail(payload, cnMasterDetailAPIresponse)
        .subscribe(data => {
          expect(data).toEqual(cnMasterDetailResponse);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush({});
    });
  });
});
