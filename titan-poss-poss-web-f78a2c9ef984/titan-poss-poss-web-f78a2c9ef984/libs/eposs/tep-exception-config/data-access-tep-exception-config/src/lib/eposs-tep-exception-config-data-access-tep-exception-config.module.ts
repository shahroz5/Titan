import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { TepExceptionConfigFacade } from './+state/tep-exception-config.facade';
import { TepExceptionConfigService } from './tep-exception-config.service';
import { tepExceptionConfigReducer, TEP_EXCEPTION_CONFIG_FEATURE_NAME } from './+state/tep-exception-config.reducer';
import { TepExceptionConfigEffect } from './+state/tep-exception-config.effect';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(TEP_EXCEPTION_CONFIG_FEATURE_NAME, tepExceptionConfigReducer),
    EffectsModule.forFeature([TepExceptionConfigEffect])
  ],
  providers: [TepExceptionConfigFacade, TepExceptionConfigService]
})
export class EpossTepExceptionConfigDataAccessTepExceptionConfigModule { }
