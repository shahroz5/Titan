import {
  DiscountsList,
  DiscountsSelectionServiceAbstraction,
  OverlayNotificationServiceAbstraction
} from '@poss-web/shared/models';

import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { EventEmitter, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';
import { DiscountsSelectionPopUpComponent } from './discounts-selection-pop-up/discounts-selection-pop-up.component';

@Injectable()
export class DiscountsSelectionPopUpService
  implements DiscountsSelectionServiceAbstraction {
  constructor(
    private dialog: MatDialog,
    public translateService: TranslateService,
    private overlayNotification: OverlayNotificationServiceAbstraction
  ) {}

  public open(data: DiscountsList[]): EventEmitter<any> {
    const destroy$ = new Subject();

    const dialogref = this.dialog.open(DiscountsSelectionPopUpComponent, {
      width: '950px',
      maxWidth: '90vw',
      autoFocus: false,
      data
    });
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
