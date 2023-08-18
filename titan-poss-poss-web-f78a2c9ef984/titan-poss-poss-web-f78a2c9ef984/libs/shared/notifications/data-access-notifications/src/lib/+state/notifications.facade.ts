import { Injectable } from '@angular/core';

import { select, Store, Action } from '@ngrx/store';
import { EventDataInterface } from '../interfaces/event-data';

import {
  addNotification,
  clearNotifications,
  loadNotifications,
  setHasConnectionError
} from './notifications.actions';

import * as fromNotifications from './notifications.reducer';
import * as NotificationsSelectors from './notifications.selectors';

@Injectable()
export class NotificationsFacade {
  loaded$ = this.store.pipe(
    select(NotificationsSelectors.getNotificationsLoaded)
  );
  allNotifications$ = this.store.pipe(
    select(NotificationsSelectors.getAllNotifications)
  );
  hasConnectionError$ = this.store.pipe(
    select(NotificationsSelectors.getHasConnectionError)
  );
  selectedNotifications$ = this.store.pipe(
    select(NotificationsSelectors.getSelected)
  );

  constructor(
    private store: Store<fromNotifications.NotificationsPartialState>
  ) {}

  dispatch(action: Action) {
    this.store.dispatch(action);
  }
  addNotification(eventType: string, eventData: EventDataInterface) {
    this.dispatch(addNotification({ notifications: eventData }));
  }

  clearNotification() {
    this.dispatch(clearNotifications());
  }

  updateNotificationsList(updatedNotificationsList: EventDataInterface[]) {
    this.dispatch(
      loadNotifications({ updatedNotifications: updatedNotificationsList })
    );
  }

  setHasConnectionError(hasConnectionError: boolean) {
    this.dispatch(setHasConnectionError({ hasConnectionError }));
  }
}
