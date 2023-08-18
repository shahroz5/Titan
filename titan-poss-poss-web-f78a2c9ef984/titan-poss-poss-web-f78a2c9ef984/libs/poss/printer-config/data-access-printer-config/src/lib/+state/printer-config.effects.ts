import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { DataPersistence } from '@nrwl/angular';
import { map } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { LovDataService } from '@poss-web/shared/masters/data-access-masters';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { CustomErrors, Lov } from '@poss-web/shared/models';
import { PrinterConfigService } from '../printer-config.service';
import { PrinterConfigActionTypes } from './printer-config.actions';
import * as PrinterConfigActions from './printer-config.actions';
import { LoggerService } from '@poss-web/shared/util-logger';
import { PrinterService } from '@poss-web/shared/util-common';
import { ErrorEnums } from '@poss-web/shared/util-error';

@Injectable()
export class PrinterConfigEffect {
  constructor(
    public dataPersistence: DataPersistence<any>,
    public printerConfigService: PrinterConfigService,
    public loggerService: LoggerService,

    private lovService: LovDataService,
    private printer: PrinterService
  ) {}

  @Effect()
  GetPrinterList$: Observable<Action> = this.dataPersistence.fetch(
    PrinterConfigActionTypes.GET_PRINTER_LIST,
    {
      run: (action: PrinterConfigActions.GetPrinterList) => {
        return this.printerConfigService
          .printerList(action.payload, action.sortField)
          .pipe(
            map(data => new PrinterConfigActions.GetPrinterListSuccess(data))
          );
      },
      onError: (
        action: PrinterConfigActions.GetPrinterList,
        error: HttpErrorResponse
      ) => {
        return new PrinterConfigActions.GetPrinterListFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  GetPrinterNameList$: Observable<Action> = this.dataPersistence.fetch(
    PrinterConfigActionTypes.GET_PRINTER_NAME_LIST,
    {
      run: (action: PrinterConfigActions.GetPrinterNameList) => {
        return this.printer
          .getPrinterList()
          .pipe(
            map(
              data => new PrinterConfigActions.GetPrinterNameListSuccess(data)
            )
          );
      },
      onError: (
        action: PrinterConfigActions.GetPrinterNameList,
        error: HttpErrorResponse
      ) => {
        const customError: CustomErrors = {
          code: ErrorEnums.ERR_QZ_TRAY,
          message: error.message,
          error: null,
          traceId: null,
          timeStamp: null
        };
        return new PrinterConfigActions.GetPrinterNameListFailure(customError);
      }
    }
  );

  @Effect()
  getDocType$ = this.dataPersistence.fetch(
    PrinterConfigActionTypes.GET_DOC_TYPE,
    {
      run: (action: PrinterConfigActions.GetDocType) => {
        return this.lovService
          .getEngineLocationLovs('PRINT_DOC_TYPE')
          .pipe(
            map(
              (data: Lov[]) => new PrinterConfigActions.GetDocTypeSuccess(data)
            )
          );
      },
      onError: (
        action: PrinterConfigActions.GetDocType,
        error: HttpErrorResponse
      ) => {
        return new PrinterConfigActions.GetDocTypeFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  AddPrinter$: Observable<Action> = this.dataPersistence.fetch(
    PrinterConfigActionTypes.ADD_PRINTER,
    {
      run: (action: PrinterConfigActions.AddPrinter) => {
        return this.printerConfigService
          .addPrinter(action.payload)
          .pipe(map(data => new PrinterConfigActions.AddPrinterSuccess(data)));
      },
      onError: (
        action: PrinterConfigActions.AddPrinter,
        error: HttpErrorResponse
      ) => {
        return new PrinterConfigActions.AddPrinterFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  DeletePrinter$: Observable<Action> = this.dataPersistence.fetch(
    PrinterConfigActionTypes.DELETE_PRINTER,
    {
      run: (action: PrinterConfigActions.DeletePrinter) => {
        return this.printerConfigService
          .deletePrinter(action.payload)
          .pipe(
            map(data => new PrinterConfigActions.DeletePrinterSuccess(data))
          );
      },
      onError: (
        action: PrinterConfigActions.DeletePrinter,
        error: HttpErrorResponse
      ) => {
        return new PrinterConfigActions.DeletePrinterFailure(
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
