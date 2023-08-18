import { EventEmitter } from '@angular/core';
import { AlertPopupTypeEnum } from '..';

export abstract class AlertPopupServiceAbstraction {
  public abstract open(
    serviceConfig: AlertPopupServiceConfig
  ): EventEmitter<boolean>;
}

export interface AlertPopupServiceConfig {
  type: AlertPopupTypeEnum;
  message: string;
  extraMessage?: string;
  extraMessage1?: string;
  isUnipayFailure?: boolean;
  unipayMsg?: string;
}
