import { Observable } from 'rxjs';
import { CustomErrors } from '../error.model';
import { InvoiceDeliveryTypes } from '../post-transaction-confirmation-actions/post-transaction-confirmation-actions.enum';
import {
  printDocTypeEnum,
  printFileTypeEnum,
  printTransactionTypesEnum
} from './printer.enum';

export interface PrinterConfigDetails {
  documentType: string;
  hostname: string;
  id?: string;
  isActive?: string;
  locationCode: string;
  printerName: string;
}

export interface PrinterConfigList {
  list: PrinterConfigDetails[];
  count: number;
}

export abstract class PrintingServiceAbstraction {
  public abstract loadPrintData(itemObject: any);
  public abstract getPrintError(): Observable<CustomErrors>;
  public abstract resetPrint();
  public abstract getPrinterIsLoading(): Observable<boolean>;
  public abstract getIsPrintingSuccess(): Observable<boolean>;
  public abstract getIsMailSent(): Observable<boolean>;
  public abstract loadNotificationPrint(itemObejct: any);
  public abstract getIsNotificationPrintSuccess(): Observable<boolean>;
  public abstract getIsNotificationMailSent(): Observable<boolean>;
}

export interface PrintPayload {
  doctype: printDocTypeEnum;
  transacionId?: string | number;
  transactionIds?: TransactionIdsPayload;
  transacionType: printTransactionTypesEnum;
  printFileType?: printFileTypeEnum;
  printType: string;
  reprint?: boolean;
  invoiceType?: InvoiceDeliveryTypes;
  productCode?: string;
  lastTransactionPrint?: boolean;
  customerId?: string;
}

export interface NotificationPayload {
  transacionId?: string | number;
  reprint?: boolean;
  invoiceType?: InvoiceDeliveryTypes;
}
export interface TransactionIdsPayload {
  transactionIds?: string[];
}
export interface TransactionIdsResponse {
  homeBankIds?: string[];
  nonHomeBankIds?: string[];
}
