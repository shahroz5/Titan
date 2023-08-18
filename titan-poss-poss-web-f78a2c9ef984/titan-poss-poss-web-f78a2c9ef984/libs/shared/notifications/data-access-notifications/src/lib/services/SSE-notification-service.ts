import { Inject, Injectable } from '@angular/core';
import { NotificationsFacade } from '../+state/notifications.facade';
import { EventDataInterface } from '../interfaces/event-data';
import { NotificationEventBus } from '../interfaces/notification-event-bus';
import { EventSourcePolyfill } from 'event-source-polyfill/src/eventsource.min.js';
import {
  POSS_WEB_API_URL,
  POSS_WEB_MAX_NOTIFICATION_API_CALL_COUNT
} from '@poss-web/shared/util-config';
import { getNotificationsEmitterEndPointUrl } from '@poss-web/shared/util-api-service';

@Injectable({
  providedIn: 'root'
})
export class SSENotificationService {
  private evtSource: EventSource;
  private url: string;
  private notificationEventBus: NotificationEventBus;
  private accessToken: string;
  private connectionCount = 0;
  constructor(
    private notificationsFacade: NotificationsFacade,
    @Inject(POSS_WEB_API_URL) private apiURL: string,
    @Inject(POSS_WEB_MAX_NOTIFICATION_API_CALL_COUNT)
    private notificationMaxApiCallCount: number
  ) {}

  startListeningToSSE(
    notificationEventBus: NotificationEventBus,
    accessToken: string
  ) {
    this.accessToken = accessToken;
    this.notificationEventBus = notificationEventBus;
    this.url = `${this.apiURL}${getNotificationsEmitterEndPointUrl()}`;
    // this.url = `http://localhost:5000/randomNamedEvents`;
    //this.evtSource = new EventSource(this.url);
    this.evtSource = new EventSourcePolyfill(this.url, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    this.bindEventListeners(this.evtSource, notificationEventBus);
  }

  private bindEventListeners(
    evtSource: EventSource,
    notificationEventBus: NotificationEventBus
  ) {
    const receivers = this.notificationEventBus.getAllReceivers();

    for (const key of Object.keys(receivers)) {
      this.evtSource.addEventListener(key, (e: MessageEvent) => {
        const eventData: EventDataInterface = {
          id: e.lastEventId,
          eventName: key,
          eventData: JSON.parse(e.data)
        };
        this.notificationEventBus.publish(key, eventData);
        this.notificationsFacade.setHasConnectionError(false);
      });
    }
    this.evtSource.onmessage = (e: MessageEvent) => {
      if (e.lastEventId === '-1') {
        this.evtSource.close();
      }
      const eventData: EventDataInterface = {
        id: e.lastEventId,
        eventName: 'message',
        eventData: e.data
      };
      notificationEventBus.publish('message', eventData);
    };

    this.evtSource.onerror = (e: MessageEvent) => {
      // display the error (Connecting .... in notification pop up component)
      // this.notificationsFacade.setHasConnectionError(true);
      // this.stopListeningToSSE();

      if (this.connectionCount < this.notificationMaxApiCallCount && e) {
        this.connectionCount = this.connectionCount + 1;
        this.restartListeningToSSE();
      } else {
        this.connectionCount = 0;
        this.stopListeningToSSE();
      }
    };
  }

  stopListeningToSSE() {
    this.evtSource.close();
  }

  restartListeningToSSE() {
    this.evtSource.close();
    this.notificationsFacade.clearNotification();
    this.startListeningToSSE(this.notificationEventBus, this.accessToken);
  }

  getAllNotification() {
    return this.notificationsFacade.allNotifications$;
  }

  clearNotification() {
    return this.notificationsFacade.clearNotification();
  }

  loadUpdatedNotificationList(updatedNotificationsList: EventDataInterface[]) {
    this.notificationsFacade.updateNotificationsList(updatedNotificationsList);
  }

  getHasConnectionError() {
    return this.notificationsFacade.hasConnectionError$;
  }
}
