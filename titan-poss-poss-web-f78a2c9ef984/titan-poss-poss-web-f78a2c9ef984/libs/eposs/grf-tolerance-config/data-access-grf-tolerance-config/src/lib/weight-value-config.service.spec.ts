import { TestBed } from '@angular/core/testing';

import {
  LoadWeightValueConfigListingPayload,
  WeightValueConfigListingResult,
  WeightValueConfigDetails,
  RuleDetailsWeightValueConfig,
  DataWeightValueConfig,
  BasedWeightValueConfig
} from '@poss-web/shared/models';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { WeightValueConfigAdaptor } from '@poss-web/shared/util-adaptors';
import {
  getConfigurationListUrl,
  getUpdateConfigFiledValueUrl,
  getSaveConfigFiledValueUrl
} from '@poss-web/shared/util-api-service';
import { WeightValueConfigService } from './weight-value-config.service';
describe('WeightValueConfigService', () => {
  let httpTestingController: HttpTestingController;
  const apiUrl = 'http://localhost:3000';
  let weightValueConfigService: WeightValueConfigService;

  const weightBased: BasedWeightValueConfig[] = [
    {
      rowId: '1',
      fromRange: '100',
      toRange: '200',
      toleranceAllowed: '1',
      tolerancePercent: '1',
      toleranceValue: '1'
    }
  ];
  const valueBased: BasedWeightValueConfig[] = [
    {
      rowId: '1',
      fromRange: '100',
      toRange: '200',
      toleranceAllowed: '1',
      tolerancePercent: '1',
      toleranceValue: '1'
    }
  ];
  const data: DataWeightValueConfig = {
    weightBased,
    valueBased
  };

  const ruleDetailsWeightValueConfig: RuleDetailsWeightValueConfig = {
    type: 'GRF_CONFIGURATION',
    data
  };
  const weightValueConfigDetails: WeightValueConfigDetails = {
    ruleDetails: ruleDetailsWeightValueConfig,
    description: 'description',
    ruleId: 1,
    ruleType: 'GRF_CONFIGURATION',
    isActive: true
  };

  const weightValueConfigListing: WeightValueConfigDetails[] = [];
  const weightValueConfigListingResult: WeightValueConfigListingResult = {
    results: weightValueConfigListing,
    pageNumber: 1,
    pageSize: 10,
    totalPages: 10,
    totalElements: 1
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        WeightValueConfigService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    weightValueConfigService = TestBed.inject(WeightValueConfigService);
  });

  it('should be created', () => {
    expect(weightValueConfigService).toBeTruthy();
  });

  describe('getWeightValueConfigList', () => {
    const payload: LoadWeightValueConfigListingPayload = {
      pageIndex: 0,
      pageSize: 10
    };

    const url = getConfigurationListUrl(payload.pageIndex, payload.pageSize);
    it('should call POST api method with correct url and params', () => {
      spyOn(
        WeightValueConfigAdaptor,
        'getWeightValueConfigListing'
      ).and.returnValue({});

      weightValueConfigService.getWeightValueConfigList(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('page').toString()).toEqual(
        payload.pageIndex.toString()
      );
      expect(request.request.params.get('size').toString()).toEqual(
        payload.pageSize.toString()
      );
      request.flush({});
    });

    it('should call WeightValueConfigAdaptor getWeightValueConfigListing method with correct  parameters', () => {
      spyOn(
        WeightValueConfigAdaptor,
        'getWeightValueConfigListing'
      ).and.returnValue({});

      weightValueConfigService.getWeightValueConfigList(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush(weightValueConfigListingResult);
      expect(
        WeightValueConfigAdaptor.getWeightValueConfigListing
      ).toHaveBeenCalledWith(weightValueConfigListingResult);
    });

    it('should return data mapped by adaptors', () => {
      spyOn(
        WeightValueConfigAdaptor,
        'getWeightValueConfigListing'
      ).and.returnValue(weightValueConfigListingResult);

      weightValueConfigService
        .getWeightValueConfigList(payload)
        .subscribe(data1 => {
          expect(data1).toEqual(weightValueConfigListingResult);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush({});
    });
  });

  describe('getWeightValueConfigSearch', () => {
    const url = getConfigurationListUrl(0, 10);
    it('should call POST api method with correct url and params', () => {
      spyOn(
        WeightValueConfigAdaptor,
        'getWeightValueConfigListing'
      ).and.returnValue({});

      weightValueConfigService.getWeightValueConfigSearch('test').subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });

    it('should call WeightValueConfigAdaptor getWeightValueConfigListing method with correct  parameters', () => {
      spyOn(
        WeightValueConfigAdaptor,
        'getWeightValueConfigListing'
      ).and.returnValue({});
      weightValueConfigService.getWeightValueConfigSearch('test').subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush(weightValueConfigListingResult);
      expect(
        WeightValueConfigAdaptor.getWeightValueConfigListing
      ).toHaveBeenCalledWith(weightValueConfigListingResult);
    });

    it('should return data mapped by adaptors', () => {
      spyOn(
        WeightValueConfigAdaptor,
        'getWeightValueConfigListing'
      ).and.returnValue(weightValueConfigListingResult);

      weightValueConfigService
        .getWeightValueConfigSearch('test')
        .subscribe(data1 => {
          expect(data1).toEqual(weightValueConfigListingResult);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush({});
    });
  });

  describe('saveWeightValueConfigDetails', () => {
    const path = getSaveConfigFiledValueUrl('GRF_CONFIGURATION');

    it('should call POST api method with correct url and params', () => {
      weightValueConfigService
        .saveWeightValueConfigDetails(weightValueConfigDetails)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });

    it('should call WeightValueConfigAdaptor getWeightValueConfigDetails method with correct  parameters', () => {
      spyOn(
        WeightValueConfigAdaptor,
        'getWeightValueConfigDetails'
      ).and.returnValue({});

      weightValueConfigService
        .saveWeightValueConfigDetails(weightValueConfigDetails)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(weightValueConfigDetails);
      expect(
        WeightValueConfigAdaptor.getWeightValueConfigDetails
      ).toHaveBeenCalledWith(weightValueConfigDetails);
    });

    it('should return data mapped by adaptors', () => {
      spyOn(
        WeightValueConfigAdaptor,
        'getWeightValueConfigDetails'
      ).and.returnValue(weightValueConfigDetails);

      weightValueConfigService
        .saveWeightValueConfigDetails(weightValueConfigDetails)
        .subscribe(data1 => {
          expect(data1).toEqual(weightValueConfigDetails);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });

  describe('editWeightValueConfigDetails', () => {
    const path = getUpdateConfigFiledValueUrl('1', 'GRF_CONFIGURATION');
    it('should call PATCH api method with correct url and params', () => {
      spyOn(
        WeightValueConfigAdaptor,
        'getWeightValueConfigDetails'
      ).and.returnValue({});

      weightValueConfigService
        .editWeightValueConfigDetails(weightValueConfigDetails)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
    it('should call WeightValueConfigAdaptor getWeightValueConfigDetails method with correct  parameters', () => {
      spyOn(
        WeightValueConfigAdaptor,
        'getWeightValueConfigDetails'
      ).and.returnValue({});

      weightValueConfigService
        .editWeightValueConfigDetails(weightValueConfigDetails)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(weightValueConfigDetails);
      expect(
        WeightValueConfigAdaptor.getWeightValueConfigDetails
      ).toHaveBeenCalledWith(weightValueConfigDetails);
    });

    it('should return data mapped by adaptors', () => {
      spyOn(
        WeightValueConfigAdaptor,
        'getWeightValueConfigDetails'
      ).and.returnValue(weightValueConfigDetails);

      weightValueConfigService
        .editWeightValueConfigDetails(weightValueConfigDetails)
        .subscribe(data1 => {
          expect(data1).toEqual(weightValueConfigDetails);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });
});
