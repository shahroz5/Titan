import {
  BrandListingPayload,
  BrandMasterDetails
} from '@poss-web/shared/models';
import { Store } from '@ngrx/store';

import { TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { brandAdaptor } from './brand-master.entity';
import { BrandMasterState } from './brand-master.state';
import { BrandMasterFacade } from './brand-master.facade';
import {
  LoadBrandDetails,
  LoadBrandListing,
  SaveBrandMasterDetails,
  SearchBrandDetails,
  UpdateBrandMasterDetails
} from './brand-master.actons';

describe('Brand Master facade Testing Suite', () => {
  const initialState: BrandMasterState = {
    brandlist: brandAdaptor.getInitialState(),
    totalElements: null,
    error: null,
    brandDetails: null,
    isLoading: null,
    hasSaved: null
  };

  let brandMasterFacade: BrandMasterFacade;
  let store: MockStore<BrandMasterFacade>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), BrandMasterFacade]
    });
    store = TestBed.get(Store);
    brandMasterFacade = TestBed.inject(BrandMasterFacade);
  });

  describe('Dispatch Actions action', () => {
    it('should call LOAD_BRAND_MASTER_LISTING action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: BrandListingPayload = {
        pageIndex: 0,
        pageSize: 100
      };
      const action = new LoadBrandListing(payload);
      brandMasterFacade.loadBrandMasterList(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call SAVE_BRAND_MASTER_DETAILS action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
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
      brandMasterFacade.saveBrandMasterDetails(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call UPDATE_BRAND_MASTER_DETAILS action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
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
      const action = new UpdateBrandMasterDetails(payload);
      brandMasterFacade.updateBrandMasterDetails(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LOAD_BRAND_MASTER_DETAILS action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: BrandMasterDetails = {
        brandCode: 'tanishq'
      };
      const action = new LoadBrandDetails(payload.brandCode);
      brandMasterFacade.loadBrandDetails(payload.brandCode);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call SEARCH_BRAND_MASTER_DETAILS action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: BrandMasterDetails = {
        brandCode: 'tanishq'
      };
      const action = new SearchBrandDetails(payload.brandCode);
      brandMasterFacade.searchBrand(payload.brandCode);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    describe('Access Selector action', () => {
      it('should access the getBrandMasterList selector action', () => {
        expect(brandMasterFacade.getBrandMasterList()).toEqual(
          brandMasterFacade['brandList$']
        );
      });

      it('should access the getBrandMasterDetails selector action', () => {
        expect(brandMasterFacade.getBrandMasterDetails()).toEqual(
          brandMasterFacade['brandMasterDetails$']
        );
      });

      it('should access the getHasSaved selector action', () => {
        expect(brandMasterFacade.getHasSaved()).toEqual(
          brandMasterFacade['hasSaved$']
        );
      });

      it('should access the getIsloading selector action', () => {
        expect(brandMasterFacade.getIsloading()).toEqual(
          brandMasterFacade['isLoading$']
        );
      });

      it('should access the getError selector action', () => {
        expect(brandMasterFacade.getError()).toEqual(
          brandMasterFacade['hasError$']
        );
      });

      it('should access the getTotalElements selector action', () => {
        expect(brandMasterFacade.getTotalElements()).toEqual(
          brandMasterFacade['totalElements$']
        );
      });
    });
  });
});
