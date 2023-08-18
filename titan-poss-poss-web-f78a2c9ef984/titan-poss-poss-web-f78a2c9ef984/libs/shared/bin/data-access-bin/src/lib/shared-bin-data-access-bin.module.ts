import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BinEffect } from './+state/bin.effect';
import { BIN_FEATURE_KEY, BinReducer } from './+state/bin.reducer';
import { BinFacade } from './+state/bin.facade';
import { BinService } from './bin.service';
import { BinGroupFacade } from '@poss-web/shared/bin-group/data-access-bin-group';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(BIN_FEATURE_KEY, BinReducer),
    EffectsModule.forFeature([BinEffect])
  ],
  providers: [BinFacade, BinGroupFacade, BinService]
})
export class SharedBinDataAccessBinModule { }
