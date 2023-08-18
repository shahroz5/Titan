import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

import { GrnInterboutiqueConfigService } from './grn-interboutique-config.service';
import {
  ApiService,
  getGrnInterboutiqueConfigUrl
} from '@poss-web/shared/util-api-service';
import { TestBed } from '@angular/core/testing';
import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import {
  CPGProductGroupConfigForQCGCAdaptor,
  GrnInterboutiqueConfigAdaptor
} from '@poss-web/shared/util-adaptors';
import { GrnInterboutiqueConfig } from '@poss-web/shared/models';

describe('GRNInterboutiqueConfigurationService', () => {
  let httpTestingController: HttpTestingController;
  let service: GrnInterboutiqueConfigService;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;

  const apiUrl = 'http://localhost:3000';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        GrnInterboutiqueConfigService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(GrnInterboutiqueConfigService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  apiServiceSpy = jasmine.createSpyObj<ApiService>('ApiService', [
    'get',
    'post',
    'patch'
  ]);

  service = new GrnInterboutiqueConfigService(apiServiceSpy);

  it('should create service', () => {
    expect(service).toBeDefined();
  });

  describe('getGrnInterboutiqueConfigDetails', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(
        GrnInterboutiqueConfigAdaptor,
        'getGrnInterboutiqueConfigDetails'
      ).and.returnValue({});
      const path = getGrnInterboutiqueConfigUrl(1);

      service.getGrnInterboutiqueConfigDetails(1).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
    it('should call getGrnInterboutiqueConfigDetails GrnInterboutiqueConfigAdaptor method with correct arguments', () => {
      const payload: GrnInterboutiqueConfig = {
        description: 'Desc',
        isActive: true,
        ruleDetails: {
          type: 'Type',
          data: {
            config: {
              L1: ['1'],
              L2: ['1'],
              L3: ['1']
            },
            type: 'Type'
          }
        },
        ruleId: 1,
        ruleType: 'Type'
      };
      spyOn(
        GrnInterboutiqueConfigAdaptor,
        'getGrnInterboutiqueConfigDetails'
      ).and.returnValue(payload);

      const path = getGrnInterboutiqueConfigUrl(1);
      service.getGrnInterboutiqueConfigDetails(1).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush(payload);
      expect(
        GrnInterboutiqueConfigAdaptor.getGrnInterboutiqueConfigDetails
      ).toHaveBeenCalledWith(payload);
    });

    it('should retun data mapped by adaptor', () => {
      const payload = 1;

      spyOn(
        GrnInterboutiqueConfigAdaptor,
        'getGrnInterboutiqueConfigDetails'
      ).and.returnValue(payload);

      const path = getGrnInterboutiqueConfigUrl(1);
      service.getGrnInterboutiqueConfigDetails(1).subscribe(data => {
        expect(data).toBeDefined();
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush({});
    });
  });
});
