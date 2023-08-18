import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  CustomErrors,
  BrandListingPayload,
  UpdateBrandMasterDetailsPayload,
  BrandMasterDetails,
  BrandMasterListing
} from '@poss-web/shared/models';
import {
  BrandMasterActionTypes,
  LoadBrandListing,
  LoadBrandListingSuccess,
  LoadBrandListingFailure,
  SaveBrandMasterDetails,
  SaveBrandMasterDetailsSuccess,
  SaveBrandMasterDetailsFailure,
  UpdateBrandMasterDetails,
  UpdateBrandMasterDetailsSuccess,
  UpdateBrandMasterDetailsFailure,
  SearchBrandDetails,
  SearchBrandDetailsSuccess,
  SearchBrandDetailsFailure
} from './brand-master.actons';

describe('Brand Master Action Testing Suite', () => {
  describe('LoadBrandListing Action Test Cases', () => {
    it('should check correct type is used for  LoadBrandListing action ', () => {
      const payload: BrandListingPayload = {
        pageIndex: 0,
        pageSize: 100
      };
      const action = new LoadBrandListing(payload);
      expect({ ...action }).toEqual({
        type: BrandMasterActionTypes.LOAD_BRAND_MASTER_LISTING,
        payload
      });
    });
    it('should check correct type is used for  LoadBrandListingSuccess action ', () => {
      const payload: BrandMasterListing = { results: [], totalElements: 0 };
      const action = new LoadBrandListingSuccess(payload);

      expect({ ...action }).toEqual({
        type: BrandMasterActionTypes.LOAD_BRAND_MASTER_LISTING_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadBrandListingFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadBrandListingFailure(payload);

      expect({ ...action }).toEqual({
        type: BrandMasterActionTypes.LOAD_BRAND_MASTER_LISTING_FAILURE,
        payload
      });
    });
  });

  describe('SaveBrandMasterDetails Action Test Cases', () => {
    it('should check correct type is used for  SaveBrandMasterDetails action ', () => {
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
      const action = new SaveBrandMasterDetails(payload);
      expect({ ...action }).toEqual({
        type: BrandMasterActionTypes.SAVE_BRAND_MASTER_DETAILS,
        payload
      });
    });
    it('should check correct type is used for SaveBrandMasterDetailsSuccess action ', () => {
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
      const action = new SaveBrandMasterDetailsSuccess(payload);

      expect({ ...action }).toEqual({
        type: BrandMasterActionTypes.SAVE_BRAND_MASTER_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  SaveBrandMasterDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SaveBrandMasterDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type: BrandMasterActionTypes.SAVE_BRAND_MASTER_DETAILS_FAILURE,
        payload
      });
    });
  });

  describe('UpdateBrandMasterDetails Action Test Cases', () => {
    it('should check correct type is used for  UpdateBrandMasterDetails action ', () => {
      const payload: UpdateBrandMasterDetailsPayload = {
        brandCode: 'tanishq',
        data: {
          isActive: false
        }
      };
      const action = new UpdateBrandMasterDetails(payload);
      expect({ ...action }).toEqual({
        type: BrandMasterActionTypes.UPDATE_BRAND_MASTER_DETAILS,
        payload
      });
    });
    it('should check correct type is used for UpdateBrandMasterDetailsSuccess action ', () => {
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

      const action = new UpdateBrandMasterDetailsSuccess(payload);

      expect({ ...action }).toEqual({
        type: BrandMasterActionTypes.UPDATE_BRAND_MASTER_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  UpdateBrandMasterDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new UpdateBrandMasterDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type: BrandMasterActionTypes.UPDATE_BRAND_MASTER_DETAILS_FAILURE,
        payload
      });
    });
  });

  describe('SearchBrandByBrandCode Action Test Cases', () => {
    it('should check correct type is used for  SearchBrandByBrandCode action ', () => {
      const payload = 'tanishq';
      const action = new SearchBrandDetails(payload);
      expect({ ...action }).toEqual({
        type: BrandMasterActionTypes.SEARCH_BRAND_MASTER_DETAILS,
        payload
      });
    });
    it('should check correct type is used for SearchBrandByBrandCodeSuccess action ', () => {
      const payload: BrandMasterListing = { results: [], totalElements: 0 };
      const action = new SearchBrandDetailsSuccess(payload);

      expect({ ...action }).toEqual({
        type: BrandMasterActionTypes.SEARCH_BRAND_MASTER_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for SearchBrandByBrandCodeFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SearchBrandDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type: BrandMasterActionTypes.SEARCH_BRAND_MASTER_DETAILS_FAILURE,
        payload
      });
    });
  });
});
