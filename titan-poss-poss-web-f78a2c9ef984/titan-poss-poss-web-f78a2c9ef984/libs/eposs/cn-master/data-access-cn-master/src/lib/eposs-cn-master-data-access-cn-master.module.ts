import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUtilApiServiceModule } from '@poss-web/shared/util-api-service';
import { StoreModule } from '@ngrx/store';
import {
  creditNoteMasterFeatureKey,
  creditNoteMasterReducer
} from './+state/cn-master.reducer';
import { EffectsModule } from '@ngrx/effects';
import { CreditNoteMasterEffect } from './+state/cn-master.effect';
import { CnMasterService } from './cn-master.service';
import { CreditNoteMasterFacade } from './+state/cn-master.facade';

@NgModule({
  imports: [
    CommonModule,
    SharedUtilApiServiceModule,
    StoreModule.forFeature(creditNoteMasterFeatureKey, creditNoteMasterReducer),
    EffectsModule.forFeature([CreditNoteMasterEffect])
  ],
  providers: [CnMasterService, CreditNoteMasterFacade]
})
export class EpossCnMasterDataAccessCnMasterModule {}
