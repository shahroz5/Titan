import {
  LovDataService,
  ProductCategoryDataService,
  ProductGroupDataService
} from '@poss-web/shared/masters/data-access-masters';
import { LoggerService } from '@poss-web/shared/util-logger';
import {
  DiscountsResponse,
  CustomErrors,
  DiscountTransactionLevelResponse,
  DiscountHeaders,
  DiscountConfigDetailsResponse,
  Lov,
  DiscountVoucherDetailsResponePayload,
  GepPurityConfigIdEligibleItemsResponse,
  DiscountHeadersDetails,
  RivaahGHSDiscounts,
  CashMemoItemDetailsResponse
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { map } from 'rxjs/operators';
import { DataPersistence } from '@nrwl/angular';
import { HttpErrorResponse } from '@angular/common/http';
import * as DiscountActions from './discount.actions';
import { DiscountActionTypes } from './discount.actions';
import { DiscountService } from '../discount.service';

@Injectable()
export class DiscountEffect {
  constructor(
    private dataPersistence: DataPersistence<any>,
    private loggerService: LoggerService,
    private productCategoryDataService: ProductCategoryDataService,
    private productGroupDataService: ProductGroupDataService,
    private discountService: DiscountService,
    private lovDataService: LovDataService
  ) {}
  /**
   *  The effect which handles the discount Action
   */
  @Effect()
  loadItemLevelDisc$ = this.dataPersistence.fetch(
    DiscountActionTypes.LOAD_ITEM_LEVEL_DISCOUNTS,
    {
      run: (action: DiscountActions.LoadItemLevelDiscounts) => {
        return this.discountService
          .loadItemLevelDiscounts(action.payload)
          .pipe(
            map(
              (data: DiscountHeaders) =>
                new DiscountActions.LoadItemLevelDiscountsSuccess(data)
            )
          );
      },
      onError: (
        action: DiscountActions.LoadItemLevelDiscounts,
        error: HttpErrorResponse
      ) => {
        return new DiscountActions.LoadItemLevelDiscountsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadItemLevelDiscDetails$ = this.dataPersistence.fetch(
    DiscountActionTypes.LOAD_ITEM_LEVEL_DISCOUNTS_DETAILS,
    {
      run: (action: DiscountActions.LoadItemLevelDiscountsDetails) => {
        return this.discountService
          .loadItemLevelDiscountsDetails(action.payload)
          .pipe(
            map(
              (data: {
                discountConfigDetails: DiscountConfigDetailsResponse[];
                clubbingId: string;
                data: CashMemoItemDetailsResponse;
              }) =>
                new DiscountActions.LoadItemLevelDiscountsDetailsSuccess(data)
            )
          );
      },
      onError: (
        action: DiscountActions.LoadItemLevelDiscountsDetails,
        error: HttpErrorResponse
      ) => {
        return new DiscountActions.LoadItemLevelDiscountsDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  getItemLevelDisc$ = this.dataPersistence.fetch(
    DiscountActionTypes.GET_ITEM_LEVEL_DISCOUNTS,
    {
      run: (action: DiscountActions.GetItemLevelDiscounts) => {
        return this.discountService
          .getItemLevelDiscountsDetails(action.payload)
          .pipe(
            map(
              (data: DiscountsResponse[]) =>
                new DiscountActions.GetItemLevelDiscountsSuccess(data)
            )
          );
      },
      onError: (
        action: DiscountActions.GetItemLevelDiscounts,
        error: HttpErrorResponse
      ) => {
        return new DiscountActions.GetItemLevelDiscountsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  saveItemLevelDisc$ = this.dataPersistence.fetch(
    DiscountActionTypes.SAVE_ITEM_LEVEL_DISCOUNTS,
    {
      run: (action: DiscountActions.SaveItemLevelDiscounts) => {
        return this.discountService
          .saveItemLevelDiscountsDetails(action.payload.request)
          .pipe(
            map(
              (data: DiscountsResponse[]) =>
                new DiscountActions.SaveItemLevelDiscountsSuccess({
                  response: data,
                  data: action.payload.data
                })
            )
          );
      },
      onError: (
        action: DiscountActions.SaveItemLevelDiscounts,
        error: HttpErrorResponse
      ) => {
        return new DiscountActions.SaveItemLevelDiscountsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  saveExcludeSlabItemDiscount$ = this.dataPersistence.fetch(
    DiscountActionTypes.SAVE_EXCLUDE_SLAB_ITEM_DISCOUNT,
    {
      run: (action: DiscountActions.SaveExcludeSlabItemDiscount) => {
        return this.discountService
          .saveSlabExclueItemDetails(action.payload)
          .pipe(
            map(
              (data: boolean) =>
                new DiscountActions.SaveExcludeSlabItemDiscountSuccess(data)
            )
          );
      },
      onError: (
        action: DiscountActions.SaveExcludeSlabItemDiscount,
        error: HttpErrorResponse
      ) => {
        return new DiscountActions.SaveExcludeSlabItemDiscountFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  updateItemLevelDisc$ = this.dataPersistence.fetch(
    DiscountActionTypes.UPDATE_ITEM_LEVEL_DISCOUNTS,
    {
      run: (action: DiscountActions.UpdateItemLevelDiscounts) => {
        return this.discountService
          .updateItemLevelDiscountsDetails(action.payload)
          .pipe(
            map(
              (data: DiscountsResponse) =>
                new DiscountActions.UpdateItemLevelDiscountsSuccess(data)
            )
          );
      },
      onError: (
        action: DiscountActions.UpdateItemLevelDiscounts,
        error: HttpErrorResponse
      ) => {
        return new DiscountActions.UpdateItemLevelDiscountsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  deleteItemLevelDisc$ = this.dataPersistence.fetch(
    DiscountActionTypes.DELETE_ITEM_LEVEL_DISCOUNTS,
    {
      run: (action: DiscountActions.DeleteItemLevelDiscounts) => {
        return this.discountService
          .deleteItemLevelDiscountsDetails(action.payload.request)
          .pipe(
            map(
              (data: boolean) =>
                new DiscountActions.DeleteItemLevelDiscountsSuccess({
                  response: true,
                  data: {
                    itemData: action.payload.data,
                    discountData: action.payload.request.requestBody
                  }
                })
            )
          );
      },
      onError: (
        action: DiscountActions.DeleteItemLevelDiscounts,
        error: HttpErrorResponse
      ) => {
        return new DiscountActions.DeleteItemLevelDiscountsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadPcDesc$ = this.dataPersistence.fetch(DiscountActionTypes.LOAD_PC_DESC, {
    run: (action: DiscountActions.LoadPcDesc) => {
      return this.productCategoryDataService
        .getProductCategoryDescription()
        .pipe(map((data: {}) => new DiscountActions.LoadPcDescSuccess(data)));
    },
    onError: (action: DiscountActions.LoadPcDesc, error: HttpErrorResponse) => {
      return new DiscountActions.LoadPcDescFailure(this.errorHandler(error));
    }
  });

  @Effect()
  loadPgDesc$ = this.dataPersistence.fetch(DiscountActionTypes.LOAD_PG_DESC, {
    run: (action: DiscountActions.LoadPgDesc) => {
      return this.productGroupDataService
        .getProductGroupDescription()
        .pipe(map((data: {}) => new DiscountActions.LoadPgDescSuccess(data)));
    },
    onError: (action: DiscountActions.LoadPgDesc, error: HttpErrorResponse) => {
      return new DiscountActions.LoadPgDescFailure(this.errorHandler(error));
    }
  });

  @Effect()
  loadDiscTypes$ = this.dataPersistence.fetch(
    DiscountActionTypes.LOAD_DISCOUNT_TYPES,
    {
      run: (action: DiscountActions.LoadDiscountTypes) => {
        return this.lovDataService
          .getEngineConfigLovs(action.payload)
          .pipe(
            map(
              (data: Lov[]) =>
                new DiscountActions.LoadDiscountTypesSuccess(data)
            )
          );
      },
      onError: (
        action: DiscountActions.LoadDiscountTypes,
        error: HttpErrorResponse
      ) => {
        return new DiscountActions.LoadDiscountTypesFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadAvailableTransactionLevelDiscounts$ = this.dataPersistence.fetch(
    DiscountActionTypes.LOAD_TRANSACTION_LEVEL_DISCOUNTS,
    {
      run: (action: DiscountActions.LoadTransactionLevelDiscounts) => {
        return this.discountService
          .loadAvailableTransactionLevelDiscounts(action.paylaod)
          .pipe(
            map(
              (data: DiscountTransactionLevelResponse[]) =>
                new DiscountActions.LoadTransactionLevelDiscountsSuccess(data)
            )
          );
      },
      onError: (
        action: DiscountActions.LoadTransactionLevelDiscounts,
        error: HttpErrorResponse
      ) => {
        return new DiscountActions.LoadTransactionLevelDiscountsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loaddigigoldDiscounts$ = this.dataPersistence.fetch(
    DiscountActionTypes.LOAD_DIGI_GOLD_DISCOUNTS,
    {
      run: (action: DiscountActions.LoadDigiGoldDiscounts) => {
        return this.discountService
          .loadAvailableTransactionLevelDiscounts(action.paylaod)
          .pipe(
            map(
              (data: DiscountTransactionLevelResponse[]) =>
                new DiscountActions.LoadDigiGoldDiscountsSuccess(data)
            )
          );
      },
      onError: (
        action: DiscountActions.LoadDigiGoldDiscounts,
        error: HttpErrorResponse
      ) => {
        return new DiscountActions.LoadDigiGoldDiscountsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadGrnMultipleDiscounts$ = this.dataPersistence.fetch(
    DiscountActionTypes.LOAD_GRN_MULTIPLE_DISCOUNTS,
    {
      run: (action: DiscountActions.LoadGrnMultipleDiscounts) => {
        return this.discountService
          .loadAvailableTransactionLevelDiscounts(action.paylaod)
          .pipe(
            map(
              (data: DiscountTransactionLevelResponse[]) =>
                new DiscountActions.LoadGrnMultipleDiscountsSuccess(data)
            )
          );
      },
      onError: (
        action: DiscountActions.LoadGrnMultipleDiscounts,
        error: HttpErrorResponse
      ) => {
        return new DiscountActions.LoadGrnMultipleDiscountsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadAvailableEmployeeDiscounts$ = this.dataPersistence.fetch(
    DiscountActionTypes.LOAD_AVAILABLE_EMPLOYEE_DISCOUNTS,
    {
      run: (action: DiscountActions.LoadAvailableEmployeeDiscounts) => {
        return this.discountService
          .loadAvailableTransactionLevelDiscounts(action.paylaod)
          .pipe(
            map(
              (data: DiscountTransactionLevelResponse[]) =>
                new DiscountActions.LoadAvailableEmployeeDiscountsSuccess(data)
            )
          );
      },
      onError: (
        action: DiscountActions.LoadAvailableEmployeeDiscounts,
        error: HttpErrorResponse
      ) => {
        return new DiscountActions.LoadAvailableEmployeeDiscountsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadAvailableTSSSDiscounts$ = this.dataPersistence.fetch(
    DiscountActionTypes.LOAD_AVAILABLE_TSSS_DISCOUNTS,
    {
      run: (action: DiscountActions.LoadAvailableTSSSDiscounts) => {
        return this.discountService
          .loadAvailableTransactionLevelDiscounts(action.paylaod)
          .pipe(
            map(
              (data: DiscountTransactionLevelResponse[]) =>
                new DiscountActions.LoadAvailableTSSSDiscountsSuccess(data)
            )
          );
      },
      onError: (
        action: DiscountActions.LoadAvailableTSSSDiscounts,
        error: HttpErrorResponse
      ) => {
        return new DiscountActions.LoadAvailableTSSSDiscountsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadAvailableTataEmployeeDiscounts$ = this.dataPersistence.fetch(
    DiscountActionTypes.LOAD_AVAILABLE_TATA_EMPLOYEE_DISCOUNTS,
    {
      run: (action: DiscountActions.LoadAvailableTataEmployeeDiscounts) => {
        return this.discountService
          .loadAvailableTransactionLevelDiscounts(action.paylaod)
          .pipe(
            map(
              (data: DiscountTransactionLevelResponse[]) =>
                new DiscountActions.LoadAvailableTataEmployeeDiscountsSuccess(
                  data
                )
            )
          );
      },
      onError: (
        action: DiscountActions.LoadAvailableTataEmployeeDiscounts,
        error: HttpErrorResponse
      ) => {
        return new DiscountActions.LoadAvailableTataEmployeeDiscountsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadAvailableSystemDvDiscounts$ = this.dataPersistence.fetch(
    DiscountActionTypes.LOAD_AVAILABLE_SYSTEM_DV_DISCOUNTS,
    {
      run: (action: DiscountActions.LoadAvailableSystemDvDiscounts) => {
        return this.discountService
          .loadAvailableTransactionLevelDiscounts(action.paylaod)
          .pipe(
            map(
              (data: DiscountTransactionLevelResponse[]) =>
                new DiscountActions.LoadAvailableSystemDvDiscountsSuccess(data)
            )
          );
      },
      onError: (
        action: DiscountActions.LoadAvailableSystemDvDiscounts,
        error: HttpErrorResponse
      ) => {
        return new DiscountActions.LoadAvailableSystemDvDiscountsFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  loadAvailableEmpowermentDiscounts$ = this.dataPersistence.fetch(
    DiscountActionTypes.LOAD_AVAILABLE_EMPOWERMENT_DISCOUNT,
    {
      run: (action: DiscountActions.LoadAvailableEmpowementDiscounts) => {
        return this.discountService
          .loadAvailableTransactionLevelDiscounts(action.paylaod)
          .pipe(
            map(
              (data: DiscountTransactionLevelResponse[]) =>
                new DiscountActions.LoadAvailableEmpowementDiscountsSuccess(
                  data
                )
            )
          );
      },
      onError: (
        action: DiscountActions.LoadAvailableEmpowementDiscounts,
        error: HttpErrorResponse
      ) => {
        return new DiscountActions.LoadAvailableEmpowementDiscountsFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  applyTransactionLevelDiscounts$ = this.dataPersistence.fetch(
    DiscountActionTypes.APPLY_DISCOUNT_AT_TRANSACTION_LEVEL,
    {
      run: (action: DiscountActions.ApplyDiscountAtTransactionLevel) => {
        console.log('APPLY_DISCOUNT_AT_TRANSACTION_LEVEL EFFECT CALLED');
        return this.discountService
          .applyTransactionLevelDiscount(action.paylaod)
          .pipe(
            map(
              (data: boolean) =>
                new DiscountActions.ApplyDiscountAtTransactionLevelSucces(data)
            )
          );
      },
      onError: (
        action: DiscountActions.ApplyDiscountAtTransactionLevel,
        error: HttpErrorResponse
      ) => {
        return new DiscountActions.ApplyDiscountAtTransactionLevelFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadAppliedTransactionLevelDiscounts$ = this.dataPersistence.fetch(
    DiscountActionTypes.LOAD_APPLIED_TRANSACTION_LEVEL_DISCOUNTS,
    {
      run: (action: DiscountActions.LoadAppliedTransactionLevelDiscounts) => {
        return this.discountService
          .loadAppliedTransactionLevelDiscount(action.paylaod)
          .pipe(
            map(
              (data: any) =>
                new DiscountActions.LoadAppliedTransactionLevelDiscountsSuccess(
                  data
                )
            )
          );
      },
      onError: (
        action: DiscountActions.LoadAppliedTransactionLevelDiscounts,
        error: HttpErrorResponse
      ) => {
        return new DiscountActions.LoadAppliedTransactionLevelDiscountsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  removeAllAppliedTransactionLevelDiscounts$ = this.dataPersistence.fetch(
    DiscountActionTypes.REMOVE_ALL_APPLIED_TRANSACTION_LEVEL_DISCOUNTS,
    {
      run: (
        action: DiscountActions.RemoveAllAppliedTransactionLevelDiscounts
      ) => {
        return this.discountService
          .removeAllTransactionLevelDiscounts(action.payload)
          .pipe(
            map(
              (data: boolean) =>
                new DiscountActions.RemoveAllAppliedTransactionLevelDiscountsSuccess(
                  {
                    isDeleted: data,
                    discountType: action.payload.discountType
                  }
                )
            )
          );
      },
      onError: (
        action: DiscountActions.RemoveAllAppliedTransactionLevelDiscounts,
        error: HttpErrorResponse
      ) => {
        return new DiscountActions.RemoveAllAppliedTransactionLevelDiscountsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  removeSelectedTransactionLevelDiscount$ = this.dataPersistence.fetch(
    DiscountActionTypes.REMOVE_APPLIED_TRANSACTION_LEVEL_DISCOUNT_BY_ID,
    {
      run: (
        action: DiscountActions.RemoveAppliedTransactionLevelDiscountByID
      ) => {
        return this.discountService
          .removeSelectedTransactionLevelDiscount(action.paylaod)
          .pipe(
            map(
              (data: boolean) =>
                new DiscountActions.RemoveAppliedTransactionLevelDiscountByIDSuccess(
                  data
                )
            )
          );
      },
      onError: (
        action: DiscountActions.RemoveAppliedTransactionLevelDiscountByID,
        error: HttpErrorResponse
      ) => {
        return new DiscountActions.RemoveAppliedTransactionLevelDiscountByIDFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  removeDigilDiscount$ = this.dataPersistence.fetch(
    DiscountActionTypes.REMOVE_DIGI_DISCOUNT,
    {
      run: (action: DiscountActions.RemoveDigiDiscount) => {
        return this.discountService
          .removeSelectedTransactionLevelDiscount(action.paylaod)
          .pipe(
            map(
              (data: boolean) =>
                new DiscountActions.RemoveDigiDiscountSuccess(
                  data,
                  action.paylaod
                )
            )
          );
      },
      onError: (
        action: DiscountActions.RemoveDigiDiscount,
        error: HttpErrorResponse
      ) => {
        return new DiscountActions.RemoveDigiDiscountFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  updateTransactionLevelDiscount$ = this.dataPersistence.fetch(
    DiscountActionTypes.UPDATE_APPLIED_TRANSACTION_LEVEL_DISCOUNTS,
    {
      run: (action: DiscountActions.UpdateAppliedTransactionLevelDiscount) => {
        return this.discountService
          .updateTransactionLevelDiscount(action.paylaod)
          .pipe(
            map(
              (data: boolean) =>
                new DiscountActions.UpdateAppliedTransactionLevelDiscountSuccess(
                  data
                )
            )
          );
      },
      onError: (
        action: DiscountActions.UpdateAppliedTransactionLevelDiscount,
        error: HttpErrorResponse
      ) => {
        return new DiscountActions.UpdateAppliedTransactionLevelDiscountFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  confirmTransactionLevelDiscount$ = this.dataPersistence.fetch(
    DiscountActionTypes.CONFIRM_APPLIED_TRANSACTION_LEVEL_DISCOUNTS,
    {
      run: (action: DiscountActions.ConfirmAppliedTransactionLevelDiscount) => {
        return this.discountService
          .confirmTransactionLevelDiscount(action.paylaod)
          .pipe(
            map(
              (data: any) =>
                new DiscountActions.ConfirmAppliedTransactionLevelDiscountSuccess(
                  data,
                  action.paylaod
                )
            )
          );
      },
      onError: (
        action: DiscountActions.ConfirmAppliedTransactionLevelDiscount,
        error: HttpErrorResponse
      ) => {
        return new DiscountActions.ConfirmAppliedTransactionLevelDiscountFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  cmOccasionList$ = this.dataPersistence.fetch(
    DiscountActionTypes.LOAD_TATA_COMPANY_NAME_LIST,
    {
      run: (action: DiscountActions.LoadTataCompanyNameList) => {
        return this.lovDataService
          .getSalesLovs(action.payload)
          .pipe(
            map(
              (data: Lov[]) =>
                new DiscountActions.LoadTataCompanyNameListSuccess(data)
            )
          );
      },

      onError: (
        action: DiscountActions.LoadTataCompanyNameList,
        error: HttpErrorResponse
      ) => {
        return new DiscountActions.LoadTataCompanyNameListFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadEligibleItemsForDiscountIds$ = this.dataPersistence.fetch(
    DiscountActionTypes.LOAD_ELIGIBLE_ITEMS_FOR_DISCOUNT_IDS,
    {
      run: (action: DiscountActions.LoadEligibleItemsForDiscountIds) => {
        return this.discountService
          .getEligibleItemsForDiscountIds(
            action.discountType,
            action.requestPayload
          )
          .pipe(
            map(
              (data: any) =>
                new DiscountActions.LoadEligibleItemsForDiscountIdsSuccess(data)
            )
          );
      },
      onError: (
        action: DiscountActions.LoadEligibleItemsForDiscountIds,
        error: HttpErrorResponse
      ) => {
        return new DiscountActions.LoadEligibleItemsForDiscountIdsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadEligibleItemsForGepPurityOffer$ = this.dataPersistence.fetch(
    DiscountActionTypes.LOAD_ELIGIBLE_ITEMS_FOR_GEP_PURITY_CONFIG,
    {
      run: (action: DiscountActions.LoadEligibleItemsForGepPurityConfig) => {
        return this.discountService
          .loadEligibleItemsForGepPurityDiscountConfigId(action.requestPayload)
          .pipe(
            map(
              (data: GepPurityConfigIdEligibleItemsResponse) =>
                new DiscountActions.LoadEligibleItemsForGepPurityConfigSuccess(
                  data
                )
            )
          );
      },
      onError: (
        action: DiscountActions.LoadEligibleItemsForGepPurityConfig,
        error: HttpErrorResponse
      ) => {
        return new DiscountActions.LoadEligibleItemsForGepPurityConfigFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  applyKaratOrCoinTransactionLevelDiscounts$ = this.dataPersistence.fetch(
    DiscountActionTypes.APPLY_KARAT_OR_COIN_OFFER_DISCOUNT,
    {
      run: (action: DiscountActions.ApplyKaratOrCoinOfferDiscount) => {
        return this.discountService
          .applyKaratOrCoinOfferTransactionLevelDiscount(action.requestPayload)
          .pipe(
            map(
              (data: boolean) =>
                new DiscountActions.ApplyKaratOrCoinOfferDiscountSuccess(data)
            )
          );
      },
      onError: (
        action: DiscountActions.ApplyKaratOrCoinOfferDiscount,
        error: HttpErrorResponse
      ) => {
        return new DiscountActions.ApplyKaratOrCoinOfferDiscountFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadDiscountVoucherDetails$ = this.dataPersistence.fetch(
    DiscountActionTypes.LOAD_DISCOUNT_VOUCHER_DETAILS,
    {
      run: (action: DiscountActions.LoadDiscountVoucherDetails) => {
        return this.discountService
          .loadDiscountVocherDetails(action.payload)
          .pipe(
            map((data: DiscountVoucherDetailsResponePayload) => {
              console.log('VOUCHER DETAILS SUCCESS EFFECT :', data);
              return new DiscountActions.LoadDiscountVoucherDetailsSuccess(
                data
              );
            })
          );
      },
      onError: (
        action: DiscountActions.LoadDiscountVoucherDetails,
        error: HttpErrorResponse
      ) => {
        return new DiscountActions.LoadDiscountVoucherDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  checkABCOEligibility$ = this.dataPersistence.fetch(
    DiscountActionTypes.CHECK_AB_CO_ELIGIBILITY,
    {
      run: (action: DiscountActions.CheckABCOEligibility) => {
        return this.discountService
          .checkABCOEligibility(action.payload)
          .pipe(
            map(
              (data: {
                discountConfigDetails: DiscountConfigDetailsResponse[];
                clubbingId: string;
              }) => new DiscountActions.CheckABCOEligibilitySuccess(data)
            )
          );
      },
      onError: (
        action: DiscountActions.CheckABCOEligibility,
        error: HttpErrorResponse
      ) => {
        return new DiscountActions.CheckABCOEligibilityFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadABCODiscounts$ = this.dataPersistence.fetch(
    DiscountActionTypes.LOAD_AB_CO_DISCOUNTS,
    {
      run: (action: DiscountActions.LoadABCODiscounts) => {
        return this.discountService
          .loadABCODiscounts(action.payload)
          .pipe(
            map(
              (data: DiscountHeaders) =>
                new DiscountActions.LoadABCODiscountsSuccess(data)
            )
          );
      },
      onError: (
        action: DiscountActions.LoadABCODiscounts,
        error: HttpErrorResponse
      ) => {
        return new DiscountActions.LoadABCODiscountsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadNewABCODiscounts$ = this.dataPersistence.fetch(
    DiscountActionTypes.LOAD_NEW_AB_CO_DISCOUNTS,
    {
      run: (action: DiscountActions.LoadNewABCODiscounts) => {
        return this.discountService
          .loadNewABCODiscounts(action.payload)
          .pipe(
            map(
              (data: DiscountHeaders) =>
                new DiscountActions.LoadNewABCODiscountsSuccess(data)
            )
          );
      },
      onError: (
        action: DiscountActions.LoadNewABCODiscounts,
        error: HttpErrorResponse
      ) => {
        return new DiscountActions.LoadNewABCODiscountsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadABCODiscountDetails$ = this.dataPersistence.fetch(
    DiscountActionTypes.LOAD_AB_CO_DISCOUNT_DETAILS,
    {
      run: (action: DiscountActions.LoadABCODiscountDetails) => {
        return this.discountService
          .loadABCODiscountDetails(action.payload)
          .pipe(
            map(
              (data: {
                discountConfigDetails: DiscountConfigDetailsResponse[];
                clubbingId: string;
              }) => new DiscountActions.LoadABCODiscountDetailsSuccess(data)
            )
          );
      },
      onError: (
        action: DiscountActions.LoadABCODiscountDetails,
        error: HttpErrorResponse
      ) => {
        return new DiscountActions.LoadABCODiscountDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadABCOConfigDetails$ = this.dataPersistence.fetch(
    DiscountActionTypes.LOAD_AB_CO_CONFIG_DETAILS,
    {
      run: (action: DiscountActions.LoadABCOConfigDetails) => {
        return this.discountService
          .loadABCODConfigDetails(action.payload)
          .pipe(
            map(
              (data: DiscountHeadersDetails) =>
                new DiscountActions.LoadABCOConfigDetailsSuccess(data)
            )
          );
      },
      onError: (
        action: DiscountActions.LoadABCOConfigDetails,
        error: HttpErrorResponse
      ) => {
        return new DiscountActions.LoadABCOConfigDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadAutoDiscounts$ = this.dataPersistence.fetch(
    DiscountActionTypes.LOAD_AUTO_DISCOUNTS,
    {
      run: (action: DiscountActions.LoadAutoDiscounts) => {
        return this.discountService
          .loadAutoDiscounts(action.payload.request)
          .pipe(
            map(
              (data: {
                discountConfigDetails: DiscountConfigDetailsResponse[];
                clubbingId: string;
                cummulativeDiscountWithExcludeDetails: any;
              }) =>
                new DiscountActions.LoadAutoDiscountsSuccess({
                  response: data,
                  data: action.payload.data
                })
            )
          );
      },
      onError: (
        action: DiscountActions.LoadAutoDiscounts,
        error: HttpErrorResponse
      ) => {
        return new DiscountActions.LoadAutoDiscountsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadRivaahGHSDiscounts$ = this.dataPersistence.fetch(
    DiscountActionTypes.LOAD_RIVAAH_GHS_DISCOUNTS,
    {
      run: (action: DiscountActions.LoadRivaahGHSDiscounts) => {
        return this.discountService
          .loadRivaahGHSDiscounts(action.paylaod)
          .pipe(
            map(
              (data: RivaahGHSDiscounts) =>
                new DiscountActions.LoadRivaahGHSDiscountsSuccess(data)
            )
          );
      },
      onError: (
        action: DiscountActions.LoadRivaahGHSDiscounts,
        error: HttpErrorResponse
      ) => {
        return new DiscountActions.LoadRivaahGHSDiscountsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  saveRivaahGHSDiscounts$ = this.dataPersistence.fetch(
    DiscountActionTypes.SAVE_RIVAAH_GHS_DISCOUNTS,
    {
      run: (action: DiscountActions.SaveRivaahGHSDiscounts) => {
        return this.discountService
          .saveRivaahGHSDiscounts(action.paylaod)
          .pipe(
            map(
              (data: string[]) =>
                new DiscountActions.SaveRivaahGHSDiscountsSuccess(data)
            )
          );
      },
      onError: (
        action: DiscountActions.SaveRivaahGHSDiscounts,
        error: HttpErrorResponse
      ) => {
        return new DiscountActions.SaveRivaahGHSDiscountsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadReasonForChangingDiscounts$ = this.dataPersistence.fetch(
    DiscountActionTypes.LOAD_REASON_FOR_CHANGING_DISCOUNTS,
    {
      run: (action: DiscountActions.LoadReasonForChangingDiscounts) => {
        return this.lovDataService.getSalesLovs(action.payload).pipe(
          map((data: Lov[]) => {
            return new DiscountActions.LoadReasonForChangingDiscountsSuccess(
              data
            );
          })
        );
      },

      onError: (
        action: DiscountActions.LoadReasonForChangingDiscounts,
        error: HttpErrorResponse
      ) => {
        return new DiscountActions.LoadReasonForChangingDiscountsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadReasonForNotGivingDiscounts$ = this.dataPersistence.fetch(
    DiscountActionTypes.LOAD_REASON_FOR_NOTGIVING_DISCOUNTS,
    {
      run: (action: DiscountActions.LoadReasonForNotGivingDiscounts) => {
        return this.lovDataService.getSalesLovs(action.payload).pipe(
          map((data: Lov[]) => {
            return new DiscountActions.LoadReasonForNotGivingDiscountsSuccess(
              data
            );
          })
        );
      },

      onError: (
        action: DiscountActions.LoadReasonForNotGivingDiscounts,
        error: HttpErrorResponse
      ) => {
        return new DiscountActions.LoadReasonForNotGivingDiscountsFailure(
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
