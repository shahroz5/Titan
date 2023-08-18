import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { MarketCodeService } from './market-code.service';
import {
  getMarketCodeListingUrl,
  getSaveMarketCodeUrl,
  getUpdateMarketCodeUrl,
  getSaveMarketMaterialFacatorsUrl,
  getUpdateMarketMaterialFacatorsUrl,
  getMarketCodeDetailsBasedOnMarketCodeUrl,
  getLoadMaterialFacatorsBasedOnMarketCodeUrl
} from '@poss-web/shared/util-api-service';
import { MarketCodeAdaptor } from '@poss-web/shared/util-adaptors';
import {
  MarketCodeDetails,
  SaveMarketCodeDetailsPayload
} from '@poss-web/shared/models';
describe('MarketCodeService', () => {
  const dummyMarketCodeData: MarketCodeDetails[] = [
    {
      marketCode: 'MAR',
      description: 'Good',
      isActive: true
    }
  ];
  const dummyMarketCodeResponse = {
    results: dummyMarketCodeData,
    totalElements: 10,
    pageIndex: 0,
    pageSize: 10
  };
  const dummyMarketCodeSaveData: SaveMarketCodeDetailsPayload = {
    marketCode: 'MAR',
    description: 'good',
    isActive: false
  };
  const dummyMarketFactorsResponse = {
    marketMaterialFactors: [
      {
        materialTypeCode: 'J',
        markupFactor: 1.06,
        addAmount: 0.0,
        deductAmount: 0.0
      },
      {
        materialTypeCode: 'P',
        markupFactor: 1.0,
        addAmount: 0.0,
        deductAmount: 0.0
      },
      {
        materialTypeCode: 'L',
        markupFactor: 1.0,
        addAmount: 0.0,
        deductAmount: 0.0
      }
    ],
    marketCode: 'AD'
  };
  const dummyMarketFactorsData = {
    marketCode: 'MAR',
    description: 'good',
    isActive: false,
    marketMaterialFacators: {
      goldAddAmount: 10,
      goldDeductAmount: 11,
      goldMarkupFactor: 12,
      silverAddAmount: 13,
      silverDeductAmount: 14,
      silverMarkupFactor: 15,
      platinumAddAmount: 16,
      platinumDeductAmount: 17,
      platinumMarkupFactor: 18
    }
  };

  let httpTestingController: HttpTestingController;
  const apiUrl = 'http://localhost:3000';
  let marketCodeService: MarketCodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        MarketCodeService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    marketCodeService = TestBed.inject(MarketCodeService);
  });

  it('should be created', () => {
    expect(marketCodeService).toBeTruthy();
  });

  describe('getMarketCodeList', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(MarketCodeAdaptor, 'getMarketCodeListing').and.returnValue({});
      const pageIndex = 0;
      const pageSize = 10;
      const { path, params } = getMarketCodeListingUrl(pageIndex, pageSize);

      marketCodeService
        .getMarketDetails({
          pageIndex: pageIndex,
          pageSize: pageSize
        })
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('page')).toEqual(pageIndex.toString());
      expect(request.request.params.get('size')).toEqual(pageSize.toString());
      expect(request.request.params.get('sort')).toEqual('createdDate,desc');
      request.flush({});
    });

    it('should call MarketCodeAdaptor getMarketCodeListing method with correct  parameters', () => {
      spyOn(MarketCodeAdaptor, 'getMarketCodeListing').and.returnValue({});
      const pageIndex = 0;
      const pageSize = 10;

      const path = getMarketCodeListingUrl(pageIndex, pageSize).path;

      marketCodeService
        .getMarketDetails({ pageIndex: pageIndex, pageSize: pageSize })
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(dummyMarketCodeResponse);
      expect(MarketCodeAdaptor.getMarketCodeListing).toHaveBeenCalledWith(
        dummyMarketCodeResponse
      );
    });

    it('should return data mapped by adaptors', () => {
      spyOn(MarketCodeAdaptor, 'getMarketCodeListing').and.returnValue({
        marketCodeListing: dummyMarketCodeData,
        totalElements: 10
      });
      const pageIndex = 0;
      const pageSize = 10;

      const path = getMarketCodeListingUrl(pageIndex, pageSize).path;

      marketCodeService
        .getMarketDetails({ pageIndex: pageIndex, pageSize: pageSize })
        .subscribe(data => {
          expect(data).toEqual({
            marketCodeListing: dummyMarketCodeData,
            totalElements: 10
          });
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });
  describe('saveMarketCodeDetails', () => {
    it('should call POST api method with correct url and params', () => {
      const path = getSaveMarketCodeUrl();

      marketCodeService
        .saveMarketCodeDetails(dummyMarketCodeSaveData)
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
  describe('updateMarketCodeDetails', () => {
    it('should call PATCH api method with correct url and params', () => {
      const marketCode = 'MAR';

      const path = getUpdateMarketCodeUrl(marketCode);

      marketCodeService
        .updateMarketCodeDetails({
          marketCode: marketCode,
          updateMarketDetails: { isActive: true }
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
  describe('saveMarketMaterialFactors', () => {
    it('should call POST api method with correct url and params', () => {
      const marketCode = 'MAR';
      const path = getSaveMarketMaterialFacatorsUrl(marketCode);

      marketCodeService
        .saveMarketMaterialFacators({
          marketCode: 'MAR',
          marketMarkupFactors: [
            {
              addAmount: 10,
              deductAmount: 11,
              markupFactor: 12,
              metalTypeCode: 'Gold'
            },
            {
              addAmount: 10,
              deductAmount: 11,
              markupFactor: 12,
              metalTypeCode: 'Silver'
            },
            {
              addAmount: 10,
              deductAmount: 11,
              markupFactor: 12,
              metalTypeCode: 'Platinum'
            }
          ]
        })
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
  describe('updateMarketMaterialFactors', () => {
    it('should call PUT api method with correct url and params', () => {
      const marketCode = 'MAR';

      const path = getUpdateMarketMaterialFacatorsUrl(marketCode);

      marketCodeService
        .updateMarketMaterialFacators({
          marketCode: marketCode,
          marketMarkupFactors: [
            {
              addAmount: 10,
              deductAmount: 11,
              markupFactor: 12,
              metalTypeCode: 'Gold'
            },
            {
              addAmount: 10,
              deductAmount: 11,
              markupFactor: 12,
              metalTypeCode: 'Silver'
            },
            {
              addAmount: 10,
              deductAmount: 11,
              markupFactor: 12,
              metalTypeCode: 'Platinum'
            }
          ]
        })
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PUT');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
  });
  describe('getSearchResult', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(MarketCodeAdaptor, 'getMarketCodeListing').and.returnValue({});
      const marketCode = 'MAR';
      const path = getMarketCodeDetailsBasedOnMarketCodeUrl(marketCode);

      marketCodeService.getSearchResult(marketCode).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.urlWithParams).toEqual(apiUrl + path);
      request.flush({});
    });

    it('should call MarketCodeAdaptor getMarketCodeSearchResult method with correct  parameters', () => {
      spyOn(MarketCodeAdaptor, 'getMarketCodeSearchResult').and.returnValue({});
      const marketCode = 'MAR';
      const path = getMarketCodeDetailsBasedOnMarketCodeUrl(marketCode);

      marketCodeService.getSearchResult(marketCode).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(dummyMarketCodeSaveData);
      expect(MarketCodeAdaptor.getMarketCodeSearchResult).toHaveBeenCalledWith(
        dummyMarketCodeSaveData
      );
    });

    it('should return data mapped by adaptors', () => {
      spyOn(MarketCodeAdaptor, 'getMarketCodeSearchResult').and.returnValue(
        dummyMarketCodeData
      );
      const marketCode = 'MAR';

      const path = getMarketCodeDetailsBasedOnMarketCodeUrl(marketCode);

      marketCodeService.getSearchResult(marketCode).subscribe(data => {
        expect(data).toEqual(dummyMarketCodeData);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });
  describe('getMarketDetailsBasedOnMarketCode', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(MarketCodeAdaptor, 'getMarketMaterialFacators').and.returnValue({});
      const marketCode = 'MAR';
      const path1 = getMarketCodeDetailsBasedOnMarketCodeUrl(marketCode);
      const path2 = getLoadMaterialFacatorsBasedOnMarketCodeUrl(marketCode);

      marketCodeService
        .getMarketDetailsBasedOnMarketCode(marketCode)
        .subscribe();

      const request1 = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path1;
      });

      expect(request1.cancelled).toBeFalsy();
      expect(request1.request.method).toEqual('GET');
      expect(request1.request.responseType).toEqual('json');
      expect(request1.request.urlWithParams).toEqual(apiUrl + path1);
      request1.flush({});
      const request2 = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path2;
      });
      expect(request2.cancelled).toBeFalsy();
      expect(request2.request.method).toEqual('GET');
      expect(request2.request.responseType).toEqual('json');
      expect(request2.request.urlWithParams).toEqual(apiUrl + path2);
      request2.flush({});
    });

    it('should call MarketCodeAdaptor getMarketCodeListing method with correct  parameters', () => {
      spyOn(MarketCodeAdaptor, 'getMarketMaterialFacators').and.returnValue({});
      const marketCodeDetails = {
        marketCode: 'MAR',
        description: 'good',
        isActive: false
      };
      const marketCode = 'MAR';
      const path1 = getMarketCodeDetailsBasedOnMarketCodeUrl(marketCode);
      const path2 = getLoadMaterialFacatorsBasedOnMarketCodeUrl(marketCode);

      marketCodeService
        .getMarketDetailsBasedOnMarketCode(marketCode)
        .subscribe();

      const request1 = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path1;
      });
      request1.flush(marketCodeDetails);

      const request2 = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path2;
      });
      request2.flush(dummyMarketFactorsResponse);
      expect(MarketCodeAdaptor.getMarketMaterialFacators).toHaveBeenCalledWith(
        dummyMarketFactorsResponse
      );
    });

    it('should return data mapped by adaptors', () => {
      spyOn(MarketCodeAdaptor, 'getMarketMaterialFacators').and.returnValue(
        dummyMarketFactorsData
      );
      const marketCode = 'MAR';
      // const marketCodeDetails = {
      //   marketCode: 'MAR',
      //   description: 'good',
      //   isActive: false
      // };
      const path1 = getMarketCodeDetailsBasedOnMarketCodeUrl(marketCode);
      const path2 = getLoadMaterialFacatorsBasedOnMarketCodeUrl(marketCode);

      marketCodeService
        .getMarketDetailsBasedOnMarketCode(marketCode)
        .subscribe(data => {
          expect(data).toEqual(dummyMarketFactorsData);
        });

      // const request1 = httpTestingController.expectOne(req => {
      //   return req.url === apiUrl + path1;
      // });
      // request1.flush(marketCodeDetails);

      // const request2 = httpTestingController.expectOne(req => {
      //   return req.url === apiUrl + path2;
      // });

      // request2.flush(dummyMarketFactorsResponse);
    });
  });
});
