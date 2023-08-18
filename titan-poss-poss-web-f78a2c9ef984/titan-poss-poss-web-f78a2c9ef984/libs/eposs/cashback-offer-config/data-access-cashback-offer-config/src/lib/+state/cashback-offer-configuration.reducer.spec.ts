//you should simply assert that you get the right state given the provided inputs.

import * as actions from './cashback-offer-configuration.actions';

import {
  SaveBankDetailsPayload,
  LoadCashbackOfferListPayload,
  CashbackOfferList,
  PayerBankList,
  BankDetailsPayload,
  UpdateBankDetailsPayload,
  OfferDetails,
  OfferDetailResponse,
  ProductGroupMappingOption,
  UploadFile,
  CardDetailsUploadResponse,
  SaveProductGroupPayload,
  UpdateCardDetails,
  CardDetailsResponse,
  LoadCardDetailsPayload
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  cashbackOfferConfigurationReducer,
  initialState
} from './cashback-offer-configuration.reducer';
import { CashbackOfferConfigurationState } from './cashback-offer-configuration.state';

describe('cashbackOfferConfigurationReducer reducer Testing Suite', () => {
  describe('Testing LoadCashbackOfferList ', () => {
    beforeEach(() => {});
    it('Load LoadCashbackOfferList should set the isLoading to true', () => {
      const payload: LoadCashbackOfferListPayload = {
        pageIndex: 0,
        pageSize: 100,
        length: 0
      };

      const action = new actions.LoadCashbackOfferList(payload);

      const result: CashbackOfferConfigurationState = cashbackOfferConfigurationReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(true);
    });
    it('LoadCashbackOfferListSuccess should return list of cashback list', () => {
      const payload: CashbackOfferList = {
        cashbackOfferList: [
          {
            cardBankName: 'HDFC',
            cashBackName: 'test',
            isActive: true,
            id: '1'
          }
        ],
        totalElements: 1
      };

      const action = new actions.LoadCashbackOfferListSuccess(payload);

      const result: CashbackOfferConfigurationState = cashbackOfferConfigurationReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.cashbackOfferList.length).toBe(1);
    });
    it('LoadCashbackOfferListFailure should return error', () => {
      const action = new actions.LoadCashbackOfferListFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CashbackOfferConfigurationState = cashbackOfferConfigurationReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadPayerBankList Functionality ', () => {
    beforeEach(() => {});
    it('LoadPayerBankList ', () => {
      const action = new actions.LoadPayerBankList();

      const result: CashbackOfferConfigurationState = cashbackOfferConfigurationReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(true);
    });
    it('LoadPayerBankListSuccess should update the payerBank property', () => {
      const payload: PayerBankList[] = [
        {
          id: '1',
          name: 'HDFC'
        }
      ];
      const action = new actions.LoadPayerBankListSuccess(payload);

      const result: CashbackOfferConfigurationState = cashbackOfferConfigurationReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.payerBank.length).toBe(1);
    });
    it('LoadPayerBankListFailure should return error', () => {
      const action = new actions.LoadPayerBankListFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CashbackOfferConfigurationState = cashbackOfferConfigurationReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing SaveBankDetails ', () => {
    beforeEach(() => {});
    it('SaveBankDetails ', () => {
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
      const action = new actions.SaveBankDetails(payload);

      const result: CashbackOfferConfigurationState = cashbackOfferConfigurationReducer(
        initialState,
        action
      );

      expect(result.hasSaved).toBe(null);
    });
    it('SaveBankDetailsSuccess should update the hasUpdated property to true', () => {
      const payload: BankDetailsPayload = {
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
      const action = new actions.SaveBankDetailsSuccess(payload);

      const result: CashbackOfferConfigurationState = cashbackOfferConfigurationReducer(
        initialState,
        action
      );

      expect(result.hasSaved).toBe(true);
      expect(result.bankDetails).toBe(payload);
    });
    it('SaveBankDetailsFailure should return error', () => {
      const action = new actions.SaveBankDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CashbackOfferConfigurationState = cashbackOfferConfigurationReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing UpdateBankDetails ', () => {
    beforeEach(() => {});
    it('UpdateBankDetails should return the update bank details ', () => {
      const payload: UpdateBankDetailsPayload = {
        id: '1',
        data: {
          isActive: false
        }
      };
      const action = new actions.UpdateBankDetails(payload);

      const result: CashbackOfferConfigurationState = cashbackOfferConfigurationReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(true);
      expect(result.hasUpdated).toBe(false);
    });
    it('UpdateBankDetailsSuccess should return the updated bank details', () => {
      const payload: BankDetailsPayload = {
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

      const action = new actions.UpdateBankDetailsSuccess(payload);

      const result: CashbackOfferConfigurationState = cashbackOfferConfigurationReducer(
        initialState,
        action
      );

      expect(result.hasUpdated).toBe(true);
      expect(result.isLoading).toBe(false);
      expect(result.bankDetails).toEqual(payload);
    });
    it('UpdateBankDetailsFailure should return error', () => {
      const action = new actions.UpdateBankDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CashbackOfferConfigurationState = cashbackOfferConfigurationReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadOfferDetailsById Functionality ', () => {
    beforeEach(() => {});
    it('LoadOfferDetailsById should return offer details', () => {
      const payload = '1';
      const action = new actions.LoadOfferDetailsById(payload);

      const result: CashbackOfferConfigurationState = cashbackOfferConfigurationReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(true);
    });
    it('LoadOfferDetailsByIdSuccess should return offer details', () => {
      const payload: OfferDetails[] = [
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

      const action = new actions.LoadOfferDetailsByIdSuccess(payload);

      const result: CashbackOfferConfigurationState = cashbackOfferConfigurationReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.offerDetails.length).toBe(1);
    });
    it('LoadOfferDetailsByIdFailure should return error', () => {
      const action = new actions.LoadOfferDetailsByIdFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CashbackOfferConfigurationState = cashbackOfferConfigurationReducer(
        initialState,
        action
      );

      expect(result.error).toEqual(null);
    });
  });

  describe('Testing UpdateOfferDetailsById Functionality ', () => {
    beforeEach(() => {});
    it('UpdateOfferDetailsById should return offer details', () => {
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
      const action = new actions.UpdateOfferDetailsById(payload);

      const result: CashbackOfferConfigurationState = cashbackOfferConfigurationReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(true);

      expect(result.offerDetailsUpdated).toBe(false);
    });
    it('UpdateOfferDetailsByIdSuccess should return offer details', () => {
      const action = new actions.UpdateOfferDetailsByIdSuccess();

      const result: CashbackOfferConfigurationState = cashbackOfferConfigurationReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.offerDetailsUpdated).toBe(true);
    });
    it('UpdateOfferDetailsByIdFailure should return error', () => {
      const action = new actions.UpdateOfferDetailsByIdFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CashbackOfferConfigurationState = cashbackOfferConfigurationReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadMappedProductGroupById Functionality ', () => {
    beforeEach(() => {});
    it('LoadMappedProductGroupById should return product groups', () => {
      const payload = '1';
      const action = new actions.LoadMappedProductGroupById(payload);

      const result: CashbackOfferConfigurationState = cashbackOfferConfigurationReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(true);
    });
    it('LoadMappedProductGroupByIdSuccess should return product groups', () => {
      const payload: ProductGroupMappingOption[] = [
        { id: '1', description: '72' }
      ];

      const action = new actions.LoadMappedProductGroupByIdSuccess(payload);

      const result: CashbackOfferConfigurationState = cashbackOfferConfigurationReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.selectedProductGroup.length).toBe(1);
    });
    it('LoadMappedProductGroupByIdFailure should return error', () => {
      const action = new actions.LoadMappedProductGroupByIdFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CashbackOfferConfigurationState = cashbackOfferConfigurationReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing UpdateProductGroupById Functionality ', () => {
    beforeEach(() => {});
    it('UpdateProductGroupById should set isLoading true hasupdated fasle', () => {
      const payload: SaveProductGroupPayload = {
        id: '1',
        data: {
          addProductGroups: [{ productGroupCode: '72' }],
          removeProductGroups: []
        }
      };
      const action = new actions.UpdateProductGroupById(payload);

      const result: CashbackOfferConfigurationState = cashbackOfferConfigurationReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(true);
      expect(result.isProductGroupUpdated).toBe(false);
    });
    it('UpdateProductGroupByIdSuccess should set  isLoading fasle hasupdated true', () => {
      const action = new actions.UpdateProductGroupByIdSuccess();

      const result: CashbackOfferConfigurationState = cashbackOfferConfigurationReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.isProductGroupUpdated).toBe(true);
    });
    it('UpdateProductGroupByIdFailure should return error', () => {
      const action = new actions.UpdateProductGroupByIdFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CashbackOfferConfigurationState = cashbackOfferConfigurationReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing UploadCardDetailsById Functionality ', () => {
    beforeEach(() => {});
    it('UploadCardDetailsById should set isloading true', () => {
      const payload: UploadFile = {
        id: '1',
        reqfile: new FormData()
      };
      const action = new actions.UploadCardDetailsById(payload);

      const result: CashbackOfferConfigurationState = cashbackOfferConfigurationReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(true);
    });
    it('UploadCardDetailsByIdSuccess should return card details', () => {
      const payload: CardDetailsUploadResponse = {
        fileProcessId: '1',
        records: null,
        hasError: false,
        message: ''
      };

      const action = new actions.UploadCardDetailsByIdSuccess(payload);

      const result: CashbackOfferConfigurationState = cashbackOfferConfigurationReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
    });
    it('UploadCardDetailsByIdFailure should return error', () => {
      const action = new actions.UploadCardDetailsByIdFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CashbackOfferConfigurationState = cashbackOfferConfigurationReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing ErrorLogDownload Functionality ', () => {
    beforeEach(() => {});
    it('ErrorLogDownload should return error log', () => {
      const payload = '1';
      const action = new actions.ErrorLogDownload(payload);

      const result: CashbackOfferConfigurationState = cashbackOfferConfigurationReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(true);
    });
    it('ErrorLogDownloadSuccess should return error log', () => {
      const payload = '';

      const action = new actions.ErrorLogDownloadSuccess(payload);

      const result: CashbackOfferConfigurationState = cashbackOfferConfigurationReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.errorLog).toEqual(payload);
    });
    it('ErrorLogDownloadFailure should return error', () => {
      const action = new actions.ErrorLogDownloadFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CashbackOfferConfigurationState = cashbackOfferConfigurationReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing ClearOfferDetailsById Functionality ', () => {
    beforeEach(() => {});
    it('ClearOfferDetailsById should return searched payment mode', () => {
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
      const action = new actions.ClearOfferDetailsById(payload);

      const result: CashbackOfferConfigurationState = cashbackOfferConfigurationReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(true);
    });
    it('ClearOfferDetailsByIdSuccess should clear offer details', () => {
      const action = new actions.ClearOfferDetailsByIdSuccess();

      const result: CashbackOfferConfigurationState = cashbackOfferConfigurationReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
    });
    it('ClearOfferDetailsByIdFailure should return error', () => {
      const action = new actions.ClearOfferDetailsByIdFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CashbackOfferConfigurationState = cashbackOfferConfigurationReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing UpdateCardDeatislById Functionality ', () => {
    beforeEach(() => {});
    it('UpdateCardDeatislById should  update card details', () => {
      const payload: UpdateCardDetails = {
        id: '11',
        updateCards: ''
      };
      const action = new actions.UpdateCardDeatislById(payload);

      const result: CashbackOfferConfigurationState = cashbackOfferConfigurationReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(true);
    });
    it('UpdateCardDeatislByIdSuccess should  update card details', () => {
      const action = new actions.UpdateCardDeatislByIdSuccess();

      const result: CashbackOfferConfigurationState = cashbackOfferConfigurationReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
    });
    it('UpdateCardDeatislByIdFailure should return error', () => {
      const action = new actions.UpdateCardDeatislByIdFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CashbackOfferConfigurationState = cashbackOfferConfigurationReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadCardDetailsById Functionality ', () => {
    beforeEach(() => {});
    it('LoadCardDetailsById should return card Details', () => {
      const payload: LoadCardDetailsPayload = {
        id: '1',
        pageEvent: {
          pageIndex: 1,
          pageSize: 2,
          length: 0
        }
      };
      const action = new actions.LoadCardDetailsById(payload);

      const result: CashbackOfferConfigurationState = cashbackOfferConfigurationReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(true);
    });
    it('LoadCardDetailsByIdSuccess should return card Details', () => {
      const payload: CardDetailsResponse = {
        cardDetails: [
          { cardNo: '111', isActive: true, id: '11', newlyAdded: true }
        ],
        totalElements: 1
      };

      const action = new actions.LoadCardDetailsByIdSuccess(payload);

      const result: CashbackOfferConfigurationState = cashbackOfferConfigurationReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.cardDetails.length).toBe(1);
    });
    it('LoadCardDetailsByIdFailure should return error', () => {
      const action = new actions.LoadCardDetailsByIdFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CashbackOfferConfigurationState = cashbackOfferConfigurationReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadBankDetailsById Functionality ', () => {
    beforeEach(() => {});
    it('LoadBankDetailsById should return return bank deatails', () => {
      const payload = '1';
      const action = new actions.LoadBankDetailsById(payload);

      const result: CashbackOfferConfigurationState = cashbackOfferConfigurationReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(true);
    });
    it('LoadBankDetailsByIdSuccess should return bank deatails', () => {
      const payload: BankDetailsPayload = {
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

      const action = new actions.LoadBankDetailsByIdSuccess(payload);

      const result: CashbackOfferConfigurationState = cashbackOfferConfigurationReducer(
        initialState,
        action
      );

      expect(result.isLoading).toBe(false);
      expect(result.bankDetails).toEqual(payload);
    });
    it('LoadBankDetailsByIdFailure should return error', () => {
      const action = new actions.LoadBankDetailsByIdFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CashbackOfferConfigurationState = cashbackOfferConfigurationReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing ResetIsCleared Functionality ', () => {
    beforeEach(() => {});
    it('LoadOfferDetailsById should clear isCleared', () => {
      const action = new actions.ResetIsCleared();

      const result: CashbackOfferConfigurationState = cashbackOfferConfigurationReducer(
        initialState,
        action
      );

      expect(result.isCleared).toBe(null);
    });
  });

  describe('Testing LoadResetFileData Functionality ', () => {
    beforeEach(() => {});
    it('LoadResetFileData should clear fileResponse and errorLog', () => {
      const action = new actions.LoadResetFileData();

      const result: CashbackOfferConfigurationState = cashbackOfferConfigurationReducer(
        initialState,
        action
      );

      expect(result.fileResponse).toBe(null);
      expect(result.errorLog).toBe(null);
    });
  });

  describe('Testing LoadReset ', () => {
    beforeEach(() => {});
    it('LoadReset should reset the store', () => {
      const action = new actions.LoadReset();

      const result: CashbackOfferConfigurationState = cashbackOfferConfigurationReducer(
        initialState,
        action
      );

      expect(result).toEqual(initialState);
    });
  });
});
