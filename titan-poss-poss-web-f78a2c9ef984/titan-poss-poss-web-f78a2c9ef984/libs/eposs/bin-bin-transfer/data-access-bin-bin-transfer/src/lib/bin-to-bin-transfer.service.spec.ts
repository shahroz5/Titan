import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import * as moment from 'moment';
import { BinToBinTransferService } from './bin-to-bin-transfer.service';
import {
  BinToBinTransferItemListGroupHelper,
  BinToBinTransferItemHelper,
  BinToBinTransferHistoryItemHelper,
  BinToBinTransferHistoryAdaptor
} from '@poss-web/shared/util-adaptors';
import {
  getBinToBinTransferGetItemListGroupsUrl,
  getBinToBinTransferSearchItemsUrl,
  getBinToBinTransferGetItemsUrl,
  getBinToBinTransferConfirmTransferItemsUrl,
  getBinToBinTransferConfirmTransferAllItemsUrl,
  getBinToBinHistoryItemsByPaginationEndpointUrl,
  getBinToBinHistoryByPaginationEndpointUrl,
  getBinToBinSelectedHistoryUrl
} from '@poss-web/shared/util-api-service';
import {
  BinToBinTransferTypeEnum,
  BinToBinTransferLoadItemListGroupResponse,
  BinToBinTransferItemListGroup,
  BinToBinTransferLoadItemsResponse,
  BinToBinTransferItem,
  BinToBinTransferConfirmTransferItemsRequest,
  BinToBinTransferConfirmTransferAllItemsRequest,
  BinToBinTransferLoadHistoryItemsResponse
} from '@poss-web/shared/models';

