import { Injectable, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';

import {
  PanFormVerifyPopupServiceAbstraction,
  PanFormVerifyPopupServiceConfig
} from '@poss-web/shared/models';
import { Subject } from 'rxjs';
import { PanFormVerifyComponent } from './pan-form-verify/pan-form-verify.component';

@Injectable({
  providedIn: 'root'
})
export class PanFormVerifyPopupService implements PanFormVerifyPopupServiceAbstraction {
  constructor(private dialog: MatDialog) {}
  public open(serviceConfig: PanFormVerifyPopupServiceConfig): EventEmitter<boolean> {
    const destroy$ = new Subject();
    const config: PanFormVerifyPopupServiceConfig = {
      type: serviceConfig.type,
      customerId: serviceConfig.customerId,
      id: serviceConfig.id,
      customerType: serviceConfig.customerType,
      txnType: serviceConfig.txnType
    };
    const dialogref = this.dialog.open(PanFormVerifyComponent, {
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
