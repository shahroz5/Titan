import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUtilApiServiceModule } from '@poss-web/shared/util-api-service';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { TAX_CLASS_FEATURE_KEY, TaxClassReducer } from './+state/tax-class.reducer';
import { TaxClassEffect } from './+state/tax-class.effect';
import { TaxClassFacade } from './+state/tax-class.facade';
import { TaxClassService } from './tax-class.service';

@NgModule({
  imports: [
    CommonModule,
    SharedUtilApiServiceModule,
    StoreModule.forFeature(TAX_CLASS_FEATURE_KEY, TaxClassReducer),
    EffectsModule.forFeature([TaxClassEffect])
  ],
  providers: [TaxClassFacade, TaxClassService]
})
export class SharedTaxClassDataAccessTaxClassModule { }
