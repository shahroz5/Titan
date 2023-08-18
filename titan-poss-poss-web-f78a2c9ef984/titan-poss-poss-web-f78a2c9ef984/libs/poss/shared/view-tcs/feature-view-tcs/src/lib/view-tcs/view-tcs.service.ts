import { takeUntil } from 'rxjs/operators';
import { Injectable, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import {
  CustomErrors,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  ViewTcsServiceAbstraction
} from '@poss-web/shared/models';
import { ViewTcsComponent } from './view-tcs.component';
import { ViewTcsFacade } from '@poss-web/poss/shared/view-tcs/data-access-view-tcs';

@Injectable()
export class ViewTcsService implements ViewTcsServiceAbstraction {
  initialTcsConfig = {
    tcsDetails: []
  };

  constructor(
    private dialog: MatDialog,
    public translateService: TranslateService,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private viewTcsFacade: ViewTcsFacade
  ) {}

  public open(serviceConfig): EventEmitter<any> {
    const destroy$ = new Subject();
    this.viewTcsFacade.loadTcsDetails(serviceConfig);
    const viewTcsConfig = this.initialTcsConfig;
    this.viewTcsFacade
      .getTcsDetails()
      .pipe(takeUntil(destroy$))
      .subscribe(res => {
        if (res) {
          viewTcsConfig.tcsDetails = res;
          if (res && this.dialog.openDialogs.length === 0) {
            const dialogref = this.dialog.open(ViewTcsComponent, {
              width: '1100px',
              maxWidth: '90vw',
              autoFocus: false,
              disableClose: true,
              data: viewTcsConfig
            });
            dialogref
              .afterClosed()
              .pipe(takeUntil(destroy$))
              .subscribe((dailogResponse: any) => {
                event.emit(dailogResponse);
                destroy$.next();
                destroy$.complete();
              });
          }
        }
      });

    const event = new EventEmitter<any>();

    this.viewTcsFacade
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
