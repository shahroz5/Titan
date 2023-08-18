import { TestBed } from '@angular/core/testing';

import { MaterialTypelov, MaterialType } from '@poss-web/shared/models';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { MetalTypeService } from './metal-type.service';
import { MetalTypeAdaptor } from '@poss-web/shared/util-adaptors';
import {
  getMetalTypeListUrl,
  getLoadMetalTypeByMaterialCodeUrl,
  getSearchMetalTypeByMaterialCode,
  getSaveMetalTypeUrl,
  getUpdateMetalTypeUrl
} from '@poss-web/shared/util-api-service';

describe('MetalTypeService', () => {
  let httpTestingController: HttpTestingController;
  const apiUrl = 'http://localhost:3000';
  let metalTypeService: MetalTypeService;

  const dummyMaterialTypeResponse: MaterialType[] = [
    {
      materialCode: 'J',
      description: 'Pure Gold',
      isActive: true
    }
  ];
  const dummyMaterialType: MaterialType = {
    materialCode: 'J',
    description: 'Pure Gold',
    isActive: true
  };
  const dummyMaterialTypeRequestResponse = {
    results: dummyMaterialTypeResponse,
    pageIndex: 0,
    pageSize: 10,
    totalElements: 10
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        MetalTypeService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    metalTypeService = TestBed.inject(MetalTypeService);
  });

  it('should be created', () => {
    expect(metalTypeService).toBeTruthy();
  });

  describe('getAllMetalTypeList', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(MetalTypeAdaptor, 'getMetalTypeListData').and.returnValue({});
      const pageIndex = 0;
      const pageSize = 10;

      const url = getMetalTypeListUrl(pageIndex, pageSize);

      metalTypeService.getAllMetalTypeList(pageIndex, pageSize).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.params.get('page').toString()).toEqual(
        pageIndex.toString()
      );
      expect(request.request.params.get('size').toString()).toEqual(
        pageSize.toString()
      );
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });

    it('should call MetalTypeAdaptor getPurityListData method with correct  parameters', () => {
      spyOn(MetalTypeAdaptor, 'getMetalTypeListData').and.returnValue({});
      const pageIndex = 0;
      const pageSize = 10;
      const url = getMetalTypeListUrl(pageIndex, pageSize);

      metalTypeService.getAllMetalTypeList(pageIndex, pageSize).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush(dummyMaterialTypeRequestResponse);
      expect(MetalTypeAdaptor.getMetalTypeListData).toHaveBeenCalledWith(
        dummyMaterialTypeRequestResponse
      );
    });

    it('should return data mapped by adaptors', () => {
      spyOn(MetalTypeAdaptor, 'getMetalTypeListData').and.returnValue({
        results: dummyMaterialTypeResponse,
        totalElements: 10
      });
      const pageIndex = 0;
      const pageSize = 10;
      const url = getMetalTypeListUrl(pageIndex, pageSize);

      metalTypeService
        .getAllMetalTypeList(pageIndex, pageSize)
        .subscribe(data => {
          expect(data).toEqual({
            results: dummyMaterialTypeResponse,
            totalElements: 10
          });
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush({});
    });
  });

  describe('loadMetalTypeByMaterialCode', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(
        MetalTypeAdaptor,
        'getLoadMetalTypeByMaterialCodeData'
      ).and.returnValue({});
      const materialCode = 'J';

      const path = getLoadMetalTypeByMaterialCodeUrl(materialCode);

      metalTypeService.loadMetalTypeByMaterialCode(materialCode).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.urlWithParams).toEqual(apiUrl + path);
      request.flush({});
    });
    it('should call PurityAdaptor getPurityByMaterialCodeAndPurity method with correct  parameters', () => {
      spyOn(
        MetalTypeAdaptor,
        'getLoadMetalTypeByMaterialCodeData'
      ).and.returnValue({});
      const materialCode = 'J';
      const path = getLoadMetalTypeByMaterialCodeUrl(materialCode);
      metalTypeService.loadMetalTypeByMaterialCode(materialCode).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(dummyMaterialType);
      expect(
        MetalTypeAdaptor.getLoadMetalTypeByMaterialCodeData
      ).toHaveBeenCalledWith(dummyMaterialType);
    });

    it('should return data mapped by adaptors', () => {
      spyOn(
        MetalTypeAdaptor,
        'getLoadMetalTypeByMaterialCodeData'
      ).and.returnValue(dummyMaterialType);
      const materialCode = 'J';

      const path = getLoadMetalTypeByMaterialCodeUrl(materialCode);

      metalTypeService
        .loadMetalTypeByMaterialCode(materialCode)
        .subscribe(data => {
          expect(data).toEqual(dummyMaterialType);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });

  describe('searchMetalTypeList', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(MetalTypeAdaptor, 'getSearchMetalTypeListData').and.returnValue({});

      const searchValue = 'J';
      const path = getSearchMetalTypeByMaterialCode(searchValue);

      metalTypeService.searchMetalTypeList(searchValue).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.urlWithParams).toEqual(apiUrl + path);
      request.flush({});
    });

    it('should call MetalTypeAdaptor getSearchMetalTypeListData method with correct  parameters', () => {
      spyOn(MetalTypeAdaptor, 'getSearchMetalTypeListData').and.returnValue({});

      const searchValue = 'J';
      const path = getSearchMetalTypeByMaterialCode(searchValue);

      metalTypeService.searchMetalTypeList(searchValue).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(dummyMaterialTypeRequestResponse);
      expect(MetalTypeAdaptor.getSearchMetalTypeListData).toHaveBeenCalledWith(
        dummyMaterialTypeRequestResponse
      );
    });

    it('should return data mapped by adaptors', () => {
      spyOn(MetalTypeAdaptor, 'getSearchMetalTypeListData').and.returnValue({
        results: dummyMaterialTypeResponse,
        totalElements: 1
      });

      const searchValue = 'J';
      const path = getSearchMetalTypeByMaterialCode(searchValue);

      metalTypeService.searchMetalTypeList(searchValue).subscribe(data => {
        expect(data).toEqual({
          results: dummyMaterialTypeResponse,
          totalElements: 1
        });
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });

  describe('saveMetalType', () => {
    it('should call POST api method with correct url and params', () => {
      const path = getSaveMetalTypeUrl();
      metalTypeService.saveMetalType(dummyMaterialType).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.urlWithParams).toEqual(apiUrl + path);
      request.flush({});
    });
  });

  describe('updateMetalTypeDetail', () => {
    it('should call PUT api method with correct url and params', () => {
      const materialCode = 'J';
      const path = getUpdateMetalTypeUrl(materialCode);
      metalTypeService
        .updateMetalTypeDetail({
          materialTypeCode: 'J',
          data: {
            materialType: 'OTHERS',
            description: 'Others'
          }
        })
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
});
