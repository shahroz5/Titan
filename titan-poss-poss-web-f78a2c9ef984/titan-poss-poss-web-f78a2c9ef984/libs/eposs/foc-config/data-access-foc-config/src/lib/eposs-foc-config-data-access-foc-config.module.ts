import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { FocConfigurationEffect } from './+state/foc-config-effects';
import {
  focConfigurationReducer,
  focConfigurationKey
} from './+state/foc-config-reducer';
import { FocConfigService } from './foc-config.service';
import { FocConfigurationFacade } from './+state/foc-config-facade';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(focConfigurationKey, focConfigurationReducer),
    EffectsModule.forFeature([FocConfigurationEffect])
  ],
  providers: [FocConfigurationEffect, FocConfigService, FocConfigurationFacade]
})
export class EpossFocConfigDataAccessFocConfigModule {}
