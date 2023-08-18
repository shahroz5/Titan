import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

import { TestBed } from '@angular/core/testing';
import { RivaahConfigurationAdaptor } from '@poss-web/shared/util-adaptors';
import { ApiService, getProductGroupMappingRulesUrl, getProductGroupsByProductIdUpdateUrl, getProductGroupsByProductIdUrl, getRivaahAllLocationsUrl, getRivaahEligibilityRulesUrl, getRivaahMappedLocationsUrl, getUpdateConfigurationUrl, saveRivaahLocationsUrl } from '@poss-web/shared/util-api-service';
import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { LoadProductGroupsPayload, RivaahConfigurationResponse, RivaahEligibilityConfigRequest, RivaahLocationListPayload, SaveProductGroups } from 'libs/shared/models/src/lib/configuration/rivaah-configuration/rivaah-configuration.model';
import * as moment from 'moment';

import { RivaahConfigurationService } from './rivaah-configuration.service';

describe('RivaahConfigurationService', () => {
  let service: RivaahConfigurationService;
  let httpTestingController: HttpTestingController;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;

  const apiUrl = 'http://localhost:3000'


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        RivaahConfigurationService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(RivaahConfigurationService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  apiServiceSpy = jasmine.createSpyObj<ApiService>('ApiService', [
    'get',
    'post',
    'patch'
  ]);

  service = new RivaahConfigurationService(apiServiceSpy);

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getCouponConfiguration', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(
        RivaahConfigurationAdaptor,
        'getCouponConfiguration'
      ).and.returnValue({});
      const url = getUpdateConfigurationUrl('1', 'RIVAAH_CARD_ELIGIBILITY');
      service.getCouponConfiguration('1', 'RIVAAH_CARD_ELIGIBILITY').subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
  });

  describe('updateCouponConfiguration', () => {
    it('should call PATCH api method with correct url and params', () => {
      spyOn(
        RivaahConfigurationAdaptor,
        'updateCouponConfiguration'
      ).and.returnValue({});
      const payload: RivaahConfigurationResponse = {
        ruleId: 1,
        ruleDetails: {
          data: null,
          type: 'type'
        },
        ruleType: 'RIVAAH_CARD_ELIGIBILITY'
      }
      const url = getUpdateConfigurationUrl(
        payload.ruleId.toString(),
        payload.ruleDetails.type
      );
      service.updateCouponConfiguration(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    })
  })

  describe('getRivaahEligibilityConfiguration', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(
        RivaahConfigurationAdaptor,
        'getRivaahEligibilityConfiguration'
      ).and.returnValue({});
      const payload = {
        configId: '1',
        ruleType: 'RIVAAH_CARD_ELIGIBILITY',
        productCategoryCode: '71',
        productGroupCode: 'Test 1',
        pageIndex: 0,
        pageSize: 10

      }
      const path = getRivaahEligibilityRulesUrl(
        payload.configId,
        payload.ruleType,
        true,
        payload.productCategoryCode,
        payload.productGroupCode,
        payload.pageIndex,
        payload.pageSize
      ).path;
      service.getRivaahEligibilityConfiguration('1', 'RIVAAH_CARD_ELIGIBILITY').subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    })
  })

  describe('loadMappedProductGroups', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(
        RivaahConfigurationAdaptor,
        'getMappedProductGroup'
      ).and.returnValue({});

      const payload: LoadProductGroupsPayload = {
        productId: '71',
        ruleId: '1',
        ruleType: 'RIVAAH_CARD_ELIGIBILITY'
      }
      const path = getProductGroupsByProductIdUrl(
        payload.productId,
        payload.ruleId,
        payload.ruleType
      ).path;

      service.loadMappedProductGroups(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
  });

  describe('getMappedProductCategories', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(
        RivaahConfigurationAdaptor,
        'getMappedProductCategory'
      ).and.returnValue({});

      const path = getRivaahEligibilityRulesUrl(
        '1',
        'RIVAAH_CARD_ELIGIBILITY',
        false
      ).path;

      service.getMappedProductCategories('1', 'RIVAAH_CARD_ELIGIBILITY').subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
  });

  describe('getSelectedLocations', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(
        RivaahConfigurationAdaptor,
        'getRivaahAllLocationList'
      ).and.returnValue({});
        const payload: RivaahLocationListPayload = {
          ruleId: '1'
        }
      const path = getRivaahAllLocationsUrl(
        payload.ruleId,
        'RIVAAH_CARD_ELIGIBILITY',
      ).path;

      service.getSelectedLocations(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
  });

  describe('updateProductGroups', () => {
    it('should call PATCH api method with correct url and params', () => {

      const payload: SaveProductGroups = {
        productId: '1',
        addProducts: null,
        removeProducts: null,
        ruleType: 'RIVAAH_CARD_ELIGIBILITY'
      }
      const path = getProductGroupsByProductIdUpdateUrl(
        payload.productId,
        payload.ruleId,
        payload.ruleType
      ).path;

      service.updateProductGroups(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
  });

  describe('getRivaahMappedLocationsList', () => {
    it('should call POST api method with correct url and params', () => {
      spyOn(
        RivaahConfigurationAdaptor,
        'getRivaahLocations'
      ).and.returnValue({});
        const payload: RivaahLocationListPayload = {
          ruleId: '1',
          pageIndex: 0,
          pageSize: 10,
          offerEndDate: moment(1648146600000),
          offerStartDate: moment(1647196200000),
          locationCode: ['CPD']
        }
      const path = getRivaahMappedLocationsUrl(
        payload.ruleId,
        'RIVAAH_CARD_ELIGIBILITY',
        true,
        payload.pageIndex,
        payload.pageSize
      ).path;

      service.getRivaahMappedLocationsList(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });

    it('if', () => {
      spyOn(
        RivaahConfigurationAdaptor,
        'getRivaahLocations'
      ).and.returnValue({});
        const payload: RivaahLocationListPayload = {
          ruleId: '1',
          pageIndex: 0,
          pageSize: 10,
          offerEndDate: null,
          offerStartDate: null,
          locationCode: []
        }
      const path = getRivaahMappedLocationsUrl(
        payload.ruleId,
        'RIVAAH_CARD_ELIGIBILITY',
        true,
        payload.pageIndex,
        payload.pageSize
      ).path;

      service.getRivaahMappedLocationsList(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
  });
})
