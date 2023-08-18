import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { GlBoutiqueLocationService } from './gl-boutique-location.service';
import { GlBoutiqueLocationFacade } from './+state/gl-boutique.facade';
import { GlBoutiqueLocationEffect } from './+state/gl-boutique.effects';
import {
  GlBoutiqueLocationReducer,
  GL_BTQ_LOCATION_FEATURE_KEY
} from './+state/gl-boutique.reducer';
import { SharedUtilApiServiceModule } from '@poss-web/shared/util-api-service';
import { NgModule } from '@angular/core';
@NgModule({
  imports: [
    CommonModule,
    SharedUtilApiServiceModule,
    StoreModule.forFeature(
      GL_BTQ_LOCATION_FEATURE_KEY,
      GlBoutiqueLocationReducer
    ),
    EffectsModule.forFeature([GlBoutiqueLocationEffect])
  ],
  providers: [GlBoutiqueLocationFacade, GlBoutiqueLocationService]
})
export class EpossGlBoutiqueLocationDataAccessGlBoutiqueLocationModule {}
