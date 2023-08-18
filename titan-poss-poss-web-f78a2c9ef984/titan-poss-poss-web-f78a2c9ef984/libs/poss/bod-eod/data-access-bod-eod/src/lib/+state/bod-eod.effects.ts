import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { DataPersistence } from '@nrwl/angular';
import {
  BodBusinessDayResponse,
  BodBusinessDayResponseFormat,
  CustomErrors,
  EghsBodGeneratedPassword,
  EghsBodPasswordsListingResponse,
  GhsFileUploadResponse,
  MetalRatesAndGoldAvailabilityResponse,
  ServiceFileUploadResponse,
  UsersActiveSessionsResults,
  WalkInDetailsResponse
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { LoggerService } from '@poss-web/shared/util-logger';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BodEodService } from '../bod-eod.service';
import * as BodEodActions from './bod-eod.actions';
import { BodEodActionTypes } from './bod-eod.actions';
import { BodEodState } from './bod-eod.state';

@Injectable()
export class BodEodEffects {
  constructor(
    private dataPersistence: DataPersistence<BodEodState>,
    private bodEodService: BodEodService,
    private loggerService: LoggerService
  ) {}

  // BOD Related
  @Effect() previousDayEodCompleted$: Observable<
    Action
  > = this.dataPersistence.fetch(BodEodActionTypes.PREVIOUS_DAY_EOD, {
    run: (action: BodEodActions.PreviousDayEod) => {
      return this.bodEodService
        .getPreviousDayEodStatus()
        .pipe(
          map(
            (data: BodBusinessDayResponseFormat) =>
              new BodEodActions.PreviousDayEodSuccess(data)
          )
        );
    },
    onError: (
      action: BodEodActions.PreviousDayEod,
      error: HttpErrorResponse
    ) => {
      return new BodEodActions.PreviousDayEodFailure(this.errorHandler(error));
    }
  });

  @Effect() loadRateRetryAttempts$: Observable<
    Action
  > = this.dataPersistence.fetch(BodEodActionTypes.LOAD_RETRY_ATTEMPTS, {
    run: (action: BodEodActions.LoadRetryAttempts) => {
      return this.bodEodService
        .getPreviousDayEodStatus()
        .pipe(
          map(
            (data: BodBusinessDayResponseFormat) =>
              new BodEodActions.LoadRetryAttemptsSuccess(data)
          )
        );
    },
    onError: (
      action: BodEodActions.LoadRetryAttempts,
      error: HttpErrorResponse
    ) => {
      return new BodEodActions.LoadRetryAttemptsFailure(this.errorHandler(error));
    }
  });

