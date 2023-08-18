import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
  DiscountConfigSuccessList,
  DiscountLocationListPayload,
  DiscountProductCategoryListPayload,
  DiscountProductGroupListPayload,
  discountWorkflowpayload,
  DisountConfigListPayload,
  FaqRequestPaylaod,
  MappedBestDealDiscountSuccessList,
  MappedDetails,
  NewDiscountDetails,
  RequestPayload,
  SaveDiscountThemesPayload,
  SaveExcludeTypePayload,
  TSSSRequestPayload,
  TSSSResponsePayload
} from '@poss-web/shared/models';
import { DiscountConfigAdaptor } from '@poss-web/shared/util-adaptors';
import {
  getBestDealDiscountUrl,
  getComputeTsssDiscountUrl,
  getDiscountApprovalRequesturl,
  getDiscountConfigsUrl,
  getDiscountDetailsByIdUrl,
  getDiscountDetailsUrl,
  getDiscountMappedBestDealDiscountUrl,
  getDiscountMappedLocationsUrl,
  getDiscountMappedProductCategoriesUrl,
  getDiscountMappedProductGroupsUrl,
  getDiscountProductGroupsByIdUrl,
  getDiscountSlabDetailsUrl,
  getDiscountWorkflowRequesturl,
  getEditDiscountDetailsUrl,
  getPublishDiscountUrl,
  getSaveDiscountDetailsUrl,
  getTepDurationUrl,
  getWorkFlowProcessUrl,
  saveDiscountExcludeThemesUrl,
  saveDiscountMappedBestDealDiscountUrl,
  uploadFaqDocUrl
} from '@poss-web/shared/util-api-service';
import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import * as moment from 'moment';
import { DiscountConfigService } from './discount-config.service';

