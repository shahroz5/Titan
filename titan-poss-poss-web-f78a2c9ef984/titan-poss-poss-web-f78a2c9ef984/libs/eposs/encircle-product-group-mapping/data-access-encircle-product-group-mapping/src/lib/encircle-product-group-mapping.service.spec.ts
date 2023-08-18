import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
  EncircleProductGroupMappingSavePayload,
  ProductGroup,
  ProductGroupMappingOption,
  ProductGroupMappingResponse
} from '@poss-web/shared/models';
import { EncircleProductGroupMappingAdaptor } from '@poss-web/shared/util-adaptors';
import {
  loadEncircleMappings,
  saveEncircleProductGroups,
  searchProductGroupCode
} from '@poss-web/shared/util-api-service';
import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { EncircleProductGroupMappingSelectors } from './+state/encircle-product-group-mapping.selector';
import { EncircleProductGroupMappingService } from './encircle-product-group-mapping.service';
describe('EncircleProductGroupMappingService', () => {
  let httpTestingController: HttpTestingController;
  const apiUrl = 'http://localhost:3000';
  let encircleProductGroupMappingService: EncircleProductGroupMappingService;
  const payload = {
    paymentMode: 'Encircle',
    pageIndex: 0,
    pageSize: 10
  };
  const savePayload: EncircleProductGroupMappingSavePayload = {
    savePayload: {
      addProductGroupCode: ['71', '72'],
      removeProductMappingIds: []
    },
    paymentCategoryName: 'Encircle'
  };
  const selectedProductGroups: ProductGroupMappingOption[] = [
    {
      id: '123',
      uuid: '123',
      description: 'Metal'
    }
  ];
  const selectedProductGroupsResponse: ProductGroupMappingResponse = {
    response: selectedProductGroups,
    totalElements: 1
  };
  const productGroups: ProductGroup[] = [
    {
      description: 'Metal',
      productGroupCode: '71'
    }
  ];
  const dummyResponse = {
    results: selectedProductGroups,
    pageIndex: 0,
    pageSize: 10,
    totalElements: 10
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        EncircleProductGroupMappingService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    encircleProductGroupMappingService = TestBed.inject(
      EncircleProductGroupMappingService
    );
  });
  it('should be created', () => {
    expect(EncircleProductGroupMappingService).toBeTruthy();
  });
  describe('loadSelectedProductGroups', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(
        EncircleProductGroupMappingAdaptor,
        'getSelectedProductGroups'
      ).and.returnValue({});
      const pageIndex = 0;
      const pageSize = 10;
      const paymentCategoryName = 'Encircle';
      const { path, params } = loadEncircleMappings(
        paymentCategoryName,
        pageIndex,
        pageSize
      );

      encircleProductGroupMappingService
        .loadSelectedProductGroups(paymentCategoryName, pageIndex, pageSize)
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
      request.flush({});
    });
    it('should call EncircleProductGroupAdaptor getSelectedProductGroups method with correct  parameters', () => {
      spyOn(
        EncircleProductGroupMappingAdaptor,
        'getSelectedProductGroups'
      ).and.returnValue({});
      const pageIndex = 0;
      const pageSize = 10;
      const paymentCategoryName = 'Encircle';

      const path = loadEncircleMappings(
        paymentCategoryName,
        pageIndex,
        pageSize
      ).path;

      encircleProductGroupMappingService
        .loadSelectedProductGroups(paymentCategoryName, pageIndex, pageSize)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush(dummyResponse);
      expect(
        EncircleProductGroupMappingAdaptor.getSelectedProductGroups
      ).toHaveBeenCalledWith(dummyResponse);
    });

    it('should return data mapped by adaptors', () => {
      spyOn(
        EncircleProductGroupMappingAdaptor,
        'getSelectedProductGroups'
      ).and.returnValue({
        response: selectedProductGroups,
        totalElements: 10
      });
      const pageIndex = 0;
      const pageSize = 10;
      const paymentCategoryName = 'Encircle';
      const path = loadEncircleMappings(
        paymentCategoryName,
        pageIndex,
        pageSize
      ).path;

      encircleProductGroupMappingService
        .loadSelectedProductGroups(paymentCategoryName, pageIndex, pageSize)
        .subscribe(data => {
          expect(data).toEqual({
            response: selectedProductGroups,
            totalElements: 10
          });
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });
  describe('saveEncircleProductGroups', () => {
    it('should call GET api method with correct url and params', () => {
      const path = saveEncircleProductGroups('Encircle');

      encircleProductGroupMappingService
        .saveEncircleProductGroups(savePayload)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.urlWithParams).toEqual(apiUrl + path);
      request.flush({});
    });
  });
  describe('SearchProductGroup', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(
        EncircleProductGroupMappingAdaptor,
        'getSelectedProductGroups'
      ).and.returnValue({});
      const paymentCategoryName = 'Encircle';
      const { path, params } = searchProductGroupCode(paymentCategoryName);

      encircleProductGroupMappingService
        .searchProductGroupCode(paymentCategoryName)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.params.get('productGroup')).toEqual(
        paymentCategoryName
      );
      request.flush({});
    });
    it('should call EncircleProductGroupAdaptor getSelectedProductGroups method with correct  parameters', () => {
      spyOn(
        EncircleProductGroupMappingAdaptor,
        'getSelectedProductGroups'
      ).and.returnValue({});

      const paymentCategoryName = 'Encircle';

      const path = searchProductGroupCode(paymentCategoryName).path;

      encircleProductGroupMappingService
        .searchProductGroupCode(paymentCategoryName)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush(dummyResponse);
      expect(
        EncircleProductGroupMappingAdaptor.getSelectedProductGroups
      ).toHaveBeenCalledWith(dummyResponse);
    });

    it('should return data mapped by adaptors', () => {
      spyOn(
        EncircleProductGroupMappingAdaptor,
        'getSelectedProductGroups'
      ).and.returnValue({
        response: selectedProductGroups,
        totalElements: 10
      });
      const pageIndex = 0;
      const pageSize = 10;
      const paymentCategoryName = 'Encircle';
      const path = searchProductGroupCode(paymentCategoryName).path;

      encircleProductGroupMappingService
        .searchProductGroupCode(paymentCategoryName)
        .subscribe(data => {
          expect(data).toEqual({
            response: selectedProductGroups,
            totalElements: 10
          });
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });
});
