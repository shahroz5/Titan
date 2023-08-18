import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

import {
  ApiService,
  getCutPieceTotDetailsUrl,
  getCutPieceTotListUrl
} from '@poss-web/shared/util-api-service';
import { TestBed } from '@angular/core/testing';
import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { CutPieceTotAdaptor } from '@poss-web/shared/util-adaptors';
import { CutPieceTot } from '@poss-web/shared/models';
import { CutPieceTotService } from './cut-piece-tot.service';

describe('CutPieceTotService', () => {
  let httpTestingController: HttpTestingController;
  let service: CutPieceTotService;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;

  const apiUrl = 'http://localhost:3000';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CutPieceTotService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(CutPieceTotService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  apiServiceSpy = jasmine.createSpyObj<ApiService>('ApiService', [
    'get',
    'post',
    'patch'
  ]);

  service = new CutPieceTotService(apiServiceSpy);

  it('should create service', () => {
    expect(service).toBeDefined();
  });

  describe('getCutPieceTotDetails', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(CutPieceTotAdaptor, 'getCutPieceTotDetails').and.returnValue({});
      const path = getCutPieceTotListUrl();
      service.getCutPieceTotDetails().subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
    it('should call getCutPieceTotDetails CutPieceTotAdaptor method with correct arguments', () => {
      const payload2: CutPieceTot[] = [
        {
          description: 'Desc',
          isActive: true,
          offerDetails: null,
          configDetails: {
            data: {
              l3DeductionPercent: 1
            },
            type: 'TYPE'
          },
          isOfferEnabled: null,
          itemCode: 'Code',
          startDate: null,
          endDate: null,
          customerMobileNos: ['111'],
          karat: 0,
          configId: '1',
          configType: 'Type',
          createdDate: 123123123
        }
      ];
      spyOn(CutPieceTotAdaptor, 'getCutPieceTotDetails').and.returnValue(
        payload2
      );

      const path = getCutPieceTotListUrl();
      service.getCutPieceTotDetails().subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush(payload2);
      expect(CutPieceTotAdaptor.getCutPieceTotDetails).toHaveBeenCalledWith(
        payload2
      );
    });

    it('should retun data mapped by listing adaptor', () => {
      const payload2: CutPieceTot[] = [
        {
          description: 'Desc',
          isActive: true,
          offerDetails: null,
          configDetails: {
            data: {
              l3DeductionPercent: 1
            },
            type: 'TYPE'
          },
          isOfferEnabled: null,
          itemCode: 'Code',
          startDate: null,
          endDate: null,
          customerMobileNos: ['111'],
          karat: 0,
          configId: '1',
          configType: 'Type',
          createdDate: 123123123
        }
      ];
      spyOn(CutPieceTotAdaptor, 'getCutPieceTotDetails').and.returnValue(
        payload2
      );

      const path = getCutPieceTotListUrl();
      service.getCutPieceTotDetails().subscribe(data => {
        expect(data).toEqual(payload2);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush({});
    });
  });

  describe('editCashPaymentConfigurationDetails', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(CutPieceTotAdaptor, 'getCutPieceTotDetail').and.returnValue({});
      const configId = '1';
      const cutPieceTot: Partial<CutPieceTot> = {
        configId: '1'
      };
      const path = getCutPieceTotDetailsUrl(configId);
      service
        .editCashPaymentConfigurationDetails(configId, cutPieceTot)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
    it('should call getCutPieceTotDetails CutPieceTotAdaptor method with correct arguments', () => {
      const configId = '1';

      const payload2: CutPieceTot = {
        description: 'Desc',
        isActive: true,
        offerDetails: null,
        configDetails: {
          data: {
            l3DeductionPercent: 1
          },
          type: 'TYPE'
        },
        isOfferEnabled: null,
        itemCode: 'Code',
        startDate: null,
        endDate: null,
        customerMobileNos: ['111'],
        karat: 0,
        configId: '1',
        configType: 'Type',
        createdDate: 123123123
      };

      const cutPieceTot: Partial<CutPieceTot> = payload2[0];
      spyOn(CutPieceTotAdaptor, 'getCutPieceTotDetail').and.returnValue(
        payload2
      );

      const path = getCutPieceTotDetailsUrl(configId);
      service
        .editCashPaymentConfigurationDetails(configId, cutPieceTot)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush(payload2);
      expect(CutPieceTotAdaptor.getCutPieceTotDetail).toHaveBeenCalledWith(
        payload2
      );
    });

    it('should retun data mapped by listing adaptor', () => {
      const configId = '1';

      const payload2: CutPieceTot = {
        description: 'Desc',
        isActive: true,
        offerDetails: null,
        configDetails: {
          data: {
            l3DeductionPercent: 1
          },
          type: 'TYPE'
        },
        isOfferEnabled: null,
        itemCode: 'Code',
        startDate: null,
        endDate: null,
        customerMobileNos: ['111'],
        karat: 0,
        configId: '1',
        configType: 'Type',
        createdDate: 123123123
      };

      const cutPieceTot: Partial<CutPieceTot> = payload2;
      spyOn(CutPieceTotAdaptor, 'getCutPieceTotDetail').and.returnValue(
        payload2
      );

      const path = getCutPieceTotDetailsUrl(configId);
      service
        .editCashPaymentConfigurationDetails(configId, cutPieceTot)
        .subscribe(data => {
          expect(data).toEqual(payload2);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush({});
    });
  });
});
