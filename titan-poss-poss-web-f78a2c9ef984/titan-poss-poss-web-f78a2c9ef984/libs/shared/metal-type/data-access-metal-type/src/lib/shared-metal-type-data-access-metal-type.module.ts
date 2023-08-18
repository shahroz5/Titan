import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';

import { EffectsModule } from '@ngrx/effects';
import { METAL_FEATURE_NAME, metalTypeReducer } from './+state/metal-type.reducer';
import { MetalTypeFacade } from './+state/metal-type.facade';
import { MetalTypeEffect } from './+state/metal-type.effect';
import { MetalTypeService } from './metal-type.service';

@NgModule({
  imports: [CommonModule,
    StoreModule.forFeature(METAL_FEATURE_NAME, metalTypeReducer),
    EffectsModule.forFeature([MetalTypeEffect])],
  providers: [MetalTypeFacade, MetalTypeService],
})
export class SharedMetalTypeDataAccessMetalTypeModule { }
