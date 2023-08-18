import {
  LoadCashbackOfferListPayload,
  SaveBankDetailsPayload,
  OfferDetailResponse,
  SaveProductGroupPayload,
  UpdateBankDetailsPayload,
  UploadFile,
  UpdateCardDetails,
  LoadCardDetailsPayload
} from '@poss-web/shared/models';
import { Store } from '@ngrx/store';

import { TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';

import { CashbackOfferConfigurationState } from './cashback-offer-configuration.state';
import { CashBackOfferConfigurationFacade } from './cashback-offer-configuration.facade';
import {
  LoadReset,
  LoadCashbackOfferList,
  LoadPayerBankList,
  SaveBankDetails,
  UpdateBankDetails,
  LoadOfferDetailsById,
  UpdateOfferDetailsById,
  LoadMappedProductGroupById,
  UpdateProductGroupById,
  UploadCardDetailsById,
  ErrorLogDownload,
  ClearOfferDetailsById,
  UpdateCardDeatislById,
  LoadCardDetailsById,
  LoadBankDetailsById,
  ResetIsCleared,
  LoadNewBankDetails,
  LoadResetFileData
} from './cashback-offer-configuration.actions';

describe(' cashBackOfferConfigurationFacade Testing Suite', () => {
  const initialState: CashbackOfferConfigurationState = {
    bankDetails: null,
    excludeCashback: null,
    isLoading: null,
    hasSaved: null,
    hasUpdated: null,
    offerDetailsUpdated: null,
    totalElements: null,
    error: null,
    cashbackOfferList: [],
    payerBank: [],
    offerDetails: [],
    isCleared: null,
    isCashAmount: true,
    selectedProductGroup: [],
    isProductGroupUpdated: null,
    cardDetails: null,
    fileResponse: null,
    errorLog: null
  };

  let cashBackOfferConfigurationFacade: CashBackOfferConfigurationFacade;
  let store: MockStore<CashBackOfferConfigurationFacade>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({ initialState }),
        CashBackOfferConfigurationFacade
      ]
    });
    store = TestBed.inject<any>(Store);
    cashBackOfferConfigurationFacade = TestBed.inject<any>(
      CashBackOfferConfigurationFacade
    );
  });

  describe('Dispatch Actions action', () => {
    it('should call LOAD_CASHBACK_OFFER_LIST action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: LoadCashbackOfferListPayload = {
        pageIndex: 0,
        pageSize: 100,
        length: 0
      };
      const action = new LoadCashbackOfferList(payload);
      cashBackOfferConfigurationFacade.loadCashBackList(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LOAD_PAYER_BANK_LIST action', () => {
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new LoadPayerBankList();
      cashBackOfferConfigurationFacade.loadPayerBank();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call SAVE_BANK_DETAILS action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: SaveBankDetailsPayload = {
        cashbackName: 'test',
        cardNoLength: '1',
        isActive: true,
        bankName: 'HDFC',
        startDate: 22,
        endDate: 23,
        cmRemarks: 'remarks',
        firstCardDigits: '1',
        lastCardDigits: '2',
        maxUsageCount: '1',
        mobileFlag: true,
        offerRemarks: 'remarks',
        excludeCashback: true
      };
      const action = new SaveBankDetails(payload);
      cashBackOfferConfigurationFacade.saveBankDetails(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call UPADTE_BANK_DETAILS action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: UpdateBankDetailsPayload = {
        id: '1',
        data: {
          isActive: false
        }
      };
      const action = new UpdateBankDetails(payload);
      cashBackOfferConfigurationFacade.updateBankDetails(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LOAD_OFFER_DETAILS_BY_ID action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload = '1';
      const action = new LoadOfferDetailsById(payload);
      cashBackOfferConfigurationFacade.loadOfferDetails(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call UPDATE_OFFER_DETAILS_BY_ID action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: OfferDetailResponse = {
        id: '1',
        data: {
          addOffers: [
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
          ]
        }
      };
      const action = new UpdateOfferDetailsById(payload);
      cashBackOfferConfigurationFacade.saveOfferDetails(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call LOAD_MAPPED_PRODUCT_GROUP_BY_ID action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload = '1';
      const action = new LoadMappedProductGroupById(payload);
      cashBackOfferConfigurationFacade.loadMappedProductGroup(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call UPDATE_PRODUCT_GROUP_BY_ID action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: SaveProductGroupPayload = {
        id: '1',
        data: {
          addProductGroups: [{ productGroupCode: '72' }],
          removeProductGroups: []
        }
      };
      const action = new UpdateProductGroupById(payload);
      cashBackOfferConfigurationFacade.updateProductGroup(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call UPLOAD_CARD_DETAILS_BY_ID action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: UploadFile = {
        id: '1',
        reqfile: new FormData()
      };
      const action = new UploadCardDetailsById(payload);
      cashBackOfferConfigurationFacade.uploadFile(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call ERROR_LOG_DOWNLOAD action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload = '1';
      const action = new ErrorLogDownload(payload);
      cashBackOfferConfigurationFacade.loadErrorLog(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call CLEAR_OFFER_DETAILS_BY_ID action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: OfferDetailResponse = {
        id: '1',
        data: {
          addOffers: [
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
          ]
        }
      };
      const action = new ClearOfferDetailsById(payload);
      cashBackOfferConfigurationFacade.clearOfferDetails(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call UPDATE_CARD_DETAILS_BY_ID action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: UpdateCardDetails = {
        id: '11',
        updateCards: ''
      };
      const action = new UpdateCardDeatislById(payload);
      cashBackOfferConfigurationFacade.updateCardDetailsById(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call LOAD_CARD_DETAILS_BY_ID action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: LoadCardDetailsPayload = {
        id: '1',
        pageEvent: {
          pageIndex: 1,
          pageSize: 2,
          length: 0
        }
      };
      const action = new LoadCardDetailsById(payload);
      cashBackOfferConfigurationFacade.loadCardDetailById(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call LOAD_BANK_DETAILS_BY_ID action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload = '1';
      const action = new LoadBankDetailsById(payload);
      cashBackOfferConfigurationFacade.loadBankDetails(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LOAD_BANK_DETAILS_BY_ID action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload = '1';
      const action = new LoadBankDetailsById(payload);
      cashBackOfferConfigurationFacade.loadBankDetails(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call RESET_IS_CLEARED action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload = '1';
      const action = new ResetIsCleared();
      cashBackOfferConfigurationFacade.resetIsClearedFlag();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LOAD_NEW_BANK_DETAILS action', () => {
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new LoadNewBankDetails();
      cashBackOfferConfigurationFacade.loadNewBankDetails();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LOAD_RESET_FILE_DATA action', () => {
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new LoadResetFileData();
      cashBackOfferConfigurationFacade.resetFileData();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LOAD_RESET action', () => {
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new LoadReset();
      cashBackOfferConfigurationFacade.loadReset();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
  });

  describe('Access Selector action', () => {
    it('should access the getOfferDetailsUpdated selector action', () => {
      expect(cashBackOfferConfigurationFacade.getOfferDetailsUpdated()).toEqual(
        cashBackOfferConfigurationFacade['offerDetailsUpdated$']
      );
    });

    it('should access the getFileResponse selector action', () => {
      expect(cashBackOfferConfigurationFacade.getFileResponse()).toEqual(
        cashBackOfferConfigurationFacade['fileResponse$']
      );
    });

    it('should access the getCardDetails selector action', () => {
      expect(cashBackOfferConfigurationFacade.getCardDetails()).toEqual(
        cashBackOfferConfigurationFacade['cardDetails$']
      );
    });

    it('should access the getIsProductGroupUpdated selector action', () => {
      expect(
        cashBackOfferConfigurationFacade.getIsProductGroupUpdated()
      ).toEqual(cashBackOfferConfigurationFacade['isProductGroupUpdated$']);
    });

    it('should access the getSelectedProductGroup selector action', () => {
      expect(
        cashBackOfferConfigurationFacade.getSelectedProductGroup()
      ).toEqual(cashBackOfferConfigurationFacade['selectedProductGroup$']);
    });

    it('should access the getIsCashAmount selector action', () => {
      expect(cashBackOfferConfigurationFacade.getIsCashAmount()).toEqual(
        cashBackOfferConfigurationFacade['isCashAmount$']
      );
    });

    it('should access the getIsCleared selector action', () => {
      expect(cashBackOfferConfigurationFacade.getIsCleared()).toEqual(
        cashBackOfferConfigurationFacade['isCleared$']
      );
    });

    it('should access the getOfferDetails selector action', () => {
      expect(cashBackOfferConfigurationFacade.getOfferDetails()).toEqual(
        cashBackOfferConfigurationFacade['offerDetails$']
      );
    });

    it('should access the getExcludeCashBack selector action', () => {
      expect(cashBackOfferConfigurationFacade.getExcludeCashBack()).toEqual(
        cashBackOfferConfigurationFacade['excludeCashback$']
      );
    });
    it('should access the getpayerBank selector action', () => {
      expect(cashBackOfferConfigurationFacade.getpayerBank()).toEqual(
        cashBackOfferConfigurationFacade['payerBank$']
      );
    });
    it('should access the getCashBackOfferList selector action', () => {
      expect(cashBackOfferConfigurationFacade.getCashBackOfferList()).toEqual(
        cashBackOfferConfigurationFacade['cashBackOfferList$']
      );
    });
    it('should access the getBankDetails selector action', () => {
      expect(cashBackOfferConfigurationFacade.getBankDetails()).toEqual(
        cashBackOfferConfigurationFacade['bankDetails$']
      );
    });

    it('should access the getHasSaved selector action', () => {
      expect(cashBackOfferConfigurationFacade.getHasSaved()).toEqual(
        cashBackOfferConfigurationFacade['hasSaved$']
      );
    });
    it('should access the getHasUpdated selector action', () => {
      expect(cashBackOfferConfigurationFacade.getHasUpdated()).toEqual(
        cashBackOfferConfigurationFacade['hasUpdated$']
      );
    });
    it('should access the getTotalElements selector action', () => {
      expect(cashBackOfferConfigurationFacade.getTotalElements()).toEqual(
        cashBackOfferConfigurationFacade['totalElements$']
      );
    });
    it('should access the getError selector action', () => {
      expect(cashBackOfferConfigurationFacade.getError()).toEqual(
        cashBackOfferConfigurationFacade['error$']
      );
    });
    it('should access the getErrorLog selector action', () => {
      expect(cashBackOfferConfigurationFacade.getErrorLog()).toEqual(
        cashBackOfferConfigurationFacade['errorLog$']
      );
    });
    it('should access the getIsloading selector action', () => {
      expect(cashBackOfferConfigurationFacade.getIsloading()).toEqual(
        cashBackOfferConfigurationFacade['isLoading$']
      );
    });
  });
});
