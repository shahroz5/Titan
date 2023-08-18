import {
  DiscountsList,
  FileUploadLists,
  GepInitResponse,
  GEPSearchResponse,
  totalBreakUp,
  CustomErrors
} from '@poss-web/shared/models';

import {
  GepActionsTypes
} from './gep.actions';
import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/angular';

import { map } from 'rxjs/operators';
import { GepState } from './gep.state';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';

import * as gepActions from './gep.actions';
import { GepService } from '../gep.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { LoggerService } from '@poss-web/shared/util-logger';

@Injectable()
export class GepEffects {
  constructor(
    private dataPersistence: DataPersistence<GepState>,
    private gepService: GepService,
    private loggerService: LoggerService
  ) {}
  @Effect() gepInit$: Observable<Action> = this.dataPersistence.fetch(
    GepActionsTypes.GEP_INIT,
    {
      run: (action: gepActions.GepInit) => {
        return this.gepService
          .getGepInit(action.payload)
          .pipe(
            map((data: GepInitResponse) => new gepActions.GepInitSuccess(data))
          );
      },

      onError: (action: gepActions.GepInit, error: HttpErrorResponse) => {
        return new gepActions.GepInitFailure(this.errorHandler(error));
      }
    }
  );

  @Effect() updateGepItem$: Observable<Action> = this.dataPersistence.fetch(
    GepActionsTypes.UPDATE_GEP_ITEM,
    {
      run: (action: gepActions.UpdateITEM) => {
        return this.gepService
          .putGepItem(action.payload)
          .pipe(map((data: any) => new gepActions.UpdateITEMSuccess(data)));
      },

      onError: (action: gepActions.UpdateITEM, error: HttpErrorResponse) => {
        return new gepActions.UpdateITEMFailure({
          error: this.errorHandler(error),
          data: action.payload.errorData
        });
      }
    }
  );

  @Effect() updatePrice$: Observable<Action> = this.dataPersistence.fetch(
    GepActionsTypes.UPDATE_PRICE,
    {
      run: (action: gepActions.UpdatePrice) => {
        return this.gepService
          .updatePrice(action.payload)
          .pipe(map((data: any) => new gepActions.UpdatePriceSuccess(data)));
      },

      onError: (action: gepActions.UpdatePrice, error: HttpErrorResponse) => {
        return new gepActions.UpdatePriceFailure(this.errorHandler(error));
      }
    }
  );

  @Effect() getGepItem$: Observable<Action> = this.dataPersistence.fetch(
    GepActionsTypes.GET_GEP_ITEM,
    {
      run: (action: gepActions.GetGepITEM) => {
        return this.gepService
          .getGepItem(action.payload)
          .pipe(map((data: any) => new gepActions.GetGepITEMSuccess(data)));
      },

      onError: (action: gepActions.GetGepITEM, error: HttpErrorResponse) => {
        return new gepActions.GetGepITEMFailure(this.errorHandler(error));
      }
    }
  );

  @Effect() gepReponse$: Observable<Action> = this.dataPersistence.fetch(
    GepActionsTypes.POST_GEP_ITEMS,
    {
      run: (action: gepActions.PostGepItems) => {
        return this.gepService.postGepResponse(action.payload).pipe(
          map(
            (data: any) =>
              new gepActions.PostGepItemsSuccess({
                id: action.payload.tempId,
                res: data
              })
          )
        );
      },

      onError: (action: gepActions.PostGepItems, error: HttpErrorResponse) => {
        return new gepActions.PostGepItemsFailure(this.errorHandler(error));
      }
    }
  );

  @Effect() holdConfirm$: Observable<Action> = this.dataPersistence.fetch(
    GepActionsTypes.GEP_HOLD_CONFIRM,
    {
      run: (action: gepActions.HoldConfirm) => {
        return this.gepService
          .holdConfirm(action.payload)
          .pipe(map((data: any) => new gepActions.HoldConfirmSuccess(data)));
      },

      onError: (action: gepActions.HoldConfirm, error: HttpErrorResponse) => {
        return new gepActions.HoldConfirmFailure(this.errorHandler(error));
      }
    }
  );

  @Effect() patchRso$: Observable<Action> = this.dataPersistence.fetch(
    GepActionsTypes.UPDATE_RSO,
    {
      run: (action: gepActions.PostRSO) => {
        return this.gepService
          .patchRso(action.payload)
          .pipe(map((data: any) => new gepActions.PostRSOSuccess({
            data: data, 
            isCustomerUpdate: action.payload?.isCustomerUpdate ? action.payload.isCustomerUpdate : null
          })));
      },

      onError: (action: gepActions.PostRSO, error: HttpErrorResponse) => {
        return new gepActions.PostRSOFailure(this.errorHandler(error));
      }
    }
  );

  @Effect() delete$: Observable<Action> = this.dataPersistence.fetch(
    GepActionsTypes.DELETE,
    {
      run: (action: gepActions.Delete) => {
        return this.gepService
          .delete(action.payload)
          .pipe(
            map(
              (data: any) => new gepActions.DeleteSuccess(action.payload.itemId)
            )
          );
      },

      onError: (action: gepActions.Delete, error: HttpErrorResponse) => {
        return new gepActions.DeleteFailure(this.errorHandler(error));
      }
    }
  );

