import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  NOTIFICATIONS_FEATURE_KEY,
  State,
  NotificationsPartialState,
  notificationsAdapter
} from './notifications.reducer';

// Lookup the 'Notifications' feature state managed by NgRx
export const getNotificationsState = createFeatureSelector<
  NotificationsPartialState,
  State
>(NOTIFICATIONS_FEATURE_KEY);

const { selectAll, selectEntities } = notificationsAdapter.getSelectors();

export const getNotificationsLoaded = createSelector(
  getNotificationsState,
  (state: State) => state.loaded
);

export const getNotificationsError = createSelector(
  getNotificationsState,
  (state: State) => state.error
);

export const getHasConnectionError = createSelector(
  getNotificationsState,
  (state: State) => state.hasConnectionError
);

export const getAllNotifications = createSelector(
  getNotificationsState,
  (state: State) => selectAll(state)
);

export const getNotificationsEntities = createSelector(
  getNotificationsState,
  (state: State) => selectEntities(state)
);

export const getSelectedId = createSelector(
  getNotificationsState,
  (state: State) => state.selectedId
);

export const getSelected = createSelector(
  getNotificationsEntities,
  getSelectedId,
  (entities, selectedId) => selectedId && entities[selectedId]
);
