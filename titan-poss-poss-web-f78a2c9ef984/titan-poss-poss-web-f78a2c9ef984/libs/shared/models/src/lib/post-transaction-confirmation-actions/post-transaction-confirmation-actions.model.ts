import { EventEmitter } from '@angular/core';

export abstract class PostTransactionConfirmationActionsServiceAbstraction {
  public abstract open(): EventEmitter<any>;
}
