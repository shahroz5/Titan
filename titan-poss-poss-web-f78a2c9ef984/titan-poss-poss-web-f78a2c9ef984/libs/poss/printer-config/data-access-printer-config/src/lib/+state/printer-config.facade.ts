import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { PrinterConfigurationState } from './printer-config.state';
import * as PrinterConfigActions from './printer-config.actions';
import { printerConfigurationSelectors } from './printer-config.selectors';
import {
  ConfigListingPayload,
  PrinterConfigDetails,
  SortItem
} from '@poss-web/shared/models';

/**
 * Data upload Facade for accesing Data-upload-State
 * */
@Injectable()
export class PrinterConfigurationFacade {
  constructor(private store: Store<PrinterConfigurationState>) {}

  private docType$ = this.store.select(
    printerConfigurationSelectors.selectDocTypes
  );
  private printerList$ = this.store.select(
    printerConfigurationSelectors.selectPrinterList
  );

  private printerName$ = this.store.select(
    printerConfigurationSelectors.printerNames
  );

  private totalElements$ = this.store.select(
    printerConfigurationSelectors.selectTotalElements
  );

  private hasError$ = this.store.select(
    printerConfigurationSelectors.selectHasError
  );

  private isLoading$ = this.store.select(
    printerConfigurationSelectors.selectIsLoading
  );

  getTotalElements() {
    return this.totalElements$;
  }

  getDocTypeResponse() {
    return this.docType$;
  }

  GetPrinterList() {
    return this.printerList$;
  }

  GetPrinterNames() {
    return this.printerName$;
  }

  getError() {
    return this.hasError$;
  }

  getIsLoading() {
    return this.isLoading$;
  }

  clearResponse() {
    this.store.dispatch(new PrinterConfigActions.ResetResponse());
  }

  loadPrinterList(payload: ConfigListingPayload, sortField?: SortItem) {
    this.store.dispatch(
      new PrinterConfigActions.GetPrinterList(payload, sortField)
    );
  }

  loadPrinterNameList() {
    this.store.dispatch(new PrinterConfigActions.GetPrinterNameList());
  }
  addPrinter(payload: PrinterConfigDetails) {
    this.store.dispatch(new PrinterConfigActions.AddPrinter(payload));
  }

  deletePrinter(payload: PrinterConfigDetails) {
    this.store.dispatch(new PrinterConfigActions.DeletePrinter(payload));
  }
  loadDocType() {
    this.store.dispatch(new PrinterConfigActions.GetDocType());
  }
}
