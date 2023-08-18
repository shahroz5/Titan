import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUtilApiServiceModule } from '@poss-web/shared/util-api-service';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import {
  ABRequestsReducer,
  AB__REQUESTS_FEATURE_KEY
} from './+state/ab-requests.reducer';
import { ABRequestsEffects } from './+state/ab-requests.effects';
import { AbRequestsService } from './ab-requests.service';
import { ABRequestsFacade } from './+state/ab-requests.facade';
@NgModule({
  imports: [
    CommonModule,
    SharedUtilApiServiceModule,
    StoreModule.forFeature(AB__REQUESTS_FEATURE_KEY, ABRequestsReducer),
    EffectsModule.forFeature([ABRequestsEffects])
  ],

  providers: [ABRequestsFacade, AbRequestsService]
})
export class EpossSharedAbRequestsDataAccessAbRequestsModule {}
