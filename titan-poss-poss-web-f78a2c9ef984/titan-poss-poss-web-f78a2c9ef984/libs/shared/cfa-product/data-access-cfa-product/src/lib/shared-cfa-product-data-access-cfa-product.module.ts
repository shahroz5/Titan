import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUtilApiServiceModule } from '@poss-web/shared/util-api-service';
import {
  CFA_PRODUCT_CODE_FEATURE_KEY,
  CFAProductCodeReducer
} from './+state/cfa-product-code.reducer';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { CFAProductCodeEffects } from './+state/cfa-product-code.effects';
import { CFAProductCodeFacade } from './+state/cfa-product-code.facade';
import { CfaProductCodeService } from './cfa-product-code.service';
@NgModule({
  imports: [
    CommonModule,
    CommonModule,
    SharedUtilApiServiceModule,
    StoreModule.forFeature(CFA_PRODUCT_CODE_FEATURE_KEY, CFAProductCodeReducer),
    EffectsModule.forFeature([CFAProductCodeEffects])
  ],
  providers: [CFAProductCodeFacade, CfaProductCodeService]
})
export class SharedCfaProductDataAccessCfaProductModule {}