  @Effect() startBodProcess$: Observable<Action> = this.dataPersistence.fetch(
    BodEodActionTypes.START_BOD_PROCESS,
    {
      run: (action: BodEodActions.StartBodProcess) => {
        return this.bodEodService
          .startBodProcess()
          .pipe(
            map(
              (data: number) => new BodEodActions.StartBodProcessSuccess(data)
            )
          );
      },
      onError: (
        action: BodEodActions.StartBodProcess,
        error: HttpErrorResponse
      ) => {
        return new BodEodActions.StartBodProcessFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadAvailableMetalRatesForBusinessDay$: Observable<
    Action
  > = this.dataPersistence.fetch(
    BodEodActionTypes.LOAD_AVAILABLE_METAL_RATES_FOR_BUSINESS_DAY,
    {
      run: (action: BodEodActions.LoadAvailableMetalRatesForBusinessDay) => {
        return this.bodEodService
          .getMetalRatesAndGoldRateAvailabity(action.payload)
          .pipe(
            map(
              (data: MetalRatesAndGoldAvailabilityResponse) =>
                new BodEodActions.LoadAvailableMetalRatesForBusinessDaySuccess(
                  data
                )
            )
          );
      },
      onError: (
        action: BodEodActions.LoadAvailableMetalRatesForBusinessDay,
        error: HttpErrorResponse
      ) => {
        return new BodEodActions.LoadAvailableMetalRatesForBusinessDayFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect() loadMetalRatesForBusinessDay$: Observable<
    Action
  > = this.dataPersistence.fetch(
    BodEodActionTypes.LOAD_METAL_RATES_FOR_BUSINESS_DAY,
    {
      run: (action: BodEodActions.LoadMetalRatesForBusinessDay) => {
        return this.bodEodService
          .getMetalRatesAndGoldRateAvailabityForBusinessDay(action.payload)
          .pipe(
            map(
              (data: MetalRatesAndGoldAvailabilityResponse) =>
                new BodEodActions.LoadMetalRatesForBusinessDaySuccess(data)
            )
          );
      },
      onError: (
        action: BodEodActions.LoadMetalRatesForBusinessDay,
        error: HttpErrorResponse
      ) => {
        return new BodEodActions.LoadMetalRatesForBusinessDayFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() boutiquePossBodCompleted$: Observable<
    Action
  > = this.dataPersistence.fetch(
    BodEodActionTypes.BOUTIQUE_POSS_BOD_COMPLETED,
    {
      run: (action: BodEodActions.BoutiquePossBodCompleted) => {
        return this.bodEodService
          .getBoutiquePossBodCompletionStatus(action.payload)
          .pipe(
            map(
              (data: BodBusinessDayResponse) =>
                new BodEodActions.BoutiquePossBodCompletedSuccess(data)
            )
          );
      },
      onError: (
        action: BodEodActions.BoutiquePossBodCompleted,
        error: HttpErrorResponse
      ) => {
        return new BodEodActions.BoutiquePossBodCompletedFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() ghsBodCompleted$: Observable<Action> = this.dataPersistence.fetch(
    BodEodActionTypes.GHS_BOD,
    {
      run: (action: BodEodActions.GhsBodCompleted) => {
        return this.bodEodService
          .getGhsBodCompletionStatus(action.payload)
          .pipe(
            map(
              (data: BodBusinessDayResponse) =>
                new BodEodActions.GhsBodCompletedSuccess(data)
            )
          );
      },
      onError: (
        action: BodEodActions.GhsBodCompleted,
        error: HttpErrorResponse
      ) => {
        return new BodEodActions.GhsBodCompletedFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() generatePasswordForEghsOffline$: Observable<
    Action
  > = this.dataPersistence.fetch(
    BodEodActionTypes.GENERATE_PASSWORD_FOR_EGHS_OFFLINE,
    {
      run: (action: BodEodActions.GeneratePasswordForEghsOffline) => {
        return this.bodEodService
          .generatePasswordForEghsOffline(action.payload)
          .pipe(
            map(
              (data: EghsBodGeneratedPassword) =>
                new BodEodActions.GeneratePasswordForEghsOfflineSuccess(data)
            )
          );
      },
      onError: (
        action: BodEodActions.GeneratePasswordForEghsOffline,
        error: HttpErrorResponse
      ) => {
        return new BodEodActions.GeneratePasswordForEghsOfflineFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect() loadGhsOfflineBodPasswords$: Observable<
    Action
  > = this.dataPersistence.fetch(
    BodEodActionTypes.LOAD_GHS_OFFLINE_BOD_PASSWORDS,
    {
      run: (action: BodEodActions.LoadGhsOfflineBodPasswords) => {
        return this.bodEodService
          .loadGhsOfflineBodPasswords()
          .pipe(
            map(
              (data: EghsBodPasswordsListingResponse) =>
                new BodEodActions.LoadGhsOfflineBodPasswordsSuccess(data)
            )
          );
      },
      onError: (
        action: BodEodActions.LoadGhsOfflineBodPasswords,
        error: HttpErrorResponse
      ) => {
        return new BodEodActions.LoadGhsOfflineBodPasswordsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  /*Eod Related*/
  @Effect() currentDayBod$: Observable<Action> = this.dataPersistence.fetch(
    BodEodActionTypes.CURRENT_DAY_BOD,
    {
      run: (action: BodEodActions.CurrentDayBod) => {
        return this.bodEodService
          .getCurrentDayBodStatus()
          .pipe(
            map((data: number) => new BodEodActions.CurrentDayBodSuccess(data))
          );
      },
      onError: (
        action: BodEodActions.CurrentDayBod,
        error: HttpErrorResponse
      ) => {
        return new BodEodActions.CurrentDayBodFailure(this.errorHandler(error));
      }
    }
  );

  @Effect() closedBod$: Observable<Action> = this.dataPersistence.fetch(
    BodEodActionTypes.CLOSED_BOD,
    {
      run: (action: BodEodActions.ClosedBod) => {
        return this.bodEodService
          .getClosedBod()
          .pipe(
            map((data: number) => new BodEodActions.ClosedBodSuccess(data))
          );
      },
      onError: (action: BodEodActions.ClosedBod, error: HttpErrorResponse) => {
        return new BodEodActions.ClosedBodFailure(this.errorHandler(error));
      }
    }
  );
  @Effect() startEodProcess$: Observable<Action> = this.dataPersistence.fetch(
    BodEodActionTypes.START_EOD_PROCESS,
    {
      run: (action: BodEodActions.StartEodProcess) => {
        return this.bodEodService
          .startEodProcess()
          .pipe(
            map(
              (data: number) => new BodEodActions.StartEodProcessSuccess(data)
            )
          );
      },
      onError: (
        action: BodEodActions.StartEodProcess,
        error: HttpErrorResponse
      ) => {
        return new BodEodActions.StartEodProcessFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() walkinDetailsCompleted$: Observable<
    Action
  > = this.dataPersistence.fetch(BodEodActionTypes.WALKIN_DETAILS_COMPLETED, {
    run: (action: BodEodActions.WalkinDetailsCompleted) => {
      return this.bodEodService
        .getWalkinDetailsStatus(action.payload)
        .pipe(
          map(
            (data: WalkInDetailsResponse) =>
              new BodEodActions.WalkinDetailsCompletedSuccess(data)
          )
        );
    },
    onError: (
      action: BodEodActions.WalkinDetailsCompleted,
      error: HttpErrorResponse
    ) => {
      return new BodEodActions.WalkinDetailsCompletedFailure(
        this.errorHandler(error)
      );
    }
  });

  @Effect() previousDayGHSBankDepositUpload$: Observable<
    Action
  > = this.dataPersistence.fetch(
    BodEodActionTypes.PREVIOUSDAY_GHS_BANKDEPOSIT_UPLOAD,
    {
      run: (action: BodEodActions.PreviousDayGHSBankDepositUpload) => {
        return this.bodEodService
          .getGhsBankDepositUploadStatus(action.payload)
          .pipe(
            map(
              (data: GhsFileUploadResponse) =>
                new BodEodActions.PreviousDayGHSBankDepositUploadSuccess(data)
            )
          );
      },
      onError: (
        action: BodEodActions.PreviousDayGHSBankDepositUpload,
        error: HttpErrorResponse
      ) => {
        return new BodEodActions.PreviousDayGHSBankDepositUploadFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect() previousDayBankDepositCompleted$: Observable<
    Action
  > = this.dataPersistence.fetch(
    BodEodActionTypes.PREVIOUSDAY_BANKDEPOSIT_COMPLETED,
    {
      run: (action: BodEodActions.PreviousDayBankDepositCompleted) => {
        return this.bodEodService
          .getPreviousDayBankDepositStatus(action.payload)
          .pipe(
            map(
              (data: GhsFileUploadResponse) =>
                new BodEodActions.PreviousDayBankDepositCompletedSuccess(data)
            )
          );
      },
      onError: (
        action: BodEodActions.PreviousDayBankDepositCompleted,
        error: HttpErrorResponse
      ) => {
        return new BodEodActions.PreviousDayBankDepositCompletedFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect() performRevenueCollection$: Observable<
    Action
  > = this.dataPersistence.fetch(
    BodEodActionTypes.BOUTIQUE_REVENUE_COLLECTION,
    {
      run: (action: BodEodActions.PerformRevenueCollection) => {
        return this.bodEodService
          .performRevenueCollection(action.payload)
          .pipe(
            map(
              (data: GhsFileUploadResponse) =>
                new BodEodActions.PerformRevenueCollectionSuccess(data)
            )
          );
      },
      onError: (
        action: BodEodActions.PerformRevenueCollection,
        error: HttpErrorResponse
      ) => {
        return new BodEodActions.PerformRevenueCollectionFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect() performGhsRevenueCollection$: Observable<
    Action
  > = this.dataPersistence.fetch(BodEodActionTypes.GHS_REVENUE_COLLECTION, {
    run: (action: BodEodActions.PerformGhsRevenueCollection) => {
      return this.bodEodService
        .performGhsRevenueCollection(action.payload)
        .pipe(
          map(
            (data: GhsFileUploadResponse) =>
              new BodEodActions.PerformGhsRevenueCollectionSuccess(data)
          )
        );
    },
    onError: (
      action: BodEodActions.PerformGhsRevenueCollection,
      error: HttpErrorResponse
    ) => {
      return new BodEodActions.PerformGhsRevenueCollectionFailure(
        this.errorHandler(error)
      );
    }
  });

  @Effect() performServiceRevenueCollection$: Observable<
    Action
  > = this.dataPersistence.fetch(BodEodActionTypes.SERVICE_REVENUE_COLLECTION, {
    run: (action: BodEodActions.PerformServiceRevenueCollection) => {
      return this.bodEodService
        .performServiceRevenueCollection(action.payload)
        .pipe(
          map(
            (data: ServiceFileUploadResponse) =>
              new BodEodActions.PerformServiceRevenueCollectionSuccess(data)
          )
        );
    },
    onError: (
      action: BodEodActions.PerformServiceRevenueCollection,
      error: HttpErrorResponse
    ) => {
      return new BodEodActions.PerformServiceRevenueCollectionFailure(
        this.errorHandler(error)
      );
    }
  });


  @Effect() gHSEodCompleted$: Observable<Action> = this.dataPersistence.fetch(
    BodEodActionTypes.GHS_EOD_ACTIVITY,
    {
      run: (action: BodEodActions.GHSEodCompleted) => {
        return this.bodEodService
          .performGhsEodActivity(action.payload)
          .pipe(
            map(
              (data: BodBusinessDayResponse) =>
                new BodEodActions.GHSEodCompletedSuccess(data)
            )
          );
      },
      onError: (
        action: BodEodActions.GHSEodCompleted,
        error: HttpErrorResponse
      ) => {
        return new BodEodActions.GHSEodCompletedFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect() boutiquePossEodCompleted$: Observable<
    Action
  > = this.dataPersistence.fetch(BodEodActionTypes.BOUTIQUE_POSS_EOD_ACTIVITY, {
    run: (action: BodEodActions.BoutiquePossEodCompleted) => {
      return this.bodEodService
        .performEodActivity(action.payload)
        .pipe(
          map(
            (data: number) =>
              new BodEodActions.BoutiquePossEodCompletedSuccess(data)
          )
        );
    },
    onError: (
      action: BodEodActions.BoutiquePossEodCompleted,
      error: HttpErrorResponse
    ) => {
      return new BodEodActions.BoutiquePossEodCompletedFailure(
        this.errorHandler(error)
      );
    }
  });
  @Effect() performOfflineEodGhsRevenueCollection$: Observable<
    Action
  > = this.dataPersistence.fetch(
    BodEodActionTypes.OFFLINE_GHS_EOD_REVENUE_COLLECTION,
    {
      run: (action: BodEodActions.PerformOfflineEodGhsRevenueCollection) => {
        return this.bodEodService
          .performEodOfflineGhsRevenueCollection(action.payload)
          .pipe(
            map(
              (data: { businessDate: number }) =>
                new BodEodActions.PerformOfflineEodGhsRevenueCollectionSuccess()
            )
          );
      },
      onError: (
        action: BodEodActions.PerformOfflineEodGhsRevenueCollection,
        error: HttpErrorResponse
      ) => {
        return new BodEodActions.PerformOfflineEodGhsRevenueCollectionFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  //NAP-7851
  @Effect() loadActiveUserSessions$: Observable<
    Action
  > = this.dataPersistence.fetch(BodEodActionTypes.LOAD_ACTIVE_USER_SESSIONS, {
    run: (action: BodEodActions.LoadActiveUserSessions) => {
      return this.bodEodService
        .loadActiveUserSessions()
        .pipe(
          map(
            (data: UsersActiveSessionsResults[]) =>
              new BodEodActions.LoadActiveUserSessionsSuccess(data)
          )
        );
    },
    onError: (
      action: BodEodActions.LoadActiveUserSessions,
      error: HttpErrorResponse
    ) => {
      return new BodEodActions.LoadActiveUserSessionsFailure(
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
