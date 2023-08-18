import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { SharedUtilApiServiceModule } from '@poss-web/shared/util-api-service';
import { IssueTEPEffects } from './+state/stock-issue-tep-gep.effect';
import {
  tepGepFeatureKey,
  issueTEPReducer
} from './+state/stock-issue-tep-gep.reducers';
import { IssueTEPFacade } from './+state/stock-issue-tep-gep.facade';
import { StockIssueTepGepService } from './stock-issue-tep-gep.service';

@NgModule({
  imports: [
    CommonModule,
    SharedUtilApiServiceModule,
    StoreModule.forFeature(tepGepFeatureKey, issueTEPReducer),
    EffectsModule.forFeature([IssueTEPEffects])
  ],
  providers: [IssueTEPFacade, StockIssueTepGepService]
})
export class EpossStockIssueTepGepDataAccessStockIssueTepGepModule {}
