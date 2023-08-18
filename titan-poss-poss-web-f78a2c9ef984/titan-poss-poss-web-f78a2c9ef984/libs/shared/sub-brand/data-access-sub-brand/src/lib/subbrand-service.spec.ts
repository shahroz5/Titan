import { TestBed } from '@angular/core/testing';
import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';

import { BrandMaster } from '@poss-web/shared/models';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { SubBrandMasterAdaptors } from '@poss-web/shared/util-adaptors';
import {
  getSaveBrandUrl,
  getUpdateBrandUrl,
  getSearchSubbrandBySubbrandCode,
  getSubBrandListUrl,
  getBrandDetailsByBrandCode
} from '@poss-web/shared/util-api-service';
import { SubbrandService } from './subbrand.service';
describe('SubbrandMasterService', () => {
  let httpTestingController: HttpTestingController;
  const apiUrl = 'http://localhost:3000';
  let subbrandMasterService: SubbrandService;

  const dummySubBrandsResponse: BrandMaster[] = [
    {
      brandCode: 'TANISHQ',
      description: 'TANISHQ',
      parentBrandCode: '',
      orgCode: '',
      isActive: true,
      configDetails: {}
    }
  ];
  const dummySubBrandsRequestResponse = {
    results: dummySubBrandsResponse,
    pageIndex: 0,
    pageSize: 10,
    totalElements: 10
  };

  const dummySubBrandsToCreate: BrandMaster = {
    brandCode: 'GOLDPLUS',
    description: 'GOLDPLUS',
    parentBrandCode: 'TANISHQ',
    orgCode: '',
    isActive: true,
    configDetails: {}
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        SubbrandService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    subbrandMasterService = TestBed.inject(SubbrandService);
  });

  it('should be created', () => {
    expect(subbrandMasterService).toBeTruthy();
  });
  describe('getSubBrandMasterList', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(SubBrandMasterAdaptors, 'getSubBrandMasterList').and.returnValue(
        {}
      );
      const pageIndex = 0;
      const pageSize = 10;
      const parentBrandCode = 'TANISHQ';
      const url = getSubBrandListUrl(pageIndex, pageSize, parentBrandCode);

      subbrandMasterService
        .getSubBrandMasterList(pageIndex, pageSize, parentBrandCode)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('page').toString()).toEqual(
        pageIndex.toString()
      );
      expect(request.request.params.get('size').toString()).toEqual(
        pageSize.toString()
      );
      request.flush({});
    });

    it('should call SubBrandMasterAdaptors getSubBrandMasterList method with correct  parameters', () => {
      spyOn(SubBrandMasterAdaptors, 'getSubBrandMasterList').and.returnValue(
        {}
      );
      const pageIndex = 0;
      const pageSize = 10;
      const parentBrandCode = 'TANISHQ';
      const url = getSubBrandListUrl(pageIndex, pageSize, parentBrandCode);
      subbrandMasterService
        .getSubBrandMasterList(pageIndex, pageSize, parentBrandCode)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush(dummySubBrandsRequestResponse);
      expect(SubBrandMasterAdaptors.getSubBrandMasterList).toHaveBeenCalledWith(
        dummySubBrandsRequestResponse
      );
    });

    it('should return data mapped by adaptors', () => {
      spyOn(SubBrandMasterAdaptors, 'getSubBrandMasterList').and.returnValue({
        results: dummySubBrandsResponse,
        totalElements: 10
      });
      const pageIndex = 0;
      const pageSize = 10;
      const parentBrandCode = 'TANISHQ';
      const url = getSubBrandListUrl(pageIndex, pageSize, parentBrandCode);

      subbrandMasterService
        .getSubBrandMasterList(pageIndex, pageSize, parentBrandCode)
        .subscribe(data => {
          expect(data).toEqual({
            results: dummySubBrandsResponse,
            totalElements: 10
          });
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush({});
    });
  });

  describe('saveSubBrandMasterDetails', () => {
    it('should call POST api method with correct url and params', () => {
      const url = getSaveBrandUrl();

      subbrandMasterService
        .saveSubBrandMasterDetails(dummySubBrandsToCreate)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
  });

  describe('updateSubBrandMasterDetails', () => {
    it('should call PATCH api method with correct url and params', () => {
      const brandCode = 'GOLDPLUS';
      const brandToUpdate = {
        brandCode: 'GOLDPLUS',
        description: 'GOLDPLUS',
        parentBrandCode: '',
        orgCode: '',
        isActive: true,
        configDetails: {}
      };
      const url = getUpdateBrandUrl(brandCode);

      subbrandMasterService
        .updateSubBrandMasterDetails(brandToUpdate, brandCode)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
  });

  describe('updateIsActive', () => {
    it('should call PATCH api method with correct url and params', () => {
      const brandCode = 'GOLDPLUS';
      const brandToUpdate = {
        isActive: true
      };
      const url = getUpdateBrandUrl(brandCode);

      subbrandMasterService
        .updateIsActive(brandCode, brandToUpdate)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
  });

  describe('getSubBrandDetailsBySubBrandCode', () => {
    const dummyResponse = {
      brandCode: 'GOLDPLUS',
      description: 'GOLDPLUS',
      parentBrandCode: 'TANISHQ',
      orgCode: '',
      isActive: true,
      configDetails: {}
    };
    it('should call GET api method with correct url and params', () => {
      spyOn(
        SubBrandMasterAdaptors,
        'getAllSubBrandDetailsBySubBrandCode'
      ).and.returnValue({});
      const brandCode = 'TANISHQ';
      const url = getBrandDetailsByBrandCode(brandCode);

      subbrandMasterService
        .getSubBrandDetailsBySubBrandCode(brandCode)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });

    it('should call SubBrandMasterAdaptors getAllSubBrandDetailsBySubBrandCode method with correct  parameters', () => {
      spyOn(
        SubBrandMasterAdaptors,
        'getAllSubBrandDetailsBySubBrandCode'
      ).and.returnValue({});
      const brandCode = 'TANISHQ';

      const url = getBrandDetailsByBrandCode(brandCode);

      subbrandMasterService
        .getSubBrandDetailsBySubBrandCode(brandCode)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush(dummyResponse);
      expect(
        SubBrandMasterAdaptors.getAllSubBrandDetailsBySubBrandCode
      ).toHaveBeenCalledWith(dummyResponse);
    });

    it('should return data mapped by adaptors', () => {
      spyOn(
        SubBrandMasterAdaptors,
        'getAllSubBrandDetailsBySubBrandCode'
      ).and.returnValue(dummyResponse);
      const brandCode = 'TANISHQ';
      const url = getBrandDetailsByBrandCode(brandCode);

      subbrandMasterService
        .getSubBrandDetailsBySubBrandCode(brandCode)
        .subscribe(data => {
          expect(data).toEqual(dummyResponse);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush({});
    });
  });

  describe('searchSubBrandByBrandCode', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(
        SubBrandMasterAdaptors,
        'getSearchSubBrandByBrandCodeData'
      ).and.returnValue({});
      const brandCode = 'GOLDPLUS';
      const parentBrandCode = 'TANISHQ';
      const url = getSearchSubbrandBySubbrandCode(brandCode, parentBrandCode);

      subbrandMasterService
        .searchSubBrandByBrandCode(brandCode, parentBrandCode)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });

    it('should call SubBrandMasterAdaptors getSearchSubBrandByBrandCodeData method with correct  parameters', () => {
      spyOn(
        SubBrandMasterAdaptors,
        'getSearchSubBrandByBrandCodeData'
      ).and.returnValue({});
      const brandCode = 'GOLDPLUS';
      const parentBrandCode = 'TANISHQ';
      const url = getSearchSubbrandBySubbrandCode(brandCode, parentBrandCode);

      subbrandMasterService
        .searchSubBrandByBrandCode(brandCode, parentBrandCode)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush(dummySubBrandsRequestResponse);
      expect(
        SubBrandMasterAdaptors.getSearchSubBrandByBrandCodeData
      ).toHaveBeenCalledWith(dummySubBrandsRequestResponse);
    });

    it('should return data mapped by adaptors', () => {
      spyOn(
        SubBrandMasterAdaptors,
        'getSearchSubBrandByBrandCodeData'
      ).and.returnValue({ results: dummySubBrandsResponse, totalElements: 1 });
      const brandCode = 'GOLDPLUS';
      const parentBrandCode = 'TANISHQ';
      const url = getSearchSubbrandBySubbrandCode(brandCode, parentBrandCode);

      subbrandMasterService
        .searchSubBrandByBrandCode(brandCode, parentBrandCode)
        .subscribe(data => {
          expect(data).toEqual({
            results: dummySubBrandsResponse,
            totalElements: 1
          });
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush({});
    });
  });
});
