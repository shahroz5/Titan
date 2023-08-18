import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUtilApiServiceModule } from '@poss-web/shared/util-api-service';
import { LOV_MASTER_FEATURE_KEY, LovMasterReducer } from './+state/lovmaster.reducer';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { LovMasterEffect } from './+state/lovmaster.effect';
import { LovMasterFacade } from './+state/lovmaster.facade';
import { LovMasterService } from './lov-master.service';

@NgModule({
  imports: [
    CommonModule,
    SharedUtilApiServiceModule,
    StoreModule.forFeature(LOV_MASTER_FEATURE_KEY, LovMasterReducer),
    EffectsModule.forFeature([LovMasterEffect])
  ],
  providers: [LovMasterFacade, LovMasterService]
})
export class SharedListOfValuesDataAccessLovModule { }
