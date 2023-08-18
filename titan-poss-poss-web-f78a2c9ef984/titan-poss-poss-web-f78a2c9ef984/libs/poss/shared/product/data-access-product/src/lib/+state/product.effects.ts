import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/angular';

import { map } from 'rxjs/operators';
import { ProductState } from './product.state';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { ProductActionTypes } from './product.actions';
import * as ProductActions from './product.actions';
import { ProductService } from '../product.service';
import { HttpErrorResponse } from '@angular/common/http';
import {
  CustomErrors,
  SearchProductList,
  ProductDetails,
  StoreUser,
  ProductPriceDetails,
  CashMemoTaxDetails,
  CashMemoItemDetailsResponse,
  CoinDetails,
  Lov,
  RsoDetailsPayload,
  CNDetailsResponsePayload,
  CashMemoDetailsResponse,
  COItemDetailsResponse
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { LoggerService } from '@poss-web/shared/util-logger';
import {
  LovDataService,
  StoreUserDataService
} from '@poss-web/shared/masters/data-access-masters';
import { ErrorEnums } from '@poss-web/shared/util-error';
import { InventoryValidationService } from '@poss-web/shared/common/data-access-common';

@Injectable()
export class ProductEffects {
  constructor(
    private loggerService: LoggerService,
    private dataPersistence: DataPersistence<ProductState>,
    private productService: ProductService,
    private storeUserDataService: StoreUserDataService,
    private inventoryValidationService: InventoryValidationService,
    private lovDataService: LovDataService
  ) {}

  @Effect() searchProduct$: Observable<Action> = this.dataPersistence.fetch(
    ProductActionTypes.SEARCH_PRODUCT,
    {
      run: (action: ProductActions.SearchProduct) => {
        return this.productService
          .getSearchProductList(
            action.payload.searchValue,
            action.payload.transactionType
          )
          .pipe(
            map(
              (data: SearchProductList[]) =>
                new ProductActions.SearchProductSuccess(data)
            )
          );
      },

      onError: (
        action: ProductActions.SearchProduct,
        error: HttpErrorResponse
      ) => {
        return new ProductActions.SearchProductFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() partialUpdateCashMemo$: Observable<
    Action
  > = this.dataPersistence.fetch(ProductActionTypes.PARTIAL_UPDATE_CASH_MEMO, {
    run: (action: ProductActions.PartialUpdateCashMemo) => {
      return this.productService
        .partialUpdateCashMemo(
          action.payload.id,
          action.payload.requestDetails,
          action.payload.txnType,
          action.payload.subTxnType
        )
        .pipe(
          map((data: CashMemoDetailsResponse) => {
            return new ProductActions.PartialUpdateCashMemoSuccess(data);
          })
        );
    },

    onError: (
      action: ProductActions.PartialUpdateCashMemo,
      error: HttpErrorResponse
    ) => {
      return new ProductActions.PartialUpdateCashMemoFailure(
        this.errorHandler(error)
      );
    }
  });

  @Effect() loadProductDetails$: Observable<
    Action
  > = this.dataPersistence.fetch(ProductActionTypes.LOAD_PRODUCT_DETAILS, {
    run: (action: ProductActions.LoadProductDetails) => {
      return this.productService
        .getProductDetails(action.payload.itemCode, action.payload.lotNumber)
        .pipe(
          map(
            (data: ProductDetails[]) =>
              new ProductActions.LoadProductDetailsSuccess(data)
          )
        );
    },

    onError: (
      action: ProductActions.LoadProductDetails,
      error: HttpErrorResponse
    ) => {
      return new ProductActions.LoadProductDetailsFailure(
        this.errorHandler(error)
      );
    }
  });

  @Effect() loadRSODetails$: Observable<Action> = this.dataPersistence.fetch(
    ProductActionTypes.LOAD_RSO_DETAILS,
    {
      run: (action: ProductActions.LoadRSODetails) => {
        return this.storeUserDataService
          .getStoreUsers(
            null,
            null,
            null,
            action.locationCodes ? [action.locationCodes] : null,
            [action.payload]
          )
          .pipe(
            map((data: StoreUser[]) => {
              const empNames: RsoDetailsPayload[] = [];
              for (const employee of data) {
                empNames.push({
                  code: employee.employeeCode,
                  name: employee.empName
                });
              }
              return new ProductActions.LoadRSODetailsSuccess(empNames);
            })
          );
      },

      onError: (
        action: ProductActions.LoadRSODetails,
        error: HttpErrorResponse
      ) => {
        return new ProductActions.LoadRSODetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadReasons$: Observable<Action> = this.dataPersistence.fetch(
    ProductActionTypes.LOAD_REASONS,
    {
      run: (action: ProductActions.LoadReasons) => {
        return this.lovDataService.getEngineProductLovs(action.payload).pipe(
          map((data: Lov[]) => {
            const reasons: string[] = [];
            for (const reason of data) {
              reasons.push(reason.value);
            }
            return new ProductActions.LoadReasonsSuccess(reasons);
          })
        );
      },

      onError: (
        action: ProductActions.LoadReasons,
        error: HttpErrorResponse
      ) => {
        return new ProductActions.LoadReasonsFailure(this.errorHandler(error));
      }
    }
  );

  @Effect() validateProductAndPriceDetails$: Observable<
    Action
  > = this.dataPersistence.fetch(
    ProductActionTypes.VALIDATE_PRODUCT_AND_PRICE_DETAILS,
    {
      run: (action: ProductActions.ValidateProductAndPriceDetails) => {
        return this.productService
          .validateProductAndPriceDetails(
            action.payload.inventoryId,
            action.payload.orderPriceRequest,
            action.payload.productDetails,
            action.payload.availableLotNumbers,
            action.payload.txnDetails,
            action.payload.isABInvoked
          )
          .pipe(
            map((data: ProductPriceDetails) => {
              return new ProductActions.ValidateProductAndPriceDetailsSuccess(
                data
              );
            })
          );
      },

      onError: (
        action: ProductActions.ValidateProductAndPriceDetails,
        error: HttpErrorResponse
      ) => {
        return new ProductActions.ValidateProductAndPriceDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadTaxDetails$: Observable<Action> = this.dataPersistence.fetch(
    ProductActionTypes.LOAD_TAX_DETAILS,
    {
      run: (action: ProductActions.LoadTaxDetails) => {
        return this.productService
          .getTaxDetails(
            action.payload.customerId,
            action.payload.itemCode,
            action.payload.txnType,
            action.payload?.isIGST
          )
          .pipe(
            map((data: CashMemoTaxDetails) => {
              return new ProductActions.LoadTaxDetailsSuccess(data);
            })
          );
      },

      onError: (
        action: ProductActions.LoadTaxDetails,
        error: HttpErrorResponse
      ) => {
        return new ProductActions.LoadTaxDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() addItemToCashMemo$: Observable<Action> = this.dataPersistence.fetch(
    ProductActionTypes.ADD_ITEM_TO_CASH_MEMO,
    {
      run: (action: ProductActions.AddItemtoCashMemo) => {
        return this.productService
          .addItemToCashMemo(
            action.payload.id,
            action.payload.itemDetails,
            action.payload.availableLotNumbers,
            action.payload.productDetails,
            action.payload.txnType,
            action.payload.subTxnType,
            action.payload?.isIGST
          )
          .pipe(
            map((data: CashMemoItemDetailsResponse[]) => {
              return new ProductActions.AddItemtoCashMemoSuccess(data);
            })
          );
      },

      onError: (
        action: ProductActions.AddItemtoCashMemo,
        error: HttpErrorResponse
      ) => {
        return new ProductActions.AddItemtoCashMemoFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() getItemToCashMemo$: Observable<Action> = this.dataPersistence.fetch(
    ProductActionTypes.GET_ITEM_FROM_CASH_MEMO,
    {
      run: (action: ProductActions.GetItemfromCashMemo) => {
        return this.productService
          .getItemFromCashMemo(
            action.payload.id,
            action.payload.itemId,
            action.payload.headerData,
            action.payload.txnType,
            action.payload.subTxnType,
            action.payload.loadHeaderInfo
          )
          .pipe(
            map((data: any) => {
              return new ProductActions.GetItemfromCashMemoSuccess(
                data,
                action.payload.isAddItem,
                action.payload.loadAutoDiscounts
              );
            })
          );
      },

      onError: (
        action: ProductActions.GetItemfromCashMemo,
        error: HttpErrorResponse
      ) => {
        return new ProductActions.GetItemfromCashMemoFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() partialUpdateItemInCashMemo$: Observable<
    Action
  > = this.dataPersistence.fetch(
    ProductActionTypes.PARTIAL_UPDATE_ITEM_IN_CASH_MEMO,
    {
      run: (action: ProductActions.PartialUpdateIteminCashMemo) => {
        return this.productService
          .partialUpdateItemInCashMemo(
            action.payload.id,
            action.payload.itemDetails,
            action.payload.itemId,
            action.payload.availableLotNumbers,
            action.payload.productDetails,
            action.payload.txnType,
            action.payload.subTxnType,
            action.payload.isIGST
          )
          .pipe(
            map((data: CashMemoItemDetailsResponse[]) => {
              return new ProductActions.PartialUpdateIteminCashMemoSuccess(
                data
              );
            })
          );
      },

      onError: (
        action: ProductActions.PartialUpdateIteminCashMemo,
        error: HttpErrorResponse
      ) => {
        return new ProductActions.PartialUpdateIteminCashMemoFailure({
          error: this.errorHandler(error),
          oldData: action.payload.oldData
        });
      }
    }
  );

  @Effect() updateItemInCashMemo$: Observable<
    Action
  > = this.dataPersistence.fetch(ProductActionTypes.UPDATE_ITEM_IN_CASH_MEMO, {
    run: (action: ProductActions.UpdateIteminCashMemo) => {
      return this.productService
        .updateItemInCashMemo(
          action.payload.id,
          action.payload.itemDetails,
          action.payload.itemId,
          action.payload.availableLotNumbers,
          action.payload.productDetails,
          action.payload.txnType,
          action.payload.subTxnType,
          action.payload.removeFromOrder,
          action.payload.isIGST
        )
        .pipe(
          map((data: CashMemoItemDetailsResponse[]) => {
            return new ProductActions.UpdateIteminCashMemoSuccess(data);
          })
        );
    },

    onError: (
      action: ProductActions.UpdateIteminCashMemo,
      error: HttpErrorResponse
    ) => {
      return new ProductActions.UpdateIteminCashMemoFailure({
        error: this.errorHandler(error),
        oldData: action.payload.oldData
      });
    }
  });

  @Effect() deleteItemFromCashMemo$: Observable<
    Action
  > = this.dataPersistence.fetch(
    ProductActionTypes.DELETE_ITEM_FROM_CASH_MEMO,
    {
      run: (action: ProductActions.DeleteItemfromCashMemo) => {
        return this.productService
          .deleteItemFromCashMemo(
            action.payload.id,
            action.payload.itemId,
            action.payload.txnType,
            action.payload.subTxnType,
            action.payload.removeFromOrder
          )
          .pipe(
            map((data: CashMemoItemDetailsResponse) => {
              return new ProductActions.DeleteItemfromCashMemoSuccess({
                itemId: action.payload.itemId,
                data: data,
                itemDetails: action.payload.itemDetails
              });
            })
          );
      },

      onError: (
        action: ProductActions.DeleteItemfromCashMemo,
        error: HttpErrorResponse
      ) => {
        return new ProductActions.DeleteItemfromCashMemoFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  validateItem$ = this.dataPersistence.fetch(ProductActionTypes.VALIDATE_ITEM, {
    run: (action: ProductActions.ValidateItem) => {
      return this.inventoryValidationService
        .validateWeightTolerance(
          action.payload.productGroupCode,
          action.payload.availableWeight,
          action.payload.measuredWeight,
          action.payload.measuredQuantity,
          action.payload.availableQuantity
        )
        .pipe(
          map(
            () =>
              new ProductActions.ValidateItemSuccess({
                itemId: action.payload.itemId,
                isSuccess: true
              })
          )
        );
    },

    onError: (
      action: ProductActions.ValidateItem,
      error: HttpErrorResponse
    ) => {
      const err = CustomErrorAdaptor.fromJson(error);
      if (err.code === ErrorEnums.ERR_INV_028) {
        return new ProductActions.ValidateItemSuccess({
          itemId: action.payload.itemId,
          isSuccess: false,
          toleranceLimit: err.errorCause
        });
      } else {
        return new ProductActions.ValidateItemFailure({
          itemId: action.payload.itemId,
          error: this.errorHandler(error)
        });
      }
    }
  });

  @Effect() loadCoinDetails$: Observable<Action> = this.dataPersistence.fetch(
    ProductActionTypes.LOAD_COIN_DETAILS,
    {
      run: (action: ProductActions.LoadCoinDetails) => {
        return this.productService
          .getCoinDetails(
            action.payload.itemCode,
            action.payload.withSaleableCheck
          )
          .pipe(
            map(
              (data: CoinDetails[]) =>
                new ProductActions.LoadCoinDetailsSuccess({
                  itemCode: action.payload.itemCode,
                  coinDetails: data
                })
            )
          );
      },

      onError: (
        action: ProductActions.LoadCoinDetails,
        error: HttpErrorResponse
      ) => {
        return new ProductActions.LoadCoinDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadPriceDetails$: Observable<Action> = this.dataPersistence.fetch(
    ProductActionTypes.LOAD_PRICE_DETAILS,
    {
      run: (action: ProductActions.LoadPriceDetails) => {
        return this.productService
          .getPriceDetails(action.payload)
          .pipe(
            map(
              (data: ProductPriceDetails) =>
                new ProductActions.LoadPriceDetailsSuccess(data)
            )
          );
      },

      onError: (
        action: ProductActions.LoadPriceDetails,
        error: HttpErrorResponse
      ) => {
        return new ProductActions.LoadPriceDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() getItemDetails$: Observable<Action> = this.dataPersistence.fetch(
    ProductActionTypes.GET_ITEM_DETAILS,
    {
      run: (action: ProductActions.GetItemDetails) => {
        return this.productService
          .getItemFromCashMemo(
            action.payload.id,
            action.payload.itemId,
            action.payload.headerData,
            action.payload.txnType,
            action.payload.subTxnType
          )
          .pipe(
            map((data: CashMemoItemDetailsResponse[]) => {
              return new ProductActions.GetItemDetailsSuccess(data);
            })
          );
      },

      onError: (
        action: ProductActions.GetItemDetails,
        error: HttpErrorResponse
      ) => {
        return new ProductActions.GetItemDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() deleteItemDetails$: Observable<Action> = this.dataPersistence.fetch(
    ProductActionTypes.DELETE_ITEM_DETAILS,
    {
      run: (action: ProductActions.DeleteItemDetails) => {
        return this.productService
          .deleteItemDetails(
            action.payload.id,
            action.payload.itemId,
            action.payload.txnType,
            action.payload.subTxnType,
            action.payload.cashMemoId
          )
          .pipe(
            map((data: CashMemoItemDetailsResponse) => {
              return new ProductActions.DeleteItemDetailsSuccess({
                itemId: action.payload.itemId,
                data: data,
                itemDetails: action.payload.itemDetails
              });
            })
          );
      },

      onError: (
        action: ProductActions.DeleteItemDetails,
        error: HttpErrorResponse
      ) => {
        return new ProductActions.DeleteItemDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadValidCoinDetails$: Observable<
    Action
  > = this.dataPersistence.fetch(ProductActionTypes.LOAD_VALID_COIN_DETAILS, {
    run: (action: ProductActions.LoadValidCoinDetails) => {
      return this.productService
        .getCoinDetails(
          action.payload.itemCode,
          action.payload.withSaleableCheck
        )
        .pipe(
          map(
            (data: CoinDetails[]) =>
              new ProductActions.LoadValidCoinDetailsSuccess({
                itemCode: action.payload.itemCode,
                coinDetails: data
              })
          )
        );
    },

    onError: (
      action: ProductActions.LoadValidCoinDetails,
      error: HttpErrorResponse
    ) => {
      return new ProductActions.LoadValidCoinDetailsFailure(
        this.errorHandler(error)
      );
    }
  });

  @Effect()
  LoadCreditNoteDetails$: Observable<Action> = this.dataPersistence.fetch(
    ProductActionTypes.LOAD_CREDIT_NOTE_DETAILS,
    {
      run: (action: ProductActions.LoadCreditNoteDetails) => {
        return this.productService
          .getCndetailsByCnType(action.payload)
          .pipe(
            map(
              (cnDetails: CNDetailsResponsePayload[]) =>
                new ProductActions.LoadCreditNoteDetailsSuccess(cnDetails)
            )
          );
      },
      onError: (
        action: ProductActions.LoadCreditNoteDetails,
        error: HttpErrorResponse
      ) => {
        return new ProductActions.LoadCreditNoteDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  // CO

  @Effect() addItemToCO$: Observable<Action> = this.dataPersistence.fetch(
    ProductActionTypes.ADD_ITEM_TO_CO,
    {
      run: (action: ProductActions.AddItemtoCO) => {
        return this.productService
          .addItemToCO(
            action.payload.id,
            action.payload.txnType,
            action.payload.subTxnType,
            action.payload.itemDetails
          )
          .pipe(
            map((data: COItemDetailsResponse[]) => {
              return new ProductActions.AddItemtoCOSuccess(data);
            })
          );
      },

      onError: (
        action: ProductActions.AddItemtoCO,
        error: HttpErrorResponse
      ) => {
        return new ProductActions.AddItemtoCOFailure(this.errorHandler(error));
      }
    }
  );

  @Effect() getItemToCO$: Observable<Action> = this.dataPersistence.fetch(
    ProductActionTypes.GET_ITEM_FROM_CO,
    {
      run: (action: ProductActions.GetItemfromCO) => {
        return this.productService
          .getItemFromCO(
            action.payload.id,
            action.payload.txnType,
            action.payload.subTxnType,
            action.payload.itemId,
            action.payload.headerData,
            action.payload.loadHeaderInfo
          )
          .pipe(
            map((data: COItemDetailsResponse[]) => {
              return new ProductActions.GetItemfromCOSuccess(
                data,
                action.payload.isAddItem
              );
            })
          );
      },

      onError: (
        action: ProductActions.GetItemfromCO,
        error: HttpErrorResponse
      ) => {
        return new ProductActions.GetItemfromCOFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() partialUpdateItemInCO$: Observable<
    Action
  > = this.dataPersistence.fetch(ProductActionTypes.PARTIAL_UPDATE_ITEM_IN_CO, {
    run: (action: ProductActions.PartialUpdateIteminCO) => {
      return this.productService
        .partialUpdateItemInCO(
          action.payload.id,
          action.payload.txnType,
          action.payload.subTxnType,
          action.payload.itemId,
          action.payload.itemDetails
        )
        .pipe(
          map((data: COItemDetailsResponse[]) => {
            return new ProductActions.PartialUpdateIteminCOSuccess(data);
          })
        );
    },

    onError: (
      action: ProductActions.PartialUpdateIteminCO,
      error: HttpErrorResponse
    ) => {
      return new ProductActions.PartialUpdateIteminCOFailure({
        error: this.errorHandler(error),
        oldData: action.payload.oldData
      });
    }
  });

  @Effect() updateItemInCO$: Observable<Action> = this.dataPersistence.fetch(
    ProductActionTypes.UPDATE_ITEM_IN_CO,
    {
      run: (action: ProductActions.UpdateIteminCO) => {
        return this.productService
          .updateItemInCO(
            action.payload.id,
            action.payload.txnType,
            action.payload.subTxnType,
            action.payload.itemId,
            action.payload.itemDetails
          )
          .pipe(
            map((data: COItemDetailsResponse[]) => {
              return new ProductActions.UpdateIteminCOSuccess(data);
            })
          );
      },

      onError: (
        action: ProductActions.UpdateIteminCO,
        error: HttpErrorResponse
      ) => {
        return new ProductActions.UpdateIteminCOFailure({
          error: this.errorHandler(error),
          oldData: action.payload.oldData
        });
      }
    }
  );

  @Effect() deleteItemFromCO$: Observable<Action> = this.dataPersistence.fetch(
    ProductActionTypes.DELETE_ITEM_FROM_CO,
    {
      run: (action: ProductActions.DeleteItemfromCO) => {
        return this.productService
          .deleteItemFromCO(
            action.payload.id,
            action.payload.txnType,
            action.payload.subTxnType,
            action.payload.itemId
          )
          .pipe(
            map((data: COItemDetailsResponse) => {
              return new ProductActions.DeleteItemfromCOSuccess({
                itemId: action.payload.itemId,
                data: data,
                itemDetails: action.payload.itemDetails
              });
            })
          );
      },

      onError: (
        action: ProductActions.DeleteItemfromCO,
        error: HttpErrorResponse
      ) => {
        return new ProductActions.DeleteItemfromCOFailure(
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
