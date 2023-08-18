import { createAction, props } from '@ngrx/store';
import { EventDataInterface } from '../interfaces/event-data';

export const loadNotifications = createAction(
  '[Notifications] Load Notifications',
  props<{ updatedNotifications?: EventDataInterface[] }>()
);

export const clearNotifications = createAction(
  '[Notifications] Clear All Notifications'
);
export const loadNotificationsSuccess = createAction(
  '[Notifications] Load Notifications Success',
  props<{ notifications: EventDataInterface[] }>()
);

export const addNotification = createAction(
  '[Notifications] Add Notifications',
  props<{ notifications: EventDataInterface }>()
);

export const loadNotificationsFailure = createAction(
  '[Notifications] Load Notifications Failure',
  props<{ error: any }>()
);

export const setHasConnectionError = createAction(
  '[Notifications] SET HAS CONNECTION ERROR',
  props<{ hasConnectionError: boolean }>()
);
