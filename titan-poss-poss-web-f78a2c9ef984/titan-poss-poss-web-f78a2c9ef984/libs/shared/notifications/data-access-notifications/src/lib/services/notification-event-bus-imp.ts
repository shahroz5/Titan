import { Injectable, InjectionToken } from '@angular/core';
import { EventDataInterface } from '../interfaces/event-data';
import { NotificationEventBus } from '../interfaces/notification-event-bus';
import { Receiver } from '../interfaces/receiver';
export let NOTIFICATION_EVENT_BUS_TOKEN = new InjectionToken<
  NotificationEventBus
>('Notification Event Bus Implement Injector');

@Injectable()
export class NotificationEventBusImp implements NotificationEventBus {
  receivers: {
    [key: string]: Receiver[];
  } = {};

  subscribe(notificationType: string, receiver: Receiver): void {
    if (!this.receivers[notificationType]) {
      this.receivers[notificationType] = [];
    }

    this.receivers[notificationType].push(receiver);
  }

  unsubscribe(notificationType: string, receiver: Receiver): void {
    if (!this.receivers[notificationType]) {
      return;
    }
    this.receivers[notificationType] = this.receivers[notificationType].filter(
      item => item !== receiver
    );
  }
  publish(notificationType: string, notificationData: EventDataInterface) {
    const receivers = this.getReceiverByNotificationType(notificationType);

    receivers.forEach(receiver =>
      receiver.receive(notificationType, notificationData)
    );
  }

  getAllReceivers(): {
    [key: string]: Receiver[];
  } {
    return this.receivers;
  }

  getReceiverByNotificationType(notificationType: string): Receiver[] {
    if (!this.receivers[notificationType]) {
      return [];
    }

    return this.receivers[notificationType];
  }
}
