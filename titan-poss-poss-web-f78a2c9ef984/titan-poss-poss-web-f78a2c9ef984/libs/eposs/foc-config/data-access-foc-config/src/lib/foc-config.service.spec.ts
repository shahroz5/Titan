import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
  SchemeDetails,
  FocConfigurationList,
  LoadProductGroupPayload,
  ProductGroupMappingOption,
  SaveProductGroup,
  FocLocationListPayload,
  LocationListSuccessPayload,
  SaveLocationPayload,
  FOCItemCodesPayload,
  FOCItemCodes,
  FocItemsPayload,
  FocItemsResponse,
  FocItemsSavePayload
} from '@poss-web/shared/models';

import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { FocConfigurationAdaptor } from '@poss-web/shared/util-adaptors';
import {
  getFocSchemeBasedSaveUrl,
  getFocSchemeBasedListUrl,
  getFocSchemeBasedConfigByIdGetUrl,
  getWeightRangeUrl,
  getProductGroupsByIdUrl,
  getLocationByIdUrl,
  getUpdateLocationByIdUrl,
  getFocItemCodesUrl,
  getLoadMappedFocItemsUrl,
  getSaveFocItemsUrl,
  getFocSchemeBasedUpdateUrl,
  getFocSchemeBasedSearchUrl,
  getFocSearchUrl
} from '@poss-web/shared/util-api-service';
import { FocConfigService } from './foc-config.service';
describe('FocConfigService', () => {
  let httpTestingController: HttpTestingController;
  const apiUrl = 'http://localhost:3000';
  let focConfigService: FocConfigService;
  const pageIndex = 1;
  const pageSize = 10;
  const dummyFocConfigResponse: SchemeDetails[] = [
    {
      name: 'scheme one',
      description: 'scheme one'
    }
  ];
  const dummyFocConfigListRequestResponse = {
    results: dummyFocConfigResponse,
    pageIndex: 0,
    pageSize: 10,
    totalElements: 10
  };

  const dummyFocConfigResponseFromAdaptor: FocConfigurationList = {
    focConfigList: dummyFocConfigResponse,
    totalElements: '1'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        FocConfigService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    focConfigService = TestBed.inject(FocConfigService);
  });

  it('should be created', () => {
    expect(focConfigService).toBeTruthy();
  });

  describe('getFocConfiguratonList', () => {
    const url = getFocSchemeBasedListUrl(pageIndex, pageSize);
    it('should call GET api method with correct url and params', () => {
      spyOn(FocConfigurationAdaptor, 'getFocConfigurationList').and.returnValue(
        {}
      );

      focConfigService.getFocConfiguratonList(pageIndex, pageSize).subscribe();

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

    it('should call FocConfigurationAdaptor getFocConfigurationList method with correct  parameters', () => {
      spyOn(FocConfigurationAdaptor, 'getFocConfigurationList').and.returnValue(
        {}
      );

      focConfigService.getFocConfiguratonList(pageIndex, pageSize).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush(dummyFocConfigListRequestResponse);
      expect(
        FocConfigurationAdaptor.getFocConfigurationList
      ).toHaveBeenCalledWith(dummyFocConfigListRequestResponse);
    });

    it('should return data mapped by adaptors', () => {
      spyOn(FocConfigurationAdaptor, 'getFocConfigurationList').and.returnValue(
        dummyFocConfigResponseFromAdaptor
      );

      focConfigService
        .getFocConfiguratonList(pageIndex, pageSize)
        .subscribe(data1 => {
          expect(data1).toEqual(dummyFocConfigResponseFromAdaptor);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush({});
    });
  });

  describe('saveFocConfiguration', () => {
    const schemeDetails: SchemeDetails = {
      id: '1',
      clubbingConfigData: {
        data: {
          isExchangeOffer: true,
          isCBO: true,
          isGHS: true,
          isRiva: true,
          isEmpowerment: true,
          isDV: true
        },
        type: 'CLUBBING OFFER'
      },
      description: 'Scheme One',
      grnConfigData: {
        data: {
          noOfDaysBeforeOfferPeriod: '1',
          noOfDaysAfterOfferPeriod: '2',
          utilizationPercent: '3'
        },
        type: 'GRN_CONFIG'
      },
      isActive: true,
      name: 'Scheme One',
      orderConfigData: {
        data: {
          isGoldRateFrozenForCO: true,
          isGoldRateFrozenForAB: true,
          offerPeriodForCO: '1',
          offerPeriodForAB: '2',
          coPercent: '3',
          abPercent: '22'
        },
        type: 'ORDER_CONFIG'
      },
      tepConfigData: {
        data: {
          isEnabled: true,
          tepDetails: [
            {
              durationInDays: '1',
              recoveryPercent: '10'
            }
          ]
        },
        type: 'TEP_CONFIG'
      }
    };
    const path = getFocSchemeBasedSaveUrl();
    it('should call POST api method with correct url and params', () => {
      spyOn(
        FocConfigurationAdaptor,
        'getFocSchemeConfiguration'
      ).and.returnValue({});

      focConfigService.saveFocConfiguration(schemeDetails).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });

    it('should call FocConfigurationAdaptor getFocSchemeConfiguration method with correct  parameters', () => {
      spyOn(
        FocConfigurationAdaptor,
        'getFocSchemeConfiguration'
      ).and.returnValue({});
      focConfigService.saveFocConfiguration(schemeDetails).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(schemeDetails);
      expect(
        FocConfigurationAdaptor.getFocSchemeConfiguration
      ).toHaveBeenCalledWith(schemeDetails);
    });

    it('should return data mapped by adaptors', () => {
      spyOn(
        FocConfigurationAdaptor,
        'getFocSchemeConfiguration'
      ).and.returnValue(schemeDetails);

      focConfigService.saveFocConfiguration(schemeDetails).subscribe(data1 => {
        expect(data1).toEqual(schemeDetails);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });

  describe('updateFocConfiguration', () => {
    const schemeDetails: SchemeDetails = {
      id: '1',
      clubbingConfigData: {
        data: {
          isExchangeOffer: true,
          isCBO: true,
          isGHS: true,
          isRiva: true,
          isEmpowerment: true,
          isDV: true
        },
        type: 'CLUBBING OFFER'
      },
      description: 'Scheme One',
      grnConfigData: {
        data: {
          noOfDaysBeforeOfferPeriod: '1',
          noOfDaysAfterOfferPeriod: '2',
          utilizationPercent: '3'
        },
        type: 'GRN_CONFIG'
      },
      isActive: true,
      name: 'Scheme One',
      orderConfigData: {
        data: {
          isGoldRateFrozenForCO: true,
          isGoldRateFrozenForAB: true,
          offerPeriodForCO: '1',
          offerPeriodForAB: '2',
          coPercent: '3',
          abPercent: '22'
        },
        type: 'ORDER_CONFIG'
      },
      tepConfigData: {
        data: {
          isEnabled: true,
          tepDetails: [
            {
              durationInDays: '1',
              recoveryPercent: '10'
            }
          ]
        },
        type: 'TEP_CONFIG'
      }
    };
    const path = getFocSchemeBasedUpdateUrl('1');
    it('should call POST api method with correct url and params', () => {
      spyOn(
        FocConfigurationAdaptor,
        'getFocSchemeConfiguration'
      ).and.returnValue({});

      focConfigService.updateFocConfiguration(schemeDetails).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });

    it('should call FocConfigurationAdaptor getFocSchemeConfiguration method with correct  parameters', () => {
      spyOn(
        FocConfigurationAdaptor,
        'getFocSchemeConfiguration'
      ).and.returnValue({});
      focConfigService.updateFocConfiguration(schemeDetails).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(schemeDetails);
      expect(
        FocConfigurationAdaptor.getFocSchemeConfiguration
      ).toHaveBeenCalledWith(schemeDetails);
    });

    it('should return data mapped by adaptors', () => {
      spyOn(
        FocConfigurationAdaptor,
        'getFocSchemeConfiguration'
      ).and.returnValue(schemeDetails);

      focConfigService
        .updateFocConfiguration(schemeDetails)
        .subscribe(data1 => {
          expect(data1).toEqual(schemeDetails);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });

  describe('searchConfigBySchemeName', () => {
    const searchValue = 'Scheme One';
    const url = getFocSchemeBasedSearchUrl(searchValue);
    it('should call GET api method with correct url and params', () => {
      spyOn(FocConfigurationAdaptor, 'getFocConfigurationList').and.returnValue(
        {}
      );

      focConfigService.searchConfigBySchemeName(searchValue).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });

    it('should call FocConfigurationAdaptor getFocConfigurationList method with correct  parameters', () => {
      spyOn(FocConfigurationAdaptor, 'getFocConfigurationList').and.returnValue(
        {}
      );

      focConfigService.searchConfigBySchemeName(searchValue).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush(dummyFocConfigListRequestResponse);
      expect(
        FocConfigurationAdaptor.getFocConfigurationList
      ).toHaveBeenCalledWith(dummyFocConfigListRequestResponse);
    });

    it('should return data mapped by adaptors', () => {
      spyOn(FocConfigurationAdaptor, 'getFocConfigurationList').and.returnValue(
        dummyFocConfigResponseFromAdaptor
      );

      focConfigService
        .searchConfigBySchemeName(searchValue)
        .subscribe(data1 => {
          expect(data1).toEqual(dummyFocConfigResponseFromAdaptor);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush({});
    });
  });

  describe('getFocSchemeConfiguration', () => {
    const configId = '1';
    const schemeDetails: SchemeDetails = {
      id: '1',
      clubbingConfigData: {
        data: {
          isExchangeOffer: true,
          isCBO: true,
          isGHS: true,
          isRiva: true,
          isEmpowerment: true,
          isDV: true
        },
        type: 'CLUBBING OFFER'
      },
      description: 'Scheme One',
      grnConfigData: {
        data: {
          noOfDaysBeforeOfferPeriod: '1',
          noOfDaysAfterOfferPeriod: '2',
          utilizationPercent: '3'
        },
        type: 'GRN_CONFIG'
      },
      isActive: true,
      name: 'Scheme One',
      orderConfigData: {
        data: {
          isGoldRateFrozenForCO: true,
          isGoldRateFrozenForAB: true,
          offerPeriodForCO: '1',
          offerPeriodForAB: '2',
          coPercent: '3',
          abPercent: '22'
        },
        type: 'ORDER_CONFIG'
      },
      tepConfigData: {
        data: {
          isEnabled: true,
          tepDetails: [
            {
              durationInDays: '1',
              recoveryPercent: '10'
            }
          ]
        },
        type: 'TEP_CONFIG'
      }
    };
    const url = getFocSchemeBasedConfigByIdGetUrl(configId);
    it('should call POST api method with correct url and params', () => {
      spyOn(
        FocConfigurationAdaptor,
        'getFocSchemeConfiguration'
      ).and.returnValue({});

      focConfigService.getFocSchemeConfiguration(configId).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });

    it('should call FocConfigurationAdaptor getFocSchemeConfiguration method with correct  parameters', () => {
      spyOn(
        FocConfigurationAdaptor,
        'getFocSchemeConfiguration'
      ).and.returnValue({});
      focConfigService.getFocSchemeConfiguration(configId).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush(schemeDetails);
      expect(
        FocConfigurationAdaptor.getFocSchemeConfiguration
      ).toHaveBeenCalledWith(schemeDetails);
    });

    it('should return data mapped by adaptors', () => {
      spyOn(
        FocConfigurationAdaptor,
        'getFocSchemeConfiguration'
      ).and.returnValue(schemeDetails);

      focConfigService.getFocSchemeConfiguration(configId).subscribe(data1 => {
        expect(data1).toEqual(schemeDetails);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush({});
    });
  });

  describe('loadRangeWeight', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(FocConfigurationAdaptor, 'getRangeWeight').and.returnValue({});
      const url = getWeightRangeUrl();
      focConfigService.loadRangeWeight().subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });

    it('should call FocConfigurationAdaptor getRangeWeight method with correct  parameters', () => {
      const payload = {
        results: ['100-200']
      };
      spyOn(FocConfigurationAdaptor, 'getRangeWeight').and.returnValue({});
      focConfigService.loadRangeWeight().subscribe();
      const url = getWeightRangeUrl();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush(payload);
      expect(FocConfigurationAdaptor.getRangeWeight).toHaveBeenCalledWith(
        payload
      );
    });

    it('should return data mapped by adaptors', () => {
      spyOn(FocConfigurationAdaptor, 'getRangeWeight').and.returnValue([
        '100-200'
      ]);
      const url = getWeightRangeUrl();
      focConfigService.loadRangeWeight().subscribe(data1 => {
        expect(data1).toEqual(['100-200']);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush({});
    });
  });

  describe('loadMappedProductGroups', () => {
    const masterId = '1';
    const schemeDetailsId = '2';
    const category = 'GOLD_COIN';
    const itemType = 'Standard';
    const loadProductGroupPayload: LoadProductGroupPayload = {
      masterId: '1',
      schemeDetailsId: '2',
      category: 'GOLD_COIN'
    };
    const url = getProductGroupsByIdUrl(
      itemType,
      category,
      masterId,
      schemeDetailsId
    );
    it('should call GET api method with correct url and params', () => {
      spyOn(FocConfigurationAdaptor, 'getMappedProductGroup').and.returnValue(
        {}
      );

      focConfigService
        .loadMappedProductGroups(loadProductGroupPayload)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
    it('should call FocConfigurationAdaptor getMappedProductGroup method with correct  parameters', () => {
      const res = {
        results: [
          {
            id: '1',
            productGroupCode: '76'
          }
        ]
      };
      spyOn(FocConfigurationAdaptor, 'getMappedProductGroup').and.returnValue(
        {}
      );

      focConfigService
        .loadMappedProductGroups(loadProductGroupPayload)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush(res);
      expect(
        FocConfigurationAdaptor.getMappedProductGroup
      ).toHaveBeenCalledWith(res);
    });

    it('should return data mapped by adaptors', () => {
      const productGroups: ProductGroupMappingOption[] = [
        { id: '76', uuid: '1', description: 'GOLD' }
      ];
      spyOn(FocConfigurationAdaptor, 'getMappedProductGroup').and.returnValue(
        productGroups
      );

      focConfigService
        .loadMappedProductGroups(loadProductGroupPayload)
        .subscribe(data1 => {
          expect(data1).toEqual(productGroups);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush({});
    });
  });

  describe('updateProductGroups', () => {
    const masterId = '1';
    const schemeDetailsId = '2';
    const category = 'GOLD_COIN';
    const itemType = 'Standard';

    const saveProductGroup: SaveProductGroup = {
      masterId: '1',
      schemeDetailsId: '2',
      addProducts: ['76'],
      category: 'GOLD_COIN',
      removeProducts: []
    };
    const url = getProductGroupsByIdUrl(
      itemType,
      category,
      masterId,
      schemeDetailsId
    );
    it('should call PATCH api method with correct url and params', () => {
      spyOn(FocConfigurationAdaptor, 'getMappedProductGroup').and.returnValue(
        {}
      );

      focConfigService.updateProductGroups(saveProductGroup).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
    it('should call FocConfigurationAdaptor getMappedProductGroup method with correct  parameters', () => {
      const res = {
        results: [
          {
            id: '1',
            productGroupCode: '76'
          }
        ]
      };
      spyOn(FocConfigurationAdaptor, 'getMappedProductGroup').and.returnValue(
        {}
      );

      focConfigService.updateProductGroups(saveProductGroup).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush(res);
      expect(
        FocConfigurationAdaptor.getMappedProductGroup
      ).toHaveBeenCalledWith(res);
    });

    it('should return data mapped by adaptors', () => {
      const productGroups: ProductGroupMappingOption[] = [
        { id: '76', uuid: '1', description: 'GOLD' }
      ];
      spyOn(FocConfigurationAdaptor, 'getMappedProductGroup').and.returnValue(
        productGroups
      );

      focConfigService
        .updateProductGroups(saveProductGroup)
        .subscribe(data1 => {
          expect(data1).toEqual(productGroups);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush({});
    });
  });

  describe('loadMappedLocations', () => {
    const focLocationListPayload: FocLocationListPayload = {
      pageSize: 10,
      pageIndex: 1,
      length: 100,
      id: '1'
    };
    const url = getLocationByIdUrl('1', pageIndex, pageSize);
    it('should call GET api method with correct url and params', () => {
      spyOn(FocConfigurationAdaptor, 'getLocationList').and.returnValue({});

      focConfigService.loadMappedLocations(focLocationListPayload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
    it('should call FocConfigurationAdaptor getLocationList method with correct  parameters', () => {
      const res = {
        results: [
          {
            locationCode: 'URB',
            description: 'URB',
            startDate: '1',
            endDate: '2',
            id: '1',
            mobileNo: '1234567890',
            isActive: 'Active',
            subBrandCode: 'MIA'
          }
        ]
      };
      spyOn(FocConfigurationAdaptor, 'getLocationList').and.returnValue({});

      focConfigService.loadMappedLocations(focLocationListPayload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush(res);
      expect(FocConfigurationAdaptor.getLocationList).toHaveBeenCalledWith(res);
    });

    it('should return data mapped by adaptors', () => {
      const locationListSuccessPayload: LocationListSuccessPayload = {
        totalLocations: 100,
        locationList: [
          {
            locationCode: 'URB',
            description: 'URB',
            subBrandCode: 'Mia',
            startDate: '10',
            endDate: '12',
            isActive: 'isActive',
            id: '1'
          }
        ]
      };
      spyOn(FocConfigurationAdaptor, 'getLocationList').and.returnValue(
        locationListSuccessPayload
      );

      focConfigService
        .loadMappedLocations(focLocationListPayload)
        .subscribe(data1 => {
          expect(data1).toEqual(locationListSuccessPayload);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush({});
    });
  });

  describe('updateLocationById', () => {
    const url = getUpdateLocationByIdUrl('1');
    const saveLocationPayload: SaveLocationPayload = {
      id: '1',
      saveLocationPayload: {
        addLocations: ['URB']
      }
    };
    it('should call PATCH api method with correct url and params', () => {
      focConfigService.updateLocationById('1', saveLocationPayload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
  });

  describe('loadFOCItemCodes', () => {
    const fOCItemCodesPayload: FOCItemCodesPayload = {
      excludeProductCategories: [],
      excludeProductGroups: [],
      includeProductCategories: [],
      includeProductGroups: ['74'],
      isFocItem: true
    };
    const url = getFocItemCodesUrl();
    it('should call POST api method with correct url and params', () => {
      spyOn(FocConfigurationAdaptor, 'getFocItemCodes').and.returnValue({});

      focConfigService.loadFOCItemCodes(fOCItemCodesPayload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
    it('should call FocConfigurationAdaptor getFocItemCodes method with correct  parameters', () => {
      const res = {
        results: [
          {
            itemCode: '53FCDS2222AE0',
            stdWeight: '33',
            karat: '22'
          }
        ]
      };
      spyOn(FocConfigurationAdaptor, 'getFocItemCodes').and.returnValue({});

      focConfigService.loadFOCItemCodes(fOCItemCodesPayload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });

      request.flush(res);
      expect(FocConfigurationAdaptor.getFocItemCodes).toHaveBeenCalledWith(res);
    });

    it('should return data mapped by adaptors', () => {
      const fOCItemCodes: FOCItemCodes[] = [
        {
          itemCode: '53FCDS2222AE0',
          stdWeight: 32,
          karat: 22
        }
      ];
      spyOn(FocConfigurationAdaptor, 'getFocItemCodes').and.returnValue(
        fOCItemCodes
      );

      focConfigService
        .loadFOCItemCodes(fOCItemCodesPayload)
        .subscribe(data1 => {
          expect(data1).toEqual(fOCItemCodes);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });

      request.flush({});
    });
  });

  describe('loadMappedFocItems', () => {
    const focItemsPayload: FocItemsPayload = {
      id: '1',
      pageIndex: 1,
      pageSize: 10
    };
    const url = getLoadMappedFocItemsUrl('1', pageIndex, pageSize);
    it('should call GET api method with correct url and params', () => {
      spyOn(FocConfigurationAdaptor, 'getFocMappedItems').and.returnValue({});

      focConfigService.loadMappedFocItems(focItemsPayload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
    it('should call FocConfigurationAdaptor getFocMappedItems method with correct  parameters', () => {
      const res = {
        results: [
          {
            itemCode: '54DDDSSSS22',
            stdWeight: '33',
            karat: '22',
            id: '1'
          }
        ]
      };
      spyOn(FocConfigurationAdaptor, 'getFocMappedItems').and.returnValue({});

      focConfigService.loadMappedFocItems(focItemsPayload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush(res);
      expect(FocConfigurationAdaptor.getFocMappedItems).toHaveBeenCalledWith(
        res
      );
    });

    it('should return data mapped by adaptors', () => {
      const focItemsResponse: FocItemsResponse = {
        items: [
          {
            itemCode: '53FCDS2222AE0',
            stdWeight: 32,
            karat: 22
          }
        ],
        totalElements: 1
      };
      spyOn(FocConfigurationAdaptor, 'getFocMappedItems').and.returnValue(
        focItemsResponse
      );

      focConfigService.loadMappedFocItems(focItemsPayload).subscribe(data1 => {
        expect(data1).toEqual(focItemsResponse);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush({});
    });
  });

  describe('saveFocItems', () => {
    const focItemsSavePayload: FocItemsSavePayload = {
      id: '1',
      savePayload: {
        addItems: [
          {
            itemCode: '53FCDS2222AE0',
            stdWeight: 32,
            karat: 22
          }
        ],
        removeItems: []
      }
    };

    const url = getSaveFocItemsUrl('1');
    it('should call PATCH api method with correct url and params', () => {
      focConfigService.saveFocItems(focItemsSavePayload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
  });

  describe('searchFocItems', () => {
    const searchValue: { configId: string; itemCode: string } = {
      configId: '1',
      itemCode: '5FSCDDCD000'
    };
    const url = getFocSearchUrl(searchValue.configId, searchValue.itemCode);
    it('should call GET api method with correct url and params', () => {
      spyOn(FocConfigurationAdaptor, 'getFocItemCodes').and.returnValue({});

      focConfigService.searchFocItems(searchValue).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
    it('should call FocConfigurationAdaptor getFocItemCodes method with correct  parameters', () => {
      const res = {
        results: [
          {
            itemCode: '5FSCDDCD000',
            stdWeight: '33',
            karat: '22'
          }
        ]
      };
      spyOn(FocConfigurationAdaptor, 'getFocItemCodes').and.returnValue({});

      focConfigService.searchFocItems(searchValue).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush(res);
      expect(FocConfigurationAdaptor.getFocItemCodes).toHaveBeenCalledWith(res);
    });

    it('should return data mapped by adaptors', () => {
      const fOCItemCodes: FOCItemCodes[] = [
        {
          itemCode: '5FSCDDCD000',
          stdWeight: 32,
          karat: 22
        }
      ];
      spyOn(FocConfigurationAdaptor, 'getFocItemCodes').and.returnValue(
        fOCItemCodes
      );

      focConfigService.searchFocItems(searchValue).subscribe(data1 => {
        expect(data1).toEqual(fOCItemCodes);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush({});
    });
  });

  describe('searchLocationCode', () => {
    const searchValue: { configId: string; locationCode: string } = {
      configId: '1',
      locationCode: '5FSCDDCD000'
    };
    const url = getLocationByIdUrl('1', pageIndex, pageSize);
    it('should call GET api method with correct url and params', () => {
      spyOn(FocConfigurationAdaptor, 'getLocationList').and.returnValue({});

      focConfigService.searchLocationCode(searchValue).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
    it('should call FocConfigurationAdaptor getLocationList method with correct  parameters', () => {
      const res = {
        results: [
          {
            locationCode: 'URB',
            description: 'URB',
            startDate: '1',
            endDate: '2',
            id: '1',
            mobileNo: '1234567890',
            isActive: 'Active',
            subBrandCode: 'MIA'
          }
        ]
      };
      spyOn(FocConfigurationAdaptor, 'getLocationList').and.returnValue({});

      focConfigService.searchLocationCode(searchValue).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush(res);
      expect(FocConfigurationAdaptor.getLocationList).toHaveBeenCalledWith(res);
    });

    it('should return data mapped by adaptors', () => {
      const locationListSuccessPayload: LocationListSuccessPayload = {
        totalLocations: 100,
        locationList: [
          {
            locationCode: 'URB',
            description: 'URB',
            subBrandCode: 'Mia',
            startDate: '10',
            endDate: '12',
            isActive: 'isActive',
            id: '1'
          }
        ]
      };
      spyOn(FocConfigurationAdaptor, 'getLocationList').and.returnValue(
        locationListSuccessPayload
      );

      focConfigService.searchLocationCode(searchValue).subscribe(data1 => {
        expect(data1).toEqual(locationListSuccessPayload);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush({});
    });
  });
});
