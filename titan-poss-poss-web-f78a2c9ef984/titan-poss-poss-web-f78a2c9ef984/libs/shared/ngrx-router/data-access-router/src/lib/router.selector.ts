import { createFeatureSelector } from '@ngrx/store';

import { RouterStateUrl } from '@poss-web/shared/models';
import * as fromRouter from '@ngrx/router-store';

export const getRouterState$ = createFeatureSelector<
  fromRouter.RouterReducerState<RouterStateUrl>
>('router');
