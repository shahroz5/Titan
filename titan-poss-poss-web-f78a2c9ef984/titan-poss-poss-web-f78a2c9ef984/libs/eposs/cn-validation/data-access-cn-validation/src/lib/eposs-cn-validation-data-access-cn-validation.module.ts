import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUtilApiServiceModule } from '@poss-web/shared/util-api-service';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { CnValidationService } from './cn-validation.service';
import { CnValidationFacade } from './+state/cn-validation.facade';
import { CnValidationEffect } from './+state/cn-validation.effects';
import {
  cnValidationKey,
  cnValidationReducer
} from './+state/cn-validation.reducer';

@NgModule({
  imports: [
    CommonModule,
    SharedUtilApiServiceModule,
    StoreModule.forFeature(cnValidationKey, cnValidationReducer),
    EffectsModule.forFeature([CnValidationEffect])
  ],
  providers: [CnValidationFacade, CnValidationService]
})
export class EpossCnValidationDataAccessCnValidationModule {}
