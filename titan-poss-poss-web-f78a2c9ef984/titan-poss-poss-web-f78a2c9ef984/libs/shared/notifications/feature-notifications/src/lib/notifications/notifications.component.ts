import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { SSENotificationService } from '@poss-web/shared/notifications/data-access-notifications';
import { Subject } from 'rxjs';

@Component({
  selector: 'poss-web-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit, OnDestroy {
  notificationsCount = 0;
  notificationsList = [];
  hasConnectionError = false;
  destroy$: Subject<null> = new Subject<null>();

  constructor(
    public translate: TranslateService,
    private notificationService: SSENotificationService
  ) {}

  ngOnInit(): void {
    // this.notificationFacade
    //   .getNotificationsCount()
    //   .subscribe((notificationCount: number) => {
    //     this.notificationsCount = notificationCount;
    //   });
    this.notificationService
      .getAllNotification()
      .subscribe((notificationList: any[]) => {
        this.notificationsList = notificationList;
        this.notificationsCount = this.notificationsList.length;
      });

    this.notificationService
      .getHasConnectionError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((hasConnectionError: boolean) => {
        this.hasConnectionError = hasConnectionError;
      });
  }

  removeAllNotifications() {
    const updatedNotificationsList = [...this.notificationsList];
    updatedNotificationsList.splice(0, this.notificationsList.length);
    // this.notificationFacade.loadNotificationsCount(
    //   updatedNotificationsList.length
    // );
    this.notificationService.clearNotification();
  }

  removeNotification(index: number) {
    const updatedNotificationsList = [...this.notificationsList];
    updatedNotificationsList.splice(index, 1);
    // this.notificationFacade.loadNotificationsCount(
    //   updatedNotificationsList.length
    // );
    // this.notificationFacade.loadNotificationsList(updatedNotificationsList);
    this.notificationService.loadUpdatedNotificationList(
      updatedNotificationsList
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
