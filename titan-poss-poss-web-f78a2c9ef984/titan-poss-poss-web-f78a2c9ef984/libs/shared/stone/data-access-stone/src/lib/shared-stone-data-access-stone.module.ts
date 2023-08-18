import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUtilApiServiceModule } from '@poss-web/shared/util-api-service';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoneEffect } from './+state/stone.effect';
import { STONE_FEATURE_KEY, StoneReducer } from './+state/stone.reducer';
import { StoneFacade } from './+state/stone.facade';
import { StoneService } from './stone.service';

@NgModule({
  imports: [
    CommonModule,
    SharedUtilApiServiceModule,
    StoreModule.forFeature(STONE_FEATURE_KEY, StoneReducer),
    EffectsModule.forFeature([StoneEffect])
  ],
  providers: [StoneFacade, StoneService]
})
export class SharedStoneDataAccessStoneModule {}
