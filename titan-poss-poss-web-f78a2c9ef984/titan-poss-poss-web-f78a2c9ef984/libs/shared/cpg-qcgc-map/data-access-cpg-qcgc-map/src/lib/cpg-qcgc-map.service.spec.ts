import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

import { CPGQCGCMapService } from './cpg-qcgc-map.service';
import {
  ApiService,
  getAllPaymentCategoryListingUrl
} from '@poss-web/shared/util-api-service';
import { TestBed } from '@angular/core/testing';
import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { CPGProductGroupConfigForQCGCAdaptor } from '@poss-web/shared/util-adaptors';
import { CPGProductGroupConfigForQCGCListingResult } from '@poss-web/shared/models';

describe('CashPaymentConfigurationService', () => {
  let httpTestingController: HttpTestingController;
  let service: CPGQCGCMapService;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;

  const apiUrl = 'http://localhost:3000';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CPGQCGCMapService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(CPGQCGCMapService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  apiServiceSpy = jasmine.createSpyObj<ApiService>('ApiService', [
    'get',
    'post',
    'patch'
  ]);

  service = new CPGQCGCMapService(apiServiceSpy);

  it('should create service', () => {
    expect(service).toBeDefined();
  });

  describe('getTepValidationConfigList', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(
        CPGProductGroupConfigForQCGCAdaptor,
        'getCPGProductGroupConfigForQCGCListing'
      ).and.returnValue({});
      const path = getAllPaymentCategoryListingUrl(0, 10, '');

      service
        .getCPGProductGroupConfigurationList({ pageSize: 10, pageIndex: 0, searchData: '' })
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
    it('should call getTepValidationConfigList TepValidationConfigAdaptors method with correct arguments', () => {
      const payload: CPGProductGroupConfigForQCGCListingResult = {
        pageNumber: 1,
        pageSize: 10,
        results: [],
        totalElements: 0,
        totalPages: 1
      };

      spyOn(
        CPGProductGroupConfigForQCGCAdaptor,
        'getCPGProductGroupConfigForQCGCListing'
      ).and.returnValue(payload);

      const path = getAllPaymentCategoryListingUrl(0, 10, '');
      service
        .getCPGProductGroupConfigurationList({ pageSize: 10, pageIndex: 0, searchData: '' })
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush(payload);
      expect(
        CPGProductGroupConfigForQCGCAdaptor.getCPGProductGroupConfigForQCGCListing
      ).toHaveBeenCalledWith(payload);
    });

    it('should retun data mapped by listing adaptor', () => {
      const payload: number = 1;

      spyOn(
        CPGProductGroupConfigForQCGCAdaptor,
        'getCPGProductGroupConfigForQCGCListing'
      ).and.returnValue(payload);

      const path = getAllPaymentCategoryListingUrl(10, 0, '');
      service
        .getCPGProductGroupConfigurationList({ pageSize: 10, pageIndex: 0, searchData: '' })
        .subscribe(data => {
          expect(data).toBeDefined();
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush({});
    });
  });
});
