import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import {
  DigitalSignatureReducer,
  digitalSignatureFeatureKey
} from './+state/digital-signature.reducer';
import { EffectsModule } from '@ngrx/effects';
import { DigitalSignatureEffects } from './+state/digital-signature.effects';
import { DigitalSignatureFacade } from './+state/digital-signature.facade';
import { DigitalSignatureService } from './digital-signature.service';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(digitalSignatureFeatureKey, DigitalSignatureReducer),
    EffectsModule.forFeature([DigitalSignatureEffects])
  ],
  providers: [DigitalSignatureFacade, DigitalSignatureService]
})
export class PossDigitalSignatureDataAccessDigitalSignatureModule {}
