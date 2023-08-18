import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { DataPersistence } from '@nrwl/angular';
import {
  BinDataService,
  ProductGroupDataService,
  StoreUserDataService
} from '@poss-web/shared/masters/data-access-masters';
import {
  BinCode,
  ConversionHistory,
  ConversionHistoryItemsSuccessPayload,
  ConversionHistorySuccessPayload,
  ConversionInventoryItem,
  ConversionItem,
  ConversionRequestItems,
  ConversionRequestResponse,
  ConversionRequests,
  ConversionRequestsResponse,
  ConversionResponse,
  CustomErrors,
  ImageResponse,
  ProductGroup,
  ProductPriceDetails,
  StoreUser
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { LoggerService } from '@poss-web/shared/util-logger';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConversionService } from '../conversion.service';
import * as ConversionActions from './conversion.actions';
import { ConversionActionTypes } from './conversion.actions';
import { conversionFeatureKey } from './conversion.reducer';
import { CommonService } from '@poss-web/shared/common/data-access-common';

@Injectable()
export class ConversionEffect {
  constructor(
    private conversionService: ConversionService,
    private dataPersistence: DataPersistence<any>,
    private loggerService: LoggerService,
    private binDataService: BinDataService,
    private storeUserDataService: StoreUserDataService,
    private productGroupDataService: ProductGroupDataService,
    private commonService: CommonService
  ) {}

