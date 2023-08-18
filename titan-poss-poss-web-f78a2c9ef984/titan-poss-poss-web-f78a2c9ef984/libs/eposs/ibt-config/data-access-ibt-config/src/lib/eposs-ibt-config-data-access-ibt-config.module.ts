import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUtilApiServiceModule } from '@poss-web/shared/util-api-service';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { IbtConfigurationService } from './ibt-configuration.service';
import { IbtConfigurationFacade } from './+state/ibt-configuration.facade';
import { IbtConfigurationEffect } from './+state/ibt-configuration.effects';
import {
  ibtConfigurationKey,
  ibtConfigurationReducer
} from './+state/ibt-configuration.reducer';

@NgModule({
  imports: [
    CommonModule,
    SharedUtilApiServiceModule,
    StoreModule.forFeature(ibtConfigurationKey, ibtConfigurationReducer),
    EffectsModule.forFeature([IbtConfigurationEffect])
  ],
  providers: [IbtConfigurationFacade, IbtConfigurationService]
})
export class EpossIbtConfigDataAccessIbtConfigModule {}
