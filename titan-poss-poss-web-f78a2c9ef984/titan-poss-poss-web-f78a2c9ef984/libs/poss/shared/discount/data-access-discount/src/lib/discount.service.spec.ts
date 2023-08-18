import { DiscountService } from './discount.service';
import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
  DiscountAdaptor,
  DiscountHelper
} from '@poss-web/shared/util-adaptors';
import {
  getAppliedTransactionLevelDiscountsEndPointUrl,
  getApplyTransactionLevelEndPointUrl,
  getAutoDiscounts,
  getCheckABCOEligibility,
  getConfirmTransactionLevelDiscountEndPointUrl,
  getDiscountVocherDetailsUrld,
  getEligibleItemsForGepPurityConfigId,
  getEligibleItemsForParticularDiscountUrl,
  getItemLevelDiscountsEndPointUrl,
  getLoadABCOConfigDetails,
  getLoadABCODiscountDetails,
  getLoadABCODiscounts,
  getLoadItemLevelDiscountsDetailsEndPointUrl,
  getLoadItemLevelDiscountsEndPointUrl,
  getRemoveAllTransactionLevelDiscountsEndPointUrl,
  getRemoveSelectedTransactionLevelDiscountEndPointUrl,
  getTransactionLevelDiscountsEndPointUrl,
  getUpdateTransactionLevelDiscountEndPointUrl
} from '@poss-web/shared/util-api-service';
import {
  ApplyDiscountRequest,
  AutoDiscRequest,
  ConfirmTransactionLevelDiscountPayload,
  DiscountHeaders,
  DiscountsRequestPayload,
  DiscountsResponse,
  DiscountTransactionLevelRequest,
  DiscountTransactionLevelResponse,
  DiscountVoucherDetailsRequestPayload,
  DiscountVoucherDetailsResponePayload,
  GepPurityConfigIdEligibleItemsRequestPayload,
  ItemLevelDiscountsDetailsRequestPayload,
  ItemLevelDiscountsRequestPayload,
  KaratOrCoinOfferEligibleItemsRequestPayload,
  LoadAppliedTransactionDiscountsRequest,
  RemoveAllAppliedTransactionLevelDiscountsPayload,
  RemoveAppliedTransactionLevelDiscountByIDPayload,
  SubTransactionTypeEnum,
  TransactionTypeEnum,
  UpdateTransactionLevelDiscountByIDPayload
} from '@poss-web/shared/models';
import * as moment from 'moment';

