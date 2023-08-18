import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  StoreConfigDataService,
  ProductGroupDataService,
  ProductCategoryDataService,
  LovDataService
} from '@poss-web/shared/masters/data-access-masters';
import { map, mergeMap } from 'rxjs/operators';
import { BinToBinTransferActionTypes } from './bin-to-bin-transfer-actions';
import { Effect } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { DataPersistence } from '@nrwl/angular';
import {
  CustomErrors,
  StoreBin,
  ProductGroup,
  ProductCategory,
  BinToBinTransferConfirmTransferResponse,
  BinToBinTransferLoadItemListGroupResponse,
  BinToBinTransferLoadItemsResponse,
  BinToBinTransferTypeEnum,
  BinToBinTransferHistoryItemHeader,
  BinToBinTransferLoadHistoryItemsResponse,
  ImageResponse,
  Lov,
  LovMasterEnum
} from '@poss-web/shared/models';
import * as BinToBinTransferActions from './bin-to-bin-transfer-actions';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { BinToBinTransferService } from '../bin-to-bin-transfer.service';
import { LoggerService } from '@poss-web/shared/util-logger';
import { binToBinTransferFeatureKey } from './bin-to-bin-transfer.state';
import { CommonService } from '@poss-web/shared/common/data-access-common';

@Injectable()
export class BinToBinTransferEffect {
  maxPageSize = 100000;

  constructor(
    private service: BinToBinTransferService,
    private dataPersistence: DataPersistence<any>,
    private loggerService: LoggerService,
    private lovDataService: LovDataService,
    private storeConfigDataService: StoreConfigDataService,
    private productGroupDataService: ProductGroupDataService,
    private productCategoryDataService: ProductCategoryDataService,
    private commonService: CommonService
  ) {}

