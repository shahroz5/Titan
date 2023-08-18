// You here need to assert a reactive result as well as trigger an effect.
// To assert that an effect returns the right observable stream, we can use
// Rx Marbles.
import { Observable } from 'rxjs';
import { hot, cold } from 'jasmine-marbles';

import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { HttpClient } from '@angular/common/http';
import { BrandMasterEffect } from './brand-master.effect';
import { BrandMasterService } from '../brand-master.service';
import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { DataPersistence } from '@nrwl/angular';
import {
  BrandListingPayload,
  BrandListing,
  SaveBrandMasterDetailsPayload,
  UpdateBrandMasterDetailsPayload,
  BrandMaster,
  UpadateIsActivePayload,
  BrandMasterListing,
  BrandMasterDetails
} from '@poss-web/shared/models';
import {
  LoadBrandListing,
  LoadBrandListingSuccess,
  LoadBrandListingFailure,
  SaveBrandMasterDetailsSuccess,
  SaveBrandMasterDetails,
  SaveBrandMasterDetailsFailure,
  UpdateBrandMasterDetails,
  UpdateBrandMasterDetailsSuccess,
  UpdateBrandMasterDetailsFailure
} from './brand-master.actons';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

describe('Brand Master  Effects Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: BrandMasterEffect;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get', 'post', 'patch']
  );
  const initialState = {};
  let brandMasterService = jasmine.createSpyObj<BrandMasterService>(
    'BrandMasterService',
    [
      'getBrandMasterList',
      'getBrandDetailsByBrandCode',
      'saveBrandMasterDetails',
      'updateBrandMasterDetails',
      'getNewBrandDetails',
      'searchBrandByBrandCode',
      'updateIsActive',
      'getSupportedCurrencyCode'
    ]
  );
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BrandMasterEffect,
        DataPersistence,
        provideMockStore({ initialState }),
        provideMockActions(() => actions$),
        {
          provide: POSS_WEB_API_URL,
          useValue: ''
        },

        {
          provide: HttpClient,
          useValue: httpClientSpy
        },
        {
          provide: BrandMasterService,
          useValue: {
            getBrandMasterList: jasmine.createSpy(),
            saveBrandMasterDetails: jasmine.createSpy(),
            updateBrandMasterDetails: jasmine.createSpy(),
            getNewBrandDetails: jasmine.createSpy(),
            getBrandDetailsByBrandCode: jasmine.createSpy(),
            searchBrandByBrandCode: jasmine.createSpy(),
            updateIsActive: jasmine.createSpy(),
            getSupportedCurrencyCode: jasmine.createSpy()
          }
        }
      ]
    });

    effect = TestBed.inject(BrandMasterEffect);
    brandMasterService = TestBed.get(BrandMasterService);
  });

  describe('loadBrandMasterListing', () => {
    it('should return a stream with brand list', () => {
      const parameters: BrandListingPayload = {
        pageIndex: 0,
        pageSize: 100
      };
      const brandLsit: BrandMasterListing = {
        results: [
          {
            brandCode: 'brand1',
            description: 'brand1',
            orgCode: 'TJ',
            isActive: true
          }
        ],
        totalElements: 1
      };
      const action = new LoadBrandListing(parameters);
      const outcome = new LoadBrandListingSuccess(brandLsit);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: brandLsit });
      brandMasterService.getBrandMasterList.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadBrandMasterListing$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters: BrandListingPayload = {
        pageIndex: 0,
        pageSize: 100
      };

      const action = new LoadBrandListing(parameters);
      const error = new Error('some error');
      const outcome = new LoadBrandListingFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      brandMasterService.getBrandMasterList.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadBrandMasterListing$).toBeObservable(expected);
    });
  });

  describe('saveBrandMasterDetails', () => {
    it('should return a stream with brand ', () => {
      const parameters: BrandMasterDetails = {
        brandCode: 'tanishq',
        description: 'ABC',
        parentBrandCode: 'titan',
        orgCode: 'TJ',
        isActive: true,
        configDetails: {
          type: 'CONFIG_DETAILS',
          data: {
            airpayPaymentExpiry: '1',
            // dummyMobNo: '9999999999',
            isCustomerMandatoryForDigiGold: true,
            isInterbrandTEPAllowed: true,
            minUtilizationPercentageforGRF: '100',
            minUtilizationPercentageforGRN: '50',
            numberOfPrintsAllowed: '2',
            passwordConfigForCashDeposit: 'c',
            razorpayPaymentExpiry: '3',
            referCashPaymentConfig: true
          }
        },
        cmDetails: {
          type: 'CM_DETAILS',
          data: {
            residualAmountForeGHSTransfer: '1',
            smsPassword: 'pass',
            smsUserName: 'user'
          }
        },
        customerDetails: {
          type: 'CUSTOMER_DETAILS',
          data: {
            institutionalMobileNoStartsWith: [9, 8],
            internationalMobileNoStartsWith: [9, 8],
            oneTimeMobileNoStartsWith: [9, 8],
            regularMobileNoStartsWith: [9, 8]
          }
        },
        panCardDetails: {
          type: 'PANCARD_DETAILS',
          data: {
            configurationAmountForAdvance: '1',
            configurationAmountForCashMemo: '2',
            configurationAmountForGHS: '2',
            configurationAmountForGEP: '2',
            editPanDetailsNumber: 3,
            isPanCardMandatoryforAdvance: true,
            isPanCardMandatoryforCashMemo: true,
            isPanCardMandatoryforGHS: true,
            isPanCardOnSingleInvoice: true,
            isPanCardMandatoryforGEP: true,
            isPanCardOnCumulativeInvoice: true
          }
        },
        taxDetails: {
          type: 'TAX_DETAILS',
          data: {
            bullion: {
              cashAmount: '2',
              netInvoiceAmount: '3',
              unitWeight: '3'
            },
            form60: {
              indianCustomerPercent: '2',
              isNetInvoice: '3',
              nonIndianCustomerPercent: '3'
            },
            isAdvancedCNAllowed: true,
            isGhsAllowed: true,
            isOnSingleInvoice: true,
            jewellery: {
              cashAmount: '3',
              netInvoiceAmount: '3',
              panCardPercent: '4'
            },
            silverPlatinumConfig: {
              isPlatinumAllowed: true,
              isSilverAllowed: true
            }
          }
        }
      };

      const action = new SaveBrandMasterDetails(parameters);
      const outcome = new SaveBrandMasterDetailsSuccess(parameters);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: parameters });
      brandMasterService.saveBrandMasterDetails.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.saveBrandMasterDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters: BrandMasterDetails = {
        brandCode: 'tanishq',
        description: 'ABC',
        parentBrandCode: 'titan',
        orgCode: 'TJ',
        isActive: true,
        configDetails: {
          type: 'CONFIG_DETAILS',
          data: {
            airpayPaymentExpiry: '1',
            // dummyMobNo: '9999999999',
            isCustomerMandatoryForDigiGold: true,
            isInterbrandTEPAllowed: true,
            minUtilizationPercentageforGRF: '100',
            minUtilizationPercentageforGRN: '50',
            numberOfPrintsAllowed: '2',
            passwordConfigForCashDeposit: 'c',
            razorpayPaymentExpiry: '3',
            referCashPaymentConfig: true
          }
        },
        cmDetails: {
          type: 'CM_DETAILS',
          data: {
            residualAmountForeGHSTransfer: '1',
            smsPassword: 'pass',
            smsUserName: 'user'
          }
        },
        customerDetails: {
          type: 'CUSTOMER_DETAILS',
          data: {
            institutionalMobileNoStartsWith: [9, 8],
            internationalMobileNoStartsWith: [9, 8],
            oneTimeMobileNoStartsWith: [9, 8],
            regularMobileNoStartsWith: [9, 8]
          }
        },
        panCardDetails: {
          type: 'PANCARD_DETAILS',
          data: {
            configurationAmountForAdvance: '1',
            configurationAmountForCashMemo: '2',
            configurationAmountForGHS: '2',
            configurationAmountForGEP: '2',
            editPanDetailsNumber: 3,
            isPanCardMandatoryforAdvance: true,
            isPanCardMandatoryforCashMemo: true,
            isPanCardMandatoryforGHS: true,
            isPanCardOnSingleInvoice: true,
            isPanCardMandatoryforGEP: true,
            isPanCardOnCumulativeInvoice: true
          }
        },
        taxDetails: {
          type: 'TAX_DETAILS',
          data: {
            bullion: {
              cashAmount: '2',
              netInvoiceAmount: '3',
              unitWeight: '3'
            },
            form60: {
              indianCustomerPercent: '2',
              isNetInvoice: '3',
              nonIndianCustomerPercent: '3'
            },
            isAdvancedCNAllowed: true,
            isGhsAllowed: true,
            isOnSingleInvoice: true,
            jewellery: {
              cashAmount: '3',
              netInvoiceAmount: '3',
              panCardPercent: '4'
            },
            silverPlatinumConfig: {
              isPlatinumAllowed: true,
              isSilverAllowed: true
            }
          }
        }
      };
      const action = new SaveBrandMasterDetails(parameters);
      const error = new Error('some error');
      const outcome = new SaveBrandMasterDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      brandMasterService.saveBrandMasterDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.saveBrandMasterDetails$).toBeObservable(expected);
    });
  });

  describe('UpdateBrandMasterDetails', () => {
    it('should return a stream with updated brand details', () => {
      const parameters: BrandMasterDetails = {
        brandCode: 'tanishq',
        isActive: true
      };
      const res: BrandMasterDetails = {
        brandCode: 'tanishq',
        description: 'ABC',
        parentBrandCode: 'titan',
        orgCode: 'TJ',
        isActive: true,
        configDetails: {
          type: 'CONFIG_DETAILS',
          data: {
            airpayPaymentExpiry: '1',
            // dummyMobNo: '9999999999',
            isCustomerMandatoryForDigiGold: true,
            isInterbrandTEPAllowed: true,
            minUtilizationPercentageforGRF: '100',
            minUtilizationPercentageforGRN: '50',
            numberOfPrintsAllowed: '2',
            passwordConfigForCashDeposit: 'c',
            razorpayPaymentExpiry: '3',
            referCashPaymentConfig: true
          }
        },
        cmDetails: {
          type: 'CM_DETAILS',
          data: {
            residualAmountForeGHSTransfer: '1',
            smsPassword: 'pass',
            smsUserName: 'user'
          }
        },
        customerDetails: {
          type: 'CUSTOMER_DETAILS',
          data: {
            institutionalMobileNoStartsWith: [9, 8],
            internationalMobileNoStartsWith: [9, 8],
            oneTimeMobileNoStartsWith: [9, 8],
            regularMobileNoStartsWith: [9, 8]
          }
        },
        panCardDetails: {
          type: 'PANCARD_DETAILS',
          data: {
            configurationAmountForAdvance: '1',
            configurationAmountForCashMemo: '2',
            configurationAmountForGHS: '2',
            configurationAmountForGEP: '2',
            editPanDetailsNumber: 3,
            isPanCardMandatoryforAdvance: true,
            isPanCardMandatoryforCashMemo: true,
            isPanCardMandatoryforGHS: true,
            isPanCardOnSingleInvoice: true,
            isPanCardMandatoryforGEP: true,
            isPanCardOnCumulativeInvoice: true
          }
        },
        taxDetails: {
          type: 'TAX_DETAILS',
          data: {
            bullion: {
              cashAmount: '2',
              netInvoiceAmount: '3',
              unitWeight: '3'
            },
            form60: {
              indianCustomerPercent: '2',
              isNetInvoice: '3',
              nonIndianCustomerPercent: '3'
            },
            isAdvancedCNAllowed: true,
            isGhsAllowed: true,
            isOnSingleInvoice: true,
            jewellery: {
              cashAmount: '3',
              netInvoiceAmount: '3',
              panCardPercent: '4'
            },
            silverPlatinumConfig: {
              isPlatinumAllowed: true,
              isSilverAllowed: true
            }
          }
        }
      };
      const action = new UpdateBrandMasterDetails(parameters);
      const outcome = new UpdateBrandMasterDetailsSuccess(res);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: res });
      brandMasterService.updateBrandMasterDetails.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.updateBrandMasterDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters: BrandMasterDetails = {
        brandCode: 'tanishq',
        isActive: true
      };
      const action = new UpdateBrandMasterDetails(parameters);
      const error = new Error('some error');
      const outcome = new UpdateBrandMasterDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      brandMasterService.updateBrandMasterDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.updateBrandMasterDetails$).toBeObservable(expected);
    });
  });
});
