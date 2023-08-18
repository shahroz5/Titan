import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

import { LovMasterService } from './lov-master.service';
import {
  ApiService,
  getConfigLOVTypeUrl,
  getInventoryLOVTypeUrl,
  getLocationLOVTypeUrl,
  getLovMasterTypeUrl,
  getPaymentLOVTypeUrl,
  getProductLOVTypeUrl,
  getReportLOVTypeUrl
} from '@poss-web/shared/util-api-service';
import { TestBed } from '@angular/core/testing';
import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { LovMasterAdaptor } from '@poss-web/shared/util-adaptors';
import {
  LoadLovListingSuccessPayload,
  LovMaster,
  LovMasterEndpointServiceEnum,
  LovMasterType
} from '@poss-web/shared/models';

describe('LOV Master Service', () => {
  let httpTestingController: HttpTestingController;
  let service: LovMasterService;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;

  const apiUrl = 'http://localhost:3000';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        LovMasterService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(LovMasterService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  apiServiceSpy = jasmine.createSpyObj<ApiService>('ApiService', [
    'get',
    'post',
    'patch'
  ]);

  service = new LovMasterService(apiServiceSpy);

  it('should create service', () => {
    expect(service).toBeDefined();
  });

  describe('getLovMasterType', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(LovMasterAdaptor, 'getLOVTypes').and.returnValue({});
      const path = getLovMasterTypeUrl();
      service.getLovMasterType().subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
    it('should call getLovMasterType LovMasterAdaptor method with correct arguments', () => {
      const payload: LovMasterType[] = [
        {
          name: 'LOV_Name',
          value: 'LOV_Value'
        }
      ];

      spyOn(LovMasterAdaptor, 'getLOVTypes').and.returnValue(payload);

      const path = getLovMasterTypeUrl();
      service.getLovMasterType().subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush(payload);
      expect(LovMasterAdaptor.getLOVTypes).toHaveBeenCalledWith(payload);
    });

    it('should retun data mapped by listing adaptor', () => {
      const payload: LovMasterType[] = [
        {
          name: 'LOV_Name',
          value: 'LOV_Value'
        }
      ];
      spyOn(LovMasterAdaptor, 'getLOVTypes').and.returnValue(payload);

      const path = getLovMasterTypeUrl();
      service.getLovMasterType().subscribe(data => {
        expect(data).toEqual(payload);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush({});
    });
  });

  describe('getLovMasterTypeMain', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(LovMasterAdaptor, 'getLOVTypesMain').and.returnValue({});
      const path = getLovMasterTypeUrl();
      service.getLovMasterTypeMain().subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
    it('should call getLovMasterTypeMain LovMasterAdaptor method with correct arguments', () => {
      const payload: LovMasterType[] = [
        {
          name: 'LOV_Name',
          value: 'LOV_Value'
        }
      ];

      spyOn(LovMasterAdaptor, 'getLOVTypesMain').and.returnValue(payload);

      const path = getLovMasterTypeUrl();
      service.getLovMasterTypeMain().subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush(payload);
      expect(LovMasterAdaptor.getLOVTypesMain).toHaveBeenCalledWith(payload);
    });

    it('should retun data mapped by listing adaptor', () => {
      const payload: LovMasterType[] = [
        {
          name: 'LOV_Name',
          value: 'LOV_Value'
        }
      ];
      spyOn(LovMasterAdaptor, 'getLOVTypesMain').and.returnValue(payload);

      const path = getLovMasterTypeUrl();
      service.getLovMasterTypeMain().subscribe(data => {
        expect(data).toEqual(payload);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush({});
    });
  });

  describe('getLOVTypeListing', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(LovMasterAdaptor, 'getLOVTypeListing').and.returnValue({});
      let url = '';
      const lovTypeRaw: string = 'PRODUCT|PRODUCT';
      const lovType = lovTypeRaw.split('|')[0];
      const baseServicePath = lovTypeRaw.split('|')[1];
      switch (baseServicePath) {
        case LovMasterEndpointServiceEnum.PRODUCT:
          url = getProductLOVTypeUrl(lovType);
          break;
        case LovMasterEndpointServiceEnum.LOCATION:
          url = getLocationLOVTypeUrl(lovType);
          break;
        case LovMasterEndpointServiceEnum.INVENTORY:
          url = getInventoryLOVTypeUrl(lovType);
          break;
        case LovMasterEndpointServiceEnum.PAYMENT:
          url = getPaymentLOVTypeUrl(lovType);
          break;
        case LovMasterEndpointServiceEnum.CONFIG:
          url = getConfigLOVTypeUrl(lovType);
          break;
      }
      service.getLovMasterList(lovTypeRaw).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
    it('should call getLOVTypeListing LovMasterAdaptor method with correct arguments', () => {
      const response: LoadLovListingSuccessPayload = {
        LovListing: [
          {
            lovName: 'Name',
            lovType: 'PRODUCT',
            description: 'Desc',
            isActive: true
          }
        ],
        totalElements: 1
      };

      spyOn(LovMasterAdaptor, 'getLOVTypeListing').and.returnValue(response);

      const lovTypeRaw: string = 'PRODUCT|product';
      const lovType = lovTypeRaw.split('|')[0];
      const baseServicePath = lovTypeRaw.split('|')[1];
      let url = '';
      switch (baseServicePath) {
        case LovMasterEndpointServiceEnum.PRODUCT:
          url = getProductLOVTypeUrl(lovType);
          break;
        case LovMasterEndpointServiceEnum.LOCATION:
          url = getLocationLOVTypeUrl(lovType);
          break;
        case LovMasterEndpointServiceEnum.INVENTORY:
          url = getInventoryLOVTypeUrl(lovType);
          break;
        case LovMasterEndpointServiceEnum.PAYMENT:
          url = getPaymentLOVTypeUrl(lovType);
          break;
        case LovMasterEndpointServiceEnum.CONFIG:
          url = getConfigLOVTypeUrl(lovType);
          break;
      }
      service.getLovMasterList(lovTypeRaw).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });
      request.flush(response);
      expect(LovMasterAdaptor.getLOVTypeListing).toHaveBeenCalledWith(response);
    });

    it('should retun data mapped by adaptor', () => {
      const response: LoadLovListingSuccessPayload = {
        LovListing: [
          {
            lovName: 'Name',
            lovType: 'PRODUCT',
            description: 'Desc',
            isActive: true
          }
        ],
        totalElements: 1
      };

      spyOn(LovMasterAdaptor, 'getLOVTypeListing').and.returnValue(response);

      const lovTypeRaw: string = 'PRODUCT|PRODUCT';
      const lovType = lovTypeRaw.split('|')[0];
      const baseServicePath = lovTypeRaw.split('|')[1];
      let url = '';
      switch (baseServicePath) {
        case LovMasterEndpointServiceEnum.PRODUCT:
          url = getProductLOVTypeUrl(lovType);
          break;
        case LovMasterEndpointServiceEnum.LOCATION:
          url = getLocationLOVTypeUrl(lovType);
          break;
        case LovMasterEndpointServiceEnum.INVENTORY:
          url = getInventoryLOVTypeUrl(lovType);
          break;
        case LovMasterEndpointServiceEnum.PAYMENT:
          url = getPaymentLOVTypeUrl(lovType);
          break;
        case LovMasterEndpointServiceEnum.CONFIG:
          url = getConfigLOVTypeUrl(lovType);
          break;
      }
      service.getLovMasterList(lovTypeRaw).subscribe(data => {
        expect(data).toEqual(response);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });
      request.flush({});
    });
  });

  describe('getLOVTypeListing', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(LovMasterAdaptor, 'getLOVTypeListing').and.returnValue({});
      let url = '';
      const lovTypeRaw: string = 'LOCATION|LOCATION';
      const lovType = lovTypeRaw.split('|')[0];
      const baseServicePath = lovTypeRaw.split('|')[1];
      switch (baseServicePath) {
        case LovMasterEndpointServiceEnum.PRODUCT:
          url = getProductLOVTypeUrl(lovType);
          break;
        case LovMasterEndpointServiceEnum.LOCATION:
          url = getLocationLOVTypeUrl(lovType);
          break;
        case LovMasterEndpointServiceEnum.INVENTORY:
          url = getInventoryLOVTypeUrl(lovType);
          break;
        case LovMasterEndpointServiceEnum.PAYMENT:
          url = getPaymentLOVTypeUrl(lovType);
          break;
        case LovMasterEndpointServiceEnum.CONFIG:
          url = getConfigLOVTypeUrl(lovType);
          break;
      }
      service.getLovMasterList(lovTypeRaw).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
    it('should call getLOVTypeListing LovMasterAdaptor method with correct arguments', () => {
      const response: LoadLovListingSuccessPayload = {
        LovListing: [
          {
            lovName: 'Name',
            lovType: 'PRODUCT',
            description: 'Desc',
            isActive: true
          }
        ],
        totalElements: 1
      };

      spyOn(LovMasterAdaptor, 'getLOVTypeListing').and.returnValue(response);

      const lovTypeRaw: string = 'LOCATION|location';
      const lovType = lovTypeRaw.split('|')[0];
      const baseServicePath = lovTypeRaw.split('|')[1];
      let url = '';
      switch (baseServicePath) {
        case LovMasterEndpointServiceEnum.PRODUCT:
          url = getProductLOVTypeUrl(lovType);
          break;
        case LovMasterEndpointServiceEnum.LOCATION:
          url = getLocationLOVTypeUrl(lovType);
          break;
        case LovMasterEndpointServiceEnum.INVENTORY:
          url = getInventoryLOVTypeUrl(lovType);
          break;
        case LovMasterEndpointServiceEnum.PAYMENT:
          url = getPaymentLOVTypeUrl(lovType);
          break;
        case LovMasterEndpointServiceEnum.CONFIG:
          url = getConfigLOVTypeUrl(lovType);
          break;
      }
      service.getLovMasterList(lovTypeRaw).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });
      request.flush(response);
      expect(LovMasterAdaptor.getLOVTypeListing).toHaveBeenCalledWith(response);
    });

    it('should retun data mapped by adaptor', () => {
      const response: LoadLovListingSuccessPayload = {
        LovListing: [
          {
            lovName: 'Name',
            lovType: 'PRODUCT',
            description: 'Desc',
            isActive: true
          }
        ],
        totalElements: 1
      };

      spyOn(LovMasterAdaptor, 'getLOVTypeListing').and.returnValue(response);

      const lovTypeRaw: string = 'LOCATION|LOCATION';
      const lovType = lovTypeRaw.split('|')[0];
      const baseServicePath = lovTypeRaw.split('|')[1];
      let url = '';
      switch (baseServicePath) {
        case LovMasterEndpointServiceEnum.PRODUCT:
          url = getProductLOVTypeUrl(lovType);
          break;
        case LovMasterEndpointServiceEnum.LOCATION:
          url = getLocationLOVTypeUrl(lovType);
          break;
        case LovMasterEndpointServiceEnum.INVENTORY:
          url = getInventoryLOVTypeUrl(lovType);
          break;
        case LovMasterEndpointServiceEnum.PAYMENT:
          url = getPaymentLOVTypeUrl(lovType);
          break;
        case LovMasterEndpointServiceEnum.CONFIG:
          url = getConfigLOVTypeUrl(lovType);
          break;
      }
      service.getLovMasterList(lovTypeRaw).subscribe(data => {
        expect(data).toEqual(response);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });
      request.flush({});
    });
  });

  describe('getLOVTypeListing', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(LovMasterAdaptor, 'getLOVTypeListing').and.returnValue({});
      let url = '';
      const lovTypeRaw: string = 'INVENTORY|INVENTORY';
      const lovType = lovTypeRaw.split('|')[0];
      const baseServicePath = lovTypeRaw.split('|')[1];
      switch (baseServicePath) {
        case LovMasterEndpointServiceEnum.PRODUCT:
          url = getProductLOVTypeUrl(lovType);
          break;
        case LovMasterEndpointServiceEnum.LOCATION:
          url = getLocationLOVTypeUrl(lovType);
          break;
        case LovMasterEndpointServiceEnum.INVENTORY:
          url = getInventoryLOVTypeUrl(lovType);
          break;
        case LovMasterEndpointServiceEnum.PAYMENT:
          url = getPaymentLOVTypeUrl(lovType);
          break;
        case LovMasterEndpointServiceEnum.CONFIG:
          url = getConfigLOVTypeUrl(lovType);
          break;
      }
      service.getLovMasterList(lovTypeRaw).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
    it('should call getLOVTypeListing LovMasterAdaptor method with correct arguments', () => {
      const response: LoadLovListingSuccessPayload = {
        LovListing: [
          {
            lovName: 'Name',
            lovType: 'PRODUCT',
            description: 'Desc',
            isActive: true
          }
        ],
        totalElements: 1
      };

      spyOn(LovMasterAdaptor, 'getLOVTypeListing').and.returnValue(response);

      const lovTypeRaw: string = 'INVENTORY|inventory';
      const lovType = lovTypeRaw.split('|')[0];
      const baseServicePath = lovTypeRaw.split('|')[1];
      let url = '';
      switch (baseServicePath) {
        case LovMasterEndpointServiceEnum.PRODUCT:
          url = getProductLOVTypeUrl(lovType);
          break;
        case LovMasterEndpointServiceEnum.LOCATION:
          url = getLocationLOVTypeUrl(lovType);
          break;
        case LovMasterEndpointServiceEnum.INVENTORY:
          url = getInventoryLOVTypeUrl(lovType);
          break;
        case LovMasterEndpointServiceEnum.PAYMENT:
          url = getPaymentLOVTypeUrl(lovType);
          break;
        case LovMasterEndpointServiceEnum.CONFIG:
          url = getConfigLOVTypeUrl(lovType);
          break;
      }
      service.getLovMasterList(lovTypeRaw).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });
      request.flush(response);
      expect(LovMasterAdaptor.getLOVTypeListing).toHaveBeenCalledWith(response);
    });

    it('should retun data mapped by adaptor', () => {
      const response: LoadLovListingSuccessPayload = {
        LovListing: [
          {
            lovName: 'Name',
            lovType: 'PRODUCT',
            description: 'Desc',
            isActive: true
          }
        ],
        totalElements: 1
      };

      spyOn(LovMasterAdaptor, 'getLOVTypeListing').and.returnValue(response);

      const lovTypeRaw: string = 'INVENTORY|INVENTORY';
      const lovType = lovTypeRaw.split('|')[0];
      const baseServicePath = lovTypeRaw.split('|')[1];
      let url = '';
      switch (baseServicePath) {
        case LovMasterEndpointServiceEnum.PRODUCT:
          url = getProductLOVTypeUrl(lovType);
          break;
        case LovMasterEndpointServiceEnum.LOCATION:
          url = getLocationLOVTypeUrl(lovType);
          break;
        case LovMasterEndpointServiceEnum.INVENTORY:
          url = getInventoryLOVTypeUrl(lovType);
          break;
        case LovMasterEndpointServiceEnum.PAYMENT:
          url = getPaymentLOVTypeUrl(lovType);
          break;
        case LovMasterEndpointServiceEnum.CONFIG:
          url = getConfigLOVTypeUrl(lovType);
          break;
      }
      service.getLovMasterList(lovTypeRaw).subscribe(data => {
        expect(data).toEqual(response);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });
      request.flush({});
    });
  });

  describe('getLOVTypeListing', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(LovMasterAdaptor, 'getLOVTypeListing').and.returnValue({});
      let url = '';
      const lovTypeRaw: string = 'PAYMENT|PAYMENT';
      const lovType = lovTypeRaw.split('|')[0];
      const baseServicePath = lovTypeRaw.split('|')[1];
      switch (baseServicePath) {
        case LovMasterEndpointServiceEnum.PRODUCT:
          url = getProductLOVTypeUrl(lovType);
          break;
        case LovMasterEndpointServiceEnum.LOCATION:
          url = getLocationLOVTypeUrl(lovType);
          break;
        case LovMasterEndpointServiceEnum.INVENTORY:
          url = getInventoryLOVTypeUrl(lovType);
          break;
        case LovMasterEndpointServiceEnum.PAYMENT:
          url = getPaymentLOVTypeUrl(lovType);
          break;
        case LovMasterEndpointServiceEnum.CONFIG:
          url = getConfigLOVTypeUrl(lovType);
          break;
      }
      service.getLovMasterList(lovTypeRaw).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
    it('should call getLOVTypeListing LovMasterAdaptor method with correct arguments', () => {
      const response: LoadLovListingSuccessPayload = {
        LovListing: [
          {
            lovName: 'Name',
            lovType: 'PRODUCT',
            description: 'Desc',
            isActive: true
          }
        ],
        totalElements: 1
      };

      spyOn(LovMasterAdaptor, 'getLOVTypeListing').and.returnValue(response);

      const lovTypeRaw: string = 'PAYMENT|payment';
      const lovType = lovTypeRaw.split('|')[0];
      const baseServicePath = lovTypeRaw.split('|')[1];
      let url = '';
      switch (baseServicePath) {
        case LovMasterEndpointServiceEnum.PRODUCT:
          url = getProductLOVTypeUrl(lovType);
          break;
        case LovMasterEndpointServiceEnum.LOCATION:
          url = getLocationLOVTypeUrl(lovType);
          break;
        case LovMasterEndpointServiceEnum.INVENTORY:
          url = getInventoryLOVTypeUrl(lovType);
          break;
        case LovMasterEndpointServiceEnum.PAYMENT:
          url = getPaymentLOVTypeUrl(lovType);
          break;
        case LovMasterEndpointServiceEnum.CONFIG:
          url = getConfigLOVTypeUrl(lovType);
          break;
      }
      service.getLovMasterList(lovTypeRaw).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });
      request.flush(response);
      expect(LovMasterAdaptor.getLOVTypeListing).toHaveBeenCalledWith(response);
    });

    it('should retun data mapped by adaptor', () => {
      const response: LoadLovListingSuccessPayload = {
        LovListing: [
          {
            lovName: 'Name',
            lovType: 'PRODUCT',
            description: 'Desc',
            isActive: true
          }
        ],
        totalElements: 1
      };

      spyOn(LovMasterAdaptor, 'getLOVTypeListing').and.returnValue(response);

      const lovTypeRaw: string = 'PAYMENT|PAYMENT';
      const lovType = lovTypeRaw.split('|')[0];
      const baseServicePath = lovTypeRaw.split('|')[1];
      let url = '';
      switch (baseServicePath) {
        case LovMasterEndpointServiceEnum.PRODUCT:
          url = getProductLOVTypeUrl(lovType);
          break;
        case LovMasterEndpointServiceEnum.LOCATION:
          url = getLocationLOVTypeUrl(lovType);
          break;
        case LovMasterEndpointServiceEnum.INVENTORY:
          url = getInventoryLOVTypeUrl(lovType);
          break;
        case LovMasterEndpointServiceEnum.PAYMENT:
          url = getPaymentLOVTypeUrl(lovType);
          break;
        case LovMasterEndpointServiceEnum.CONFIG:
          url = getConfigLOVTypeUrl(lovType);
          break;
      }
      service.getLovMasterList(lovTypeRaw).subscribe(data => {
        expect(data).toEqual(response);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });
      request.flush({});
    });
  });

  describe('getLOVTypeListing', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(LovMasterAdaptor, 'getLOVTypeListing').and.returnValue({});
      let url = '';
      const lovTypeRaw: string = 'CONFIG|CONFIG';
      const lovType = lovTypeRaw.split('|')[0];
      const baseServicePath = lovTypeRaw.split('|')[1];
      switch (baseServicePath) {
        case LovMasterEndpointServiceEnum.PRODUCT:
          url = getProductLOVTypeUrl(lovType);
          break;
        case LovMasterEndpointServiceEnum.LOCATION:
          url = getLocationLOVTypeUrl(lovType);
          break;
        case LovMasterEndpointServiceEnum.INVENTORY:
          url = getInventoryLOVTypeUrl(lovType);
          break;
        case LovMasterEndpointServiceEnum.PAYMENT:
          url = getPaymentLOVTypeUrl(lovType);
          break;
        case LovMasterEndpointServiceEnum.CONFIG:
          url = getConfigLOVTypeUrl(lovType);
          break;
      }
      service.getLovMasterList(lovTypeRaw).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
    it('should call getLOVTypeListing LovMasterAdaptor method with correct arguments', () => {
      const response: LoadLovListingSuccessPayload = {
        LovListing: [
          {
            lovName: 'Name',
            lovType: 'PRODUCT',
            description: 'Desc',
            isActive: true
          }
        ],
        totalElements: 1
      };

      spyOn(LovMasterAdaptor, 'getLOVTypeListing').and.returnValue(response);

      const lovTypeRaw: string = 'CONFIG|config';
      const lovType = lovTypeRaw.split('|')[0];
      const baseServicePath = lovTypeRaw.split('|')[1];
      let url = '';
      switch (baseServicePath) {
        case LovMasterEndpointServiceEnum.PRODUCT:
          url = getProductLOVTypeUrl(lovType);
          break;
        case LovMasterEndpointServiceEnum.LOCATION:
          url = getLocationLOVTypeUrl(lovType);
          break;
        case LovMasterEndpointServiceEnum.INVENTORY:
          url = getInventoryLOVTypeUrl(lovType);
          break;
        case LovMasterEndpointServiceEnum.PAYMENT:
          url = getPaymentLOVTypeUrl(lovType);
          break;
        case LovMasterEndpointServiceEnum.CONFIG:
          url = getConfigLOVTypeUrl(lovType);
          break;
      }
      service.getLovMasterList(lovTypeRaw).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });
      request.flush(response);
      expect(LovMasterAdaptor.getLOVTypeListing).toHaveBeenCalledWith(response);
    });

    it('should retun data mapped by adaptor', () => {
      const response: LoadLovListingSuccessPayload = {
        LovListing: [
          {
            lovName: 'Name',
            lovType: 'PRODUCT',
            description: 'Desc',
            isActive: true
          }
        ],
        totalElements: 1
      };

      spyOn(LovMasterAdaptor, 'getLOVTypeListing').and.returnValue(response);

      const lovTypeRaw: string = 'CONFIG|CONFIG';
      const lovType = lovTypeRaw.split('|')[0];
      const baseServicePath = lovTypeRaw.split('|')[1];
      let url = '';
      switch (baseServicePath) {
        case LovMasterEndpointServiceEnum.PRODUCT:
          url = getProductLOVTypeUrl(lovType);
          break;
        case LovMasterEndpointServiceEnum.LOCATION:
          url = getLocationLOVTypeUrl(lovType);
          break;
        case LovMasterEndpointServiceEnum.INVENTORY:
          url = getInventoryLOVTypeUrl(lovType);
          break;
        case LovMasterEndpointServiceEnum.PAYMENT:
          url = getPaymentLOVTypeUrl(lovType);
          break;
        case LovMasterEndpointServiceEnum.CONFIG:
          url = getConfigLOVTypeUrl(lovType);
          break;
      }
      service.getLovMasterList(lovTypeRaw).subscribe(data => {
        expect(data).toEqual(response);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });
      request.flush({});
    });
  });

  describe('getLOVTypeListing', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(LovMasterAdaptor, 'getLOVTypeListing').and.returnValue({});
      let url = '';
      const lovTypeRaw: string = 'REPORT|REPORT';
      const lovType = lovTypeRaw.split('|')[0];
      const baseServicePath = lovTypeRaw.split('|')[1];
      switch (baseServicePath) {
        case LovMasterEndpointServiceEnum.PRODUCT:
          url = getProductLOVTypeUrl(lovType);
          break;
        case LovMasterEndpointServiceEnum.LOCATION:
          url = getLocationLOVTypeUrl(lovType);
          break;
        case LovMasterEndpointServiceEnum.INVENTORY:
          url = getInventoryLOVTypeUrl(lovType);
          break;
        case LovMasterEndpointServiceEnum.PAYMENT:
          url = getPaymentLOVTypeUrl(lovType);
          break;
        case LovMasterEndpointServiceEnum.CONFIG:
          url = getConfigLOVTypeUrl(lovType);
          break;
        case LovMasterEndpointServiceEnum.REPORT:
          url = getReportLOVTypeUrl(lovType);
          break;
      }
      service.getLovMasterList(lovTypeRaw).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
    it('should call getLOVTypeListing LovMasterAdaptor method with correct arguments', () => {
      const response: LoadLovListingSuccessPayload = {
        LovListing: [
          {
            lovName: 'Name',
            lovType: 'PRODUCT',
            description: 'Desc',
            isActive: true
          }
        ],
        totalElements: 1
      };

      spyOn(LovMasterAdaptor, 'getLOVTypeListing').and.returnValue(response);

      const lovTypeRaw: string = 'REPORT|report';
      const lovType = lovTypeRaw.split('|')[0];
      const baseServicePath = lovTypeRaw.split('|')[1];
      let url = '';
      switch (baseServicePath) {
        case LovMasterEndpointServiceEnum.PRODUCT:
          url = getProductLOVTypeUrl(lovType);
          break;
        case LovMasterEndpointServiceEnum.LOCATION:
          url = getLocationLOVTypeUrl(lovType);
          break;
        case LovMasterEndpointServiceEnum.INVENTORY:
          url = getInventoryLOVTypeUrl(lovType);
          break;
        case LovMasterEndpointServiceEnum.PAYMENT:
          url = getPaymentLOVTypeUrl(lovType);
          break;
        case LovMasterEndpointServiceEnum.CONFIG:
          url = getConfigLOVTypeUrl(lovType);
          break;
        case LovMasterEndpointServiceEnum.REPORT:
          url = getReportLOVTypeUrl(lovType);
          break;
      }
      service.getLovMasterList(lovTypeRaw).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });
      request.flush(response);
      expect(LovMasterAdaptor.getLOVTypeListing).toHaveBeenCalledWith(response);
    });

    it('should retun data mapped by adaptor', () => {
      const response: LoadLovListingSuccessPayload = {
        LovListing: [
          {
            lovName: 'Name',
            lovType: 'PRODUCT',
            description: 'Desc',
            isActive: true
          }
        ],
        totalElements: 1
      };

      spyOn(LovMasterAdaptor, 'getLOVTypeListing').and.returnValue(response);

      const lovTypeRaw: string = 'REPORT|REPORT';
      const lovType = lovTypeRaw.split('|')[0];
      const baseServicePath = lovTypeRaw.split('|')[1];
      let url = '';
      switch (baseServicePath) {
        case LovMasterEndpointServiceEnum.PRODUCT:
          url = getProductLOVTypeUrl(lovType);
          break;
        case LovMasterEndpointServiceEnum.LOCATION:
          url = getLocationLOVTypeUrl(lovType);
          break;
        case LovMasterEndpointServiceEnum.INVENTORY:
          url = getInventoryLOVTypeUrl(lovType);
          break;
        case LovMasterEndpointServiceEnum.PAYMENT:
          url = getPaymentLOVTypeUrl(lovType);
          break;
        case LovMasterEndpointServiceEnum.CONFIG:
          url = getConfigLOVTypeUrl(lovType);
          break;
        case LovMasterEndpointServiceEnum.REPORT:
          url = getReportLOVTypeUrl(lovType);
          break;
      }
      service.getLovMasterList(lovTypeRaw).subscribe(data => {
        expect(data).toEqual(response);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });
      request.flush({});
    });
  });

  describe('saveLovFormDetails', () => {
    const saveForm: LovMaster = {
      lovName: 'LOV_Name',
      description: 'Desc',
      isActive: true,
      lovType: 'product'
    };
    it('should call GET api method with correct url and params', () => {
      spyOn(LovMasterAdaptor, 'getLOVTypeListing').and.returnValue({});
      let url = '';
      switch (saveForm.lovType) {
        case LovMasterEndpointServiceEnum.PRODUCT:
          url = getProductLOVTypeUrl(saveForm.lovType);
          break;
        case LovMasterEndpointServiceEnum.LOCATION:
          url = getLocationLOVTypeUrl(saveForm.lovType);
          break;
        case LovMasterEndpointServiceEnum.INVENTORY:
          url = getInventoryLOVTypeUrl(saveForm.lovType);
          break;
        case LovMasterEndpointServiceEnum.PAYMENT:
          url = getPaymentLOVTypeUrl(saveForm.lovType);
          break;
        case LovMasterEndpointServiceEnum.CONFIG:
          url = getConfigLOVTypeUrl(saveForm.lovType);
          break;
      }

      service.saveLovFormDetails(saveForm).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
    it('should call getLOVTypeListing LovMasterAdaptor method with correct arguments', () => {
      const response: LoadLovListingSuccessPayload = {
        LovListing: [
          {
            lovName: 'Name',
            lovType: 'PRODUCT',
            description: 'Desc',
            isActive: true
          }
        ],
        totalElements: 1
      };

      spyOn(LovMasterAdaptor, 'getLOVTypeListing').and.returnValue(response);
      let url = '';
      switch (saveForm.lovType) {
        case LovMasterEndpointServiceEnum.PRODUCT:
          url = getProductLOVTypeUrl(saveForm.lovType);
          break;
        case LovMasterEndpointServiceEnum.LOCATION:
          url = getLocationLOVTypeUrl(saveForm.lovType);
          break;
        case LovMasterEndpointServiceEnum.INVENTORY:
          url = getInventoryLOVTypeUrl(saveForm.lovType);
          break;
        case LovMasterEndpointServiceEnum.PAYMENT:
          url = getPaymentLOVTypeUrl(saveForm.lovType);
          break;
        case LovMasterEndpointServiceEnum.CONFIG:
          url = getConfigLOVTypeUrl(saveForm.lovType);
          break;
      }
      service.saveLovFormDetails(saveForm).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl;
      });
      request.flush(response);
      expect(LovMasterAdaptor.getLOVTypeListing).toHaveBeenCalledWith(response);
    });

    it('should retun data mapped by adaptor', () => {
      const response: LoadLovListingSuccessPayload = {
        LovListing: [
          {
            lovName: 'Name',
            lovType: 'PRODUCT',
            description: 'Desc',
            isActive: true
          }
        ],
        totalElements: 1
      };

      spyOn(LovMasterAdaptor, 'getLOVTypeListing').and.returnValue(response);

      let url = '';
      switch (saveForm.lovType) {
        case LovMasterEndpointServiceEnum.PRODUCT:
          url = getProductLOVTypeUrl(saveForm.lovType);
          break;
        case LovMasterEndpointServiceEnum.LOCATION:
          url = getLocationLOVTypeUrl(saveForm.lovType);
          break;
        case LovMasterEndpointServiceEnum.INVENTORY:
          url = getInventoryLOVTypeUrl(saveForm.lovType);
          break;
        case LovMasterEndpointServiceEnum.PAYMENT:
          url = getPaymentLOVTypeUrl(saveForm.lovType);
          break;
        case LovMasterEndpointServiceEnum.CONFIG:
          url = getConfigLOVTypeUrl(saveForm.lovType);
          break;
      }
      service.saveLovFormDetails(saveForm).subscribe(data => {
        expect(data).toEqual(response);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl;
      });
      request.flush({});
    });
  });

  describe('createLovFormDetails', () => {
    const createResponse: LovMaster = {
      lovName: 'Name',
      lovType: 'PRODUCT',
      description: 'Desc',
      isActive: true
    };

    const saveForm: LovMaster = {
      lovName: 'LOV_Name',
      description: 'Desc',
      isActive: true,
      lovType: 'product'
    };
    it('should call GET api method with correct url and params', () => {
      spyOn(LovMasterAdaptor, 'getLOVTypeCreate').and.returnValue({});
      let url = '';
      switch (saveForm.lovType) {
        case LovMasterEndpointServiceEnum.PRODUCT:
          url = getProductLOVTypeUrl(saveForm.lovType);
          break;
        case LovMasterEndpointServiceEnum.LOCATION:
          url = getLocationLOVTypeUrl(saveForm.lovType);
          break;
        case LovMasterEndpointServiceEnum.INVENTORY:
          url = getInventoryLOVTypeUrl(saveForm.lovType);
          break;
        case LovMasterEndpointServiceEnum.PAYMENT:
          url = getPaymentLOVTypeUrl(saveForm.lovType);
          break;
        case LovMasterEndpointServiceEnum.CONFIG:
          url = getConfigLOVTypeUrl(saveForm.lovType);
          break;
      }

      service.createLovFormDetails(saveForm).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });
    it('should call getLOVTypeCreate LovMasterAdaptor method with correct arguments', () => {
      spyOn(LovMasterAdaptor, 'getLOVTypeCreate').and.returnValue(
        createResponse
      );
      let url = '';
      switch (saveForm.lovType) {
        case LovMasterEndpointServiceEnum.PRODUCT:
          url = getProductLOVTypeUrl(saveForm.lovType);
          break;
        case LovMasterEndpointServiceEnum.LOCATION:
          url = getLocationLOVTypeUrl(saveForm.lovType);
          break;
        case LovMasterEndpointServiceEnum.INVENTORY:
          url = getInventoryLOVTypeUrl(saveForm.lovType);
          break;
        case LovMasterEndpointServiceEnum.PAYMENT:
          url = getPaymentLOVTypeUrl(saveForm.lovType);
          break;
        case LovMasterEndpointServiceEnum.CONFIG:
          url = getConfigLOVTypeUrl(saveForm.lovType);
          break;
      }
      service.createLovFormDetails(saveForm).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl;
      });
      request.flush(createResponse);
      expect(LovMasterAdaptor.getLOVTypeCreate).toHaveBeenCalledWith(
        createResponse
      );
    });

    it('should retun data mapped by adaptor', () => {
      spyOn(LovMasterAdaptor, 'getLOVTypeCreate').and.returnValue(
        createResponse
      );

      let url = '';
      switch (saveForm.lovType) {
        case LovMasterEndpointServiceEnum.PRODUCT:
          url = getProductLOVTypeUrl(saveForm.lovType);
          break;
        case LovMasterEndpointServiceEnum.LOCATION:
          url = getLocationLOVTypeUrl(saveForm.lovType);
          break;
        case LovMasterEndpointServiceEnum.INVENTORY:
          url = getInventoryLOVTypeUrl(saveForm.lovType);
          break;
        case LovMasterEndpointServiceEnum.PAYMENT:
          url = getPaymentLOVTypeUrl(saveForm.lovType);
          break;
        case LovMasterEndpointServiceEnum.CONFIG:
          url = getConfigLOVTypeUrl(saveForm.lovType);
          break;
      }
      service.createLovFormDetails(saveForm).subscribe(data => {
        expect(data).toEqual(createResponse);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl;
      });
      request.flush({});
    });
  });
});
