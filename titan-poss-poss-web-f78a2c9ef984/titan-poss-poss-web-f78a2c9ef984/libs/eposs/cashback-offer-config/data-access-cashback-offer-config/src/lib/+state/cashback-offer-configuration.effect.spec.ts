//you here need to assert a reactive result as well as trigger an effect.
//To assert that an effect returns the right observable stream, we can use
// Rx Marbles.
import { Observable } from 'rxjs';
import { hot, cold } from 'jasmine-marbles';

import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { HttpClient } from '@angular/common/http';

import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { DataPersistence } from '@nrwl/angular';
import {
  SaveBankDetailsPayload,
  CashbackOfferList,
  LoadCashbackOfferListPayload,
  PayerBankList,
  BankDetailsPayload,
  UpdateBankDetailsPayload,
  OfferDetails,
  OfferDetailResponse,
  ProductGroupMappingOption,
  SaveProductGroupPayload,
  CardDetailsUploadResponse,
  UploadFile,
  LoadCardDetailsPayload,
  CardDetailsResponse,
  UpdateCardDetails
} from '@poss-web/shared/models';

import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { CasbackOfferConfigurationEffect } from './cashback-offer-configuration.effects';
import { CashbackOfferConfigurationService } from '../cashback-offer-configuration.service';
import {
  LoadCashbackOfferList,
  LoadCashbackOfferListSuccess,
  LoadCashbackOfferListFailure,
  LoadPayerBankListFailure,
  SaveBankDetails,
  SaveBankDetailsSuccess,
  SaveBankDetailsFailure,
  UpdateBankDetails,
  UpdateBankDetailsSuccess,
  UpdateBankDetailsFailure,
  ClearOfferDetailsById,
  ClearOfferDetailsByIdSuccess,
  ClearOfferDetailsByIdFailure,
  LoadOfferDetailsByIdSuccess,
  LoadOfferDetailsByIdFailure,
  LoadOfferDetailsById,
  UpdateOfferDetailsByIdSuccess,
  UpdateOfferDetailsByIdFailure,
  UpdateOfferDetailsById,
  LoadMappedProductGroupByIdSuccess,
  LoadMappedProductGroupByIdFailure,
  LoadMappedProductGroupById,
  UpdateProductGroupByIdSuccess,
  UpdateProductGroupByIdFailure,
  UpdateProductGroupById,
  UploadCardDetailsByIdSuccess,
  UploadCardDetailsByIdFailure,
  UploadCardDetailsById,
  ErrorLogDownloadSuccess,
  ErrorLogDownloadFailure,
  ErrorLogDownload,
  LoadCardDetailsByIdSuccess,
  LoadCardDetailsByIdFailure,
  LoadCardDetailsById,
  UpdateCardDeatislByIdSuccess,
  UpdateCardDeatislById,
  UpdateCardDeatislByIdFailure,
  LoadBankDetailsByIdSuccess,
  LoadBankDetailsByIdFailure,
  LoadBankDetailsById,
  LoadPayerBankList,
  LoadPayerBankListSuccess
} from './cashback-offer-configuration.actions';
import { FileDownloadService } from '@poss-web/shared/util-common';

