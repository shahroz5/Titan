//you should simply assert that you get the right state given the provided inputs.

import * as actions from './brand-master.actons';

import { BrandMasterState } from './brand-master.state';
import { initialState, brandMasterReducer } from './brand-master.reducer';
import {
  BrandMaster,
  BrandListingPayload,
  BrandListing,
  SaveBrandMasterDetailsPayload,
  UpdateBrandMasterDetailsPayload,
  UpadateIsActivePayload,
  BrandCMDetails,
  BrandConfigDetails,
  BrandCustomerDetails,
  BrandMasterDetails,
  BrandPanCardDetails,
  BrandTaxDetails,
  BrandMasterListing
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

describe('Brand reducer Testing Suite', () => {
  const createBrand = (
    brandCode: string,
    orgCode: string,
    description: string,
    isActive: boolean,
    configDetails: BrandConfigDetails,
    cmDetails: BrandCMDetails,
    customerDetails: BrandCustomerDetails,
    panCardDetails: BrandPanCardDetails,
    taxDetails: BrandTaxDetails
  ): BrandMasterDetails => {
    return {
      brandCode,
      orgCode,
      configDetails,
      description,
      cmDetails,
      customerDetails,
      panCardDetails,
      taxDetails,
      isActive
    };
  };

  const brand1 = createBrand(
    'brand1',
    'TJ',
    'brand1',
    true,
    null,
    null,
    null,
    null,
    null
  );

  const brand2 = createBrand(
    'brand2',
    'TJ',
    'brand2',
    true,
    null,
    null,
    null,
    null,
    null
  );

  describe('Testing LoadBrandListing ', () => {
    beforeEach(() => {});
    it('Load BrandListing should set the isLoading to true', () => {
      const payload: BrandListingPayload = {
        pageIndex: 0,
        pageSize: 100
      };

      const action = new actions.LoadBrandListing(payload);

      const result: BrandMasterState = brandMasterReducer(initialState, action);

      expect(result.isLoading).toBe(true);
    });
    it('LoadBrandListingSuccess should return list of brands', () => {
      const brandArray = [brand1, brand2];
      const brandList: BrandMasterListing = {
        results: brandArray,
        totalElements: 2
      };
      const action = new actions.LoadBrandListingSuccess(brandList);

      const result: BrandMasterState = brandMasterReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.brandlist.ids.length).toBe(2);
    });
    it('LoadBrandListingFailure should return error', () => {
      const action = new actions.LoadBrandListingFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: BrandMasterState = brandMasterReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing SaveBrandMasterDetails Functionality ', () => {
    beforeEach(() => {});
    it('SaveBrandMasterDetails ', () => {
      const payload: BrandMasterDetails = {
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
      const action = new actions.SaveBrandMasterDetails(payload);

      const result: BrandMasterState = brandMasterReducer(initialState, action);

      expect(result.isLoading).toBe(true);
      expect(result.hasSaved).toBe(false);
    });
    it('SaveBrandMasterDetailsSuccess should update the hasSaved property to true', () => {
      const payload: BrandMasterDetails = {
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
      const action = new actions.SaveBrandMasterDetailsSuccess(payload);

      const result: BrandMasterState = brandMasterReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.hasSaved).toBe(true);
    });
    it('SaveBrandMasterDetailsFailure should return error', () => {
      const action = new actions.SaveBrandMasterDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: BrandMasterState = brandMasterReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing UpdateBrandMasterDetails ', () => {
    beforeEach(() => {});
    it('UpdateBrandMasterDetails ', () => {
      const payload: BrandMasterDetails = {
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
      const action = new actions.UpdateBrandMasterDetails(payload);

      const result: BrandMasterState = brandMasterReducer(initialState, action);

      expect(result.isLoading).toBe(true);
    });

    it('UpdateBrandMasterDetailsFailure should return error', () => {
      const action = new actions.UpdateBrandMasterDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: BrandMasterState = brandMasterReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing SearchBrandByBrandCode Functionality ', () => {
    beforeEach(() => {});
    it('SearchBrandByBrandCode should return searched brand', () => {
      const payload = 'tanishq';

      const action = new actions.SearchBrandDetails(payload);

      const result: BrandMasterState = brandMasterReducer(initialState, action);

      expect(result.isLoading).toBe(true);
    });
    it('SearchBrandByBrandCodeSuccess should return searched brand', () => {
      const brandArray = [brand1];
      const brandList: BrandMasterListing = {
        results: brandArray,
        totalElements: 1
      };
      const action = new actions.SearchBrandDetailsSuccess(brandList);

      const result: BrandMasterState = brandMasterReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.brandlist.ids.length).toBe(1);
    });
    it('SearchBrandByBrandCodeFailure should return error', () => {
      const action = new actions.SearchBrandDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: BrandMasterState = brandMasterReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });
});
