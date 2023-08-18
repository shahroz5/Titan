import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUtilApiServiceModule } from '@poss-web/shared/util-api-service';
import { StoreModule } from '@ngrx/store';
import { FOCBCLReducer, FOC_BCL_FEATURE_KEY } from './+state/foc-bcl.reducer';
import { EffectsModule } from '@ngrx/effects';
import { FOCBCLEffects } from './+state/foc-bcl.effect';
import { FOCBCLFacade } from './+state/foc-bcl.facade';
import { FOCBCLService } from './foc-bcl.service';
@NgModule({
  imports: [
    CommonModule,
    SharedUtilApiServiceModule,
    StoreModule.forFeature(FOC_BCL_FEATURE_KEY, FOCBCLReducer),
    EffectsModule.forFeature([FOCBCLEffects])
  ],
  providers: [FOCBCLFacade, FOCBCLService]
})
export class EpossFocBlockingCustomerLevelDataAccessFocBclModule {}
