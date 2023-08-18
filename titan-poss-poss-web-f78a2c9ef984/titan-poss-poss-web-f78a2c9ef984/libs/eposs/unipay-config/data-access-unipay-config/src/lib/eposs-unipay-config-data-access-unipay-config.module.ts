import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { SharedUtilApiServiceModule } from '@poss-web/shared/util-api-service';
import { UnipayConfigurationEffect } from './+state/unipay-access-mapping.effects';
import {
  unipayConfigurationReducer,
  unipayConfigurationKey
} from './+state/unipay-access-mapping.reducers';
import { UnipayConfigurationFacade } from './+state/unipay-access-mapping.facade';
import { UnipayConfigurationService } from './unipay-config.service';

@NgModule({
  imports: [
    CommonModule,
    SharedUtilApiServiceModule,
    StoreModule.forFeature(unipayConfigurationKey, unipayConfigurationReducer),
    EffectsModule.forFeature([UnipayConfigurationEffect])
  ],
  providers: [UnipayConfigurationFacade, UnipayConfigurationService]
})
export class EpossUnipayConfigurationDataAccessUnipayConfigurationModule {}
