import { takeUntil } from 'rxjs/operators';
import { Injectable, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PanCardPopupComponent } from './pan-card-popup.component';

import {
  PanCardPopupAbstraction,
  CustomErrors,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType
} from '@poss-web/shared/models';
import { Subject } from 'rxjs';
import { CustomerFacade } from '@poss-web/shared/customer/data-access-customer';

@Injectable()
export class PanCardPopupService implements PanCardPopupAbstraction {
  constructor(
    private dialog: MatDialog,
    private customerFacade: CustomerFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction
  ) {}

  public open(customerId, customerType, passportId): EventEmitter<any> {
    const customData = {
      customerId: customerId,
      customerType: customerType,
      passportId: passportId ? passportId : ''
    };
    const destroy$ = new Subject();
    const dialogref = this.dialog.open(PanCardPopupComponent, {
      width: '500px',
      autoFocus: false,
      data: customData
    });
    dialogref
      .afterClosed()
      .pipe(takeUntil(destroy$))
      .subscribe((dailogResponse: any) => {
        event.emit(dailogResponse);
        destroy$.next();
        destroy$.complete();
      });

    const event = new EventEmitter<any>();
    this.customerFacade
      .getError()
      .pipe(takeUntil(destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error, destroy$);
        }
      });

    return event;
  }

  errorHandler(error: CustomErrors, destroy$: Subject<any>) {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.ERROR,
        hasClose: true,
        error: error
      })
      .events.pipe(takeUntil(destroy$))
      .subscribe();
  }
}
