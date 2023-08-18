import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
  ExcludeItemCodes,
  ExcludeItemCodesPayload,
  ExcludeThemeCodes,
  GepDetails,
  GEPDetailsPayload,
  GEPPurityConfigListPayload,
  GEPPurityConfigResponse,
  Lov,
  MetalType,
  ProductGroupDeduction,
  ProductGroupsDeduction,
  PurityDetailsPayload,
  PurityDetailsResponse,
  Ranges,
  RemoveProductGroupDeduction,
  RemoveThemeCodesPayload
} from '@poss-web/shared/models';
import { GEPPurityConfigurationAdaptor } from '@poss-web/shared/util-adaptors';
import {
  gepProductGroupsDeductionUrl,
  getExcludeItemCodeSearchUrl,
  getExcludeItemCodesUrl,
  getExcludeThemeCodesUrl, getGepDetailsUrl,
  getGepPurityConfigListUrl,
  getGepPurityConfigSearchUrl,
  getMetalTypesUrl,
  getProductGroupsDeductionUrl,
  getPurityDetailsUrl,
  getRangesUrl,
  getSaveGEPPurityDetailsUrl,
  getSaveThemeCodeUrl, getUploadFileUrl
} from '@poss-web/shared/util-api-service';
import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { GEPPurityConfigService } from './gep-purity-config.service';
describe('GEPPurityConfigService', () => {
  let httpTestingController: HttpTestingController;
  const apiUrl = 'http://localhost:3000';
  let gepPurityConfigService: GEPPurityConfigService;
  const gepPurityConfigResponse: GEPPurityConfigResponse = {
    gepPurityConfigList: [
      {
        description: 'Configuration',
        isActive: true,
        type: 'GEP_ITEM'
      }
    ],
    totalElements: 0
  };
  const dummyGEPPurityConfigList = {
    results: gepPurityConfigResponse.gepPurityConfigList,
    pageIndex: 0,
    pageSize: 10,
    totalElements: 10
  };
  const metalType: MetalType[] = [
    {
      materialTypeCode: 'M',
      description: 'material'
    }
  ];
  const itemTypes: Lov[] = [
    {
      code: 'M',
      value: 'material',
      isActive: true
    }
  ];
  const range: Ranges[] = [
    {
      fromRange: 12,
      toRange: 20,
      range: '100',
      id: 'abc12',
      isActive: true
    }
  ];
  const saveGEPDetails: GEPDetailsPayload = {
    gepConfiguration: {
      description: 'Configuration',
      isActive: true
    },
    gepDetails: {
      offerDetails: {
        gepCNUtilizationPercentage: 12,
        gepDiscountStartDate: 12,
        gepDiscountEndDate: 12,
        daysForGEPCNAfterOffer: 12,
        daysForGRNAndRebillingAfterOffer: 12,
        grnCNUtilizationPercentage: 12,
        isRivaah: true
      },
      configDetails: {
        gepDaysAfterCOOffer: 12,
        gepDaysAfterABOffer: 12,
        minKaratAccepted: 12,
        gepDiscountDeductionAmt: true,
        gepAsPayment: true,
        baseKaratForPurity: 12,
        holdTime: 12,
        isPreMeltingDetailsMandatory: true
      },
      description: 'Configuration',
      isActive: true,
      isOfferEnabled: true
    },

    configId: '123'
  };
  const dummyMetalTypes = {
    results: metalType,
    pageIndex: 0,
    pageSize: 10,
    totalElements: 10
  };
  const dummyRanges = {
    results: range,
    pageIndex: 0,
    pageSize: 10,
    totalElements: 10
  };
  const gepPuirtyConfig = [
    {
      description: 'GEP',
      isActive: true,
      configId: 'abc123',
      createdDate: '28-08-1997'
    }
  ];
  const productGroupsDeduction: ProductGroupsDeduction[] = [
    {
      id: 'abc123',
      productGroupCode: '123',
      rangeId: '123',
      percentValue: '100',
      configId: 'abc123',
      rivaahAdditionalDiscount: '12'
    }
  ];
  const dummyProductGroupDeduction = {
    results: productGroupsDeduction,
    pageIndex: 0,
    pageSize: 10,
    totalElements: 10
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        GEPPurityConfigService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    gepPurityConfigService = TestBed.inject(GEPPurityConfigService);
  });
  it('should be created', () => {
    expect(gepPurityConfigService).toBeTruthy();
  });
  describe('getGEPPurityConfigList', () => {
    const payload: GEPPurityConfigListPayload = {
      pageIndex: 0,
      pageSize: 100,
      type: 'GEP_ITEM',
      description: 'Configuration'
    };
    it('should call GET api method with correct url and params', () => {
      spyOn(
        GEPPurityConfigurationAdaptor,
        'getGepPurityConfigList'
      ).and.returnValue({});

      const { path, params } = getGepPurityConfigListUrl(
        payload.pageIndex,
        payload.pageSize,
        payload.type,
        payload.description,
      );

      gepPurityConfigService.getGEPPurityConfigList(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('page').toString()).toEqual(
        payload.pageIndex.toString()
      );
      expect(request.request.params.get('size').toString()).toEqual(
        payload.pageSize.toString()
      );
      expect(request.request.params.get('configType').toString()).toEqual(
        'GEP_ITEM'
      );
      expect(request.request.params.get('sort').toString()).toEqual(
        'createdDate,desc'
      );
      request.flush({});
    });

    it('should call GEPPurityConfigAdaptor getGepPurityConfigList method with correct  parameters', () => {
      spyOn(
        GEPPurityConfigurationAdaptor,
        'getGepPurityConfigList'
      ).and.returnValue({});

      const { path, params } = getGepPurityConfigListUrl(
        payload.pageIndex,
        payload.pageSize,
        payload.type,
        payload.description
      );

      gepPurityConfigService.getGEPPurityConfigList(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush(dummyGEPPurityConfigList);
      expect(
        GEPPurityConfigurationAdaptor.getGepPurityConfigList
      ).toHaveBeenCalledWith(dummyGEPPurityConfigList);
    });

    it('should return data mapped by adaptors', () => {
      spyOn(
        GEPPurityConfigurationAdaptor,
        'getGepPurityConfigList'
      ).and.returnValue({
        gepPurityConfigList: gepPurityConfigResponse.gepPurityConfigList,
        totalElements: 1
      });

      const path = getGepPurityConfigListUrl(
        payload.pageIndex,
        payload.pageSize,
        payload.type,
        payload.description
      ).path;

      gepPurityConfigService.getGEPPurityConfigList(payload).subscribe(data => {
        expect(data).toEqual({
          gepPurityConfigList: gepPurityConfigResponse.gepPurityConfigList,
          totalElements: 1
        });
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });
  describe('searchConfigName', () => {
    const searchPayload = {
      configName: 'Configuration',
      type: 'GEP_ITEM'
    };
    it('should call GET api method with correct url and params', () => {
      spyOn(
        GEPPurityConfigurationAdaptor,
        'getGepPurityConfigSearch'
      ).and.returnValue({});

      const { path, params } = getGepPurityConfigSearchUrl(
        searchPayload.configName,
        searchPayload.type
      );

      gepPurityConfigService.searchConfigName(searchPayload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('configType').toString()).toEqual(
        'GEP_ITEM'
      );
      expect(request.request.params.get('description').toString()).toEqual(
        'Configuration'
      );
      request.flush({});
    });

    it('should call GEPPurityConfigurationAdaptor getGepPurityConfigSearch method with correct  parameters', () => {
      spyOn(
        GEPPurityConfigurationAdaptor,
        'getGepPurityConfigSearch'
      ).and.returnValue({});

      const path = getGepPurityConfigSearchUrl(
        searchPayload.configName,
        searchPayload.type
      ).path;

      gepPurityConfigService.searchConfigName(searchPayload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush(dummyGEPPurityConfigList);
      expect(
        GEPPurityConfigurationAdaptor.getGepPurityConfigSearch
      ).toHaveBeenCalledWith(dummyGEPPurityConfigList);
    });

    it('should return data mapped by adaptors', () => {
      const searchConfigName = {
        description: 'ABC',
        isActive: true,
        configId: 'abc123',
        createdDate: '28-08-1997'
      };
      spyOn(
        GEPPurityConfigurationAdaptor,
        'getGepPurityConfigSearch'
      ).and.returnValue([searchConfigName]);

      const path = getGepPurityConfigSearchUrl(
        searchPayload.configName,
        searchPayload.type
      ).path;

      gepPurityConfigService.searchConfigName(searchPayload).subscribe(data => {
        expect(data).toEqual([searchConfigName]);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });
  describe('loadMetalTypes', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(GEPPurityConfigurationAdaptor, 'getMetalTypes').and.returnValue({});

      const { path, params } = getMetalTypesUrl();

      gepPurityConfigService.loadMetalTypes().subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('itemGroups').toString()).toEqual(
        'metal'
      );
      request.flush({});
    });

    it('should call GEPPurityConfigurationAdaptor getMetalTypes method with correct  parameters', () => {
      spyOn(GEPPurityConfigurationAdaptor, 'getMetalTypes').and.returnValue({});

      const path = getMetalTypesUrl().path;

      gepPurityConfigService.loadMetalTypes().subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush(dummyMetalTypes);
      expect(GEPPurityConfigurationAdaptor.getMetalTypes).toHaveBeenCalledWith(
        dummyMetalTypes
      );
    });

    it('should return data mapped by adaptors', () => {
      spyOn(GEPPurityConfigurationAdaptor, 'getMetalTypes').and.returnValue(
        metalType
      );

      const path = getMetalTypesUrl().path;

      gepPurityConfigService.loadMetalTypes().subscribe(data => {
        expect(data).toEqual(metalType);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });

  describe('loadRanges', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(GEPPurityConfigurationAdaptor, 'getRanges').and.returnValue({});

      const { path, params } = getRangesUrl('GEP_GOLD_PURITY');

      gepPurityConfigService.loadRanges('GEP_GOLD_PURITY').subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('rangeType').toString()).toEqual(
        'GEP_GOLD_PURITY'
      );
      expect(request.request.params.get('isActive').toString()).toEqual('true');
      expect(request.request.params.get('isPageable').toString()).toEqual(
        'false'
      );
      request.flush({});
    });

    it('should call GEPPurityConfigurationAdaptor getRanges method with correct  parameters', () => {
      spyOn(GEPPurityConfigurationAdaptor, 'getRanges').and.returnValue({});

      const path = getRangesUrl('GEP_GOLD_PURITY').path;

      gepPurityConfigService.loadRanges('GEP_GOLD_PURITY').subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush(dummyRanges);
      expect(GEPPurityConfigurationAdaptor.getRanges).toHaveBeenCalledWith(
        dummyRanges
      );
    });

    it('should return data mapped by adaptors', () => {
      spyOn(GEPPurityConfigurationAdaptor, 'getRanges').and.returnValue(range);

      const path = getRangesUrl('GEP_GOLD_PURITY').path;

      gepPurityConfigService.loadRanges('GEP_GOLD_PURITY').subscribe(data => {
        expect(data).toEqual(range);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });

  describe('getExcludeThemeCodes', () => {
    const excludeThemeCodes: ExcludeThemeCodes[] = [
      {
        configId: 'abc123',
        id: '12',
        isActive: true,
        themeCode: '1'
      }
    ];
    const dummyExcludeThemeCodes = {
      results: excludeThemeCodes,
      pageIndex: 0,
      pageSize: 10,
      totalElements: 10
    };
    it('should call GET api method with correct url and params', () => {
      spyOn(GEPPurityConfigurationAdaptor, 'excludeThemeCodes').and.returnValue(
        {}
      );

      const { path, params } = getExcludeThemeCodesUrl('abc123', 'GEP_ITEM');

      gepPurityConfigService.getExcludeThemeCodes('abc123').subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('configType').toString()).toEqual(
        'GEP_ITEM'
      );
      expect(request.request.params.get('isTheme').toString()).toEqual('true');
      request.flush({});
    });

    it('should call GEPPurityConfigurationAdaptor excludeThemeCodes method with correct  parameters', () => {
      spyOn(GEPPurityConfigurationAdaptor, 'excludeThemeCodes').and.returnValue(
        {}
      );

      const path = getExcludeThemeCodesUrl('abc123', 'GEP_ITEM').path;

      gepPurityConfigService.getExcludeThemeCodes('abc123').subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush(dummyExcludeThemeCodes);
      expect(
        GEPPurityConfigurationAdaptor.excludeThemeCodes
      ).toHaveBeenCalledWith(dummyExcludeThemeCodes);
    });

    it('should return data mapped by adaptors', () => {
      spyOn(GEPPurityConfigurationAdaptor, 'excludeThemeCodes').and.returnValue(
        excludeThemeCodes
      );

      const path = getExcludeThemeCodesUrl('abc123', 'GEP_ITEM').path;

      gepPurityConfigService.getExcludeThemeCodes('abc123').subscribe(data => {
        expect(data).toEqual(excludeThemeCodes);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });

  describe('getExcludeItemCodes', () => {
    const excludeItemCodes: ExcludeItemCodes[] = [
      {
        configId: 'abc123',
        id: '12',
        isActive: true,
        itemCode: '1'
      }
    ];
    const dummyExcludeItemCodes = {
      results: excludeItemCodes,
      pageIndex: 0,
      pageSize: 10,
      totalElements: 10
    };
    it('should call GET api method with correct url and params', () => {
      spyOn(GEPPurityConfigurationAdaptor, 'excludeItemCodes').and.returnValue(
        {}
      );

      const { path, params } = getExcludeItemCodesUrl(
        'abc123',
        1,
        100,
        'GEP_ITEM'
      );

      gepPurityConfigService
        .getExcludeItemCodes({
          configId: 'abc123',
          pageIndex: 1,
          pageSize: 100
        })
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('configType').toString()).toEqual(
        'GEP_ITEM'
      );
      expect(request.request.params.get('isTheme').toString()).toEqual('false');
      expect(request.request.params.get('page').toString()).toEqual('1');
      expect(request.request.params.get('size').toString()).toEqual('100');
      expect(request.request.params.get('sort').toString()).toEqual(
        'createdDate,desc'
      );
      request.flush({});
    });

    it('should call GEPPurityConfigurationAdaptor excludeItemCodes method with correct  parameters', () => {
      spyOn(GEPPurityConfigurationAdaptor, 'excludeItemCodes').and.returnValue(
        {}
      );

      const path = getExcludeItemCodesUrl('abc123', 1, 100, 'GEP_ITEM').path;

      gepPurityConfigService
        .getExcludeItemCodes({
          configId: 'abc123',
          pageIndex: 1,
          pageSize: 100
        })
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush(dummyExcludeItemCodes);
      expect(
        GEPPurityConfigurationAdaptor.excludeItemCodes
      ).toHaveBeenCalledWith(dummyExcludeItemCodes);
    });

    it('should return data mapped by adaptors', () => {
      spyOn(GEPPurityConfigurationAdaptor, 'excludeItemCodes').and.returnValue({
        itemCodes: excludeItemCodes,
        totalElements: 1
      });

      const path = getExcludeItemCodesUrl('abc123', 1, 100, 'GEP_ITEM').path;

      gepPurityConfigService
        .getExcludeItemCodes({
          configId: 'abc123',
          pageIndex: 1,
          pageSize: 100
        })
        .subscribe(data => {
          expect(data).toEqual({
            itemCodes: excludeItemCodes,
            totalElements: 1
          });
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });

  describe('searchItemCode', () => {
    const excludeItemCodes: ExcludeItemCodes[] = [
      {
        configId: 'abc123',
        id: '12',
        isActive: true,
        itemCode: '1'
      }
    ];
    const dummyExcludeItemCodes = {
      results: excludeItemCodes,
      pageIndex: 0,
      pageSize: 10,
      totalElements: 10
    };

    it('should call GET api method with correct url and params', () => {
      spyOn(
        GEPPurityConfigurationAdaptor,
        'searchExcludeItemCode'
      ).and.returnValue({});

      const { path, params } = getExcludeItemCodeSearchUrl(
        'abc123',
        'item123',
        'GEP_ITEM'
      );

      gepPurityConfigService
        .searchItemCode({
          configId: 'abc123',
          itemCode: 'item123'
        })
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('configType').toString()).toEqual(
        'GEP_ITEM'
      );
      expect(request.request.params.get('isTheme').toString()).toEqual('false');
      expect(request.request.params.get('itemCode').toString()).toEqual(
        'item123'
      );
      request.flush({});
    });

    it('should call GEPPurityConfigurationAdaptor searchExcludeItemCode method with correct  parameters', () => {
      spyOn(
        GEPPurityConfigurationAdaptor,
        'searchExcludeItemCode'
      ).and.returnValue({});

      const { path, params } = getExcludeItemCodeSearchUrl(
        'abc123',
        'item123',
        'GEP_ITEM'
      );

      gepPurityConfigService
        .searchItemCode({
          configId: 'abc123',
          itemCode: 'item123'
        })
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush(dummyExcludeItemCodes);
      expect(
        GEPPurityConfigurationAdaptor.searchExcludeItemCode
      ).toHaveBeenCalledWith(dummyExcludeItemCodes);
    });

    it('should return data mapped by adaptors', () => {
      spyOn(
        GEPPurityConfigurationAdaptor,
        'searchExcludeItemCode'
      ).and.returnValue(excludeItemCodes);

      const { path, params } = getExcludeItemCodeSearchUrl(
        'abc123',
        'item123',
        'GEP_ITEM'
      );

      gepPurityConfigService
        .searchItemCode({
          configId: 'abc123',
          itemCode: 'item123'
        })

        .subscribe(data => {
          expect(data).toEqual(excludeItemCodes);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });

  describe('loadProductGroupsDeduction', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(
        GEPPurityConfigurationAdaptor,
        'getDeductionRanges'
      ).and.returnValue({});

      const { path, params } = gepProductGroupsDeductionUrl(
        'abc123',
        0,
        2147483647,
        'GEP_ITEM'
      );

      gepPurityConfigService
        .loadProductGroupsDeduction({
          configId: 'abc123',
          pageIndex: 0,
          pageSize: 2147483647
        })
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('page').toString()).toEqual('0');
      expect(request.request.params.get('size').toString()).toEqual(
        '2147483647'
      );
      expect(request.request.params.get('configType').toString()).toEqual(
        'GEP_ITEM'
      );
      request.flush({});
    });

    it('should call GEPPurityConfigurationAdaptor getDeductionRanges method with correct  parameters', () => {
      spyOn(
        GEPPurityConfigurationAdaptor,
        'getDeductionRanges'
      ).and.returnValue({});

      const path = gepProductGroupsDeductionUrl('abc123', 0, 10, 'GEP_ITEM')
        .path;

      gepPurityConfigService
        .loadProductGroupsDeduction({
          configId: 'abc123',
          pageIndex: 0,
          pageSize: 10
        })
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush(dummyProductGroupDeduction);
      expect(
        GEPPurityConfigurationAdaptor.getDeductionRanges
      ).toHaveBeenCalledWith(dummyProductGroupDeduction);
    });

    it('should return data mapped by adaptors', () => {
      spyOn(
        GEPPurityConfigurationAdaptor,
        'getDeductionRanges'
      ).and.returnValue({
        productGroupsDeduction: productGroupsDeduction,
        count: 0
      });

      const path = gepProductGroupsDeductionUrl('abc123', 0, 10, 'GEP_ITEM')
        .path;

      gepPurityConfigService
        .loadProductGroupsDeduction({
          configId: 'abc123',
          pageIndex: 0,
          pageSize: 10
        })

        .subscribe(data => {
          expect(data).toEqual({
            productGroupsDeduction: productGroupsDeduction,
            count: 0
          });
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });
  describe('deleteThemeCode', () => {
    const removeThemeCodes: RemoveThemeCodesPayload = {
      configId: 'abc123',
      deleteThemeCode: {
        addThemes: [],
        removeThemes: ['1']
      }
    };
    it('should call GET api method with correct url and params', () => {
      const { path, params } = getSaveThemeCodeUrl('abc123', 'GEP_ITEM');

      gepPurityConfigService.deleteThemeCode(removeThemeCodes).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('configType').toString()).toEqual(
        'GEP_ITEM'
      );
      request.flush({});
    });
  });

  describe('getGepPurityDetails', () => {
    const purityDetailsResponse: PurityDetailsResponse[] = [
      {
        rangeId: 'abc123',
        deductionPercent: 100,
        schemePercent: 100,
        startDate: 600000,
        endDate: 5555555,
        metalType: 'metal',
        itemType: 'item',
        id: 'abc123',
        configId: 'abc123'
      }
    ];
    const response: PurityDetailsResponse[] = [
      {
        rangeId: 'abc123',
        deductionPercent: 100,
        schemePercent: 100,
        startDate: 600000,
        endDate: 5555555,
        metalType: 'metal',
        itemType: 'item',
        id: 'abc123',
        configId: 'abc123'
      }
    ];
    const dummyGepPurityConfigPurityDetailsResponse = {
      results: purityDetailsResponse
    };
    it('should call GET api method with correct url and params', () => {
      spyOn(GEPPurityConfigurationAdaptor, 'getPurityDetails').and.returnValue(
        {}
      );

      const { path, params } = getPurityDetailsUrl('abc123', 'GEP_ITEM');

      gepPurityConfigService.getGepPurityDetails('abc123').subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('configType').toString()).toEqual(
        'GEP_ITEM'
      );
      request.flush({});
    });

    it('should call GEPPurityConfigurationAdaptor getPurityDetails method with correct  parameters', () => {
      spyOn(GEPPurityConfigurationAdaptor, 'getPurityDetails').and.returnValue(
        {}
      );

      const path = getPurityDetailsUrl('abc123', 'GEP_ITEM').path;

      gepPurityConfigService.getGepPurityDetails('abc123').subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush(dummyGepPurityConfigPurityDetailsResponse);
      expect(
        GEPPurityConfigurationAdaptor.getPurityDetails
      ).toHaveBeenCalledWith(dummyGepPurityConfigPurityDetailsResponse);
    });

    it('should return data mapped by adaptors', () => {
      spyOn(GEPPurityConfigurationAdaptor, 'getPurityDetails').and.returnValue(
        response
      );

      const path = getPurityDetailsUrl('abc123', 'GEP_ITEM').path;

      gepPurityConfigService
        .getGepPurityDetails('abc123')

        .subscribe(data => {
          expect(data).toEqual(response);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });

  describe('getGepDetails', () => {
    const gepDetails = {
      description: 'Configuration',
      isActive: true,

      offerDetails: {
        gepCNUtilizationPercentage: 12,
        gepDiscountStartDate: 12,
        gepDiscountEndDate: 12,
        daysForGEPCNAfterOffer: 12,
        daysForGRNAndRebillingAfterOffer: 12,
        grnCNUtilizationPercentage: 12
      },
      configDetails: {
        gepDaysAfterCOOffer: 12,
        gepDaysAfterABOffer: 12,
        minKaratAccepted: 12,
        gepDiscountDeductionAmt: true,
        gepAsPayment: true,
        baseKaratForPurity: 12,
        holdTime: 12,
        isPreMeltingDetailsMandatory: true
      },
      isOfferEnabled: true,

      configId: '123'
    };
    const gepDetailsResponse: GepDetails = {
      offerDetails: {
        gepCNUtilizationPercentage: 12,
        gepDiscountStartDate: 12,
        gepDiscountEndDate: 12,
        daysForGEPCNAfterOffer: 12,
        daysForGRNAndRebillingAfterOffer: 12,
        grnCNUtilizationPercentage: 12,
        isRivaah: true
      },
      configDetails: {
        gepDaysAfterCOOffer: 12,
        gepDaysAfterABOffer: 12,
        minKaratAccepted: 12,
        gepDiscountDeductionAmt: true,
        gepAsPayment: true,
        baseKaratForPurity: 12,
        holdTime: 12,
        isPreMeltingDetailsMandatory: true
      },
      description: 'Configuration',
      isActive: true,
      isOfferEnabled: true,
      configId: '123'
    };
    it('should call GET api method with correct url and params', () => {
      spyOn(GEPPurityConfigurationAdaptor, 'getGepDetails').and.returnValue({});

      const { path, params } = getGepDetailsUrl('abc123', 'GEP_ITEM');

      gepPurityConfigService.getGepDetails('abc123').subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('configType').toString()).toEqual(
        'GEP_ITEM'
      );
      request.flush({});
    });

    it('should call GEPPurityConfigurationAdaptor getGepDetails method with correct  parameters', () => {
      spyOn(GEPPurityConfigurationAdaptor, 'getGepDetails').and.returnValue({});

      const path = getGepDetailsUrl('abc123', 'GEP_ITEM').path;

      gepPurityConfigService.getGepDetails('abc123').subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush(gepDetails);
      expect(GEPPurityConfigurationAdaptor.getGepDetails).toHaveBeenCalledWith(
        gepDetails
      );
    });

    it('should return data mapped by adaptors', () => {
      spyOn(GEPPurityConfigurationAdaptor, 'getGepDetails').and.returnValue(
        gepDetailsResponse
      );

      const path = getGepDetailsUrl('abc123', 'GEP_ITEM').path;

      gepPurityConfigService
        .getGepDetails('abc123')

        .subscribe(data => {
          expect(data).toEqual(gepDetailsResponse);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });
  describe('removeProductGroup', () => {
    const removeProductGroups: RemoveProductGroupDeduction = {
      configId: 'abc123',
      deleteProductGroup: {
        addProductGroups: [],
        addRanges: [
          {
            rangeId: 'abc123',
            percentValue: 100
          }
        ],
        removeProductGroups: ['71']
      }
    };
    it('should call GET api method with correct url and params', () => {
      const { path, params } = getProductGroupsDeductionUrl(
        'abc123',
        'GEP_ITEM'
      );

      gepPurityConfigService
        .removeProductGroup(removeProductGroups)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('configType').toString()).toEqual(
        'GEP_ITEM'
      );
      request.flush({});
    });
  });
  describe('searchProductGroup', () => {
    const searchPayload = {
      searchValue: 'Configuration',
      configId: 'abc123'
    };
    // it('should call GET api method with correct url and params', () => {
    //   spyOn(
    //     GEPPurityConfigurationAdaptor,
    //     'getDeductionRanges'
    //   ).and.returnValue({});

    //   const { path, params } = getSearchProductGroupUrl(
    //     'abc123',
    //     'Configuration',
    //     'GEP_ITEM'
    //   );

    //   gepPurityConfigService.searchProductGroup(searchPayload).subscribe();

    //   const request = httpTestingController.expectOne(req => {
    //     return req.url === apiUrl + path;
    //   });
    //   expect(request.cancelled).toBeFalsy();
    //   expect(request.request.method).toEqual('GET');
    //   expect(request.request.responseType).toEqual('json');
    //   expect(request.request.params.get('configType').toString()).toEqual(
    //     'GEP_ITEM'
    //   );
    //   expect(request.request.params.get('productGroup').toString()).toEqual(
    //     'Configuration'
    //   );
    //   request.flush({});
    // });

    // it('should call GEPPurityConfigurationAdaptor getDeductionRanges method with correct  parameters', () => {
    //   spyOn(
    //     GEPPurityConfigurationAdaptor,
    //     'searchProductGroups'
    //   ).and.returnValue({});

    //   const path = getSearchProductGroupUrl(
    //     'abc123',
    //     'Configuration',
    //     'GEP_ITEM'
    //   ).path;

    //   gepPurityConfigService.searchProductGroup(searchPayload).subscribe();

    //   const request = httpTestingController.expectOne(req => {
    //     return req.url === apiUrl + path;
    //   });
    //   request.flush(dummyProductGroupDeduction);
    //   expect(
    //     GEPPurityConfigurationAdaptor.searchProductGroups
    //   ).toHaveBeenCalledWith(dummyProductGroupDeduction);
    // });

    // it('should return data mapped by adaptors', () => {
    //   spyOn(
    //     GEPPurityConfigurationAdaptor,
    //     'getDeductionRanges'
    //   ).and.returnValue(productGroupsDeduction);

    //   const path = getSearchProductGroupUrl(
    //     'abc123',
    //     'Configuration',
    //     'GEP_ITEM'
    //   ).path;

    //   gepPurityConfigService
    //     .searchProductGroup(searchPayload)

    //     .subscribe(data => {
    //       expect(data).toEqual(productGroupsDeduction);
    //     });

    //   const request = httpTestingController.expectOne(req => {
    //     return req.url === apiUrl + path;
    //   });

    //   request.flush({});
    // });
  });
  describe('saveGEPDetails', () => {
    // it('should call GET api method with correct url and params', () => {
    //   spyOn(GEPPurityConfigurationAdaptor, 'getGepDetails').and.returnValue({});
    //   const { path, params } = getSaveGEPPurityDetailsUrl(
    //     saveGEPDetails.configId,
    //     'GEP_ITEM'
    //   );
    //   gepPurityConfigService.saveGEPDetails(saveGEPDetails).subscribe();
    //   const request = httpTestingController.expectOne(req => {
    //     return req.url === apiUrl + path;
    //   });
    //   expect(request.cancelled).toBeFalsy();
    //   expect(request.request.method).toEqual('PATCH');
    //   expect(request.request.responseType).toEqual('json');
    //   expect(request.request.params.toString()).toEqual(params.toString());
    //   expect(request.request.params.get('configType').toString()).toEqual(
    //     'GEP_ITEM'
    //   );
    //   request.flush({});
    // });
  });
  describe('savePurityDetails', () => {
    const savePurityDetails: PurityDetailsPayload = {
      configuration: {
        description: 'Configuration',
        isActive: true
      },
      purityDetails: {
        addConfigDetails: [
          {
            deductionPercent: 12,
            endDate: 16000000,
            itemType: 'item',
            metalType: 'metal',
            rangeId: '123',
            schemePercent: 100,
            startDate: 1600000,
            id: 'abc123'
          }
        ],
        removeConfigDetails: [],
        updateConfigDetails: [
          {
            deductionPercent: 12,
            endDate: 16000000,
            itemType: 'item',
            metalType: 'metal',
            rangeId: '123',
            schemePercent: 100,
            startDate: 1600000,
            id: 'abc123'
          }
        ]
      },
      configId: 'abc123'
    };
    it('should call GET api method with correct url and params', () => {
      spyOn(GEPPurityConfigurationAdaptor, 'getPurityDetails').and.returnValue(
        {}
      );

      const { path, params } = getSaveGEPPurityDetailsUrl(
        savePurityDetails.configId,
        'GEP_ITEM'
      );

      gepPurityConfigService.savePurityDetails(savePurityDetails).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.toString()).toEqual(params.toString());
      expect(request.request.params.get('configType').toString()).toEqual(
        'GEP_ITEM'
      );
      request.flush({});
    });
  });
  describe('uploadFile', () => {
    const uploadFile: ExcludeItemCodesPayload = {
      gepConfiguration: {
        description: 'Configuration',
        isActive: true,
        type: 'GEP_ITEM'
      },
      uploadPayload: {
        configId: 'abc123',
        type: 'ITEM_GROUP',
        formData: null
      }
    };
    it('should call GET api method with correct url and params', () => {
      spyOn(
        GEPPurityConfigurationAdaptor,
        'getUploadFileResponse'
      ).and.returnValue({});

      const { path, params } = getUploadFileUrl(
        uploadFile.uploadPayload.type,
        'abc123'
      );

      gepPurityConfigService.uploadFile(uploadFile).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('fileGroup').toString()).toEqual(
        'ITEM_GROUP'
      );
      expect(request.request.params.get('param').toString()).toEqual('abc123');
      request.flush({});
    });
  });
  describe('productsGroupsDeduction', () => {
    const saveProductGroupsDeduction: ProductGroupDeduction = {
      config: {
        description: 'Configuration',
        isActive: true
      },
      productGroups: {
        addProductGroups: [{ productGroupCode: '71', configDetails: {} }],
        addRanges: [
          {
            rangeId: 'abc123',
            percentValue: 100
          }
        ],
        removeProductGroups: []
      },
      configId: 'abc123'
    };
    // it('should call GET api method with correct url and params', () => {
    //   const path = getProductGroupsDeductionUrl('abc123', 'GEP_ITEM');

    //   gepPurityConfigService
    //     .productsGroupsDeduction(saveProductGroupsDeduction)
    //     .subscribe();

    //   const request = httpTestingController.expectOne(req => {
    //     return req.url === apiUrl + path;
    //   });
    //   expect(request.cancelled).toBeFalsy();
    //   expect(request.request.method).toEqual('PATCH');
    //   expect(request.request.responseType).toEqual('json');
    //   expect(request.request.urlWithParams).toEqual(apiUrl + path);
    //   request.flush({});
    // });
  });
  // describe('saveThemeCodes', () => {
  //   const saveThemeCodesPayload: SaveThemeCodesPayload = {
  //     saveThemeCodes: {
  //       addThemes: ['1'],
  //       removeThemes: ['2']
  //     },
  //     config: {
  //       description: 'Configuration',
  //       isActive: true
  //     },
  //     configId: 'abc123'
  //   };
  //   it('should call GET api method with correct url and params', () => {
  //     const path = getSaveThemeCodeUrl(
  //       'abc123',
  //       saveThemeCodesPayload.config.type
  //     );

  //     gepPurityConfigService.saveThemeCodes(saveThemeCodesPayload).subscribe();

  //     const request = httpTestingController.expectOne(req => {
  //       return req.url === apiUrl + path;
  //     });
  //     expect(request.cancelled).toBeFalsy();
  //     expect(request.request.method).toEqual('PATCH');
  //     expect(request.request.responseType).toEqual('json');
  //     expect(request.request.urlWithParams).toEqual(apiUrl + path);
  //     request.flush({});
  //   });
  // });
});