  @Effect() gepItem$: Observable<Action> = this.dataPersistence.fetch(
    GepActionsTypes.LOAD_GEP_ITEM,
    {
      run: (action: gepActions.LoadGepItem) => {
        if (action.payload.status === 'price_update') {
          return this.gepService
            .getGepItemDetails(action.payload)
            .pipe(
              map((data: any) => new gepActions.LoadGepItemPriceSuccess(data))
            );
        } else {
          return this.gepService
            .getGepItemDetails(action.payload)
            .pipe(map((data: any) => new gepActions.LoadGepItemSuccess(data)));
        }
      },

      onError: (action: gepActions.LoadGepItem, error: HttpErrorResponse) => {
        return new gepActions.LoadGepItemFailure(this.errorHandler(error));
      }
    }
  );

  @Effect() deleteGep$: Observable<Action> = this.dataPersistence.fetch(
    GepActionsTypes.DELETE_GEP,
    {
      run: (action: gepActions.DeleteGepITEM) => {
        return this.gepService
          .deleteGep(action.payload)
          .pipe(map((data: any) => new gepActions.DeleteITEMSuccess(data)));
      },

      onError: (action: gepActions.DeleteGepITEM, error: HttpErrorResponse) => {
        return new gepActions.DeleteITEMFailure(this.errorHandler(error));
      }
    }
  );

  @Effect() loadCancel$: Observable<Action> = this.dataPersistence.fetch(
    GepActionsTypes.LOAD_CANCEL_GEP,
    {
      run: (action: gepActions.LoadCancelGep) => {
        console.log('in effects');
        return this.gepService
          .loadCancel(action.payload)
          .pipe(map((data: any) => new gepActions.LoadCancelGepSuccess(data)));
      },

      onError: (action: gepActions.LoadCancelGep, error: HttpErrorResponse) => {
        return new gepActions.LoadCancelGepFailure(this.errorHandler(error));
      }
    }
  );

  @Effect() loadOnHold$: Observable<Action> = this.dataPersistence.fetch(
    GepActionsTypes.LOAD_ON_HOLD,
    {
      run: (action: gepActions.LoadOnHold) => {
        return this.gepService
          .loadOnHold(action.payload)
          .pipe(map((data: any) => new gepActions.LoadOnHoldSuccess(data)));
      },

      onError: (action: gepActions.LoadOnHold, error: HttpErrorResponse) => {
        return new gepActions.LoadOnHoldFailure(this.errorHandler(error));
      }
    }
  );

  @Effect() saveCancel$: Observable<Action> = this.dataPersistence.fetch(
    GepActionsTypes.SAVE_CANCEL_GEP,
    {
      run: (action: gepActions.SaveCanceleGep) => {
        return this.gepService
          .saveCancel(action.payload)
          .pipe(map((data: any) => new gepActions.SaveCanceleGepSuccess(data)));
      },

      onError: (
        action: gepActions.SaveCanceleGep,
        error: HttpErrorResponse
      ) => {
        return new gepActions.SaveCanceleGepFailure(this.errorHandler(error));
      }
    }
  );

  @Effect() countGep$: Observable<Action> = this.dataPersistence.fetch(
    GepActionsTypes.COUNT_ON_HOLD,
    {
      run: (action: gepActions.LoadCountOnHoLd) => {
        return this.gepService
          .countGep(action.payload)
          .pipe(
            map((data: any) => new gepActions.LoadCountOnHoLdSuccess(data))
          );
      },

      onError: (
        action: gepActions.LoadCountOnHoLd,
        error: HttpErrorResponse
      ) => {
        return new gepActions.LoadCountOnHoLdFailure(this.errorHandler(error));
      }
    }
  );

  @Effect() upload$: Observable<Action> = this.dataPersistence.fetch(
    GepActionsTypes.IMAGE_UPLOAD,
    {
      run: (action: gepActions.ImageUpload) => {
        console.log('eeff');
        return this.gepService
          .upload(action.payload)
          .pipe(
            map((data: boolean) => new gepActions.ImageUploadSuccess(data))
          );
      },

      onError: (action: gepActions.ImageUpload, error: HttpErrorResponse) => {
        return new gepActions.ImageUploadFailure(this.errorHandler(error));
      }
    }
  );

