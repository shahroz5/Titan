import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { map } from 'rxjs/operators';
import { DataPersistence } from '@nrwl/angular';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';

import { InventoryHomeState ,CustomErrors} from '@poss-web/shared/models';
import {
  InventoryHomeActionTypes,
  LoadSTNCount,
  LoadSTNCountSuccess,
  LoadSTNCountFailure,
  LoadSTNCountPayload,
  LoadInvoiceCount,
  LoadReceiveInvoicePayload,
  LoadInvoiceCountFailure,
  LoadInvoiceCountSuccess,
  LoadIssueSTNCount,
  LoadIssueSTNCountsPayload,
  LoadIssueSTNCountSuccess,
  LoadIssueSTNCountFailure,
} from './inventory-home.actions';
import { InventoryHomeService } from '../inventory-home.service';
import { LoggerService } from '@poss-web/shared/util-logger';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

@Injectable()
export class InventoryHomeEffects {
  constructor(
    private dataPersistence: DataPersistence<InventoryHomeState>,
    private inventoryHomeService: InventoryHomeService,
    private loggerService: LoggerService
  ) {}

  @Effect() loadStockTransferNoteCount$: Observable<
    Action
  > = this.dataPersistence.fetch(InventoryHomeActionTypes.LOAD_STN_COUNT, {
    // provides an action and the current state of the store
    run: (action: LoadSTNCount, state: InventoryHomeState) => {
      return this.inventoryHomeService
        .getSTNCount()
        .pipe(
          map((data: LoadSTNCountPayload) => new LoadSTNCountSuccess(data))
        );
    },

    onError: (action: LoadSTNCount, error: HttpErrorResponse) => {
      return new LoadSTNCountFailure(this.errorHandler(error));
    }
  });

  @Effect() loadInvoiceCount$: Observable<Action> = this.dataPersistence.fetch(
    InventoryHomeActionTypes.LOAD_INVOICE_COUNT,
    {
      // provides an action and the current state of the store
      run: (action: LoadInvoiceCount, state: InventoryHomeState) => {
        return this.inventoryHomeService
          .getReceiveInvoice()
          .pipe(
            map(
              (data: LoadReceiveInvoicePayload) =>
                new LoadInvoiceCountSuccess(data)
            )
          );
      },

      onError: (action: LoadInvoiceCount, error: HttpErrorResponse) => {
        return new LoadInvoiceCountFailure(this.errorHandler(error));
      }
    }
  );

  @Effect()
  LoadIssueStockTransferNoteCount$ = this.dataPersistence.fetch(
    InventoryHomeActionTypes.LOAD_ISSUES_COUNT,
    {
      run: (action: LoadIssueSTNCount) => {
        return this.inventoryHomeService
          .getIssueCount()
          .pipe(
            map(
              (data: LoadIssueSTNCountsPayload) =>
                new LoadIssueSTNCountSuccess(data)
            )
          );
      },
      onError: (action: LoadIssueSTNCount, error: HttpErrorResponse) => {
        return new LoadIssueSTNCountFailure(this.errorHandler(error));
      }
    }
  );

  errorHandler(error: HttpErrorResponse): CustomErrors {
    const customError: CustomErrors = CustomErrorAdaptor.fromJson(error);
    this.loggerService.error(customError);
    return customError;
  }
}
