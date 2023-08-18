import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { SharedUtilApiServiceModule } from '@poss-web/shared/util-api-service';
import { RivaahConfigurationEffect } from './+state/rivaah-configuration.effect';
import { RivaahConfigurationFacade } from './+state/rivaah-configuration.facade';
import {
  RivaahConfigurationFeatureKey,
  RivaahConfigurationReducer
} from './+state/rivaah-configuration.reducer';
import { RivaahConfigurationService } from './rivaah-configuration.service';

@NgModule({
  imports: [
    CommonModule,
    SharedUtilApiServiceModule,
    StoreModule.forFeature(
      RivaahConfigurationFeatureKey,
      RivaahConfigurationReducer
    ),
    EffectsModule.forFeature([RivaahConfigurationEffect])
  ],
  providers: [RivaahConfigurationService, RivaahConfigurationFacade]

})
export class EpossRivaahEligibilityConfigDataAccessRivaahConfigurationModule {}
