import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

import { ProductCategoryService } from './product-category.service';
import {
  ApiService,
  getProductCategoryByProductCategoryCodeUrl,
  getProductCategoryDetailsListingUrl
} from '@poss-web/shared/util-api-service';
import { TestBed } from '@angular/core/testing';
import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import {
  LoadProductCategoryListingSuccessPayload,
  ProductCategory2,
  ProductCategoryDetails
} from '@poss-web/shared/models';
import { ProductCategoryAdaptor } from '@poss-web/shared/util-adaptors';

describe('ProductCategoryService', () => {
  const productCategory2: ProductCategory2[] = [
    {
      description: 'desc',
      productCategoryCode: 'A'
    }
  ];
  const dummyListPayload: LoadProductCategoryListingSuccessPayload = {
    productCategoryListing: productCategory2,
    totalElements: 1
  };

  const productCategoryListingResponse = [
    {
      productCategoryCode: 'A',
      description: 'desc',
      isActive: true
    },
    {
      productCategoryCode: 'B',
      description: 'desc',
      isActive: true
    }
  ];

  const dummyListResponse = {
    results: productCategoryListingResponse,
    pageIndex: 0,
    pageSize: 10,
    totalElements: 10
  };

  let httpTestingController: HttpTestingController;
  let service: ProductCategoryService;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;

  const apiUrl = 'http://localhost:3000';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ProductCategoryService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(ProductCategoryService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  apiServiceSpy = jasmine.createSpyObj<ApiService>('ApiService', [
    'get',
    'post',
    'patch'
  ]);

  service = new ProductCategoryService(apiServiceSpy);

  it('should create service', () => {
    expect(service).toBeDefined();
  });

  describe('getProductCategoryDetails', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(
        ProductCategoryAdaptor,
        'getProductCategoryDetailsListing'
      ).and.returnValue({});

      const pageIndex = 0;
      const pageSize = 10;
      const path = getProductCategoryDetailsListingUrl(pageSize, pageIndex);

      service.getProductCategoryDetails({ pageIndex, pageSize }).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
    it('should call getTepValidationConfigList TepValidationConfigAdaptors method with correct arguments', () => {
      const payload: number = 1;

      spyOn(
        ProductCategoryAdaptor,
        'getProductCategoryDetailsListing'
      ).and.returnValue(payload);

      const pageIndex = 0;
      const pageSize = 10;
      const path = getProductCategoryDetailsListingUrl(pageSize, pageIndex);
      service.getProductCategoryDetails({ pageIndex, pageSize }).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush(payload);
      expect(
        ProductCategoryAdaptor.getProductCategoryDetailsListing
      ).toHaveBeenCalledWith(payload);
    });

    it('should retun data mapped by listing adaptor', () => {
      const payload: number = 1;

      spyOn(
        ProductCategoryAdaptor,
        'getProductCategoryDetailsListing'
      ).and.returnValue(payload);

      const pageIndex = 0;
      const pageSize = 8;

      const path = getProductCategoryDetailsListingUrl(pageIndex, pageSize);
      service
        .getProductCategoryDetails({ pageIndex, pageSize })
        .subscribe(data => {
          expect(data).toBeDefined();
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush({});
    });
  });

  describe('getProductCategoryByProductCategoryCode', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(
        ProductCategoryAdaptor,
        'getProductCategoryDetails'
      ).and.returnValue({});

      const payload = 'Code';
      const path = getProductCategoryByProductCategoryCodeUrl(payload);

      service.getProductCategoryByProductCategoryCode(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
    it('should call getProductCategoryDetails ProductCategoryAdaptor method with correct arguments', () => {
      const payload = 'Code';
      const response: ProductCategoryDetails = {
        isActive: true,
        isConversionEnabled: true,
        description: 'Desc',
        orgCode: 'orgCode',
        productCategoryCode: 'A',
        hallmarkDetails: {
          data: {
            hallmarkingCharges: '10',
            isAllowedForHallmarking: false,
            isFOCForHallmarkingCharges: false
          },
          type: 'HALLMARK_DETAILS'
        }
      };

      spyOn(
        ProductCategoryAdaptor,
        'getProductCategoryDetails'
      ).and.returnValue(response);

      const path = getProductCategoryByProductCategoryCodeUrl(payload);
      service.getProductCategoryByProductCategoryCode(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush(response);
      expect(
        ProductCategoryAdaptor.getProductCategoryDetails
      ).toHaveBeenCalledWith(response);
    });

    it('should retun data mapped by listing adaptor', () => {
      const payload = 'Code';
      const response: ProductCategoryDetails = {
        isActive: true,
        isConversionEnabled: true,
        description: 'Desc',
        orgCode: 'orgCode',
        productCategoryCode: 'A',
        hallmarkDetails: {
          data: {
            hallmarkingCharges: '10',
            isAllowedForHallmarking: false,
            isFOCForHallmarkingCharges: false
          },
          type: 'HALLMARK_DETAILS'
        }
      };

      spyOn(
        ProductCategoryAdaptor,
        'getProductCategoryDetails'
      ).and.returnValue(response);

      const path = getProductCategoryByProductCategoryCodeUrl(payload);
      service
        .getProductCategoryByProductCategoryCode(payload)
        .subscribe(data => {
          expect(data).toBeDefined();
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush({});
    });
  });

  describe('getProductCategorySearchResult', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(
        ProductCategoryAdaptor,
        'getProductCategoryDetailsSearch'
      ).and.returnValue({});

      const payload = 'Code';
      const path = getProductCategoryByProductCategoryCodeUrl(payload);

      service.getProductCategorySearchResult(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
    it('should call getProductCategoryDetailsSearch ProductCategoryAdaptor method with correct arguments', () => {
      const payload = 'Code';
      const response: ProductCategoryDetails[] = [
        {
          isActive: true,
          isConversionEnabled: true,
          description: 'Desc',
          orgCode: 'orgCode',
          productCategoryCode: 'A',
          hallmarkDetails: {
            data: {
              hallmarkingCharges: '10',
              isAllowedForHallmarking: false,
              isFOCForHallmarkingCharges: false
            },
            type: 'HALLMARK_DETAILS'
          }
        }
      ];

      spyOn(
        ProductCategoryAdaptor,
        'getProductCategoryDetailsSearch'
      ).and.returnValue(response);

      const path = getProductCategoryByProductCategoryCodeUrl(payload);
      service.getProductCategorySearchResult(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush(response);
      expect(
        ProductCategoryAdaptor.getProductCategoryDetailsSearch
      ).toHaveBeenCalledWith(response);
    });

    it('should retun data mapped by listing adaptor', () => {
      const payload = 'Code';
      const response: ProductCategoryDetails[] = [
        {
          isActive: true,
          isConversionEnabled: true,
          description: 'Desc',
          orgCode: 'orgCode',
          productCategoryCode: 'A',
          hallmarkDetails: {
            data: {
              hallmarkingCharges: '10',
              isAllowedForHallmarking: false,
              isFOCForHallmarkingCharges: false
            },
            type: 'HALLMARK_DETAILS'
          }
        }
      ];

      spyOn(
        ProductCategoryAdaptor,
        'getProductCategoryDetailsSearch'
      ).and.returnValue(response);

      const path = getProductCategoryByProductCategoryCodeUrl(payload);
      service.getProductCategorySearchResult(payload).subscribe(data => {
        expect(data).toBeDefined();
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush({});
    });
  });
});
