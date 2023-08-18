import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedUtilApiServiceModule } from '@poss-web/shared/util-api-service';

import { CPG_PRODUCT_GROUP_CONFIG_FOR_QCGC_FEATURE_KEY, CPGProductGroupConfigForQCGCReducer } from './+state/cpg-product-group-config-for-qcgc.reducer';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { CPGProductGroupConfigForQCGCEffect } from './+state/cpg-product-group-config-for-qcgc.effect';
import { CPGProductGroupForQCGCFacade } from './+state/cpg-product-group-config-for-qcgc.facade';
import { CPGQCGCMapService } from './cpg-qcgc-map.service';

@NgModule({
  imports: [
    CommonModule,
    SharedUtilApiServiceModule,
    StoreModule.forFeature(CPG_PRODUCT_GROUP_CONFIG_FOR_QCGC_FEATURE_KEY, CPGProductGroupConfigForQCGCReducer),
    EffectsModule.forFeature([CPGProductGroupConfigForQCGCEffect])
  ],
  providers: [CPGProductGroupForQCGCFacade, CPGQCGCMapService]
})
export class SharedCpgQcgcMapDataAccessCpgQcgcMapModule { }
