import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComplexityCodeEffect } from './+state/complexity-code.effects';
import { complexityCodeReducer, complexityCodeFeatureKey } from './+state/complexity-code.reducer';
import { ComplexityCodeService } from './complexity-code.service';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { ComplexityCodeFacade } from './+state/complexity-code.facade';



@NgModule({
  imports: [CommonModule,
    EffectsModule.forFeature([ComplexityCodeEffect]),
    StoreModule.forFeature(complexityCodeFeatureKey, complexityCodeReducer)

  ],
  providers: [ComplexityCodeFacade, ComplexityCodeService]
})
export class SharedComplexityCodeDataAccessComplexityCodeModule { }
