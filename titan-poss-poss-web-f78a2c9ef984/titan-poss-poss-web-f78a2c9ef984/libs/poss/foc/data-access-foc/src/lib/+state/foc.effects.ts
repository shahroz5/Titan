import { Injectable } from '@angular/core';
import { DataPersistence } from '@nrwl/angular';
import { HttpErrorResponse } from '@angular/common/http';
import {
  CustomErrors,
  PendingCMResponsePayload,
  AvailableSchemesPayload,
  PendingFocSchemesResponsePayload
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { LoggerService } from '@poss-web/shared/util-logger';
import { FocState } from './foc.state';
import { Effect } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';

import * as focActions from './foc.actions';
import { FocService } from '../foc.service';
import { map } from 'rxjs/operators';

@Injectable()
export class FocEffects {
  constructor(
    private dataPersistence: DataPersistence<FocState>,
    private loggerService: LoggerService,
    private focService: FocService
  ) {}

  @Effect()
  loadPendingCM$: Observable<Action> = this.dataPersistence.fetch(
    focActions.FocActionTypes.LOAD_PENDING_FOC_CM,
    {
      run: (action: focActions.LoadPendingFocCM) => {
        return this.focService
          .getPendingCM(action.payload)
          .pipe(
            map(
              (data: PendingCMResponsePayload[]) =>
                new focActions.LoadPendingFocCMSuccess(data)
            )
          );
      },
      onError: (
        action: focActions.LoadPendingFocCM,
        error: HttpErrorResponse
      ) => {
        return new focActions.LoadPendingFocCMFailure(this.errorHandler(error));
      }
    }
  );

  @Effect()
  loadPendingFocScheme$: Observable<Action> = this.dataPersistence.fetch(
    focActions.FocActionTypes.LOAD_PENDING_FOC_SCHEME,
    {
      run: (action: focActions.LoadPendingFocScheme) => {
        return this.focService
          .getFocSchemes(
            action.payload.id,
            action.payload.subTxnType,
            action.payload.txnType
          )
          .pipe(
            map(
              (data: PendingFocSchemesResponsePayload) =>
                new focActions.LoadPendingFocSchemeSuccess(data)
            )
          );
      },
      onError: (
        action: focActions.LoadPendingFocScheme,
        error: HttpErrorResponse
      ) => {
        return new focActions.LoadPendingFocSchemeFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadFocItemDetails$: Observable<Action> = this.dataPersistence.fetch(
    focActions.FocActionTypes.LOAD_FOC_ITEM_DETAILS,
    {
      run: (action: focActions.LoadFocItemDetails) => {
        return this.focService
          .getFocItemDetails(action.payload)
          .pipe(
            map((data: any) => new focActions.LoadFocItemDetailsSuccess(data))
          );
      },
      onError: (
        action: focActions.LoadFocItemDetails,
        error: HttpErrorResponse
      ) => {
        return new focActions.LoadFocItemDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadManualFocItemDetails$: Observable<Action> = this.dataPersistence.fetch(
    focActions.FocActionTypes.LOAD_MANUAL_FOC_ITEM_DETAILS,
    {
      run: (action: focActions.LoadManualFocItemDetails) => {
        return this.focService
          .getFocItemDetails(action.payload)
          .pipe(
            map(
              (data: any) =>
                new focActions.LoadManualFocItemDetailsSuccess(data)
            )
          );
      },
      onError: (
        action: focActions.LoadManualFocItemDetails,
        error: HttpErrorResponse
      ) => {
        return new focActions.LoadManualFocItemDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  isManualFocValidated$: Observable<Action> = this.dataPersistence.fetch(
    focActions.FocActionTypes.VALIDATE_MANUAL_FOC,
    {
      run: (action: focActions.ValidateManualFoc) => {
        return this.focService
          .validateManualFoc(action.payload)
          .pipe(
            map((data: any) => new focActions.ValidateManualFocSuccess(data))
          );
      },
      onError: (
        action: focActions.ValidateManualFoc,
        error: HttpErrorResponse
      ) => {
        return new focActions.ValidateManualFocFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  isManualFocVefied$: Observable<Action> = this.dataPersistence.fetch(
    focActions.FocActionTypes.VERIFY_MANUAL_FOC,
    {
      run: (action: focActions.VerifyManualFoc) => {
        return this.focService
          .verifyManualFoc(action.payload)
          .pipe(map((data: any) => new focActions.VerifyManualFocSuccess()));
      },
      onError: (
        action: focActions.VerifyManualFoc,
        error: HttpErrorResponse
      ) => {
        return new focActions.VerifyManualFocFailure(this.errorHandler(error));
      }
    }
  );

  @Effect()
  issuePendingFOC$: Observable<Action> = this.dataPersistence.fetch(
    focActions.FocActionTypes.ISSUE_PENDING_FOC,
    {
      run: (action: focActions.IssuePendingFOC) => {
        return this.focService
          .issuePendingFOC(action.payload)
          .pipe(
            map((data: any) => new focActions.IssuePendingFOCSuccess(data))
          );
      },
      onError: (
        action: focActions.IssuePendingFOC,
        error: HttpErrorResponse
      ) => {
        return new focActions.IssuePendingFOCFailure(this.errorHandler(error));
      }
    }
  );

  @Effect()
  loadAvailableSchemes$: Observable<Action> = this.dataPersistence.fetch(
    focActions.FocActionTypes.LOAD_CONFIGURED_FOC_SCHEMES,
    {
      run: (action: focActions.LoadConfiguredFocSchemes) => {
        return this.focService.getConfiguredSchemes().pipe(
          map((schemes: AvailableSchemesPayload[]) => {
            const activeSchemes = [];
            schemes
              .filter(x => {
                if (x && x.isActive === true) {
                  return x;
                }
              })
              .forEach((x: AvailableSchemesPayload) => {
                activeSchemes.push({ ...x });
              });
            return new focActions.LoadConfiguredFocSchemesSuccess(
              activeSchemes
            );
          })
        );
      },
      onError: (
        action: focActions.LoadConfiguredFocSchemes,
        error: HttpErrorResponse
      ) => {
        return new focActions.LoadConfiguredFocSchemesFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  loadFocSchemesAndItems$: Observable<Action> = this.dataPersistence.fetch(
    focActions.FocActionTypes.LOAD_AVAILABLE_FOC_SCHEMES_AND_ITEMS,
    {
      run: (action: focActions.LoadFocSchemesAndItems) => {
        return this.focService
          .getSchemesAndItems(action.payload)
          .pipe(
            map(
              (data: any) => new focActions.LoadFocSchemesAndItemsSuccess(data)
            )
          );
      },
      onError: (
        action: focActions.LoadFocSchemesAndItems,
        error: HttpErrorResponse
      ) => {
        return new focActions.LoadFocSchemesAndItemsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadManualFocItems$: Observable<Action> = this.dataPersistence.fetch(
    focActions.FocActionTypes.LOAD_MANUAL_FOC_ITEMS,
    {
      run: (action: focActions.LoadManuaFocItems) => {
        return this.focService
          .getManualFocItem(action.payload)
          .pipe(
            map((data: any) => new focActions.LoadManuaFocItemsSuccess(data))
          );
      },
      onError: (
        action: focActions.LoadManuaFocItems,
        error: HttpErrorResponse
      ) => {
        return new focActions.LoadManuaFocItemsFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  addFocToCM$: Observable<Action> = this.dataPersistence.fetch(
    focActions.FocActionTypes.ADD_FOC_TO_CM,
    {
      run: (action: focActions.AddFocToCm) => {
        return this.focService
          .addFocToCM(action.payload)
          .pipe(map((data: any) => new focActions.AddFocToCmSuccess(data)));
      },
      onError: (action: focActions.AddFocToCm, error: HttpErrorResponse) => {
        return new focActions.AddFocToCmFailure(this.errorHandler(error));
      }
    }
  );

  @Effect()
  addManualFocToCM$: Observable<Action> = this.dataPersistence.fetch(
    focActions.FocActionTypes.ADD_MANUAL_FOC_TO_CM,
    {
      run: (action: focActions.AddManualFocToCm) => {
        return this.focService
          .addManualFocToCM(action.payload)
          .pipe(
            map((data: any) => new focActions.AddManualFocToCmSuccess(data))
          );
      },
      onError: (
        action: focActions.AddManualFocToCm,
        error: HttpErrorResponse
      ) => {
        return new focActions.AddManualFocToCmFailure(this.errorHandler(error));
      }
    }
  );

  @Effect()
  deleteManualFoc$: Observable<Action> = this.dataPersistence.fetch(
    focActions.FocActionTypes.DELETE_MANUAL_FOC_FROM_CM,
    {
      run: (action: focActions.DeleteManualFocFromCm) => {
        return this.focService
          .deleteFOC(
            action.payload.id,
            action.payload.subTxnType,
            action.payload.txnType
          )
          .pipe(
            map(
              (isSuccess: boolean) =>
                new focActions.DeleteManualFocFromCmSuccess(isSuccess)
            )
          );
      },
      onError: (
        action: focActions.DeleteManualFocFromCm,
        error: HttpErrorResponse
      ) => {
        return new focActions.DeleteManualFocFromCmFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  deleteFoc$: Observable<Action> = this.dataPersistence.fetch(
    focActions.FocActionTypes.DELETE_FOC_FROM_CM,
    {
      run: (action: focActions.DeleteFocFromCm) => {
        return this.focService
          .deleteFOC(
            action.payload.id,
            action.payload.subTxnType,
            action.payload.txnType
          )
          .pipe(
            map(
              (isSuccess: boolean) =>
                new focActions.DeleteFocFromCmSuccess(isSuccess)
            )
          );
      },
      onError: (
        action: focActions.DeleteFocFromCm,
        error: HttpErrorResponse
      ) => {
        return new focActions.DeleteFocFromCmFailure(this.errorHandler(error));
      }
    }
  );

  @Effect()
  getAssignedFoc$: Observable<Action> = this.dataPersistence.fetch(
    focActions.FocActionTypes.GET_FOC_ASSIGNED_TO_CM,
    {
      run: (action: focActions.GetFocAssignedToCm) => {
        return this.focService
          .getAssignedFOC(
            action.payload.id,
            action.payload.subTxnType,
            action.payload.txnType
          )
          .pipe(
            map((data: any) => new focActions.GetFocAssignedToCmSuccess(data))
          );
      },
      onError: (
        action: focActions.GetFocAssignedToCm,
        error: HttpErrorResponse
      ) => {
        return new focActions.GetFocAssignedToCmFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  getAssignedManualFoc$: Observable<Action> = this.dataPersistence.fetch(
    focActions.FocActionTypes.GET_MANUAL_FOC_ASSIGNED_TO_CM,
    {
      run: (action: focActions.GetManualFocAssignedToCm) => {
        return this.focService
          .getAssignedManualFOC(
            action.payload.id,
            action.payload.subTxnType,
            action.payload.txnType
          )
          .pipe(
            map(
              (data: any) =>
                new focActions.GetManualFocAssignedToCmSuccess(data)
            )
          );
      },
      onError: (
        action: focActions.GetManualFocAssignedToCm,
        error: HttpErrorResponse
      ) => {
        return new focActions.GetManualFocAssignedToCmFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  keepFocPending$: Observable<Action> = this.dataPersistence.fetch(
    focActions.FocActionTypes.KEEP_FOC_PENDING,
    {
      run: (action: focActions.KeepFocPending) => {
        return this.focService
          .keepFocPending(action.payload)
          .pipe(map((data: any) => new focActions.KeepFocPendingSuccess(data)));
      },
      onError: (
        action: focActions.KeepFocPending,
        error: HttpErrorResponse
      ) => {
        return new focActions.KeepFocPendingFailure(this.errorHandler(error));
      }
    }
  );

  @Effect()
  loadFocSchemesForItems$: Observable<Action> = this.dataPersistence.fetch(
    focActions.FocActionTypes.LOAD_FOC_SCHEME_ITEMS,
    {
      run: (action: focActions.LoadFocSchemesForItems) => {
        return this.focService
          .getSchemesAndItems(action.payload)
          .pipe(
            map(
              (data: any) => new focActions.LoadFocSchemesForItemsSuccess(data)
            )
          );
      },
      onError: (
        action: focActions.LoadFocSchemesForItems,
        error: HttpErrorResponse
      ) => {
        return new focActions.LoadFocSchemesForItemsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

    // AB FOC


  @Effect()
  loadABFocSchemes$: Observable<Action> = this.dataPersistence.fetch(
    focActions.FocActionTypes.LOAD_AB_FOC_SCHEMES,
    {
      run: (action: focActions.LoadABFocSchemes) => {
        return this.focService
          .getABFOCSchemes(action.payload)
          .pipe(
            map(
              (data: any) => new focActions.LoadABFocSchemesSuccess(data)
            )
          );
      },
      onError: (
        action: focActions.LoadABFocSchemes,
        error: HttpErrorResponse
      ) => {
        return new focActions.LoadABFocSchemesFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadABFocSchemesForItems$: Observable<Action> = this.dataPersistence.fetch(
    focActions.FocActionTypes.LOAD_AB_FOC_SCHEMES_FOR_ITEMS,
    {
      run: (action: focActions.LoadABFocSchemesForItems) => {
        return this.focService
          .getABFOCSchemes(action.payload)
          .pipe(
            map(
              (data: any) => new focActions.LoadABFocSchemesForItemsSuccess(data)
            )
          );
      },
      onError: (
        action: focActions.LoadABFocSchemesForItems,
        error: HttpErrorResponse
      ) => {
        return new focActions.LoadABFocSchemesForItemsFailure(
          // this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  saveABFocSchemes$: Observable<Action> = this.dataPersistence.fetch(
    focActions.FocActionTypes.SAVE_AB_FOC_SCHEMES,
    {
      run: (action: focActions.SaveABFocSchemes) => {
        return this.focService
          .getSaveABFOCSchemes(action.payload)
          .pipe(
            map(
              (data: any) => new focActions.SaveABFocSchemesSuccess(data)
            )
          );
      },
      onError: (
        action: focActions.SaveABFocSchemes,
        error: HttpErrorResponse
      ) => {
        return new focActions.SaveABFocSchemesFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  deleteABFocSchemes$: Observable<Action> = this.dataPersistence.fetch(
    focActions.FocActionTypes.DELETE_AB_FOC_SCHEMES,
    {
      run: (action: focActions.DeleteABFocSchemes) => {
        return this.focService
          .getDeleteABFOCSchemes(action.payload)
          .pipe(
            map(
              (data: any) => new focActions.DeleteABFocSchemesSuccess(true)
            )
          );
      },
      onError: (
        action: focActions.DeleteABFocSchemes,
        error: HttpErrorResponse
      ) => {
        return new focActions.DeleteABFocSchemesFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadSelectedABFocSchemes$: Observable<Action> = this.dataPersistence.fetch(
    focActions.FocActionTypes.LOAD_SELECTED_AB_FOC_SCHEMES,
    {
      run: (action: focActions.LoadSelectedABFocSchemes) => {
        return this.focService
          .getSelectedABFOCSchemes(action.payload)
          .pipe(
            map(
              (data: any) => new focActions.LoadSelectedABFocSchemesSuccess(data)
            )
          );
      },
      onError: (
        action: focActions.LoadSelectedABFocSchemes,
        error: HttpErrorResponse
      ) => {
        return new focActions.LoadSelectedABFocSchemesFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadSelectedABFocSchemesCount$: Observable<Action> = this.dataPersistence.fetch(
    focActions.FocActionTypes.LOAD_SELECTED_AB_FOC_SCHEMES_COUNT,
    {
      run: (action: focActions.LoadSelectedABFocSchemesCount) => {
        return this.focService
          .getSelectedABFOCSchemes(action.payload)
          .pipe(
            map(
              (data: any) => new focActions.LoadSelectedABFocSchemesCountSuccess(data.length)
            )
          );
      },
      onError: (
        action: focActions.LoadSelectedABFocSchemesCount,
        error: HttpErrorResponse
      ) => {
        return new focActions.LoadSelectedABFocSchemesCountFailure(
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
