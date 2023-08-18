import { EventEmitter } from '@angular/core';
import { DiscountsList } from '../..';

export abstract class DiscountsSelectionServiceAbstraction {
  public abstract open(data: DiscountsList[]): EventEmitter<any>;
}

export interface DiscountsSelectionPopUpData {
  transactionId: string;
  subTxnType: string;
  txnType: string;
}
