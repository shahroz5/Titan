import {
  ProductCategoryMapping,
  ProductCategoryMappingList
} from '@poss-web/shared/models';
import { CutPieceConfigService } from './cut-piece-config.service';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { CutPieceConfigAdaptor } from '@poss-web/shared/util-adaptors';
import {
  getCutPieceConfigListUrl,
  getProductCategoriesMappingListUrl,
  getProductCategoriesMappingUrl,
  getProductCategorySearchUrl
} from '@poss-web/shared/util-api-service';

describe('CutPieceConfigService', () => {
  const searchResponse: ProductCategoryMappingList[] = [
    {
      cutPieceTepPercent: 12,
      productCategoryCode: 'A',
      id: 'abc123',
      description: 'abc123'
    }
  ];
  const savePayload: ProductCategoryMapping = {
    payload: {
      addProductCategories: ['I'],
      updateProductCategories: [],
      removeProductCategories: []
    },
    configId: 'abc123'
  };

  const productCategories = [
    {
      productCategoryCode: 'I',
      description: 'Product Category',
      isActive: true
    }
  ];
  const listPaload = { configId: 'abc123', pageIndex: 0, pageSize: 20 };
  let httpTestingController: HttpTestingController;
  const apiUrl = 'http://localhost:3000';
  let cutPieceConfigService: CutPieceConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CutPieceConfigService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    cutPieceConfigService = TestBed.inject(CutPieceConfigService);
  });
  it('should be created', () => {
    expect(cutPieceConfigService).toBeTruthy();
  });

  describe('loadCutPieceConfig', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(CutPieceConfigAdaptor, 'getConfigId').and.returnValue({});

      const { path, params } = getCutPieceConfigListUrl();

      cutPieceConfigService.loadCutPieceConfig().subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('configType')).toEqual('TEP_CUT_PIECE');
      //expect(request.request.urlWithParams).toEqual(apiUrl + path);
      request.flush({});
    });

    it('should call CutPieceConfigAdaptor getConfigId method with correct  parameters', () => {
      const dummyCutPieceConfigs = [
        {
          results: [
            {
              description: 'CUT PIECE CONFIG',
              isActive: true,
              offerDetails: {
                type: null,
                data: null
              },
              configDetails: {
                type: null,
                data: null
              },
              isOfferEnabled: null,
              itemCode: null,
              startDate: null,
              endDate: null,
              customerMobileNos: [],
              configId: 'B4C9A3CD-F0F6-4F1E-B506-8013CA9D0FFB',
              configType: 'CUT_PIECE_TEP',
              createdDate: 1613712247070
            }
          ],
          totalElements: 1
        }
      ];
      spyOn(CutPieceConfigAdaptor, 'getConfigId').and.returnValue({});

      const { path, params } = getCutPieceConfigListUrl();

      cutPieceConfigService.loadCutPieceConfig().subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush(dummyCutPieceConfigs);
      expect(CutPieceConfigAdaptor.getConfigId).toHaveBeenCalledWith(
        dummyCutPieceConfigs
      );
    });

    it('should return data mapped by adaptors', () => {
      spyOn(CutPieceConfigAdaptor, 'getConfigId').and.returnValue('abc123');
      const pageIndex = 0;
      const pageSize = 10;

      const { path, params } = getCutPieceConfigListUrl();

      cutPieceConfigService.loadCutPieceConfig().subscribe(data => {
        expect(data).toEqual('abc123');
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });

  describe('searchProductCategoryCode', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(
        CutPieceConfigAdaptor,
        'getProductCategorySearchResult'
      ).and.returnValue({});

      const { path, params } = getProductCategorySearchUrl('abc123', 'abc123');

      cutPieceConfigService
        .searchProductCategoryCode({
          productCategoryCode: 'abc123',
          configId: 'abc123'
        })
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('configType')).toEqual('TEP_CUT_PIECE');
      expect(request.request.params.get('productCategory')).toEqual('abc123');
      //expect(request.request.urlWithParams).toEqual(apiUrl + path);
      request.flush({});
    });

    it('should call CutPieceConfigAdaptor getProductCategorySearchResult method with correct  parameters', () => {
      spyOn(
        CutPieceConfigAdaptor,
        'getProductCategorySearchResult'
      ).and.returnValue({});
      const dummyCutPieceConfigs = [
        {
          results: [
            {
              description: 'CUT PIECE CONFIG',
              isActive: true,
              offerDetails: {
                type: null,
                data: null
              },
              configDetails: {
                type: null,
                data: null
              },
              isOfferEnabled: null,
              itemCode: null,
              startDate: null,
              endDate: null,
              customerMobileNos: [],
              configId: 'B4C9A3CD-F0F6-4F1E-B506-8013CA9D0FFB',
              configType: 'CUT_PIECE_TEP',
              createdDate: 1613712247070
            }
          ],
          totalElements: 1
        }
      ];

      const { path, params } = getProductCategorySearchUrl('abc123', 'abc123');

      cutPieceConfigService
        .searchProductCategoryCode({
          productCategoryCode: 'abc123',
          configId: 'abc123'
        })
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush(dummyCutPieceConfigs);
      expect(
        CutPieceConfigAdaptor.getProductCategorySearchResult
      ).toHaveBeenCalledWith(dummyCutPieceConfigs);
    });

    it('should return data mapped by adaptors', () => {
      spyOn(
        CutPieceConfigAdaptor,
        'getProductCategorySearchResult'
      ).and.returnValue(searchResponse);

      const { path, params } = getProductCategorySearchUrl('abc123', 'abc123');

      cutPieceConfigService
        .searchProductCategoryCode({
          productCategoryCode: 'abc123',
          configId: 'abc123'
        })
        .subscribe(data => {
          expect(data).toEqual(searchResponse);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });

  describe('loadProductCategoryMapping', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(
        CutPieceConfigAdaptor,
        'getProductCategoryMappingList'
      ).and.returnValue({});

      const { path, params } = getProductCategoriesMappingListUrl(
        'abc123',
        0,
        10
      );

      cutPieceConfigService
        .loadProductCategoryMapping({
          configId: 'abc123',
          pageIndex: 0,
          pageSize: 10
        })
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('configType')).toEqual('TEP_CUT_PIECE');
      expect(request.request.params.get('page')).toEqual('0');
      expect(request.request.params.get('size')).toEqual('10');
      //expect(request.request.urlWithParams).toEqual(apiUrl + path);
      request.flush({});
    });

    it('should call CutPieceConfigAdaptor getProductCategorySearchResult method with correct  parameters', () => {
      spyOn(
        CutPieceConfigAdaptor,
        'getProductCategoryMappingList'
      ).and.returnValue({});
      const dummyCutPieceConfigs = [
        {
          results: [
            {
              description: 'CUT PIECE CONFIG',
              isActive: true,
              offerDetails: {
                type: null,
                data: null
              },
              configDetails: {
                type: null,
                data: null
              },
              isOfferEnabled: null,
              itemCode: null,
              startDate: null,
              endDate: null,
              customerMobileNos: [],
              configId: 'B4C9A3CD-F0F6-4F1E-B506-8013CA9D0FFB',
              configType: 'CUT_PIECE_TEP',
              createdDate: 1613712247070
            }
          ],
          totalElements: 1
        }
      ];

      const { path, params } = getProductCategoriesMappingListUrl(
        'abc123',
        0,
        10
      );

      cutPieceConfigService
        .loadProductCategoryMapping({
          configId: 'abc123',
          pageIndex: 0,
          pageSize: 10
        })
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush(dummyCutPieceConfigs);
      expect(
        CutPieceConfigAdaptor.getProductCategoryMappingList
      ).toHaveBeenCalledWith(dummyCutPieceConfigs);
    });

    // it('should return data mapped by adaptors', () => {
    //   spyOn(
    //     CutPieceConfigAdaptor,
    //     'getProductCategoryMappingList'
    //   ).and.returnValue({ repsonse: searchResponse, totalElements: 1 });

    //   const { path, params } = getProductCategoriesMappingListUrl(
    //     'abc123',
    //     0,
    //     10
    //   );

    //   cutPieceConfigService
    //     .loadProductCategoryMapping({
    //       configId: 'abc123',
    //       pageIndex: 0,
    //       pageSize: 10
    //     })
    //     .subscribe(data => {
    //       expect(data).toEqual({ response: searchResponse, totalElements: 1 });
    //     });

    //   const request = httpTestingController.expectOne(req => {
    //     return req.url === apiUrl + path;
    //   });

    //   request.flush({});
    // });
  });

  describe('saveCutPieceConfig', () => {
    it('should call PATCH api method with correct url and params', () => {
      const { path, params } = getProductCategoriesMappingUrl(
        savePayload.configId
      );

      cutPieceConfigService.saveCutPieceConfig(savePayload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('configType')).toEqual('TEP_CUT_PIECE');
      //expect(request.request.urlWithParams).toEqual(apiUrl + path);
      request.flush({});
    });
  });
});
