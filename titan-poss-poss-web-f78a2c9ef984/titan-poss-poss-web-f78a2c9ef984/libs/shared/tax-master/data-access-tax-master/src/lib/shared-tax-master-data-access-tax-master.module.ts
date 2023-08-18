import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedUtilApiServiceModule } from '@poss-web/shared/util-api-service';
import { StoreModule } from '@ngrx/store';
import { TaxMasterReducer, TAX_MASTER_FEATURE_KEY } from './+state/tax-master.reducer';
import { EffectsModule } from '@ngrx/effects';
import { TaxMasterEffect } from './+state/tax-master.effect';
import { TaxMasterFacade } from './+state/tax-master.facade';
import { TaxMasterService } from './tax-master.service';

@NgModule({
  imports: [
    CommonModule,
    SharedUtilApiServiceModule,
    StoreModule.forFeature(TAX_MASTER_FEATURE_KEY, TaxMasterReducer),
    EffectsModule.forFeature([TaxMasterEffect])
  ],
  providers: [TaxMasterFacade, TaxMasterService]
})
export class SharedTaxMasterDataAccessTaxMasterModule { }
