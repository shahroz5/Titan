import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUtilApiServiceModule } from '@poss-web/shared/util-api-service';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { updateHallmarkDetails, UpdateHallmarkReducer } from './+state/update-hallmark.reducers';
import { UpdateHallmarkEffects } from './+state/update-hallmark.effect';
import { UpdateHallmarkFacade } from './+state/update-hallmark.facade';
import { UpdateItemHallmarkDetailsService } from './update-item-hallmark-details.service';

@NgModule({
  imports: [
    CommonModule,
    SharedUtilApiServiceModule,
    StoreModule.forFeature(updateHallmarkDetails, UpdateHallmarkReducer),
    EffectsModule.forFeature([UpdateHallmarkEffects])
  ],
  providers: [UpdateHallmarkFacade, UpdateItemHallmarkDetailsService]
})
export class EpossUpdateHallmarkDataAccessUpdateHallmarkModule {}
