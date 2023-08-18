import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { TestBed } from '@angular/core/testing';
import { MaterialPriceService } from './material-price.service';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import {
  MaterialPriceList,
  MarketDetails,
  LocationDetails
} from '@poss-web/shared/models';
import { MarketMaterialPriceAdaptor } from '@poss-web/shared/util-adaptors';
import {
  getMetalPriceDetailsUrl,
  getMarketDetailsBasedOnMaterialUrl,
  getComputeMaterialPriceUrl,
  getSavedBasePriceUrl,
  getSavePriceUrl,
  getSearchMarketCodeUrl,
  getsearchComputedPriceByLocationCodeUrl,
  getSearchSavedLocationPriceByLocationCodeUrl
} from '@poss-web/shared/util-api-service';
describe('MaterialPriceService', () => {
  let httpTestingController: HttpTestingController;
  let materialPriceService: MaterialPriceService;
  const apiUrl = 'http://localhost:3000';

  const dummyMarketPriceResponse: MaterialPriceList[] = [
    {
      id: '15235',
      price: 2500,
      priceType: 'Daily',
      time: '11.30',
      remarks: 'Daily price',
      createdDate: new Date()
    }
  ];

  const dummyMarketPriceRequestResponse = {
    results: dummyMarketPriceResponse,
    totalElements: 10
  };

  const dummyMarketCodeResponse: MarketDetails[] = [
    {
      marketCode: 'ka',
      materialCode: 'J',
      markupFactor: 10,
      addAmount: 30,
      deductAmount: 20,
      description: 'Karnataka'
    }
  ];
  const dummyMarketCodeRequestResponse = {
    results: dummyMarketCodeResponse,
    pageIndex: 0,
    pageSize: 8,
    totalElements: 10
  };

  const dymmyLocationPriceResponse: LocationDetails[] = [
    {
      locationCode: 'PNA',
      locationDescription: 'PNA',
      marketCode: 'KA',
      marketDescription: 'KA',
      materialPrice: '2500'
    }
  ];
  const dymmyLocationPriceRequestResponse = {
    results: dymmyLocationPriceResponse,
    pageIndex: 0,
    pageSize: 8,
    totalElements: 10
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        MaterialPriceService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    materialPriceService = TestBed.inject(MaterialPriceService);
  });
  afterEach(() => {
    httpTestingController.verify();
  });
  it('should be created', () => {
    expect(materialPriceService).toBeTruthy();
  });
  describe('getMaterialPriceDetails', () => {
    it('should call POST api method with correct url and params', () => {
      spyOn(
        MarketMaterialPriceAdaptor,
        'getMetalPriceDetailsData'
      ).and.returnValue({});
      const materialCode = 'J';
      const applicableDate = 1586341654360;
      const url = getMetalPriceDetailsUrl(materialCode);

      materialPriceService
        .getMaterialPriceDetails({
          materialCode: materialCode,
          applicableDate: applicableDate
        })
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

  describe('getMaterialPriceDetails', () => {
    it('should call MarketMaterialPriceAdaptor  getMetalPriceDetailsData method with correct arguments', () => {
      spyOn(
        MarketMaterialPriceAdaptor,
        'getMetalPriceDetailsData'
      ).and.returnValue({});
      const materialCode = 'J';
      const applicableDate = 1586341654360;
      const url = getMetalPriceDetailsUrl(materialCode);

      materialPriceService
        .getMaterialPriceDetails({
          materialCode: materialCode,
          applicableDate: applicableDate
        })
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      request.flush(dummyMarketPriceRequestResponse);
      expect(
        MarketMaterialPriceAdaptor.getMetalPriceDetailsData
      ).toHaveBeenCalledWith(dummyMarketPriceRequestResponse);
    });
  });

  describe('getMaterialPriceDetails', () => {
    it('should return data mapped by adaptor', () => {
      spyOn(
        MarketMaterialPriceAdaptor,
        'getMetalPriceDetailsData'
      ).and.returnValue(dummyMarketPriceResponse);
      const materialCode = 'J';
      const applicableDate = 1586341654360;
      const url = getMetalPriceDetailsUrl(materialCode);

      materialPriceService
        .getMaterialPriceDetails({
          materialCode: materialCode,
          applicableDate: applicableDate
        })
        .subscribe(data => {
          expect(data).toEqual(dummyMarketPriceResponse);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush({});
    });
  });
  describe('getMarketDetailsBasedOnMaterial', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(
        MarketMaterialPriceAdaptor,
        'getMarketDetailsBasedOnMarketCode'
      ).and.returnValue({});
      const materialCode = 'J';
      const pageIndex = 0;
      const pageSize = 10;
      const isAllSelected = false;
      const selectedStock = [];
      const basePrice = 2000;

      const url = getMarketDetailsBasedOnMaterialUrl(
        materialCode,
        pageIndex,
        pageSize
      );

      materialPriceService
        .getMarketDetailsBasedOnMaterial({
          data: {
            materialCode: materialCode,
            pageIndex: pageIndex,
            pageSize: pageSize
          },
          selectedStock: selectedStock,
          isAllSelected: isAllSelected,
          basePrice: basePrice
        })
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
  });

  describe('getMarketDetailsBasedOnMaterial', () => {
    it('should call MarketMaterialPriceAdaptor  getMarketDetailsBasedOnMarketCode method with correct arguments', () => {
      spyOn(
        MarketMaterialPriceAdaptor,
        'getMarketDetailsBasedOnMarketCode'
      ).and.returnValue({});
      const materialCode = 'J';
      const pageIndex = 0;
      const pageSize = 10;
      const isAllSelected = false;
      const selectedStock = [];
      const basePrice = 2000;

      const url = getMarketDetailsBasedOnMaterialUrl(
        materialCode,
        pageIndex,
        pageSize
      );
      materialPriceService
        .getMarketDetailsBasedOnMaterial({
          data: {
            materialCode: materialCode,
            pageIndex: pageIndex,
            pageSize: pageSize
          },
          selectedStock: selectedStock,
          isAllSelected: isAllSelected,
          basePrice: basePrice
        })
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush(dummyMarketCodeRequestResponse);
      expect(
        MarketMaterialPriceAdaptor.getMarketDetailsBasedOnMarketCode
      ).toHaveBeenCalledWith(
        dummyMarketCodeRequestResponse,
        selectedStock,
        isAllSelected,
        basePrice
      );
    });
  });

  describe('getMarketDetailsBasedOnMaterial', () => {
    it('should return data mapped by adaptor', () => {
      spyOn(
        MarketMaterialPriceAdaptor,
        'getMarketDetailsBasedOnMarketCode'
      ).and.returnValue({
        marketDetails: dummyMarketCodeResponse,
        totalCount: 10
      });
      const materialCode = 'J';
      const pageIndex = 0;
      const pageSize = 10;

      const url = getMarketDetailsBasedOnMaterialUrl(
        materialCode,
        pageIndex,
        pageSize
      );
      materialPriceService
        .getMarketDetailsBasedOnMaterial({
          data: {
            materialCode: materialCode,
            pageIndex: pageIndex,
            pageSize: pageSize
          },
          selectedStock: [],
          isAllSelected: false,
          basePrice: 2000
        })
        .subscribe(data => {
          expect(data).toEqual({
            marketDetails: dummyMarketCodeResponse,
            totalCount: 10
          });
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush({});
    });
  });

  describe('getComputedLocationPrice', () => {
    it('should call POST api method with correct url and params', () => {
      spyOn(MarketMaterialPriceAdaptor, 'getSavedBasePrice').and.returnValue(
        {}
      );
      const materialCode = 'J';
      const pageIndex = 0;
      const pageSize = 10;

      const url = getComputeMaterialPriceUrl(materialCode, pageIndex, pageSize);

      materialPriceService
        .getComputedLocationPrice({
          materialCode: materialCode,
          pageIndex: pageIndex,
          pageSize: pageSize,
          data: {
            applicableDate: 1586341654360,
            basePrice: 2000,
            marketCodes: ['KA'],
            priceTypeCode: 'F'
          }
        })
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('page').toString()).toEqual(
        pageIndex.toString()
      );
      expect(request.request.params.get('size').toString()).toEqual(
        pageSize.toString()
      );
      request.flush({});
    });
  });

  describe('getComputedLocationPrice', () => {
    it('should call MarketMaterialPriceAdaptor  getSavedBasePrice method with correct arguments', () => {
      spyOn(MarketMaterialPriceAdaptor, 'getSavedBasePrice').and.returnValue(
        {}
      );
      const materialCode = 'J';
      const pageIndex = 0;
      const pageSize = 10;

      const url = getComputeMaterialPriceUrl(materialCode, pageIndex, pageSize);

      materialPriceService
        .getComputedLocationPrice({
          materialCode: materialCode,
          pageIndex: pageIndex,
          pageSize: pageSize,
          data: {
            applicableDate: 1586341654360,
            basePrice: 2000,
            marketCodes: ['KA'],
            priceTypeCode: 'F'
          }
        })
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush(dymmyLocationPriceRequestResponse);
      expect(MarketMaterialPriceAdaptor.getSavedBasePrice).toHaveBeenCalledWith(
        dymmyLocationPriceRequestResponse
      );
    });
  });

  describe('getComputedLocationPrice', () => {
    it('should return data mapped by adaptor', () => {
      spyOn(MarketMaterialPriceAdaptor, 'getSavedBasePrice').and.returnValue({
        locationDetails: dymmyLocationPriceResponse,
        totalCount: 10
      });
      const materialCode = 'J';
      const pageIndex = 0;
      const pageSize = 10;

      const url = getComputeMaterialPriceUrl(materialCode, pageIndex, pageSize);
      materialPriceService
        .getComputedLocationPrice({
          materialCode: materialCode,
          pageIndex: pageIndex,
          pageSize: pageSize,
          data: {
            applicableDate: 1586341654360,
            basePrice: 2000,
            marketCodes: ['KA'],
            priceTypeCode: 'F'
          }
        })
        .subscribe(data => {
          expect(data).toEqual({
            locationDetails: dymmyLocationPriceResponse,
            totalCount: 10
          });
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush({});
    });
  });

  describe('loadSavedBasePrice', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(MarketMaterialPriceAdaptor, 'getSavedBasePrice').and.returnValue(
        {}
      );
      const id = '1542';
      const materialCode = 'J';
      const pageIndex = 0;
      const pageSize = 10;

      const url = getSavedBasePriceUrl(materialCode, id, pageIndex, pageSize);
      materialPriceService
        .loadSavedBasePrice({
          materialCode: materialCode,
          id: id,
          pageIndex: pageIndex,
          pageSize: pageSize
        })
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
  });

  describe('loadSavedBasePrice', () => {
    it('should call MarketMaterialPriceAdaptor  getSavedBasePrice method with correct arguments', () => {
      spyOn(MarketMaterialPriceAdaptor, 'getSavedBasePrice').and.returnValue(
        {}
      );
      const id = '1542';
      const materialCode = 'J';
      const pageIndex = 0;
      const pageSize = 10;
      const url = getSavedBasePriceUrl(materialCode, id, pageIndex, pageSize);

      materialPriceService
        .loadSavedBasePrice({
          id: id,
          materialCode: materialCode,
          pageIndex: pageIndex,
          pageSize: pageSize
        })
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush(dymmyLocationPriceRequestResponse);
      expect(MarketMaterialPriceAdaptor.getSavedBasePrice).toHaveBeenCalledWith(
        dymmyLocationPriceRequestResponse
      );
    });
  });

  describe('loadSavedBasePrice', () => {
    it('should return data mapped by adaptor', () => {
      spyOn(MarketMaterialPriceAdaptor, 'getSavedBasePrice').and.returnValue({
        locationDetails: dymmyLocationPriceResponse,
        totalCount: 10
      });
      const id = '1542';
      const materialCode = 'J';
      const pageIndex = 0;
      const pageSize = 10;
      const url = getSavedBasePriceUrl(materialCode, id, pageIndex, pageSize);

      materialPriceService
        .loadSavedBasePrice({
          id: id,
          materialCode: materialCode,
          pageIndex: pageIndex,
          pageSize: pageSize
        })
        .subscribe(data => {
          expect(data).toEqual({
            locationDetails: dymmyLocationPriceResponse,
            totalCount: 10
          });
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush({});
    });
  });

  describe('savePrice', () => {
    it('should call PUT  api method with correct url and params', () => {
      const materialCode = 'J';
      const path = getSavePriceUrl(materialCode);
      materialPriceService
        .savePrice({
          materialCode: materialCode,
          data: {
            applicableDate: 1586341654360,
            basePrice: 2000,
            marketCodes: ['KA'],
            priceTypeCode: 'F',
            remarks: 'Forced Price'
          }
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
      spyOn(
        MarketMaterialPriceAdaptor,
        'getMarketDetailsBasedOnMarketCode'
      ).and.returnValue({});
      const materialCode = 'J';
      const marketCode = 'KA';
      const isAllSelected = false;
      const selectedStock = [];
      const basePrice = 2000;

      const url = getSearchMarketCodeUrl(materialCode, marketCode);

      materialPriceService
        .getSearchResult({
          data: { materialCode: materialCode, marketCode: marketCode },
          selectedStock: selectedStock,
          isAllSelected: isAllSelected,
          basePrice: basePrice
        })
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('marketCodes').toString()).toEqual(
        marketCode.toString()
      );

      request.flush({});
    });
  });

  describe('getSearchResult', () => {
    it('should call MarketMaterialPriceAdaptor  getMarketDetailsBasedOnMarketCode method with correct arguments', () => {
      spyOn(
        MarketMaterialPriceAdaptor,
        'getMarketDetailsBasedOnMarketCode'
      ).and.returnValue({});
      const materialCode = 'J';
      const marketCode = 'KA';
      const isAllSelected = false;
      const selectedStock = [];
      const basePrice = 2000;

      const url = getSearchMarketCodeUrl(materialCode, marketCode);
      materialPriceService
        .getSearchResult({
          data: { materialCode: materialCode, marketCode: marketCode },
          selectedStock: selectedStock,
          isAllSelected: isAllSelected,
          basePrice: basePrice
        })
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush(dummyMarketCodeRequestResponse);
      expect(
        MarketMaterialPriceAdaptor.getMarketDetailsBasedOnMarketCode
      ).toHaveBeenCalledWith(
        dummyMarketCodeRequestResponse,
        selectedStock,
        isAllSelected,
        basePrice
      );
    });
  });

  describe('getSearchResult', () => {
    it('should return data mapped by adaptor', () => {
      spyOn(
        MarketMaterialPriceAdaptor,
        'getMarketDetailsBasedOnMarketCode'
      ).and.returnValue({
        marketDetails: dummyMarketCodeResponse,
        totalCount: 1
      });
      const materialCode = 'J';
      const marketCode = 'KA';
      const isAllSelected = false;
      const selectedStock = [];
      const basePrice = 2000;

      const url = getSearchMarketCodeUrl(materialCode, marketCode);
      materialPriceService
        .getSearchResult({
          data: { materialCode: materialCode, marketCode: marketCode },
          selectedStock: selectedStock,
          isAllSelected: isAllSelected,
          basePrice: basePrice
        })
        .subscribe(data => {
          expect(data).toEqual({
            marketDetails: dummyMarketCodeResponse,
            totalCount: 1
          });
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush({});
    });
  });

  describe('searchComputedPriceByLocationCode', () => {
    it('should call POST api method with correct url and params', () => {
      spyOn(MarketMaterialPriceAdaptor, 'getSavedBasePrice').and.returnValue(
        {}
      );
      const materialCode = 'J';
      const locationCode = 'PNA';

      const url = getsearchComputedPriceByLocationCodeUrl(
        locationCode,
        materialCode
      );

      materialPriceService
        .searchComputedPriceByLocationCode(locationCode, materialCode, {
          applicableDate: 1586341654360,
          basePrice: 2000,
          marketCodes: ['KA'],
          priceTypeCode: 'F'
        })
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('locationCodes').toString()).toEqual(
        locationCode.toString()
      );
      request.flush({});
    });
  });

  describe('searchComputedPriceByLocationCode', () => {
    it('should call MarketMaterialPriceAdaptor  getSavedBasePrice method with correct arguments', () => {
      spyOn(MarketMaterialPriceAdaptor, 'getSavedBasePrice').and.returnValue(
        {}
      );
      const materialCode = 'J';
      const locationCode = 'PNA';

      const url = getsearchComputedPriceByLocationCodeUrl(
        locationCode,
        materialCode
      );
      materialPriceService
        .searchComputedPriceByLocationCode(locationCode, materialCode, {
          applicableDate: 1586341654360,
          basePrice: 2000,
          marketCodes: ['KA'],
          priceTypeCode: 'F'
        })
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush(dymmyLocationPriceRequestResponse);
      expect(MarketMaterialPriceAdaptor.getSavedBasePrice).toHaveBeenCalledWith(
        dymmyLocationPriceRequestResponse
      );
    });
  });

  describe('searchComputedPriceByLocationCode', () => {
    it('should return data mapped by adaptor', () => {
      spyOn(MarketMaterialPriceAdaptor, 'getSavedBasePrice').and.returnValue({
        locationDetails: dymmyLocationPriceResponse,
        totalCount: 1
      });
      const materialCode = 'J';
      const locationCode = 'PNA';
      const url = getsearchComputedPriceByLocationCodeUrl(
        locationCode,
        materialCode
      );

      materialPriceService
        .searchComputedPriceByLocationCode(locationCode, materialCode, {
          applicableDate: 1586341654360,
          basePrice: 2000,
          marketCodes: ['KA'],
          priceTypeCode: 'F'
        })
        .subscribe(data => {
          expect(data).toEqual({
            locationDetails: dymmyLocationPriceResponse,
            totalCount: 1
          });
        });
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.request.params.get('locationCodes').toString()).toEqual(
        locationCode.toString()
      );
      request.flush({});
    });
  });

  describe('searchSavedLocationPriceByLocationCode', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(MarketMaterialPriceAdaptor, 'getSavedBasePrice').and.returnValue(
        {}
      );
      const id = '1542';
      const materialCode = 'J';
      const locationCode = 'PNA';

      const url = getSearchSavedLocationPriceByLocationCodeUrl(
        id,
        locationCode,
        materialCode
      );
      materialPriceService
        .searchSavedLocationPriceByLocationCode(id, locationCode, materialCode)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('locationCode').toString()).toEqual(
        locationCode.toString()
      );
      request.flush({});
    });
  });

  describe('searchSavedLocationPriceByLocationCode', () => {
    it('should call MarketMaterialPriceAdaptor  getSavedBasePrice method with correct arguments', () => {
      spyOn(MarketMaterialPriceAdaptor, 'getSavedBasePrice').and.returnValue(
        {}
      );
      const id = '1542';
      const materialCode = 'J';
      const locationCode = 'PNA';

      const url = getSearchSavedLocationPriceByLocationCodeUrl(
        id,
        locationCode,
        materialCode
      );
      materialPriceService
        .searchSavedLocationPriceByLocationCode(id, locationCode, materialCode)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush(dymmyLocationPriceRequestResponse);
      expect(MarketMaterialPriceAdaptor.getSavedBasePrice).toHaveBeenCalledWith(
        dymmyLocationPriceRequestResponse
      );
    });
  });

  describe('searchSavedLocationPriceByLocationCode', () => {
    it('should return data mapped by adaptor', () => {
      spyOn(MarketMaterialPriceAdaptor, 'getSavedBasePrice').and.returnValue({
        locationDetails: dymmyLocationPriceResponse,
        totalCount: 10
      });
      const id = '1542';
      const materialCode = 'J';
      const locationCode = 'PNA';

      const url = getSearchSavedLocationPriceByLocationCodeUrl(
        id,
        locationCode,
        materialCode
      );
      materialPriceService
        .searchSavedLocationPriceByLocationCode(id, locationCode, materialCode)
        .subscribe(data => {
          expect(data).toEqual({
            locationDetails: dymmyLocationPriceResponse,
            totalCount: 10
          });
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush({});
    });
  });
});
