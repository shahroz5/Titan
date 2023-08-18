// you will need to assert that the store is calling the right selector function.

import {
  CustomErrors,
  CashbackOffer,
  BankDetailsPayload,
  PayerBankList,
  OfferDetails,
  ProductGroupMappingOption,
  CardDetailsUploadResponse
} from '@poss-web/shared/models';

import { initialState } from './cashback-offer-configuration.reducer';
import * as selectors from './cashback-offer-configuration.selectors';

import { CashbackOfferConfigurationState } from './cashback-offer-configuration.state';
import { of } from 'rxjs';

describe('CashbackOfferConfigurationState selector Testing Suite', () => {
  const bankDetailsPayload: BankDetailsPayload = {
    cashbackName: 'test',
    cardNoLength: '1',
    isActive: true,
    bankName: 'HDFC',
    startDate: 22,
    endDate: 23,
    cmRemarks: 'remarks',
    fromFirst: true,
    isCashAmount: true,
    maxUsageCount: '1',
    mobileFlag: true,
    digitsTobeValidated: '2',
    offerRemarks: 'remarks',
    excludeCashback: true
  };
  const error: CustomErrors = {
    error: null,
    code: '',
    message: '',
    traceId: '',
    timeStamp: ''
  };
  describe('Testing CashbackOfferConfigurationState related Selectors', () => {
    it('selectCashbackOfferList Should return the list of cashback offer list', () => {
      const cashbackOfferList: CashbackOffer[] = [
        {
          cardBankName: 'HDFC',
          cashBackName: 'test',
          isActive: true,
          id: '1'
        }
      ];

      const state: CashbackOfferConfigurationState = {
        ...initialState,
        cashbackOfferList: cashbackOfferList
      };
      expect(
        selectors.CashbackOfferConfigurationSelectors.selectCashbackOfferList.projector(
          state
        )
      ).toEqual(cashbackOfferList);
    });

    it('selectIsloading Should return the true or false', () => {
      const state: CashbackOfferConfigurationState = {
        ...initialState,
        isLoading: true
      };
      expect(
        selectors.CashbackOfferConfigurationSelectors.selectIsloading.projector(
          state
        )
      ).toEqual(true);
    });
    it('selectError Should return the error object', () => {
      const state: CashbackOfferConfigurationState = {
        ...initialState,
        error: {
          error: null,
          timeStamp: '',
          traceId: '',
          code: '',
          message: ''
        }
      };
      expect(
        selectors.CashbackOfferConfigurationSelectors.selectError.projector(
          state
        )
      ).toEqual(error);
    });

    it('selectHasSaved Should return the true or false', () => {
      const state: CashbackOfferConfigurationState = {
        ...initialState,
        hasSaved: true
      };
      expect(
        selectors.CashbackOfferConfigurationSelectors.selectHasSaved.projector(
          state
        )
      ).toEqual(true);
    });
    it('selectHasUpdated Should return the true or false', () => {
      const state: CashbackOfferConfigurationState = {
        ...initialState,
        hasUpdated: true
      };
      expect(
        selectors.CashbackOfferConfigurationSelectors.selectHasUpdated.projector(
          state
        )
      ).toEqual(true);
    });

    it('selectTotalElements  Should return total elements', () => {
      const state: CashbackOfferConfigurationState = {
        ...initialState,
        totalElements: 10
      };
      expect(
        selectors.CashbackOfferConfigurationSelectors.selectTotalElements.projector(
          state
        )
      ).toEqual(10);
    });

    it('selectbankDetails Should return the bank details ', () => {
      const state: CashbackOfferConfigurationState = {
        ...initialState,
        bankDetails: bankDetailsPayload
      };
      expect(
        selectors.CashbackOfferConfigurationSelectors.selectbankDetails.projector(
          state
        )
      ).toEqual(bankDetailsPayload);
    });
    it('selectPayerBank Should return the payer banks ', () => {
      const payerBankList: PayerBankList[] = [
        {
          id: '1',
          name: 'HDFC'
        }
      ];
      const state: CashbackOfferConfigurationState = {
        ...initialState,
        payerBank: payerBankList
      };
      expect(
        selectors.CashbackOfferConfigurationSelectors.selectPayerBank.projector(
          state
        )
      ).toEqual(payerBankList);
    });

    it('selectExcludeCashBack Should return the excludeCashback', () => {
      const state: CashbackOfferConfigurationState = {
        ...initialState,
        excludeCashback: true
      };
      expect(
        selectors.CashbackOfferConfigurationSelectors.selectExcludeCashBack.projector(
          state
        )
      ).toEqual(true);
    });

    it('selectOfferDetails Should return the offerDetails', () => {
      const offerDetails: OfferDetails[] = [
        {
          maxDiscountPercent: 100,
          maxInvoiceAmt: 100,
          maxSwipeAmt: 100,
          minInvoiceAmt: 100,
          minSwipeAmt: 100,
          discountAmt: '100',
          discountPercent: 100,
          id: '1',
          isCashbackAmount: true
        }
      ];
      const state: CashbackOfferConfigurationState = {
        ...initialState,
        offerDetails: offerDetails
      };
      expect(
        selectors.CashbackOfferConfigurationSelectors.selectOfferDetails.projector(
          state
        )
      ).toEqual(offerDetails);
    });

    it('selectIsCleared Should return the selectIsCleared', () => {
      const state: CashbackOfferConfigurationState = {
        ...initialState,
        isCleared: true
      };
      expect(
        selectors.CashbackOfferConfigurationSelectors.selectIsCleared.projector(
          state
        )
      ).toEqual(true);
    });

    it('selectIsCashAmount Should return the isCashAmount ', () => {
      const payerBankList: PayerBankList[] = [
        {
          id: '1',
          name: 'HDFC'
        }
      ];
      const state: CashbackOfferConfigurationState = {
        ...initialState,
        isCashAmount: true
      };
      expect(
        selectors.CashbackOfferConfigurationSelectors.selectIsCashAmount.projector(
          state
        )
      ).toEqual(true);
    });

    it('selectSelectedProductGroup Should return the selectedProductGroup ', () => {
      const payload: ProductGroupMappingOption[] = [
        { id: '1', description: '72' }
      ];

      const state: CashbackOfferConfigurationState = {
        ...initialState,
        selectedProductGroup: payload
      };
      expect(
        selectors.CashbackOfferConfigurationSelectors.selectSelectedProductGroup.projector(
          state
        )
      ).toEqual(payload);
    });

    it('selectCardDetails Should return the cardDetails ', () => {
      const payload = [{ cardNo: '111', isActive: true, id: '11', newlyAdded: true }];

      const state: CashbackOfferConfigurationState = {
        ...initialState,
        cardDetails: payload
      };
      expect(
        selectors.CashbackOfferConfigurationSelectors.selectCardDetails.projector(
          state
        )
      ).toEqual(payload);
    });

    it('selectisFileResponse Should return the fileResponse ', () => {
      const payload: CardDetailsUploadResponse = {
        fileProcessId: '1',
        records: null,
        hasError: false,
        message: ''
      };
      const state: CashbackOfferConfigurationState = {
        ...initialState,
        fileResponse: payload
      };
      expect(
        selectors.CashbackOfferConfigurationSelectors.selectisFileResponse.projector(
          state
        )
      ).toEqual(payload);
    });
    it('selectOfferDetailsUpdated Should return the selectedProductGroup ', () => {
      const state: CashbackOfferConfigurationState = {
        ...initialState,
        offerDetailsUpdated: true
      };
      expect(
        selectors.CashbackOfferConfigurationSelectors.selectOfferDetailsUpdated.projector(
          state
        )
      ).toEqual(true);
    });
    it('selectErrorlog Should return the selectedProductGroup ', () => {
      const state: CashbackOfferConfigurationState = {
        ...initialState,
        errorLog: ''
      };
      expect(
        selectors.CashbackOfferConfigurationSelectors.selectErrorlog.projector(
          state
        )
      ).toEqual('');
    });

    it('selectSelectedProductGroup Should return the selectSelectedProductGroup ', () => {
      const state: CashbackOfferConfigurationState = {
        ...initialState,
        isProductGroupUpdated: true
      };
      expect(
        selectors.CashbackOfferConfigurationSelectors.selectisProductGroupUpdated.projector(
          state
        )
      ).toEqual(true);
    });
  });
});
