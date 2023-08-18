import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromNotifications from './+state/notifications.reducer';
import { NotificationsEffects } from './+state/notifications.effects';
import { NotificationsFacade } from './+state/notifications.facade';

import { StoreReceiver } from './services/store-receiver';
import { NotificationEventBusImp } from './services/notification-event-bus-imp';
import { NotificationEventBus } from './interfaces/notification-event-bus';
import { SharedUtilConfigModule } from '@poss-web/shared/util-config';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(
      fromNotifications.NOTIFICATIONS_FEATURE_KEY,
      fromNotifications.reducer
    ),
    EffectsModule.forFeature([NotificationsEffects]),
    SharedUtilConfigModule
  ],
  providers: [
    StoreReceiver,
    {
      provide: NotificationEventBus,
      useClass: NotificationEventBusImp
    },
    NotificationsFacade
  ],
  declarations: []
})
export class SharedNotificationsDataAccessNotificationsModule {}
