import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { SharedUtilApiServiceModule } from '@poss-web/shared/util-api-service';
import { GRNINTERBOUTIQUECONGIG_FEATURE_KEY, GrnInterboutiqueConfigReducer } from './+state/grn-interboutique-config.reducer';
import { GrnInterboutiqueConfigEffect } from './+state/grn-interboutique-config.effect';
import { GrnInterboutiqueConfigService } from './grn-interboutique-config.service';
import { GrnInterboutiqueConfigFacade } from './+state/grn-interboutique-config.facade';

@NgModule({
  imports: [
    CommonModule,
    SharedUtilApiServiceModule,
    StoreModule.forFeature(GRNINTERBOUTIQUECONGIG_FEATURE_KEY, GrnInterboutiqueConfigReducer),
    EffectsModule.forFeature([GrnInterboutiqueConfigEffect])
  ],
  providers: [GrnInterboutiqueConfigFacade, GrnInterboutiqueConfigService]
})
export class EpossGrnInterboutiqueConfigDataAccessGrnInterboutiqueConfigModule { }
