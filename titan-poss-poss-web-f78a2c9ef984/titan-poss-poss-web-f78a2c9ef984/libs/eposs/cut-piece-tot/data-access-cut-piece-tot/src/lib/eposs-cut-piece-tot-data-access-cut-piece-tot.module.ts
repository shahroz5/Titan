import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { SharedUtilApiServiceModule } from '@poss-web/shared/util-api-service';
import {
  CUTPIECETOT_FEATURE_KEY,
  CutPieceTotReducer
} from './+state/cut-piece-tot.reducer';
import { CutPieceTotEffect } from './+state/cut-piece-tot.effect';
import { CutPieceTotService } from './cut-piece-tot.service';
import { CutPieceTotFacade } from './+state/cut-piece-tot.facade';

@NgModule({
  imports: [
    CommonModule,
    SharedUtilApiServiceModule,
    StoreModule.forFeature(CUTPIECETOT_FEATURE_KEY, CutPieceTotReducer),
    EffectsModule.forFeature([CutPieceTotEffect])
  ],
  providers: [CutPieceTotFacade, CutPieceTotService]
})
export class EpossCutPieceTotDataAccessCutPieceTotModule {}