  @Effect() loadSourceBins$: Observable<Action> = this.dataPersistence.fetch(
    BinToBinTransferActionTypes.LOAD_SOURCE_BINS,
    {
      run: (action: BinToBinTransferActions.LoadSourceBins) => {
        return this.service
          .getItemListGroups(
            action.payload.type,
            action.payload.pageIndex,
            action.payload.pageSize
          )
          .pipe(
            map(
              (
                loadItemListGroupResponse: BinToBinTransferLoadItemListGroupResponse
              ) =>
                new BinToBinTransferActions.LoadSourceBinsSuccess(
                  loadItemListGroupResponse
                )
            )
          );
      },

      onError: (
        action: BinToBinTransferActions.LoadSourceBins,
        error: HttpErrorResponse
      ) => {
        return new BinToBinTransferActions.LoadSourceBinsFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect() loadStuddedProductGroups$ = this.dataPersistence.fetch(
    BinToBinTransferActionTypes.LOAD_STUDDED_PRODUCT_GROUPS,
    {
      run: () => {
        return this.productGroupDataService
          .getProductGroups(false, null, null, null, 'S')
          .pipe(
            map(
              (data: ProductGroup[]) =>
                new BinToBinTransferActions.LoadStuddedProductGroupsSuccess(
                  data.map(p => p.productGroupCode)
                )
            )
          );
      },

      onError: (
        action: BinToBinTransferActions.LoadStuddedProductGroups,
        error: HttpErrorResponse
      ) => {
        return new BinToBinTransferActions.LoadStuddedProductGroupsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadProductsGroups$: Observable<
    Action
  > = this.dataPersistence.fetch(
    BinToBinTransferActionTypes.LOAD_PRODUCT_GROUPS,
    {
      run: (action: BinToBinTransferActions.LoadProductsGroups) => {
        return this.service
          .getItemListGroups(
            action.payload.type,
            action.payload.pageIndex,
            action.payload.pageSize
          )
          .pipe(
            map(
              (
                loadItemListGroupResponse: BinToBinTransferLoadItemListGroupResponse
              ) =>
                new BinToBinTransferActions.LoadProductsGroupsSuccess(
                  loadItemListGroupResponse
                )
            )
          );
      },

      onError: (
        action: BinToBinTransferActions.LoadProductsGroups,
        error: HttpErrorResponse
      ) => {
        return new BinToBinTransferActions.LoadProductsGroupsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadProductsCategory$: Observable<
    Action
  > = this.dataPersistence.fetch(
    BinToBinTransferActionTypes.LOAD_PRODUCT_CATEGORY,
    {
      run: (action: BinToBinTransferActions.LoadProductsCategory) => {
        return this.service
          .getItemListGroups(
            action.payload.type,
            action.payload.pageIndex,
            action.payload.pageSize
          )
          .pipe(
            map(
              (
                loadItemListGroupResponse: BinToBinTransferLoadItemListGroupResponse
              ) =>
                new BinToBinTransferActions.LoadProductsCategorySuccess(
                  loadItemListGroupResponse
                )
            )
          );
      },

      onError: (
        action: BinToBinTransferActions.LoadProductsCategory,
        error: HttpErrorResponse
      ) => {
        return new BinToBinTransferActions.LoadProductsCategoryFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadItemGroup$: Observable<Action> = this.dataPersistence.fetch(
    BinToBinTransferActionTypes.LOAD_ITEM_GROUP,
    {
      run: (action: BinToBinTransferActions.LoadItemGroup) => {
        return this.service
          .getItemListGroups(
            action.payload.type,
            null,
            null,
            action.payload.value
          )
          .pipe(
            map(
              (
                loadItemListGroupResponse: BinToBinTransferLoadItemListGroupResponse
              ) =>
                new BinToBinTransferActions.LoadItemGroupSuccess(
                  loadItemListGroupResponse.itemListGroups[0]
                )
            )
          );
      },

      onError: (
        action: BinToBinTransferActions.LoadItemGroup,
        error: HttpErrorResponse
      ) => {
        return new BinToBinTransferActions.LoadItemGroupFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() searchItemGroups$: Observable<Action> = this.dataPersistence.fetch(
    BinToBinTransferActionTypes.SEARCH_ITEM_GROUPS,
    {
      run: (action: BinToBinTransferActions.SearchItemGroups) => {
        return this.service
          .getItemListGroups(
            action.payload.type,
            action.payload.pageIndex,
            action.payload.pageSize,
            action.payload.value
          )
          .pipe(
            map(
              (
                loadItemListGroupResponse: BinToBinTransferLoadItemListGroupResponse
              ) =>
                new BinToBinTransferActions.SearchItemGroupsSuccess(
                  loadItemListGroupResponse
                )
            )
          );
      },

      onError: (
        action: BinToBinTransferActions.SearchItemGroups,
        error: HttpErrorResponse
      ) => {
        return new BinToBinTransferActions.SearchItemGroupsSuccess({
          count: 0,
          itemListGroups: []
        });
      }
    }
  );

  @Effect() loadItems$ = this.dataPersistence.fetch(
    BinToBinTransferActionTypes.LOAD_ITEMS,
    {
      run: (action: BinToBinTransferActions.LoadItems, state) => {
        return this.service

          .getItems(
            action.payload.itemCode,
            action.payload.lotNumber,
            action.payload.type,
            action.payload.value,
            action.payload.pageIndex,
            action.payload.pageSize,
            action.payload.sortBy,
            action.payload.sortOrder,
            action.payload.filter,
            state[binToBinTransferFeatureKey].studdedProductGroups
          )
          .pipe(
            map(
              (loadItemsResponse: BinToBinTransferLoadItemsResponse) =>
                new BinToBinTransferActions.LoadItemsSuccess(loadItemsResponse)
            )
          );
      },

      onError: (
        action: BinToBinTransferActions.LoadItems,
        error: HttpErrorResponse
      ) => {
        return new BinToBinTransferActions.LoadItemsSuccess({
          count: 0,
          items: [],
          totalValue: 0
        });
      }
    }
  );

  @Effect() searchItems$ = this.dataPersistence.fetch(
    BinToBinTransferActionTypes.SEARCH_ITEMS,
    {
      run: (action: BinToBinTransferActions.SearchItems, state) => {
        return this.service
          .searchItems(
            action.payload.itemCode,
            action.payload.lotNumber,
            state[binToBinTransferFeatureKey].studdedProductGroups
          )
          .pipe(
            map(
              (loadItemsResponse: BinToBinTransferLoadItemsResponse) =>
                new BinToBinTransferActions.SearchItemsSuccess(
                  loadItemsResponse
                )
            )
          );
      },

      onError: (
        action: BinToBinTransferActions.SearchItems,
        error: HttpErrorResponse
      ) => {
        return new BinToBinTransferActions.SearchItemsSuccess({
          count: 0,
          items: [],
          totalValue: 0
        });
      }
    }
  );

  @Effect() loadFileUploadId$ = this.dataPersistence.fetch(
    BinToBinTransferActionTypes.LOAD_FILE_UPLOAD_ID,
    {
      run: (action: BinToBinTransferActions.LoadFileUploadId, state) => {
        return this.service
          .loadFileUploadId(
            action.payload,
            state[binToBinTransferFeatureKey].studdedProductGroups
          )
          .pipe(
            mergeMap((response: number) => {
              return [
                new BinToBinTransferActions.LoadFileUploadIdSuccess(response),
                new BinToBinTransferActions.LoadFileUploadItems({
                  fileId: response,
                  pageSize: 10,
                  pageIndex: 0
                })
              ]
            })
          );
      },

      onError: (
        action: BinToBinTransferActions.LoadFileUploadId,
        error: HttpErrorResponse
      ) => {
        return new BinToBinTransferActions.LoadFileUploadIdFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadFileUploadItems$ = this.dataPersistence.fetch(
    BinToBinTransferActionTypes.LOAD_FILE_UPLOAD_ITEMS,
    {
      run: (action: BinToBinTransferActions.LoadFileUploadItems, state) => {
        return this.service
          .loadFileUploadItems(
            action.payload,
          )
          .pipe(
            map((response: BinToBinTransferLoadItemsResponse) =>
                new BinToBinTransferActions.LoadFileUploadItemsSuccess(response)
            )
          );
      },
      onError: (
        action: BinToBinTransferActions.LoadFileUploadItems,
        error: HttpErrorResponse
      ) => {
        return new BinToBinTransferActions.LoadFileUploadItemsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadBins$ = this.dataPersistence.fetch(
    BinToBinTransferActionTypes.LOAD_BINS,
    {
      run: () => {
        return this.storeConfigDataService
          .getStoreBins('RECEIVE_BIN')
          .pipe(
            map(
              (bins: StoreBin[]) =>
                new BinToBinTransferActions.LoadBinsSuccess(bins)
            )
          );
      },

      onError: (
        action: BinToBinTransferActions.LoadBins,
        error: HttpErrorResponse
      ) => {
        return new BinToBinTransferActions.LoadBinsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadProductGroupsOptions$ = this.dataPersistence.fetch(
    BinToBinTransferActionTypes.LOAD_PRODUCT_GROUP_OPTIONS,
    {
      run: () => {
        return this.productGroupDataService
          .getProductGroups(false, null, null, ['description,asc'])
          .pipe(
            map(
              (data: ProductGroup[]) =>
                new BinToBinTransferActions.LoadProductGroupOptionsSuccess(data)
            )
          );
      },

      onError: (
        action: BinToBinTransferActions.LoadProductGroupOptions,
        error: HttpErrorResponse
      ) => {
        return new BinToBinTransferActions.LoadProductGroupOptionsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadProductCategoriesOptions$ = this.dataPersistence.fetch(
    BinToBinTransferActionTypes.LOAD_PRODUCT_CATEGORY_OPTIONS,
    {
      run: () => {
        return this.productCategoryDataService
          .getProductCategories(false, null, null, ['description,asc'])
          .pipe(
            map(
              (data: ProductCategory[]) =>
                new BinToBinTransferActions.LoadProductCategoryOptionsSuccess(
                  data
                )
            )
          );
      },

      onError: (
        action: BinToBinTransferActions.LoadProductCategoryOptions,
        error: HttpErrorResponse
      ) => {
        return new BinToBinTransferActions.LoadProductCategoryOptionsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadSourceBinOptions$ = this.dataPersistence.fetch(
    BinToBinTransferActionTypes.LOAD_SOURCE_BIN_OPTIONS,
    {
      run: () => {
        return this.service
          .getItemListGroups(
            BinToBinTransferTypeEnum.BIN_CODE,
            0,
            this.maxPageSize
          )
          .pipe(
            map(
              data =>
                new BinToBinTransferActions.LoadSourceBinOptionsSuccess(
                  data.itemListGroups.map(ele => ele.name)
                )
            )
          );
      },

      onError: (
        action: BinToBinTransferActions.LoadSourceBinOptions,
        error: HttpErrorResponse
      ) => {
        return new BinToBinTransferActions.LoadSourceBinOptionsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() confirmTransferItems$ = this.dataPersistence.pessimisticUpdate(
    BinToBinTransferActionTypes.CONFIRM_TRANSFER_ITEMS,
    {
      run: (action: BinToBinTransferActions.ConfirmTransferItems) => {
        return this.service.confirmTransferItems(action.payload).pipe(
          map(
            (
              confirmTransferResponse: BinToBinTransferConfirmTransferResponse
            ) =>
              new BinToBinTransferActions.ConfirmTransferItemsSuccess({
                confirmTransferResponse,
                itemId: action.payload.request.binItems.map(
                  request => request.inventoryId
                ),
                remove: action.payload.remove
              })
          )
        );
      },

      onError: (
        action: BinToBinTransferActions.ConfirmTransferItems,
        error: HttpErrorResponse
      ) => {
        return new BinToBinTransferActions.ConfirmTransferItemsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() confirmFileUploadItemsBulkTransfer$ = this.dataPersistence.pessimisticUpdate(
    BinToBinTransferActionTypes.CONFIRM_FILE_UPLOAD_ITEMS_BULK_TRANSFER,
    {
      run: (action: BinToBinTransferActions.ConfirmFileUploadItemsBulkTransfer) => {
        return this.service.confirmFileUploadItemsBulkTransfer(action.payload).pipe(
          map(
            (
              confirmTransferResponse: BinToBinTransferConfirmTransferResponse
            ) =>
              new BinToBinTransferActions.ConfirmFileUploadItemsBulkTransferSuccess({
                confirmTransferResponse
              })
          )
        );
      },

      onError: (
        action: BinToBinTransferActions.ConfirmFileUploadItemsBulkTransfer,
        error: HttpErrorResponse
      ) => {
        return new BinToBinTransferActions.ConfirmFileUploadItemsBulkTransferFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() confirmTransferAllItems$ = this.dataPersistence.pessimisticUpdate(
    BinToBinTransferActionTypes.CONFIRM_TRANSFER_ALL_ITEMS,
    {
      run: (action: BinToBinTransferActions.ConfirmTransferAllItems) => {
        return this.service
          .confirmTransferAllItems(action.payload)
          .pipe(
            map(
              (
                confirmTransferResponse: BinToBinTransferConfirmTransferResponse
              ) =>
                new BinToBinTransferActions.ConfirmTransferAllItemsSuccess(
                  confirmTransferResponse
                )
            )
          );
      },

      onError: (
        action: BinToBinTransferActions.ConfirmTransferAllItems,
        error: HttpErrorResponse
      ) => {
        return new BinToBinTransferActions.ConfirmTransferAllItemsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadBinToBinHistory$: Observable<Action> = this.dataPersistence.fetch(
    BinToBinTransferActionTypes.LOAD_BIN_TO_BIN_HISTORY,
    {
      run: (action: BinToBinTransferActions.LoadBinToBinHistory) => {
        return this.service
          .getHistory(
            action.payload.historyData,
            action.payload.page,
            action.payload.size,
            action.payload.transactionType
          )
          .pipe(
            map(
              (binToBinHistory: BinToBinTransferLoadHistoryItemsResponse) =>
                new BinToBinTransferActions.LoadBinToBinHistorySuccess(
                  binToBinHistory
                )
            )
          );
      },
      onError: (
        action: BinToBinTransferActions.LoadBinToBinHistory,

        error: HttpErrorResponse
      ) => {
        return new BinToBinTransferActions.LoadBinToBinHistorySuccess({
          items: [],
          count: 0
        });
      }
    }
  );

  @Effect()
  loadSelectedHistory$: Observable<Action> = this.dataPersistence.fetch(
    BinToBinTransferActionTypes.LOAD_SELECTED_HISTORY,
    {
      run: (action: BinToBinTransferActions.LoadSelectedHistory) => {
        return this.service
          .getSelectedHistory(action.payload.id)
          .pipe(
            map(
              (selectedHistory: BinToBinTransferHistoryItemHeader) =>
                new BinToBinTransferActions.LoadSelectedHistorySuccess(
                  selectedHistory
                )
            )
          );
      },
      onError: (
        action: BinToBinTransferActions.LoadSelectedHistory,
        error: HttpErrorResponse
      ) => {
        return new BinToBinTransferActions.LoadSelectedHistoryFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadHistoryItems$ = this.dataPersistence.fetch(
    BinToBinTransferActionTypes.LOAD_HISTORY_ITEMS,
    {
      run: (action: BinToBinTransferActions.LoadHistoryItems, state) => {
        return this.service

          .getHistoryItems(
            action.payload.historyItemsData,
            action.payload.pageIndex,
            action.payload.pageSize,
            action.payload.sortBy,
            action.payload.sortOrder,
            action.payload.value,
            state[binToBinTransferFeatureKey].studdedProductGroups
          )
          .pipe(
            map(
              (loadItemsResponse: BinToBinTransferLoadItemsResponse) =>
                new BinToBinTransferActions.LoadHistoryItemsSuccess(
                  loadItemsResponse
                )
            )
          );
      },

      onError: (
        action: BinToBinTransferActions.LoadHistoryItems,
        error: HttpErrorResponse
      ) => {
        return new BinToBinTransferActions.LoadHistoryItemsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  // Image

  @Effect() loadThumbnailImageUrl$ = this.dataPersistence.fetch(
    BinToBinTransferActionTypes.LOAD_THUMBNAIL_IMAGE_URL,
    {
      run: (action: BinToBinTransferActions.LoadThumbnailImageUrl, state) => {
        return this.commonService
          .getThumbnailImageUrl(action.payload)
          .pipe(
            map(
              (loadImageResponse: ImageResponse) =>
                new BinToBinTransferActions.LoadThumbnailImageUrlSuccess(
                  loadImageResponse
                )
            )
          );
      },

      onError: (
        action: BinToBinTransferActions.LoadThumbnailImageUrl,
        error: HttpErrorResponse
      ) => {
        return new BinToBinTransferActions.LoadThumbnailImageUrlFailure({
          id: action.payload.id,
          isSearchedItem: action.payload.isSearchedItem
        });
      }
    }
  );

  @Effect() loadImageUrl$ = this.dataPersistence.fetch(
    BinToBinTransferActionTypes.LOAD_IMAGE_URL,
    {
      run: (action: BinToBinTransferActions.LoadImageUrl, state) => {
        return this.commonService
          .getImageUrl(action.payload)
          .pipe(
            map(
              (loadImageResponse: ImageResponse) =>
                new BinToBinTransferActions.LoadImageUrlSuccess(
                  loadImageResponse
                )
            )
          );
      },

      onError: (
        action: BinToBinTransferActions.LoadImageUrl,
        error: HttpErrorResponse
      ) => {
        return new BinToBinTransferActions.LoadImageUrlFailure({
          id: action.payload.id,
          imageUrl: action.payload.imageUrl,
          isSearchedItem: action.payload.isSearchedItem
        });
      }
    }
  );

  @Effect() loadDefectTypeDescriptionList$ = this.dataPersistence.fetch(
    BinToBinTransferActionTypes.LOAD_DEFECT_TYPE,
    {
      run: (action: BinToBinTransferActions.LoadDefectType, state) => {
        return this.lovDataService
          .getInventoryLovs(LovMasterEnum.DEFECTTYPE, true)
          .pipe(
            map(
              (data: Lov[]) =>
                new BinToBinTransferActions.LoadDefectTypeSuccess(data)
            )
          );
      },
      onError: (
        action: BinToBinTransferActions.LoadDefectType,
        error: HttpErrorResponse
      ) => {
        return new BinToBinTransferActions.LoadDefectTypeFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadDefectCodeDescriptionList$ = this.dataPersistence.fetch(
    BinToBinTransferActionTypes.LOAD_DEFECT_CODE,
    {
      run: (action: BinToBinTransferActions.LoadDefectCode, state) => {
        return this.lovDataService
          .getInventoryLovs(LovMasterEnum.DEFECTCODE, true)
          .pipe(
            map(
              (data: Lov[]) =>
                new BinToBinTransferActions.LoadDefectCodeSuccess(data)
            )
          );
      },

      onError: (
        action: BinToBinTransferActions.LoadDefectCode,
        error: HttpErrorResponse
      ) => {
        return new BinToBinTransferActions.LoadDefectCodeFailure(
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
