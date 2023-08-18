import { CfaProductCodeService } from './cfa-product-code.service';
import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { CFAProductCodeAdaptor } from '@poss-web/shared/util-adaptors';
import {
  getCFAProductsUrl,
  getCFAProductsBasedOnProductGroupCodeUrl,
  getSaveCFAProductsUrl,
  getUpdateCFAProductsUrl,
  getItemTypeUrl
} from '@poss-web/shared/util-api-service';
import {
  CFAProduct,
  CFAProducts,
  CFAProductsResponse
} from '@poss-web/shared/models';
describe('CfaProductCodeService', () => {
  let httpTestingController: HttpTestingController;
  const apiUrl = 'http://localhost:3000';
  let cfaProductCodeService: CfaProductCodeService;
  const dummyProductGroupResponse: CFAProductsResponse[] = [
    {
      productGroupCode: '123',
      description: 'good',
      isActive: true
    }
  ];
  const dummyProductTypeData = {
    lovType: 'PRODUCTTYPE',
    values: [
      {
        code: 'pro123',
        isActive: true,
        value: 'Product'
      }
    ]
  };
  const dummyProductGroupResponseById: CFAProducts = {
    productGroupCode: '123',
    productType: 'gold',
    description: 'good',
    orgCode: '123',
    itemTypeCode: 'Neckale',
    isActive: true,
    configDetails: {}
  };
  const dummyProductGroupRequestResponse = {
    results: dummyProductGroupResponse,
    pageIndex: 0,
    pageSize: 10,
    totalElements: 10
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CfaProductCodeService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    cfaProductCodeService = TestBed.inject(CfaProductCodeService);
  });

  it('should be created', () => {
    expect(cfaProductCodeService).toBeTruthy();
  });

  describe('getProductGroupMasterList', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(CFAProductCodeAdaptor, 'getCFAProductCodeListing').and.returnValue(
        {}
      );
      const pageIndex = 0;
      const pageSize = 10;
      const { path, params } = getCFAProductsUrl(pageIndex, pageSize);

      cfaProductCodeService
        .getCFAProducts({ pageIndex: pageIndex, pageSize: pageSize })
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.params.get('page')).toEqual(pageIndex.toString());
      expect(request.request.params.get('size')).toEqual(pageSize.toString());
      expect(request.request.params.get('sort')).toEqual('createdDate,desc');
      request.flush({});
    });

    it('should call ProductGroupAdaptor getCFAProductCodeListing method with correct  parameters', () => {
      spyOn(CFAProductCodeAdaptor, 'getCFAProductCodeListing').and.returnValue(
        {}
      );
      const pageIndex = 0;
      const pageSize = 10;

      const path = getCFAProductsUrl(pageIndex, pageSize).path;

      cfaProductCodeService
        .getCFAProducts({ pageIndex: pageIndex, pageSize: pageSize })
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush(dummyProductGroupRequestResponse);
      expect(
        CFAProductCodeAdaptor.getCFAProductCodeListing
      ).toHaveBeenCalledWith(dummyProductGroupRequestResponse);
    });

    it('should return data mapped by adaptors', () => {
      spyOn(CFAProductCodeAdaptor, 'getCFAProductCodeListing').and.returnValue({
        CFAProductCodeListing: dummyProductGroupResponse,
        totalElements: 10
      });
      const pageIndex = 0;
      const pageSize = 10;

      const path = getCFAProductsUrl(pageIndex, pageSize).path;

      cfaProductCodeService
        .getCFAProducts({ pageIndex: pageIndex, pageSize: pageSize })
        .subscribe(data => {
          expect(data).toEqual({
            CFAProductCodeListing: dummyProductGroupResponse,
            totalElements: 10
          });
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });
  describe('getProductGroupByProductGroupCode', () => {
    it('should call GET api method with correct url and params', () => {
      const productGroup = 'Gold';

      const path = getCFAProductsBasedOnProductGroupCodeUrl(productGroup);

      cfaProductCodeService
        .getCFAProductsBasedProductGroupCode(productGroup)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
    // it('should return data mapped by adaptors', () => {
    //   spyOn(
    //     CFAProductCodeAdaptor,
    //     'getCFAProductsBasdedOnProductGroupCode'
    //   ).and.returnValue(dummyProductGroupResponseById);
    //   const ProductGroupCode = 'ABC123';

    //   const path = getCFAProductsBasedOnProductGroupCodeUrl(ProductGroupCode);

    //   cfaProductCodeService
    //     .getCFAProductsBasedProductGroupCode(ProductGroupCode)
    //     .subscribe(data => {
    //       expect(data).toEqual(dummyProductGroupResponseById);
    //     });

    //   const request = httpTestingController.expectOne(req => {
    //     return req.url === apiUrl + path;
    //   });

    //   request.flush({});
    // });
  });
  describe('getCFASearchResult', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(CFAProductCodeAdaptor, 'getCFASearchProduct').and.returnValue({});
      const ProductGroupCode = 'ABC123';
      const path = getCFAProductsBasedOnProductGroupCodeUrl(ProductGroupCode);

      cfaProductCodeService.getCFASearchResult(ProductGroupCode).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.urlWithParams).toEqual(apiUrl + path);
      request.flush({});
    });

    it('should call ProductGroupAdaptor getCFASearchProduct method with correct  parameters', () => {
      spyOn(CFAProductCodeAdaptor, 'getCFASearchProduct').and.returnValue({});
      const ProductGroupCode = 'ABC123';

      const path = getCFAProductsBasedOnProductGroupCodeUrl(ProductGroupCode);

      cfaProductCodeService.getCFASearchResult(ProductGroupCode).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush(dummyProductGroupResponseById);
      expect(CFAProductCodeAdaptor.getCFASearchProduct).toHaveBeenCalledWith(
        dummyProductGroupResponseById
      );
    });

    it('should return data mapped by adaptors', () => {
      spyOn(CFAProductCodeAdaptor, 'getCFASearchProduct').and.returnValue(
        dummyProductGroupResponse
      );
      const ProductGroupCode = 'ABC123';

      const path = getCFAProductsBasedOnProductGroupCodeUrl(ProductGroupCode);

      cfaProductCodeService
        .getCFASearchResult(ProductGroupCode)
        .subscribe(data => {
          expect(data).toEqual(dummyProductGroupResponse);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });
  describe('saveProductGroupList', () => {
    it('should call POST api method with correct url and params', () => {
      const path = getSaveCFAProductsUrl();

      cfaProductCodeService
        .saveCFAProducts(dummyProductGroupResponseById)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
  });
  describe('updateProductGroupByProductGroupCode', () => {
    it('should call PATCH api method with correct url and params', () => {
      const productGroup = 'Pro123';

      const path = getUpdateCFAProductsUrl(productGroup);

      cfaProductCodeService
        .updateCFAProducts({
          productGroupCode: 'Pro123',
          data: dummyProductGroupResponseById
        })
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
  });
  describe('loadMaterialTypes', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(CFAProductCodeAdaptor, 'getItemTypes').and.returnValue({});

      const { path, params } = getItemTypeUrl();

      cfaProductCodeService.loadItemTypes().subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.params.get('itemGroups')).toEqual('metal');
      request.flush({});
    });

    // it('should call ProductGroupAdaptor getMaterialTypes method with correct  parameters', () => {
    //   spyOn(CFAProductCodeAdaptor, 'getMaterialTypes').and.returnValue({});

    //   const path = getMaterialTypesUrl();

    //   cfaProductCodeService.loadMaterialTypes().subscribe();

    //   const request = httpTestingController.expectOne(req => {
    //     return req.url === apiUrl + path;
    //   });
    //   request.flush(dummyProductTypeData);
    //   expect(CFAProductCodeAdaptor.getProductTypes).toHaveBeenCalledWith(
    //     dummyProductTypeData
    //   );
    // });

    // it('should return data mapped by adaptors', () => {
    //   spyOn(CFAProductCodeAdaptor, 'getProductTypes').and.returnValue([
    //     { id: 'Pro123', name: 'gold', isActive: true }
    //   ]);

    //   const path = getProductTypesUrl();

    //   cfaProductCodeService.loadProductTypes().subscribe(data => {
    //     expect(data).toEqual([{ id: 'Pro123', name: 'gold', isActive: true }]);
    //   });

    //   const request = httpTestingController.expectOne(req => {
    //     return req.url === apiUrl + path;
    //   });

    //   request.flush({});
    // });
  });
});
