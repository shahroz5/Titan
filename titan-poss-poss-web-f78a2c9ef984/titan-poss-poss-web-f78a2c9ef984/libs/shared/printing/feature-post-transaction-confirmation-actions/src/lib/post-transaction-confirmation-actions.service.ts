import {
  PostTransactionConfirmationActionsServiceAbstraction,
  OverlayNotificationServiceAbstraction
} from '@poss-web/shared/models';

import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { EventEmitter, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PostTransactionConfirmationActionsPopUpComponent } from './post-transaction-confirmation-actions-pop-up/post-transaction-confirmation-actions-pop-up.component';
import { takeUntil } from 'rxjs/operators';
@Injectable()
export class PostTransactionConfirmationActionsService
  implements PostTransactionConfirmationActionsServiceAbstraction {
  constructor(
    private dialog: MatDialog,
    public translateService: TranslateService,
    private overlayNotification: OverlayNotificationServiceAbstraction
  ) {}

  public open(): EventEmitter<any> {
    const destroy$ = new Subject();

    const dialogref = this.dialog.open(
      PostTransactionConfirmationActionsPopUpComponent,
      {
        width: '500px',
        maxWidth: '90vw',
        autoFocus: false,
        data: null
      }
    );
    const event = new EventEmitter<any>();

    // const componentInstance = dialogref.componentInstance;

    dialogref
      .afterClosed()
      .pipe(takeUntil(destroy$))
      .subscribe((dailogResponse: any) => {
        console.log('DIALOG RESPONSE :', dailogResponse);
        event.emit(dailogResponse);
        destroy$.next();
        destroy$.complete();
      });

    return event;
  }
}
