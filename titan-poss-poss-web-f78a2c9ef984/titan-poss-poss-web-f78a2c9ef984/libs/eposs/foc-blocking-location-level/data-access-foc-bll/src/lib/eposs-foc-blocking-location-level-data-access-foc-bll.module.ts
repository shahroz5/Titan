import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUtilApiServiceModule } from '@poss-web/shared/util-api-service';
import { StoreModule } from '@ngrx/store';
import { FOCBLLReducer, FOC_BLL_FEATURE_KEY } from './+state/foc-bll.reducer';
import { EffectsModule } from '@ngrx/effects';
import { FOCBLLEffects } from './+state/foc-bll.effect';
import { FOCBLLFacade } from './+state/foc-bll.facade';
import { FOCBLLService } from './foc-bll.service';

@NgModule({
  imports: [
    CommonModule,
    SharedUtilApiServiceModule,
    StoreModule.forFeature(FOC_BLL_FEATURE_KEY, FOCBLLReducer),
    EffectsModule.forFeature([FOCBLLEffects])
  ],
  providers: [FOCBLLFacade, FOCBLLService]
})
export class EpossFocBlockingLocationLevelDataAccessFocBllModule {}
