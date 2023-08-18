import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedUtilApiServiceModule } from '@poss-web/shared/util-api-service';
import {
  f2MarginReducer,
  f2MarginFeatureKey
} from './+state/f2-margin.reducer';
import { F2MarginService } from './f2-margin.service';
import { F2MarginEffect } from './+state/f2-margin.effect';
import { F2MarginFacade } from './+state/f2-margin.facade';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
@NgModule({
  imports: [
    CommonModule,
    SharedUtilApiServiceModule,
    StoreModule.forFeature(f2MarginFeatureKey, f2MarginReducer),
    EffectsModule.forFeature([F2MarginEffect])
  ],
  providers: [F2MarginFacade, F2MarginService]
})
export class SharedF2MarginDataAccessF2MarginModule {}
