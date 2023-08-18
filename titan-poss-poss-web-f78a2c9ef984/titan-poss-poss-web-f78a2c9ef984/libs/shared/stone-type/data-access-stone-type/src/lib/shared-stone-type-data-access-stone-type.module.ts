import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUtilApiServiceModule } from '@poss-web/shared/util-api-service';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoneTypeEffect } from './+state/stone-type.effects';
import { StoneTypeReducer, STONE_TYPE_FEATURE_KEY } from './+state/stone-type.reducer';
import { StoneTypeFacade } from './+state/stone-type.facade';
import { StoneTypeService } from './stone-type.service';

@NgModule({
  imports: [
    CommonModule,
    SharedUtilApiServiceModule,
    StoreModule.forFeature(STONE_TYPE_FEATURE_KEY, StoneTypeReducer),
    EffectsModule.forFeature([StoneTypeEffect])
  ],
  providers: [StoneTypeFacade, StoneTypeService]
})
export class SharedStoneTypeDataAccessStoneTypeModule {}
