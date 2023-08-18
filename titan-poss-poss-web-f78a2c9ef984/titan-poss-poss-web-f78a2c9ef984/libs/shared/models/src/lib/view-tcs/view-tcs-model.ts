import { EventEmitter } from '@angular/core';
import { Moment } from 'moment';

export abstract class ViewTcsServiceAbstraction {
  public abstract open(serviceConfig: any): EventEmitter<any>;
}

export interface TcsRequestParam {
  id: string;
  txnType: string;
  subTxnType: string;
}

export interface TcsList {
  brandCode: string;
  ownerType: string;
  locationCode: string;
  docNo: string;
  transactionDate: Moment;
  fiscalYear: number;
  netInvoiceValue: number;
  tcsApplicableAmount: number;
  tcsPercentage: number;
  tcsAmountPaid: number;
  currentTransaction: boolean;
  tcsCollected: number;
  tcsToBeCollected: number;
}
