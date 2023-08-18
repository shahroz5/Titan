import { TestBed } from '@angular/core/testing';

import {
  weightToleranceEnum,
  UcpMarketCodeListing,
  SaveUcpMarketCodePayload,
  MarketCode,
  UcpProductGroup,
  UpdateUcpMarketCodePayload,
  UcpMarketCode
} from '@poss-web/shared/models';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { UcpMarketCodeFactorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  getUpdateConfigurationUrl,
  getUcpMarketCodeUrl,
  getUcpMarketCodeFactorByCodeUrl,
  getSaveUcpMarketCodeFactorUrl,
  getMarketCodeUrl,
  getUcpProductGroupUrl
} from '@poss-web/shared/util-api-service';
import { UcpMarketCodeFactorService } from './ucp-market-code-factor.service';
describe('UcpMarketCodeFactorService', () => {
  let httpTestingController: HttpTestingController;
  const apiUrl = 'http://localhost:3000';
  let ucpMarketCodeFactorService: UcpMarketCodeFactorService;

  const pageIndex = 0;
  const pageSize = 10;
  const searchValue = '';
  const ucpMarketCodeListing: UcpMarketCodeListing = {
    results: [
      {
        marketCode: 'KA',
        id: '1',
        ucpCfa: '71',
        ucpFactor: '1.1'
      }
    ],
    totalElements: 10
  };

  const ucpMarketCode: UcpMarketCode = {
    marketCode: 'KA',
    id: '1',
    ucpCfa: '71',
    ucpFactor: '1.1'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        UcpMarketCodeFactorService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    ucpMarketCodeFactorService = TestBed.inject(UcpMarketCodeFactorService);
  });

  it('should be created', () => {
    expect(ucpMarketCodeFactorService).toBeTruthy();
  });

  describe('getUcpMarketCodeFactorList', () => {
    const url = getUcpMarketCodeUrl(pageIndex, pageSize, searchValue);
    it('should call POST api method with correct url and params', () => {
      spyOn(
        UcpMarketCodeFactorAdaptor,
        'getUcpMarketCodeFactorList'
      ).and.returnValue({});

      ucpMarketCodeFactorService
        .getUcpMarketCodeFactorList(pageIndex, pageSize, searchValue)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');

      expect(request.request.params.get('size').toString()).toEqual(
        pageSize.toString()
      );

      request.flush({});
    });

    it('should call UcpMarketCodeFactorAdaptor getUcpMarketCodeFactorList method with correct  parameters', () => {
      spyOn(
        UcpMarketCodeFactorAdaptor,
        'getUcpMarketCodeFactorList'
      ).and.returnValue({});

      ucpMarketCodeFactorService
        .getUcpMarketCodeFactorList(pageIndex, pageSize, searchValue)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush(ucpMarketCodeListing);
      expect(
        UcpMarketCodeFactorAdaptor.getUcpMarketCodeFactorList
      ).toHaveBeenCalledWith(ucpMarketCodeListing);
    });

    it('should return data mapped by adaptors', () => {
      spyOn(
        UcpMarketCodeFactorAdaptor,
        'getUcpMarketCodeFactorList'
      ).and.returnValue(ucpMarketCodeListing);

      ucpMarketCodeFactorService
        .getUcpMarketCodeFactorList(pageIndex, pageSize, searchValue)
        .subscribe(data1 => {
          expect(data1).toEqual(ucpMarketCodeListing);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush({});
    });
  });

  describe('getUcpMarketCodeFactorByCode', () => {
    const id = '1';
    const url = getUcpMarketCodeFactorByCodeUrl(id);
    it('should call GET api method with correct url and params', () => {
      spyOn(
        UcpMarketCodeFactorAdaptor,
        'getUcpMarketCodeFactorByCodeData'
      ).and.returnValue({});
      ucpMarketCodeFactorService.getUcpMarketCodeFactorByCode('1').subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.urlWithParams).toEqual(apiUrl + url);
      request.flush({});
    });

    it('should call UcpMarketCodeFactorAdaptor getUcpMarketCodeFactorByCodeData method with correct  parameters', () => {
      spyOn(
        UcpMarketCodeFactorAdaptor,
        'getUcpMarketCodeFactorByCodeData'
      ).and.returnValue({});
      ucpMarketCodeFactorService.getUcpMarketCodeFactorByCode('1').subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });

      request.flush(ucpMarketCode);
      expect(
        UcpMarketCodeFactorAdaptor.getUcpMarketCodeFactorByCodeData
      ).toHaveBeenCalledWith(ucpMarketCode);
    });

    it('should return data mapped by adaptors', () => {
      spyOn(
        UcpMarketCodeFactorAdaptor,
        'getUcpMarketCodeFactorByCodeData'
      ).and.returnValue(ucpMarketCode);
      ucpMarketCodeFactorService
        .getUcpMarketCodeFactorByCode('1')
        .subscribe(data1 => {
          expect(data1).toEqual(ucpMarketCode);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });

      request.flush({});
    });
  });

  describe('updateUcpMarketCodeFactorByCode', () => {
    const ucpMarketCodeFactor: UpdateUcpMarketCodePayload = {
      data: {
        ucpFactor: 1
      },
      id: '1'
    };
    const url = getUcpMarketCodeFactorByCodeUrl(ucpMarketCodeFactor.id);
    it('should call PUT api method with correct url and params', () => {
      ucpMarketCodeFactorService
        .updateUcpMarketCodeFactorByCode(ucpMarketCodeFactor)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PUT');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.urlWithParams).toEqual(apiUrl + url);
      request.flush({});
    });
  });

  describe('saveUcpMarketCodeFactor', () => {
    const saveUcpMarketCodePayload: SaveUcpMarketCodePayload = {
      marketCode: 'KA',
      markupFactor: 1,
      productGroupCode: '71'
    };
    const url = getSaveUcpMarketCodeFactorUrl();

    it('should call POST api method with correct url and params', () => {
      ucpMarketCodeFactorService
        .saveUcpMarketCodeFactor(saveUcpMarketCodePayload)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
  });

  describe('getMarketCode', () => {
    const marketCode: MarketCode[] = [
      {
        id: '29',
        name: 'KA'
      }
    ];
    const url = getMarketCodeUrl();

    it('should call GET api method with correct url and params', () => {
      spyOn(UcpMarketCodeFactorAdaptor, 'getMarketCodeData').and.returnValue(
        {}
      );

      ucpMarketCodeFactorService.getMarketCode().subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
    it('should call UcpMarketCodeFactorAdaptor getWeightTolerance method with correct  parameters', () => {
      spyOn(UcpMarketCodeFactorAdaptor, 'getMarketCodeData').and.returnValue(
        {}
      );

      ucpMarketCodeFactorService.getMarketCode().subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush(marketCode);
      expect(UcpMarketCodeFactorAdaptor.getMarketCodeData).toHaveBeenCalledWith(
        marketCode
      );
    });

    it('should return data mapped by adaptors', () => {
      spyOn(UcpMarketCodeFactorAdaptor, 'getMarketCodeData').and.returnValue(
        marketCode
      );

      ucpMarketCodeFactorService.getMarketCode().subscribe(data1 => {
        expect(data1).toEqual(marketCode);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush({});
    });
  });

  describe('getUcpProductGroup', () => {
    const ucpProductGroup: UcpProductGroup[] = [
      {
        id: '72',
        name: 'Gold studed'
      }
    ];
    const url = getUcpProductGroupUrl();
    it('should call GET api method with correct url and params', () => {
      spyOn(
        UcpMarketCodeFactorAdaptor,
        'getUcpProductGroupData'
      ).and.returnValue({});
      ucpMarketCodeFactorService.getUcpProductGroup().subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });

    it('should call UcpMarketCodeFactorAdaptor getUcpProductGroupData method with correct  parameters', () => {
      spyOn(
        UcpMarketCodeFactorAdaptor,
        'getUcpProductGroupData'
      ).and.returnValue({});
      ucpMarketCodeFactorService.getUcpProductGroup().subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush(ucpProductGroup);
      expect(
        UcpMarketCodeFactorAdaptor.getUcpProductGroupData
      ).toHaveBeenCalledWith(ucpProductGroup);
    });

    it('should return data mapped by adaptors', () => {
      spyOn(
        UcpMarketCodeFactorAdaptor,
        'getUcpProductGroupData'
      ).and.returnValue(ucpProductGroup);
      ucpMarketCodeFactorService.getUcpProductGroup().subscribe(data1 => {
        expect(data1).toEqual(ucpProductGroup);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush({});
    });
  });
});
