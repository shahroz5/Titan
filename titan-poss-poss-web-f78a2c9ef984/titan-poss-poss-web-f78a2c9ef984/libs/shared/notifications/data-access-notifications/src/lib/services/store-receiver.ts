import { Injectable } from '@angular/core';
import { NotificationsFacade } from '../+state/notifications.facade';
import { EventDataInterface } from '../interfaces/event-data';

import { Receiver } from '../interfaces/receiver';

@Injectable()
export class StoreReceiver implements Receiver {
  constructor(private notificationsFacade: NotificationsFacade) {}
  receive(eventType: string, eventData: EventDataInterface) {
    this.notificationsFacade.addNotification(eventType, eventData);
  }
}
