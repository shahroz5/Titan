import { TestBed } from '@angular/core/testing';

import { PriceGroupService } from './price-group.service';
import { PriceGroupMaster } from '@poss-web/shared/models';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { PriceGroupAdaptor } from '@poss-web/shared/util-adaptors';
import {
  getPriceGroupMasterUrl,
  getPriceGroupByPriceGroupCodeUrl,
  savePriceGroupUrl,
  getUpdatePriceGroupMasterUrl
} from '@poss-web/shared/util-api-service';
describe('PriceGroupService', () => {
  let httpTestingController: HttpTestingController;
  const apiUrl = 'http://localhost:3000';
  let priceGroupService: PriceGroupService;

  const dummyPriceGroupResponse: PriceGroupMaster[] = [
    {
      priceGroup: 'BANGALORE',
      description: 'BANGALORE',
      isActive: true
    }
  ];
  const dummyPriceGroupRequestResponse = {
    results: dummyPriceGroupResponse,
    pageIndex: 0,
    pageSize: 10,
    totalElements: 10
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        PriceGroupService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    priceGroupService = TestBed.inject(PriceGroupService);
  });

  it('should be created', () => {
    expect(priceGroupService).toBeTruthy();
  });

  describe('getPriceGroupMasterList', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(PriceGroupAdaptor, 'getPriceGroupMasterList').and.returnValue({});
      const pageIndex = 0;
      const pageSize = 10;
      const url = getPriceGroupMasterUrl(pageIndex, pageSize);

      priceGroupService
        .getPriceGroupMasterList(pageIndex, pageSize)
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

    it('should call PriceGroupAdaptor getPriceGroupMasterList method with correct  parameters', () => {
      spyOn(PriceGroupAdaptor, 'getPriceGroupMasterList').and.returnValue({});
      const pageIndex = 0;
      const pageSize = 10;

      const url = getPriceGroupMasterUrl(pageIndex, pageSize);

      priceGroupService
        .getPriceGroupMasterList(pageIndex, pageSize)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush(dummyPriceGroupRequestResponse);
      expect(PriceGroupAdaptor.getPriceGroupMasterList).toHaveBeenCalledWith(
        dummyPriceGroupRequestResponse
      );
    });

    it('should return data mapped by adaptors', () => {
      spyOn(PriceGroupAdaptor, 'getPriceGroupMasterList').and.returnValue({
        results: dummyPriceGroupResponse,
        totalElements: 10
      });
      const pageIndex = 0;
      const pageSize = 10;

      const url = getPriceGroupMasterUrl(pageIndex, pageSize);

      priceGroupService
        .getPriceGroupMasterList(pageIndex, pageSize)
        .subscribe(data => {
          expect(data).toEqual({
            results: dummyPriceGroupResponse,
            totalElements: 10
          });
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush({});
    });
  });

  describe('getPriceGroupByPriceGroupCode', () => {
    const dummyPriceGroup: PriceGroupMaster = {
      priceGroup: 'BANGALORE',
      description: 'BANGALORE',
      isActive: true
    };
    it('should call GET api method with correct url and params', () => {
      spyOn(PriceGroupAdaptor, 'getPriceGroupByPriceGroupCode').and.returnValue(
        {}
      );
      const priceGroup = 'BANGALORE';

      const path = getPriceGroupByPriceGroupCodeUrl(priceGroup);

      priceGroupService.getPriceGroupByPriceGroupCode(priceGroup).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });

    it('should call PriceGroupAdaptor getPriceGroupByPriceGroupCode method with correct  parameters', () => {
      spyOn(PriceGroupAdaptor, 'getPriceGroupByPriceGroupCode').and.returnValue(
        {}
      );
      const priceGroup = 'BANGALORE';

      const path = getPriceGroupByPriceGroupCodeUrl(priceGroup);

      priceGroupService.getPriceGroupByPriceGroupCode(priceGroup).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(dummyPriceGroup);
      expect(
        PriceGroupAdaptor.getPriceGroupByPriceGroupCode
      ).toHaveBeenCalledWith(dummyPriceGroup);
    });

    it('should return data mapped by adaptors', () => {
      spyOn(PriceGroupAdaptor, 'getPriceGroupByPriceGroupCode').and.returnValue(
        dummyPriceGroup
      );
      const priceGroup = 'BANGALORE';

      const path = getPriceGroupByPriceGroupCodeUrl(priceGroup);

      priceGroupService
        .getPriceGroupByPriceGroupCode(priceGroup)
        .subscribe(data => {
          expect(data).toEqual(dummyPriceGroup);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });

  describe('savePriceGroupList', () => {
    const dummyPriceGroup: PriceGroupMaster = {
      priceGroup: 'BANGALORE',
      description: 'BANGALORE',
      isActive: true
    };
    it('should call POST api method with correct url and params', () => {
      const path = savePriceGroupUrl();

      priceGroupService.savePriceGroup(dummyPriceGroup).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
  });

  describe('updatePriceGroupByPriceGroupCode', () => {
    it('should call PATCH api method with correct url and params', () => {
      spyOn(PriceGroupAdaptor, 'getPriceGroupByPriceGroupCode').and.returnValue(
        {}
      );
      const priceGroup = 'BANGALORE';

      const path = getUpdatePriceGroupMasterUrl(priceGroup);

      priceGroupService
        .updatePriceGroupByPriceGroupCode(priceGroup, {
          description: 'BANGALORE'
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

  describe('searchPriceGroupList', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(PriceGroupAdaptor, 'getSearchResult').and.returnValue({});
      const priceGroup = 'BANGLORE';
      const path = getPriceGroupByPriceGroupCodeUrl(priceGroup);

      priceGroupService.searchPriceGroupList(priceGroup).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.urlWithParams).toEqual(apiUrl + path);
      request.flush({});
    });

    it('should call PriceGroupAdaptor getSearchResult method with correct  parameters', () => {
      spyOn(PriceGroupAdaptor, 'getSearchResult').and.returnValue({});
      const priceGroup = 'BANGLORE';
      const path = getPriceGroupByPriceGroupCodeUrl(priceGroup);
      priceGroupService.searchPriceGroupList(priceGroup).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(dummyPriceGroupRequestResponse);
      expect(PriceGroupAdaptor.getSearchResult).toHaveBeenCalledWith(
        dummyPriceGroupRequestResponse
      );
    });

    it('should return data mapped by adaptors', () => {
      spyOn(PriceGroupAdaptor, 'getSearchResult').and.returnValue({
        results: dummyPriceGroupResponse,
        totalElements: 10
      });
      const priceGroup = 'BANGLORE';
      const path = getPriceGroupByPriceGroupCodeUrl(priceGroup);

      priceGroupService.searchPriceGroupList(priceGroup).subscribe(data => {
        expect(data).toEqual({
          results: dummyPriceGroupResponse,
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
