import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

import {
  ApiService,
  getCatchmentDetailsUrl,
  getCatchmentListingUrl,
  getSaveCatchmentFormUrl,
  searchCatchmentListingUrl
} from '@poss-web/shared/util-api-service';
import { TestBed } from '@angular/core/testing';
import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { CatchmentAdaptor } from '@poss-web/shared/util-adaptors';
import {
  CatchmentDetails,
  ConfigListingPayload,
  LoadCatchmentListingPayload,
  LoadCatchmentListingSuccessPayload
} from '@poss-web/shared/models';
import { CatchmentService } from './catchment.service';

describe('getCatchmentListing', () => {
  let httpTestingController: HttpTestingController;
  let service: CatchmentService;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;

  const apiUrl = 'http://localhost:3000';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CatchmentService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(CatchmentService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  apiServiceSpy = jasmine.createSpyObj<ApiService>('ApiService', [
    'get',
    'post',
    'patch'
  ]);

  service = new CatchmentService(apiServiceSpy);

  it('should create service', () => {
    expect(service).toBeDefined();
  });

  describe('getCatchmentListing', () => {
    const payload: ConfigListingPayload = {
      pageIndex: 0,
      pageSize: 1
    };

    it('should call GET api method with correct url and params', () => {
      spyOn(CatchmentAdaptor, 'getCatchmentListing').and.returnValue({});
      const payload: LoadCatchmentListingPayload = {
        pageIndex: 0,
        pageSize: 10
      };
      const path = getCatchmentListingUrl(payload.pageIndex, payload.pageSize);
      service.getCatchmentListing(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
    it('should call getCatchmentListing CatchmentAdaptor method with correct arguments', () => {
      const payload2: LoadCatchmentListingSuccessPayload = {
        catchmentListing: [
          {
            catchmentCode: 'Code',
            description: 'Desc',
            isActive: true
          }
        ],
        totalElements: 1
      };
      spyOn(CatchmentAdaptor, 'getCatchmentListing').and.returnValue(payload2);

      const payload: LoadCatchmentListingPayload = {
        pageIndex: 0,
        pageSize: 10
      };
      const path = getCatchmentListingUrl(payload.pageIndex, payload.pageSize);
      service.getCatchmentListing(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush(payload2);
      expect(CatchmentAdaptor.getCatchmentListing).toHaveBeenCalledWith(
        payload2
      );
    });

    it('should retun data mapped by listing adaptor', () => {
      const payload2: LoadCatchmentListingSuccessPayload = {
        catchmentListing: [
          {
            catchmentCode: 'Code',
            description: 'Desc',
            isActive: true
          }
        ],
        totalElements: 1
      };
      spyOn(CatchmentAdaptor, 'getCatchmentListing').and.returnValue(payload2);

      const path = getCatchmentListingUrl(payload.pageIndex, payload.pageSize);
      service.getCatchmentListing(payload).subscribe(data => {
        expect(data).toEqual(payload2);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush({});
    });
  });

  describe('searchCatchmentDetails', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(CatchmentAdaptor, 'getCatchmentListing').and.returnValue({});
      const payload = '';
      const path = searchCatchmentListingUrl(payload);
      service.searchCatchmentDetails(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
    it('should call getCatchmentListing CatchmentAdaptor method with correct arguments', () => {
      const payload2: LoadCatchmentListingSuccessPayload = {
        catchmentListing: [
          {
            catchmentCode: 'Code',
            description: 'Desc',
            isActive: true
          }
        ],
        totalElements: 1
      };
      spyOn(CatchmentAdaptor, 'getCatchmentListing').and.returnValue(payload2);

      const payload = '';
      const path = searchCatchmentListingUrl(payload);
      service.searchCatchmentDetails(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush(payload2);
      expect(CatchmentAdaptor.getCatchmentListing).toHaveBeenCalledWith(
        payload2
      );
    });

    it('should retun data mapped by listing adaptor', () => {
      const payload2: LoadCatchmentListingSuccessPayload = {
        catchmentListing: [
          {
            catchmentCode: 'Code',
            description: 'Desc',
            isActive: true
          }
        ],
        totalElements: 1
      };
      spyOn(CatchmentAdaptor, 'getCatchmentListing').and.returnValue(payload2);

      const payload = '';
      const path = searchCatchmentListingUrl(payload);
      service.searchCatchmentDetails(payload).subscribe(data => {
        expect(data).toEqual(payload2);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush({});
    });
  });

  describe('getCatchmentDetails', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(CatchmentAdaptor, 'getCatchmentDetails').and.returnValue({});
      const payload = '';
      const path = getCatchmentDetailsUrl(payload);
      service.getCatchmentDetails(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
    it('should call getCatchmentListing CatchmentAdaptor method with correct arguments', () => {
      const payload2: CatchmentDetails = {
        catchmentCode: 'Code',
        description: 'Desc',
        isActive: true
      };
      spyOn(CatchmentAdaptor, 'getCatchmentDetails').and.returnValue(payload2);

      const payload = '';
      const path = getCatchmentDetailsUrl(payload);
      service.getCatchmentDetails(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush(payload2);
      expect(CatchmentAdaptor.getCatchmentDetails).toHaveBeenCalledWith(
        payload2
      );
    });

    it('should retun data mapped by listing adaptor', () => {
      const payload2: CatchmentDetails = {
        catchmentCode: 'Code',
        description: 'Desc',
        isActive: true
      };
      spyOn(CatchmentAdaptor, 'getCatchmentDetails').and.returnValue(payload2);

      const payload = '';
      const path = getCatchmentDetailsUrl(payload);
      service.getCatchmentDetails(payload).subscribe(data => {
        expect(data).toEqual(payload2);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush({});
    });
  });

  describe('saveCatchmentFormDetails', () => {
    const payload: CatchmentDetails = {
      catchmentCode: 'Code',
      description: 'Desc',
      isActive: true
    };
    it('should call GET api method with correct url and params', () => {
      spyOn(CatchmentAdaptor, 'getCatchmentDetails').and.returnValue({});
      const path = getSaveCatchmentFormUrl();
      service.saveCatchmentFormDetails(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
    it('should call getCatchmentListing CatchmentAdaptor method with correct arguments', () => {
      spyOn(CatchmentAdaptor, 'getCatchmentDetails').and.returnValue(payload);

      const path = getSaveCatchmentFormUrl();
      service.saveCatchmentFormDetails(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush(payload);
      expect(CatchmentAdaptor.getCatchmentDetails).toHaveBeenCalledWith(
        payload
      );
    });

    it('should retun data mapped by listing adaptor', () => {
      spyOn(CatchmentAdaptor, 'getCatchmentDetails').and.returnValue(payload);

      const path = getSaveCatchmentFormUrl();
      service.saveCatchmentFormDetails(payload).subscribe(data => {
        expect(data).toEqual(payload);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush({});
    });
  });

  /*  describe('editCatchmentFormDetails', () => {
    const payload: CatchmentDetails = {
      catchmentCode: 'Code',
      description: 'Desc',
      isActive: true
    };
    it('should call GET api method with correct url and params', () => {
      spyOn(CatchmentAdaptor, 'getCatchmentDetails').and.returnValue({});
      const path = getSaveCatchmentFormUrl();
      service.editCatchmentFormDetails(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
    it('should call getCatchmentListing CatchmentAdaptor method with correct arguments', () => {
      spyOn(CatchmentAdaptor, 'getCatchmentDetails').and.returnValue(payload);

      const path = getSaveCatchmentFormUrl();
      service.saveCatchmentFormDetails(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush(payload);
      expect(CatchmentAdaptor.getCatchmentDetails).toHaveBeenCalledWith(
        payload
      );
    });

    it('should retun data mapped by listing adaptor', () => {
      spyOn(CatchmentAdaptor, 'getCatchmentListing').and.returnValue(payload);

      const path = getSaveCatchmentFormUrl();
      service.saveCatchmentFormDetails(payload).subscribe(data => {
        expect(data).toEqual(payload);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush({});
    });
  }); */
});
