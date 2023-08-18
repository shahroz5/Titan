import {
  TepItemPopUpServiceAbstraction,
  OverlayNotificationServiceAbstraction
} from '@poss-web/shared/models';

import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { EventEmitter, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TepItemPopUpComponent } from './tep-item-pop-up/tep-item-pop-up.component';
import { takeUntil } from 'rxjs/operators';
@Injectable()
export class TepItemPopUpService implements TepItemPopUpServiceAbstraction {
  constructor(
    private dialog: MatDialog,
    public translateService: TranslateService,
    private overlayNotification: OverlayNotificationServiceAbstraction
  ) {}

  public open(itemObject: string): EventEmitter<any> {
    const destroy$ = new Subject();

    const dialogref = this.dialog.open(TepItemPopUpComponent, {
      // width: '977px',
      //   maxWidth: '90vw',
      autoFocus: false,
      data: itemObject
    });
    const event = new EventEmitter<any>();

    // const componentInstance = dialogref.componentInstance;

    const sub = dialogref.componentInstance.onAdd.subscribe(value => {
      // do something
      event.emit(value);
    });

    dialogref
      .afterClosed()
      .pipe(takeUntil(destroy$))
      .subscribe((dailogResponse: any) => {
        console.log('DIALOG RESPONSE :', dailogResponse);
        event.emit(dailogResponse);
        sub.unsubscribe();
        destroy$.next();
        destroy$.complete();
      });

    return event;
  }
}
