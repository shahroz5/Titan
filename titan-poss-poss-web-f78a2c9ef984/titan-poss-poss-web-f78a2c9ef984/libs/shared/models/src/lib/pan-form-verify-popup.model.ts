import { EventEmitter } from '@angular/core';
import { AlertPopupTypeEnum } from '..';

export abstract class PanFormVerifyPopupServiceAbstraction {
  public abstract open(
    serviceConfig: PanFormVerifyPopupServiceConfig
  ): EventEmitter<boolean>;
}

export interface PanFormVerifyPopupServiceConfig {
  type: AlertPopupTypeEnum;
  id?: string;
  customerId?: number;
  customerType?: string;
  txnType?: string;
}
