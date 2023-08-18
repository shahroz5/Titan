import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { LoggerService } from '@poss-web/shared/util-logger';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

import { map } from 'rxjs/operators';
import { Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/angular';
import { CashbackOfferConfigurationService } from '../cashback-offer-configuration.service';
import { CashbackOfferConfigurationActionTypes } from './cashback-offer-configuration.actions';
import * as CashbckOfferConfigurationAction from './cashback-offer-configuration.actions';
import {
  BankDetailsPayload,
  CustomErrors,
  CashbackOfferList,
  PayerBankList,
  OfferDetails,
  ProductGroupMappingOption,
  CardDetailsResponse,
  CardDetailsUploadResponse,
  FileGroupEnum
} from '@poss-web/shared/models';
import { FileDownloadService } from '@poss-web/shared/util-common';
@Injectable()
export class CasbackOfferConfigurationEffect {
  constructor(
    public dataPersistence: DataPersistence<any>,
    public cashbackOfferConfigurationService: CashbackOfferConfigurationService,
    public loggerService: LoggerService,
    public fileDownloadService: FileDownloadService
  ) {}

  @Effect()
  loadCashBackOfferList$ = this.dataPersistence.fetch(
    CashbackOfferConfigurationActionTypes.LOAD_CASHBACK_OFFER_LIST,
    {
      run: (action: CashbckOfferConfigurationAction.LoadCashbackOfferList) => {
        return this.cashbackOfferConfigurationService
          .loadCashbackOfferList(
            action.payload.pageIndex,
            action.payload.pageSize,
            action.searchValue
          )
          .pipe(
            map(
              (cashbackOfferList: CashbackOfferList) =>
                new CashbckOfferConfigurationAction.LoadCashbackOfferListSuccess(
                  cashbackOfferList
                )
            )
          );
      },
      onError: (
        action: CashbckOfferConfigurationAction.LoadCashbackOfferList,
        error: HttpErrorResponse
      ) => {
        return new CashbckOfferConfigurationAction.LoadCashbackOfferListFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadPayerBankList$ = this.dataPersistence.fetch(
    CashbackOfferConfigurationActionTypes.LOAD_PAYER_BANK_LIST,
    {
      run: (action: CashbckOfferConfigurationAction.LoadPayerBankList) => {
        return this.cashbackOfferConfigurationService
          .loadPayerBankList(true)
          .pipe(
            map(
              (payerBankList: PayerBankList[]) =>
                new CashbckOfferConfigurationAction.LoadPayerBankListSuccess(
                  payerBankList
                )
            )
          );
      },
      onError: (
        action: CashbckOfferConfigurationAction.LoadPayerBankList,
        error: HttpErrorResponse
      ) => {
        return new CashbckOfferConfigurationAction.LoadPayerBankListFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  saveBankDetailsCashbackOfferConfiguration$ = this.dataPersistence.fetch(
    CashbackOfferConfigurationActionTypes.SAVE_BANK_DETAILS,
    {
      run: (action: CashbckOfferConfigurationAction.SaveBankDetails) => {
        return this.cashbackOfferConfigurationService
          .saveBankDetails(action.payload)
          .pipe(
            map(
              (bankDetails: BankDetailsPayload) =>
                new CashbckOfferConfigurationAction.SaveBankDetailsSuccess(
                  bankDetails
                )
            )
          );
      },
      onError: (
        action: CashbckOfferConfigurationAction.SaveBankDetails,
        error: HttpErrorResponse
      ) => {
        return new CashbckOfferConfigurationAction.SaveBankDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  updateBankDetailsCashbackOfferConfiguration$ = this.dataPersistence.fetch(
    CashbackOfferConfigurationActionTypes.UPADTE_BANK_DETAILS,
    {
      run: (action: CashbckOfferConfigurationAction.UpdateBankDetails) => {
        return this.cashbackOfferConfigurationService
          .updateBankDetails(action.payload.id, action.payload.data)
          .pipe(
            map(
              (bankDetails: BankDetailsPayload) =>
                new CashbckOfferConfigurationAction.UpdateBankDetailsSuccess(
                  bankDetails
                )
            )
          );
      },
      onError: (
        action: CashbckOfferConfigurationAction.UpdateBankDetails,
        error: HttpErrorResponse
      ) => {
        return new CashbckOfferConfigurationAction.UpdateBankDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadBankDetailsCashbackOfferConfigurationById$ = this.dataPersistence.fetch(
    CashbackOfferConfigurationActionTypes.LOAD_BANK_DETAILS_BY_ID,
    {
      run: (action: CashbckOfferConfigurationAction.LoadBankDetailsById) => {
        return this.cashbackOfferConfigurationService
          .loadBankDetailsByConfigId(action.payload)
          .pipe(
            map(
              (bankDetails: BankDetailsPayload) =>
                new CashbckOfferConfigurationAction.LoadBankDetailsByIdSuccess(
                  bankDetails
                )
            )
          );
      },
      onError: (
        action: CashbckOfferConfigurationAction.LoadBankDetailsById,
        error: HttpErrorResponse
      ) => {
        return new CashbckOfferConfigurationAction.LoadBankDetailsByIdFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadOfferDetailsById$ = this.dataPersistence.fetch(
    CashbackOfferConfigurationActionTypes.LOAD_OFFER_DETAILS_BY_ID,
    {
      run: (action: CashbckOfferConfigurationAction.LoadOfferDetailsById) => {
        return this.cashbackOfferConfigurationService
          .loadOfferDetailsById(action.payload)
          .pipe(
            map(
              (offerDetails: OfferDetails[]) =>
                new CashbckOfferConfigurationAction.LoadOfferDetailsByIdSuccess(
                  offerDetails
                )
            )
          );
      },
      onError: (
        action: CashbckOfferConfigurationAction.LoadOfferDetailsById,
        error: HttpErrorResponse
      ) => {
        return new CashbckOfferConfigurationAction.LoadOfferDetailsByIdFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  clearOfferDetailsById$ = this.dataPersistence.fetch(
    CashbackOfferConfigurationActionTypes.CLEAR_OFFER_DETAILS_BY_ID,
    {
      run: (action: CashbckOfferConfigurationAction.ClearOfferDetailsById) => {
        return this.cashbackOfferConfigurationService
          .clearOfferDetailsById(action.payload.id, action.payload.data)
          .pipe(
            map(
              () =>
                new CashbckOfferConfigurationAction.ClearOfferDetailsByIdSuccess()
            )
          );
      },
      onError: (
        action: CashbckOfferConfigurationAction.ClearOfferDetailsById,
        error: HttpErrorResponse
      ) => {
        return new CashbckOfferConfigurationAction.ClearOfferDetailsByIdFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  updateOfferDetailsById$ = this.dataPersistence.fetch(
    CashbackOfferConfigurationActionTypes.UPDATE_OFFER_DETAILS_BY_ID,
    {
      run: (action: CashbckOfferConfigurationAction.UpdateOfferDetailsById) => {
        return this.cashbackOfferConfigurationService
          .updateOfferDetailsById(action.payload.id, action.payload.data)
          .pipe(
            map(
              () =>
                new CashbckOfferConfigurationAction.UpdateOfferDetailsByIdSuccess()
            )
          );
      },
      onError: (
        action: CashbckOfferConfigurationAction.UpdateOfferDetailsById,
        error: HttpErrorResponse
      ) => {
        return new CashbckOfferConfigurationAction.UpdateOfferDetailsByIdFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadMappedProductGroupById$ = this.dataPersistence.fetch(
    CashbackOfferConfigurationActionTypes.LOAD_MAPPED_PRODUCT_GROUP_BY_ID,
    {
      run: (
        action: CashbckOfferConfigurationAction.LoadMappedProductGroupById
      ) => {
        return this.cashbackOfferConfigurationService
          .loadMappedProductGroupById(action.payload)
          .pipe(
            map(
              (selectedProductGroup: ProductGroupMappingOption[]) =>
                new CashbckOfferConfigurationAction.LoadMappedProductGroupByIdSuccess(
                  selectedProductGroup
                )
            )
          );
      },
      onError: (
        action: CashbckOfferConfigurationAction.LoadMappedProductGroupById,
        error: HttpErrorResponse
      ) => {
        return new CashbckOfferConfigurationAction.LoadMappedProductGroupByIdFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  updateProductGroupById$ = this.dataPersistence.fetch(
    CashbackOfferConfigurationActionTypes.UPDATE_PRODUCT_GROUP_BY_ID,
    {
      run: (action: CashbckOfferConfigurationAction.UpdateProductGroupById) => {
        return this.cashbackOfferConfigurationService
          .updateProductGroupById(action.payload)
          .pipe(
            map(
              () =>
                new CashbckOfferConfigurationAction.UpdateProductGroupByIdSuccess()
            )
          );
      },
      onError: (
        action: CashbckOfferConfigurationAction.UpdateProductGroupById,
        error: HttpErrorResponse
      ) => {
        return new CashbckOfferConfigurationAction.UpdateProductGroupByIdFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  uploadCardDetailsById$ = this.dataPersistence.fetch(
    CashbackOfferConfigurationActionTypes.UPLOAD_CARD_DETAILS_BY_ID,
    {
      run: (action: CashbckOfferConfigurationAction.UploadCardDetailsById) => {
        return this.cashbackOfferConfigurationService
          .uploadCardDetailsById(action.payload.id, action.payload.reqfile)
          .pipe(
            map(
              (fileResponse: CardDetailsUploadResponse) =>
                new CashbckOfferConfigurationAction.UploadCardDetailsByIdSuccess(
                  fileResponse
                )
            )
          );
      },
      onError: (
        action: CashbckOfferConfigurationAction.UploadCardDetailsById,
        error: HttpErrorResponse
      ) => {
        return new CashbckOfferConfigurationAction.UploadCardDetailsByIdFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  errorLogDownload$ = this.dataPersistence.fetch(
    CashbackOfferConfigurationActionTypes.ERROR_LOG_DOWNLOAD,
    {
      run: (action: CashbckOfferConfigurationAction.ErrorLogDownload) => {
        return this.fileDownloadService
          .getErrorResponse(action.payload, FileGroupEnum.CARD_DETAILS)
          .pipe(
            map(
              data =>
                new CashbckOfferConfigurationAction.ErrorLogDownloadSuccess(
                  data
                )
            )
          );
      },
      onError: (
        action: CashbckOfferConfigurationAction.ErrorLogDownload,
        error: HttpErrorResponse
      ) => {
        return new CashbckOfferConfigurationAction.ErrorLogDownloadFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadCardDetailsById$ = this.dataPersistence.fetch(
    CashbackOfferConfigurationActionTypes.LOAD_CARD_DETAILS_BY_ID,
    {
      run: (action: CashbckOfferConfigurationAction.LoadCardDetailsById) => {
        return this.cashbackOfferConfigurationService
          .loadCardDetailsById(action.payload.id, action.payload.pageEvent)
          .pipe(
            map(
              (cardDetails: CardDetailsResponse) =>
                new CashbckOfferConfigurationAction.LoadCardDetailsByIdSuccess(
                  cardDetails
                )
            )
          );
      },
      onError: (
        action: CashbckOfferConfigurationAction.LoadCardDetailsById,
        error: HttpErrorResponse
      ) => {
        return new CashbckOfferConfigurationAction.LoadCardDetailsByIdFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  updateCardDetailsById$ = this.dataPersistence.fetch(
    CashbackOfferConfigurationActionTypes.UPDATE_CARD_DETAILS_BY_ID,
    {
      run: (action: CashbckOfferConfigurationAction.UpdateCardDeatislById) => {
        return this.cashbackOfferConfigurationService
          .updateCardDetailsById(action.payload.id, action.payload.updateCards)
          .pipe(
            map(
              () =>
                new CashbckOfferConfigurationAction.UpdateCardDeatislByIdSuccess()
            )
          );
      },
      onError: (
        action: CashbckOfferConfigurationAction.UpdateCardDeatislById,
        error: HttpErrorResponse
      ) => {
        return new CashbckOfferConfigurationAction.UpdateCardDeatislByIdFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadNewBankDetails$ = this.dataPersistence.fetch(
    CashbackOfferConfigurationActionTypes.LOAD_NEW_BANK_DETAILS,
    {
      run: (action: CashbckOfferConfigurationAction.LoadNewBankDetails) => {
        return new CashbckOfferConfigurationAction.LoadBankDetailsByIdSuccess(
          this.cashbackOfferConfigurationService.loadNewBankDetails()
        );
      }
    }
  );
  errorHandler(error: HttpErrorResponse): CustomErrors {
    const customError: CustomErrors = CustomErrorAdaptor.fromJson(error);
    this.loggerService.error(customError);
    return customError;
  }
}
