import { Injectable } from '@angular/core';
import { LocationPath } from '@poss-web/shared/models';

import { Store } from '@ngrx/store';

export enum RouterActionType {
  GO = '[router] Go',
  BACK = '[router] BACK',
  FORWARD = '[router] FORWARD'
}
@Injectable()
export class RouterFacade {
  constructor(private store: Store<{}>) {}

  Go(locationPath: LocationPath) {
    this.store.dispatch({
      type: RouterActionType.GO,
      payload: locationPath
    });
  }

  back() {
    this.store.dispatch({
      type: RouterActionType.BACK
    });
  }

  forward() {
    this.store.dispatch({
      type: RouterActionType.FORWARD
    });
  }
}
