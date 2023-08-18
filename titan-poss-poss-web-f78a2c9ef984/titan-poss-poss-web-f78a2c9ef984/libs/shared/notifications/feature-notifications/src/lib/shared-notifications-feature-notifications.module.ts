import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { NotificationsComponent } from './notifications/notifications.component';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import {
  NotificationEventBus,
  SSENotificationService,
  StoreReceiver,
  SharedNotificationsDataAccessNotificationsModule
} from '@poss-web/shared/notifications/data-access-notifications';
import { AuthFacade } from '@poss-web/shared/auth/data-access-auth';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedNotificationsDataAccessNotificationsModule,
    SharedComponentsUiFormattersModule
  ],
  declarations: [NotificationsComponent],
  exports: [NotificationsComponent]
})
export class SharedNotificationsFeatureNotificationsModule {
  constructor(
    private sseService: SSENotificationService,
    private notificationEventBus: NotificationEventBus,
    private storeReceiver: StoreReceiver,
    private authFacade: AuthFacade
  ) {
    this.sseService.loadUpdatedNotificationList([]);
    this.notificationEventBus.subscribe('ALL-EVENTS', this.storeReceiver);
    this.notificationEventBus.subscribe(
      'bill_cancellation',
      this.storeReceiver
    );
    this.notificationEventBus.subscribe('roPayment', this.storeReceiver);
    // this.authFacade.getAccessToken().subscribe((accessToken: string) => {
    //   if (accessToken) {
    //     this.sseService.startListeningToSSE(
    //       this.notificationEventBus,
    //       accessToken
    //     );
    //   }
    // });
  }
}
