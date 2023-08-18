import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  CustomErrors,
  SaveBankDetailsPayload,
  UpdateBankDetailsPayload,
  LoadCashbackOfferListPayload,
  CashbackOfferList,
  PayerBankList,
  BankDetailsPayload,
  OfferDetails,
  OfferDetailResponse,
  ProductGroupMappingOption,
  SaveProductGroupPayload,
  UploadFile,
  CardDetailsUploadResponse,
  LoadCardDetailsPayload,
  CardDetailsResponse,
  UpdateCardDetails
} from '@poss-web/shared/models';
import {
  CashbackOfferConfigurationActionTypes,
  LoadCashbackOfferListSuccess,
  LoadCashbackOfferListFailure,
  LoadPayerBankList,
  LoadPayerBankListSuccess,
  LoadPayerBankListFailure,
  SaveBankDetails,
  SaveBankDetailsSuccess,
  SaveBankDetailsFailure,
  LoadOfferDetailsById,
  LoadOfferDetailsByIdSuccess,
  LoadOfferDetailsByIdFailure,
  LoadReset,
  LoadCashbackOfferList,
  UpdateBankDetails,
  UpdateBankDetailsSuccess,
  UpdateBankDetailsFailure,
  UpdateOfferDetailsById,
  UpdateOfferDetailsByIdSuccess,
  UpdateOfferDetailsByIdFailure,
  LoadMappedProductGroupByIdSuccess,
  LoadMappedProductGroupById,
  LoadMappedProductGroupByIdFailure,
  UpdateProductGroupById,
  UpdateProductGroupByIdSuccess,
  UpdateProductGroupByIdFailure,
  UploadCardDetailsById,
  UploadCardDetailsByIdSuccess,
  UploadCardDetailsByIdFailure,
  ErrorLogDownload,
  ErrorLogDownloadSuccess,
  ErrorLogDownloadFailure,
  LoadCardDetailsById,
  LoadCardDetailsByIdSuccess,
  LoadCardDetailsByIdFailure,
  UpdateCardDeatislById,
  UpdateCardDeatislByIdSuccess,
  UpdateCardDeatislByIdFailure,
  ClearOfferDetailsById,
  ClearOfferDetailsByIdSuccess,
  ClearOfferDetailsByIdFailure,
  LoadBankDetailsById,
  LoadBankDetailsByIdSuccess,
  LoadBankDetailsByIdFailure,
  ResetIsCleared,
  LoadNewBankDetails,
  LoadResetFileData
} from './cashback-offer-configuration.actions';