  @Effect()
  searchedItems$: Observable<Action> = this.dataPersistence.fetch(
    ConversionActionTypes.LOAD_SEARCH_VARIENT,
    {
      run: (action: ConversionActions.LoadSearchVarient, state) => {
        return this.conversionService
          .getSearchedItems(
            action.payload,
            state[conversionFeatureKey].studdedProductGroups
          )
          .pipe(
            map(
              (searchedItems: ConversionInventoryItem[]) =>
                new ConversionActions.LoadSearchVarientSuccess(searchedItems)
            )
          );
      },
      onError: (
        action: ConversionActions.LoadSearchVarient,
        error: HttpErrorResponse
      ) => {
        return new ConversionActions.LoadSearchVarientFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadConversionRequests$: Observable<Action> = this.dataPersistence.fetch(
    ConversionActionTypes.LOAD_CONVERSION_REQUESTS,
    {
      run: (action: ConversionActions.LoadConversionRequests) => {
        return this.conversionService
          .getConversionRequests(
            action.payload.pageIndex,
            action.payload.pageSize
          )
          .pipe(
            map(
              (conversionRequests: ConversionRequestsResponse) =>
                new ConversionActions.LoadConversionRequestsSuccess(
                  conversionRequests
                )
            )
          );
      },
      onError: (
        action: ConversionActions.LoadConversionRequests,
        error: HttpErrorResponse
      ) => {
        return new ConversionActions.LoadConversionRequestsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadConversionRequestsCount$ = this.dataPersistence.fetch(
    ConversionActionTypes.LOAD_REQUESTS_COUNT,
    {
      run: (action: ConversionActions.LoadRequestsCount) => {
        return this.conversionService
          .getCount()
          .pipe(
            map(
              (data: number) =>
                new ConversionActions.LoadRequestsCountSuccess(data)
            )
          );
      },
      onError: (
        action: ConversionActions.LoadRequestsCount,
        error: HttpErrorResponse
      ) => {
        return new ConversionActions.LoadRequestsCountFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  searchConversionRequests$ = this.dataPersistence.fetch(
    ConversionActionTypes.SEARCH_CONVERSION_REQUESTS,
    {
      run: (action: ConversionActions.SearchConversionRequests) => {
        return this.conversionService
          .getRequest(action.payload)
          .pipe(
            map(
              (searchResult: ConversionRequests[]) =>
                new ConversionActions.SearchConversionRequestsSuccess(
                  searchResult
                )
            )
          );
      },
      onError: (
        action: ConversionActions.SearchConversionRequests,
        error: HttpErrorResponse
      ) => {
        return new ConversionActions.SearchConversionRequestsSuccess([]);
      }
    }
  );

  @Effect()
  loadSelectedRequest$ = this.dataPersistence.fetch(
    ConversionActionTypes.LOAD_SELECTED_REQUEST,
    {
      run: (action: ConversionActions.LoadSelectedRequest) => {
        return this.conversionService
          .getSelectedRequestDetails(action.payload)
          .pipe(
            map(
              (conversionRequestData: ConversionRequests) =>
                new ConversionActions.LoadSelectedRequestSuccess(
                  conversionRequestData
                )
            )
          );
      },
      onError: (
        action: ConversionActions.LoadSelectedRequest,
        error: HttpErrorResponse
      ) => {
        return new ConversionActions.LoadSelectedRequestFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  loadSelectedRequestItems$ = this.dataPersistence.fetch(
    ConversionActionTypes.LOAD_SELECTED_REQUEST_DATA,
    {
      run: (action: ConversionActions.LoadSelectedRequestData, state) => {
        return this.conversionService
          .getSelectedRequestItems(
            action.payload,
            state[conversionFeatureKey].studdedProductGroups
          )
          .pipe(
            map(
              (conversionRequestItemData: ConversionRequestItems[]) =>
                new ConversionActions.LoadSelectedRequestDataSuccess(
                  conversionRequestItemData
                )
            )
          );
      },
      onError: (
        action: ConversionActions.LoadSelectedRequestData,
        error: HttpErrorResponse
      ) => {
        return new ConversionActions.LoadSelectedRequestDataFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  conversionItems$ = this.dataPersistence.fetch(
    ConversionActionTypes.LOAD_CONVERSION_ITEMS,
    {
      run: (action: ConversionActions.LoadConversionItems, state) => {
        return this.conversionService
          .getConversionItems(
            action.payload,
            state[conversionFeatureKey].studdedProductGroups
          )
          .pipe(
            map(
              (conversionItemData: ConversionItem) =>
                new ConversionActions.LoadConversionItemsSuccess(
                  conversionItemData
                )
            )
          );
      },
      onError: (
        action: ConversionActions.LoadConversionItems,
        error: HttpErrorResponse
      ) => {
        return new ConversionActions.LoadConversionItemsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  sendConversionRequest$ = this.dataPersistence.fetch(
    ConversionActionTypes.SEND_CONVERSION_REQUEST,
    {
      run: (action: ConversionActions.SendConversionRequest) => {
        return this.conversionService
          .sendConversionsRequest(action.payload)
          .pipe(
            map(
              (conversionReqResponse: ConversionRequestResponse) =>
                new ConversionActions.SendConversionRequestSuccess(
                  conversionReqResponse
                )
            )
          );
      },
      onError: (
        action: ConversionActions.SendConversionRequest,
        error: HttpErrorResponse
      ) => {
        return new ConversionActions.SendConversionRequestFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  splitItems$ = this.dataPersistence.fetch(ConversionActionTypes.SPLIT_ITEM, {
    run: (action: ConversionActions.SplitItems) => {
      return this.conversionService
        .conversionrequestConfirm(action.payload)
        .pipe(
          map(
            (conversionResponse: ConversionResponse) =>
              new ConversionActions.SplitItemsSuccess(conversionResponse)
          )
        );
    },
    onError: (
      action: ConversionActions.SplitItems,
      error: HttpErrorResponse
    ) => {
      return new ConversionActions.SplitItemsFailure(this.errorHandler(error));
    }
  });

  @Effect()
  conversion$ = this.dataPersistence.fetch(
    ConversionActionTypes.CONFIRM_CONVERSION,
    {
      run: (action: ConversionActions.ConfirmConversion) => {
        return this.conversionService
          .conversionrequestConfirm(action.payload)
          .pipe(
            map(
              (conversionResponse: ConversionResponse) =>
                new ConversionActions.ConfirmConversionSuccess(
                  conversionResponse
                )
            )
          );
      },
      onError: (
        action: ConversionActions.ConfirmConversion,
        error: HttpErrorResponse
      ) => {
        return new ConversionActions.ConfirmConversionFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadRsoDetails$ = this.dataPersistence.fetch(
    ConversionActionTypes.LOAD_RSO_DETAILS,
    {
      run: (action: ConversionActions.LoadRsoDetails) => {
        return this.storeUserDataService.getStoreUsers().pipe(
          map((data: StoreUser[]) => {
            const employeeCodes: string[] = [];
            for (const employee of data) {
              employeeCodes.push(employee.empName);
            }
            return new ConversionActions.LoadRsoDetailsSuccess(employeeCodes);
          })
        );
      },
      onError: (
        action: ConversionActions.LoadRsoDetails,
        error: HttpErrorResponse
      ) => {
        return new ConversionActions.LoadRsoDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadBinCodes$ = this.dataPersistence.fetch(
    ConversionActionTypes.LOAD_BINCODES,
    {
      run: (action: ConversionActions.LoadBinCodes) => {
        return this.binDataService
          .getBinDetails(action.payload, false)
          .pipe(
            map(
              (bincodes: BinCode[]) =>
                new ConversionActions.LoadBinCodesSuccess(bincodes)
            )
          );
      },
      onError: (
        action: ConversionActions.LoadBinCodes,
        error: HttpErrorResponse
      ) => {
        return new ConversionActions.LoadBinCodesFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  loadRequestSentHistory$ = this.dataPersistence.fetch(
    ConversionActionTypes.LOAD_REQUEST_SENT_HISTORY,
    {
      run: (action: ConversionActions.LoadRequestSentHistory) => {
        return this.conversionService
          .getRequestSentHistory(
            action.payload.requestSentPayload,
            action.payload.pageIndex,
            action.payload.pageSize,
            action.payload.requestType
          )
          .pipe(
            map(
              (requestSentHistory: ConversionHistorySuccessPayload) =>
                new ConversionActions.LoadRequestSentHistorySuccess(
                  requestSentHistory
                )
            )
          );
      },
      onError: (
        action: ConversionActions.LoadRequestSentHistory,
        error: HttpErrorResponse
      ) => {
        return new ConversionActions.LoadRequestSentHistorySuccess({
          requestSentHistory: [],
          count: 0
        });
      }
    }
  );
  @Effect()
  loadConvertedTransactionHistory$ = this.dataPersistence.fetch(
    ConversionActionTypes.LOAD_CONVERTED_TRANSACTION_HISTORY,
    {
      run: (action: ConversionActions.LoadConvertedTransactionHistory) => {
        return this.conversionService
          .getConvertedTransactionHistory(
            action.payload.convertedTransaction,
            action.payload.pageIndex,
            action.payload.pageSize,
            action.payload.transactionType
          )
          .pipe(
            map(
              (requestSentHistory: ConversionHistorySuccessPayload) =>
                new ConversionActions.LoadConvertedTransactionHistorySuccess(
                  requestSentHistory
                )
            )
          );
      },
      onError: (
        action: ConversionActions.LoadConvertedTransactionHistory,
        error: HttpErrorResponse
      ) => {
        return new ConversionActions.LoadConvertedTransactionHistorySuccess({
          requestSentHistory: [],
          count: 0
        });
      }
    }
  );
  @Effect()
  loadSelectedRequestHistory$ = this.dataPersistence.fetch(
    ConversionActionTypes.LOAD_SELECTED_REQUEST_HISTORY,
    {
      run: (action: ConversionActions.LoadSelectedRequestHistory) => {
        return this.conversionService
          .getSelectedRequestHistory(
            action.payload.reqDocNo,
            action.payload.requestType
          )
          .pipe(
            map(
              (selectedRequestHistory: ConversionHistory) =>
                new ConversionActions.LoadSelectedRequestHistorySuccess(
                  selectedRequestHistory
                )
            )
          );
      },
      onError: (
        action: ConversionActions.LoadSelectedRequestHistory,
        error: HttpErrorResponse
      ) => {
        return new ConversionActions.LoadSelectedRequestHistoryFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect() loadStuddedProductGroups$ = this.dataPersistence.fetch(
    ConversionActionTypes.LOAD_STUDDED_PRODUCT_GROUPS,
    {
      run: (action: ConversionActions.LoadStuddedProductGroups) => {
        return this.productGroupDataService
          .getProductGroups(false, null, null, null, 'S')
          .pipe(
            map(
              (data: ProductGroup[]) =>
                new ConversionActions.LoadStuddedProductGroupsSuccess(
                  data.map(p => p.productGroupCode)
                )
            )
          );
      },

      onError: (
        action: ConversionActions.LoadStuddedProductGroups,
        error: HttpErrorResponse
      ) => {
        return new ConversionActions.LoadStuddedProductGroupsFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  loadConversionHistoryItems$ = this.dataPersistence.fetch(
    ConversionActionTypes.LOAD_CONVERSION_HISTORY_ITEMS,
    {
      run: (action: ConversionActions.LoadConversionHistoryItems, state) => {
        return this.conversionService
          .getConvesionHistoryItems(
            action.payload.historyItemsPaylod,
            action.payload.id,
            action.payload.pageIndex,
            action.payload.pageSize,
            action.payload.requestType,
            action.payload.preTransactionId,
            action.payload.childItems,
            state[conversionFeatureKey].studdedProductGroups
            )
          .pipe(
            map(
              (conversionHistoryItems: ConversionHistoryItemsSuccessPayload) =>
                new ConversionActions.LoadConversionHistoryItemsSuccess(
                  conversionHistoryItems
                )
            )
          );
      },
      onError: (
        action: ConversionActions.LoadConversionHistoryItems,
        error: HttpErrorResponse
      ) => {
        return new ConversionActions.LoadConversionHistoryItemsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  // Image For Search Variant

  @Effect() loadSearchvariantThumbnailImageUrl$ = this.dataPersistence.fetch(
    ConversionActionTypes.LOAD_SEARCH_VARIANT_THUMBNAIL_IMAGE_URL,
    {
      run: (action: ConversionActions.LoadSearchVariantThumbnailImageUrl, state) => {
        return this.commonService
          .getThumbnailImageUrl(action.payload)
          .pipe(
            map(
              (loadImageResponse: ImageResponse) =>
                new ConversionActions.LoadSearchVariantThumbnailImageUrlSuccess(
                  loadImageResponse
                )
            )
          );
      },

      onError: (
        action: ConversionActions.LoadSearchVariantThumbnailImageUrl,
        error: HttpErrorResponse
      ) => {
        return new ConversionActions.LoadSearchVariantThumbnailImageUrlFailure({
          id: action.payload.id,
          itemCode: action.payload.itemCode,
          isSearchedItem: action.payload?.isSearchedItem,
          isChildItems: action.payload?.isChildItems
        });
      }
    }
  );

  @Effect() loadSearchVariantImageUrl$ = this.dataPersistence.fetch(
    ConversionActionTypes.LOAD_SEARCH_VARIANT_IMAGE_URL,
    {
      run: (action: ConversionActions.LoadSearchVariantImageUrl, state) => {
        return this.commonService
          .getImageUrl(action.payload)
          .pipe(
            map(
              (loadImageResponse: ImageResponse) =>
                new ConversionActions.LoadSearchVariantImageUrlSuccess(
                  loadImageResponse
                )
            )
          );
      },

      onError: (
        action: ConversionActions.LoadSearchVariantImageUrl,
        error: HttpErrorResponse
      ) => {
        return new ConversionActions.LoadSearchVariantImageUrlFailure({
          id: action.payload.id,
          itemCode: action.payload.itemCode,
          imageUrl: action.payload.imageUrl,
          isSearchedItem: action.payload?.isSearchedItem,
          isChildItems: action.payload?.isChildItems
        });
      }
    }
  );

  // Image For Request Sent

  @Effect() loadRequestThumbnailImageUrl$ = this.dataPersistence.fetch(
    ConversionActionTypes.LOAD_REQUEST_THUMBNAIL_IMAGE_URL,
    {
      run: (action: ConversionActions.LoadRequestThumbnailImageUrl, state) => {
        return this.commonService
          .getThumbnailImageUrl(action.payload)
          .pipe(
            map(
              (loadImageResponse: ImageResponse) =>
                new ConversionActions.LoadRequestThumbnailImageUrlSuccess(
                  loadImageResponse
                )
            )
          );
      },

      onError: (
        action: ConversionActions.LoadRequestThumbnailImageUrl,
        error: HttpErrorResponse
      ) => {
        return new ConversionActions.LoadRequestThumbnailImageUrlFailure({
          id: action.payload.id,
          isChildItems: action.payload?.isChildItems
        });
      }
    }
  );

  @Effect() loadRequestImageUrl$ = this.dataPersistence.fetch(
    ConversionActionTypes.LOAD_REQUEST_IMAGE_URL,
    {
      run: (action: ConversionActions.LoadRequestImageUrl, state) => {
        return this.commonService
          .getImageUrl(action.payload)
          .pipe(
            map(
              (loadImageResponse: ImageResponse) =>
                new ConversionActions.LoadRequestImageUrlSuccess(
                  loadImageResponse
                )
            )
          );
      },

      onError: (
        action: ConversionActions.LoadRequestImageUrl,
        error: HttpErrorResponse
      ) => {
        return new ConversionActions.LoadRequestImageUrlFailure({
          id: action.payload.id,
          imageUrl: action.payload.imageUrl,
          isChildItems: action.payload?.isChildItems
        });
      }
    }
  );

  // Image For History

  @Effect() loadHistoryThumbnailImageUrl$ = this.dataPersistence.fetch(
    ConversionActionTypes.LOAD_HISTORY_THUMBNAIL_IMAGE_URL,
    {
      run: (action: ConversionActions.LoadHistoryThumbnailImageUrl, state) => {
        return this.commonService
          .getThumbnailImageUrl(action.payload)
          .pipe(
            map(
              (loadImageResponse: ImageResponse) =>
                new ConversionActions.LoadHistoryThumbnailImageUrlSuccess(
                  loadImageResponse
                )
            )
          );
      },

      onError: (
        action: ConversionActions.LoadHistoryThumbnailImageUrl,
        error: HttpErrorResponse
      ) => {
        return new ConversionActions.LoadHistoryThumbnailImageUrlFailure({
          id: action.payload.id
        });
      }
    }
  );

  @Effect() loadHistoryImageUrl$ = this.dataPersistence.fetch(
    ConversionActionTypes.LOAD_HISTORY_IMAGE_URL,
    {
      run: (action: ConversionActions.LoadHistoryImageUrl, state) => {
        return this.commonService
          .getImageUrl(action.payload)
          .pipe(
            map(
              (loadImageResponse: ImageResponse) =>
                new ConversionActions.LoadHistoryImageUrlSuccess(
                  loadImageResponse
                )
            )
          );
      },

      onError: (
        action: ConversionActions.LoadHistoryImageUrl,
        error: HttpErrorResponse
      ) => {
        return new ConversionActions.LoadHistoryImageUrlFailure({
          id: action.payload.id,
          imageUrl: action.payload.imageUrl
        });
      }
    }
  );

  @Effect()
  loadStandardMetalPriceDetails$ = this.dataPersistence.fetch(
    ConversionActionTypes.LOAD_STANDARD_METAL_PRICE_DETAILS,
    {
      run: (action: ConversionActions.LoadStandardMetalPriceDetails) => {
        return this.commonService
          .getStandardMetalPriceDetails()
          .pipe(
            map(
              (metalPriceDetails: any) =>
                new ConversionActions.LoadStandardMetalPriceDetailsSuccess(
                  metalPriceDetails
                )
            )
          );
      },
      onError: (
        action: ConversionActions.LoadStandardMetalPriceDetails,
        error: HttpErrorResponse
      ) => {
        return new ConversionActions.LoadStandardMetalPriceDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadPriceDetails$: Observable<Action> = this.dataPersistence.fetch(
    ConversionActionTypes.LOAD_PRICE_DETAILS,
    {
      run: (action: ConversionActions.LoadPriceDetails) => {
        return this.conversionService
          .loadPriceDetails(action.payload)
          .pipe(
            map(
              (data: ProductPriceDetails[]) =>
                new ConversionActions.LoadPriceDetailsSuccess(data)
            )
          );
      },

      onError: (
        action: ConversionActions.LoadPriceDetails,
        error: HttpErrorResponse
      ) => {
        return new ConversionActions.LoadPriceDetailsFailure(
          this.errorHandler(error)
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
