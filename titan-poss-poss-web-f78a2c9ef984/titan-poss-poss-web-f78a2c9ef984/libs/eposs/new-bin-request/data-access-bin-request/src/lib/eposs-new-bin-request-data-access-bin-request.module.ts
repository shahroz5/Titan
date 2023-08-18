import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { SharedUtilApiServiceModule } from '@poss-web/shared/util-api-service';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { newBinRequesFeatureKey, InStockReducer } from './+state/in-stock.reducers';
import { InStockEffects } from './+state/in-stock.effect';
import { InStockFacade } from './+state/in-stock.facade';
import { InStockService } from './in-stock.service';

@NgModule({
  imports: [
    CommonModule,
    SharedUtilApiServiceModule,
    StoreModule.forFeature(newBinRequesFeatureKey, InStockReducer),
    EffectsModule.forFeature([InStockEffects])
  ],
  providers: [InStockFacade, InStockService]
})
export class EpossNewBinRequestDataAccessBinRequestModule {}