describe('Cashbackoffer  Action Testing Suite', () => {
  describe('LoadCashbackOfferList Action Test Cases', () => {
    it('should check correct type is used for  LoadCashbackOfferList action ', () => {
      const payload: LoadCashbackOfferListPayload = {
        pageIndex: 0,
        pageSize: 100,
        length: 0
      };
      const searchValue = '';
      const action = new LoadCashbackOfferList(payload, searchValue);
      expect({ ...action }).toEqual({
        type: CashbackOfferConfigurationActionTypes.LOAD_CASHBACK_OFFER_LIST,
        payload,
        searchValue
      });
    });
    it('should check correct type is used for  LoadCashbackOfferListSuccess action ', () => {
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
      const action = new LoadCashbackOfferListSuccess(payload);

      expect({ ...action }).toEqual({
        type:
          CashbackOfferConfigurationActionTypes.LOAD_CASHBACK_OFFER_LIST_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadCashbackOfferListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadCashbackOfferListFailure(payload);

      expect({ ...action }).toEqual({
        type:
          CashbackOfferConfigurationActionTypes.LOAD_CASHBACK_OFFER_LIST_FAILURE,
        payload
      });
    });
  });

  describe('LoadPayerBankList Action Test Cases', () => {
    it('should check correct type is used for  LoadPayerBankList action ', () => {
      const action = new LoadPayerBankList();
      expect({ ...action }).toEqual({
        type: CashbackOfferConfigurationActionTypes.LOAD_PAYER_BANK_LIST
      });
    });
    it('should check correct type is used for LoadPayerBankListSuccess action ', () => {
      const payload: PayerBankList[] = [
        {
          id: '1',
          name: 'HDFC'
        }
      ];
      const action = new LoadPayerBankListSuccess(payload);

      expect({ ...action }).toEqual({
        type:
          CashbackOfferConfigurationActionTypes.LOAD_PAYER_BANK_LIST_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadPayerBankListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadPayerBankListFailure(payload);

      expect({ ...action }).toEqual({
        type:
          CashbackOfferConfigurationActionTypes.LOAD_PAYER_BANK_LIST_FAILURE,
        payload
      });
    });
  });

  describe('SaveBankDetails Action Test Cases', () => {
    it('should check correct type is used for  SaveBankDetails action ', () => {
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
      expect({ ...action }).toEqual({
        type: CashbackOfferConfigurationActionTypes.SAVE_BANK_DETAILS,
        payload
      });
    });
    it('should check correct type is used for SaveBankDetailsSuccess action ', () => {
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
      const action = new SaveBankDetailsSuccess(payload);

      expect({ ...action }).toEqual({
        type: CashbackOfferConfigurationActionTypes.SAVE_BANK_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  SaveBankDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SaveBankDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type: CashbackOfferConfigurationActionTypes.SAVE_BANK_DETAILS_FAILURE,
        payload
      });
    });
  });

  describe('UpdateBankDetails Action Test Cases', () => {
    it('should check correct type is used for  UpdateBankDetails action ', () => {
      const payload: UpdateBankDetailsPayload = {
        id: '1',
        data: {
          isActive: false
        }
      };
      const action = new UpdateBankDetails(payload);
      expect({ ...action }).toEqual({
        type: CashbackOfferConfigurationActionTypes.UPADTE_BANK_DETAILS,
        payload
      });
    });
    it('should check correct type is used for SaveBankDetailsSuccess action ', () => {
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
      const action = new UpdateBankDetailsSuccess(payload);

      expect({ ...action }).toEqual({
        type:
          CashbackOfferConfigurationActionTypes.UPADTE_BANK_DETAILSN_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  UpdateBankDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new UpdateBankDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type: CashbackOfferConfigurationActionTypes.UPADTE_BANK_DETAILS_FAILURE,
        payload
      });
    });
  });

  describe('LoadOfferDetailsById Action Test Cases', () => {
    it('should check correct type is used for  LoadOfferDetailsById action ', () => {
      const payload = '1';
      const action = new LoadOfferDetailsById(payload);
      expect({ ...action }).toEqual({
        type: CashbackOfferConfigurationActionTypes.LOAD_OFFER_DETAILS_BY_ID,
        payload
      });
    });
    it('should check correct type is used for LoadOfferDetailsByIdSuccess action ', () => {
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

      const action = new LoadOfferDetailsByIdSuccess(payload);

      expect({ ...action }).toEqual({
        type:
          CashbackOfferConfigurationActionTypes.LOAD_OFFER_DETAILS_BY_ID_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadOfferDetailsByIdFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadOfferDetailsByIdFailure(payload);

      expect({ ...action }).toEqual({
        type:
          CashbackOfferConfigurationActionTypes.LOAD_OFFER_DETAILS_BY_ID_FAILURE,
        payload
      });
    });
  });

  describe('UpdateOfferDetailsById Action Test Cases', () => {
    it('should check correct type is used for  UpdateOfferDetailsById action ', () => {
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
      expect({ ...action }).toEqual({
        type: CashbackOfferConfigurationActionTypes.UPDATE_OFFER_DETAILS_BY_ID,
        payload
      });
    });
    it('should check correct type is used for UpdateOfferDetailsByIdSuccess action ', () => {
      const action = new UpdateOfferDetailsByIdSuccess();

      expect({ ...action }).toEqual({
        type:
          CashbackOfferConfigurationActionTypes.UPDATE_OFFER_DETAILS_BY_ID_SUCCESS
      });
    });
    it('should check correct type is used for  UpdateOfferDetailsByIdFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new UpdateOfferDetailsByIdFailure(payload);

      expect({ ...action }).toEqual({
        type:
          CashbackOfferConfigurationActionTypes.UPDATE_OFFER_DETAILS_BY_ID_FAILURE,
        payload
      });
    });
  });

  describe('LoadMappedProductGroupById Action Test Cases', () => {
    it('should check correct type is used for  LoadMappedProductGroupById action ', () => {
      const payload = '1';
      const action = new LoadMappedProductGroupById(payload);
      expect({ ...action }).toEqual({
        type:
          CashbackOfferConfigurationActionTypes.LOAD_MAPPED_PRODUCT_GROUP_BY_ID,
        payload
      });
    });
    it('should check correct type is used for LoadMappedProductGroupByIdSuccess action ', () => {
      const payload: ProductGroupMappingOption[] = [
        { id: '1', description: '72' }
      ];

      const action = new LoadMappedProductGroupByIdSuccess(payload);

      expect({ ...action }).toEqual({
        type:
          CashbackOfferConfigurationActionTypes.LOAD_MAPPED_PRODUCT_GROUP_BY_ID_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadMappedProductGroupByIdFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadMappedProductGroupByIdFailure(payload);

      expect({ ...action }).toEqual({
        type:
          CashbackOfferConfigurationActionTypes.LOAD_MAPPED_PRODUCT_GROUP_BY_ID_FAILURE,
        payload
      });
    });
  });

  describe('UpdateProductGroupById Action Test Cases', () => {
    it('should check correct type is used for  UpdateProductGroupById action ', () => {
      const payload: SaveProductGroupPayload = {
        id: '1',
        data: {
          addProductGroups: [{ productGroupCode: '72' }],
          removeProductGroups: []
        }
      };
      const action = new UpdateProductGroupById(payload);
      expect({ ...action }).toEqual({
        type: CashbackOfferConfigurationActionTypes.UPDATE_PRODUCT_GROUP_BY_ID,
        payload
      });
    });
    it('should check correct type is used for UpdateProductGroupByIdSuccess action ', () => {
      const action = new UpdateProductGroupByIdSuccess();

      expect({ ...action }).toEqual({
        type:
          CashbackOfferConfigurationActionTypes.UPDATE_PRODUCT_GROUP_BY_ID_SUCCESS
      });
    });
    it('should check correct type is used for  UpdateProductGroupByIdFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new UpdateProductGroupByIdFailure(payload);

      expect({ ...action }).toEqual({
        type:
          CashbackOfferConfigurationActionTypes.UPDATE_PRODUCT_GROUP_BY_ID_FAILURE,
        payload
      });
    });
  });

  describe('UploadCardDetailsById Action Test Cases', () => {
    it('should check correct type is used for  UploadCardDetailsById action ', () => {
      const payload: UploadFile = {
        id: '1',
        reqfile: new FormData()
      };
      const action = new UploadCardDetailsById(payload);
      expect({ ...action }).toEqual({
        type: CashbackOfferConfigurationActionTypes.UPLOAD_CARD_DETAILS_BY_ID,
        payload
      });
    });
    it('should check correct type is used for UploadCardDetailsByIdSuccess action ', () => {
      const payload: CardDetailsUploadResponse = {
        fileProcessId: '1',
        records: null,
        hasError: false,
        message: ''
      };

      const action = new UploadCardDetailsByIdSuccess(payload);

      expect({ ...action }).toEqual({
        type:
          CashbackOfferConfigurationActionTypes.UPLOAD_CARD_DETAILS_BY_ID_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  UploadCardDetailsByIdFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new UploadCardDetailsByIdFailure(payload);

      expect({ ...action }).toEqual({
        type:
          CashbackOfferConfigurationActionTypes.UPLOAD_CARD_DETAILS_BY_ID_FAILURE,
        payload
      });
    });
  });

  describe('ErrorLogDownload Action Test Cases', () => {
    it('should check correct type is used for  ErrorLogDownload action ', () => {
      const payload = '1';
      const action = new ErrorLogDownload(payload);
      expect({ ...action }).toEqual({
        type: CashbackOfferConfigurationActionTypes.ERROR_LOG_DOWNLOAD,
        payload
      });
    });
    it('should check correct type is used for ErrorLogDownloadSuccess action ', () => {
      const payload = '';

      const action = new ErrorLogDownloadSuccess(payload);

      expect({ ...action }).toEqual({
        type: CashbackOfferConfigurationActionTypes.ERROR_LOG_DOWNLOAD_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  ErrorLogDownloadFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new ErrorLogDownloadFailure(payload);

      expect({ ...action }).toEqual({
        type: CashbackOfferConfigurationActionTypes.ERROR_LOG_DOWNLOAD_FAILURE,
        payload
      });
    });
  });

  describe('ClearOfferDetailsById Action Test Cases', () => {
    it('should check correct type is used for  ClearOfferDetailsById action ', () => {
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
      expect({ ...action }).toEqual({
        type: CashbackOfferConfigurationActionTypes.CLEAR_OFFER_DETAILS_BY_ID,
        payload
      });
    });
    it('should check correct type is used for ClearOfferDetailsByIdSuccess action ', () => {
      const action = new ClearOfferDetailsByIdSuccess();

      expect({ ...action }).toEqual({
        type:
          CashbackOfferConfigurationActionTypes.CLEAR_OFFER_DETAILS_BY_ID_SUCCESS
      });
    });
    it('should check correct type is used for  ClearOfferDetailsByIdFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new ClearOfferDetailsByIdFailure(payload);

      expect({ ...action }).toEqual({
        type:
          CashbackOfferConfigurationActionTypes.CLEAR_OFFER_DETAILS_BY_ID_FAILURE,
        payload
      });
    });
  });

  describe('UpdateCardDeatislById Action Test Cases', () => {
    it('should check correct type is used for  UpdateCardDeatislById action ', () => {
      const payload: UpdateCardDetails = {
        id: '11',
        updateCards: ''
      };
      const action = new UpdateCardDeatislById(payload);
      expect({ ...action }).toEqual({
        type: CashbackOfferConfigurationActionTypes.UPDATE_CARD_DETAILS_BY_ID,
        payload
      });
    });
    it('should check correct type is used for UpdateCardDeatislByIdSuccess action ', () => {
      const action = new UpdateCardDeatislByIdSuccess();

      expect({ ...action }).toEqual({
        type:
          CashbackOfferConfigurationActionTypes.UPDATE_CARD_DETAILS_BY_ID_SUCCESS
      });
    });
    it('should check correct type is used for  UpdateCardDeatislByIdFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new UpdateCardDeatislByIdFailure(payload);

      expect({ ...action }).toEqual({
        type:
          CashbackOfferConfigurationActionTypes.UPDATE_CARD_DETAILS_BY_ID_FAILURE,
        payload
      });
    });
  });

  describe('LoadCardDetailsById Action Test Cases', () => {
    it('should check correct type is used for  LoadCardDetailsById action ', () => {
      const payload: LoadCardDetailsPayload = {
        id: '1',
        pageEvent: {
          pageIndex: 1,
          pageSize: 2,
          length: 0
        }
      };
      const action = new LoadCardDetailsById(payload);
      expect({ ...action }).toEqual({
        type: CashbackOfferConfigurationActionTypes.LOAD_CARD_DETAILS_BY_ID,
        payload
      });
    });
    it('should check correct type is used for LoadCardDetailsByIdSuccess action ', () => {
      const payload: CardDetailsResponse = {
        cardDetails: [
          { cardNo: '111', isActive: true, id: '11', newlyAdded: true }
        ],
        totalElements: 1
      };

      const action = new LoadCardDetailsByIdSuccess(payload);

      expect({ ...action }).toEqual({
        type:
          CashbackOfferConfigurationActionTypes.LOAD_CARD_DETAILS_BY_ID_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadCardDetailsByIdFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadCardDetailsByIdFailure(payload);

      expect({ ...action }).toEqual({
        type:
          CashbackOfferConfigurationActionTypes.LOAD_CARD_DETAILS_BY_ID_FAILURE,
        payload
      });
    });
  });

  describe('LoadBankDetailsById Action Test Cases', () => {
    it('should check correct type is used for  LoadBankDetailsById action ', () => {
      const payload = '';
      const action = new LoadBankDetailsById(payload);
      expect({ ...action }).toEqual({
        type: CashbackOfferConfigurationActionTypes.LOAD_BANK_DETAILS_BY_ID,
        payload
      });
    });
    it('should check correct type is used for LoadBankDetailsByIdSuccess action ', () => {
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
      const action = new LoadBankDetailsByIdSuccess(payload);

      expect({ ...action }).toEqual({
        type:
          CashbackOfferConfigurationActionTypes.LOAD_BANK_DETAILS_BY_ID_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadBankDetailsByIdFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadBankDetailsByIdFailure(payload);

      expect({ ...action }).toEqual({
        type:
          CashbackOfferConfigurationActionTypes.LOAD_BANK_DETAILS_BY_ID_FAILURE,
        payload
      });
    });
  });

  describe('ResetIsCleared Action Test Cases', () => {
    it('should check correct type is used for  ResetIsCleared action ', () => {
      const action = new ResetIsCleared();
      expect({ ...action }).toEqual({
        type: CashbackOfferConfigurationActionTypes.RESET_IS_CLEARED
      });
    });
  });
  describe('LoadNewBankDetails Action Test Cases', () => {
    it('should check correct type is used for  LoadNewBankDetails action ', () => {
      const action = new LoadNewBankDetails();
      expect({ ...action }).toEqual({
        type: CashbackOfferConfigurationActionTypes.LOAD_NEW_BANK_DETAILS
      });
    });
  });
  describe('LoadResetFileData Action Test Cases', () => {
    it('should check correct type is used for  LoadResetFileData action ', () => {
      const action = new LoadResetFileData();
      expect({ ...action }).toEqual({
        type: CashbackOfferConfigurationActionTypes.LOAD_RESET_FILE_DATA
      });
    });
  });

  describe('LoadReset Action Test Cases', () => {
    it('should check correct type is used for  LoadReset action ', () => {
      const action = new LoadReset();
      expect({ ...action }).toEqual({
        type: CashbackOfferConfigurationActionTypes.LOAD_RESET
      });
    });
  });
});