describe('CasbackOfferConfigurationEffect Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: CasbackOfferConfigurationEffect;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get', 'post', 'patch']
  );
  const initialState = {};
  let cashbackOfferConfigurationService = jasmine.createSpyObj<
    CashbackOfferConfigurationService
  >('cashbackOfferConfigurationService', [
    'loadPayerBankList',
    'loadCashbackOfferList',
    'saveBankDetails',
    'updateBankDetails',
    'loadBankDetailsByConfigId',
    'loadOfferDetailsById',
    'clearOfferDetailsById',
    'updateOfferDetailsById',
    'loadMappedProductGroupById',
    'updateProductGroupById',
    'uploadCardDetailsById',
    'loadCardDetailsById',
    'updateCardDetailsById',
    'loadNewBankDetails'
  ]);
  const fileDownloadService = jasmine.createSpyObj<FileDownloadService>([
    'getErrorResponse'
  ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CasbackOfferConfigurationEffect,
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
          provide: FileDownloadService,
          useValue: fileDownloadService
        },

        {
          provide: CashbackOfferConfigurationService,
          useValue: {
            loadPayerBankList: jasmine.createSpy(),
            loadCashbackOfferList: jasmine.createSpy(),
            saveBankDetails: jasmine.createSpy(),
            updateBankDetails: jasmine.createSpy(),
            loadBankDetailsByConfigId: jasmine.createSpy(),
            loadOfferDetailsById: jasmine.createSpy(),
            clearOfferDetailsById: jasmine.createSpy(),
            updateOfferDetailsById: jasmine.createSpy(),
            loadMappedProductGroupById: jasmine.createSpy(),
            updateProductGroupById: jasmine.createSpy(),
            uploadCardDetailsById: jasmine.createSpy(),
            loadCardDetailsById: jasmine.createSpy(),
            updateCardDetailsById: jasmine.createSpy(),
            loadNewBankDetails: jasmine.createSpy(),
            getErrorResponse: jasmine.createSpy()
          }
        }
      ]
    });

    effect = TestBed.inject(CasbackOfferConfigurationEffect);
    cashbackOfferConfigurationService = TestBed.inject<any>(
      CashbackOfferConfigurationService
    );
  });

  describe('loadCashBackOfferList', () => {
    it('should return a stream with cashback list', () => {
      const payload: LoadCashbackOfferListPayload = {
        pageIndex: 0,
        pageSize: 100,
        length: 0
      };
      const res: CashbackOfferList = {
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
      const action = new LoadCashbackOfferList(payload);
      const outcome = new LoadCashbackOfferListSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      cashbackOfferConfigurationService.loadCashbackOfferList.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadCashBackOfferList$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: LoadCashbackOfferListPayload = {
        pageIndex: 0,
        pageSize: 100,
        length: 0
      };

      const action = new LoadCashbackOfferList(payload);
      const error = new Error('some error');
      const outcome = new LoadCashbackOfferListFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      cashbackOfferConfigurationService.loadCashbackOfferList.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.loadCashBackOfferList$).toBeObservable(expected);
    });
  });

  describe('loadPayerBankList', () => {
    it('should return a stream with payer bank list ', () => {
      const res: PayerBankList[] = [
        {
          id: '1',
          name: 'HDFC'
        }
      ];

      const action = new LoadPayerBankList();
      const outcome = new LoadPayerBankListSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      cashbackOfferConfigurationService.loadPayerBankList.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadPayerBankList$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadPayerBankList();
      const error = new Error('some error');
      const outcome = new LoadPayerBankListFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      cashbackOfferConfigurationService.loadPayerBankList.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.loadPayerBankList$).toBeObservable(expected);
    });
  });

  describe('saveBankDetailsCashbackOfferConfiguration', () => {
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
    it('should return a stream with bank Details', () => {
      const res: BankDetailsPayload = {
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
      const action = new SaveBankDetails(payload);
      const outcome = new SaveBankDetailsSuccess(res);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: res });
      cashbackOfferConfigurationService.saveBankDetails.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.saveBankDetailsCashbackOfferConfiguration$).toBeObservable(
        expected$
      );
    });

    it('should fail and return an action with the error', () => {
      const action = new SaveBankDetails(payload);
      const error = new Error('some error');
      const outcome = new SaveBankDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      cashbackOfferConfigurationService.saveBankDetails.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.saveBankDetailsCashbackOfferConfiguration$).toBeObservable(
        expected
      );
    });
  });

  describe('updateBankDetailsCashbackOfferConfiguration', () => {
    const payload: UpdateBankDetailsPayload = {
      id: '1',
      data: {
        isActive: false
      }
    };
    const res: BankDetailsPayload = {
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
    it('should return a stream with  bank  object', () => {
      const action = new UpdateBankDetails(payload);
      const outcome = new UpdateBankDetailsSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      cashbackOfferConfigurationService.updateBankDetails.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(
        effect.updateBankDetailsCashbackOfferConfiguration$
      ).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new UpdateBankDetails(payload);
      const error = new Error('some error');
      const outcome = new UpdateBankDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      cashbackOfferConfigurationService.updateBankDetails.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(
        effect.updateBankDetailsCashbackOfferConfiguration$
      ).toBeObservable(expected);
    });
  });

  describe('loadBankDetailsCashbackOfferConfigurationById', () => {
    const payload = '1';
    it('should return a stream with Bank Details', () => {
      const res: BankDetailsPayload = {
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
      const action = new LoadBankDetailsById(payload);
      const outcome = new LoadBankDetailsByIdSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      cashbackOfferConfigurationService.loadBankDetailsByConfigId.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(
        effect.loadBankDetailsCashbackOfferConfigurationById$
      ).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadBankDetailsById(payload);
      const error = new Error('some error');
      const outcome = new LoadBankDetailsByIdFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      cashbackOfferConfigurationService.loadBankDetailsByConfigId.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(
        effect.loadBankDetailsCashbackOfferConfigurationById$
      ).toBeObservable(expected);
    });
  });

  describe('loadOfferDetailsById', () => {
    const payload = '1';
    it('should return a stream with offer details', () => {
      const res: OfferDetails[] = [
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
      const action = new LoadOfferDetailsById(payload);
      const outcome = new LoadOfferDetailsByIdSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      cashbackOfferConfigurationService.loadOfferDetailsById.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadOfferDetailsById$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadOfferDetailsById(payload);
      const error = new Error('some error');
      const outcome = new LoadOfferDetailsByIdFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      cashbackOfferConfigurationService.loadOfferDetailsById.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.loadOfferDetailsById$).toBeObservable(expected);
    });
  });

  describe('clearOfferDetailsById', () => {
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
    it('should return a stream with ClearOfferDetailsByIdSuccess ', () => {
      const action = new ClearOfferDetailsById(payload);
      const outcome = new ClearOfferDetailsByIdSuccess();
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: {} });
      cashbackOfferConfigurationService.clearOfferDetailsById.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.clearOfferDetailsById$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new ClearOfferDetailsById(payload);
      const error = new Error('some error');
      const outcome = new ClearOfferDetailsByIdFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      cashbackOfferConfigurationService.clearOfferDetailsById.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.clearOfferDetailsById$).toBeObservable(expected);
    });
  });

  describe('updateOfferDetailsById', () => {
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
    it('should return a stream with UpdateOfferDetailsByIdSuccess ', () => {
      const action = new UpdateOfferDetailsById(payload);
      const outcome = new UpdateOfferDetailsByIdSuccess();
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: {} });
      cashbackOfferConfigurationService.updateOfferDetailsById.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.updateOfferDetailsById$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new UpdateOfferDetailsById(payload);
      const error = new Error('some error');
      const outcome = new UpdateOfferDetailsByIdFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      cashbackOfferConfigurationService.updateOfferDetailsById.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.updateOfferDetailsById$).toBeObservable(expected);
    });
  });

  describe('loadMappedProductGroupById', () => {
    const payload = '1';
    it('should return a stream with product groups', () => {
      const res: ProductGroupMappingOption[] = [{ id: '1', description: '72' }];

      const action = new LoadMappedProductGroupById(payload);
      const outcome = new LoadMappedProductGroupByIdSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      cashbackOfferConfigurationService.loadMappedProductGroupById.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadMappedProductGroupById$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadMappedProductGroupById(payload);
      const error = new Error('some error');
      const outcome = new LoadMappedProductGroupByIdFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      cashbackOfferConfigurationService.loadMappedProductGroupById.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.loadMappedProductGroupById$).toBeObservable(expected);
    });
  });
  describe('updateProductGroupById', () => {
    const payload: SaveProductGroupPayload = {
      id: '1',
      data: {
        addProductGroups: [{ productGroupCode: '72' }],
        removeProductGroups: []
      }
    };
    it('should return a stream with UpdateProductGroupByIdSuccess', () => {
      const action = new UpdateProductGroupById(payload);
      const outcome = new UpdateProductGroupByIdSuccess();
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: {} });
      cashbackOfferConfigurationService.updateProductGroupById.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.updateProductGroupById$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new UpdateProductGroupById(payload);
      const error = new Error('some error');
      const outcome = new UpdateProductGroupByIdFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      cashbackOfferConfigurationService.updateProductGroupById.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.updateProductGroupById$).toBeObservable(expected);
    });
  });

  describe('uploadCardDetailsById', () => {
    const payload: UploadFile = {
      id: '1',
      reqfile: new FormData()
    };
    it('should return a stream with uploaded card details', () => {
      const res: CardDetailsUploadResponse = {
        fileProcessId: '1',
        records: null,
        hasError: false,
        message: ''
      };
      const action = new UploadCardDetailsById(payload);
      const outcome = new UploadCardDetailsByIdSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      cashbackOfferConfigurationService.uploadCardDetailsById.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.uploadCardDetailsById$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new UploadCardDetailsById(payload);
      const error = new Error('some error');
      const outcome = new UploadCardDetailsByIdFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      cashbackOfferConfigurationService.uploadCardDetailsById.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.uploadCardDetailsById$).toBeObservable(expected);
    });
  });

  describe('errorLogDownload', () => {
    const payload = '1';
    it('should return a stream with errorLogDownload', () => {
      const res = '';

      const action = new ErrorLogDownload(payload);
      const outcome = new ErrorLogDownloadSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      fileDownloadService.getErrorResponse.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.errorLogDownload$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new ErrorLogDownload(payload);
      const error = new Error('some error');
      const outcome = new ErrorLogDownloadFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      fileDownloadService.getErrorResponse.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.errorLogDownload$).toBeObservable(expected);
    });
  });

  describe('loadCardDetailsById', () => {
    const payload: LoadCardDetailsPayload = {
      id: '1',
      pageEvent: {
        pageIndex: 1,
        pageSize: 2,
        length: 0
      }
    };
    it('should return a stream with card Details', () => {
      const res: CardDetailsResponse = {
        cardDetails: [
          { cardNo: '111', isActive: true, id: '11', newlyAdded: true }
        ],
        totalElements: 1
      };
      const action = new LoadCardDetailsById(payload);
      const outcome = new LoadCardDetailsByIdSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      cashbackOfferConfigurationService.loadCardDetailsById.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadCardDetailsById$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadCardDetailsById(payload);
      const error = new Error('some error');
      const outcome = new LoadCardDetailsByIdFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      cashbackOfferConfigurationService.loadCardDetailsById.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.loadCardDetailsById$).toBeObservable(expected);
    });
  });
  describe('updateCardDetailsById', () => {
    const payload: UpdateCardDetails = {
      id: '11',
      updateCards: ''
    };
    it('should return a stream with UpdateCardDeatislByIdSuccess', () => {
      const action = new UpdateCardDeatislById(payload);
      const outcome = new UpdateCardDeatislByIdSuccess();
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: {} });
      cashbackOfferConfigurationService.updateCardDetailsById.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.updateCardDetailsById$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new UpdateCardDeatislById(payload);
      const error = new Error('some error');
      const outcome = new UpdateCardDeatislByIdFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      cashbackOfferConfigurationService.updateCardDetailsById.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.updateCardDetailsById$).toBeObservable(expected);
    });
  });
});
