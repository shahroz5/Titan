import { Injectable, Inject } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';

import { map } from 'rxjs/operators';
import { POSS_WEB_ENABLE_LOG_ACTIONS } from '@poss-web/shared/util-config';

@Injectable()
export class AppsettingEffects {
  constructor(
    private actions$: Actions,
    @Inject(POSS_WEB_ENABLE_LOG_ACTIONS) private enableActionLogging: boolean
  ) {}
  @Effect({ dispatch: false }) actionLogger = this.actions$.pipe(
    map(action => {
      if (this.enableActionLogging) {
       
        console.log(new Date(), action.type);
      }
    })
  );
}
