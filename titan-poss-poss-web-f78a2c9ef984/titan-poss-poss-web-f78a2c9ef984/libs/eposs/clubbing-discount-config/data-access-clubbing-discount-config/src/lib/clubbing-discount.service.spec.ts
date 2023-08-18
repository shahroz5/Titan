import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { ClubbingDiscountsService } from './clubbing-discounts.service';
import {
  getSaveClubbedDiscountsUrl,
  getClubbedDiscountsUrl,
  getDiscountsUrl
} from '@poss-web/shared/util-api-service';
import { ClubbingDiscountsAdaptor } from '@poss-web/shared/util-adaptors';
import {
  ClubDiscountsList,
  ClubDiscountsListPayload,
  DiscountTypeBasedCodes,
  SaveRulesPayload
} from '@poss-web/shared/models';

describe('ClubbingDiscountsService ', () => {
  let httpTestingController: HttpTestingController;
  let clubbingDiscountsService: ClubbingDiscountsService;
  const apiUrl = 'http://localhost:3000';

  const dummyList: ClubDiscountsList[] = [
    {
      id: '4567890',
      type1DiscountCode: 'AAA',
      type2DiscountCode: 'BBB',
      type3DiscountCode: 'CCC'
    }
  ];

  const dummyItemResponse = {
    results: dummyList,
    pageNumber: 0,
    pageSize: 10,
    totalPages: 1,
    totalElements: 10
  };

  const response: DiscountTypeBasedCodes[] = [
    {
      id: '12',
      discountCode: 'AAA'
    }
  ];
  const dummyDiscountCodeResponse = {
    results: response,
    pageNumber: 0,
    pageSize: 10,
    totalPages: 1,
    totalElements: 10
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ClubbingDiscountsService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    clubbingDiscountsService = TestBed.inject(ClubbingDiscountsService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(clubbingDiscountsService).toBeTruthy();
  });
  describe('getClubbedDiscountList', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(ClubbingDiscountsAdaptor, 'getClubbedDiscountList').and.returnValue(
        {}
      );
      const payload: ClubDiscountsListPayload = {
        pageIndex: 0,
        pageSize: 10
      };
      const discountCode = 'MMAB';
      const path = getClubbedDiscountsUrl(
        payload.pageIndex,
        payload.pageSize,
        discountCode
      ).path
      clubbingDiscountsService
        .loadClubbingDiscountConfigList(
          payload.pageIndex,
          payload.pageSize,
          discountCode
        )
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.url).toEqual(apiUrl + path);
      request.flush({});
    });
    it('should call ClubbingDiscountsAdaptor getClubbedDiscountList method with correct  parameters', () => {
      spyOn(ClubbingDiscountsAdaptor, 'getClubbedDiscountList').and.returnValue(
        {}
      );
      const discountCode = 'MMAB';

      const payload: ClubDiscountsListPayload = {
        pageIndex: 0,
        pageSize: 10
      };
      const path = getClubbedDiscountsUrl(
        payload.pageIndex,
        payload.pageSize,
        discountCode
      ).path;
      clubbingDiscountsService
        .loadClubbingDiscountConfigList(
          payload.pageIndex,
          payload.pageSize,
          discountCode
        )
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(dummyItemResponse);
      expect(
        ClubbingDiscountsAdaptor.getClubbedDiscountList
      ).toHaveBeenCalledWith(dummyItemResponse);
    });

    it('should return data mapped by adaptors', () => {
      spyOn(ClubbingDiscountsAdaptor, 'getClubbedDiscountList').and.returnValue(
        {
          clubDiscountsList: dummyList,
          count: 10
        }
      );
      const payload: ClubDiscountsListPayload = {
        pageIndex: 0,
        pageSize: 10
      };
      const discountCode = 'MMAB';
      const path = getClubbedDiscountsUrl(
        payload.pageIndex,
        payload.pageSize,
        discountCode
      ).path;
      clubbingDiscountsService
        .loadClubbingDiscountConfigList(
          payload.pageIndex,
          payload.pageSize,
          discountCode
        )
        .subscribe(data => {
          expect(data).toEqual({
            clubDiscountsList: dummyList,
            count: 10
          });
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });

  describe('saveClubbedDiscounts', () => {
    it('should call GET api method with correct url and params', () => {
      const saveForm: SaveRulesPayload = {
        addRules: [
          {
            type1DiscountCode: 'AAA',
            type2DiscountCode: 'BBB',
            type3DiscountCode: 'CCC'
          }
        ],
        removeRules: []
      };
      const path = getSaveClubbedDiscountsUrl();
      clubbingDiscountsService.saveClubbedDiscounts(saveForm).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
  });

  describe('getDiscountCodes', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(ClubbingDiscountsAdaptor, 'getDiscountCodes').and.returnValue({});

      const discountCode = 'TYPE';
      const path = getDiscountsUrl(discountCode).path;
      clubbingDiscountsService.getDiscountCodesByType(discountCode).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.url).toEqual(apiUrl + path);
      console.log(apiUrl + path);
      request.flush({});
    });
    it('should call ClubbingDiscountsAdaptor getDiscountCodes method with correct  parameters', () => {
      spyOn(ClubbingDiscountsAdaptor, 'getDiscountCodes').and.returnValue({});
      const discountType = 'TYPE';

      const path = getDiscountsUrl(discountType).path;
      clubbingDiscountsService.getDiscountCodesByType(discountType).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(dummyDiscountCodeResponse);
      expect(ClubbingDiscountsAdaptor.getDiscountCodes).toHaveBeenCalledWith(
        dummyDiscountCodeResponse
      );
    });

    it('should return data mapped by adaptors', () => {
      spyOn(ClubbingDiscountsAdaptor, 'getDiscountCodes').and.returnValue([
        {
          id: '12',
          discountCode: 'AAA'
        }
      ]);
      const discountType = 'TYPE';
      const path = getDiscountsUrl(discountType).path;
      clubbingDiscountsService
        .getDiscountCodesByType(discountType)
        .subscribe(data => {
          expect(data).toEqual([
            {
              id: '12',
              discountCode: 'AAA'
            }
          ]);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });
});
