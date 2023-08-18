import { UserAgentService } from '../user-agent.service';
import { LoggerService } from '@poss-web/shared/util-logger';
import { DataPersistence } from '@nrwl/angular';
import { UAActionTypes } from './user-agent.actions';
import * as UAActions from './user-agent.actions';
import { Effect } from '@ngrx/effects';
import { map } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { CustomErrors, Hostname } from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { Injectable } from '@angular/core';

@Injectable()
export class UAEffects {
  constructor(
    private dataPersistence: DataPersistence<any>,
    private userAgentService: UserAgentService,
    private loggerService: LoggerService
  ) {}

  @Effect()
  getEncryptedHostName$ = this.dataPersistence.fetch(
    UAActionTypes.GET_ENCRYPTED_HOSTNAME,
    {
      run: (action: UAActions.GetEncryptedHostName) => {
        return this.userAgentService.getEncryptedHostName().pipe(
          map((encryptedData: Hostname) => {
         
            return new UAActions.GetEncryptedHostNameSuccess(encryptedData);
          })
        );
      },
      onError: (
        action: UAActions.GetEncryptedHostName,
        error: HttpErrorResponse
      ) => {
        return new UAActions.GetEncryptedHostNameFailure(
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
