import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { SubBrandMasterEffect } from './+state/subbrand.effects';
import { SUB_BRAND_FEATURE_NAME, SubbrandReducer } from './+state/subbrand.reducers';
import { SubbrandFacade } from './+state/subbrand.facade';
import { SubbrandService } from './subbrand.service';

@NgModule({
  imports: [CommonModule, StoreModule.forFeature(SUB_BRAND_FEATURE_NAME, SubbrandReducer),
    EffectsModule.forFeature([SubBrandMasterEffect])],
  providers: [SubbrandFacade, SubbrandService],
})
export class SharedSubBrandDataAccessSubBrandModule { }