  @Effect() totalValueBreakUp$: Observable<Action> = this.dataPersistence.fetch(
    GepActionsTypes.GEP_TOTAL_VALUE,
    {
      run: (action: gepActions.TotalValueBreakUp) => {
        return this.gepService.postTotalBreakUp(action.payload).pipe(
          map(
            (data: totalBreakUp) =>
              new gepActions.TotalValueBreakUpSuccess({
                data: action.payload,
                totalBreakUp: data
              })
          )
        );
      },

      onError: (
        action: gepActions.TotalValueBreakUp,
        error: HttpErrorResponse
      ) => {
        return new gepActions.TotalValueBreakupFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() metalPrice$: Observable<Action> = this.dataPersistence.fetch(
    GepActionsTypes.GEP_METAL_PRICE,
    {
      run: (action: gepActions.GepMetalRate) => {
        return this.gepService
          .metalPrice(action.payload)
          .pipe(map((data: any) => new gepActions.GepMetalRateSuccess(data)));
      },

      onError: (action: gepActions.GepMetalRate, error: HttpErrorResponse) => {
        return new gepActions.GepMetalRateFailure(this.errorHandler(error));
      }
    }
  );

  @Effect() metal$: Observable<Action> = this.dataPersistence.fetch(
    GepActionsTypes.LOAD_METAL,
    {
      run: (action: gepActions.LoadMetal) => {
        return this.gepService
          .metalType(action.payload)
          .pipe(map((data: any) => new gepActions.LoadMetalSuccess(data)));
      },

      onError: (action: gepActions.LoadMetal, error: HttpErrorResponse) => {
        return new gepActions.LoadMetalFailure(this.errorHandler(error));
      }
    }
  );

  @Effect() item$: Observable<Action> = this.dataPersistence.fetch(
    GepActionsTypes.LOAD_ITEM,
    {
      run: (action: gepActions.LoadITEM) => {
        return this.gepService
          .itemType(action.payload)
          .pipe(map((data: any) => new gepActions.LoadITEMSuccess(data)));
      },

      onError: (action: gepActions.LoadITEM, error: HttpErrorResponse) => {
        return new gepActions.LoadITEMFailure(this.errorHandler(error));
      }
    }
  );

  @Effect() getFileUploadList$: Observable<Action> = this.dataPersistence.fetch(
    GepActionsTypes.FILE_UPLOAD_LIST,
    {
      run: (action: gepActions.FileUploadList) => {
        return this.gepService
          .uploadFileList(action.payload)
          .pipe(
            map(
              (data: FileUploadLists[]) =>
                new gepActions.FileUploadListSuccess(data)
            )
          );
      },

      onError: (
        action: gepActions.FileUploadList,
        error: HttpErrorResponse
      ) => {
        return new gepActions.FileUploadListFailure(this.errorHandler(error));
      }
    }
  );

  @Effect() getFileDownload$: Observable<Action> = this.dataPersistence.fetch(
    GepActionsTypes.FILE_DOWNLOAD_URL,
    {
      run: (action: gepActions.FileDownloadUrl) => {
        return this.gepService
          .downloadFile(action.payload)
          .pipe(
            map((data: any) => new gepActions.FileDownloadUrlSuccess(data))
          );
      },

      onError: (
        action: gepActions.FileDownloadUrl,
        error: HttpErrorResponse
      ) => {
        return new gepActions.FileDownloadUrlFailure(this.errorHandler(error));
      }
    }
  );

  @Effect() GepHistory$: Observable<Action> = this.dataPersistence.fetch(
    GepActionsTypes.LOAD_GEP_HISTORY,
    {
      run: (action: gepActions.LoadGEPHistory) => {
        return this.gepService
          .getHistoryItems(
            action.payload,
            action.searchField,
            action.searchType,
            action.status,
            action.page,
            action.size,
            action.txnType,
            action.subTxnType
          )
          .pipe(
            map(
              (data: GEPSearchResponse) =>
                new gepActions.LoadGEPHistorySuccess(data)
            )
          );
      },
      onError: (
        action: gepActions.LoadGEPHistory,
        error: HttpErrorResponse
      ) => {
        return new gepActions.LoadGEPHistoryFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() viewGEP$: Observable<Action> = this.dataPersistence.fetch(
    GepActionsTypes.VIEW_GEP,
    {
      run: (action: gepActions.ViewGEP) => {
        return this.gepService
          .getGEPTransactionDetails(
            action.payload,
            action.subTxnType
            )
          .pipe(
            map(
              (data: any) =>
                new gepActions.ViewGEPSuccess(data)));
      },
      onError: (
        action: gepActions.ViewGEP,
        error: HttpErrorResponse
        ) => {
        return new gepActions.ViewGEPFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadAvailableDiscounts$: Observable<
    Action
  > = this.dataPersistence.fetch(GepActionsTypes.LOAD_AVAILABLE_DISCOUNTS_LIST, {
    run: (action: gepActions.LoadAvailableDiscountsList) => {
      return this.gepService
        .getAvailableDiscounts(action.payload)
        .pipe(
          map(
            (data: DiscountsList[]) =>
              new gepActions.LoadAvailableDiscountsListSuccess(data)
          )
        );
    },
    onError: (
      action: gepActions.LoadAvailableDiscountsList,
      error: HttpErrorResponse
    ) => {
      return new gepActions.LoadAvailableDiscountsListFailure(
        this.errorHandler(error)
      );
    }
  });

  errorHandler(error: HttpErrorResponse): CustomErrors {
    const customError: CustomErrors = CustomErrorAdaptor.fromJson(error);
    this.loggerService.error(customError);
    return customError;
  }
}
