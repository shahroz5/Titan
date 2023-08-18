import { createReducer, on, Action } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import * as NotificationsActions from './notifications.actions';
import { EventDataInterface } from '../interfaces/event-data';

export const NOTIFICATIONS_FEATURE_KEY = 'notifications';

export interface State extends EntityState<EventDataInterface> {
  selectedId?: string | number; // which Notifications record has been selected
  loaded: boolean; // has the Notifications list been loaded
  error?: string | null; // last known error (if any)
  hasConnectionError?: boolean; // Has error in connection with server.
}

export interface NotificationsPartialState {
  readonly [NOTIFICATIONS_FEATURE_KEY]: State;
}

export const notificationsAdapter: EntityAdapter<EventDataInterface> = createEntityAdapter<
  EventDataInterface
>();

export const initialState: State = notificationsAdapter.getInitialState({
  // set initial required properties
  loaded: false,
  hasConnectionError: false,
  error: null
});

const notificationsReducer = createReducer(
  initialState,
  on(NotificationsActions.loadNotifications, state => ({
    ...state,
    loaded: false,
    error: null
    // hasConnectionError: false
  })),
  on(
    NotificationsActions.loadNotificationsSuccess,
    (state, { notifications }) =>
      notificationsAdapter.setAll(notifications, {
        ...state,
        loaded: true
        // hasConnectionError: false
      })
  ),
  on(NotificationsActions.addNotification, (state, { notifications }) =>
    notificationsAdapter.addOne(notifications, {
      ...state,
      loaded: true
      // hasConnectionError: false
    })
  ),
  on(NotificationsActions.clearNotifications, state =>
    notificationsAdapter.removeAll(state)
  ),
  on(NotificationsActions.loadNotificationsFailure, (state, { error }) => ({
    ...state,
    error
    // hasConnectionError: false
  })),
  on(
    NotificationsActions.setHasConnectionError,
    (state, { hasConnectionError }) => ({
      ...state,
      hasConnectionError
    })
  )
);

export function reducer(state: State | undefined, action: Action) {
  return notificationsReducer(state, action);
}
