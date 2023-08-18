import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

import { ItemListingService } from './item.service';

import { ItemAdaptor } from '@poss-web/shared/util-adaptors';
import {
  // getItemDetailsListingUrl,
  getItemByItemCodeUrl,
  getCFAProductCodeLiteDataUrl,
  getFilterItemDetailsListingUrl,
  getItemStonesUrl
} from '@poss-web/shared/util-api-service';

import {
  ItemDetails,
  LoadItemListingPayload,
  ListingPageData,
  ItemFilterPayload,
  ItemStones
  // ProductGroup,
  // LovTypeData
} from '@poss-web/shared/models';
describe('ItemListingService', () => {
  let httpTestingController: HttpTestingController;
  let itemService: ItemListingService;
  const apiUrl = 'http://localhost:3000';

  const dummySearchItem: ListingPageData[] = [
    {
      // isEditable: true,
      itemCode: 'ABC1123',
      description: 'test'
      // isActive: true
    }
  ];

  const dummyItemMaster: ItemDetails = {
    isEditable: true,
    itemCode: 'ABC',
    description: 'ABC',
    isActive: true,
    stoneWeight: 'ABC',
    indentType: 'ABC',
    isConsignable: true,
    maxWeightDeviation: 'ABC',
    stdWeight: 'ABC',
    productCode: 'ABC',
    brandCode: 'ABC',
    productType: 'ABC',
    materialCode: 'ABC',
    supplyChainCode: 'ABC',
    itemNature: 'ABC',
    stdPrice: 'ABC',
    stoneCharges: 'ABC',
    leadTime: 'ABC',
    hsnSacCode: 'ABC',
    purity: 'ABC',
    inventoryType: 'ABC',
    CFAproductCode: 'ABC',
    complexityCode: 'ABC',
    pricingType: 'ABC',
    taxClass: 'ABC',
    findingCode: 'ABC',
    size: 'ABC',
    finishing: 'ABC',
    pricingGroupType: 'ABC',
    priceFactor: 'ABC',
    karatage: 'ABC',
    diamondKaratage: 'ABC',
    diamondClarity: 'ABC',
    diamondColour: 'ABC',
    perGram: true,
    saleable: true,
    returnable: true,
    indentable: true
  };

  const dummyItemResponse = {
    results: dummySearchItem,
    pageNumber: 0,
    pageSize: 10,
    totalPages: 1,
    totalElements: 10
  };
  const listingPayload: LoadItemListingPayload = {
    pageIndex: 0,
    pageSize: 10
  };
  const filterPayload: ItemFilterPayload = {
    fromStdValue: 100,
    fromStdWeight: 1,
    fromStoneCharges: 100,
    itemCode: 'AAA',
    pricingType: 'AAA',
    productCategoryCode: 'AAA',
    productGroupCode: 'AAA',
    toStdValue: 10000,
    toStdWeight: 5,
    toStoneCharges: 11000
  };
  const payload = {
    filterPayload: filterPayload,
    paginate: listingPayload
  };

  const dummyCodesData = [
    {
      id: '1',
      name: 'ABC'
    }
  ];
  const itemStonesData: ItemStones[] = [
    {
      stoneCode: 'A9',
      id: '111',
      isActive: true,
      itemCode: 'AAA123',
      noOfStones: 10
    }
  ];
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ItemListingService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    itemService = TestBed.inject(ItemListingService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(itemService).toBeTruthy();
  });

  //ItemListig Based on filter

  describe('getFilterItemDetails', () => {
    it('should call POST api method with correct url and params', () => {
      spyOn(ItemAdaptor, 'getItemDetailsListing').and.returnValue({});
      const url = getFilterItemDetailsListingUrl(
        payload.paginate.pageIndex,
        payload.paginate.pageSize
      );
      itemService.getFilterItemDetails(payload).subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.url).toEqual(apiUrl + url.path);
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });

    it('should call ItemAdaptor getItemDetailsListing method with correct  parameters', () => {
      spyOn(ItemAdaptor, 'getItemDetailsListing').and.returnValue({});
      const url = getFilterItemDetailsListingUrl(
        payload.paginate.pageIndex,
        payload.paginate.pageSize
      );
      itemService.getFilterItemDetails(payload).subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      request.flush(dummyItemResponse);
      expect(ItemAdaptor.getItemDetailsListing).toHaveBeenCalledWith(
        dummyItemResponse
      );
    });

    it('should return data mapped by adaptors', () => {
      spyOn(ItemAdaptor, 'getItemDetailsListing').and.returnValue({
        itemListing: dummySearchItem,
        totalElements: 10
      });
      const url = getFilterItemDetailsListingUrl(
        payload.paginate.pageIndex,
        payload.paginate.pageSize
      );
      itemService.getFilterItemDetails(payload).subscribe(data => {
        expect(data).toEqual({
          itemListing: dummySearchItem,
          totalElements: 10
        });
      });
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      request.flush({});
    });
  });

  //Itemdetails By Item Code

  describe('getItemByItemCode', () => {
    it('should call POST api method with correct url and params', () => {
      spyOn(ItemAdaptor, 'getItemDetailsByItemCode').and.returnValue({});
      const itemCode = 'ABC1234';
      const url = getFilterItemDetailsListingUrl();
      itemService.getItemByItemCode(itemCode).subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });

    it('should call ItemAdaptor getItemDetailsByItemCode method with correct  parameters', () => {
      spyOn(ItemAdaptor, 'getItemDetailsByItemCode').and.returnValue({});
      const itemCode = 'ABC1234';
      const url = getFilterItemDetailsListingUrl();
      itemService.getItemByItemCode(itemCode).subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      request.flush(dummySearchItem);
      expect(ItemAdaptor.getItemDetailsByItemCode).toHaveBeenCalledWith(
        dummySearchItem
      );
    });

    it('should return data mapped by adaptors', () => {
      spyOn(ItemAdaptor, 'getItemDetailsByItemCode').and.returnValue(
        dummyItemMaster
      );
      const itemCode = 'ABC1234';
      const url = getFilterItemDetailsListingUrl();
      itemService.getItemByItemCode(itemCode).subscribe(data => {
        expect(data).toEqual(dummyItemMaster);
      });
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      request.flush({});
    });
  });

  describe('getItemStones', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(ItemAdaptor, 'getItemStones').and.returnValue({});
      const itemCode = 'AAA123';
      const path = getItemStonesUrl(itemCode);
      itemService.getItemStones(itemCode).subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });

    it('should call ItemAdaptor getItemStones method with correct  parameters', () => {
      spyOn(ItemAdaptor, 'getItemStones').and.returnValue(itemStonesData);
      const itemCode = 'AAA123';
      const path = getItemStonesUrl(itemCode);
      itemService.getItemStones(itemCode).subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush(itemStonesData);
      expect(ItemAdaptor.getItemStones).toHaveBeenCalledWith(itemStonesData);
    });

    it('should return data mapped by adaptors', () => {
      spyOn(ItemAdaptor, 'getItemStones').and.returnValue(itemStonesData);
      const itemCode = 'AAA123';
      const path = getItemStonesUrl(itemCode);
      itemService.getItemStones(itemCode).subscribe(data => {
        expect(data).toEqual(itemStonesData);
      });
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush({});
    });
  });
  // describe('loadLovType', () => {
  //   it('should load LOV data', () => {
  //     const dummyLovTypeData: LovTypeData = {
  //       code: '1',
  //       value: 'ABC',
  //       isActive: true
  //     };
  //     itemService.loadLovType(dummyLovTypeData)
  //   });
  // });

  // describe('getCFAproductCode', () => {
  //   it('should call GET api method with correct url and params', () => {
  //     spyOn(ItemAdaptor, 'getCFAProductCode').and.returnValue({});
  //     const url = getCFAProductCodeLiteDataUrl();
  //     itemService.getCFAproductCode().subscribe();
  //     const request = httpTestingController.expectOne(req => {
  //       return req.url === apiUrl + url.path;
  //     });
  //     expect(request.cancelled).toBeFalsy();
  //     expect(request.request.method).toEqual('GET');
  //     expect(request.request.responseType).toEqual('json');
  //     request.flush({});
  //   });
  //   it('should call ItemAdaptor getCFAProductCode method with correct  parameters', () => {
  //     spyOn(ItemAdaptor, 'getCFAProductCode').and.returnValue(dummyCodesData);

  //     const url = getCFAProductCodeLiteDataUrl();

  //     itemService.getCFAproductCode().subscribe();

  //     const request = httpTestingController.expectOne(req => {
  //       return req.url === apiUrl + url.path;
  //     });

  //     request.flush(dummyCodesData);
  //     expect(ItemAdaptor.getCFAProductCode).toHaveBeenCalledWith(
  //       dummyCodesData
  //     );
  //   });

  //   it('should return data mapped by adaptors', () => {
  //     spyOn(ItemAdaptor, 'getCFAProductCode').and.returnValue(dummyCodesData);

  //     const url = getCFAProductCodeLiteDataUrl();
  //     itemService.getCFAproductCode().subscribe(data => {
  //       expect(data).toEqual(dummyCodesData);
  //     });

  //     const request = httpTestingController.expectOne(req => {
  //       return req.url === apiUrl + url.path;
  //     });

  //     request.flush({});
  //   });
  // });
});
