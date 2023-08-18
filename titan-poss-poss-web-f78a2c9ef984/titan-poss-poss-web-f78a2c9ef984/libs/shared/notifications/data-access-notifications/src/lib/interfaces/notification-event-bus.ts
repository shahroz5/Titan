import { EventDataInterface } from './event-data';
import { Receiver } from './receiver';

export abstract class NotificationEventBus{
  abstract  subscribe(notificationType: string, receiver: Receiver): void;
  abstract  unsubscribe(notificationType: string, receiver: Receiver): void;  
  abstract  publish(notificationType: string, notificationData: EventDataInterface):void;
  abstract getAllReceivers():{
    [key: string]: Receiver[];
  };
}