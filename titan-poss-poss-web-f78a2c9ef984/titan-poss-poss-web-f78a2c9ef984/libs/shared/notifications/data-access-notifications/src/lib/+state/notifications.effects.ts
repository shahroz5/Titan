import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { fetch } from '@nrwl/angular';

import * as NotificationsActions from './notifications.actions';

@Injectable()
export class NotificationsEffects {
  loadNotifications$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotificationsActions.loadNotifications),
      fetch({
        run: action => {
          // Your custom service 'load' logic goes here. For now just return a success action...
          return NotificationsActions.loadNotificationsSuccess({
            notifications: action.updatedNotifications
          });
        },

        onError: (action, error) => {
          console.error('Error', error);
          return NotificationsActions.loadNotificationsFailure({ error });
        }
      })
    )
  );

  constructor(private actions$: Actions) {}
}