describe('BinToBinTransferService ', () => {
  let httpTestingController: HttpTestingController;
  let binToBinTransferService: BinToBinTransferService;
  const apiUrl = 'http://localhost:3000';
  const binType = 'BIN_BIN';

  const dummyItemGroup: BinToBinTransferItemListGroup[] = [
    {
      id: '11',
      name: '71',
      products: 16,
      totalValue: 826133.1,
      totalWeight: 269.728,
      currencyCode: 'INR',
      weightUnit: 'gms',
      description: 'Gold Plain'
    },
    {
      id: '11',
      name: '75',
      products: 2,
      totalValue: 417059.68,
      totalWeight: 145.667,
      currencyCode: 'INR',
      weightUnit: 'gms',
      description: 'Plain Jewellery with Stones'
    }
  ];

  const dummyItemGroupResponse = {
    results: dummyItemGroup,
    pageNumber: 0,
    pageSize: 8,
    totalPages: 1,
    totalElements: 6
  };

  const dummyItems: BinToBinTransferItem[] = [
    {
      id: 'B948E97B-BBB8-4C77-9383-1712B570F713',
      itemCode: '511178VHIU1A00',
      lotNumber: '2EA001188',
      mfgDate: moment(),
      productCategory: 'V',
      productGroup: '71',
      productCategoryDesc: 'BANGLES',
      productGroupDesc: 'Gold Plain',
      binCode: 'CHAIN',
      binGroupCode: 'STN',
      stdValue: 88213.86,
      stdWeight: 28.75,
      currencyCode: 'INR',
      weightUnit: 'gms',
      imageURL: '/productcatalogue/ProductImages/1178VHI.jpg',
      itemDetails: {},
      availableWeight: 28.75,
      availableValue: 88213.86,
      availableQuantity: 1,
      isSelected: false,
      isDisabled: false,
      destinationBinGroupCode: null,
      destinationBinCode: null,
      isStudded: true,
      thumbnailImageURL: 'abc',
      isLoadingThumbnailImage: false,
      isLoadingImage: false
    }
  ];

  const dummyItemRequestResponse = {
    results: dummyItems,
    pageNumber: 0,
    pageSize: 20,
    totalPages: 1,
    totalElements: 1
  };

  const dummyHistoryHeader = {
    id: '111',
    transactionType: 'BIN_BIN',
    locationCode: 'URB',
    srcDocNo: 123,
    srcFiscalYear: 2019,
    srcDocDate: moment(),
    destDocNo: 1223,
    destDocDate: '11-MAR-2020',
    totalAvailableQuantity: 10,
    totalMeasuredQuantity: 10,
    locationCodeDescription: 'Desc',
    totalAvailableValue: 1000,
    totalMeasuredValue: 1000,
    totalAvailableWeight: 1000,
    totalMeasuredWeight: 1000,
    carrierDetails: {},
    weightUnit: 'gms',
    currencyCode: 'INR',
    status: 'OPEN',
    destFiscalYear: 2019,
    remarks: 'Remarks',
    otherDetails: {}
  };

  const dummyHistoryHeaderResponse = {
    results: [dummyHistoryHeader],
    pageNumber: 0,
    pageSize: 20,
    totalPages: 1,
    totalElements: 1
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        BinToBinTransferService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    binToBinTransferService = TestBed.inject(BinToBinTransferService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(binToBinTransferService).toBeTruthy();
  });

  describe('getItemListGroups', () => {
    it('Source Bin List - should call GET api method with correct url and params', () => {
      spyOn(BinToBinTransferItemListGroupHelper, 'getInfo').and.returnValue({});
      const type = BinToBinTransferTypeEnum.BIN_CODE;
      const pageIndex = 0;
      const pageSize = 10;
      const value = '10';
      const transferBy = 'bins';
      const { path, params } = getBinToBinTransferGetItemListGroupsUrl(
        transferBy,
        pageIndex,
        pageSize,
        type,
        value,
        binType
      );

      binToBinTransferService
        .getItemListGroups(type, pageIndex, pageSize, value)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('binType')).toEqual(binType);
      expect(request.request.params.get(type)).toEqual(value);
      expect(request.request.params.get('page').toString()).toEqual(
        pageIndex.toString()
      );
      expect(request.request.params.get('size').toString()).toEqual(
        pageSize.toString()
      );
      expect(request.request.url.includes(transferBy)).toBeTruthy();
      request.flush({});
    });

    it('Product Category List - should call GET api method with correct url and params', () => {
      spyOn(BinToBinTransferItemListGroupHelper, 'getInfo').and.returnValue({});
      const type = BinToBinTransferTypeEnum.PRODUCT_CATEGORY;
      const pageIndex = 0;
      const pageSize = 10;
      const value = '10';
      const transferBy = 'product-category';
      const { path, params } = getBinToBinTransferGetItemListGroupsUrl(
        transferBy,
        pageIndex,
        pageSize,
        type,
        value,
        binType
      );

      binToBinTransferService
        .getItemListGroups(type, pageIndex, pageSize, value)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('binType')).toEqual(binType);
      expect(request.request.params.get(type)).toEqual(value);
      expect(request.request.params.get('page').toString()).toEqual(
        pageIndex.toString()
      );
      expect(request.request.params.get('size').toString()).toEqual(
        pageSize.toString()
      );
      expect(request.request.url.includes(transferBy)).toBeTruthy();
      request.flush({});
    });

    it('Product Group List - should call GET api method with correct url and params', () => {
      spyOn(BinToBinTransferItemListGroupHelper, 'getInfo').and.returnValue({});
      const type = BinToBinTransferTypeEnum.PRODUCT_GROUP;
      const pageIndex = 0;
      const pageSize = 10;
      const value = 'searchValue';
      const transferBy = 'product-group';
      const { path, params } = getBinToBinTransferGetItemListGroupsUrl(
        transferBy,
        pageIndex,
        pageSize,
        type,
        value,
        binType
      );

      binToBinTransferService
        .getItemListGroups(type, pageIndex, pageSize, value)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('binType')).toEqual(binType);
      expect(request.request.params.get(type)).toEqual(value);
      expect(request.request.params.get('page').toString()).toEqual(
        pageIndex.toString()
      );
      expect(request.request.params.get('size').toString()).toEqual(
        pageSize.toString()
      );
      expect(request.request.url.includes(transferBy)).toBeTruthy();
      request.flush({});
    });

    it('should call itemGroup helper method with correct arguments', () => {
      spyOn(BinToBinTransferItemListGroupHelper, 'getInfo').and.returnValue({});
      const type = BinToBinTransferTypeEnum.PRODUCT_GROUP;
      const pageIndex = 0;
      const pageSize = 10;
      const value = '10';
      const transferBy = 'product-group';
      const path = getBinToBinTransferGetItemListGroupsUrl(
        transferBy,
        pageIndex,
        pageSize,
        type,
        value,
        binType
      ).path;

      binToBinTransferService
        .getItemListGroups(type, pageIndex, pageSize, value)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(dummyItemGroupResponse);
      expect(BinToBinTransferItemListGroupHelper.getInfo).toHaveBeenCalledWith(
        dummyItemGroupResponse
      );
    });

    it('should retun data mapped by itemGroup helper', () => {
      const result: BinToBinTransferLoadItemListGroupResponse = {
        itemListGroups: dummyItemGroupResponse.results,
        count: dummyItemGroupResponse.totalElements
      };
      spyOn(BinToBinTransferItemListGroupHelper, 'getInfo').and.returnValue(
        result
      );
      const type = BinToBinTransferTypeEnum.PRODUCT_GROUP;
      const pageIndex = 0;
      const pageSize = 10;
      const value = '10';
      const transferBy = 'product-group';
      const path = getBinToBinTransferGetItemListGroupsUrl(
        transferBy,
        pageIndex,
        pageSize,
        type,
        value,
        binType
      ).path;

      binToBinTransferService
        .getItemListGroups(type, pageIndex, pageSize, value)
        .subscribe(data => {
          expect(data.itemListGroups).toEqual(result.itemListGroups);
          expect(data.count).toEqual(result.count);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush({});
    });
  });

  describe('searchItems', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(BinToBinTransferItemHelper, 'getItems').and.returnValue({});
      const itemCode = '5TDHHDJ111';
      const lotNumber = 'ASBBC1223';
      const { path, params } = getBinToBinTransferSearchItemsUrl(
        itemCode,
        lotNumber,
        binType
      );

      binToBinTransferService.searchItems(itemCode, lotNumber).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('binType')).toEqual(binType);
      expect(request.request.params.get('itemCode')).toEqual(itemCode);
      expect(request.request.params.get('lotNumber')).toEqual(lotNumber);

      request.flush({});
    });

    it('Negative - should call GET api method with correct url and params', () => {
      spyOn(BinToBinTransferItemHelper, 'getItems').and.returnValue({});
      const { path, params } = getBinToBinTransferSearchItemsUrl(
        null,
        null,
        binType
      );

      binToBinTransferService.searchItems(null, null).subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('binType')).toEqual(binType);
      expect(request.request.params.get('itemCode')).toBeFalsy();
      expect(request.request.params.get('lotNumber')).toBeFalsy();

      request.flush({});
    });

    it('should call item helper method with correct arguments', () => {
      spyOn(BinToBinTransferItemHelper, 'getItems').and.returnValue({});
      const itemCode = '5TDHHDJ111';
      const lotNumber = 'ASBBC1223';
      const path = getBinToBinTransferSearchItemsUrl(
        itemCode,
        lotNumber,
        binType
      ).path;

      binToBinTransferService.searchItems(itemCode, lotNumber).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(dummyItemRequestResponse);
      expect(BinToBinTransferItemHelper.getItems).toHaveBeenCalledWith(
        dummyItemRequestResponse,
        []
      );
    });

    it('should retun data mapped by item helper', () => {
      const result: BinToBinTransferLoadItemsResponse = {
        items: dummyItems,
        count: 10
      };
      spyOn(BinToBinTransferItemHelper, 'getItems').and.returnValue(result);
      const itemCode = '5TDHHDJ111';
      const lotNumber = 'ASBBC1223';
      const path = getBinToBinTransferSearchItemsUrl(
        itemCode,
        lotNumber,
        binType
      ).path;

      binToBinTransferService
        .searchItems(itemCode, lotNumber)
        .subscribe(data => {
          expect(data.count).toEqual(result.count);
          expect(data.items).toEqual(result.items);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });

  describe('getItems', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(BinToBinTransferItemHelper, 'getItems').and.returnValue({});
      const value = 'BANGLE';
      const type = 'bins';
      const itemCode = '2SXD22';
      const lotNumber = '2WER2';
      const pageIndex = 0;
      const pageSize = 10;
      const sortBy = 'weight';
      const sortOrder = 'ASC';
      const filter: { key: string; value: any[] }[] = [
        { key: 'test', value: ['test1', 'test2'] }
      ];

      const { path, params } = getBinToBinTransferGetItemsUrl(
        itemCode,
        lotNumber,
        type,
        value,
        pageIndex,
        pageSize,
        sortBy,
        sortOrder,
        filter,
        binType
      );

      binToBinTransferService
        .getItems(
          itemCode,
          lotNumber,
          type,
          value,
          pageIndex,
          pageSize,
          sortBy,
          sortOrder,
          filter
        )
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.params.get(type)).toEqual(value);
      expect(request.request.params.get('itemCode')).toEqual(itemCode);
      expect(request.request.params.get('lotNumber')).toEqual(lotNumber);
      expect(request.request.params.get('sort')).toEqual(
        `${sortBy},${sortOrder}`
      );
      expect(request.request.params.get('page').toString()).toEqual(
        pageIndex.toString()
      );
      expect(request.request.params.get('size').toString()).toEqual(
        pageSize.toString()
      );
      request.flush({});
    });

    it('should call item helper method with correct arguments', () => {
      spyOn(BinToBinTransferItemHelper, 'getItems').and.returnValue({});
      const value = 'BANGLE';
      const type = 'bins';
      const itemCode = '2SXD22';
      const lotNumber = '2WER2';
      const pageIndex = 0;
      const pageSize = 10;
      const sortBy = 'weight';
      const sortOrder = 'ASC';
      const filter: { key: string; value: any[] }[] = [
        { key: 'test', value: ['test1', 'test2'] }
      ];

      const path = getBinToBinTransferGetItemsUrl(
        itemCode,
        lotNumber,
        type,
        value,
        pageIndex,
        pageSize,
        sortBy,
        sortOrder,
        filter,
        binType
      ).path;

      binToBinTransferService
        .getItems(
          itemCode,
          lotNumber,
          type,
          value,
          pageIndex,
          pageSize,
          sortBy,
          sortOrder,
          filter
        )
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(dummyItemRequestResponse);
      expect(BinToBinTransferItemHelper.getItems).toHaveBeenCalledWith(
        dummyItemRequestResponse,
        []
      );
    });

    it('should retun data mapped by item helper', () => {
      const result: BinToBinTransferLoadItemsResponse = {
        items: dummyItems,
        count: 10
      };
      spyOn(BinToBinTransferItemHelper, 'getItems').and.returnValue(result);
      const value = 'BANGLE';
      const type = 'bins';
      const itemCode = '2SXD22';
      const lotNumber = '2WER2';
      const pageIndex = 0;
      const pageSize = 10;
      const sortBy = 'weight';
      const sortOrder = 'ASC';
      const filter: { key: string; value: any[] }[] = [
        { key: 'test', value: ['test1', 'test2'] }
      ];

      const path = getBinToBinTransferGetItemsUrl(
        itemCode,
        lotNumber,
        type,
        value,
        pageIndex,
        pageSize,
        sortBy,
        sortOrder,
        filter,
        binType
      ).path;

      binToBinTransferService
        .getItems(
          itemCode,
          lotNumber,
          type,
          value,
          pageIndex,
          pageSize,
          sortBy,
          sortOrder,
          filter
        )
        .subscribe(data => {
          expect(data.count).toEqual(result.count);
          expect(data.items).toEqual(result.items);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });

  describe('confirmTransferItems', () => {
    it('should call PATCH api method with correct url and params', () => {
      const confirmTransferItemsRequest: BinToBinTransferConfirmTransferItemsRequest = {
        request: {
          binItems: [
            {
              binCode: 'Test',
              inventoryId: 'TestID',
              binGroupCode: 'TestCode'
            }
          ]
        },
        remove: false
      };

      const url = getBinToBinTransferConfirmTransferItemsUrl();

      binToBinTransferService
        .confirmTransferItems(confirmTransferItemsRequest)
        .subscribe();

      const request = httpTestingController.expectOne(apiUrl + url);
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.body).toEqual(
        JSON.stringify(confirmTransferItemsRequest.request)
      );
      request.flush({});
    });

    it('should retun transfer ID ', () => {
      const result = {
        docNo: 11111
      };
      const confirmTransferItemsRequest: BinToBinTransferConfirmTransferItemsRequest = {
        request: {
          binItems: [
            {
              binCode: 'Test',
              inventoryId: 'TestID',
              binGroupCode: 'TestCode'
            }
          ]
        },
        remove: false
      };

      const url = getBinToBinTransferConfirmTransferItemsUrl();

      binToBinTransferService
        .confirmTransferItems(confirmTransferItemsRequest)
        .subscribe(data => {
          expect(data.transferId).toEqual(result.docNo);
        });

      const request = httpTestingController.expectOne(apiUrl + url);

      request.flush(result);
    });
  });

  describe('confirmTransferAllItems', () => {
    it('Source bin - should call PATCH api method with correct url and params', () => {
      const typeUrl = 'bin';
      const typeParam = 'srcBincode';
      const confrimRequest: BinToBinTransferConfirmTransferAllItemsRequest = {
        type: BinToBinTransferTypeEnum.BIN_CODE,
        value: 'Bangle',
        destinationBinCode: 'testBinCode',
        destinationBinGroupCode: 'testBinGroupCode'
      };

      const { path, params } = getBinToBinTransferConfirmTransferAllItemsUrl(
        typeUrl,
        typeParam,
        confrimRequest.value,
        confrimRequest.destinationBinCode,
        confrimRequest.destinationBinGroupCode
      );
      binToBinTransferService
        .confirmTransferAllItems(confrimRequest)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.params.get('destinationBincode')).toEqual(
        confrimRequest.destinationBinCode
      );
      expect(request.request.params.get('destinationBinGroup')).toEqual(
        confrimRequest.destinationBinGroupCode
      );
      expect(request.request.params.get(typeParam)).toEqual(
        confrimRequest.value
      );
      expect(request.request.url.includes(typeUrl)).toBeTruthy();

      request.flush({});
    });

    it('Product Group - should call PATCH api method with correct url and params', () => {
      const typeUrl = 'product-group';
      const typeParam = 'productGroup';
      const confrimRequest: BinToBinTransferConfirmTransferAllItemsRequest = {
        type: BinToBinTransferTypeEnum.PRODUCT_GROUP,
        value: 'Bangle',
        destinationBinCode: 'testBinCode',
        destinationBinGroupCode: 'testBinGroupCode'
      };

      const { path, params } = getBinToBinTransferConfirmTransferAllItemsUrl(
        typeUrl,
        typeParam,
        confrimRequest.value,
        confrimRequest.destinationBinCode,
        confrimRequest.destinationBinGroupCode
      );
      binToBinTransferService
        .confirmTransferAllItems(confrimRequest)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.params.get('destinationBincode')).toEqual(
        confrimRequest.destinationBinCode
      );
      expect(request.request.params.get('destinationBinGroup')).toEqual(
        confrimRequest.destinationBinGroupCode
      );
      expect(request.request.params.get(typeParam)).toEqual(
        confrimRequest.value
      );
      expect(request.request.url.includes(typeUrl)).toBeTruthy();

      request.flush({});
    });

    it('Product Category - should call PATCH api method with correct url and params', () => {
      const typeUrl = 'product-category';
      const typeParam = 'productCategory';
      const confrimRequest: BinToBinTransferConfirmTransferAllItemsRequest = {
        type: BinToBinTransferTypeEnum.PRODUCT_CATEGORY,
        value: 'Bangle',
        destinationBinCode: 'testBinCode',
        destinationBinGroupCode: 'testBinGroupCode'
      };

      const { path, params } = getBinToBinTransferConfirmTransferAllItemsUrl(
        typeUrl,
        typeParam,
        confrimRequest.value,
        confrimRequest.destinationBinCode,
        confrimRequest.destinationBinGroupCode
      );
      binToBinTransferService
        .confirmTransferAllItems(confrimRequest)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.params.get('destinationBincode')).toEqual(
        confrimRequest.destinationBinCode
      );
      expect(request.request.params.get('destinationBinGroup')).toEqual(
        confrimRequest.destinationBinGroupCode
      );
      expect(request.request.params.get(typeParam)).toEqual(
        confrimRequest.value
      );
      expect(request.request.url.includes(typeUrl)).toBeTruthy();

      request.flush({});
    });

    it('should retun transfer ID ', () => {
      const result = {
        docNo: 11111
      };
      const typeUrl = 'product-category';
      const typeParam = 'productCategory';
      const confrimRequest: BinToBinTransferConfirmTransferAllItemsRequest = {
        type: BinToBinTransferTypeEnum.PRODUCT_CATEGORY,
        value: 'Bangle',
        destinationBinCode: 'testBinCode',
        destinationBinGroupCode: 'testBinGroupCode'
      };

      const path = getBinToBinTransferConfirmTransferAllItemsUrl(
        typeUrl,
        typeParam,
        confrimRequest.value,
        confrimRequest.destinationBinCode,
        confrimRequest.destinationBinGroupCode
      ).path;
      binToBinTransferService
        .confirmTransferAllItems(confrimRequest)
        .subscribe(data => {
          expect(data.transferId).toEqual(result.docNo);
        });
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(result);
    });
  });

  describe('getHistoryItems', () => {
    it('should call POST api method with correct url and params', () => {
      spyOn(BinToBinTransferItemHelper, 'getHistoryItems').and.returnValue({});
      const id = '1234';
      const historyItemsPayload = {
        data: 'testData'
      };
      const pageIndex = 0;
      const pageSize = 10;
      const sortBy = 'weight';
      const sortOrder = 'ASC';

      const { path, params } = getBinToBinHistoryItemsByPaginationEndpointUrl(
        pageIndex,
        pageSize,
        sortBy,
        sortOrder,
        id
      );

      binToBinTransferService
        .getHistoryItems(
          historyItemsPayload,
          pageIndex,
          pageSize,
          sortBy,
          sortOrder,
          id
        )
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.params.get('page')).toEqual(pageIndex.toString());
      expect(request.request.params.get('size')).toEqual(pageSize.toString());
      expect(request.request.params.get('sort')).toEqual(
        `${sortBy},${sortOrder}`
      );
      expect(request.request.body).toEqual(JSON.stringify(historyItemsPayload));
      request.flush({});
    });

    it('should call item helper method with correct arguments', () => {
      spyOn(BinToBinTransferItemHelper, 'getHistoryItems').and.returnValue({});
      const id = '1234';
      const historyItemsPayload = {
        data: 'testData'
      };
      const pageIndex = 0;
      const pageSize = 10;
      const sortBy = 'weight';
      const sortOrder = 'ASC';

      const path = getBinToBinHistoryItemsByPaginationEndpointUrl(
        pageIndex,
        pageSize,
        sortBy,
        sortOrder,
        id
      ).path;

      binToBinTransferService
        .getHistoryItems(
          historyItemsPayload,
          pageIndex,
          pageSize,
          sortBy,
          sortOrder,
          id
        )
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(dummyItemRequestResponse);
      expect(BinToBinTransferItemHelper.getHistoryItems).toHaveBeenCalledWith(
        dummyItemRequestResponse,
        []
      );
    });

    it('should retun data mapped by item helper', () => {
      const result: BinToBinTransferLoadItemsResponse = {
        items: dummyItems,
        count: 10
      };
      spyOn(BinToBinTransferItemHelper, 'getHistoryItems').and.returnValue(
        result
      );

      const id = '1234';
      const historyItemsPayload = {
        data: 'testData'
      };
      const pageIndex = 0;
      const pageSize = 10;
      const sortBy = 'weight';
      const sortOrder = 'ASC';

      const path = getBinToBinHistoryItemsByPaginationEndpointUrl(
        pageIndex,
        pageSize,
        sortBy,
        sortOrder,
        id
      ).path;

      binToBinTransferService
        .getHistoryItems(
          historyItemsPayload,
          pageIndex,
          pageSize,
          sortBy,
          sortOrder,
          id
        )
        .subscribe(data => {
          expect(data.count).toEqual(result.count);
          expect(data.items).toEqual(result.items);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });

  describe('getHistory', () => {
    it('should call POST api method with correct url and params', () => {
      spyOn(BinToBinTransferHistoryItemHelper, 'getItems').and.returnValue({});
      const payload = 'History Data';
      const pageIndex = 0;
      const pageSize = 10;
      const transferType = 'TEST';

      const { path, params } = getBinToBinHistoryByPaginationEndpointUrl(
        pageIndex,
        pageSize,
        transferType
      );

      binToBinTransferService
        .getHistory(payload, pageIndex, pageSize, transferType)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('page').toString()).toEqual(
        pageIndex.toString()
      );
      expect(request.request.params.get('size').toString()).toEqual(
        pageSize.toString()
      );
      expect(request.request.body).toEqual(JSON.stringify(payload));

      request.flush({});
    });

    it('should call History helper method with correct arguments', () => {
      spyOn(BinToBinTransferHistoryItemHelper, 'getItems').and.returnValue({});
      const payload = 'History Data';
      const pageIndex = 0;
      const pageSize = 10;
      const transferType = 'TEST';

      const path = getBinToBinHistoryByPaginationEndpointUrl(
        pageIndex,
        pageSize,
        transferType
      ).path;

      binToBinTransferService
        .getHistory(payload, pageIndex, pageSize, transferType)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(dummyHistoryHeaderResponse);
      expect(BinToBinTransferHistoryItemHelper.getItems).toHaveBeenCalledWith(
        dummyHistoryHeaderResponse
      );
    });

    it('should retun data mapped by history helper', () => {
      const result: BinToBinTransferLoadHistoryItemsResponse = {
        items: dummyHistoryHeaderResponse.results,
        count: dummyHistoryHeaderResponse.totalElements
      };

      spyOn(BinToBinTransferHistoryItemHelper, 'getItems').and.returnValue(
        result
      );
      const payload = 'History Data';
      const pageIndex = 0;
      const pageSize = 10;
      const transferType = 'TEST';

      const path = getBinToBinHistoryByPaginationEndpointUrl(
        pageIndex,
        pageSize,
        transferType
      ).path;

      binToBinTransferService
        .getHistory(payload, pageIndex, pageSize, transferType)
        .subscribe(data => {
          expect(data.items).toEqual(result.items);
          expect(data.count).toEqual(result.count);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush({});
    });
  });

  describe('getSelectedHistory', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(
        BinToBinTransferHistoryAdaptor,
        'historyItemFromJson'
      ).and.returnValue({});
      const id = 1122;

      const path = getBinToBinSelectedHistoryUrl(id);

      binToBinTransferService.getSelectedHistory(id).subscribe();

      const request = httpTestingController.expectOne(
        api => api.url === apiUrl + path.path
      );
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      request.flush({});
    });

    it('should call history helper method with correct arguments', () => {
      spyOn(
        BinToBinTransferHistoryAdaptor,
        'historyItemFromJson'
      ).and.returnValue({});
      const id = 1122;

      const path = getBinToBinSelectedHistoryUrl(id);

      binToBinTransferService.getSelectedHistory(id).subscribe();

      const request = httpTestingController.expectOne(
        api => api.url === apiUrl + path.path
      );
      request.flush(dummyHistoryHeader);
      expect(
        BinToBinTransferHistoryAdaptor.historyItemFromJson
      ).toHaveBeenCalledWith(dummyHistoryHeader);
    });

    it('should retun data mapped by history helper', () => {
      const result = dummyHistoryHeader;
      spyOn(
        BinToBinTransferHistoryAdaptor,
        'historyItemFromJson'
      ).and.returnValue(result);
      const id = 1122;

      const path = getBinToBinSelectedHistoryUrl(id);

      binToBinTransferService.getSelectedHistory(id).subscribe(data => {
        expect(data).toEqual(result);
      });

      const request = httpTestingController.expectOne(
        api => api.url === apiUrl + path.path
      );

      request.flush({});
    });
  });
});
