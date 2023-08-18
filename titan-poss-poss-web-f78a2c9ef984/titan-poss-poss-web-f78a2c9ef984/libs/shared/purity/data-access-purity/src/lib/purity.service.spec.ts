import { TestBed } from '@angular/core/testing';

import {
  Purity,
  MaterialType,
  CreatePurityPayload
} from '@poss-web/shared/models';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';

import {
  getLoadMetalTypeUrl,
  getUpdatePurityUrl,
  getSavePurityUrl,
  getloadPurityByCodeUrl,
  getPurityListUrl
} from '@poss-web/shared/util-api-service';
import { PurityService } from './purity.service';
import { PurityAdaptor } from '@poss-web/shared/util-adaptors';
describe('PurityService', () => {
  let httpTestingController: HttpTestingController;
  const apiUrl = 'http://localhost:3000';
  let purityService: PurityService;

  const dummyPurityResponse: Purity[] = [
    {
      id: '1',
      materialCode: 'J',
      karat: '24',
      purity: '100',
      offset: '1',
      description: 'Pure Gold',
      isActive: true
    }
  ];
  const dummyPurityRequestResponse = {
    results: dummyPurityResponse,
    pageIndex: 0,
    pageSize: 10,
    totalElements: 10
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        PurityService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    purityService = TestBed.inject(PurityService);
  });

  it('should be created', () => {
    expect(purityService).toBeTruthy();
  });

  describe('getPurityList', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(PurityAdaptor, 'getPurityListData').and.returnValue({});
      const pageIndex = 0;
      const pageSize = 10;
      const searchValue = 'J';
      const url = getPurityListUrl(pageIndex, pageSize, searchValue);

      purityService.getPurityList(pageIndex, pageSize, searchValue).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.params.toString()).toEqual(url.params.toString());
      expect(request.request.params.get('size').toString()).toEqual(
        pageSize.toString()
      );
      expect(request.request.params.get('page').toString()).toEqual(
        pageIndex.toString()
      );
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });

    it('should call PurityAdaptor getPurityListData method with correct  parameters', () => {
      spyOn(PurityAdaptor, 'getPurityListData').and.returnValue({});
      const pageIndex = 0;
      const pageSize = 10;
      const searchValue = 'J';
      const url = getPurityListUrl(pageIndex, pageSize, searchValue);

      purityService.getPurityList(pageIndex, pageSize, searchValue).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush(dummyPurityRequestResponse);
      expect(PurityAdaptor.getPurityListData).toHaveBeenCalledWith(
        dummyPurityRequestResponse
      );
    });

    it('should return data mapped by adaptors', () => {
      spyOn(PurityAdaptor, 'getPurityListData').and.returnValue({
        purityList: dummyPurityResponse,
        totalElements: 10
      });
      const pageIndex = 0;
      const pageSize = 10;
      const searchValue = 'J';
      const url = getPurityListUrl(pageIndex, pageSize, searchValue);

      purityService
        .getPurityList(pageIndex, pageSize, searchValue)
        .subscribe(data => {
          expect(data).toEqual({
            purityList: dummyPurityResponse,
            totalElements: 10
          });
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush({});
    });
  });

  describe('loadPurityByMaterialCodeAndPurity', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(PurityAdaptor, 'getPurityByMaterialCodeAndPurity').and.returnValue(
        {}
      );
      const materialCode = 'J';
      const purity = '100';
      const url = getloadPurityByCodeUrl(materialCode, purity);

      purityService
        .loadPurityByMaterialCodeAndPurity(materialCode, purity)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('itemTypeCode').toString()).toEqual(
        materialCode.toString()
      );
      expect(request.request.params.get('purity').toString()).toEqual(
        purity.toString()
      );
      request.flush({});
    });

    it('should call PurityAdaptor getPurityByMaterialCodeAndPurity method with correct  parameters', () => {
      spyOn(PurityAdaptor, 'getPurityByMaterialCodeAndPurity').and.returnValue(
        {}
      );
      const materialCode = 'J';
      const purity = '100';
      const url = getloadPurityByCodeUrl(materialCode, purity);
      purityService
        .loadPurityByMaterialCodeAndPurity(materialCode, purity)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush(dummyPurityResponse);
      expect(
        PurityAdaptor.getPurityByMaterialCodeAndPurity
      ).toHaveBeenCalledWith(dummyPurityResponse);
    });

    it('should return data mapped by adaptors', () => {
      spyOn(PurityAdaptor, 'getPurityByMaterialCodeAndPurity').and.returnValue(
        dummyPurityResponse
      );
      const materialCode = 'J';
      const purity = '100';
      const url = getloadPurityByCodeUrl(materialCode, purity);

      purityService
        .loadPurityByMaterialCodeAndPurity(materialCode, purity)
        .subscribe(data => {
          expect(data).toEqual(dummyPurityResponse);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush({});
    });
  });

  describe('loadMetalTypes', () => {
    const dummyMaterialTypes: MaterialType[] = [
      {
        materialCode: 'j',
        description: 'GOLD'
      }
    ];
    it('should call GET api method with correct url and params', () => {
      spyOn(PurityAdaptor, 'getMetalTypes').and.returnValue({});

      const url = getLoadMetalTypeUrl();

      purityService.loadMetalTypes().subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });

    it('should call PriceGroupAdaptor getMetalTypes method with correct  parameters', () => {
      spyOn(PurityAdaptor, 'getMetalTypes').and.returnValue({});

      const url = getLoadMetalTypeUrl();

      purityService.loadMetalTypes().subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush(dummyMaterialTypes);
      expect(PurityAdaptor.getMetalTypes).toHaveBeenCalledWith(
        dummyMaterialTypes
      );
    });

    it('should return data mapped by adaptors', () => {
      spyOn(PurityAdaptor, 'getMetalTypes').and.returnValue(dummyMaterialTypes);

      const url = getLoadMetalTypeUrl();

      purityService.loadMetalTypes().subscribe(data => {
        expect(data).toEqual(dummyMaterialTypes);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush({});
    });
  });

  describe('savePurity', () => {
    const dummyPurity: CreatePurityPayload = {
      itemTypeCode: 'J',
      karat: '24',
      purity: '100',
      offset: '1',
      description: 'Pure Gold',
      isActive: true
    };
    it('should call POST api method with correct url and params', () => {
      const path = getSavePurityUrl();

      purityService.savePurity(dummyPurity).subscribe();

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

  describe('updatePurity', () => {
    it('should call PUT api method with correct url and params', () => {
      const path = getUpdatePurityUrl();
      purityService
        .updatePurity({
          id: 1,
          data: {
            materialCode: 'J',
            karat: '24',
            purity: '100',
            offset: '1',
            description: 'Pure Gold',
            isActive: true
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