describe('DiscountService', () => {
  let service: DiscountService;
  let httpTestingController: HttpTestingController;
  const apiUrl = 'http://localhost:3000';
  const transactionLevelAvailableDiscountList = [
    {
      discountCode: 'bill123',
      discountType: 'BILL_LEVEL_DISCOUNT',
      discountId: '82A9B3CC-02B7-48A2-A7C4-8E25256CB694',
      itemDetails: null,
      basicCriteriaDetails: {
        isBillValue: true,
        isEditable: false,
        maxDiscount: 100000,
        maxNoOfTimes: 3,
        ucpValue: 5
      }
    },
    {
      discountCode: 'bill345',
      discountType: 'BILL_LEVEL_DISCOUNT',
      discountId: '82A9B3CC-02B7-48A2-A7C4-8E25256CB693',

      itemDetails: null,
      basicCriteriaDetails: {
        isBillValue: true,
        isEditable: true,
        maxDiscount: 100000,
        maxNoOfTimes: 3,
        ucpValue: 5
      }
    }
  ];
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        DiscountService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(DiscountService);
  });
  afterEach(() => {
    httpTestingController.verify();
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('loadAvailableTransactionLevelDiscounts', () => {
    it('should call POST api method with correct url and params', () => {
      spyOn(DiscountHelper, 'getBillLevelDiscounts').and.returnValue({});
      const paylaod: DiscountTransactionLevelRequest = {
        businessDate: '1624300200000',
        discountType: 'BILL_LEVEL_DISCOUNT'
      };
      const url = getTransactionLevelDiscountsEndPointUrl();
      service.loadAvailableTransactionLevelDiscounts(paylaod).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });

    it('should call DiscountHelper getBillLevelDiscounts method with correct  parameters', () => {
      spyOn(DiscountHelper, 'getBillLevelDiscounts').and.returnValue({});
      const paylaod: DiscountTransactionLevelRequest = {
        businessDate: '1624300200000',
        discountType: 'BILL_LEVEL_DISCOUNT'
      };
      const url = getTransactionLevelDiscountsEndPointUrl();
      service.loadAvailableTransactionLevelDiscounts(paylaod).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush({});
    });

    it('should return data mapped by helper', () => {
      spyOn(DiscountHelper, 'getBillLevelDiscounts').and.returnValue(
        transactionLevelAvailableDiscountList
      );
      const paylaod: DiscountTransactionLevelRequest = {
        businessDate: '1624300200000',
        discountType: 'BILL_LEVEL_DISCOUNT'
      };
      const url = getTransactionLevelDiscountsEndPointUrl();
      service
        .loadAvailableTransactionLevelDiscounts(paylaod)
        .subscribe(data1 => {
          expect(data1).toEqual(transactionLevelAvailableDiscountList);
        });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush({});
    });
  });
  describe('applyTransactionLevelDiscount', () => {
    it('should call POST api method with correct url and params', () => {
      const payload: ApplyDiscountRequest = {
        subTxnType: 'NEW_CM',
        transactionId: '49F02FAB-76CA-435A-BF84-A5E56E29AC76',
        discountType: 'BILL_LEVEL_DISCOUNT',
        txnType: 'CM',
        hasDiscounts: false,
        requestBody: {
          discountDetails: [
            {
              discountCode: 'Test bill discount',
              discountId: '3DFC0981-5F67-4CB4-BD90-80EE1421C2FC',
              discountType: 'BILL_LEVEL_DISCOUNT',
              discountValue: 1000,
              discountValueDetails: {},
              isEdited: false
            }
          ]
        }
      };

      const url = getApplyTransactionLevelEndPointUrl(
        payload.discountType,
        payload.txnType,
        payload.subTxnType,
        payload.transactionId
      );
      service.applyTransactionLevelDiscount(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      // expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });
    xit('should call api method with correct url and params', () => {
      const payload: ApplyDiscountRequest = {
        subTxnType: 'NEW_CM',
        transactionId: '49F02FAB-76CA-435A-BF84-A5E56E29AC76',
        discountType: 'BILL_LEVEL_DISCOUNT',
        txnType: 'CM',
        hasDiscounts: true,
        requestBody: {
          discountDetails: [
            {
              discountCode: 'Test bill discount',
              discountId: '3DFC0981-5F67-4CB4-BD90-80EE1421C2FC',
              discountType: 'BILL_LEVEL_DISCOUNT',
              discountValue: 1000,
              discountValueDetails: {},
              isEdited: false
            }
          ]
        }
      };

      const url = getRemoveAllTransactionLevelDiscountsEndPointUrl(
        payload.discountType,
        payload.txnType,
        payload.subTxnType,
        payload.transactionId
      );
      service.applyTransactionLevelDiscount(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      // expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });
  });
  describe('loadAppliedTransactionLevelDiscount', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(DiscountHelper, 'getDiscountsResponses').and.returnValue({});
      const payload: LoadAppliedTransactionDiscountsRequest = {
        subTxnType: 'NEW_CM',
        transactionId: '49F02FAB-76CA-435A-BF84-A5E56E29AC76',
        txnType: 'CM'
      };
      const url = getAppliedTransactionLevelDiscountsEndPointUrl(
        payload.discountType,
        payload.txnType,
        payload.subTxnType,
        payload.transactionId,
        payload.applicableLevel,
        payload.status
      );
      service.loadAppliedTransactionLevelDiscount(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      expect(request.request.params.get('txnType')).toEqual(payload.txnType);
      expect(request.request.params.get('subTxnType')).toEqual(
        payload.subTxnType
      );
      expect(request.request.params.get('transactionId')).toEqual(
        payload.transactionId
      );

      request.flush({});
    });

    it('should call DiscountHelper getDiscountsResponses method with correct  parameters', () => {
      spyOn(DiscountHelper, 'getDiscountsResponses').and.returnValue({});
      const payload: LoadAppliedTransactionDiscountsRequest = {
        subTxnType: 'NEW_CM',
        transactionId: '49F02FAB-76CA-435A-BF84-A5E56E29AC76',
        txnType: 'CM'
      };
      const appliedTransactionLevelDiscountList = [
        {
          discountCode: 'bill345',
          discountId: '82A9B3CC-02B7-48A2-A7C4-8E25256CB693',
          discountType: 'BILL_LEVEL_DISCOUNT',
          discountValue: 2,
          discountValueDetails: {
            type: 'DISCOUNT_VALUE_DETAILS',
            data: {
              discountValueDetails: [
                {
                  component: 'BILL_DISCOUNT',
                  discountPercent: null,
                  discountValue: 2,
                  isDiscountPercentage: true
                }
              ]
            }
          },
          referenceId: null,
          referenceType: null,
          isEdited: false,
          isAutoApplied: null,
          reason: null,
          discountTxnId: '7F93EB5A-75E5-4D27-B857-EEFC4C155519',
          itemId: null
        }
      ];
      const url = getAppliedTransactionLevelDiscountsEndPointUrl(
        payload.discountType,
        payload.txnType,
        payload.subTxnType,
        payload.transactionId,
        payload.applicableLevel,
        payload.status
      );

      service.loadAppliedTransactionLevelDiscount(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush(appliedTransactionLevelDiscountList);
      expect(DiscountHelper.getDiscountsResponses).toHaveBeenCalledWith(
        appliedTransactionLevelDiscountList
      );
    });

    it('should return data mapped by helper', () => {
      const payload: LoadAppliedTransactionDiscountsRequest = {
        subTxnType: 'NEW_CM',
        transactionId: '49F02FAB-76CA-435A-BF84-A5E56E29AC76',
        txnType: 'CM'
      };
      const appliedTransactionLevelDiscountList = [];
      spyOn(DiscountHelper, 'getDiscountsResponses').and.returnValue(
        appliedTransactionLevelDiscountList
      );

      const url = getAppliedTransactionLevelDiscountsEndPointUrl(
        payload.discountType,
        payload.txnType,
        payload.subTxnType,
        payload.transactionId,
        payload.applicableLevel,
        payload.status
      );
      service.loadAppliedTransactionLevelDiscount(payload).subscribe(data1 => {
        expect(data1).toEqual(appliedTransactionLevelDiscountList);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush({});
    });
  });
  describe('removeAllTransactionLevelDiscounts', () => {
    const payload: RemoveAllAppliedTransactionLevelDiscountsPayload = {
      subTxnType: 'NEW_CM',
      transactionId: '49F02FAB-76CA-435A-BF84-A5E56E29AC76',
      txnType: 'CM',
      discountType: 'BILL_LEVEL_DISCOUNT'
    };
    it('should call DELETE api method with correct url and params', () => {
      const url = getRemoveAllTransactionLevelDiscountsEndPointUrl(
        payload.discountType,
        payload.txnType,
        payload.subTxnType,
        payload.transactionId
      );
      service.removeAllTransactionLevelDiscounts(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('DELETE');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });
  });
  describe('removeSelectedTransactionLevelDiscount', () => {
    const payload: RemoveAppliedTransactionLevelDiscountByIDPayload = {
      subTxnType: 'NEW_CM',
      transactionId: '49F02FAB-76CA-435A-BF84-A5E56E29AC76',
      txnType: 'CM',
      discountType: 'BILL_LEVEL_DISCOUNT',
      discountId: '1111111111111'
    };
    it('should call DELETE api method with correct url and params', () => {
      const url = getRemoveSelectedTransactionLevelDiscountEndPointUrl(
        payload.discountId,
        payload.discountType,
        payload.txnType,
        payload.subTxnType,
        payload.transactionId
      );
      service.removeSelectedTransactionLevelDiscount(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('DELETE');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });
  });
  describe('updateTransactionLevelDiscount', () => {
    const payload: UpdateTransactionLevelDiscountByIDPayload = {
      subTxnType: 'NEW_CM',
      transactionId: '49F02FAB-76CA-435A-BF84-A5E56E29AC76',
      txnType: 'CM',
      discountType: 'BILL_LEVEL_DISCOUNT',
      isPriceUpdate: false
    };
    it('should call PATCH api method with correct url and params', () => {
      const url = getUpdateTransactionLevelDiscountEndPointUrl(
        payload.discountType,
        payload.txnType,
        payload.subTxnType,
        payload.transactionId,
        payload.isPriceUpdate
      );
      service.updateTransactionLevelDiscount(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });
  });
  describe('confirmTransactionLevelDiscount', () => {
    const payload: ConfirmTransactionLevelDiscountPayload = {
      subTxnType: 'NEW_CM',
      transactionId: '49F02FAB-76CA-435A-BF84-A5E56E29AC76',
      txnType: 'CM',
      discountType: 'BILL_LEVEL_DISCOUNT',
      discountTxnId: ['111111111111111']
    };
    const payload1: ConfirmTransactionLevelDiscountPayload = {
      subTxnType: 'NEW_CM',
      transactionId: '49F02FAB-76CA-435A-BF84-A5E56E29AC76',
      txnType: 'CM',
      discountType: 'BILL_LEVEL_DISCOUNT',
      discountTxnId: []
    };
    it('should call PUT api method with correct url and params', () => {
      const url = getConfirmTransactionLevelDiscountEndPointUrl(
        payload.discountType,
        payload.txnType,
        payload.subTxnType,
        payload.transactionId
      );
      service.confirmTransactionLevelDiscount(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PUT');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });
    it('should call PUT api method with correct url and params', () => {
      const url = getConfirmTransactionLevelDiscountEndPointUrl(
        payload1.discountType,
        payload1.txnType,
        payload1.subTxnType,
        payload1.transactionId
      );
      service.confirmTransactionLevelDiscount(payload1).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PUT');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });
  });

  // Item Level Discounts

  describe('loadItemLevelDiscounts', () => {
    const payload: ItemLevelDiscountsRequestPayload = {
      businessDate: 1650652200000,
      itemDetails: {
        itemCode: '511881VQMQ2AP1',
        lotNumber: '2CD000002',
        mfgDate: moment(1608834600000),
        stockInwardDate: moment(1614450600000),
        totalTax: 4966.33,
        totalWeight: 52.731,
        netWeight: 52.731,
        totalValue: 365890.83,
        complexityPercent: 26,
        makingChargePerGram: 0,
        productCategoryCode: 'V',
        productGroupCode: '75'
      },
      transactionDetails: {
        transactionType: 'CM',
        subTransactionType: 'NEW_CM',
        isFrozenRate: null
      },
      encircleDiscount: {},
      employeeDetails: {},
      tsssDetails: null,
      tataEmployeeDetails: null,
      empowermentDetails: null,
      rivaahGhsDetails: null
    };
    const response: DiscountHeaders = {
      discounts: [
        {
          discountType: 'CATEGORY_DISCOUNT',
          discountId: '898642B7-28FC-4149-B64E-9AC79DD53323',
          discountCode: 'catapr22',
          refDiscountTxnId: null,
          discountAttributes: {
            isRiva: true,
            isAccrualUlpPoints: false,
            clubbingDiscountType: 'TYPE1',
            occasion: 'catapr22'
          },
          rivaahGhsDetails: null
        }
      ],
      clubDiscounts: []
    };
    it('should call POST api method with correct url and params', () => {
      spyOn(DiscountAdaptor, 'getDiscountHeader').and.returnValue({});
      const url = getLoadItemLevelDiscountsEndPointUrl();
      service.loadItemLevelDiscounts(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });

    it('should call DiscountAdaptor getDiscountHeader method with correct  parameters', () => {
      spyOn(DiscountAdaptor, 'getDiscountHeader').and.returnValue({});
      const url = getLoadItemLevelDiscountsEndPointUrl();
      service.loadItemLevelDiscounts(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      request.flush(response);
      expect(DiscountAdaptor.getDiscountHeader).toHaveBeenCalledWith(response);
    });

    it('should return data mapped by helper', () => {
      spyOn(DiscountAdaptor, 'getDiscountHeader').and.returnValue(response);
      const url = getLoadItemLevelDiscountsEndPointUrl();
      service.loadItemLevelDiscounts(payload).subscribe(data1 => {
        expect(data1).toEqual(response);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush({});
    });
  });

  describe('loadItemLevelDiscountsDetails', () => {
    const payload: ItemLevelDiscountsDetailsRequestPayload = {
      requestBody: {
        businessDate: 1650652200000,
        itemDetails: {
          itemCode: '511881VQMQ2AP1',
          lotNumber: '2CD000002',
          productCategoryCode: 'V',
          productGroupCode: '75',
          priceDetails: {
            isUcp: false,
            printGuranteeCard: false,
            metalPriceDetails: {
              preDiscountValue: 290020.5,
              metalPrices: [
                {
                  weightUnit: 'gms',
                  netWeight: 52.731,
                  metalValue: 290020.5,
                  type: 'Gold',
                  ratePerUnit: 5500,
                  karat: 22,
                  purity: 92,
                  metalTypeCode: 'J'
                }
              ]
            },
            stonePriceDetails: {
              numberOfStones: null,
              preDiscountValue: 465,
              stoneWeight: null,
              weightUnit: null,
              stoneWeightForView: null,
              weightUnitForView: null
            },
            makingChargeDetails: {
              preDiscountValue: 75405.33,
              makingChargePercentage: 26,
              isDynamicPricing: false,
              makingChargePct: 0,
              makingChargePgram: 0,
              wastagePct: 26
            },
            itemHallmarkDetails: {
              hallmarkGstPct: null,
              hallmarkingCharges: null,
              hmQuantity: null,
              isFOCForHallmarkingCharges: null,
              isHallmarked: true
            },
            netWeight: 52.731
          },
          totalQuantity: 1,
          totalValue: 365890.83,
          totalWeight: 52.731,
          netWeight: 52.731,
          totalTax: 4966.33
        },
        customerDetails: {
          enrollmentDate: moment(1650652200000),
          ulpId: '700001358840'
        },
        transactionDetails: {
          transactionType: 'CM',
          subTransactionType: 'NEW_CM',
          isFrozenRate: null
        },
        eligibleRivaahGhsDetails: null
      },
      discountId: '',
      discountClubId: '',
      data: null
    };
    const response = {
      discountConfigDetails: [
        {
          discountValue: 34802.46,
          discountValueDetails: [
            {
              component: 'UCP',
              discountValue: 0,
              discountPercent: null,
              isDiscountPercentage: null
            },
            {
              component: 'MAKING_CHARGE',
              discountValue: 0,
              discountPercent: null,
              isDiscountPercentage: null
            },
            {
              component: 'METAL_CHARGE',
              discountValue: 34802.46,
              discountPercent: 12,
              isDiscountPercentage: true
            },
            {
              component: 'STONE_CHARGE',
              discountValue: 0,
              discountPercent: null,
              isDiscountPercentage: null
            },
            {
              component: 'UNIT_WEIGHT',
              discountValue: 0,
              discountPercent: null,
              isDiscountPercentage: null
            }
          ],
          discountConfigDetails: {
            discountType: 'CATEGORY_DISCOUNT',
            discountId: '898642B7-28FC-4149-B64E-9AC79DD53323',
            discountCode: 'catapr22',
            refDiscountTxnId: null,
            basicCriteriaDetails: {
              isNarationMandatory: false,
              maxDiscount: 0,
              isEditable: false,
              isTepRecovery: true,
              isBillValue: false,
              ucpValue: 0,
              isFullValueTepDiscountRecovery: false,
              coinPurchaseStartDate: moment(),
              coinPurchaseEndDate: moment(),
              tepPeriodStartDate: moment(),
              tepPeriodEndDate: moment(),
              tepCNUtilizationPercent: 1,
              startingSerialNo: 1,
              isUploadMandatory: false,
              isNameMandatory: false,
              startingSerialNoEmpDiscountType: 0,
              startingSerialNoTataEmpDiscountType: 0,
              isMultipleTrnsctnAllowedOnSameDay: false,
              maxNoOfTimes: 1,
              maxCount: 1,
              isApplicableForAutomatedDiscount: true,
              isFullValueTepRecovery: false
            },
            discountAttributes: {
              isRiva: true,
              isAccrualUlpPoints: false,
              clubbingDiscountType: 'TYPE1',
              occasion: 'catapr22'
            },
            clubbingDetails: {
              isExchangeOffer: true,
              isGHS: true,
              isRiva: false,
              isEmpowerment: false,
              isDV: true,
              isFOCOffer: true,
              isCBOOffer: false,
              isBillLevelDiscount: true,
              isOtherBillLevelDiscount: false,
              isCoin: true
            },
            grnConfigDetails: {
              noOfDaysAllowedBeforeOfferPeriod: 0,
              noOfDaysAllowedAfterOfferPeriod: 0,
              utilizationPercent: 0,
              isAllowedBeforeOffer: false,
              isSameCfaEligible: false
            },
            tepConfigDetails: {
              tepDetails: [{ durationInDays: '10-20', recoveryPercent: 95 }],
              enabled: false
            },
            orderConfigDetails: {
              isGoldRateFrozenForCO: false,
              isGoldRateFrozenForAB: false,
              isDisplayOnAB: false,
              isAllowedToChangeCO: false,
              isAllowedToChangeAB: false,
              isDisplayOnCO: false,
              offerPeriodForCO: 0,
              offerPeriodForAB: 0,
              coPercent: 0,
              abPercent: 0
            },
            locationOfferDetails: {
              offerStartDate: moment(1648751400000),
              offerEndDate: moment(1672425000000),
              configDetails: null,
              empowermentQuarterMaxDiscountValue: 0,
              previewOfferStartDate: moment(1648751400000),
              previewOfferEndDate: moment(1672425000000)
            }
          },
          rivaahGhsDetails: null
        }
      ],
      clubbingId: '',
      data: null
    };
    it('should call POST api method with correct url and params', () => {
      spyOn(
        DiscountHelper,
        'getDiscountConfigDetailsResponses'
      ).and.returnValue({});
      const url = getLoadItemLevelDiscountsDetailsEndPointUrl(
        payload.discountId,
        payload.discountClubId
      );
      service.loadItemLevelDiscountsDetails(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });

    it('should return data mapped by helper', () => {
      spyOn(
        DiscountHelper,
        'getDiscountConfigDetailsResponses'
      ).and.returnValue(response);
      const url = getLoadItemLevelDiscountsDetailsEndPointUrl(
        payload.discountId,
        payload.discountClubId
      );
      service.loadItemLevelDiscountsDetails(payload).subscribe(data1 => {
        expect(data1).toEqual(response);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush({});
    });
  });

  describe('GetItemLevelDiscounts', () => {
    const payload: DiscountsRequestPayload = {
      txnType: TransactionTypeEnum.CM,
      subTxnType: SubTransactionTypeEnum.NEW_CM,
      transactionId: ''
    };
    const response: DiscountsResponse[] = [
      {
        discountCode: 'catapr22',
        discountType: 'CATEGORY_DISCOUNT',
        discountId: '898642B7-28FC-4149-B64E-9AC79DD53323',
        discountValue: 34802.46,
        discountValueDetails: {
          type: 'DISCOUNT_VALUE_DETAILS',
          data: [
            {
              component: 'UCP',
              discountValue: 0,
              discountPercent: null,
              isDiscountPercentage: null
            },
            {
              component: 'MAKING_CHARGE',
              discountValue: 0,
              discountPercent: null,
              isDiscountPercentage: null
            },
            {
              component: 'METAL_CHARGE',
              discountValue: 34802.46,
              discountPercent: 12,
              isDiscountPercentage: true
            },
            {
              component: 'STONE_CHARGE',
              discountValue: 0,
              discountPercent: null,
              isDiscountPercentage: null
            },
            {
              component: 'UNIT_WEIGHT',
              discountValue: 0,
              discountPercent: null,
              isDiscountPercentage: null
            }
          ]
        },
        referenceId: null,
        referenceType: null,
        isEdited: false,
        clubbedDiscountId: null,
        discountSubType: null,
        discountTxnId: '9BC4129C-0571-4EB2-A02E-F1959E97EBC1',
        itemId: 'C5FF8C3F-2B72-48BD-9BA5-3225BE5B1354',
        discountAttributes: {
          isRiva: true,
          isAccrualUlpPoints: false,
          clubbingDiscountType: 'TYPE1',
          occasion: 'catapr22'
        },
        status: 'CONFIRMED',
        txnLevelDiscountValueDetails: null,
        isNarationMandatory: false,
        occasion: ''
      }
    ];
    it('should call GET api method with correct url and params', () => {
      spyOn(DiscountHelper, 'getDiscountsResponses').and.returnValue({});
      const url = getItemLevelDiscountsEndPointUrl(
        payload.txnType,
        payload.subTxnType,
        payload.transactionId,
        payload.itemId
      );
      service.getItemLevelDiscountsDetails(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });

    it('should call DiscountHelper getDiscountsResponses method with correct parameters', () => {
      spyOn(DiscountHelper, 'getDiscountsResponses').and.returnValue({});
      const url = getItemLevelDiscountsEndPointUrl(
        payload.txnType,
        payload.subTxnType,
        payload.transactionId,
        payload.itemId
      );
      service.getItemLevelDiscountsDetails(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      request.flush(response);
      expect(DiscountHelper.getDiscountsResponses).toHaveBeenCalledWith(
        response
      );
    });

    it('should return data mapped by helper', () => {
      spyOn(DiscountHelper, 'getDiscountsResponses').and.returnValue(response);
      const url = getItemLevelDiscountsEndPointUrl(
        payload.txnType,
        payload.subTxnType,
        payload.transactionId,
        payload.itemId
      );
      service.getItemLevelDiscountsDetails(payload).subscribe(data1 => {
        expect(data1).toEqual(response);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush({});
    });
  });

  describe('saveItemLevelDiscountsDetails', () => {
    const payload: DiscountsRequestPayload = {
      txnType: TransactionTypeEnum.CM,
      subTxnType: SubTransactionTypeEnum.NEW_CM,
      transactionId: ''
    };
    const response: DiscountsResponse[] = [
      {
        discountCode: 'catapr22',
        discountType: 'CATEGORY_DISCOUNT',
        discountId: '898642B7-28FC-4149-B64E-9AC79DD53323',
        discountValue: 34802.46,
        discountValueDetails: {
          type: 'DISCOUNT_VALUE_DETAILS',
          data: [
            {
              component: 'UCP',
              discountValue: 0,
              discountPercent: null,
              isDiscountPercentage: null
            },
            {
              component: 'MAKING_CHARGE',
              discountValue: 0,
              discountPercent: null,
              isDiscountPercentage: null
            },
            {
              component: 'METAL_CHARGE',
              discountValue: 34802.46,
              discountPercent: 12,
              isDiscountPercentage: true
            },
            {
              component: 'STONE_CHARGE',
              discountValue: 0,
              discountPercent: null,
              isDiscountPercentage: null
            },
            {
              component: 'UNIT_WEIGHT',
              discountValue: 0,
              discountPercent: null,
              isDiscountPercentage: null
            }
          ]
        },
        referenceId: null,
        referenceType: null,
        isEdited: false,
        clubbedDiscountId: null,
        discountSubType: null,
        discountTxnId: '9BC4129C-0571-4EB2-A02E-F1959E97EBC1',
        itemId: 'C5FF8C3F-2B72-48BD-9BA5-3225BE5B1354',
        discountAttributes: {
          isRiva: true,
          isAccrualUlpPoints: false,
          clubbingDiscountType: 'TYPE1',
          occasion: 'catapr22'
        },
        status: 'CONFIRMED',
        txnLevelDiscountValueDetails: null,
        isNarationMandatory: false,
        occasion: ''
      }
    ];
    it('should call POST api method with correct url and params', () => {
      spyOn(DiscountHelper, 'getDiscountsResponses').and.returnValue({});
      const url = getItemLevelDiscountsEndPointUrl(
        payload.txnType,
        payload.subTxnType,
        payload.transactionId,
        payload.itemId
      );
      service.saveItemLevelDiscountsDetails(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });

    it('should call DiscountHelper getDiscountsResponses method with correct parameters', () => {
      spyOn(DiscountHelper, 'getDiscountsResponses').and.returnValue({});
      const url = getItemLevelDiscountsEndPointUrl(
        payload.txnType,
        payload.subTxnType,
        payload.transactionId,
        payload.itemId
      );
      service.saveItemLevelDiscountsDetails(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      request.flush(response);
      expect(DiscountHelper.getDiscountsResponses).toHaveBeenCalledWith(
        response
      );
    });

    it('should return data mapped by helper', () => {
      spyOn(DiscountHelper, 'getDiscountsResponses').and.returnValue(response);
      const url = getItemLevelDiscountsEndPointUrl(
        payload.txnType,
        payload.subTxnType,
        payload.transactionId,
        payload.itemId
      );
      service.saveItemLevelDiscountsDetails(payload).subscribe(data1 => {
        expect(data1).toEqual(response);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush({});
    });
  });

  describe('updateItemLevelDiscountsDetails', () => {
    const payload: DiscountsRequestPayload = {
      txnType: TransactionTypeEnum.CM,
      subTxnType: SubTransactionTypeEnum.NEW_CM,
      transactionId: ''
    };
    const response: DiscountsResponse = {
      discountCode: 'catapr22',
      discountType: 'CATEGORY_DISCOUNT',
      discountId: '898642B7-28FC-4149-B64E-9AC79DD53323',
      discountValue: 34802.46,
      discountValueDetails: {
        type: 'DISCOUNT_VALUE_DETAILS',
        data: [
          {
            component: 'UCP',
            discountValue: 0,
            discountPercent: null,
            isDiscountPercentage: null
          },
          {
            component: 'MAKING_CHARGE',
            discountValue: 0,
            discountPercent: null,
            isDiscountPercentage: null
          },
          {
            component: 'METAL_CHARGE',
            discountValue: 34802.46,
            discountPercent: 12,
            isDiscountPercentage: true
          },
          {
            component: 'STONE_CHARGE',
            discountValue: 0,
            discountPercent: null,
            isDiscountPercentage: null
          },
          {
            component: 'UNIT_WEIGHT',
            discountValue: 0,
            discountPercent: null,
            isDiscountPercentage: null
          }
        ]
      },
      referenceId: null,
      referenceType: null,
      isEdited: false,
      clubbedDiscountId: null,
      discountSubType: null,
      discountTxnId: '9BC4129C-0571-4EB2-A02E-F1959E97EBC1',
      itemId: 'C5FF8C3F-2B72-48BD-9BA5-3225BE5B1354',
      discountAttributes: {
        isRiva: true,
        isAccrualUlpPoints: false,
        clubbingDiscountType: 'TYPE1',
        occasion: 'catapr22'
      },
      status: 'CONFIRMED',
      txnLevelDiscountValueDetails: null,
      isNarationMandatory: false,
      occasion: ''
    };
    it('should call PATCH api method with correct url and params', () => {
      spyOn(DiscountAdaptor, 'getDiscountsResponse').and.returnValue({});
      const url = getItemLevelDiscountsEndPointUrl(
        payload.txnType,
        payload.subTxnType,
        payload.transactionId,
        payload.itemId
      );
      service.updateItemLevelDiscountsDetails(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });

    it('should call DiscountAdaptor getDiscountsResponse method with correct parameters', () => {
      spyOn(DiscountAdaptor, 'getDiscountsResponse').and.returnValue({});
      const url = getItemLevelDiscountsEndPointUrl(
        payload.txnType,
        payload.subTxnType,
        payload.transactionId,
        payload.itemId
      );
      service.updateItemLevelDiscountsDetails(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      request.flush(response);
      expect(DiscountAdaptor.getDiscountsResponse).toHaveBeenCalledWith(
        response
      );
    });

    it('should return data mapped by helper', () => {
      spyOn(DiscountAdaptor, 'getDiscountsResponse').and.returnValue(response);
      const url = getItemLevelDiscountsEndPointUrl(
        payload.txnType,
        payload.subTxnType,
        payload.transactionId,
        payload.itemId
      );
      service.updateItemLevelDiscountsDetails(payload).subscribe(data1 => {
        expect(data1).toEqual(response);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush({});
    });
  });

  describe('deleteItemLevelDiscountsDetails', () => {
    const payload: DiscountsRequestPayload = {
      txnType: TransactionTypeEnum.CM,
      subTxnType: SubTransactionTypeEnum.NEW_CM,
      transactionId: ''
    };
    it('should call DELETE api method with correct url and params', () => {
      spyOn(DiscountAdaptor, 'getDiscountsResponse').and.returnValue({});
      const url = getItemLevelDiscountsEndPointUrl(
        payload.txnType,
        payload.subTxnType,
        payload.transactionId,
        payload.itemId
      );
      service.deleteItemLevelDiscountsDetails(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('DELETE');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });
  });

  describe('checkABCOEligibility', () => {
    const payloadReq: DiscountsResponse[] = [
      {
        discountCode: 'catapr22',
        discountType: 'CATEGORY_DISCOUNT',
        discountId: '898642B7-28FC-4149-B64E-9AC79DD53323',
        discountValue: 34802.46,
        discountValueDetails: {
          type: 'DISCOUNT_VALUE_DETAILS',
          data: [
            {
              component: 'UCP',
              discountValue: 0,
              discountPercent: null,
              isDiscountPercentage: null
            },
            {
              component: 'MAKING_CHARGE',
              discountValue: 0,
              discountPercent: null,
              isDiscountPercentage: null
            },
            {
              component: 'METAL_CHARGE',
              discountValue: 34802.46,
              discountPercent: 12,
              isDiscountPercentage: true
            },
            {
              component: 'STONE_CHARGE',
              discountValue: 0,
              discountPercent: null,
              isDiscountPercentage: null
            },
            {
              component: 'UNIT_WEIGHT',
              discountValue: 0,
              discountPercent: null,
              isDiscountPercentage: null
            }
          ]
        },
        referenceId: null,
        referenceType: null,
        isEdited: false,
        clubbedDiscountId: null,
        discountSubType: null,
        discountTxnId: '9BC4129C-0571-4EB2-A02E-F1959E97EBC1',
        itemId: 'C5FF8C3F-2B72-48BD-9BA5-3225BE5B1354',
        discountAttributes: {
          isRiva: true,
          isAccrualUlpPoints: false,
          clubbingDiscountType: 'TYPE1',
          occasion: 'catapr22'
        },
        status: 'CONFIRMED',
        txnLevelDiscountValueDetails: null,
        isNarationMandatory: false,
        occasion: ''
      }
    ];
    const payload = {
      data: null,
      existingDiscounts: payloadReq,
      id: ['']
    };
    const response = null;
    it('should call POST api method with correct url and params', () => {
      spyOn(
        DiscountHelper,
        'getDiscountConfigDetailsResponses'
      ).and.returnValue({});
      const url = getCheckABCOEligibility();
      service.checkABCOEligibility(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });

    it('should return data mapped by helper', () => {
      spyOn(
        DiscountHelper,
        'getDiscountConfigDetailsResponses'
      ).and.returnValue(null);
      const url = getCheckABCOEligibility();
      service.checkABCOEligibility(payload).subscribe(data1 => {
        expect(data1).toEqual(response);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush({});
    });
  });

  describe('loadABCODiscounts', () => {
    const payload: DiscountsRequestPayload = {
      txnType: TransactionTypeEnum.CM,
      subTxnType: SubTransactionTypeEnum.NEW_CM,
      transactionId: ''
    };
    const response: DiscountHeaders = {
      discounts: [
        {
          discountType: 'CATEGORY_DISCOUNT',
          discountId: '898642B7-28FC-4149-B64E-9AC79DD53323',
          discountCode: 'catapr22',
          refDiscountTxnId: null,
          discountAttributes: {
            isRiva: true,
            isAccrualUlpPoints: false,
            clubbingDiscountType: 'TYPE1',
            occasion: 'catapr22'
          },
          rivaahGhsDetails: null
        }
      ],
      clubDiscounts: []
    };
    it('should call GET api method with correct url and params', () => {
      spyOn(DiscountAdaptor, 'getDiscountHeader').and.returnValue({});
      const url = getLoadABCODiscounts(payload);
      service.loadABCODiscounts(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });

    it('should call DiscountAdaptor getDiscountHeader method with correct parameters', () => {
      spyOn(DiscountAdaptor, 'getDiscountHeader').and.returnValue({});
      const url = getLoadABCODiscounts(payload);
      service.loadABCODiscounts(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      request.flush(response);
      expect(DiscountAdaptor.getDiscountHeader).toHaveBeenCalledWith(response);
    });

    it('should return data mapped by helper', () => {
      spyOn(DiscountAdaptor, 'getDiscountHeader').and.returnValue(response);
      const url = getLoadABCODiscounts(payload);
      service.loadABCODiscounts(payload).subscribe(data1 => {
        expect(data1).toEqual(response);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush({});
    });
  });

  describe('loadNewABCODiscounts', () => {
    const payload: DiscountsRequestPayload = {
      txnType: TransactionTypeEnum.CM,
      subTxnType: SubTransactionTypeEnum.NEW_CM,
      transactionId: ''
    };
    const response: DiscountHeaders = {
      discounts: [
        {
          discountType: 'CATEGORY_DISCOUNT',
          discountId: '898642B7-28FC-4149-B64E-9AC79DD53323',
          discountCode: 'catapr22',
          refDiscountTxnId: null,
          discountAttributes: {
            isRiva: true,
            isAccrualUlpPoints: false,
            clubbingDiscountType: 'TYPE1',
            occasion: 'catapr22'
          },
          rivaahGhsDetails: null
        }
      ],
      clubDiscounts: []
    };
    it('should call GET api method with correct url and params', () => {
      spyOn(DiscountAdaptor, 'getDiscountHeader').and.returnValue({});
      const url = getLoadABCODiscounts(payload);
      service.loadNewABCODiscounts(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });

    it('should call DiscountAdaptor getDiscountHeader method with correct parameters', () => {
      spyOn(DiscountAdaptor, 'getDiscountHeader').and.returnValue({});
      const url = getLoadABCODiscounts(payload);
      service.loadNewABCODiscounts(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      request.flush(response);
      expect(DiscountAdaptor.getDiscountHeader).toHaveBeenCalledWith(response);
    });

    it('should return data mapped by helper', () => {
      spyOn(DiscountAdaptor, 'getDiscountHeader').and.returnValue(response);
      const url = getLoadABCODiscounts(payload);
      service.loadNewABCODiscounts(payload).subscribe(data1 => {
        expect(data1).toEqual(response);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush({});
    });
  });

  describe('loadABCODiscountDetails', () => {
    const payloadReq: DiscountsResponse[] = [
      {
        discountCode: 'catapr22',
        discountType: 'CATEGORY_DISCOUNT',
        discountId: '898642B7-28FC-4149-B64E-9AC79DD53323',
        discountValue: 34802.46,
        discountValueDetails: {
          type: 'DISCOUNT_VALUE_DETAILS',
          data: [
            {
              component: 'UCP',
              discountValue: 0,
              discountPercent: null,
              isDiscountPercentage: null
            },
            {
              component: 'MAKING_CHARGE',
              discountValue: 0,
              discountPercent: null,
              isDiscountPercentage: null
            },
            {
              component: 'METAL_CHARGE',
              discountValue: 34802.46,
              discountPercent: 12,
              isDiscountPercentage: true
            },
            {
              component: 'STONE_CHARGE',
              discountValue: 0,
              discountPercent: null,
              isDiscountPercentage: null
            },
            {
              component: 'UNIT_WEIGHT',
              discountValue: 0,
              discountPercent: null,
              isDiscountPercentage: null
            }
          ]
        },
        referenceId: null,
        referenceType: null,
        isEdited: false,
        clubbedDiscountId: null,
        discountSubType: null,
        discountTxnId: '9BC4129C-0571-4EB2-A02E-F1959E97EBC1',
        itemId: 'C5FF8C3F-2B72-48BD-9BA5-3225BE5B1354',
        discountAttributes: {
          isRiva: true,
          isAccrualUlpPoints: false,
          clubbingDiscountType: 'TYPE1',
          occasion: 'catapr22'
        },
        status: 'CONFIRMED',
        txnLevelDiscountValueDetails: null,
        isNarationMandatory: false,
        occasion: ''
      }
    ];
    const payload = {
      id: [''],
      existingDiscounts: payloadReq,
      data: null
    };
    const response = {
      discountConfigDetails: [
        {
          discountValue: 34802.46,
          discountValueDetails: [
            {
              component: 'UCP',
              discountValue: 0,
              discountPercent: null,
              isDiscountPercentage: null
            },
            {
              component: 'MAKING_CHARGE',
              discountValue: 0,
              discountPercent: null,
              isDiscountPercentage: null
            },
            {
              component: 'METAL_CHARGE',
              discountValue: 34802.46,
              discountPercent: 12,
              isDiscountPercentage: true
            },
            {
              component: 'STONE_CHARGE',
              discountValue: 0,
              discountPercent: null,
              isDiscountPercentage: null
            },
            {
              component: 'UNIT_WEIGHT',
              discountValue: 0,
              discountPercent: null,
              isDiscountPercentage: null
            }
          ],
          discountConfigDetails: {
            discountType: 'CATEGORY_DISCOUNT',
            discountId: '898642B7-28FC-4149-B64E-9AC79DD53323',
            discountCode: 'catapr22',
            refDiscountTxnId: null,
            basicCriteriaDetails: {
              isNarationMandatory: false,
              maxDiscount: 0,
              isEditable: false,
              isTepRecovery: true,
              isBillValue: false,
              ucpValue: 0,
              isFullValueTepDiscountRecovery: false,
              coinPurchaseStartDate: moment(),
              coinPurchaseEndDate: moment(),
              tepPeriodStartDate: moment(),
              tepPeriodEndDate: moment(),
              tepCNUtilizationPercent: 1,
              startingSerialNo: 1,
              isUploadMandatory: false,
              isNameMandatory: false,
              startingSerialNoEmpDiscountType: 0,
              startingSerialNoTataEmpDiscountType: 0,
              isMultipleTrnsctnAllowedOnSameDay: false,
              maxNoOfTimes: 1,
              maxCount: 1,
              isApplicableForAutomatedDiscount: true,
              isFullValueTepRecovery: false
            },
            discountAttributes: {
              isRiva: true,
              isAccrualUlpPoints: false,
              clubbingDiscountType: 'TYPE1',
              occasion: 'catapr22'
            },
            clubbingDetails: {
              isExchangeOffer: true,
              isGHS: true,
              isRiva: false,
              isEmpowerment: false,
              isDV: true,
              isFOCOffer: true,
              isCBOOffer: false,
              isBillLevelDiscount: true,
              isOtherBillLevelDiscount: false,
              isCoin: true
            },
            grnConfigDetails: {
              noOfDaysAllowedBeforeOfferPeriod: 0,
              noOfDaysAllowedAfterOfferPeriod: 0,
              utilizationPercent: 0,
              isAllowedBeforeOffer: false,
              isSameCfaEligible: false
            },
            tepConfigDetails: {
              tepDetails: [{ durationInDays: '10-20', recoveryPercent: 95 }],
              enabled: false
            },
            orderConfigDetails: {
              isGoldRateFrozenForCO: false,
              isGoldRateFrozenForAB: false,
              isDisplayOnAB: false,
              isAllowedToChangeCO: false,
              isAllowedToChangeAB: false,
              isDisplayOnCO: false,
              offerPeriodForCO: 0,
              offerPeriodForAB: 0,
              coPercent: 0,
              abPercent: 0
            },
            locationOfferDetails: {
              offerStartDate: moment(1648751400000),
              offerEndDate: moment(1672425000000),
              configDetails: null,
              empowermentQuarterMaxDiscountValue: 0,
              previewOfferStartDate: moment(1648751400000),
              previewOfferEndDate: moment(1672425000000)
            }
          },
          rivaahGhsDetails: null
        }
      ],
      clubbingId: ''
    };
    it('should call POST api method with correct url and params', () => {
      spyOn(
        DiscountHelper,
        'getDiscountConfigDetailsResponses'
      ).and.returnValue({});
      const url = getLoadABCODiscountDetails();
      service.loadABCODiscountDetails(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });

    it('should return data mapped by helper', () => {
      spyOn(
        DiscountHelper,
        'getDiscountConfigDetailsResponses'
      ).and.returnValue(response);
      const url = getLoadABCODiscountDetails();
      service.loadABCODiscountDetails(payload).subscribe(data1 => {
        expect(data1).toEqual(response);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush({});
    });
  });

  describe('loadABCODConfigDetails', () => {
    const payload: DiscountsRequestPayload = {
      txnType: TransactionTypeEnum.CM,
      subTxnType: SubTransactionTypeEnum.NEW_CM,
      transactionId: ''
    };
    const response = {
      discounts: [
        {
          discountType: 'CATEGORY_DISCOUNT',
          discountId: '898642B7-28FC-4149-B64E-9AC79DD53323',
          discountCode: 'catapr22',
          refDiscountTxnId: null,
          discountAttributes: {
            isRiva: true,
            isAccrualUlpPoints: false,
            clubbingDiscountType: 'TYPE1',
            occasion: 'catapr22'
          },
          rivaahGhsDetails: null
        }
      ],
      clubDiscounts: []
    };
    it('should call GET api method with correct url and params', () => {
      spyOn(DiscountAdaptor, 'getDiscountHeaderDetails').and.returnValue({});
      const url = getLoadABCOConfigDetails(payload);
      service.loadABCODConfigDetails(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });

    it('should call DiscountAdaptor getDiscountHeaderDetails method with correct parameters', () => {
      spyOn(DiscountAdaptor, 'getDiscountHeaderDetails').and.returnValue({});
      const url = getLoadABCOConfigDetails(payload);
      service.loadABCODConfigDetails(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      request.flush(response);
      expect(DiscountAdaptor.getDiscountHeaderDetails).toHaveBeenCalledWith(
        response
      );
    });

    it('should return data mapped by helper', () => {
      spyOn(DiscountAdaptor, 'getDiscountHeaderDetails').and.returnValue(
        response
      );
      const url = getLoadABCOConfigDetails(payload);
      service.loadABCODConfigDetails(payload).subscribe(data1 => {
        expect(data1).toEqual(response);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush({});
    });
  });

  describe('loadAutoDiscounts', () => {
    const payload: AutoDiscRequest = {
      request: {
        customerDetails: {
          enrollmentDate: moment(),
          ulpId: '700001358840'
        },
        discountRequestDto: {
          businessDate: 1650652200000,
          itemDetails: {
            itemCode: '511881VQMQ2AP1',
            lotNumber: '2CD000002',
            mfgDate: moment(1608834600000),
            stockInwardDate: moment(1614450600000),
            totalTax: 4515.48,
            totalWeight: 52.731,
            netWeight: 52.731,
            totalValue: 332670.3,
            complexityPercent: 26,
            makingChargePerGram: 0,
            productCategoryCode: 'V',
            productGroupCode: '75'
          },
          transactionDetails: {
            transactionType: 'CM',
            subTransactionType: 'NEW_CM',
            isFrozenRate: null
          },
          encircleDiscount: {},
          employeeDetails: null,
          tsssDetails: null,
          tataEmployeeDetails: null,
          empowermentDetails: null,
          rivaahGhsDetails: null
        },
        itemDetails: {
          itemCode: '511881VQMQ2AP1',
          lotNumber: '2CD000002',
          productCategoryCode: 'V',
          productGroupCode: '75',
          priceDetails: {
            isUcp: false,
            printGuranteeCard: false,
            metalPriceDetails: {
              preDiscountValue: 263655,
              metalPrices: [
                {
                  weightUnit: 'gms',
                  netWeight: 52.731,
                  metalValue: 263655,
                  type: 'Gold',
                  ratePerUnit: 5000,
                  karat: 22,
                  purity: 92,
                  metalTypeCode: 'J'
                }
              ]
            },
            stonePriceDetails: {
              numberOfStones: null,
              preDiscountValue: 465,
              stoneWeight: null,
              weightUnit: null,
              stoneWeightForView: null,
              weightUnitForView: null
            },
            makingChargeDetails: {
              preDiscountValue: 68550.3,
              makingChargePercentage: 26,
              isDynamicPricing: false,
              makingChargePct: 0,
              makingChargePgram: 0,
              wastagePct: 26
            },
            itemHallmarkDetails: {
              hallmarkGstPct: null,
              hallmarkingCharges: null,
              hmQuantity: null,
              isFOCForHallmarkingCharges: null,
              isHallmarked: true
            },
            netWeight: 52.731
          },
          totalQuantity: 1,
          totalValue: 332670.3,
          totalWeight: 52.731,
          netWeight: 52.731,
          totalTax: 4515.48
        }
      }
    };
    const response = {
      discountConfigDetails: [
        {
          discountValue: 34802.46,
          discountValueDetails: [
            {
              component: 'UCP',
              discountValue: 0,
              discountPercent: null,
              isDiscountPercentage: null
            },
            {
              component: 'MAKING_CHARGE',
              discountValue: 0,
              discountPercent: null,
              isDiscountPercentage: null
            },
            {
              component: 'METAL_CHARGE',
              discountValue: 34802.46,
              discountPercent: 12,
              isDiscountPercentage: true
            },
            {
              component: 'STONE_CHARGE',
              discountValue: 0,
              discountPercent: null,
              isDiscountPercentage: null
            },
            {
              component: 'UNIT_WEIGHT',
              discountValue: 0,
              discountPercent: null,
              isDiscountPercentage: null
            }
          ],
          discountConfigDetails: {
            discountType: 'CATEGORY_DISCOUNT',
            discountId: '898642B7-28FC-4149-B64E-9AC79DD53323',
            discountCode: 'catapr22',
            refDiscountTxnId: null,
            basicCriteriaDetails: {
              isNarationMandatory: false,
              maxDiscount: 0,
              isEditable: false,
              isTepRecovery: true,
              isBillValue: false,
              ucpValue: 0,
              isFullValueTepDiscountRecovery: false,
              coinPurchaseStartDate: moment(),
              coinPurchaseEndDate: moment(),
              tepPeriodStartDate: moment(),
              tepPeriodEndDate: moment(),
              tepCNUtilizationPercent: 1,
              startingSerialNo: 1,
              isUploadMandatory: false,
              isNameMandatory: false,
              startingSerialNoEmpDiscountType: 0,
              startingSerialNoTataEmpDiscountType: 0,
              isMultipleTrnsctnAllowedOnSameDay: false,
              maxNoOfTimes: 1,
              maxCount: 1,
              isApplicableForAutomatedDiscount: true,
              isFullValueTepRecovery: false
            },
            discountAttributes: {
              isRiva: true,
              isAccrualUlpPoints: false,
              clubbingDiscountType: 'TYPE1',
              occasion: 'catapr22'
            },
            clubbingDetails: {
              isExchangeOffer: true,
              isGHS: true,
              isRiva: false,
              isEmpowerment: false,
              isDV: true,
              isFOCOffer: true,
              isCBOOffer: false,
              isBillLevelDiscount: true,
              isOtherBillLevelDiscount: false,
              isCoin: true
            },
            grnConfigDetails: {
              noOfDaysAllowedBeforeOfferPeriod: 0,
              noOfDaysAllowedAfterOfferPeriod: 0,
              utilizationPercent: 0,
              isAllowedBeforeOffer: false,
              isSameCfaEligible: false
            },
            tepConfigDetails: {
              tepDetails: [{ durationInDays: '10-20', recoveryPercent: 95 }],
              enabled: false
            },
            orderConfigDetails: {
              isGoldRateFrozenForCO: false,
              isGoldRateFrozenForAB: false,
              isDisplayOnAB: false,
              isAllowedToChangeCO: false,
              isAllowedToChangeAB: false,
              isDisplayOnCO: false,
              offerPeriodForCO: 0,
              offerPeriodForAB: 0,
              coPercent: 0,
              abPercent: 0
            },
            locationOfferDetails: {
              offerStartDate: moment(1648751400000),
              offerEndDate: moment(1672425000000),
              configDetails: null,
              empowermentQuarterMaxDiscountValue: 0,
              previewOfferStartDate: moment(1648751400000),
              previewOfferEndDate: moment(1672425000000)
            }
          },
          rivaahGhsDetails: null
        }
      ],
      clubbingId: ''
    };
    it('should call POST api method with correct url and params', () => {
      spyOn(
        DiscountHelper,
        'getDiscountConfigDetailsResponses'
      ).and.returnValue({});
      const url = getAutoDiscounts();
      service.loadAutoDiscounts(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });

    it('should return data mapped by helper', () => {
      spyOn(
        DiscountHelper,
        'getDiscountConfigDetailsResponses'
      ).and.returnValue(response);
      const url = getAutoDiscounts();
      service.loadAutoDiscounts(payload).subscribe(data1 => {
        expect(data1).toEqual(response);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush({});
    });
  });

  describe('loadRivaahGHSDiscounts', () => {
    const payload: DiscountTransactionLevelRequest = {
      businessDate: '1624300200000',
      discountType: 'RIVAAH_ASHIRWAAD_DISCOUNT'
    };
    const res: DiscountTransactionLevelResponse[] = [
      {
        discountCode: 'e-GHS Spl Discount',
        discountId: 'FBDFDD73-BB49-4B9D-926F-E6F502950277',
        discountType: 'RIVAAH_ASHIRWAAD_DISCOUNT',
        discountValue: null,
        discountValueDetails: null,
        isEdited: null,
        itemDetails: null,
        basicCriteriaDetails: null
      }
    ];
    const response = {
      clubDiscountDetails: [],
      discountDetails: res
    };

    it('should call POST api method with correct url and params', () => {
      spyOn(DiscountAdaptor, 'getRivaahGHSDiscounts').and.returnValue({});
      const url = getTransactionLevelDiscountsEndPointUrl();
      service.loadRivaahGHSDiscounts(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });

    it('should call DiscountAdaptor getRivaahGHSDiscounts method with correct parameters', () => {
      spyOn(DiscountAdaptor, 'getRivaahGHSDiscounts').and.returnValue({});
      const url = getTransactionLevelDiscountsEndPointUrl();
      service.loadRivaahGHSDiscounts(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      request.flush(response);
      expect(DiscountAdaptor.getRivaahGHSDiscounts).toHaveBeenCalledWith(
        response
      );
    });

    it('should return data mapped by helper', () => {
      spyOn(DiscountAdaptor, 'getRivaahGHSDiscounts').and.returnValue(response);
      const url = getTransactionLevelDiscountsEndPointUrl();
      service.loadRivaahGHSDiscounts(payload).subscribe(data1 => {
        expect(data1).toEqual(response);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush({});
    });
  });

  describe('saveRivaahGHSDiscounts', () => {
    const payload: ApplyDiscountRequest = {
      subTxnType: 'NEW_CM',
      transactionId: '49F02FAB-76CA-435A-BF84-A5E56E29AC76',
      discountType: 'RIVAAH_ASHIRWAAD_DISCOUNT',
      txnType: 'CM',
      hasDiscounts: false,
      requestBody: {
        discountDetails: [
          {
            discountCode: 'Test rivaah discount',
            discountId: '3DFC0981-5F67-4CB4-BD90-80EE1421C2FC',
            discountType: 'RIVAAH_ASHIRWAAD_DISCOUNT',
            discountValue: 1000,
            discountValueDetails: {},
            isEdited: false
          }
        ]
      }
    };

    it('should call POST api method with correct url and params', () => {
      const url = getApplyTransactionLevelEndPointUrl(
        payload.discountType,
        payload.txnType,
        payload.subTxnType,
        payload.transactionId
      );
      service.saveRivaahGHSDiscounts(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });
  });

  describe('loadEligibleItemsForGepPurityDiscountConfigId', () => {
    const payload: GepPurityConfigIdEligibleItemsRequestPayload = {
      businessDate: 1650652200000
    };
    it('should call POST api method with correct url and params', () => {
      const urlPath = getEligibleItemsForGepPurityConfigId();
      service
        .loadEligibleItemsForGepPurityDiscountConfigId(payload)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + urlPath;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });
  });

  describe('getEligibleItemsForDiscountIds', () => {
    const payloadReq: KaratOrCoinOfferEligibleItemsRequestPayload = {
      businessDate: 1650652200000,
      discountIds: [],
      itemDetails: []
    };
    const payload = {
      discountType: 'COIN_OFFER_DISCOUNT',
      payload: payloadReq
    };
    it('should call POST api method with correct url and params', () => {
      const url = getEligibleItemsForParticularDiscountUrl(
        payload.discountType
      );
      service
        .getEligibleItemsForDiscountIds(payload.discountType, payload.payload)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });
  });

  describe('loadDiscountVocherDetails', () => {
    const payload: DiscountVoucherDetailsRequestPayload = {
      accountNo: 123,
      vendorCode: 'VOUCHER_CODE',
      voucherCode: 967
    };

    const response: DiscountVoucherDetailsResponePayload = {
      accountCustomerId: 373,
      accountNo: 123,
      customerId: 373,
      customerName: 'ABC',
      discountAmount: 100,
      ghScheme: 'ghScheme',
      id: '123',
      installmentAmount: 600,
      isGoldCoinAllowed: false,
      issueDate: moment(1650652200000),
      mobileNo: '9876543210',
      noOfInstallmentsPaid: 5,
      redeemptionDate: moment(1650652200000),
      status: 'OPEN',
      validFrom: moment(1650652200000),
      validTill: moment(1650652500000),
      voucherNo: 967
    };

    it('should call GET api method with correct url and params', () => {
      spyOn(DiscountAdaptor, 'getDiscountVoucherDetails').and.returnValue({});
      const url = getDiscountVocherDetailsUrld(payload);
      service.loadDiscountVocherDetails(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });

    it('should call DiscountHelper getDiscountConfigDetailsResponses method with correct parameters', () => {
      spyOn(DiscountAdaptor, 'getDiscountVoucherDetails').and.returnValue({});
      const url = getDiscountVocherDetailsUrld(payload);
      service.loadDiscountVocherDetails(payload).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      request.flush(response);
      expect(DiscountAdaptor.getDiscountVoucherDetails).toHaveBeenCalledWith(
        response
      );
    });

    it('should return data mapped by helper', () => {
      spyOn(DiscountAdaptor, 'getDiscountVoucherDetails').and.returnValue(
        response
      );
      const url = getDiscountVocherDetailsUrld(payload);
      service.loadDiscountVocherDetails(payload).subscribe(data1 => {
        expect(data1).toEqual(response);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush({});
    });
  });
});
