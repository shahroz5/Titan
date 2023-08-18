import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CorporateTownEffect } from './+state/corporate-town.effect';
import { CorporateTownReducer, CORPORATE_TOWN_FEATURE_KEY } from './+state/corporate-town.reducer';
import { CorporateTownFacade } from './+state/corporate-town.facade';
import { CorporateTownService } from './corporate-town.service';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(CORPORATE_TOWN_FEATURE_KEY, CorporateTownReducer),
    EffectsModule.forFeature([CorporateTownEffect])
  ],
  providers: [CorporateTownFacade, CorporateTownService]
})
export class SharedCorporateTownDataAccessCorporateTownModule { }
