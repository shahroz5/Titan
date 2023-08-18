import { Injectable } from '@angular/core';
import { LoggerService } from '@poss-web/shared/util-logger';
import { DataPersistence } from '@nrwl/angular';
import { Effect } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { UpgradeVersionActionTypes } from './upgrade-version.actions';
import * as UpgradeVersionActions from './upgrade-version.actions';
import { UpgradeVersionService } from '../upgrade-version.service';
import {
  CustomErrors,
  UpgradeVersion,
  UpgradeVersionResponse
} from '@poss-web/shared/models';
import { map } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

@Injectable()
export class UpgradeVersionEffects {
  constructor(
    private dataPersistence: DataPersistence<UpgradeVersionEffects>,
    private loggerService: LoggerService,
    private upgradeVersionService: UpgradeVersionService
  ) {}

  @Effect() getIsUpdateAvailable$: Observable<
    Action
  > = this.dataPersistence.fetch(
    UpgradeVersionActionTypes.GET_IS_UPDATE_AVAILABLE,
    {
      run: (action: UpgradeVersionActions.GetIsUpdateAvailable) => {
        return this.upgradeVersionService.getIsUpgradeAvailable().pipe(
          map((data: UpgradeVersion) => {
            return new UpgradeVersionActions.GetIsUpdateAvailableSuccess(data);
          })
        );
      },

      onError: (
        action: UpgradeVersionActions.GetIsUpdateAvailable,
        error: HttpErrorResponse
      ) => {
        return new UpgradeVersionActions.GetIsUpdateAvailableFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect() sendRequestForUpgrade$: Observable<
    Action
  > = this.dataPersistence.fetch(
    UpgradeVersionActionTypes.SEND_REQUEST_FOR_UPGRADE,
    {
      run: (action: UpgradeVersionActions.SendRequestForUpgrade) => {
        return this.upgradeVersionService.sendRequestToUpgrade().pipe(
          map((data: UpgradeVersionResponse) => {
            return new UpgradeVersionActions.SendRequestForUpgradeSuccess(data);
          })
        );
      },

      onError: (
        action: UpgradeVersionActions.SendRequestForUpgrade,
        error: HttpErrorResponse
      ) => {
        return new UpgradeVersionActions.SendRequestForUpgradeFailure(
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