describe('DiscountConfigService', () => {
  let httpTestingController: HttpTestingController;
  let discountConfigService: DiscountConfigService;
  const apiUrl = 'http://localhost:3000';

  const dummyresponse: TSSSResponsePayload = {
    filename: 'AFNNR213424DDSFF',
    url: new Blob()
  };

  const mappedDetails: MappedDetails[] = [
    {
      id: '1'
    },
    {
      id: '2'
    }
  ]

  const productGroupList: DiscountProductGroupListPayload = {
    id: '1',
    pagination: {
      pageIndex: 0,
      pageSize: 10
    },
    karatType: '',
    productType: ''
  }

  const discountWorkflow: discountWorkflowpayload = {
    id: '1',
    typeOfDiscount: 'clubbed',
    remarks: {
      remarks: 'Remarks'
    }
  };

  const dummyDiscount = {
    discountCode: 'Empowerment_Sep_Oct',
    occasion: 'Wedding',
    subBrandCode: 'Tanishq',
    brandCode: 'Tanishq',
    description: 'sfdsfsdg',
    discountType: 'EMPOWERMENT_DISCOUNT',
    approvedBy: 'RBM',
    isPreviewApplicable: false,
    isAbOfferApplicable: false,
    isCoOfferApplicable: false,
    isAccrualUlp: false,
    isRiva: null,
    ulpCreateDate: null,
    applicableLevels: ['L1', 'L2'],
    remarks: 'sfssg',
    isActive: true,
    cumulativeDetails: null,
    grnDetails: null,
    orderDetails: {
      type: 'ORDER_CONFIG',
      data: {
        isGoldRateFrozenForCO: false,
        isGoldRateFrozenForAB: false,
        offerPeriodForCO: 0,
        offerPeriodForAB: 0,
        coPercent: 0,
        abPercent: 0,
        isAllowedToChangeCO: false,
        isDisplayOnCO: false,
        isAllowedToChangeAB: false,
        isDisplayOnAB: false
      }
    },
    tepDetails: {
      type: 'TEP_CONFIG',
      data: {
        tepDetails: [{ durationInDays: '21-30', recoveryPercent: 100, id: '' }],
        isEnabled: true
      }
    },
    basicCriteria: {
      type: 'BASIC_CRITERIA',
      data: {
        isNarationMandatory: false,
        isTepRecovery: true,
        isEditable: false,
        isMultipleTransactionPerDayAllowed: null,
        maxTransactionPerDay: null,
        ucp: { isValue: null, value: null },
        startingSerialNo: null,
        tataEmployeeConfig: null,
        coinConfig: null,
        isFullValueTepDiscountRecovery: false,
        isApplicableForAutomatedDiscount: null,
        isBillValue: null,
        ucpValue: null
      }
    },
    clubOtherOffersConfig: {
      type: 'CLUB_OTHER_OFFERS_CONFIG',
      data: {
        isExchangeOffer: false,
        isFOCOffer: false,
        isGHS: false,
        isRiva: false,
        isDV: false,
        isCoin: false,
        isBillLevelDiscount: false
      }
    },
    clubDiscountType: {
      type: 'CLUB_DISCOUNT_TYPE',
      data: {
        discountType: 'TYPE2',
        isClubbedOtherDiscounts: true,
        isClubbedOtherBillLevelDiscounts: null
      }
    },
    abCoData: null,
    configDetails: {
      type: 'EXCHANGE_OFFER_CONFIG',
      data: {
        applicableCN: { isTep: false, isGep: false },
        minCNUtilizationPercent: null,
        isResidualFund: false
      }
    },
    itemGroupConfig: {
      type: 'BEST_DEAL_DISCOUNT',
      data: {
        maxMetalCharge: { percent: null, value: null },
        maxStoneCharges: { percent: null, value: null },
        maxUCP: { percent: null, value: null },
        maxWastage: { percent: null, value: null },
        maxMC: { percent: null, value: null },
        maxPsPerGram: { percent: null, weight: null }
      }
    },
    applicableThemes: {
      type: 'HIGH_VALUE_DISCOUNT',
      data: {
        digit1: false,
        digit2: false,
        digit3: false,
        digit4: false,
        digit5: false,
        digit6: false,
        digit8: false,
        digit9: false,
        digit10: false,
        digit11: false,
        digit12: false,
        digit13: false,
        digit14: false
      }
    },
    clubbingDiscountType: 'TYPE2',
    id: 'E01E54A6-9A31-4B63-BBB1-6CD5504E1E7B',
    isPublishPending: false,
    publishTime: 1631011344620
  };

  const dummyBestDealDiscount = {
    results: [
      {
        id: 'F8C96A9E-66F6-4B8B-A479-5DFA33D32D51',
        srcDiscountCode: 'ASFF32',
        destDiscountCode: 'BEST DEAL SYNC',
        isDeletable: false,
        isActive: true
      },
      {
        id: 'FDA6627C-7A9A-45E6-9052-D42948D8966C',
        srcDiscountCode: 'ASFF32',
        destDiscountCode: 'Best12s3',
        isDeletable: false,
        isActive: true
      }
    ],
    pageNumber: 0,
    pageSize: 10,
    totalPages: 1,
    totalElements: 2
  };

  const saveDiscountThemes: SaveDiscountThemesPayload = {
    id: '1',
    excludeType: 'THEME_CODE',
    addThemes: [ '', ''],
    removeThemes: [ '', ''],
    updateThemes: [ '', '']
  }

  const mappedBestDiscount: MappedBestDealDiscountSuccessList = {
    mappedDetails: [
      {
        id: 'F8C96A9E-66F6-4B8B-A479-5DFA33D32D51',
        isActive: true
      },
      {
        id: 'FDA6627C-7A9A-45E6-9052-D42948D8966C',
        isActive: true
      }
    ],
    count: 10
  };

  const BestDiscount: DiscountConfigSuccessList = {
    discountConfigList: [
      {
        description: 'Sync Test',
        discountCode: 'SyncTest',
        discountType: 'BEST_DEAL_DISCOUNT',
        id: '9D064BCA-6590-4938-96C6-A9E4986E6072',
        isActive: true,
        isPublishPending: false,
        occasion: 'Sync',
        status: null,
        createdDate: moment(),
        lastModifiedDate: moment(),
        publishTime: moment()
      },
      {
        description: 'Sync Test',
        discountCode: 'SyncTest',
        discountType: 'BEST_DEAL_DISCOUNT',
        id: '9D064BCA-6590-4938-96C6-A9E4986E6072',
        isActive: true,
        isPublishPending: false,
        occasion: 'Sync',
        status: null,
        createdDate: moment(),
        lastModifiedDate: moment(),
        publishTime: moment()
      }
    ],
    count: 10
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        DiscountConfigService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    discountConfigService = TestBed.inject(DiscountConfigService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(discountConfigService).toBeTruthy();
  });

  describe('getDownloadUrlOfTsssConfig', () => {
    it('TSSS download url - should call GET api method with correct url and params', () => {
      spyOn(DiscountConfigAdaptor, 'getTSSSConfigCouponUrl').and.returnValue(
        {}
      );
      const payload = 'AFNNR213424DDSFF';
      const response = new Blob();

      const path = getComputeTsssDiscountUrl(payload);

      discountConfigService.getDownloadUrlOfTsssConfig(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('blob');

      request.flush(response);
    });

    it('should call DiscountConfigAdaptor method with correct arguments', () => {
      spyOn(DiscountConfigAdaptor, 'getTSSSConfigCouponUrl').and.returnValue(
        {}
      );
      const payload = 'AFNNR213424DDSFF';
      const response = new Blob();

      const path = getComputeTsssDiscountUrl(payload);

      discountConfigService.getDownloadUrlOfTsssConfig(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(response);
      expect(DiscountConfigAdaptor.getTSSSConfigCouponUrl).toHaveBeenCalledWith(
        dummyresponse.url,
        'AFNNR213424DDSFF'
      );
    });

    it('should retun data mapped by DiscountConfigAdaptor', () => {
      spyOn(DiscountConfigAdaptor, 'getTSSSConfigCouponUrl').and.returnValue(
        dummyresponse
      );
      const response = new Blob();
      const payload = 'AFNNR213424DDSFF';

      const path = getComputeTsssDiscountUrl(payload);

      discountConfigService
        .getDownloadUrlOfTsssConfig(payload)
        .subscribe(data => {
          expect(data).toEqual(dummyresponse);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush(response);
    });
  });

  describe('computeTSSSConfig', () => {
    it('computeTSSSConfig - should call GET api method with correct url and params', () => {
      const payload: TSSSRequestPayload = {
        discountId: 'AFNNR213424DDSFF',
        couponRequest: null
      };

      const path = getComputeTsssDiscountUrl('AFNNR213424DDSFF');

      discountConfigService.computeTSSSConfig(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });
  });

  describe('getEmpowermentDiscountDetails', () => {
    it('getEmpowermentDiscountDetails - should call GET api method with correct url and params', () => {
      spyOn(
        DiscountConfigAdaptor,
        'getDiscountEmpowermentDetails'
      ).and.returnValue({});
      const payload = {
        discountId: 'E01E54A6-9A31-4B63-BBB1-6CD5504E1E7B'
      };

      const path = getDiscountDetailsUrl(payload.discountId);

      discountConfigService.getEmpowermentDiscountDetails(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });

    it('should call DiscountConfigAdaptor method with correct arguments', () => {
      spyOn(
        DiscountConfigAdaptor,
        'getDiscountEmpowermentDetails'
      ).and.returnValue({});
      const payload = { discountId: 'E01E54A6-9A31-4B63-BBB1-6CD5504E1E7B' };
      const path = getDiscountDetailsUrl(payload.discountId);

      discountConfigService.getEmpowermentDiscountDetails(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });

      request.flush(dummyDiscount);
      expect(
        DiscountConfigAdaptor.getDiscountEmpowermentDetails
      ).toHaveBeenCalledWith(undefined);
    });

    it('should retun data mapped by DiscountConfigAdaptor', () => {
      spyOn(
        DiscountConfigAdaptor,
        'getDiscountEmpowermentDetails'
      ).and.returnValue(dummyDiscount);

      const payload = { discountId: 'E01E54A6-9A31-4B63-BBB1-6CD5504E1E7B' };

      const path = getDiscountDetailsUrl(payload.discountId);

      discountConfigService
        .getEmpowermentDiscountDetails(payload)
        .subscribe(data => {
          expect(data).toEqual(dummyDiscount);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush({});
    });
  });

  describe('updateEmpowermentDiscountDetails', () => {
    it('updateEmpowermentDiscountDetails - should call GET api method with correct url and params', () => {
      spyOn(
        DiscountConfigAdaptor,
        'getDiscountEmpowermentDetails'
      ).and.returnValue({});
      const payload = {
        discountId: 'E01E54A6-9A31-4B63-BBB1-6CD5504E1E7B',
        discountComponents: null
      };

      const path = getDiscountDetailsUrl(payload.discountId);

      discountConfigService
        .updateEmpowermentDiscountDetails(payload)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });

    it('should call DiscountConfigAdaptor method with correct arguments', () => {
      spyOn(
        DiscountConfigAdaptor,
        'getDiscountEmpowermentDetails'
      ).and.returnValue({});
      const payload = {
        discountId: 'E01E54A6-9A31-4B63-BBB1-6CD5504E1E7B',
        discountComponents: null
      };
      const path = getDiscountDetailsUrl(payload.discountId);

      discountConfigService
        .updateEmpowermentDiscountDetails(payload)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });

      request.flush(dummyDiscount);
      expect(
        DiscountConfigAdaptor.getDiscountEmpowermentDetails
      ).toHaveBeenCalledWith(undefined);
    });

    it('should retun data mapped by DiscountConfigAdaptor', () => {
      spyOn(
        DiscountConfigAdaptor,
        'getDiscountEmpowermentDetails'
      ).and.returnValue(dummyDiscount);

      const payload = {
        discountId: 'E01E54A6-9A31-4B63-BBB1-6CD5504E1E7B',
        discountComponents: null
      };

      const path = getDiscountDetailsUrl(payload.discountId);

      discountConfigService
        .updateEmpowermentDiscountDetails(payload)
        .subscribe(data => {
          expect(data).toEqual(dummyDiscount);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush({});
    });
  });

  describe('saveMappedBestDealDiscount', () => {
    it('saveMappedBestDealDiscount - should call PATCH api method with correct url and params', () => {
      const payload = {
        id: 'AFNNR213424DDSFF'
      };

      const path = saveDiscountMappedBestDealDiscountUrl(payload.id);

      discountConfigService.saveMappedBestDealDiscount(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });
  });

  describe('getSelectedBestDealDiscount', () => {
    it('getSelectedBestDealDiscount - should call GET api method with correct url and params', () => {
      spyOn(
        DiscountConfigAdaptor,
        'getMappedBestDealDsicountList'
      ).and.returnValue({});
      const payload = {
        id: 'E01E54A6-9A31-4B63-BBB1-6CD5504E1E7B',
        pageIndex: 0,
        pageSize: 10
      };

      const path = getDiscountMappedBestDealDiscountUrl(payload);

      discountConfigService.getSelectedBestDealDiscount(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });

    it('should call DiscountConfigAdaptor method with correct arguments', () => {
      spyOn(
        DiscountConfigAdaptor,
        'getMappedBestDealDsicountList'
      ).and.returnValue({});
      const payload = {
        id: 'E01E54A6-9A31-4B63-BBB1-6CD5504E1E7B',
        pageIndex: 0,
        pageSize: 10
      };
      const path = getDiscountMappedBestDealDiscountUrl(payload);

      discountConfigService.getSelectedBestDealDiscount(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });

      request.flush(dummyBestDealDiscount);
      expect(
        DiscountConfigAdaptor.getMappedBestDealDsicountList
      ).toHaveBeenCalledWith(dummyBestDealDiscount);
    });

    it('should retun data mapped by DiscountConfigAdaptor', () => {
      spyOn(
        DiscountConfigAdaptor,
        'getMappedBestDealDsicountList'
      ).and.returnValue(mappedBestDiscount);

      const payload = {
        id: 'E01E54A6-9A31-4B63-BBB1-6CD5504E1E7B',
        pageIndex: 0,
        pageSize: 10
      };

      const path = getDiscountMappedBestDealDiscountUrl(payload);

      discountConfigService
        .getSelectedBestDealDiscount(payload)
        .subscribe(data => {
          expect(data).toEqual(mappedBestDiscount);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush({});
    });
  });

  describe('publishDiscount', () => {
    it('publishDiscount - should call POST api method with correct url and params', () => {
      const payload = 'AFNNR213424DDSFF';

      const path = getPublishDiscountUrl(payload);

      discountConfigService.publishDiscount(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });
  });

  describe('loadBeastDealDiscount', () => {
    it('loadBeastDealDiscount - should call GET api method with correct url and params', () => {
      spyOn(DiscountConfigAdaptor, 'getDiscountConfigList').and.returnValue({});
      const payload = {
        pageIndex: 0,
        pageSize: 10,
        discountType: 'HIGH-VALUE-DISCOUNT',
        isPageable: false
      };

      const path = getBestDealDiscountUrl(
        payload.discountType,
        payload.isPageable
      );

      discountConfigService.loadBeastDealDiscount(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });

    it('should call DiscountConfigAdaptor method with correct arguments', () => {
      spyOn(DiscountConfigAdaptor, 'getDiscountConfigList').and.returnValue({});
      const payload = {
        pageIndex: 0,
        pageSize: 10,
        discountType: 'HIGH-VALUE-DISCOUNT',
        isPageable: false
      };
      const path = getBestDealDiscountUrl(
        payload.discountType,
        payload.isPageable
      );

      discountConfigService.loadBeastDealDiscount(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });

      request.flush(dummyBestDealDiscount);
      expect(DiscountConfigAdaptor.getDiscountConfigList).toHaveBeenCalledWith(
        dummyBestDealDiscount
      );
    });

    it('should retun data mapped by DiscountConfigAdaptor', () => {
      spyOn(DiscountConfigAdaptor, 'getDiscountConfigList').and.returnValue(
        BestDiscount
      );

      const payload = {
        pageIndex: 0,
        pageSize: 10,
        discountType: 'HIGH-VALUE-DISCOUNT',
        isPageable: false
      };

      const path = getBestDealDiscountUrl(
        payload.discountType,
        payload.isPageable
      );

      discountConfigService.loadBeastDealDiscount(payload).subscribe(data => {
        expect(data.discountConfigList).toEqual(
          BestDiscount.discountConfigList
        );
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush({});
    });
  });

  describe('loadDiscountConfigList', () => {
    it('loadDiscountConfigList - should call GET api method with correct url and params', () => {
      spyOn(DiscountConfigAdaptor, 'getDiscountConfigList').and.returnValue({});
      const payload: DisountConfigListPayload = {
        pageIndex: 0,
        pageSize: 10,
        discountType: 'HIGH-VALUE-DISCOUNT',
        isPageable: false
      };

      const path = getDiscountConfigsUrl(
        payload.pageIndex,
        payload.pageSize,
        payload.discountCode,
        payload.discountType,
        payload.status,
        payload.publishStatus,
        payload.occasion
      );

      discountConfigService.loadDiscountConfigList(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });

    it('should call DiscountConfigAdaptor method with correct arguments', () => {
      spyOn(DiscountConfigAdaptor, 'getDiscountConfigList').and.returnValue({});
      const payload: DisountConfigListPayload = {
        pageIndex: 0,
        pageSize: 10,
        discountType: 'HIGH-VALUE-DISCOUNT',
        isPageable: false
      };
      const path = getDiscountConfigsUrl(
        payload.pageIndex,
        payload.pageSize,
        payload.discountCode,
        payload.discountType,
        payload.status,
        payload.publishStatus,
        payload.occasion
      );

      discountConfigService.loadDiscountConfigList(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });

      request.flush(dummyBestDealDiscount);
      expect(DiscountConfigAdaptor.getDiscountConfigList).toHaveBeenCalledWith(
        dummyBestDealDiscount
      );
    });

    it('should retun data mapped by DiscountConfigAdaptor', () => {
      spyOn(DiscountConfigAdaptor, 'getDiscountConfigList').and.returnValue(
        BestDiscount
      );

      const payload: DisountConfigListPayload = {
        pageIndex: 0,
        pageSize: 10,
        discountType: 'HIGH-VALUE-DISCOUNT',
        isPageable: false
      };
      const path = getDiscountConfigsUrl(
        payload.pageIndex,
        payload.pageSize,
        payload.discountCode,
        payload.discountType,
        payload.status,
        payload.publishStatus,
        payload.occasion
      );

      discountConfigService.loadDiscountConfigList(payload).subscribe(data => {
        expect(data.discountConfigList).toEqual(
          BestDiscount.discountConfigList
        );
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      request.flush({});
    });
  });

  describe('loadDiscountDetailsById', () => {
    it('loadDiscountDetailsById - should call GET api method with correct url and params', () => {
      spyOn(DiscountConfigAdaptor, 'getNewDiscountDetails').and.returnValue(
        {}
      );
      const payload = 'new';

      const path = getDiscountDetailsByIdUrl(payload);

      discountConfigService.loadDiscountDetailsById(payload
        ).subscribe();

      /* const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');

      request.flush({}); */
    });

    it('should call DiscountConfigAdaptor method with correct arguments', () => {
      spyOn(DiscountConfigAdaptor, 'getDiscountDetailsById').and.returnValue(
        {}
      );
      const payload = 'ASADWFFFF';

      const path = getDiscountDetailsByIdUrl(payload);

      discountConfigService.loadDiscountDetailsById(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(dummyDiscount);
      expect(DiscountConfigAdaptor.getDiscountDetailsById).toHaveBeenCalledWith(
        dummyDiscount
      );
    });

    it('should retun data mapped by DiscountConfigAdaptor', () => {
      spyOn(DiscountConfigAdaptor, 'getDiscountDetailsById').and.returnValue(
        dummyDiscount
      );

      const payload = 'ASADWFFFF';

      const path = getDiscountDetailsByIdUrl(payload);

      discountConfigService.loadDiscountDetailsById(payload).subscribe(data => {
        expect(data).toEqual(dummyDiscount);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush({});
    });
  });

  describe('saveDiscountsDetails', () => {
    it('saveDiscountsDetails - should call POST api method with correct url and params', () => {
      const payload: NewDiscountDetails = null;

      const path = getSaveDiscountDetailsUrl();

      discountConfigService.saveDiscountsDetails(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });
  });

  describe('editDiscountDetails', () => {
    it('editDiscountDetails - should call PATCH api method with correct url and params', () => {
      const payload = {
        id: 'AFNNR213424DDSFF',
        editDetails: null
      };

      const path = getEditDiscountDetailsUrl(payload.id);

      discountConfigService
        .editDiscountDetails(payload.id, payload.editDetails)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });
  });

  describe('saveSlabDetails', () => {
    it('saveSlabDetails - should call PATCH api method with correct url and params', () => {
      const payload = {
        discountId: 'E01E54A6-9A31-4B63-BBB1-6CD5504E1E7B'
      };

      const path = getDiscountSlabDetailsUrl(payload.discountId);

      discountConfigService.saveSlabDetails(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });
  });

  describe('saveDiscountDetails', () => {
    it('saveDiscountsDetails - should call PATCH api method with correct url and params', () => {
      spyOn(DiscountConfigAdaptor, 'getDiscountSlabDetails').and.returnValue(
        {}
      );
      const payload = {
        discountId: 'E01E54A6-9A31-4B63-BBB1-6CD5504E1E7B'
      };

      const path = getDiscountDetailsUrl(payload.discountId).path;

      discountConfigService.saveDiscountDetails(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });

    it('should call DiscountConfigAdaptor method with correct arguments', () => {
      spyOn(DiscountConfigAdaptor, 'getDiscountSlabDetails').and.returnValue(
        {}
      );
      const payload = {
        discountId: 'E01E54A6-9A31-4B63-BBB1-6CD5504E1E7B'
      };

      const path = getDiscountDetailsUrl(payload.discountId).path;

      discountConfigService.saveDiscountDetails(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush(dummyDiscount);
      expect(DiscountConfigAdaptor.getDiscountSlabDetails).toHaveBeenCalledWith(
        undefined
      );
    });

    it('should retun data mapped by DiscountConfigAdaptor', () => {
      spyOn(DiscountConfigAdaptor, 'getDiscountSlabDetails').and.returnValue(
        dummyDiscount
      );
      const payload = {
        discountId: 'E01E54A6-9A31-4B63-BBB1-6CD5504E1E7B'
      };

      const path = getDiscountDetailsUrl(payload.discountId).path;

      discountConfigService.saveDiscountDetails(payload).subscribe(data => {
        expect(data).toEqual(dummyDiscount);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });

  describe('loadDiscountDetails', () => {
    it('loadDiscountDetails - should call GET api method with correct url and params', () => {
      const payload = {
        discountId: 'E01E54A6-9A31-4B63-BBB1-6CD5504E1E7B'
      };

      const path = getDiscountDetailsUrl(payload.discountId);

      discountConfigService.loadDiscountDetails(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });
  });

  describe('getSelectedProductGroups', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(
        DiscountConfigAdaptor,
        'getMappedProductGroupList'
      ).and.returnValue({});

      const path = getDiscountMappedProductGroupsUrl(
        productGroupList.id,
        productGroupList.pagination,
        productGroupList.karatType,
        productGroupList.productType
      ).path;

      discountConfigService.getSelectedProductGroups(productGroupList).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });

    describe('getMappedLocationsList', () => {
      it('should call POST api method with correct url and params', () => {
        spyOn(
          DiscountConfigAdaptor,
          'getDiscountLocations'
        ).and.returnValue({});
      const payload: DiscountLocationListPayload = {
        id: '1',
        pageIndex: 0,
        pageSize: 10,
        locationCode: ['CPD'],
        offerEndDate: moment(1657737000000),
        offerStartDate: moment(1655145000000),
        previewEndDate: moment(1657737000000),
        previewStartDate: moment(1655145000000),
        configDetails: null
      }

        const path = getDiscountMappedLocationsUrl(
          payload.id,
          true,
          payload.pageIndex,
          payload.pageSize,
          payload.offerEndDate,
          payload.offerStartDate,
          payload.previewStartDate,
          payload.previewEndDate
        ).path;

        discountConfigService.getMappedLocationsList(payload).subscribe();

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
          DiscountConfigAdaptor,
          'getDiscountLocations'
        ).and.returnValue({});
      const payload: DiscountLocationListPayload = {
        id: '1',
        pageIndex: 0,
        pageSize: 10,
        locationCode: [],
        offerEndDate: null,
        offerStartDate: null,
        previewEndDate: null,
        previewStartDate: null,
        configDetails: null
      }

        const path = getDiscountMappedLocationsUrl(
          payload.id,
          true,
          payload.pageIndex,
          payload.pageSize,
          payload.offerEndDate,
          payload.offerStartDate,
          payload.previewStartDate,
          payload.previewEndDate
        ).path;

        discountConfigService.getMappedLocationsList(payload).subscribe();

        const request = httpTestingController.expectOne(req => {
          return req.url === apiUrl + path;
        });
        expect(request.cancelled).toBeFalsy();
        expect(request.request.method).toEqual('POST');
        expect(request.request.responseType).toEqual('json');

        request.flush({});
      });
    });

    describe('loadRangeTepDurationDays', () => {
      it('should call GET api with correct url and params', () => {
        spyOn(
          DiscountConfigAdaptor,
          'getRangeTepDuration'
        ).and.returnValue({});

        const path = getTepDurationUrl().path;

        discountConfigService.loadRangeTepDurationDays().subscribe();

        const request = httpTestingController.expectOne(req => {
          return req.url === apiUrl + path;
        });
        expect(request.cancelled).toBeFalsy();
        expect(request.request.method).toEqual('GET');
        expect(request.request.responseType).toEqual('json');

        request.flush({});
      });
    });

    describe('sendDiscountForApproval', () => {
      it('should call PATCH api method with correct url and params', () => {
        const payload: discountWorkflowpayload = {
          id: '1',
          typeOfDiscount: 'clubbed',
          remarks: {
            remarks: 'Remarks'
          }
        };

        const path = getDiscountWorkflowRequesturl(
          payload.id,
          payload.typeOfDiscount
        ).path;

        discountConfigService.sendDiscountForApproval(payload).subscribe();

        const request = httpTestingController.expectOne(req => {
          return req.url === apiUrl + path;
        });
        expect(request.cancelled).toBeFalsy();
        expect(request.request.method).toEqual('PATCH');
        expect(request.request.responseType).toEqual('json');

        request.flush({});
      })
    })

    describe('approveOrCancelDiscount', () => {
      it('should call PATCH api method with correct url and params', () => {

        const path = getDiscountApprovalRequesturl(
          discountWorkflow.id,
          discountWorkflow.approvalStatus
        ).path;

        discountConfigService.approveOrCancelDiscount(discountWorkflow).subscribe();

        const request = httpTestingController.expectOne(req => {
          return req.url === apiUrl + path;
        });
        expect(request.cancelled).toBeFalsy();
        expect(request.request.method).toEqual('PATCH');
        expect(request.request.responseType).toEqual('json');

        request.flush({});
      })
    })

    describe('uploadFaq', () => {
      it('should call POST api method with correct url and params', () => {

        const payload: FaqRequestPaylaod = {
          docType: 'DISCOUNT_WORKFLOW',
          file: null,
          fileType: 'OTHERS'
        }
        const path = uploadFaqDocUrl(
          payload.docType,
          payload.fileType
        ).path;

        discountConfigService.uploadFaq(payload).subscribe();

        const request = httpTestingController.expectOne(req => {
          return req.url === apiUrl + path;
        });
        expect(request.cancelled).toBeFalsy();
        expect(request.request.method).toEqual('POST');
        expect(request.request.responseType).toEqual('text');

        request.flush({});
      });
    });

    describe('loadMappedProductGroups', () => {
      it('should call GET api with correct url and params', () => {
        spyOn(
          DiscountConfigAdaptor,
          'getMappedProductGroup'
        ).and.returnValue({});

        const path = getDiscountProductGroupsByIdUrl('1', '2', true).path;

        discountConfigService.loadMappedProductGroups('1', '2').subscribe();

        const request = httpTestingController.expectOne(req => {
          return req.url === apiUrl + path;
        });
        expect(request.cancelled).toBeFalsy();
        expect(request.request.method).toEqual('GET');
        expect(request.request.responseType).toEqual('json');

        request.flush({});
      });
    });

    describe('getMappedProductCategoryList', () => {
      it('should call GET api with correct url and params', () => {
        spyOn(
          DiscountConfigAdaptor,
          'getDiscountProductCategories'
        ).and.returnValue({});

        const payload: DiscountProductCategoryListPayload = {
          id: '1',
          pagination: {
            pageIndex: 0,
            pageSize: 10
          },
          productCategoryCode: 'ABC'
        }

        const path = getDiscountMappedProductCategoriesUrl(
          payload.id,
          true,
          payload.pagination.pageIndex,
          payload.pagination.pageSize,
          payload.productCategoryCode
        ).path;

        discountConfigService.getMappedProductCategoryList(payload).subscribe();

        const request = httpTestingController.expectOne(req => {
          return req.url === apiUrl + path;
        });
        expect(request.cancelled).toBeFalsy();
        expect(request.request.method).toEqual('GET');
        expect(request.request.responseType).toEqual('json');

        request.flush({});
      });
    });

    describe('getMappedProductGroupsList', () => {
      it('should call GET api with correct url and params', () => {
        spyOn(
          DiscountConfigAdaptor,
          'getDiscountProductGroups'
        ).and.returnValue({});

        const payload: DiscountProductGroupListPayload = {
          id: '1',
          pagination: {
            pageIndex: 0,
            pageSize: 10
          },
          karatType: '',
          productType: '',
          productGroupCodeList: [ '', '']
        }

        const path = getDiscountMappedProductGroupsUrl(
          payload.id,
          true,
          payload.karatType,
          payload.productType,
          payload.pagination.pageIndex,
          payload.pagination.pageSize,
          payload.productGroupCodeList
        ).path;

        discountConfigService.getMappedProductGroupsList(payload).subscribe();

        const request = httpTestingController.expectOne(req => {
          return req.url === apiUrl + path;
        });
        expect(request.cancelled).toBeFalsy();
        expect(request.request.method).toEqual('GET');
        expect(request.request.responseType).toEqual('json');

        request.flush({});
      });
    });

    describe('saveExcludeThemeCodes', () => {
      it('should call PATCH api method with correct url and params', () => {

        const path = saveDiscountExcludeThemesUrl(
          saveDiscountThemes.id,
          saveDiscountThemes.excludeType
        ).path;

        discountConfigService.saveExcludeThemeCodes(saveDiscountThemes).subscribe();

        const request = httpTestingController.expectOne(req => {
          return req.url === apiUrl + path;
        });
        expect(request.cancelled).toBeFalsy();
        expect(request.request.method).toEqual('PATCH');
        expect(request.request.responseType).toEqual('json');

        request.flush({});
      });
    });

    describe('getSelectedProductCategories', () => {
      it('should call GET api with correct url and params', () => {
        spyOn(
          DiscountConfigAdaptor,
          'getMappedProductCategoryList'
        ).and.returnValue({});

        const payload: DiscountProductCategoryListPayload = {
          id: '1',
          pagination: {
            pageIndex: 0,
            pageSize: 10
          },
          productCategoryCode: 'ABC'
        }

        const path = getDiscountMappedProductCategoriesUrl(
          payload.id,
          false
        ).path;

        discountConfigService.getSelectedProductCategories(payload).subscribe();

        const request = httpTestingController.expectOne(req => {
          return req.url === apiUrl + path;
        });
        expect(request.cancelled).toBeFalsy();
        expect(request.request.method).toEqual('GET');
        expect(request.request.responseType).toEqual('json');

        request.flush({});
      });
    });

    describe('loadRequest', () => {
      it('should call POST api method with correct url and params', () => {
        spyOn(
          DiscountConfigAdaptor,
          'getRequestList'
        )
        const payload: RequestPayload = {
          reqBody: {},
          requestParams: {}
        }
        const path = getWorkFlowProcessUrl(
          payload.requestParams,
        ).path;

        discountConfigService.loadRequest(payload).subscribe();

        const request = httpTestingController.expectOne(req => {
          return req.url === apiUrl + path;
        });
        expect(request.cancelled).toBeFalsy();
        expect(request.request.method).toEqual('POST');
        expect(request.request.responseType).toEqual('json');

        request.flush({});
      });
    });

    /* it('should call DiscountConfigAdaptor method with correct arguments', () => {
      spyOn(
        DiscountConfigAdaptor,
        'getMappedProductGroupList'
      ).and.returnValue({});

      const path = getDiscountMappedProductGroupsUrl(
        productGroupList.id,
        productGroupList.pagination,
        productGroupList.karatType,
        productGroupList.productType
      ).path;

      discountConfigService.getSelectedProductGroups(productGroupList).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      request.flush(mappedDetails);
      // expect(DiscountConfigAdaptor.getMappedProductGroupList).toHaveBeenCalledWith();
    });

    it('should retun data mapped by DiscountConfigAdaptor', () => {
      spyOn(DiscountConfigAdaptor, 'getMappedProductGroupList').and.returnValue(
        mappedDetails
      );

      const path = getDiscountMappedProductGroupsUrl(
        productGroupList.id,
        productGroupList.pagination,
        productGroupList.karatType,
        productGroupList.productType
      ).path;

      discountConfigService.getSelectedProductGroups(productGroupList).subscribe(data => {
        expect(data).toEqual(mappedDetails);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  }); */
  })
  // describe('getMappedProductCategoryList', () => {
  //   it('getMappedProductCategoryList - should call GET api method with correct url and params', () => {
  //     spyOn(
  //       DiscountConfigAdaptor,
  //       'getMappedBestDealDsicountList'
  //     ).and.returnValue({});
  //     const payload = {
  //       id: 'E01E54A6-9A31-4B63-BBB1-6CD5504E1E7B',
  //       pageIndex: 0,
  //       pageSize: 10
  //     };

  //     const path = getDiscountMappedBestDealDiscountUrl(payload);

  //     discountConfigService.getMappedProductCategoryList(payload).subscribe();

  //     const request = httpTestingController.expectOne(req => {
  //       return req.url === apiUrl + path.path;
  //     });
  //     expect(request.cancelled).toBeFalsy();
  //     expect(request.request.method).toEqual('GET');
  //     expect(request.request.responseType).toEqual('json');

  //     request.flush({});
  //   });

  //   it('should call DiscountConfigAdaptor method with correct arguments', () => {
  //     spyOn(
  //       DiscountConfigAdaptor,
  //       'getMappedBestDealDsicountList'
  //     ).and.returnValue({});
  //     const payload = {
  //       id: 'E01E54A6-9A31-4B63-BBB1-6CD5504E1E7B',
  //       pageIndex: 0,
  //       pageSize: 10
  //     };
  //     const path = getDiscountMappedBestDealDiscountUrl(payload);

  //     discountConfigService.getMappedProductCategoryList(payload).subscribe();

  //     const request = httpTestingController.expectOne(req => {
  //       return req.url === apiUrl + path.path;
  //     });

  //     request.flush(dummyBestDealDiscount);
  //     expect(
  //       DiscountConfigAdaptor.getMappedBestDealDsicountList
  //     ).toHaveBeenCalledWith(dummyBestDealDiscount);
  //   });

  //   it('should retun data mapped by DiscountConfigAdaptor', () => {
  //     spyOn(
  //       DiscountConfigAdaptor,
  //       'getMappedBestDealDsicountList'
  //     ).and.returnValue(mappedBestDiscount);

  //     const payload = {
  //       id: 'E01E54A6-9A31-4B63-BBB1-6CD5504E1E7B',
  //       pageIndex: 0,
  //       pageSize: 10
  //     };

  //     const path = getDiscountMappedBestDealDiscountUrl(payload);

  //     discountConfigService
  //       .getMappedProductCategoryList(payload)
  //       .subscribe(data => {
  //         expect(data).toEqual(mappedBestDiscount);
  //       });

  //     const request = httpTestingController.expectOne(req => {
  //       return req.url === apiUrl + path.path;
  //     });
  //     request.flush({});
  //   });
  // });
});
