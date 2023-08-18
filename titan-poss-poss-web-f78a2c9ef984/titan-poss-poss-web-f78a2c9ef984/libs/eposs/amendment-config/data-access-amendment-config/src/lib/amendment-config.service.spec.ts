import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

import { TestBed } from '@angular/core/testing';
import { UpdateFieldValuePayload } from '@poss-web/shared/models';
import { ApiService, getUpdateConfigurationUrl } from '@poss-web/shared/util-api-service';
import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';

import { AmendmentConfigService } from './amendment-config.service';

describe('AmendmentConfigService', () => {
  let service: AmendmentConfigService;
  let httpTestingController: HttpTestingController;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;

  const apiUrl = 'http://localhost:3000'

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AmendmentConfigService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(AmendmentConfigService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  apiServiceSpy = jasmine.createSpyObj<ApiService>('ApiService', [
    'get',
    'post',
    'patch'
  ]);

  service = new AmendmentConfigService(apiServiceSpy);

  const body: UpdateFieldValuePayload = {
    ruleDetails: {
      data: {
        noOfDaysToRaiseAmendment: '9'
      },
      type: 'AMENDMENT_CONFIGURATION'
    }
  }

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAmendmentConfiguration', () => {
    it('should call GET api method with correct url', () => {

      const url = getUpdateConfigurationUrl('1', 'AMENDMENT_CONFIGURATION');
      service.getAmendmentConfiguration().subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });

    it('should return data', () => {
      const url = getUpdateConfigurationUrl('1', 'AMENDMENT_CONFIGURATION');
      service.getAmendmentConfiguration().subscribe(data => {
        expect(data).toBeDefined();
      });
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });
      request.flush(body);
    })
  })

  describe('saveAmendmentConfiguration', () => {
    it('should call POST api method with correct url', () => {

      const url = getUpdateConfigurationUrl('1', 'AMENDMENT_CONFIGURATION');
      service.saveAmendmentConfiguration(body).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    })
  });
})
