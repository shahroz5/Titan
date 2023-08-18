import { RouterStateSerializer } from '@ngrx/router-store';
import { RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { RouterStateUrl } from '@poss-web/shared/models';
import { Injectable } from '@angular/core';

@Injectable()
export class CustomSerializer implements RouterStateSerializer<RouterStateUrl> {
  serialize(routerState: RouterStateSnapshot): RouterStateUrl {
    const url = routerState.url;
    const queryParams = routerState.root.queryParams;
    let state: ActivatedRouteSnapshot = routerState.root;
    while (state.firstChild) {
      state = state.firstChild;
    }
    const data = state.data;
    const params = state.params;
    console.log(state);
    return { url, params, queryParams, data };
  }
}
