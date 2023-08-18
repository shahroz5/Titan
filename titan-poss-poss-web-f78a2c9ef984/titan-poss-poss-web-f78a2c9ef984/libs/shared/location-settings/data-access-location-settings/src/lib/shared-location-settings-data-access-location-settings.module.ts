import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationSettingsFacade } from './+state/location-settings.facade';
import { LocationSettingsService } from './location-settings.service';
import { StoreModule } from '@ngrx/store';
import {
  LOCATION_SETTINGS_FEATURE_KEY,
  LocationSettingsReducer
} from './+state/location-settings.reducer';
import { EffectsModule } from '@ngrx/effects';
import { LocationSettingsEffect } from './+state/location-settings.effect';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(
      LOCATION_SETTINGS_FEATURE_KEY,
      LocationSettingsReducer
    ),
    EffectsModule.forFeature([LocationSettingsEffect])
  ],
  providers: [LocationSettingsFacade, LocationSettingsService]
})
export class SharedLocationSettingsDataAccessLocationSettingsModule {}
