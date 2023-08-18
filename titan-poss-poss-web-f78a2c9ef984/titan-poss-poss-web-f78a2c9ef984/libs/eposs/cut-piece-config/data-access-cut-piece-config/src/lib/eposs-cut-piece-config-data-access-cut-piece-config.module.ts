import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUtilApiServiceModule } from '@poss-web/shared/util-api-service';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { CutPieceConfigEffects } from './cut-piece-config.effects';
import {
  CutPieceConfigReducer,
  CUT_PIECE_CONFIG_FEATURE_KEY
} from './cut-piece-config.reducer';
import { CutPieceConfigFacade } from './cut-piece-config.facade';
import { CutPieceConfigService } from '../cut-piece-config.service';
@NgModule({
  imports: [
    CommonModule,
    SharedUtilApiServiceModule,
    StoreModule.forFeature(CUT_PIECE_CONFIG_FEATURE_KEY, CutPieceConfigReducer),
    EffectsModule.forFeature([CutPieceConfigEffects])
  ],
  providers: [CutPieceConfigFacade, CutPieceConfigService]
})
export class EpossCutPieceConfigDataAccessCutPieceConfigModule {}
