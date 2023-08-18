import { Injectable, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertPopupComponent } from './alert-popup/alert-popup.component';
import { takeUntil } from 'rxjs/operators';
import {
  AlertPopupServiceAbstraction,
  AlertPopupServiceConfig
} from '@poss-web/shared/models';
import { Subject } from 'rxjs';
@Injectable()
export class AlertPopupService implements AlertPopupServiceAbstraction {
  constructor(private dialog: MatDialog) {}
  public open(serviceConfig: AlertPopupServiceConfig): EventEmitter<boolean> {
    const destroy$ = new Subject();
    const config = {
      type: serviceConfig.type,
      message: serviceConfig.message,
      extraMessage: serviceConfig.extraMessage,
      extraMessage1: serviceConfig.extraMessage1,
      isUnipayFailure: serviceConfig.isUnipayFailure,
      unipayMsg: serviceConfig.unipayMsg
    };
    const dialogref = this.dialog.open(AlertPopupComponent, {
      width: '500px',
      height: 'auto',
      data: config,
      disableClose: true
    });
    const event = new EventEmitter<boolean>();

    dialogref
      .afterClosed()
      .pipe(takeUntil(destroy$))
      .subscribe((dailogResponse: boolean) => {
        event.emit(dailogResponse);
        destroy$.next();
        destroy$.complete();
      });

    return event;
  }
}
