import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUtilApiServiceModule } from '@poss-web/shared/util-api-service';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { UcpMarketCodeFactorFacade } from './+state/ucp-market-code-factor.facade';
import { UcpMarketCodeFactorService } from './ucp-market-code-factor.service';
import { UcpMarketCodeFactorEffect } from './+state/ucp-market-code-factor.effect';
import {
  ucpMarketCodeFactorFeatureKey,
  ucpMarketCodeFactorReducer
} from './+state/ucp-market-code-factor.reducer';

@NgModule({
  imports: [
    CommonModule,
    SharedUtilApiServiceModule,
    StoreModule.forFeature(
      ucpMarketCodeFactorFeatureKey,
      ucpMarketCodeFactorReducer
    ),
    EffectsModule.forFeature([UcpMarketCodeFactorEffect])
  ],
  providers: [UcpMarketCodeFactorFacade, UcpMarketCodeFactorService]
})
export class SharedUcpMarketCodeFactorDataAccessUcpMarketCodeFactorModule {}
